import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserRole } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { ClerkGqlGuard } from '../auth/guards/clerk-gql.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import {
  PromoteUserInput,
  UpdateUserRoleInput,
} from './dto/promote-user.input'; // ← Import local

import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Resolver(() => User)
@UseGuards(ClerkGqlGuard, RolesGuard)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  /**
   * 📊 Query : Récupérer tous les utilisateurs (ADMIN uniquement)
   */
  @Query(() => [User], { description: 'Get all users (ADMIN only)' })
  @Roles(UserRole.ADMIN)
  async getAllUsers(): Promise<User[]> {
    return this.usersService.getAllUsers();
  }

  /**
   * 📊 Query : Récupérer un utilisateur par ID
   */
  @Query(() => User, { description: 'Get user by ID' })
  @Roles(UserRole.ADMIN)
  async getUserById(@Args('userId') userId: string): Promise<User> {
    return this.usersService.getUserById(userId);
  }

  /**
   * 📊 Query : Statistiques des utilisateurs (ADMIN)
   */
  @Query(() => UserStats, { description: 'Get user statistics' })
  @Roles(UserRole.ADMIN)
  async getUserStats() {
    return this.usersService.getUserStats();
  }

  /**
   * 👑 Mutation : Promouvoir STUDENT → INSTRUCTOR
   */
  @Mutation(() => User, {
    description: 'Promote STUDENT to INSTRUCTOR (ADMIN only)',
  })
  @Roles(UserRole.ADMIN)
  async promoteToInstructor(
    @Args('input') input: PromoteUserInput,
    @CurrentUser() admin: any,
  ): Promise<User> {
    console.log(`🔐 Admin ${admin.email} promoting user ${input.userId}`);
    return this.usersService.promoteToInstructor(input.userId);
  }

  /**
   * 🔄 Mutation : Changer le rôle d'un utilisateur
   */
  @Mutation(() => User, { description: 'Update user role (ADMIN only)' })
  @Roles(UserRole.ADMIN)
  async updateUserRole(
    @Args('input') input: UpdateUserRoleInput,
    @CurrentUser() admin: any,
  ): Promise<User> {
    console.log(
      `🔐 Admin ${admin.email} changing role of user ${input.userId} to ${input.newRole}`,
    );
    return this.usersService.updateUserRole(input.userId, input.newRole); // ← newRole au lieu de role
  }

  /**
   * 🚫 Mutation : Bannir un utilisateur
   */
  @Mutation(() => User, { description: 'Ban user (ADMIN only)' })
  @Roles(UserRole.ADMIN)
  async banUser(
    @Args('userId') userId: string,
    @Args('reason', { nullable: true }) reason?: string,
    @Args('expiresAt', { nullable: true }) expiresAt?: Date,
  ): Promise<User> {
    return this.usersService.banUser(userId, reason, expiresAt);
  }

  /**
   * ✅ Mutation : Débannir un utilisateur
   */
  @Mutation(() => User, { description: 'Unban user (ADMIN only)' })
  @Roles(UserRole.ADMIN)
  async unbanUser(@Args('userId') userId: string): Promise<User> {
    return this.usersService.unbanUser(userId);
  }
}

// Type pour les stats
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
class UserStats {
  @Field(() => Int)
  totalUsers: number;

  @Field(() => Int)
  students: number;

  @Field(() => Int)
  instructors: number;

  @Field(() => Int)
  admins: number;
}
