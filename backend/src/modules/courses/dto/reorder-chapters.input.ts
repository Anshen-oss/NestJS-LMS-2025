// backend/src/courses/dto/reorder-chapters.input.ts

import { Field, InputType, Int } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsArray, IsInt, IsString, Min, ValidateNested } from 'class-validator';

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
  @IsArray() // ← Ajoute
  @ValidateNested({ each: true }) // ← Ajoute
  @Type(() => ChapterPositionInput)
  @Field(() => [ChapterPositionInput])
  chapters: ChapterPositionInput[];
}
