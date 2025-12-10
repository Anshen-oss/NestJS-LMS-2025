import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class LessonPositionInput {
  @Field()
  id: string;

  @Field(() => Int)
  order: number;
}
