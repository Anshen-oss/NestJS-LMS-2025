import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import type { User } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { EnrollInCourseInput } from './dto/enroll-in-course.input';
import { EnrollmentService } from './enrollment.service';
import { EnrollmentResponse } from './types/enrollment-response.type';

@Resolver()
export class EnrollmentResolver {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @Mutation(() => EnrollmentResponse)
  @UseGuards(GqlAuthGuard)
  async enrollInCourse(
    @Args('input') input: EnrollInCourseInput,
    @CurrentUser() user: User,
  ): Promise<EnrollmentResponse> {
    return this.enrollmentService.enrollInCourse(input.courseId, user.id);
  }
}
