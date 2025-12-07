import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsString } from 'class-validator';

@InputType()
export class CreateLessonAttachmentInput {
  @Field()
  @IsString()
  lessonId: string;

  @Field()
  @IsString()
  fileName: string;

  @Field()
  @IsString()
  fileUrl: string;

  @Field(() => Int)
  @IsInt()
  fileSize: number;

  @Field()
  @IsString()
  fileType: string;
}
