import { Field, ID, ObjectType } from '@nestjs/graphql';
import { UserRole } from '@prisma/client'; // ✅ Import depuis Prisma

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field(() => String, { nullable: true }) // ✅ Type explicite
  clerkId?: string | null; // ✅ Accepter null ET undefined

  @Field(() => String, { nullable: true })
  email?: string | null;

  @Field({ nullable: true })
  name?: string;

  // ✅ CORRIGÉ : role est maintenant nullable
  @Field(() => UserRole, { nullable: true })
  role?: UserRole;

  @Field()
  createdAt: Date;
}
