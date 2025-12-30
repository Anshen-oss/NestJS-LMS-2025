import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

/**
 * Stats globales pour un instructeur
 * Utilisé dans le dashboard instructor
 */
@ObjectType()
export class InstructorStatsOutput {
  // Statistiques des cours
  @Field(() => Int)
  totalCourses: number;

  @Field(() => Int)
  publishedCourses: number;

  @Field(() => Int)
  draftCourses: number;

  @Field(() => Int)
  archivedCourses: number;

  // Statistiques des étudiants
  @Field(() => Int)
  totalStudents: number;

  @Field(() => Int)
  activeStudents: number; // Étudiants actifs (avec progression récente)

  // Statistiques financières
  @Field(() => Float)
  totalRevenue: number;

  @Field(() => Float)
  monthlyRevenue: number; // Revenue du mois en cours

  // Statistiques d'engagement
  @Field(() => Int)
  totalViews: number; // Total des vues de cours

  @Field(() => Int)
  weeklyViews: number; // Vues de la semaine

  @Field(() => Float)
  averageCompletionRate: number; // Taux de complétion moyen (0-100)

  @Field(() => Float, { nullable: true })
  averageRating: number | null; // Note moyenne (si système de notation)
}
