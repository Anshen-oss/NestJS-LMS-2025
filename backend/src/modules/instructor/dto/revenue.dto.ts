import {
  Field,
  Float,
  Int,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';

// ========================================
// ENUMS (avec préfixe "Revenue")
// ========================================

export enum RevenueInstructorPeriod {
  LAST_7_DAYS = 'LAST_7_DAYS',
  LAST_30_DAYS = 'LAST_30_DAYS',
  LAST_90_DAYS = 'LAST_90_DAYS',
  YEAR = 'YEAR',
}

export enum RevenueInstructorChangeDirection {
  UP = 'UP',
  DOWN = 'DOWN',
  STABLE = 'STABLE',
}

export enum RevenueInstructorTransactionStatus {
  PAID = 'PAID',
  PENDING = 'PENDING',
  REFUNDED = 'REFUNDED',
}

export enum RevenueInstructorPayoutStatus {
  COMPLETED = 'COMPLETED',
  PENDING = 'PENDING',
  FAILED = 'FAILED',
}

// Enregistrer les enums pour GraphQL
registerEnumType(RevenueInstructorPeriod, { name: 'RevenueInstructorPeriod' });
registerEnumType(RevenueInstructorChangeDirection, {
  name: 'RevenueInstructorChangeDirection',
});
registerEnumType(RevenueInstructorTransactionStatus, {
  name: 'RevenueInstructorTransactionStatus',
});
registerEnumType(RevenueInstructorPayoutStatus, {
  name: 'RevenueInstructorPayoutStatus',
});

// ========================================
// OBJECT TYPES
// ========================================

@ObjectType()
export class RevenueChartDataPoint {
  @Field()
  date: string;

  @Field(() => Float)
  revenue: number;

  @Field(() => Int)
  transactionCount: number;
}

@ObjectType()
export class RevenueInstructorTransaction {
  @Field()
  id: string;

  @Field()
  date: Date;

  @Field()
  studentName: string;

  @Field()
  courseName: string;

  @Field(() => Float)
  amount: number;

  @Field(() => RevenueInstructorTransactionStatus)
  status: RevenueInstructorTransactionStatus;

  @Field()
  courseId: string;
}

@ObjectType()
export class RevenueInstructorPayout {
  @Field()
  id: string;

  @Field()
  date: Date;

  @Field(() => Float)
  amount: number;

  @Field(() => RevenueInstructorPayoutStatus)
  status: RevenueInstructorPayoutStatus;

  @Field()
  bankAccount: string;
}

@ObjectType()
export class InstructorRevenueResponse {
  @Field(() => Float)
  totalRevenue: number;

  @Field(() => Float)
  previousPeriodRevenue: number;

  @Field(() => Float)
  changePercentage: number;

  @Field(() => RevenueInstructorChangeDirection)
  changeDirection: RevenueInstructorChangeDirection;

  @Field(() => Float)
  averageDailyRevenue: number;

  @Field(() => [RevenueChartDataPoint])
  dataPoints: RevenueChartDataPoint[];

  @Field(() => [RevenueInstructorTransaction])
  transactions: RevenueInstructorTransaction[];

  @Field(() => Int)
  transactionCount: number;

  @Field(() => Float)
  availableBalance: number;

  @Field()
  nextPayoutDate: Date;

  @Field(() => [RevenueInstructorPayout])
  payoutHistory: RevenueInstructorPayout[];

  @Field()
  periodStart: Date;

  @Field()
  periodEnd: Date;

  @Field()
  currency: string;
}

@ObjectType()
export class ExportRevenueResponse {
  @Field()
  success: boolean;

  @Field()
  downloadUrl: string;

  @Field()
  filename: string;
}
