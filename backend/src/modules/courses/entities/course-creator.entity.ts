// backend/src/courses/entities/course-creator.entity.ts

import { Field, ObjectType } from '@nestjs/graphql';
import { UserRole } from '@prisma/client';

@ObjectType()
export class CourseCreator {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field(() => String, { nullable: true })
  email?: string | null;

  @Field(() => UserRole) // ← Ajout du champ role
  role: UserRole;
}
