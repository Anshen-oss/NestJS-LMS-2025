import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class LessonProgress {
  @Field(() => ID)
  id: string;

  @Field()
  userId: string;

  @Field()
  lessonId: string;

  @Field()
  courseId: string;

  @Field()
  completed: boolean;

  @Field({ nullable: true })
  completedAt?: Date;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
