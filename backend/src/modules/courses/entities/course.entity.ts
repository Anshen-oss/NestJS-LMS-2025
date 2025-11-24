import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';
import { CourseLevel, CourseStatus } from '@prisma/client'; // ✅ Import depuis Prisma
import { User } from '../../auth/entities/user.entity';
import { Chapter } from '../../chapters/entities/chapter.entity';

// ❌ SUPPRIMÉ : Les définitions d'enums (maintenant dans @prisma/client)
// ❌ SUPPRIMÉ : Les registerEnumType (maintenant dans enums.ts)

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

  @Field({ nullable: true })
  imageUrl?: string;

  @Field(() => Float)
  price: number;

  @Field()
  category: string;

  @Field(() => CourseLevel) // ✅ Utilise l'enum Prisma (déjà enregistré dans enums.ts)
  level: CourseLevel;

  @Field(() => CourseStatus) // ✅ Utilise l'enum Prisma (déjà enregistré dans enums.ts)
  status: CourseStatus;

  @Field(() => Int, { nullable: true })
  duration?: number;

  @Field({ nullable: true })
  stripePriceId?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field({ nullable: true })
  publishedAt?: Date; // ✅ AJOUTÉ : Nouveau champ du schéma Prisma

  // ═══════════════════════════════════════════
  //              RELATIONS
  // ═══════════════════════════════════════════
  @Field(() => User)
  createdBy: User;

  @Field(() => [Chapter], { nullable: true })
  chapters?: Chapter[];

  // Champ calculé (optionnel, utile pour l'UI)
  @Field(() => Int, { nullable: true })
  chaptersCount?: number;
}
