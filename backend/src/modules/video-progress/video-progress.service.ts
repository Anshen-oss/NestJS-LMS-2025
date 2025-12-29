import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SaveVideoProgressInput } from './dto/save-video-progress.input';
import { VideoProgress } from './entities/video-progress.entity';

@Injectable()
export class VideoProgressService {
  constructor(private prisma: PrismaService) {}

  /**
   * 📊 Récupérer la progression vidéo d'une leçon spécifique pour un utilisateur
   */
  async getProgress(
    userId: string,
    lessonId: string,
  ): Promise<VideoProgress | null> {
    return this.prisma.videoProgress.findUnique({
      where: {
        userId_lessonId: { userId, lessonId },
      },
      include: {
        user: true,
        lesson: true,
      },
    });
  }

  /**
   * 📊 Récupérer toutes les progressions vidéo d'un utilisateur
   * Triées par dernière activité (récemment regardé en premier)
   */
  async getUserProgress(userId: string): Promise<any[]> {
    return this.prisma.videoProgress.findMany({
      where: { userId },
      include: {
        lesson: {
          include: {
            chapter: {
              include: {
                course: true,
              },
            },
          },
        },
      },
      orderBy: { lastWatchedAt: 'desc' },
    });
  }

  /**
   * 💾 Sauvegarder ou mettre à jour la progression vidéo
   * - Calcule automatiquement le pourcentage
   * - Auto-complétion à 90%
   * - Met à jour LessonProgress si complétion atteinte
   */
  async saveProgress(
    userId: string,
    input: SaveVideoProgressInput,
  ): Promise<VideoProgress> {
    const { lessonId, currentTime, duration } = input;

    // 🧮 Calculer le pourcentage de progression
    const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

    // 🎯 Déterminer si la vidéo est complétée (>= 90%)
    const isCompleted = progressPercent >= 90;
    const completedAt = isCompleted ? new Date() : null;

    // 💾 Upsert : créer ou mettre à jour la progression vidéo
    const videoProgress = await this.prisma.videoProgress.upsert({
      where: {
        userId_lessonId: { userId, lessonId },
      },
      update: {
        currentTime,
        duration,
        progressPercent,
        isCompleted,
        completedAt: isCompleted ? completedAt : undefined,
        lastWatchedAt: new Date(), // 🔄 Met à jour "dernière activité"
      },
      create: {
        userId,
        lessonId,
        currentTime,
        duration,
        progressPercent,
        isCompleted,
        completedAt,
        lastWatchedAt: new Date(),
      },
      include: {
        user: true,
        lesson: true,
      },
    });

    // ✅ Si vidéo complétée à 90%, mettre à jour LessonProgress
    if (isCompleted) {
      await this.updateLessonProgress(userId, lessonId);
    }

    return videoProgress;
  }

  /**
   * ✅ Mettre à jour LessonProgress quand la vidéo est complétée
   * (appelé automatiquement par saveProgress)
   */
  private async updateLessonProgress(
    userId: string,
    lessonId: string,
  ): Promise<void> {
    // Récupérer le courseId depuis la lesson
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

    const courseId = lesson.chapter.courseId;

    // Upsert LessonProgress
    await this.prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: { userId, lessonId },
      },
      update: {
        completed: true,
        completedAt: new Date(),
      },
      create: {
        userId,
        lessonId,
        courseId,
        completed: true,
        completedAt: new Date(),
      },
    });
  }

  /**
   * ✅ Marquer manuellement une leçon comme complétée
   * (alternative si l'utilisateur veut forcer la complétion)
   */
  async markCompleted(
    userId: string,
    lessonId: string,
  ): Promise<VideoProgress> {
    const progress = await this.getProgress(userId, lessonId);

    if (!progress) {
      throw new NotFoundException(
        'Video progress not found. User must watch the video first.',
      );
    }

    // Mettre à jour VideoProgress
    const updatedProgress = await this.prisma.videoProgress.update({
      where: {
        userId_lessonId: { userId, lessonId },
      },
      data: {
        isCompleted: true,
        completedAt: new Date(),
        progressPercent: 100,
      },
      include: {
        user: true,
        lesson: true,
      },
    });

    // Mettre à jour LessonProgress aussi
    await this.updateLessonProgress(userId, lessonId);

    return updatedProgress;
  }

  /**
   * 🗑️ Supprimer la progression vidéo (reset)
   */
  async deleteProgress(userId: string, lessonId: string): Promise<boolean> {
    try {
      await this.prisma.videoProgress.delete({
        where: {
          userId_lessonId: { userId, lessonId },
        },
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}
