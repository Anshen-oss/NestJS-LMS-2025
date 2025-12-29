import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from 'src/modules/users/entities/user.entity';
import { Course } from '../../courses/entities/course.entity';

@ObjectType()
export class Enrollment {
  @Field(() => ID)
  id: string;

  @Field()
  userId: string;

  @Field()
  courseId: string;

  @Field(() => Course)
  course: Course;

  @Field(() => User, { nullable: true })
  user?: User;

  @Field()
  status: string;

  @Field()
  createdAt: Date;

  @Field(() => Date, { nullable: true })
  completedAt?: Date | null;

  @Field(() => Date, { nullable: true })
  expiresAt?: Date | null;
}
