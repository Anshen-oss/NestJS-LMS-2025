import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class EnrollmentResponse {
  @Field()
  success: boolean;

  @Field()
  message: string;

  @Field({ nullable: true })
  checkoutUrl?: string;

  @Field({ nullable: true })
  enrollmentId?: string;
}
