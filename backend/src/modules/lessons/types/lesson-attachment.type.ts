import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class LessonAttachment {
  @Field()
  id: string;

  @Field()
  lessonId: string;

  @Field()
  fileName: string;

  @Field()
  fileUrl: string;

  @Field(() => Int)
  fileSize: number;

  @Field()
  fileType: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
