import { Field, Float, InputType } from '@nestjs/graphql';
import { CourseLevel } from '@prisma/client'; // ✅ AJOUTÉ
import {
  IsEnum, // ✅ AJOUTÉ
  IsNumber,
  IsOptional,
  IsString,
  Min, // ✅ AJOUTÉ
  MinLength,
} from 'class-validator';

@InputType()
export class CreateCourseInput {
  @Field()
  @IsString()
  @MinLength(3)
  title: string;

  @Field()
  @IsString()
  description: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  smallDescription?: string;

  @Field(() => Float)
  @IsNumber()
  @Min(0) // ✅ AJOUTÉ : Prix ne peut pas être négatif
  price: number;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  stripePriceId?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  category?: string;

  // ✅ AJOUTÉ : Le champ level
  @Field(() => CourseLevel, { nullable: true })
  @IsEnum(CourseLevel, {
    message: 'Level must be Beginner, Intermediate, or Advanced',
  })
  @IsOptional()
  level?: CourseLevel;

  // ✅ AJOUTÉ : imageUrl
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  imageUrl?: string;
}
