// backend/src/courses/dto/reorder-lessons.input.ts

import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsString, Min } from 'class-validator';

@InputType()
export class LessonPositionInput {
  @Field()
  @IsString()
  id: string;

  @Field(() => Int)
  @IsInt()
  @Min(0)
  position: number;
}

@InputType()
export class ReorderLessonsInput {
  @Field()
  @IsString()
  chapterId: string;

  @Field(() => [LessonPositionInput])
  lessons: LessonPositionInput[];
}
