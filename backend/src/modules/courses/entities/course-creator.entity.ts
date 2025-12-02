// backend/src/courses/entities/course-creator.entity.ts

import { Field, ObjectType } from '@nestjs/graphql';
import { UserRole } from '@prisma/client';

@ObjectType()
export class CourseCreator {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field(() => UserRole) // ← Ajout du champ role
  role: UserRole;
}
