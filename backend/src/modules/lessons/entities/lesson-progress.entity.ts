import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { User } from '../../auth/entities/user.entity';
import { Lesson } from './lesson.entity';

@ObjectType()
export class LessonProgress {
  @Field(() => ID)
  id: string;

  @Field({ defaultValue: false })
  isCompleted: boolean;

  @Field({ nullable: true })
  completedAt?: Date;

  // Tracking avancé
  @Field(() => Int, { nullable: true })
  watchedDuration?: number; // Secondes regardées

  @Field({ nullable: true })
  lastWatchedAt?: Date;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  // ═══════════════════════════════════════════
  //              RELATIONS
  // ═══════════════════════════════════════════

  @Field(() => User)
  user: User;

  @Field(() => Lesson)
  lesson: Lesson;
}
