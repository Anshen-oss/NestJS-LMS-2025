import { Field, Float, ID, ObjectType } from '@nestjs/graphql';
import { User } from 'src/modules/users/entities/user.entity';
import { Lesson } from '../../lessons/entities/lesson.entity';

@ObjectType()
export class VideoProgress {
  @Field(() => ID)
  id: string;

  @Field()
  userId: string;

  @Field(() => User, { nullable: true })
  user?: User;

  @Field()
  lessonId: string;

  @Field(() => Lesson, { nullable: true })
  lesson?: Lesson;

  @Field(() => Float)
  currentTime: number;

  @Field(() => Float)
  duration: number;

  @Field(() => Float)
  progressPercent: number;

  @Field()
  isCompleted: boolean;

  @Field(() => Date, { nullable: true }) // ✅ Type explicite
  completedAt?: Date | null; // ✅ Accepte null ET undefined

  @Field()
  lastWatchedAt: Date;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
