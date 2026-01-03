import { UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { UserRole } from '@prisma/client'; // ✅ UserRole au lieu de Role
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { ClerkGqlGuard } from '../auth/guards/clerk-gql.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AnalyticsService } from './analytics.service';
import {
  AnalyticsOverview,
  CoursePerformance,
  RevenueAnalytics,
} from './dto/analytics-response.dto';
import { DateRangeInput } from './dto/date-range.input';

@Resolver()
@UseGuards(ClerkGqlGuard, RolesGuard)
export class AnalyticsResolver {
  constructor(private analyticsService: AnalyticsService) {}

  @Query(() => AnalyticsOverview)
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
  async instructorAnalytics(
    @CurrentUser() user: any,
    @Args('dateRange') dateRange: DateRangeInput,
  ): Promise<AnalyticsOverview> {
    return this.analyticsService.getAnalyticsOverview(user.id, dateRange);
  }

  @Query(() => RevenueAnalytics)
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
  async instructorRevenue(
    @CurrentUser() user: any,
    @Args('dateRange') dateRange: DateRangeInput,
  ): Promise<RevenueAnalytics> {
    return this.analyticsService.getRevenueAnalytics(user.id, dateRange);
  }

  @Query(() => [CoursePerformance])
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
  async instructorCoursePerformance(
    @CurrentUser() user: any,
    @Args('dateRange') dateRange: DateRangeInput,
  ): Promise<CoursePerformance[]> {
    return this.analyticsService.getCoursePerformance(user.id, dateRange);
  }

  @Query(() => String)
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
  async exportAnalytics(
    @CurrentUser() user: any,
    @Args('dateRange') dateRange: DateRangeInput,
    @Args('type') type: 'overview' | 'revenue' | 'courses',
  ): Promise<string> {
    return this.analyticsService.exportToCsv(user.id, dateRange, type);
  }
}
