import { Field, Int, ObjectType } from '@nestjs/graphql';

// ═══════════════════════════════════════════════════════════
// STUDENT RELATED OUTPUTS - VERSION CORRIGÉE
// ═══════════════════════════════════════════════════════════

/**
 * Représente l'inscription d'un étudiant à un cours
 */
@ObjectType('StudentEnrollment')
export class StudentEnrollmentOutput {
  @Field()
  id: string;

  @Field()
  enrolledAt: Date;

  @Field()
  status: string; // ACTIVE, COMPLETED, DROPPED

  @Field(() => Int)
  completionRate: number;

  @Field(() => Int)
  lessonsCompleted: number;

  @Field(() => Int)
  totalLessons: number;

  @Field({ nullable: true })
  lastActivityAt?: Date;
}

/**
 * Progression d'un étudiant dans un cours spécifique
 */
@ObjectType('StudentCourseProgress')
export class StudentCourseProgressOutput {
  @Field()
  courseId: string;

  @Field()
  courseTitle: string;

  @Field()
  courseSlug: string;

  @Field({ nullable: true })
  courseImage?: string;

  @Field()
  price: number;

  @Field(() => StudentEnrollmentOutput)
  enrollment: StudentEnrollmentOutput;
}

/**
 * Réalisation/Achievement d'un étudiant
 */
@ObjectType('StudentAchievement')
export class StudentAchievementOutput {
  @Field()
  id: string;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field()
  unlockedAt: Date;

  @Field({ nullable: true })
  icon?: string;
}

/**
 * Information étudiant dans une liste
 * ⚠️ IMPORTANT: email peut être null (nullable: true)
 */
@ObjectType('StudentListItem')
export class StudentListItemOutput {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true }) // ✅ CORRIGÉ: peut être null
  email?: string;

  @Field({ nullable: true })
  image?: string;

  @Field()
  enrolledAt: Date;

  @Field(() => Int)
  totalCoursesEnrolled: number;

  @Field(() => Int)
  totalCoursesCompleted: number;

  @Field()
  overallCompletionRate: number;

  @Field({ nullable: true })
  lastActivityAt?: Date;

  @Field(() => [StudentCourseProgressOutput])
  courses: StudentCourseProgressOutput[];
}

/**
 * Détails complets d'un étudiant
 */
@ObjectType('StudentDetail')
export class StudentDetailOutput extends StudentListItemOutput {
  @Field()
  joinedAt: Date;

  @Field(() => Int)
  totalTimeSpent: number; // en minutes

  @Field(() => Int)
  averageTimePerLesson: number; // en minutes

  @Field(() => [StudentAchievementOutput])
  achievements: StudentAchievementOutput[];
}

/**
 * Réponse paginée de la liste des étudiants
 */
@ObjectType('StudentListResponse')
export class StudentListResponseOutput {
  @Field(() => [StudentListItemOutput])
  students: StudentListItemOutput[];

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  pageSize: number;
}
