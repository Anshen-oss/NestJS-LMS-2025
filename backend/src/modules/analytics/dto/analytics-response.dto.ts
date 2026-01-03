import {
  Field,
  Float,
  Int,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';

export enum ChangeDirection {
  UP = 'UP',
  DOWN = 'DOWN',
  STABLE = 'STABLE',
}

registerEnumType(ChangeDirection, {
  name: 'ChangeDirection',
});

@ObjectType()
export class PercentageChange {
  @Field(() => Float)
  value: number;

  @Field(() => ChangeDirection)
  direction: ChangeDirection;

  @Field()
  isSignificant: boolean;
}

@ObjectType()
export class DateRangeType {
  @Field(() => Date)
  startDate: Date;

  @Field(() => Date)
  endDate: Date;
}

@ObjectType()
export class AnalyticsOverview {
  // Current metrics
  @Field(() => Float)
  totalRevenue: number;

  @Field(() => Int)
  totalEnrollments: number;

  @Field(() => Float)
  averageCompletionRate: number;

  @Field(() => Int)
  totalStudents: number;

  @Field(() => Float)
  averageWatchTime: number;

  // Changes
  @Field(() => PercentageChange)
  revenueChange: PercentageChange;

  @Field(() => PercentageChange)
  enrollmentsChange: PercentageChange;

  @Field(() => PercentageChange)
  completionRateChange: PercentageChange;

  @Field(() => PercentageChange)
  studentsChange: PercentageChange;

  // Periods
  @Field(() => DateRangeType)
  currentPeriod: DateRangeType;

  @Field(() => DateRangeType)
  comparisonPeriod: DateRangeType;
}

@ObjectType()
export class RevenueDataPoint {
  @Field(() => Date)
  date: Date;

  @Field(() => Float)
  revenue: number;

  @Field(() => Int)
  enrollments: number;
}

@ObjectType()
export class RevenueAnalytics {
  @Field(() => Float)
  totalRevenue: number;

  @Field(() => [RevenueDataPoint])
  dataPoints: RevenueDataPoint[];
}

@ObjectType()
export class CoursePerformance {
  @Field()
  courseId: string;

  @Field()
  courseName: string;

  @Field({ nullable: true })
  thumbnailUrl?: string;

  @Field(() => Int)
  totalEnrollments: number;

  @Field(() => Int)
  activeStudents: number;

  @Field(() => Float)
  completionRate: number;

  @Field(() => Float)
  totalRevenue: number;

  @Field(() => Float)
  averageProgress: number;

  @Field(() => PercentageChange)
  enrollmentTrend: PercentageChange;
}
