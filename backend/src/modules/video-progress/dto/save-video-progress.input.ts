import { Field, Float, InputType } from '@nestjs/graphql';
import { IsNumber, IsString, Min } from 'class-validator';

@InputType()
export class SaveVideoProgressInput {
  @Field()
  @IsString()
  lessonId: string;

  @Field(() => Float)
  @IsNumber()
  @Min(0)
  currentTime: number;

  @Field(() => Float)
  @IsNumber()
  @Min(0)
  duration: number;
}
