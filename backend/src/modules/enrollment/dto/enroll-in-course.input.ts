import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class EnrollInCourseInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  courseId: string;
}
