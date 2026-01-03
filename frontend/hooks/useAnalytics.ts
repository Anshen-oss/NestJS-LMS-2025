
import { useInstructorAnalyticsQuery, useInstructorCoursePerformanceQuery, useInstructorRevenueQuery } from '@/lib/generated/graphql';
import { DateRange } from 'react-day-picker';

interface UseAnalyticsOptions {
  dateRange: DateRange;
  skip?: boolean;
}

export function useAnalytics({ dateRange, skip = false }: UseAnalyticsOptions) {
  // Vérifie que les dates sont valides
  const hasValidDates = Boolean(dateRange.from && dateRange.to);
  const shouldSkip = skip || !hasValidDates;

  // Query 1: Overview Analytics
  const {
    data: analyticsData,
    loading: analyticsLoading,
    error: analyticsError,
    refetch: refetchAnalytics,
  } = useInstructorAnalyticsQuery({
    variables: {
      dateRange: {
        startDate: dateRange.from!,
        endDate: dateRange.to!,
      },
    },
    skip: shouldSkip,
  });

  // Query 2: Revenue Details
  const {
    data: revenueData,
    loading: revenueLoading,
    error: revenueError,
    refetch: refetchRevenue,
  } = useInstructorRevenueQuery({
    variables: {
      dateRange: {
        startDate: dateRange.from!,
        endDate: dateRange.to!,
      },
    },
    skip: shouldSkip,
  });

  // Query 3: Course Performance
  const {
    data: coursePerformanceData,
    loading: coursePerformanceLoading,
    error: coursePerformanceError,
    refetch: refetchCoursePerformance,
  } = useInstructorCoursePerformanceQuery({
    variables: {
      dateRange: {
        startDate: dateRange.from!,
        endDate: dateRange.to!,
      },
    },
    skip: shouldSkip,
  });

  // État de chargement global
  const loading =
    analyticsLoading || revenueLoading || coursePerformanceLoading;

  // Erreur globale (priorise l'erreur analytics)
  const error = analyticsError || revenueError || coursePerformanceError;

  // Données extraites
  const analytics = analyticsData?.instructorAnalytics;
  const revenue = revenueData?.instructorRevenue;
  const coursePerformance =
    coursePerformanceData?.instructorCoursePerformance || [];

  // Fonction pour refetch toutes les données
  const refetchAll = async () => {
    await Promise.all([
      refetchAnalytics(),
      refetchRevenue(),
      refetchCoursePerformance(),
    ]);
  };

  // Métriques dérivées utiles
  const metrics = analytics
    ? {
        // Revenus
        totalRevenue: analytics.totalRevenue,
        revenueChange: analytics.revenueChange,
        revenuePerEnrollment:
          analytics.totalEnrollments > 0
            ? analytics.totalRevenue / analytics.totalEnrollments
            : 0,

        // Inscriptions
        totalEnrollments: analytics.totalEnrollments,
        enrollmentsChange: analytics.enrollmentsChange,

        // Complétion
        averageCompletionRate: analytics.averageCompletionRate,
        completionRateChange: analytics.completionRateChange,

        // Étudiants
        totalStudents: analytics.totalStudents,
        studentsChange: analytics.studentsChange,
        averageWatchTime: analytics.averageWatchTime,

        // Périodes
        currentPeriod: analytics.currentPeriod,
        comparisonPeriod: analytics.comparisonPeriod,

        // Métriques calculées
        enrollmentRate:
          analytics.totalStudents > 0
            ? (analytics.totalEnrollments / analytics.totalStudents) * 100
            : 0,
      }
    : null;

  return {
    // Données principales
    analytics,
    revenue,
    coursePerformance,
    metrics,

    // États
    loading,
    error,
    hasValidDates,

    // Actions
    refetchAll,
    refetchAnalytics,
    refetchRevenue,
    refetchCoursePerformance,
  };
}
