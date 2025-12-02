// backend/src/courses/dto/update-lesson.input.ts

import { Field, InputType, Int } from '@nestjs/graphql';
import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';

@InputType()
export class UpdateLessonInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  title?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  description?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  content?: string; // JSON Tiptap

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  @Min(0)
  position?: number;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  videoUrl?: string;

  @Field({ nullable: true })
  @IsInt()
  @IsOptional()
  @Min(0)
  duration?: number; // en secondes

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  isFree?: boolean;
}
