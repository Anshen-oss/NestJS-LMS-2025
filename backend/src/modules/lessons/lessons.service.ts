import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Lesson, UserRole } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateLessonInput } from './dto/create-lesson.input';
import { UpdateLessonInput } from './dto/update-lesson.input';

@Injectable()
export class LessonsService {
  constructor(private prisma: PrismaService) {}

  // ═══════════════════════════════════════════════════════════
  //                     QUERIES (READ)
  // ═══════════════════════════════════════════════════════════

  /**
   * Récupère toutes les leçons d'un chapitre
   */
  async findAllByChapter(chapterId: string, userId?: string) {
    const lessons = await this.prisma.lesson.findMany({
      where: { chapterId },
      orderBy: { position: 'asc' },
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
            isCompleted: progress?.isCompleted ?? false,
            watchedDuration: progress?.watchedDuration ?? 0,
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

      return {
        ...lesson,
        isCompleted: progress?.isCompleted ?? false,
        watchedDuration: progress?.watchedDuration ?? 0,
        completedAt: progress?.completedAt,
      };
    }

    return lesson;
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

    // 3️⃣ Déterminer la position
    const position = input.position ?? (await this.getNextPosition(chapterId));

    // 4️⃣ Créer la leçon
    return this.prisma.lesson.create({
      data: {
        title: input.title,
        description: input.description,
        position,
        thumbnailKey: input.thumbnailKey,
        videoKey: input.videoKey,
        videoUrl: input.videoUrl,
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
  }

  // ═══════════════════════════════════════════════════════════
  //                    MUTATIONS (UPDATE)
  // ═══════════════════════════════════════════════════════════

  /**
   * Met à jour une leçon
   * RÈGLE : Seulement l'instructeur du cours ou un admin
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

    // 3️⃣ Mettre à jour
    return this.prisma.lesson.update({
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
  }

  // ═══════════════════════════════════════════════════════════
  //                    MUTATIONS (DELETE)
  // ═══════════════════════════════════════════════════════════

  /**
   * Supprime une leçon
   * RÈGLE : Seulement l'instructeur du cours ou un admin
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

    // 3️⃣ Supprimer
    await this.prisma.lesson.delete({ where: { id } });

    // 4️⃣ Réorganiser les positions des leçons restantes
    await this.reorderLessons(lesson.chapterId);

    return true;
  }

  async updateLessonContent(
    lessonId: string,
    content?: string,
    isPublished?: boolean,
  ): Promise<Lesson> {
    // 1. Vérifier que la lesson existe
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
    });

    if (!lesson) {
      throw new NotFoundException(`lesson with ID ${lessonId} not found`);
    }
    // 2. Mettre à jour uniquement les champs fournis
    return this.prisma.lesson.update({
      where: { id: lessonId },
      data: {
        ...(content !== undefined && {
          content,
        }),
        ...(isPublished !== undefined && {
          isPublished,
        }),
        updatedAt: new Date(),
      },
    });
  }
  // ═══════════════════════════════════════════════════════════
  //              PROGRESSION (LESSON PROGRESS)
  // ═══════════════════════════════════════════════════════════

  /**
   * Marque une leçon comme complétée
   */
  async markAsCompleted(lessonId: string, userId: string) {
    // Vérifier que la leçon existe
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
    });

    if (!lesson) {
      throw new NotFoundException(`Lesson #${lessonId} not found`);
    }

    // Créer ou mettre à jour la progression
    return this.prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId,
          lessonId,
        },
      },
      update: {
        isCompleted: true,
        completedAt: new Date(),
      },
      create: {
        userId,
        lessonId,
        isCompleted: true,
        completedAt: new Date(),
      },
    });
  }

  /**
   * Met à jour la progression de visionnage (durée regardée)
   */
  async updateProgress(
    lessonId: string,
    userId: string,
    watchedDuration: number,
  ) {
    // Vérifier que la leçon existe
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
    });

    if (!lesson) {
      throw new NotFoundException(`Lesson #${lessonId} not found`);
    }

    // Auto-compléter si l'utilisateur a regardé >= 90% de la vidéo
    const isCompleted = lesson.duration
      ? watchedDuration >= lesson.duration * 0.9
      : false;

    return this.prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId,
          lessonId,
        },
      },
      update: {
        watchedDuration,
        lastWatchedAt: new Date(),
        isCompleted: isCompleted || undefined, // Ne changer que si true
        completedAt: isCompleted ? new Date() : undefined,
      },
      create: {
        userId,
        lessonId,
        watchedDuration,
        lastWatchedAt: new Date(),
        isCompleted,
        completedAt: isCompleted ? new Date() : null,
      },
    });
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
          orderBy: { position: 'asc' },
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
        isCompleted: true,
      },
    });

    return {
      totalLessons,
      completedLessons: completedCount,
      progressPercentage: Math.round((completedCount / totalLessons) * 100),
    };
  }

  // ═══════════════════════════════════════════════════════════
  //                     HELPER METHODS
  // ═══════════════════════════════════════════════════════════

  /**
   * Obtient la prochaine position disponible dans un chapitre
   */
  private async getNextPosition(chapterId: string): Promise<number> {
    const lastLesson = await this.prisma.lesson.findFirst({
      where: { chapterId },
      orderBy: { position: 'desc' },
    });

    return lastLesson ? lastLesson.position + 1 : 1;
  }

  /**
   * Réorganise les positions des leçons après une suppression
   */
  private async reorderLessons(chapterId: string): Promise<void> {
    const lessons = await this.prisma.lesson.findMany({
      where: { chapterId },
      orderBy: { position: 'asc' },
    });

    // Réattribuer les positions de manière séquentielle
    await Promise.all(
      lessons.map((lesson, index) =>
        this.prisma.lesson.update({
          where: { id: lesson.id },
          data: { position: index + 1 },
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
}
