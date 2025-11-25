import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';
import { CourseLevel, CourseStatus } from '@prisma/client';
import { User } from '../../auth/entities/user.entity';
import { Chapter } from '../../chapters/entities/chapter.entity';

@ObjectType()
export class Course {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field()
  slug: string;

  @Field()
  description: string;

  @Field()
  smallDescription: string;

  @Field(() => String, { nullable: true }) // ← Type explicite
  imageUrl?: string | null;

  @Field(() => Float)
  price: number;

  @Field()
  category: string;

  @Field(() => CourseLevel)
  level: CourseLevel;

  @Field(() => CourseStatus)
  status: CourseStatus;

  @Field(() => Int, { nullable: true })
  duration?: number | null;

  @Field(() => String, { nullable: true }) // ← Type explicite
  stripePriceId?: string | null;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => Date, { nullable: true })
  publishedAt?: Date | null;

  // ═══════════════════════════════════════════
  //              RELATIONS
  // ═══════════════════════════════════════════
  @Field(() => User, { nullable: true })
  createdBy?: User | null;

  @Field(() => [Chapter], { nullable: true })
  chapters?: Chapter[] | null;

  @Field(() => Int, { nullable: true })
  chaptersCount?: number | null;
}
