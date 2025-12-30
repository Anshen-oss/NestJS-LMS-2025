import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CourseLevel, CourseStatus, UserRole } from '@prisma/client';
import Stripe from 'stripe';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateChapterInput } from './dto/create-chapter.input';
import { CreateCourseInput } from './dto/create-course.input';
import { ReorderChaptersInput } from './dto/reorder-chapters.input';
import { ReorderLessonsInput } from './dto/reorder-lessons.input';
import { UpdateChapterInput } from './dto/update-chapter.input';
import { UpdateCourseInput } from './dto/update-course.input';
import { UpdateLessonInput } from './dto/update-lesson.input';

// Fonction helper pour convertir null en undefined pour GraphQL
function convertNullToUndefined<T>(obj: T): T {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  const result: any = Array.isArray(obj) ? [] : {};

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      result[key] = value === null ? undefined : value;
    }
  }

  return result as T;
}

// Fonction helper pour générer un slug
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Enlever les accents
    .replace(/[^a-z0-9]+/g, '-') // Remplacer les non-alphanumériques par -
    .replace(/^-+|-+$/g, ''); // Enlever les - en début/fin
}

@Injectable()
export class CoursesService {
  private stripe: Stripe;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    // Initialiser Stripe
    const stripeSecretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (!stripeSecretKey) {
      throw new Error('STRIPE_SECRET_KEY is not defined');
    }
    this.stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2025-11-17.clover',
    });
  }

  // ═══════════════════════════════════════════════════════════
  //                     QUERIES (READ)
  // ═══════════════════════════════════════════════════════════

  /**
   * Récupère tous les cours selon le rôle utilisateur
   */
  async findAll(userRole: UserRole, statusFilter?: CourseStatus) {
    // 🔒 USER : Seulement les cours publiés
    if (userRole === UserRole.STUDENT) {
      return this.prisma.course.findMany({
        where: { status: CourseStatus.Published },
        orderBy: { createdAt: 'desc' },
        include: {
          createdBy: {
            select: { id: true, name: true, email: true },
          },
        },
      });
    }

    // 👑 ADMIN/INSTRUCTOR : Tous les cours (avec filtre optionnel)
    return this.prisma.course.findMany({
      where: statusFilter ? { status: statusFilter } : {},
      orderBy: { createdAt: 'desc' },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true, role: true },
        },
        chapters: {
          // ✅ AJOUTER
          orderBy: { position: 'asc' },
        },
      },
    });
  }

  /**
   * Récupère un cours par ID avec vérification des permissions
   */
  async findOne(id: string, userRole: UserRole, userId?: string) {
    console.log('🔍 findOne called with:', { id, userRole, userId }); // ← LOG 1

    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        chapters: {
          orderBy: { position: 'asc' },
          include: {
            lessons: {
              orderBy: { order: 'asc' },
              include: userId
                ? {
                    lessonProgress: {
                      where: { userId },
                      select: { completed: true },
                    },
                  }
                : undefined,
            },
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    console.log('📚 Course loaded:', course?.title); // ← LOG 2
    console.log('📚 Has chapters:', !!course?.chapters); // ← LOG 3
    console.log('📚 userId for transformation:', userId); // ← LOG 4

    if (!course) return null;

    // @ts-ignore - Ajout dynamique du champ completed
    if (userId && course.chapters) {
      console.log('✅ Starting transformation'); // ← LOG 5
      course.chapters.forEach((chapter) => {
        console.log(`📖 Chapter: ${chapter.title}`);
        chapter.lessons?.forEach((lesson: any) => {
          console.log(`  📝 Lesson: ${lesson.title}`);
          console.log(`    lessonProgress:`, lesson.lessonProgress);
          lesson.completed = lesson.lessonProgress?.[0]?.completed || false;
          console.log(`    ✅ completed set to: ${lesson.completed}`);
        });
      });
    } else {
      console.log('❌ Transformation skipped:', {
        userId: !!userId,
        hasChapters: !!course.chapters,
      });
    }

    return course;
  }

  /**
   * 📝 Récupère un cours pour l'édition avec vérification stricte des permissions
   * - ADMIN : peut éditer tous les cours
   * - INSTRUCTOR : peut éditer seulement ses propres cours
   */
  async findOneForEdit(id: string, userId: string, userRole: UserRole) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true, role: true },
        },
        chapters: {
          orderBy: { position: 'asc' },
          include: {
            lessons: {
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundException(`Course #${id} not found`);
    }

    // 🔒 Vérification des permissions pour l'édition
    if (userRole === UserRole.STUDENT) {
      throw new ForbiddenException('Students cannot edit courses');
    }

    if (userRole === UserRole.INSTRUCTOR && course.userId !== userId) {
      throw new ForbiddenException('You can only edit your own courses');
    }

    // ✅ ADMIN peut éditer tous les cours
    // ✅ INSTRUCTOR peut éditer ses propres cours

    return course;
  }

  async findBySlug(slug: string) {
    const course = await this.prisma.course.findUnique({
      where: { slug },
      include: {
        chapters: {
          orderBy: { position: 'asc' },
          include: {
            lessons: {
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundException(`Course with slug "${slug}" not found`);
    }

    return course;
  }

  /**
   * Récupère tous les chapitres d'un cours avec leurs leçons
   */
  async getChaptersByCourse(courseId: string) {
    const chapters = await this.prisma.chapter.findMany({
      where: { courseId },
      orderBy: { position: 'asc' },
      include: {
        lessons: {
          orderBy: { order: 'asc' },
        },
        _count: {
          select: {
            lessons: true,
          },
        },
      },
    });

    // Mapper les counts
    return chapters.map((chapter) => ({
      ...chapter,
      lessonsCount: chapter._count.lessons,
    }));
  }

  // ═══════════════════════════════════════════════════════════
  //                    MUTATIONS (CREATE)
  // ═══════════════════════════════════════════════════════════

  /**
   * Crée un nouveau cours
   * RÈGLE : Par défaut en Draft, créateur devient propriétaire
   * ✨ AUTO-CRÉATION STRIPE : Si prix > 0, crée automatiquement le produit Stripe
   */
  async create(userId: string, input: CreateCourseInput) {
    // Générer un slug unique
    const slug = generateSlug(input.title);

    // Vérifier que le slug n'existe pas déjà
    const existingCourse = await this.prisma.course.findUnique({
      where: { slug },
    });

    if (existingCourse) {
      throw new BadRequestException(
        `A course with slug "${slug}" already exists`,
      );
    }

    // 1️⃣ Créer le cours dans la DB
    const course = await this.prisma.course.create({
      data: {
        title: input.title,
        slug,
        description: input.description,
        smallDescription:
          input.smallDescription || input.description.substring(0, 100),
        requirements: input.requirements,
        outcomes: input.outcomes,
        duration: input.duration,
        price: input.price,
        category: input.category || 'General',
        level: input.level || CourseLevel.Beginner,
        status: input.status || CourseStatus.Draft,
        imageUrl: input.imageUrl,
        stripePriceId: input.stripePriceId,
        userId,
      },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    // 2️⃣ Si le cours a un prix > 0, créer automatiquement le produit Stripe
    if (course.price && course.price > 0 && !course.stripePriceId) {
      try {
        console.log('🔄 Creating Stripe product for course:', course.title);

        // Créer le produit Stripe
        const product = await this.stripe.products.create({
          name: course.title,
          description: course.smallDescription || undefined,
          metadata: {
            courseId: course.id,
            slug: course.slug,
          },
        });

        console.log('✅ Stripe product created:', product.id);

        // Créer le prix Stripe
        const price = await this.stripe.prices.create({
          product: product.id,
          unit_amount: Math.round(course.price * 100), // Convertir en centimes
          currency: 'eur',
          metadata: {
            courseId: course.id,
          },
        });

        console.log('✅ Stripe price created:', price.id);

        // Mettre à jour le cours avec le stripePriceId
        const updatedCourse = await this.prisma.course.update({
          where: { id: course.id },
          data: { stripePriceId: price.id },
          include: {
            createdBy: {
              select: { id: true, name: true, email: true },
            },
          },
        });

        console.log(
          '✅ Course updated with Stripe price ID:',
          updatedCourse.stripePriceId,
        );

        return updatedCourse;
      } catch (error) {
        // ⚠️ Si Stripe échoue, le cours est quand même créé (fallback)
        console.error('⚠️ Stripe product creation failed:', error);
        console.error(
          '⚠️ Course created without Stripe integration. Please configure manually.',
        );
        // Retourner le cours sans Stripe
        return course;
      }
    }

    // 3️⃣ Retourner le cours (si pas de prix ou si stripePriceId déjà fourni)
    return course;
  }

  async createLesson(
    userId: string,
    userRole: UserRole,
    input: {
      chapterId: string;
      title: string;
      description?: string;
      content?: string;
      order?: number;
      thumbnailKey?: string;
      videoKey?: string;
      videoUrl?: string;
      externalVideoUrl?: string;
      duration?: number;
      isFree?: boolean;
    },
  ) {
    // Le reste du code identique
    const finalOrder =
      input.order ?? (await this.getNextLessonOrder(input.chapterId));

    const lesson = await this.prisma.lesson.create({
      data: {
        title: input.title,
        description: input.description,
        content: input.content,
        chapterId: input.chapterId,
        order: finalOrder,
        thumbnailKey: input.thumbnailKey,
        videoKey: input.videoKey,
        videoUrl: input.videoUrl,
        externalVideoUrl: input.externalVideoUrl,
        duration: input.duration,
        isFree: input.isFree ?? false,
      },
    });
    return convertNullToUndefined(lesson); // 🆕 CONVERSION
  }
  // ═══════════════════════════════════════════════════════════
  //                    MUTATIONS (UPDATE)
  // ═══════════════════════════════════════════════════════════

  /**
   * Met à jour un cours
   * RÈGLE : Admin peut tout modifier, User seulement ses cours
   */
  async updateCourse(
    userId: string,
    userRole: UserRole,
    input: UpdateCourseInput,
  ) {
    const { id, ...updateData } = input;

    // 1️⃣ Récupérer le cours
    const course = await this.prisma.course.findUnique({
      where: { id },
    });

    if (!course) {
      throw new NotFoundException(`Course #${id} not found`);
    }

    // 2️⃣ Vérifier les permissions
    this.checkPermissions(course, userId, userRole, 'update');

    // 3️⃣ Si le titre change, régénérer le slug
    if (updateData.title && updateData.title !== course.title) {
      const newSlug = generateSlug(updateData.title);

      // Vérifier que le nouveau slug n'existe pas
      const existingCourse = await this.prisma.course.findFirst({
        where: {
          slug: newSlug,
          NOT: { id },
        },
      });

      if (existingCourse) {
        throw new BadRequestException(
          `A course with slug "${newSlug}" already exists`,
        );
      }

      updateData['slug'] = newSlug;
    }

    // 🆕 4️⃣ Si le prix change, créer/mettre à jour le produit Stripe
    if (
      updateData.price !== undefined &&
      updateData.price !== course.price &&
      updateData.price > 0
    ) {
      try {
        console.log(
          '🔄 Price changed, updating Stripe:',
          course.price,
          '→',
          updateData.price,
        );

        if (course.stripePriceId) {
          // Si un price existe déjà, on crée un nouveau prix (les prix Stripe ne sont pas modifiables)
          const product = await this.stripe.products.retrieve(
            (await this.stripe.prices.retrieve(course.stripePriceId))
              .product as string,
          );

          const newPrice = await this.stripe.prices.create({
            product: product.id,
            unit_amount: Math.round(updateData.price * 100),
            currency: 'eur',
            metadata: {
              courseId: course.id,
            },
          });

          // Archiver l'ancien prix
          await this.stripe.prices.update(course.stripePriceId, {
            active: false,
          });

          updateData['stripePriceId'] = newPrice.id;
          console.log('✅ New Stripe price created:', newPrice.id);
        } else {
          // Pas de price existant, en créer un nouveau
          const product = await this.stripe.products.create({
            name: updateData.title || course.title,
            description:
              updateData.smallDescription ||
              course.smallDescription ||
              undefined,
            metadata: {
              courseId: course.id,
              slug: course.slug,
            },
          });

          const price = await this.stripe.prices.create({
            product: product.id,
            unit_amount: Math.round(updateData.price * 100),
            currency: 'eur',
            metadata: {
              courseId: course.id,
            },
          });

          updateData['stripePriceId'] = price.id;
          console.log('✅ Stripe product and price created:', price.id);
        }
      } catch (error) {
        console.error('⚠️ Stripe price update failed:', error);
        console.error('⚠️ Course will be updated without Stripe integration.');
        // Continue quand même la mise à jour du cours
      }
    }

    // 5️⃣ Mettre à jour
    return this.prisma.course.update({
      where: { id },
      data: updateData,
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        chapters: true,
      },
    });
  }

  async updateLesson(
    userId: string,
    userRole: UserRole,
    id: string,
    input: UpdateLessonInput,
  ) {
    const updateData = input;

    // 1️⃣ Récupérer la leçon avec son chapitre et cours

    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
      include: {
        chapter: {
          include: { course: true },
        },
      },
    });

    if (!lesson) {
      throw new NotFoundException(`Lesson #${id} not found`);
    }

    // 2️⃣ Vérifier les permissions sur le cours parent
    this.checkPermissions(lesson.chapter.course, userId, userRole, 'update');

    // 3️⃣ Mettre à jour
    const updated = await this.prisma.lesson.update({
      where: { id },
      data: updateData,
    });

    return convertNullToUndefined(updated); // 🆕 CONVERSION
  }

  // ═══════════════════════════════════════════════════════════
  //                    MUTATIONS (DELETE)
  // ═══════════════════════════════════════════════════════════

  /**
   * 🗑️ Supprime un cours avec vérification des permissions
   * - ADMIN : peut supprimer tous les cours
   * - INSTRUCTOR : peut supprimer seulement ses propres cours
   */
  async deleteCourse(id: string, userId: string, userRole: UserRole) {
    console.log('🗑️ DELETE COURSE - Start');
    console.log('courseId:', id);
    console.log('userId:', userId);
    console.log('userRole:', userRole);

    // 1️⃣ Récupérer le cours
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            enrollments: true,
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundException(`Course #${id} not found`);
    }

    // 2️⃣ Vérifier les permissions
    this.checkPermissions(course, userId, userRole, 'delete');

    // 3️⃣ RÈGLE MÉTIER : Vérifier qu'il n'y a pas d'inscriptions
    if (course._count.enrollments > 0) {
      throw new BadRequestException(
        `Cannot delete course with ${course._count.enrollments} enrollments. Archive it instead.`,
      );
    }

    // 4️⃣ Supprimer
    await this.prisma.course.delete({ where: { id } });

    return true;
  }

  async deleteLesson(userId: string, userRole: UserRole, id: string) {
    // 1️⃣ Récupérer la leçon avec son chapitre et cours
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
      include: {
        chapter: {
          include: { course: true },
        },
      },
    });

    if (!lesson) {
      throw new NotFoundException(`Lesson #${id} not found`);
    }

    // 2️⃣ Vérifier les permissions sur le cours parent
    this.checkPermissions(lesson.chapter.course, userId, userRole, 'delete');

    // 3️⃣ Supprimer la leçon
    const deleted = await this.prisma.lesson.delete({
      where: { id },
    });

    return convertNullToUndefined(deleted); // 🆕 CONVERSION
  }

  async deleteChapter(
    userId: string,
    userRole: UserRole,
    id: string,
  ): Promise<boolean> {
    // Récupérer le chapitre avec son cours
    const chapter = await this.prisma.chapter.findUnique({
      where: { id },
      include: { course: true },
    });

    if (!chapter) {
      throw new NotFoundException(`Chapter with ID ${id} not found`);
    }

    // Vérifier les permissions
    if (userRole !== UserRole.ADMIN && chapter.course.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to delete this chapter',
      );
    }

    // Supprimer le chapitre (les leçons seront supprimées en cascade)
    await this.prisma.chapter.delete({
      where: { id },
    });

    return true;
  }

  async reorderLessons(
    userId: string,
    userRole: UserRole,
    input: ReorderLessonsInput,
  ) {
    const { chapterId, lessons } = input;
    const chapter = await this.prisma.chapter.findUnique({
      where: { id: chapterId },
      include: { course: true },
    });

    if (!chapter) {
      throw new NotFoundException(`Chapter #${chapterId} not found`);
    }

    // 2️⃣ Vérifier les permissions sur le cours parent
    this.checkPermissions(chapter.course, userId, userRole, 'update');

    // 3️⃣ Mettre à jour les orders en transaction
    await this.prisma.$transaction(
      lessons.map((lesson) => {
        // ✅ CORRIGÉ : L'input envoie "position", on le map vers "order" en DB
        return this.prisma.lesson.update({
          where: { id: lesson.id },
          data: { order: lesson.position }, // ✅ position → order
        });
      }),
    );

    // 4️⃣ Retourner les leçons réorganisées
    return this.prisma.lesson.findMany({
      where: { chapterId },
      orderBy: { order: 'asc' },
    });
  }
  /**
   * Créer un chapter
   * RÈGLE : Admin peut tout supprimer, User seulement ses cours
   */
  async createChapter(
    userId: string,
    userRole: UserRole,
    input: CreateChapterInput,
  ) {
    const { courseId, position, ...chapterData } = input;

    // 1️⃣ Récupérer le cours
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException(`Course #${courseId} not found`);
    }

    // 2️⃣ Vérifier les permissions
    this.checkPermissions(course, userId, userRole, 'update');

    // 3️⃣ Si order non fournie, mettre à la fin
    let finalPosition = position;
    if (finalPosition === undefined) {
      const lastChapter = await this.prisma.chapter.findFirst({
        where: { courseId },
        orderBy: { position: 'desc' },
      });
      finalPosition = lastChapter ? lastChapter.position + 1 : 0;
    }

    // 4️⃣ Créer le chapitre
    const chapter = await this.prisma.chapter.create({
      data: {
        ...chapterData,
        courseId,
        position: finalPosition,
      },
      include: {
        // ← AJOUTE CET INCLUDE
        course: {
          select: {
            id: true,
            title: true,
          },
        },
        lessons: true,
      },
    });

    // ✅ Cast pour satisfaire TypeScript
    return chapter as any;
  }

  /**
   * Met à jour un chapter
   * RÈGLE : Admin peut tout supprimer, User seulement ses cours
   */
  async updateChapter(
    userId: string,
    userRole: UserRole,
    input: UpdateChapterInput,
  ) {
    const { id, ...updateData } = input;

    // 1️⃣ Récupérer le chapitre avec son cours
    const chapter = await this.prisma.chapter.findUnique({
      where: { id },
      include: { course: true },
    });

    if (!chapter) {
      throw new NotFoundException(`Chapter #${id} not found`);
    }

    // 2️⃣ Vérifier les permissions sur le cours parent
    this.checkPermissions(chapter.course, userId, userRole, 'update');

    // 3️⃣ Mettre à jour
    return this.prisma.chapter.update({
      where: { id },
      data: updateData,
    });
  }

  async reorderChapters(
    userId: string,
    userRole: UserRole,
    input: ReorderChaptersInput,
  ) {
    const { courseId, chapters } = input;

    // 1️⃣ Récupérer le cours
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException(`Course #${courseId} not found`);
    }

    // 2️⃣ Vérifier les permissions
    this.checkPermissions(course, userId, userRole, 'update');

    // 3️⃣ Mettre à jour les orders en transaction
    await this.prisma.$transaction(
      chapters.map((chapter) =>
        this.prisma.chapter.update({
          where: { id: chapter.id },
          data: { position: chapter.position },
        }),
      ),
    );

    // 4️⃣ Retourner les chapitres réorganisés
    return this.prisma.chapter.findMany({
      where: { courseId },
      orderBy: { position: 'asc' },
    });
  }

  // ═══════════════════════════════════════════════════════════
  //                  MÉTHODES ADDITIONNELLES
  // ═══════════════════════════════════════════════════════════

  /**
   * Archive un cours (soft delete)
   * RÈGLE : Admin peut tout archiver, User seulement ses cours
   */
  async archive(id: string, userId: string, userRole: UserRole) {
    const course = await this.prisma.course.findUnique({
      where: { id },
    });

    if (!course) {
      throw new NotFoundException(`Course #${id} not found`);
    }

    this.checkPermissions(course, userId, userRole, 'archive');

    return this.prisma.course.update({
      where: { id },
      data: { status: CourseStatus.Archived },
    });
  }

  /**
   * Publie un cours
   * RÈGLE : Admin peut publier n'importe quel cours, User seulement les siens
   */
  async publish(id: string, userId: string, userRole: UserRole) {
    const course = await this.prisma.course.findUnique({
      where: { id },
    });

    if (!course) {
      throw new NotFoundException(`Course #${id} not found`);
    }

    this.checkPermissions(course, userId, userRole, 'publish');

    return this.prisma.course.update({
      where: { id },
      data: {
        status: CourseStatus.Published,
        publishedAt: new Date(), // ✅ MAINTENANT disponible dans le schéma
      },
    });
  }

  /**
   * Récupère les cours créés par un utilisateur (Instructor)
   */
  async getMyCourses(userId: string) {
    // Récupérer l'utilisateur pour vérifier son rôle
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    // Si ADMIN, retourner TOUS les cours
    if (user?.role === 'ADMIN') {
      return this.prisma.course.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          chapters: {
            orderBy: { position: 'asc' },
          },
          enrollments: true,
        },
      });
    }

    // Si INSTRUCTOR, retourner seulement ses cours
    return this.prisma.course.findMany({
      where: {
        userId: userId,
      },
      orderBy: { createdAt: 'desc' },
      include: {
        chapters: {
          orderBy: { position: 'asc' },
        },
        enrollments: true,
      },
    });
  }

  // ═══════════════════════════════════════════════════════════
  //                     HELPER METHODS
  // ═══════════════════════════════════════════════════════════

  /**
   * Vérifie les permissions pour une action sur un cours
   * @private
   */
  private checkPermissions(
    course: { userId: string },
    userId: string,
    userRole: UserRole,
    action: 'update' | 'delete' | 'archive' | 'publish',
  ) {
    // 👑 ADMIN peut tout faire
    if (userRole === UserRole.ADMIN) {
      return; // ✅ Autorisé
    }

    // 🔒 USER ne peut modifier que ses propres cours
    if (course.userId !== userId) {
      throw new ForbiddenException(
        `You are not authorized to ${action} this course. Only the course owner or an admin can ${action} it.`,
      );
    }

    // ✅ Le cours appartient à l'utilisateur
    return;
  }

  private async getNextLessonOrder(chapterId: string): Promise<number> {
    const lastLesson = await this.prisma.lesson.findFirst({
      where: { chapterId },
      orderBy: { order: 'desc' },
    });
    return lastLesson ? lastLesson.order + 1 : 0;
  }
}
