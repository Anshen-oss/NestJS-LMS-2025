import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, Min, MinLength } from 'class-validator';

@InputType()
export class CreateChapterInput {
  @Field()
  @IsNotEmpty()
  @MinLength(3)
  title: string;

  @Field({ nullable: true })
  @IsOptional()
  description?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @Min(0)
  position?: number; // ⬅️ Chapter utilise 'position'
}
