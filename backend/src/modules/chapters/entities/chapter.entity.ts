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
  course?: Course | null;

  @Field(() => [Lesson], { nullable: true })
  lessons?: Lesson[] | null;

  // Champs calculés (optionnels)
  @Field(() => Int, { nullable: true })
  lessonsCount?: number | null;

  @Field(() => Int, { nullable: true })
  completedLessonsCount?: number; // Pour l'user courant
}
