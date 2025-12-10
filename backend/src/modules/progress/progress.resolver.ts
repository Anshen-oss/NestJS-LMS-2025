import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../auth/entities/user.entity';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CourseProgressOutput } from './dto/course-progress.output';
import { LessonProgress } from './entities/lesson-progress.entity';
import { ProgressService } from './progress.service';

@Resolver()
@UseGuards(GqlAuthGuard)
export class ProgressResolver {
  constructor(private progressService: ProgressService) {}

  @Mutation(() => LessonProgress)
  async toggleLessonCompletion(
    @CurrentUser() user: User,
    @Args('lessonId') lessonId: string,
  ) {
    return this.progressService.toggleLessonCompletion(user.id, lessonId);
  }

  @Query(() => CourseProgressOutput)
  @UseGuards(GqlAuthGuard)
  async courseProgress(
    @CurrentUser() user: User,
    @Args('courseId') courseId: string,
  ): Promise<CourseProgressOutput> {
    // ⬅️ Ajouter le type de retour
    return this.progressService.getCourseProgress(user.id, courseId);
  }

  @Query(() => LessonProgress, { nullable: true })
  async lessonProgress(
    @CurrentUser() user: User,
    @Args('lessonId') lessonId: string,
  ) {
    return this.progressService.getLessonProgress(user.id, lessonId);
  }
}
