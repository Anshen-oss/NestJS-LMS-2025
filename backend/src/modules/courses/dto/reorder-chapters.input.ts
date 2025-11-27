// backend/src/courses/dto/reorder-chapters.input.ts

import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsString, Min } from 'class-validator';

@InputType()
export class ChapterPositionInput {
  @Field()
  @IsString()
  id: string;

  @Field(() => Int)
  @IsInt()
  @Min(0)
  position: number;
}

@InputType()
export class ReorderChaptersInput {
  @Field()
  @IsString()
  courseId: string;

  @Field(() => [ChapterPositionInput])
  chapters: ChapterPositionInput[];
}
