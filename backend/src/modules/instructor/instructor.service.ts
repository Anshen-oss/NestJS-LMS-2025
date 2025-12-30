import { Injectable, NotFoundException } from '@nestjs/common';
import { CourseStatus, EnrollmentStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CoursePerformanceOutput } from './dto/course-performance.output';
import { InstructorStatsOutput } from './dto/instructor-stats.output';
import {
  ActivityType,
  RecentActivityOutput,
} from './dto/recent-activity.output';

@Injectable()
export class InstructorService {
  constructor(private prisma: PrismaService) {}

  // ═══════════════════════════════════════════════════════════
  //                  INSTRUCTOR STATS (Dashboard)
  // ═══════════════════════════════════════════════════════════

  /**
   * Récupère les statistiques globales d'un instructeur
   * @param instructorId - ID de l'instructeur
   */
  async getInstructorStats(
    instructorId: string,
  ): Promise<InstructorStatsOutput> {
    // Récupérer tous les cours de l'instructeur
    const courses = await this.prisma.course.findMany({
      where: { userId: instructorId },
      include: {
        enrollments: {
          where: { status: EnrollmentStatus.Active },
        },
        chapters: {
          include: {
            lessons: true,
          },
        },
      },
    });

    // Calculer les stats des cours
    const totalCourses = courses.length;
    const publishedCourses = courses.filter(
      (c) => c.status === CourseStatus.Published,
    ).length;
    const draftCourses = courses.filter(
      (c) => c.status === CourseStatus.Draft,
    ).length;
    const archivedCourses = courses.filter(
      (c) => c.status === CourseStatus.Archived,
    ).length;

    // Calculer les stats des étudiants
    const allEnrollments = courses.flatMap((c) => c.enrollments);
    const uniqueStudentIds = new Set(allEnrollments.map((e) => e.userId));
    const totalStudents = uniqueStudentIds.size;

    // Étudiants actifs (ont une progression dans les 30 derniers jours)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const activeStudentsCount = await this.prisma.lessonProgress.findMany({
      where: {
        courseId: { in: courses.map((c) => c.id) },
        updatedAt: { gte: thirtyDaysAgo },
      },
      select: { userId: true },
      distinct: ['userId'],
    });
    const activeStudents = activeStudentsCount.length;

    // Calculer les revenus
    const totalRevenue = allEnrollments.reduce((sum, e) => sum + e.amount, 0);

    // Revenue du mois en cours
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const monthlyEnrollments = allEnrollments.filter(
      (e) => e.createdAt >= startOfMonth,
    );
    const monthlyRevenue = monthlyEnrollments.reduce(
      (sum, e) => sum + e.amount,
      0,
    );

    // Vues (on utilise le nombre d'enrollments comme proxy)
    // TODO: Implémenter un vrai système de tracking de vues
    const totalViews = allEnrollments.length;

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const weeklyViews = allEnrollments.filter(
      (e) => e.createdAt >= oneWeekAgo,
    ).length;

    // Calculer le taux de complétion moyen
    let averageCompletionRate = 0;
    if (courses.length > 0) {
      const completionRates = await Promise.all(
        courses.map(async (course) => {
          const totalLessons = course.chapters.reduce(
            (sum, chapter) => sum + chapter.lessons.length,
            0,
          );

          if (totalLessons === 0) return 0;

          // Compter les leçons complétées pour ce cours
          const completedLessons = await this.prisma.lessonProgress.count({
            where: {
              courseId: course.id,
              completed: true,
            },
          });

          // Nombre d'étudiants inscrits
          const studentsCount = course.enrollments.length || 1;

          // Taux de complétion = (leçons complétées) / (leçons totales * étudiants)
          return (completedLessons / (totalLessons * studentsCount)) * 100;
        }),
      );

      averageCompletionRate =
        completionRates.reduce((sum, rate) => sum + rate, 0) /
        completionRates.length;
    }

    return {
      totalCourses,
      publishedCourses,
      draftCourses,
      archivedCourses,
      totalStudents,
      activeStudents,
      totalRevenue,
      monthlyRevenue,
      totalViews,
      weeklyViews,
      averageCompletionRate: Math.round(averageCompletionRate * 10) / 10, // Arrondir à 1 décimale
      averageRating: null, // TODO: Implémenter le système de notation
    };
  }

  // ═══════════════════════════════════════════════════════════
  //                  COURSE PERFORMANCE
  // ═══════════════════════════════════════════════════════════

  /**
   * Récupère les performances de tous les cours d'un instructeur
   * @param instructorId - ID de l'instructeur
   * @param status - Filtre optionnel par statut
   */
  async getInstructorCourses(
    instructorId: string,
    status?: CourseStatus,
  ): Promise<CoursePerformanceOutput[]> {
    const courses = await this.prisma.course.findMany({
      where: {
        userId: instructorId,
        ...(status && { status }),
      },
      include: {
        enrollments: {
          where: { status: EnrollmentStatus.Active },
        },
        chapters: {
          include: {
            lessons: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Calculer les performances pour chaque cours
    const performances = await Promise.all(
      courses.map(async (course) => {
        const studentsCount = course.enrollments.length;
        const revenue = course.enrollments.reduce(
          (sum, e) => sum + e.amount,
          0,
        );

        // Étudiants actifs (progression récente)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const activeStudentsCount = await this.prisma.lessonProgress.findMany({
          where: {
            courseId: course.id,
            updatedAt: { gte: thirtyDaysAgo },
          },
          select: { userId: true },
          distinct: ['userId'],
        });

        // Calculer le taux de complétion
        const totalLessons = course.chapters.reduce(
          (sum, chapter) => sum + chapter.lessons.length,
          0,
        );

        let completionRate = 0;
        if (totalLessons > 0 && studentsCount > 0) {
          const completedLessons = await this.prisma.lessonProgress.count({
            where: {
              courseId: course.id,
              completed: true,
            },
          });

          completionRate =
            (completedLessons / (totalLessons * studentsCount)) * 100;
        }

        // Compter le nombre total de leçons
        const lessonsCount = totalLessons;

        return {
          id: course.id,
          title: course.title,
          slug: course.slug,
          imageUrl: course.imageUrl,
          status: course.status,
          price: course.price,
          studentsCount,
          activeStudentsCount: activeStudentsCount.length,
          revenue,
          completionRate: Math.round(completionRate * 10) / 10,
          chaptersCount: course.chapters.length,
          lessonsCount,
          duration: course.duration,
          createdAt: course.createdAt,
          updatedAt: course.updatedAt,
          publishedAt: course.publishedAt,
          averageRating: null, // TODO: Implémenter le système de notation
          reviewsCount: null,
        };
      }),
    );

    return performances;
  }

  /**
   * Récupère les performances d'un cours spécifique
   * @param instructorId - ID de l'instructeur
   * @param courseId - ID du cours
   */
  async getCoursePerformance(
    instructorId: string,
    courseId: string,
  ): Promise<CoursePerformanceOutput> {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: {
        enrollments: {
          where: { status: EnrollmentStatus.Active },
        },
        chapters: {
          include: {
            lessons: true,
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }

    // Vérifier que le cours appartient à l'instructeur
    if (course.userId !== instructorId) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }

    const studentsCount = course.enrollments.length;
    const revenue = course.enrollments.reduce((sum, e) => sum + e.amount, 0);

    // Étudiants actifs
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const activeStudentsCount = await this.prisma.lessonProgress.findMany({
      where: {
        courseId: course.id,
        updatedAt: { gte: thirtyDaysAgo },
      },
      select: { userId: true },
      distinct: ['userId'],
    });

    // Taux de complétion
    const totalLessons = course.chapters.reduce(
      (sum, chapter) => sum + chapter.lessons.length,
      0,
    );

    let completionRate = 0;
    if (totalLessons > 0 && studentsCount > 0) {
      const completedLessons = await this.prisma.lessonProgress.count({
        where: {
          courseId: course.id,
          completed: true,
        },
      });

      completionRate =
        (completedLessons / (totalLessons * studentsCount)) * 100;
    }

    return {
      id: course.id,
      title: course.title,
      slug: course.slug,
      imageUrl: course.imageUrl,
      status: course.status,
      price: course.price,
      studentsCount,
      activeStudentsCount: activeStudentsCount.length,
      revenue,
      completionRate: Math.round(completionRate * 10) / 10,
      chaptersCount: course.chapters.length,
      lessonsCount: totalLessons,
      duration: course.duration,
      createdAt: course.createdAt,
      updatedAt: course.updatedAt,
      publishedAt: course.publishedAt,
      averageRating: null,
      reviewsCount: null,
    };
  }

  // ═══════════════════════════════════════════════════════════
  //                  RECENT ACTIVITY
  // ═══════════════════════════════════════════════════════════

  /**
   * Récupère les activités récentes pour un instructeur
   * @param instructorId - ID de l'instructeur
   * @param limit - Nombre maximum d'activités à retourner (défaut: 10)
   */
  async getRecentActivity(
    instructorId: string,
    limit: number = 10,
  ): Promise<RecentActivityOutput[]> {
    // Récupérer les cours de l'instructeur
    const instructorCourses = await this.prisma.course.findMany({
      where: { userId: instructorId },
      select: { id: true },
    });

    const courseIds = instructorCourses.map((c) => c.id);

    if (courseIds.length === 0) {
      return [];
    }

    // Récupérer les enrollments récents
    const recentEnrollments = await this.prisma.enrollment.findMany({
      where: {
        courseId: { in: courseIds },
        status: EnrollmentStatus.Active,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    // Récupérer les leçons complétées récemment
    const recentCompletions = await this.prisma.lessonProgress.findMany({
      where: {
        courseId: { in: courseIds },
        completed: true,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
        lesson: {
          select: {
            title: true,
          },
        },
      },
      orderBy: { completedAt: 'desc' },
      take: limit,
    });

    // Combiner et trier par date
    const activities: RecentActivityOutput[] = [];

    // Ajouter les enrollments
    recentEnrollments.forEach((enrollment) => {
      activities.push({
        id: `enrollment-${enrollment.id}`,
        type: ActivityType.ENROLLMENT,
        student: {
          id: enrollment.user.id,
          name: enrollment.user.name,
          image: enrollment.user.image,
        },
        course: {
          id: enrollment.course.id,
          title: enrollment.course.title,
          slug: enrollment.course.slug,
        },
        createdAt: enrollment.createdAt,
      });
    });

    // Ajouter les completions de leçons
    recentCompletions.forEach((completion) => {
      activities.push({
        id: `completion-${completion.id}`,
        type: ActivityType.LESSON_COMPLETED,
        student: {
          id: completion.user.id,
          name: completion.user.name,
          image: completion.user.image,
        },
        course: {
          id: completion.course.id,
          title: completion.course.title,
          slug: completion.course.slug,
        },
        createdAt: completion.completedAt || completion.createdAt,
        lessonTitle: completion.lesson.title,
      });
    });

    // Trier par date décroissante et limiter
    return activities
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }
}
