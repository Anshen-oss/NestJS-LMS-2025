import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';
import { CourseLevel, CourseStatus } from '@prisma/client';
import { Chapter } from '../../chapters/entities/chapter.entity';
import { CourseCreator } from './course-creator.entity';

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

  @Field(() => String, { nullable: true })
  requirements?: string | null;

  @Field(() => String, { nullable: true })
  outcomes?: string | null;

  @Field(() => String, { nullable: true })
  imageUrl?: string | null;

  @Field(() => String, { nullable: true })
  fileKey?: string | null;

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

  @Field() // 🆕 AJOUTER CE CHAMP
  userId: string;

  // ═══════════════════════════════════════════
  //              RELATIONS
  // ═══════════════════════════════════════════
  @Field(() => CourseCreator) // ✅ MODIFIÉ (était User)
  createdBy: CourseCreator;

  @Field(() => [Chapter], { nullable: true })
  chapters?: Chapter[] | null;

  @Field(() => Int, { nullable: true })
  chaptersCount?: number | null;

  @Field(() => Int, { nullable: true })
  enrollmentsCount?: number;

  @Field(() => Float, { nullable: true })
  totalRevenue?: number | null;
}
