// src/modules/users/dto/promote-user.input.ts

import { Field, InputType } from '@nestjs/graphql';
import { UserRole } from '@prisma/client';
import { IsEnum, IsUUID } from 'class-validator';

@InputType()
export class PromoteUserInput {
  @Field()
  @IsUUID()
  userId: string;
}

@InputType()
export class UpdateUserRoleInput {
  @Field(() => String, { description: "ID de l'utilisateur" })
  @IsUUID()
  userId: string;

  @Field(() => UserRole, { description: 'Nouveau rôle à attribuer' })
  @IsEnum(UserRole)
  newRole: UserRole; // ← newRole pour matcher ton code existant
}
