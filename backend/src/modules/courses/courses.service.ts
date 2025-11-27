import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CourseLevel, CourseStatus, UserRole } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCourseInput } from './dto/create-course.input';
import { UpdateCourseInput } from './dto/update-course.input';

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
  constructor(private prisma: PrismaService) {}

  // ═══════════════════════════════════════════════════════════
  //                     QUERIES (READ)
  // ═══════════════════════════════════════════════════════════

  /**
   * Récupère tous les cours selon le rôle utilisateur
   */
  async findAll(userRole: UserRole, statusFilter?: CourseStatus) {
    // 🔒 USER : Seulement les cours publiés
    if (userRole === UserRole.USER) {
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
  async findOne(id: string, userRole: UserRole) {
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
              orderBy: { position: 'asc' },
            },
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundException(`Course #${id} not found`);
    }

    // 🔒 USER ne peut voir que les cours publiés
    if (
      userRole === UserRole.USER &&
      course.status !== CourseStatus.Published
    ) {
      throw new ForbiddenException('You cannot access unpublished courses');
    }

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
              orderBy: { position: 'asc' },
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

  // ═══════════════════════════════════════════════════════════
  //                    MUTATIONS (CREATE)
  // ═══════════════════════════════════════════════════════════

  /**
   * Crée un nouveau cours
   * RÈGLE : Par défaut en Draft, créateur devient propriétaire
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

    return this.prisma.course.create({
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
        level: input.level || CourseLevel.Beginner, // ✅ CORRIGÉ: Utilise l'enum au lieu de string
        status: CourseStatus.Draft, // ✅ Toujours Draft au départ
        imageUrl: input.imageUrl,
        userId,
      },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  // ═══════════════════════════════════════════════════════════
  //                    MUTATIONS (UPDATE)
  // ═══════════════════════════════════════════════════════════

  /**
   * Met à jour un cours
   * RÈGLE : Admin peut tout modifier, User seulement ses cours
   */
  async update(userId: string, userRole: UserRole, input: UpdateCourseInput) {
    const { id, ...updateData } = input; // 🆕 Extrait l'id de l'input

    // 1️⃣ Récupérer le cours
    const course = await this.prisma.course.findUnique({
      where: { id },
    });

    if (!course) {
      throw new NotFoundException(`Course #${id} not found`);
    }

    // 2️⃣ Vérifier les permissions
    await this.checkPermissions(course, userId, userRole, 'update');

    // 3️⃣ Si le titre change, régénérer le slug
    if (updateData.title && updateData.title !== course.title) {
      const newSlug = generateSlug(updateData.title);

      // Vérifier que le nouveau slug n'existe pas
      const existingCourse = await this.prisma.course.findFirst({
        where: {
          slug: newSlug,
          NOT: { id }, // Exclure le cours actuel
        },
      });

      if (existingCourse) {
        throw new BadRequestException(
          `A course with slug "${newSlug}" already exists`,
        );
      }

      updateData['slug'] = newSlug;
    }

    // 4️⃣ Mettre à jour
    return this.prisma.course.update({
      where: { id },
      data: updateData,
      include: {
        createdBy: {
          select: { id: true, name: true, email: true },
        },
        chapters: true,
      },
    });
  }

  // ═══════════════════════════════════════════════════════════
  //                    MUTATIONS (DELETE)
  // ═══════════════════════════════════════════════════════════

  /**
   * Supprime un cours
   * RÈGLE : Admin peut tout supprimer, User seulement ses cours
   */
  async deleteCourse(id: string, userId: string, userRole: UserRole) {
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
    await this.checkPermissions(course, userId, userRole, 'delete');

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

    await this.checkPermissions(course, userId, userRole, 'archive');

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

    await this.checkPermissions(course, userId, userRole, 'publish');

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
    return this.prisma.course.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        chapters: {
          orderBy: { position: 'asc' },
        },
        _count: {
          select: {
            enrollments: true,
            chapters: true,
          },
        },
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
}
