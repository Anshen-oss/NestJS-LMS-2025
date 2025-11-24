import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, Min, MinLength } from 'class-validator';

@InputType()
export class CreateLessonInput {
  @Field()
  @IsNotEmpty()
  @MinLength(3)
  title: string;

  @Field({ nullable: true })
  @IsOptional()
  description?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @Min(1)
  position?: number;

  @Field({ nullable: true })
  @IsOptional()
  thumbnailKey?: string;

  @Field({ nullable: true })
  @IsOptional()
  videoKey?: string;

  @Field({ nullable: true })
  @IsOptional()
  videoUrl?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @Min(0)
  duration?: number;

  @Field({ nullable: true, defaultValue: false })
  @IsOptional()
  isFree?: boolean;
}
