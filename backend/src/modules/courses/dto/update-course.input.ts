import { Field, Float, InputType } from '@nestjs/graphql';
import { CourseLevel, CourseStatus } from '@prisma/client'; // ✅ CORRIGÉ
import {
  IsEnum, // ✅ AJOUTÉ
  IsNumber,
  IsOptional,
  IsString,
  Min, // ✅ AJOUTÉ
  MinLength, // ✅ AJOUTÉ
} from 'class-validator';

@InputType()
export class UpdateCourseInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  @MinLength(3) // ✅ AJOUTÉ
  title?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  description?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  stripePriceId?: string;

  // ✅ AJOUTÉ : smallDescription
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  smallDescription?: string;

  @Field(() => Float, { nullable: true })
  @IsNumber()
  @IsOptional()
  @Min(0) // ✅ AJOUTÉ
  price?: number;

  // ✅ AJOUTÉ : category
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  category?: string;

  // ✅ AJOUTÉ : level
  @Field(() => CourseLevel, { nullable: true })
  @IsEnum(CourseLevel)
  @IsOptional()
  level?: CourseLevel;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @Field(() => CourseStatus, { nullable: true })
  @IsEnum(CourseStatus) // ✅ AJOUTÉ : Validation
  @IsOptional()
  status?: CourseStatus;

  @Field()
  @IsString()
  id: string;

  // ✅ AJOUTÉ : duration
  @Field({ nullable: true })
  @IsNumber()
  @IsOptional()
  @Min(0)
  duration?: number;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  requirements?: string; // JSON Tiptap

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  outcomes?: string; // JSON Tiptap
}
