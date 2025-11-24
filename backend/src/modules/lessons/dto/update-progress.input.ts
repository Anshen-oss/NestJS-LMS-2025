import { Field, InputType, Int } from '@nestjs/graphql';
import { Min } from 'class-validator';

@InputType()
export class UpdateProgressInput {
  @Field(() => Int)
  @Min(0)
  watchedDuration: number; // En secondes
}
