import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ClerkGqlGuard } from '../auth/guards/clerk-gql.guard';
import { SaveVideoProgressInput } from './dto/save-video-progress.input';
import { VideoProgress } from './entities/video-progress.entity';
import { VideoProgressService } from './video-progress.service';

@Resolver(() => VideoProgress)
@UseGuards(ClerkGqlGuard)
export class VideoProgressResolver {
  constructor(private readonly videoProgressService: VideoProgressService) {}

  @Query(() => VideoProgress, {
    nullable: true,
    description: 'Get video progress for a specific lesson',
  })
  async getVideoProgress(
    @Args('lessonId') lessonId: string,
    @CurrentUser() user: any,
  ): Promise<VideoProgress | null> {
    return this.videoProgressService.getProgress(user.id, lessonId); // ✅ user.id
  }

  @Query(() => [VideoProgress], {
    description: 'Get all video progress for current user (sorted by recent)',
  })
  async getUserVideoProgress(@CurrentUser() user: any): Promise<any[]> {
    return this.videoProgressService.getUserProgress(user.id); // ✅ user.id
  }

  @Mutation(() => VideoProgress, {
    description: 'Save video progress (auto-save every 5 seconds)',
  })
  async saveVideoProgress(
    @Args('input') input: SaveVideoProgressInput,
    @CurrentUser() user: any,
  ): Promise<VideoProgress> {
    return this.videoProgressService.saveProgress(user.id, input); // ✅ user.id
  }

  @Mutation(() => VideoProgress, {
    description: 'Manually mark a lesson as completed',
  })
  async markLessonCompleted(
    @Args('lessonId') lessonId: string,
    @CurrentUser() user: any,
  ): Promise<VideoProgress> {
    return this.videoProgressService.markCompleted(user.id, lessonId); // ✅ user.id
  }

  @Mutation(() => Boolean, {
    description: 'Delete video progress (reset)',
  })
  async deleteVideoProgress(
    @Args('lessonId') lessonId: string,
    @CurrentUser() user: any,
  ): Promise<boolean> {
    return this.videoProgressService.deleteProgress(user.id, lessonId); // ✅ user.id
  }
}
