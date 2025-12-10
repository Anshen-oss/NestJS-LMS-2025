import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProgressService {
  constructor(private prisma: PrismaService) {}

  /**
   * Toggle le statut de complétion d'une leçon
   */
  async toggleLessonCompletion(userId: string, lessonId: string) {
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
      throw new NotFoundException('Lesson not found');
    }

    // Vérifier que l'utilisateur est inscrit au cours
    const enrollment = await this.prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId: lesson.chapter.courseId,
        },
      },
    });

    if (!enrollment) {
      throw new NotFoundException('Not enrolled in this course');
    }

    // Trouver ou créer le progress
    const existingProgress = await this.prisma.lessonProgress.findUnique({
      where: {
        userId_lessonId: { userId, lessonId },
      },
    });

    if (existingProgress) {
      // Toggle le statut
      return this.prisma.lessonProgress.update({
        where: { id: existingProgress.id },
        data: {
          completed: !existingProgress.completed,
          completedAt: !existingProgress.completed ? new Date() : null,
        },
      });
    } else {
      // Créer comme complété
      return this.prisma.lessonProgress.create({
        data: {
          userId,
          lessonId,
          courseId: lesson.chapter.courseId,
          completed: true,
          completedAt: new Date(),
        },
      });
    }
  }

  /**
   * Récupère la progression d'un utilisateur pour un cours
   */
  async getCourseProgress(userId: string, courseId: string) {
    // Récupérer toutes les leçons du cours avec chapters
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: {
        chapters: {
          include: {
            lessons: true,
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    // Compter le total de leçons
    const totalLessons = course.chapters.reduce(
      (sum, chapter) => sum + chapter.lessons.length,
      0,
    );

    if (totalLessons === 0) {
      return { completedCount: 0, totalCount: 0, percentage: 0 };
    }

    // Récupérer toutes les leçons complétées
    // On utilise les IDs de lessons au lieu de courseId direct
    const lessonIds = course.chapters.flatMap((ch) =>
      ch.lessons.map((l) => l.id),
    );

    const completedLessons = await this.prisma.lessonProgress.count({
      where: {
        userId,
        lessonId: { in: lessonIds },
        completed: true,
      },
    });

    return {
      completedCount: completedLessons,
      totalCount: totalLessons,
      percentage: Math.round((completedLessons / totalLessons) * 100),
    };
  }

  /**
   * Récupère le statut de complétion d'une leçon
   */
  async getLessonProgress(userId: string, lessonId: string) {
    return this.prisma.lessonProgress.findUnique({
      where: {
        userId_lessonId: { userId, lessonId },
      },
    });
  }
}
