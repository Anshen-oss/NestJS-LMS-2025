import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';

// ============================================================================
// OUTPUT TYPES (GraphQL Response)
// ============================================================================

/**
 * MediaAsset GraphQL Object Type
 *
 * Returned from queries like getMediaById(), getMyMediaLibrary()
 */
@ObjectType()
export class MediaAssetType {
  @Field()
  id: string;

  @Field()
  filename: string;

  @Field()
  urlOriginal: string;

  @Field()
  urlLarge: string;

  @Field()
  urlMedium: string;

  @Field()
  urlThumbnail: string;

  @Field(() => Int)
  width: number;

  @Field(() => Int)
  height: number;

  @Field(() => Int)
  size: number;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => [String])
  tags: string[];

  @Field(() => Int)
  usageCount: number;

  @Field(() => Date, { nullable: true })
  lastUsedAt?: Date;

  @Field(() => Date)
  createdAt: Date;

  @Field()
  isPublic: boolean;
}

/**
 * Upload response - what client gets after uploading
 */
@ObjectType()
export class UploadMediaResponse {
  @Field()
  mediaId: string;

  @Field()
  filename: string;

  @Field()
  urlOriginal: string;

  @Field()
  urlLarge: string;

  @Field()
  urlMedium: string;

  @Field()
  urlThumbnail: string;

  @Field(() => Int)
  width: number;

  @Field(() => Int)
  height: number;

  @Field(() => Int)
  size: number;

  @Field()
  isDeduped: boolean;
}

/**
 * Generic response for mutations
 */
@ObjectType()
export class DeleteMediaResponse {
  @Field()
  success: boolean;

  @Field({ nullable: true })
  message?: string;
}

// ============================================================================
// INPUT TYPES (GraphQL Mutations)
// ============================================================================

/**
 * Input for paginating library
 */
@InputType()
export class MediaLibraryFilterInput {
  @Field(() => Int, { defaultValue: 0 })
  skip?: number;

  @Field(() => Int, { defaultValue: 20 })
  take?: number;

  @Field({ nullable: true })
  searchTerm?: string;

  @Field(() => [String], { nullable: true })
  tags?: string[];

  @Field({ nullable: true })
  isPublic?: boolean;
}
