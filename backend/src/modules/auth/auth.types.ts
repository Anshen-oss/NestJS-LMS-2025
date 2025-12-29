import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../users/entities/user.entity';

@ObjectType()
export class UpdateUserRolePayload {
  @Field()
  success: boolean;

  @Field()
  message: string;

  @Field(() => User, { nullable: true })
  user?: User;
}
