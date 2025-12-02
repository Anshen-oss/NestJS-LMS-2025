// backend/src/courses/dto/reorder-lessons.input.ts

import { Field, InputType, Int } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsArray, IsInt, IsString, Min, ValidateNested } from 'class-validator';

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
  @IsArray() // ← Ajoute
  @ValidateNested({ each: true }) // ← Ajoute
  @Type(() => LessonPositionInput)
  lessons: LessonPositionInput[];
}
