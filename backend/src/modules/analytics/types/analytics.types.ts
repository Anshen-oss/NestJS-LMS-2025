export interface DateRangeInput {
  startDate: Date;
  endDate: Date;
}

export interface AnalyticsOverview {
  // Current period
  totalRevenue: number;
  totalEnrollments: number;
  averageCompletionRate: number;
  totalStudents: number;
  averageWatchTime: number;

  // Comparisons
  revenueChange: PercentageChange;
  enrollmentsChange: PercentageChange;
  completionRateChange: PercentageChange;
  studentsChange: PercentageChange;

  // Periods
  currentPeriod: DateRange;
  comparisonPeriod: DateRange;
}

export interface PercentageChange {
  value: number;
  direction: 'UP' | 'DOWN' | 'STABLE';
  isSignificant: boolean;
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export interface RevenueDataPoint {
  date: Date;
  revenue: number;
  enrollments: number;
}

export interface CoursePerformance {
  courseId: string;
  courseName: string;
  thumbnailUrl?: string;
  totalEnrollments: number;
  activeStudents: number;
  completionRate: number;
  totalRevenue: number;
  averageProgress: number;
  enrollmentTrend: PercentageChange;
}
