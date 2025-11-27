// backend/src/courses/entities/course-creator.entity.ts

import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CourseCreator {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;
}
