import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  calculatePercentageChange,
  generateDateRange,
  getComparisonPeriod,
} from './analytics.utils';
import {
  AnalyticsOverview,
  CoursePerformance,
  RevenueAnalytics,
  RevenueDataPoint,
} from './dto/analytics-response.dto';
import { DateRangeInput } from './dto/date-range.input';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Récupère l'overview complet des analytics
   */
  async getAnalyticsOverview(
    instructorId: string,
    dateRange: DateRangeInput,
  ): Promise<AnalyticsOverview> {
    this.logger.log(
      `Getting analytics overview for instructor ${instructorId}`,
    );

    const comparisonPeriod = getComparisonPeriod(dateRange);

    const currentMetrics = await this.getMetricsForPeriod(
      instructorId,
      dateRange,
    );

    const previousMetrics = await this.getMetricsForPeriod(
      instructorId,
      comparisonPeriod,
    );

    return {
      totalRevenue: currentMetrics.totalRevenue,
      totalEnrollments: currentMetrics.totalEnrollments,
      averageCompletionRate: currentMetrics.averageCompletionRate,
      totalStudents: currentMetrics.totalStudents,
      averageWatchTime: currentMetrics.averageWatchTime,

      revenueChange: calculatePercentageChange(
        currentMetrics.totalRevenue,
        previousMetrics.totalRevenue,
      ),
      enrollmentsChange: calculatePercentageChange(
        currentMetrics.totalEnrollments,
        previousMetrics.totalEnrollments,
      ),
      completionRateChange: calculatePercentageChange(
        currentMetrics.averageCompletionRate,
        previousMetrics.averageCompletionRate,
      ),
      studentsChange: calculatePercentageChange(
        currentMetrics.totalStudents,
        previousMetrics.totalStudents,
      ),

      currentPeriod: dateRange,
      comparisonPeriod,
    };
  }

  /**
   * Récupère les métriques pour une période donnée
   */
  private async getMetricsForPeriod(
    instructorId: string,
    dateRange: DateRangeInput,
  ) {
    // Récupérer les cours de l'instructeur
    const instructorCourses = await this.prisma.course.findMany({
      where: { userId: instructorId },
      select: { id: true },
    });

    const courseIds = instructorCourses.map((c) => c.id);

    if (courseIds.length === 0) {
      return {
        totalRevenue: 0,
        totalEnrollments: 0,
        totalStudents: 0,
        averageCompletionRate: 0,
        averageWatchTime: 0,
      };
    }

    // 1. Revenus totaux
    const enrollments = await this.prisma.enrollment.findMany({
      where: {
        courseId: { in: courseIds },
        createdAt: {
          gte: dateRange.startDate,
          lte: dateRange.endDate,
        },
      },
      select: { amount: true },
    });

    const totalRevenue = enrollments.reduce(
      (sum, e) => sum + (e.amount || 0),
      0,
    );
    const totalEnrollments = enrollments.length;

    // 2. Étudiants uniques
    const uniqueStudents = await this.prisma.enrollment.findMany({
      where: {
        courseId: { in: courseIds },
        createdAt: {
          gte: dateRange.startDate,
          lte: dateRange.endDate,
        },
      },
      distinct: ['userId'],
      select: { userId: true },
    });

    const totalStudents = uniqueStudents.length;

    // 3. Taux de complétion moyen via VideoProgress
    // On récupère toutes les vidéo progress pour les lessons de ces cours
    const videoProgressData = await this.prisma.videoProgress.findMany({
      where: {
        lesson: {
          chapter: {
            courseId: { in: courseIds },
          },
        },
        updatedAt: {
          gte: dateRange.startDate,
          lte: dateRange.endDate,
        },
      },
      select: {
        progressPercent: true,
      },
    });

    const averageCompletionRate =
      videoProgressData.length > 0
        ? videoProgressData.reduce((sum, vp) => sum + vp.progressPercent, 0) /
          videoProgressData.length
        : 0;

    // 4. Temps de visionnage moyen
    const videoProgressTime = await this.prisma.videoProgress.findMany({
      where: {
        lesson: {
          chapter: {
            courseId: { in: courseIds },
          },
        },
        updatedAt: {
          gte: dateRange.startDate,
          lte: dateRange.endDate,
        },
      },
      select: {
        currentTime: true,
      },
    });

    const averageWatchTime =
      videoProgressTime.length > 0
        ? videoProgressTime.reduce((sum, vp) => sum + vp.currentTime, 0) /
          videoProgressTime.length /
          60 // Convert to minutes
        : 0;

    return {
      totalRevenue,
      totalEnrollments,
      totalStudents,
      averageCompletionRate,
      averageWatchTime,
    };
  }

  /**
   * Récupère les données de revenus avec points temporels
   */
  async getRevenueAnalytics(
    instructorId: string,
    dateRange: DateRangeInput,
  ): Promise<RevenueAnalytics> {
    const instructorCourses = await this.prisma.course.findMany({
      where: { userId: instructorId },
      select: { id: true },
    });

    const courseIds = instructorCourses.map((c) => c.id);
    const dates = generateDateRange(dateRange.startDate, dateRange.endDate);

    const enrollments = await this.prisma.enrollment.findMany({
      where: {
        courseId: { in: courseIds },
        createdAt: {
          gte: dateRange.startDate,
          lte: dateRange.endDate,
        },
      },
      select: {
        amount: true,
        createdAt: true,
      },
    });

    // Grouper par date
    const dataPoints: RevenueDataPoint[] = dates.map((date) => {
      const dayEnrollments = enrollments.filter((e) => {
        const enrollDate = new Date(e.createdAt);
        return (
          enrollDate.getFullYear() === date.getFullYear() &&
          enrollDate.getMonth() === date.getMonth() &&
          enrollDate.getDate() === date.getDate()
        );
      });

      return {
        date,
        revenue: dayEnrollments.reduce((sum, e) => sum + (e.amount || 0), 0),
        enrollments: dayEnrollments.length,
      };
    });

    const totalRevenue = dataPoints.reduce((sum, p) => sum + p.revenue, 0);

    return {
      totalRevenue,
      dataPoints,
    };
  }

  /**
   * Récupère la performance de tous les cours
   */
  async getCoursePerformance(
    instructorId: string,
    dateRange: DateRangeInput,
  ): Promise<CoursePerformance[]> {
    const courses = await this.prisma.course.findMany({
      where: { userId: instructorId },
      select: {
        id: true,
        title: true,
        imageUrl: true,
      },
    });

    const comparisonPeriod = getComparisonPeriod(dateRange);
    const performances: CoursePerformance[] = [];

    for (const course of courses) {
      // Enrollments de la période
      const currentEnrollments = await this.prisma.enrollment.findMany({
        where: {
          courseId: course.id,
          createdAt: {
            gte: dateRange.startDate,
            lte: dateRange.endDate,
          },
        },
        select: {
          amount: true,
          userId: true,
        },
      });

      const totalEnrollments = currentEnrollments.length;

      // Étudiants actifs (ayant une vidéo progress)
      const activeStudentsData = await this.prisma.videoProgress.findMany({
        where: {
          lesson: {
            chapter: {
              courseId: course.id,
            },
          },
          updatedAt: {
            gte: dateRange.startDate,
            lte: dateRange.endDate,
          },
        },
        distinct: ['userId'],
        select: {
          userId: true,
        },
      });

      const activeStudents = activeStudentsData.length;

      // Taux de complétion pour ce cours
      const courseVideoProgress = await this.prisma.videoProgress.findMany({
        where: {
          lesson: {
            chapter: {
              courseId: course.id,
            },
          },
          updatedAt: {
            gte: dateRange.startDate,
            lte: dateRange.endDate,
          },
        },
        select: {
          progressPercent: true,
        },
      });

      const completionRate =
        courseVideoProgress.length > 0
          ? courseVideoProgress.reduce(
              (sum, vp) => sum + vp.progressPercent,
              0,
            ) / courseVideoProgress.length
          : 0;

      const averageProgress = completionRate;

      // Revenus
      const totalRevenue = currentEnrollments.reduce(
        (sum, e) => sum + (e.amount || 0),
        0,
      );

      // Tendance
      const previousEnrollments = await this.prisma.enrollment.count({
        where: {
          courseId: course.id,
          createdAt: {
            gte: comparisonPeriod.startDate,
            lte: comparisonPeriod.endDate,
          },
        },
      });

      const enrollmentTrend = calculatePercentageChange(
        totalEnrollments,
        previousEnrollments,
      );

      performances.push({
        courseId: course.id,
        courseName: course.title,
        thumbnailUrl: course.imageUrl ?? undefined,
        totalEnrollments,
        activeStudents,
        completionRate,
        totalRevenue,
        averageProgress,
        enrollmentTrend,
      });
    }

    return performances.sort((a, b) => b.totalRevenue - a.totalRevenue);
  }

  /**
   * Exporte les données en CSV
   */
  async exportToCsv(
    instructorId: string,
    dateRange: DateRangeInput,
    type: 'overview' | 'revenue' | 'courses',
  ): Promise<string> {
    switch (type) {
      case 'overview': {
        const overview = await this.getAnalyticsOverview(
          instructorId,
          dateRange,
        );
        return this.formatOverviewCsv(overview);
      }
      case 'revenue': {
        const revenue = await this.getRevenueAnalytics(instructorId, dateRange);
        return this.formatRevenueCsv(revenue);
      }
      case 'courses': {
        const courses = await this.getCoursePerformance(
          instructorId,
          dateRange,
        );
        return this.formatCoursesCsv(courses);
      }
      default:
        throw new Error('Invalid export type');
    }
  }

  private formatOverviewCsv(overview: AnalyticsOverview): string {
    const rows = [
      ['Metric', 'Value', 'Change (%)', 'Direction'],
      [
        'Total Revenue',
        overview.totalRevenue.toFixed(2),
        overview.revenueChange.value.toFixed(2),
        overview.revenueChange.direction,
      ],
      [
        'Total Enrollments',
        overview.totalEnrollments.toString(),
        overview.enrollmentsChange.value.toFixed(2),
        overview.enrollmentsChange.direction,
      ],
      [
        'Avg Completion Rate',
        overview.averageCompletionRate.toFixed(2),
        overview.completionRateChange.value.toFixed(2),
        overview.completionRateChange.direction,
      ],
      [
        'Total Students',
        overview.totalStudents.toString(),
        overview.studentsChange.value.toFixed(2),
        overview.studentsChange.direction,
      ],
    ];

    return rows.map((row) => row.join(',')).join('\n');
  }

  private formatRevenueCsv(revenue: RevenueAnalytics): string {
    const rows = [['Date', 'Revenue (€)', 'Enrollments']];

    revenue.dataPoints.forEach((point) => {
      rows.push([
        point.date.toISOString().split('T')[0],
        point.revenue.toFixed(2),
        point.enrollments.toString(),
      ]);
    });

    return rows.map((row) => row.join(',')).join('\n');
  }

  private formatCoursesCsv(courses: CoursePerformance[]): string {
    const rows = [
      [
        'Course',
        'Enrollments',
        'Active Students',
        'Completion Rate (%)',
        'Revenue (€)',
        'Avg Progress (%)',
        'Trend',
      ],
    ];

    courses.forEach((course) => {
      rows.push([
        course.courseName,
        course.totalEnrollments.toString(),
        course.activeStudents.toString(),
        course.completionRate.toFixed(2),
        course.totalRevenue.toFixed(2),
        course.averageProgress.toFixed(2),
        `${course.enrollmentTrend.direction} ${course.enrollmentTrend.value.toFixed(2)}%`,
      ]);
    });

    return rows.map((row) => row.join(',')).join('\n');
  }
}
