import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { UserRole } from '@prisma/client';

import { MediaAsset } from 'src/modules/media-library/entities/media-asset.entity';
import { UserPreferences } from './user-preferences.entity';

registerEnumType(UserRole, {
  name: 'UserRole',
  description: 'User role in the system',
});

@ObjectType()
export class UserCounts {
  @Field()
  coursesCreated: number;

  @Field()
  enrollments: number;
}

@ObjectType()
export class UserStats {
  @Field()
  totalUsers: number;

  @Field()
  students: number;

  @Field()
  instructors: number;

  @Field()
  admins: number;
}

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field(() => String, { nullable: true })
  clerkId?: string | null;

  @Field(() => String, { nullable: true })
  email?: string | null;

  @Field(() => String, { nullable: true })
  name?: string | null;

  @Field(() => UserRole, { nullable: true })
  role?: UserRole;

  @Field(() => String, { nullable: true })
  image?: string | null;

  @Field(() => Boolean, { nullable: true })
  emailVerified?: boolean | null;

  @Field(() => Boolean, { nullable: true })
  banned?: boolean | null;

  @Field(() => String, { nullable: true })
  banReason?: string | null;

  @Field(() => Date, { nullable: true })
  banExpires?: Date | null;

  @Field(() => String, { nullable: true })
  stripeCustomerId?: string | null;

  // ✅ Champs pour l'ANCIEN système (garder pour compatibilité)
  @Field(() => String, { nullable: true })
  avatarUrl?: string | null;

  @Field(() => String, { nullable: true })
  avatarKey?: string | null;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date, { nullable: true })
  updatedAt?: Date | null;

  @Field(() => UserCounts, { nullable: true })
  _count?: UserCounts;

  // ✅ Champs de profil enrichi
  @Field(() => String, { nullable: true })
  bio?: string | null;

  @Field(() => String, { nullable: true })
  profession?: string | null;

  @Field(() => Date, { nullable: true })
  dateOfBirth?: Date | null;

  @Field(() => Date, { nullable: true })
  lastLoginAt?: Date | null;

  // ✅ Relations
  @Field(() => UserPreferences, { nullable: true })
  preferences?: UserPreferences | null;

  // 🖼️ NOUVEAU SYSTÈME - Avatar MediaAsset
  @Field(() => String, { nullable: true })
  avatarMediaId?: string | null;

  @Field(() => MediaAsset, { nullable: true })
  avatar?: MediaAsset | null;
}
