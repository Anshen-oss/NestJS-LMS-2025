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

  // ═══════════════════════════════════════════════════════════
  // STUDENTS MANAGEMENT - VERSION FINALE ULTRA CORRIGÉE
  // ✅ ALL null → undefined conversions
  // ═══════════════════════════════════════════════════════════

  /**
   * Récupère la liste paginée des étudiants de l'instructeur
   * ✅ FINAL FINAL - Convertit null → undefined PARTOUT
   */
  async getInstructorStudents(
    instructorId: string,
    page: number = 1,
    pageSize: number = 10,
    search?: string,
    courseId?: string,
    sortBy: string = 'enrolledAt',
  ) {
    // Récupérer les courses de l'instructeur
    const instructorCourses = await this.prisma.course.findMany({
      where: { userId: instructorId },
      select: { id: true },
    });

    const courseIds = instructorCourses.map((c) => c.id);

    if (courseIds.length === 0) {
      return {
        students: [],
        total: 0,
        page,
        pageSize,
      };
    }

    // Construire les filtres
    const whereClause: any = {
      courseId: { in: courseIds },
    };

    if (courseId && courseIds.includes(courseId)) {
      whereClause.courseId = courseId;
    }

    if (search) {
      whereClause.user = {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      };
    }

    const orderBy: any = { createdAt: 'desc' };

    const total = await this.prisma.enrollment.count({
      where: whereClause,
    });

    const skip = (page - 1) * pageSize;

    // Récupérer les enrollments paginées
    const enrollments = await this.prisma.enrollment.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
            imageUrl: true,
            price: true,
          },
        },
      },
      orderBy,
      skip,
      take: pageSize,
    });

    // Récupérer les progressions pour chaque étudiant
    const studentProgressMap = new Map();

    for (const enrollment of enrollments) {
      const studentId = enrollment.userId;

      if (!studentProgressMap.has(studentId)) {
        // Récupérer tous les enrollments de l'étudiant
        const allStudentEnrollments = await this.prisma.enrollment.findMany({
          where: {
            userId: studentId,
            courseId: { in: courseIds },
          },
          include: {
            course: {
              select: {
                id: true,
                title: true,
                slug: true,
                imageUrl: true,
                price: true,
                chapters: {
                  include: {
                    lessons: true,
                  },
                },
              },
            },
          },
        });

        const courseProgresses: any[] = [];
        let totalCompletionRate = 0;
        let completedCoursesCount = 0;

        for (const se of allStudentEnrollments) {
          const totalLessons = se.course.chapters.reduce(
            (sum, ch) => sum + ch.lessons.length,
            0,
          );

          let completionRate = 0;
          let lessonsCompleted = 0;

          if (totalLessons > 0) {
            const progress = await this.prisma.lessonProgress.findMany({
              where: {
                userId: studentId,
                courseId: se.courseId,
              },
            });

            lessonsCompleted = progress.filter((p) => p.completed).length;
            completionRate = (lessonsCompleted / totalLessons) * 100;
          }

          courseProgresses.push({
            courseId: se.courseId,
            courseTitle: se.course.title,
            courseSlug: se.course.slug,
            courseImage: se.course.imageUrl ?? undefined, // ✅ null → undefined
            price: se.course.price,
            enrollment: {
              id: se.id,
              enrolledAt: se.createdAt,
              status: se.status,
              completionRate: Math.round(completionRate * 10) / 10,
              lessonsCompleted,
              totalLessons,
              lastActivityAt: se.updatedAt,
            },
          });

          totalCompletionRate += completionRate;
          if (completionRate === 100) {
            completedCoursesCount++;
          }
        }

        // Récupérer la dernière activité de l'étudiant
        const lastProgress = await this.prisma.lessonProgress.findFirst({
          where: {
            userId: studentId,
            courseId: { in: courseIds },
          },
          orderBy: { updatedAt: 'desc' },
        });

        const lastActivityAt = lastProgress?.updatedAt || enrollment.updatedAt;

        studentProgressMap.set(studentId, {
          totalCoursesEnrolled: allStudentEnrollments.length,
          totalCoursesCompleted: completedCoursesCount,
          overallCompletionRate:
            allStudentEnrollments.length > 0
              ? Math.round(
                  (totalCompletionRate / allStudentEnrollments.length) * 10,
                ) / 10
              : 0,
          lastActivityAt,
          courses: courseProgresses,
        });
      }
    }

    // Construire la réponse
    const students = enrollments.map((enrollment) => {
      const studentData = studentProgressMap.get(enrollment.userId);

      return {
        id: enrollment.userId,
        name: enrollment.user.name,
        email: enrollment.user.email ?? undefined, // ✅ null → undefined
        image: enrollment.user.image ?? undefined, // ✅ null → undefined
        enrolledAt: enrollment.createdAt,
        totalCoursesEnrolled: studentData.totalCoursesEnrolled,
        totalCoursesCompleted: studentData.totalCoursesCompleted,
        overallCompletionRate: studentData.overallCompletionRate,
        lastActivityAt: studentData.lastActivityAt,
        courses: studentData.courses,
      };
    });

    return {
      students,
      total,
      page,
      pageSize,
    };
  }

  /**
   * Récupère les détails complets d'un étudiant
   * ✅ FINAL FINAL - Convertit null → undefined PARTOUT
   */
  async getStudentDetail(instructorId: string, studentId: string) {
    const enrollment = await this.prisma.enrollment.findFirst({
      where: {
        userId: studentId,
        course: {
          userId: instructorId,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            createdAt: true,
          },
        },
      },
    });

    if (!enrollment) {
      throw new NotFoundException(`Student not found`);
    }

    // Récupérer tous les courses de l'étudiant chez cet instructeur
    const allEnrollments = await this.prisma.enrollment.findMany({
      where: {
        userId: studentId,
        course: {
          userId: instructorId,
        },
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
            imageUrl: true,
            price: true,
            chapters: {
              include: {
                lessons: true,
              },
            },
          },
        },
      },
    });

    const courseProgresses: any[] = [];
    let totalCompletionRate = 0;
    let completedCoursesCount = 0;
    let totalMinutes = 0;
    let lessonCount = 0;

    for (const se of allEnrollments) {
      const totalLessons = se.course.chapters.reduce(
        (sum, ch) => sum + ch.lessons.length,
        0,
      );

      let completionRate = 0;
      let lessonsCompleted = 0;

      const progressRecords = await this.prisma.lessonProgress.findMany({
        where: {
          userId: studentId,
          courseId: se.courseId,
        },
      });

      lessonsCompleted = progressRecords.filter((p) => p.completed).length;
      completionRate =
        totalLessons > 0 ? (lessonsCompleted / totalLessons) * 100 : 0;

      const minutesInCourse = lessonsCompleted * 15;
      totalMinutes += minutesInCourse;

      courseProgresses.push({
        courseId: se.courseId,
        courseTitle: se.course.title,
        courseSlug: se.course.slug,
        courseImage: se.course.imageUrl ?? undefined, // ✅ null → undefined
        price: se.course.price,
        enrollment: {
          id: se.id,
          enrolledAt: se.createdAt,
          status: se.status,
          completionRate: Math.round(completionRate * 10) / 10,
          lessonsCompleted,
          totalLessons,
          lastActivityAt: se.updatedAt,
        },
      });

      totalCompletionRate += completionRate;
      lessonCount += totalLessons;
      if (completionRate === 100) {
        completedCoursesCount++;
      }
    }

    const averageTimePerLesson =
      lessonCount > 0 ? totalMinutes / lessonCount : 0;
    const achievements: any[] = [];

    return {
      id: studentId,
      name: enrollment.user.name,
      email: enrollment.user.email ?? undefined, // ✅ null → undefined
      image: enrollment.user.image ?? undefined, // ✅ null → undefined
      enrolledAt: enrollment.createdAt,
      joinedAt: enrollment.user.createdAt,
      totalCoursesEnrolled: allEnrollments.length,
      totalCoursesCompleted: completedCoursesCount,
      overallCompletionRate:
        allEnrollments.length > 0
          ? Math.round((totalCompletionRate / allEnrollments.length) * 10) / 10
          : 0,
      lastActivityAt: enrollment.updatedAt,
      totalTimeSpent: Math.round(totalMinutes),
      averageTimePerLesson: Math.round(averageTimePerLesson),
      courses: courseProgresses,
      achievements,
    };
  }

  /**
   * Récupère les étudiants inscrits à un cours spécifique
   * ✅ FINAL FINAL - Convertit null → undefined PARTOUT
   */
  async getStudentsByCourse(
    instructorId: string,
    courseId: string,
    page: number = 1,
    pageSize: number = 10,
    search?: string,
    sortBy: string = 'enrolledAt',
  ) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      select: { userId: true },
    });

    if (!course || course.userId !== instructorId) {
      throw new NotFoundException(`Course not found`);
    }

    const whereClause: any = {
      courseId,
    };

    if (search) {
      whereClause.user = {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      };
    }

    const orderBy: any = { createdAt: 'desc' };

    const total = await this.prisma.enrollment.count({
      where: whereClause,
    });

    const skip = (page - 1) * pageSize;

    const enrollments = await this.prisma.enrollment.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        course: {
          include: {
            chapters: {
              include: {
                lessons: true,
              },
            },
          },
        },
      },
      orderBy,
      skip,
      take: pageSize,
    });

    const studentIds = enrollments.map((e) => e.userId);

    const allProgressions = await this.prisma.lessonProgress.findMany({
      where: {
        userId: { in: studentIds },
        courseId,
      },
    });

    const students = enrollments.map((enrollment) => {
      const totalLessons = enrollment.course.chapters.reduce(
        (sum, ch) => sum + ch.lessons.length,
        0,
      );

      const studentProgress = allProgressions.filter(
        (p) => p.userId === enrollment.userId,
      );

      const lessonsCompleted = studentProgress.filter(
        (p) => p.completed,
      ).length;
      const completionRate =
        totalLessons > 0 ? (lessonsCompleted / totalLessons) * 100 : 0;

      return {
        id: enrollment.userId,
        name: enrollment.user.name,
        email: enrollment.user.email ?? undefined, // ✅ null → undefined
        image: enrollment.user.image ?? undefined, // ✅ null → undefined
        enrolledAt: enrollment.createdAt,
        totalCoursesEnrolled: 1,
        totalCoursesCompleted: completionRate === 100 ? 1 : 0,
        overallCompletionRate: Math.round(completionRate * 10) / 10,
        lastActivityAt: enrollment.updatedAt,
        courses: [
          {
            courseId: enrollment.courseId,
            courseTitle: enrollment.course.title,
            courseSlug: enrollment.course.slug,
            courseImage: enrollment.course.imageUrl ?? undefined, // ✅ null → undefined
            price: enrollment.course.price,
            enrollment: {
              id: enrollment.id,
              enrolledAt: enrollment.createdAt,
              status: enrollment.status,
              completionRate: Math.round(completionRate * 10) / 10,
              lessonsCompleted,
              totalLessons,
              lastActivityAt: enrollment.updatedAt,
            },
          },
        ],
      };
    });

    return {
      students,
      total,
      page,
      pageSize,
    };
  }
}
