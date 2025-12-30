import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';
import { CourseStatus } from '@prisma/client';

/**
 * Performances détaillées d'un cours pour un instructeur
 * Utilisé dans la liste des cours de l'instructeur
 */
@ObjectType()
export class CoursePerformanceOutput {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field()
  slug: string;

  @Field(() => String, { nullable: true })
  imageUrl?: string | null;

  @Field(() => CourseStatus)
  status: CourseStatus;

  @Field(() => Float)
  price: number;

  // Statistiques d'engagement
  @Field(() => Int)
  studentsCount: number; // Nombre d'étudiants inscrits

  @Field(() => Int)
  activeStudentsCount: number; // Étudiants actifs (avec progression récente)

  @Field(() => Float)
  revenue: number; // Revenue total généré

  @Field(() => Float)
  completionRate: number; // Taux de complétion moyen (0-100)

  // Métriques de contenu
  @Field(() => Int)
  chaptersCount: number;

  @Field(() => Int)
  lessonsCount: number;

  @Field(() => Int, { nullable: true })
  duration?: number | null; // Durée totale en secondes

  // Dates
  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => Date, { nullable: true })
  publishedAt?: Date | null;

  // Métriques optionnelles
  @Field(() => Float, { nullable: true })
  averageRating?: number | null; // Note moyenne (si système de notation)

  @Field(() => Int, { nullable: true })
  reviewsCount?: number | null; // Nombre d'avis
}
