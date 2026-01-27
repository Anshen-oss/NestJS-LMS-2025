import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class MediaAsset {
  @Field(() => ID)
  id: string;

  @Field()
  key: string;

  @Field()
  filename: string;

  @Field()
  mimeType: string;

  @Field()
  size: number;

  @Field()
  width: number;

  @Field()
  height: number;

  @Field()
  fileHash: string;

  @Field(() => String, { nullable: true })
  description?: string | null;

  @Field(() => [String])
  tags: string[];

  @Field()
  urlOriginal: string;

  @Field()
  urlLarge: string;

  @Field()
  urlMedium: string;

  @Field()
  urlThumbnail: string;

  @Field()
  uploadedById: string;

  @Field()
  isPublic: boolean;

  @Field()
  isDeleted: boolean;

  @Field(() => Date, { nullable: true })
  deletedAt?: Date | null;

  @Field()
  usageCount: number;

  @Field(() => Date, { nullable: true })
  lastUsedAt?: Date | null;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
