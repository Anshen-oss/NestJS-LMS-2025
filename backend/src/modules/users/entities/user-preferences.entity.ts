import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserPreferences {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  userId: string;

  @Field(() => Boolean)
  emailNotifications: boolean;

  @Field(() => Boolean)
  courseUpdates: boolean;

  @Field(() => Boolean)
  weeklyDigest: boolean;

  @Field(() => Boolean)
  marketingEmails: boolean;

  @Field(() => String)
  videoQuality: string;

  @Field(() => Boolean)
  autoplay: boolean;

  @Field(() => Boolean)
  subtitles: boolean;

  @Field(() => String)
  language: string;

  @Field(() => String)
  timezone: string;

  @Field(() => String)
  theme: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
