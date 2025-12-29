import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ClerkGqlGuard } from '../auth/guards/clerk-gql.guard';
import { Course } from '../courses/entities/course.entity';
import { User } from '../users/entities/user.entity';
import { EnrollInCourseInput } from './dto/enroll-in-course.input';
import { EnrollmentService } from './enrollment.service';
import { Enrollment } from './entities/enrollment.entity';
import { EnrollmentResponse } from './types/enrollment-response.type';

@Resolver()
export class EnrollmentResolver {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @Mutation(() => EnrollmentResponse)
  @UseGuards(ClerkGqlGuard)
  async enrollInCourse(
    @Args('input') input: EnrollInCourseInput,
    @CurrentUser() user: User,
  ): Promise<EnrollmentResponse> {
    return this.enrollmentService.enrollInCourse(input.courseId, user.id);
  }

  // 🆕 NOUVELLE QUERY
  @Query(() => [Enrollment])
  @UseGuards(ClerkGqlGuard)
  async myEnrollments(@CurrentUser() user: User): Promise<Enrollment[]> {
    return this.enrollmentService.getMyEnrollments(user.id);
  }

  @Query(() => Boolean)
  @UseGuards(ClerkGqlGuard)
  async isEnrolled(
    @Args('courseId') courseId: string,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    return this.enrollmentService.isEnrolled(user.id, courseId);
  }

  @Query(() => [Course])
  @UseGuards(ClerkGqlGuard)
  async myEnrolledCourses(@CurrentUser() user: User) {
    const enrollments = await this.enrollmentService.getMyEnrollments(user.id);
    return enrollments.map((e) => e.course);
  }
}
