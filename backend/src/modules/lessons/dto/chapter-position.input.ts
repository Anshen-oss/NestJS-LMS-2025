import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class ChapterPositionInput {
  @Field()
  id: string;

  @Field(() => Int)
  position: number; // ⬅️ Chapter utilise 'position'
}
