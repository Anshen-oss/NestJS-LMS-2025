import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Lesson, LessonAttachment, UserRole } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { S3Service } from '../s3/s3.service'; // 🆕 Import S3Service
import { CreateLessonInput } from './dto/create-lesson.input';
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

@Injectable()
export class LessonsService {
  constructor(
    private prisma: PrismaService,
    private s3Service: S3Service, // 🆕 Injection S3Service
  ) {}

  // ═══════════════════════════════════════════════════════════
  //                     QUERIES (READ)
  // ═══════════════════════════════════════════════════════════

  /**
   * Récupère toutes les leçons d'un chapitre
   */
  async findAllByChapter(chapterId: string, userId?: string) {
    const lessons = await this.prisma.lesson.findMany({
      where: { chapterId },
      orderBy: { order: 'asc' },
      include: {
        chapter: {
          include: {
            course: {
              select: { id: true, status: true, userId: true },
            },
          },
        },
      },
    });

    // Si userId fourni, inclure la progression
    if (userId) {
      const lessonsWithProgress = await Promise.all(
        lessons.map(async (lesson) => {
          const progress = await this.prisma.lessonProgress.findUnique({
            where: {
              userId_lessonId: {
                userId,
                lessonId: lesson.id,
              },
            },
          });

          return {
            ...lesson,
            completed: progress?.completed ?? false,
            completedAt: progress?.completedAt ?? null,
          };
        }),
      );

      return lessonsWithProgress;
    }

    return lessons;
  }

  /**
   * Récupère une leçon par ID
   */
  async findOne(id: string, userId?: string, userRole?: UserRole) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
      include: {
        chapter: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
                status: true,
                userId: true,
              },
            },
          },
        },
      },
    });

    if (!lesson) {
      throw new NotFoundException(`Lesson #${id} not found`);
    }

    // 🔒 Vérifier les permissions d'accès
    await this.checkAccessPermissions(lesson, userId, userRole);

    // Inclure la progression si userId fourni
    if (userId) {
      const progress = await this.prisma.lessonProgress.findUnique({
        where: {
          userId_lessonId: {
            userId,
            lessonId: id,
          },
        },
      });

      return convertNullToUndefined({
        ...lesson,
        completed: progress?.completed ?? false,
        completedAt: progress?.completedAt ?? null,
      });
    }

    return convertNullToUndefined(lesson);
  }

  // ═══════════════════════════════════════════════════════════
  //                    MUTATIONS (CREATE)
  // ═══════════════════════════════════════════════════════════

  /**
   * Crée une nouvelle leçon
   * RÈGLE : Seulement l'instructeur du cours ou un admin
   */
  async create(
    chapterId: string,
    input: CreateLessonInput,
    userId: string,
    userRole: UserRole,
  ) {
    // 1️⃣ Vérifier que le chapitre existe
    const chapter = await this.prisma.chapter.findUnique({
      where: { id: chapterId },
      include: {
        course: true,
      },
    });

    if (!chapter) {
      throw new NotFoundException(`Chapter #${chapterId} not found`);
    }

    // 2️⃣ Vérifier les permissions
    if (userRole !== UserRole.ADMIN && chapter.course.userId !== userId) {
      throw new ForbiddenException(
        'Only the course owner or an admin can add lessons',
      );
    }

    // 3️⃣ Déterminer la position (utilise order maintenant)
    const order = input.order ?? (await this.getNextOrder(chapterId));

    // 4️⃣ Créer la leçon
    const lesson = await this.prisma.lesson.create({
      data: {
        title: input.title,
        description: input.description,
        content: input.content, // 🆕 Ajout du content
        order,
        thumbnailKey: input.thumbnailKey,
        videoKey: input.videoKey, // 🆕 videoKey
        videoUrl: input.videoUrl, // 🆕 videoUrl
        externalVideoUrl: input.externalVideoUrl,
        duration: input.duration,
        isFree: input.isFree ?? false,
        chapterId,
      },
      include: {
        chapter: {
          include: {
            course: {
              select: { id: true, title: true },
            },
          },
        },
      },
    });
    return convertNullToUndefined(lesson);
  }

  // ═══════════════════════════════════════════════════════════
  //                    MUTATIONS (UPDATE)
  // ═══════════════════════════════════════════════════════════

  /**
   * Met à jour une leçon
   * RÈGLE : Seulement l'instructeur du cours ou un admin
   * 🆕 Gère automatiquement la suppression de l'ancienne vidéo si changement
   */
  async update(
    id: string,
    input: UpdateLessonInput,
    userId: string,
    userRole: UserRole,
  ) {
    // 1️⃣ Récupérer la leçon avec le cours
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
      include: {
        chapter: {
          include: {
            course: true,
          },
        },
      },
    });

    if (!lesson) {
      throw new NotFoundException(`Lesson #${id} not found`);
    }

    // 2️⃣ Vérifier les permissions
    if (
      userRole !== UserRole.ADMIN &&
      lesson.chapter.course.userId !== userId
    ) {
      throw new ForbiddenException(
        'Only the course owner or an admin can update this lesson',
      );
    }

    // 🆕 3️⃣ Gérer la suppression de l'ancienne vidéo si changement
    if (input.videoUrl !== undefined && lesson.videoKey) {
      const isRemovingVideo = !input.videoUrl;
      const isChangingVideo =
        input.videoUrl && input.videoUrl !== lesson.videoUrl;
      const isSwitchingToExternal = input.externalVideoUrl && !input.videoUrl;

      if (isRemovingVideo || isChangingVideo || isSwitchingToExternal) {
        try {
          await this.s3Service.deleteVideo(lesson.videoKey);
          console.log(`✅ Ancienne vidéo supprimée: ${lesson.videoKey}`);
        } catch (error) {
          console.error(
            `⚠️ Erreur suppression vidéo ${lesson.videoKey}:`,
            error.message,
          );
        }
      }
    }

    // 🆕 Si on passe à une URL externe, vider videoUrl et videoKey
    if (input.externalVideoUrl && !input.videoUrl) {
      input.videoUrl = '';
      input.videoKey = '';
    }

    // 4️⃣ Mettre à jour
    const updated = await this.prisma.lesson.update({
      where: { id },
      data: input,
      include: {
        chapter: {
          include: {
            course: {
              select: { id: true, title: true },
            },
          },
        },
      },
    });
    return convertNullToUndefined(updated);
  }

  // ═══════════════════════════════════════════════════════════
  //                    MUTATIONS (DELETE)
  // ═══════════════════════════════════════════════════════════

  /**
   * Supprime une leçon
   * RÈGLE : Seulement l'instructeur du cours ou un admin
   * 🆕 Supprime automatiquement la vidéo de S3 si elle existe
   */
  async delete(id: string, userId: string, userRole: UserRole) {
    // 1️⃣ Récupérer la leçon
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
      include: {
        chapter: {
          include: {
            course: true,
          },
        },
      },
    });

    if (!lesson) {
      throw new NotFoundException(`Lesson #${id} not found`);
    }

    // 2️⃣ Vérifier les permissions
    if (
      userRole !== UserRole.ADMIN &&
      lesson.chapter.course.userId !== userId
    ) {
      throw new ForbiddenException(
        'Only the course owner or an admin can delete this lesson',
      );
    }

    // 🆕 3️⃣ Supprimer la vidéo de S3 si elle existe
    if (lesson.videoKey) {
      try {
        await this.s3Service.deleteVideo(lesson.videoKey);
        console.log(`✅ Vidéo supprimée de S3: ${lesson.videoKey}`);
      } catch (error) {
        console.error(
          `⚠️ Erreur suppression vidéo ${lesson.videoKey}:`,
          error.message,
        );
        // On continue quand même la suppression de la lesson
      }
    }

    // 4️⃣ Supprimer la lesson de la DB (cascade sur lessonProgress)
    const deletedLesson = await this.prisma.lesson.delete({ where: { id } });

    // 5️⃣ Réorganiser les positions des leçons restantes
    await this.reorderLessons(lesson.chapterId);

    return convertNullToUndefined(deletedLesson);
  }

  // ═══════════════════════════════════════════════════════════
  //              PROGRESSION (LESSON PROGRESS)
  // ═══════════════════════════════════════════════════════════

  async updateLessonContent(
    lessonId: string,
    content?: string,
    isPublished?: boolean,
  ): Promise<Lesson> {
    console.log('📦 lessonId:', lessonId);
    console.log('📦 content:', content);
    console.log('📦 isPublished:', isPublished);

    // 1. Vérifier que la lesson existe
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
    });

    if (!lesson) {
      console.log('❌ Lesson not found');
      throw new NotFoundException(`lesson with ID ${lessonId} not found`);
    }

    // 2. Construire l'objet de mise à jour
    const updateData = {
      ...(content !== undefined && { content }),
      ...(isPublished !== undefined && { isPublished }),
      updatedAt: new Date(),
    };

    console.log('📝 Update data:', updateData);

    // 3. Mettre à jour
    const updated = await this.prisma.lesson.update({
      where: { id: lessonId },
      data: updateData,
    });

    console.log('✅ Lesson mise à jour avec succès');
    // 🆕 Convertir null en undefined pour GraphQL
    return convertNullToUndefined(updated);
  }

  /**
   * Marque une leçon comme complétée
   * ⚠️ NOTE : Cette méthode est maintenant gérée par ProgressService
   * Elle est gardée pour compatibilité, mais redirige vers le nouveau système
   */
  async markAsCompleted(lessonId: string, userId: string) {
    // Vérifier que la leçon existe et récupérer le courseId
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        chapter: {
          select: { courseId: true },
        },
      },
    });

    if (!lesson) {
      throw new NotFoundException(`Lesson #${lessonId} not found`);
    }

    // Créer ou mettre à jour la progression avec le nouveau modèle
    return this.prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId,
          lessonId,
        },
      },
      update: {
        completed: true,
        completedAt: new Date(),
      },
      create: {
        userId,
        lessonId,
        courseId: lesson.chapter.courseId,
        completed: true,
        completedAt: new Date(),
      },
    });
  }

  /**
   * ⚠️ DEPRECATED : Cette méthode est obsolète avec le nouveau modèle
   * Le nouveau système ne track plus la durée de visionnage
   * Utilise plutôt toggleLessonCompletion du ProgressService
   */
  async updateProgress(
    lessonId: string,
    userId: string,
    watchedDuration: number,
  ) {
    console.warn(
      '⚠️ updateProgress is deprecated. Use ProgressService.toggleLessonCompletion instead',
    );

    // Vérifier que la leçon existe
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        chapter: {
          select: { courseId: true },
        },
      },
    });

    if (!lesson) {
      throw new NotFoundException(`Lesson #${lessonId} not found`);
    }

    // Simplification : on marque juste comme complété si >= 90%
    const isCompleted = lesson.duration
      ? watchedDuration >= lesson.duration * 0.9
      : false;

    if (isCompleted) {
      return this.prisma.lessonProgress.upsert({
        where: {
          userId_lessonId: {
            userId,
            lessonId,
          },
        },
        update: {
          completed: true,
          completedAt: new Date(),
        },
        create: {
          userId,
          lessonId,
          courseId: lesson.chapter.courseId,
          completed: true,
          completedAt: new Date(),
        },
      });
    }

    // Si pas complété, ne rien faire (on ne track plus watchedDuration)
    return null;
  }

  /**
   * Récupère la progression d'un utilisateur pour un cours
   */
  async getCourseProgress(courseId: string, userId: string) {
    // Récupérer toutes les leçons du cours
    const chapters = await this.prisma.chapter.findMany({
      where: { courseId },
      include: {
        lessons: {
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { position: 'asc' },
    });

    const allLessons = chapters.flatMap((chapter) => chapter.lessons);
    const totalLessons = allLessons.length;

    if (totalLessons === 0) {
      return {
        totalLessons: 0,
        completedLessons: 0,
        progressPercentage: 0,
      };
    }

    // Compter les leçons complétées
    const completedCount = await this.prisma.lessonProgress.count({
      where: {
        userId,
        lessonId: { in: allLessons.map((l) => l.id) },
        completed: true,
      },
    });

    return {
      totalLessons,
      completedLessons: completedCount,
      progressPercentage: Math.round((completedCount / totalLessons) * 100),
    };
  }

  /**
   * Récupère une lesson pour l'édition (sans checks d'enrollment)
   * Vérifie seulement que l'utilisateur est propriétaire ou admin
   */
  async findOneForEdit(id: string, userId: string, userRole: UserRole) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
      include: {
        chapter: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
                userId: true,
              },
            },
          },
        },
      },
    });

    if (!lesson) {
      throw new NotFoundException(`Lesson #${id} not found`);
    }

    // Vérifier que l'utilisateur a le droit d'éditer
    const isAdmin = userRole === UserRole.ADMIN;
    const isOwner = lesson.chapter.course.userId === userId;

    if (!isAdmin && !isOwner) {
      throw new ForbiddenException(
        'You do not have permission to edit this lesson',
      );
    }

    return convertNullToUndefined(lesson);
  }

  // ═══════════════════════════════════════════════════════════
  //                     HELPER METHODS
  // ═══════════════════════════════════════════════════════════

  /**
   * Obtient la prochaine position disponible dans un chapitre
   */
  private async getNextOrder(chapterId: string): Promise<number> {
    const lastLesson = await this.prisma.lesson.findFirst({
      where: { chapterId },
      orderBy: { order: 'desc' },
    });

    return lastLesson ? lastLesson.order + 1 : 0;
  }

  /**
   * Réorganise les positions des leçons après une suppression
   */
  private async reorderLessons(chapterId: string): Promise<void> {
    const lessons = await this.prisma.lesson.findMany({
      where: { chapterId },
      orderBy: { order: 'asc' },
    });

    // Réattribuer les positions de manière séquentielle (0, 1, 2...)
    await Promise.all(
      lessons.map((lesson, index) =>
        this.prisma.lesson.update({
          where: { id: lesson.id },
          data: { order: index },
        }),
      ),
    );
  }

  /**
   * Vérifie les permissions d'accès à une leçon
   */
  private async checkAccessPermissions(
    lesson: any,
    userId?: string,
    userRole?: UserRole,
  ): Promise<void> {
    const course = lesson.chapter.course;

    // 👑 Admin peut tout voir
    if (userRole === UserRole.ADMIN) {
      return;
    }

    // 🎓 Propriétaire du cours peut tout voir
    if (userId && course.userId === userId) {
      return;
    }

    // 🆓 Leçon gratuite accessible à tous
    if (lesson.isFree) {
      return;
    }

    // 🔒 Cours non publié accessible seulement au propriétaire
    if (course.status !== 'Published') {
      throw new ForbiddenException('This course is not published yet');
    }

    // 🔒 Leçon payante : vérifier l'inscription
    if (userId) {
      const enrollment = await this.prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId,
            courseId: course.id,
          },
        },
      });

      if (!enrollment || enrollment.status !== 'Active') {
        throw new ForbiddenException(
          'You must enroll in this course to access this lesson',
        );
      }

      return;
    }

    // Pas d'userId fourni et leçon payante
    throw new ForbiddenException(
      'You must be logged in and enrolled to access this lesson',
    );
  }

  // ═══════════════════════════════════════════════════════════
  //                    ATTACHMENTS
  // ═══════════════════════════════════════════════════════════

  // Créer un attachement
  async createAttachment(
    lessonId: string,
    fileName: string,
    fileUrl: string,
    fileSize: number,
    fileType: string,
  ): Promise<LessonAttachment> {
    return await this.prisma.lessonAttachment.create({
      data: {
        lessonId,
        fileName,
        fileUrl,
        fileSize,
        fileType,
      },
    });
  }

  // Lister les attachements d'une lesson
  async getAttachments(lessonId: string): Promise<LessonAttachment[]> {
    return this.prisma.lessonAttachment.findMany({
      where: { lessonId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Supprimer un attachement
  async deleteAttachment(id: string): Promise<boolean> {
    await this.prisma.lessonAttachment.delete({
      where: { id },
    });
    return true;
  }
}
