// backend/src/courses/dto/create-lesson.input.ts

import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

@InputType()
export class CreateLessonInput {
  @Field()
  @IsString()
  chapterId: string; // Le chapitre parent

  @Field()
  @IsString()
  @MinLength(3)
  title: string;

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
  position?: number; // Si non fourni, on mettra à la fin

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
