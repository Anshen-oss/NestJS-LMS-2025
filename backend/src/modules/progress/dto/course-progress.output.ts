import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType() // ⬅️ IMPORTANT : @ObjectType() pas @InputType()
export class CourseProgressOutput {
  @Field(() => Int)
  completedCount: number;

  @Field(() => Int)
  totalCount: number;

  @Field(() => Int)
  percentage: number;
}
