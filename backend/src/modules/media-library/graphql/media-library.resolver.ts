import { BadRequestException, Logger, UseGuards } from '@nestjs/common';
import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ClerkGqlGuard } from 'src/modules/auth/guards/clerk-gql.guard';
import { MediaLibraryService } from '../services/media-library.service';
import { DeleteMediaResponse, MediaAssetType } from './media-asset.type';

/**
 * GraphQL Resolver for MediaLibrary
 *
 * All queries require authentication via @UseGuards(ClerkGqlGuard)
 * User info passed via @Context()
 */
@Resolver(() => MediaAssetType)
export class MediaLibraryResolver {
  private readonly logger = new Logger(MediaLibraryResolver.name);

  constructor(private readonly mediaLibraryService: MediaLibraryService) {}

  @Query(() => [MediaAssetType], {
    description: 'Get paginated list of user media library',
  })
  @UseGuards(ClerkGqlGuard)
  async getMyMediaLibrary(
    @Args('skip', { type: () => Int, defaultValue: 0 }) skip: number = 0,
    @Args('take', { type: () => Int, defaultValue: 20 }) take: number = 20,
    @Context() context: any,
  ): Promise<MediaAssetType[]> {
    const userId = context?.user?.id || context?.req?.user?.id;

    this.logger.log(
      `[getMyMediaLibrary] userId: ${userId}, skip: ${skip}, take: ${take}`,
    );

    if (!userId) {
      this.logger.error('[getMyMediaLibrary] User not authenticated');
      throw new BadRequestException('User not authenticated');
    }

    if (skip < 0) skip = 0;
    if (take < 1 || take > 100) take = 20;

    try {
      const mediaAssets = await this.mediaLibraryService.getMyMediaLibrary(
        userId,
        skip,
        take,
      );

      this.logger.log(
        `[getMyMediaLibrary] Found ${mediaAssets?.length || 0} media assets`,
      );

      return (mediaAssets || []) as MediaAssetType[];
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(
        `[getMyMediaLibrary] Error: ${errorMessage}`,
        error instanceof Error ? error.stack : '',
      );
      throw new BadRequestException(
        `Failed to fetch media library: ${errorMessage}`,
      );
    }
  }

  @Query(() => MediaAssetType, {
    nullable: true,
    description: 'Get single media by ID',
  })
  @UseGuards(ClerkGqlGuard)
  async getMediaById(
    @Args('id', { type: () => String }) id: string,
    @Context() context: any,
  ): Promise<MediaAssetType | null> {
    const userId = context?.user?.id || context?.req?.user?.id;

    this.logger.debug(`[getMediaById] id: ${id}, userId: ${userId}`);

    if (!userId) {
      this.logger.error('[getMediaById] User not authenticated');
      throw new BadRequestException('User not authenticated');
    }

    try {
      const media = await this.mediaLibraryService.getMediaById(id);

      if (!media) {
        this.logger.warn(`[getMediaById] Media not found: ${id}`);
        return null;
      }

      this.logger.log(`[getMediaById] Found media: ${id}`);
      return media as MediaAssetType;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`[getMediaById] Error: ${errorMessage}`);
      return null;
    }
  }

  @Mutation(() => DeleteMediaResponse, {
    description: 'Soft delete media (recoverable for 30 days)',
  })
  @UseGuards(ClerkGqlGuard)
  async deleteMedia(
    @Args('mediaId', { type: () => String }) mediaId: string,
    @Context() context: any,
  ): Promise<DeleteMediaResponse> {
    const userId = context?.user?.id || context?.req?.user?.id;

    this.logger.log(`[deleteMedia] mediaId: ${mediaId}, userId: ${userId}`);

    if (!userId) {
      this.logger.error('[deleteMedia] User not authenticated');
      throw new BadRequestException('User not authenticated');
    }

    try {
      const result = await this.mediaLibraryService.deleteMedia(
        mediaId,
        userId,
      );

      const message = result
        ? 'Media deleted successfully (recoverable for 30 days)'
        : 'Failed to delete media';

      this.logger.log(`[deleteMedia] Result: success=${result}`);

      return {
        success: result,
        message,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`[deleteMedia] Error: ${errorMessage}`);
      throw new BadRequestException(`Failed to delete media: ${errorMessage}`);
    }
  }

  @Mutation(() => Boolean, {
    description: 'Track media usage for analytics',
  })
  @UseGuards(ClerkGqlGuard)
  async trackMediaUsage(
    @Args('mediaId', { type: () => String }) mediaId: string,
    @Context() context: any,
  ): Promise<boolean> {
    const userId = context?.user?.id || context?.req?.user?.id;

    this.logger.debug(
      `[trackMediaUsage] mediaId: ${mediaId}, userId: ${userId}`,
    );

    if (!userId) {
      this.logger.error('[trackMediaUsage] User not authenticated');
      throw new BadRequestException('User not authenticated');
    }

    try {
      await this.mediaLibraryService.trackUsage(mediaId);
      this.logger.debug(`[trackMediaUsage] Tracked: ${mediaId}`);
      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`[trackMediaUsage] Error: ${errorMessage}`);
      return false;
    }
  }

  @Query(() => Number, {
    description: 'Get total count of user media',
  })
  @UseGuards(ClerkGqlGuard)
  async getMyMediaCount(@Context() context: any): Promise<number> {
    const userId = context?.user?.id || context?.req?.user?.id;

    this.logger.debug(`[getMyMediaCount] userId: ${userId}`);

    if (!userId) {
      throw new BadRequestException('User not authenticated');
    }

    try {
      const allMedia = await this.mediaLibraryService.getMyMediaLibrary(
        userId,
        0,
        999999,
      );

      const count = allMedia?.length || 0;
      this.logger.log(`[getMyMediaCount] Total: ${count}`);
      return count;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`[getMyMediaCount] Error: ${errorMessage}`);
      throw new BadRequestException(
        `Failed to get media count: ${errorMessage}`,
      );
    }
  }
}
