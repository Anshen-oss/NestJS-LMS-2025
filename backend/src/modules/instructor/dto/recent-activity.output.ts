import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';

/**
 * Type d'activité
 */
export enum ActivityType {
  ENROLLMENT = 'ENROLLMENT', // Nouvelle inscription
  COMPLETION = 'COMPLETION', // Cours complété
  LESSON_COMPLETED = 'LESSON_COMPLETED', // Leçon complétée
  REVIEW = 'REVIEW', // Nouvel avis (si implémenté)
  QUESTION = 'QUESTION', // Nouvelle question (si implémenté)
}

// Enregistrer l'enum pour GraphQL
registerEnumType(ActivityType, {
  name: 'ActivityType',
  description: "Type d'activité récente",
});

/**
 * Représente un étudiant minimal dans une activité
 */
@ObjectType()
export class ActivityStudent {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field(() => String, { nullable: true })
  image?: string | null;
}

/**
 * Représente un cours minimal dans une activité
 */
@ObjectType()
export class ActivityCourse {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field()
  slug: string;
}

/**
 * Représente une activité récente dans le dashboard instructeur
 */
@ObjectType()
export class RecentActivityOutput {
  @Field(() => ID)
  id: string;

  @Field(() => ActivityType)
  type: ActivityType;

  @Field(() => ActivityStudent)
  student: ActivityStudent;

  @Field(() => ActivityCourse)
  course: ActivityCourse;

  @Field()
  createdAt: Date;

  // Données optionnelles selon le type d'activité
  @Field(() => String, { nullable: true })
  lessonTitle?: string | null; // Pour LESSON_COMPLETED

  @Field(() => String, { nullable: true })
  reviewText?: string | null; // Pour REVIEW

  @Field(() => Number, { nullable: true })
  rating?: number | null; // Pour REVIEW
}
