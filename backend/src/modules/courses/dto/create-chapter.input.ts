import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator';

@InputType()
export class CreateChapterInput {
  @Field()
  @IsString()
  courseId: string; // Le cours parent

  @Field()
  @IsString()
  @MinLength(3)
  title: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  description?: string;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  @Min(0)
  position?: number; // Si non fourni, on mettra à la fin
}
