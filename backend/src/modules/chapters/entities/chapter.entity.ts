import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Course } from '../../courses/entities/course.entity';
import { Lesson } from '../../lessons/entities/lesson.entity';

@ObjectType()
export class Chapter {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field(() => Int)
  position: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  // ═══════════════════════════════════════════
  //              RELATIONS
  // ═══════════════════════════════════════════

  @Field(() => Course)
  course: Course;

  @Field(() => [Lesson], { nullable: true })
  lessons?: Lesson[];

  // Champs calculés (optionnels)
  @Field(() => Int, { nullable: true })
  lessonsCount?: number;

  @Field(() => Int, { nullable: true })
  completedLessonsCount?: number; // Pour l'user courant
}
