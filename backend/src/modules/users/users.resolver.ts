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
} from './dto/promote-user.input';

import { Field, Int, ObjectType } from '@nestjs/graphql';
import { UpdateUserPreferencesInput } from './dto/update-user-preferences.input';
import { UpdateUserProfileInput } from './dto/update-user-profile.input';
import { UserPreferences } from './entities/user-preferences.entity';

import { User } from './entities/user.entity';
import { UsersService } from './users.service';

// 🖼️ TYPE GRAPHQL POUR LA MUTATION
@ObjectType('UpdateUserAvatarResponse')
class UpdateUserAvatarResponse {
  @Field()
  success: boolean;

  @Field(() => User, { nullable: true })
  user?: User;

  @Field({ nullable: true })
  message?: string;
}

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
   * 📊 Query : Récupérer l'utilisateur connecté
   */
  @Query(() => User, { description: 'Get current user profile' })
  async getCurrentUser(@CurrentUser() user: any): Promise<User> {
    return this.usersService.getCurrentUser(user.id);
  }

  /**
   * 📝 Mutation : Mettre à jour le profil
   */
  @Mutation(() => User, { description: 'Update user profile' })
  async updateUserProfile(
    @Args('input') input: UpdateUserProfileInput,
    @CurrentUser() user: any,
  ): Promise<User> {
    console.log(`🖊️ User ${user.email} updating profile`);
    return this.usersService.updateUserProfile(user.id, input);
  }

  /**
   * ⚙️ Mutation : Mettre à jour les préférences
   */
  @Mutation(() => UserPreferences, { description: 'Update user preferences' })
  async updateUserPreferences(
    @Args('input') input: UpdateUserPreferencesInput,
    @CurrentUser() user: any,
  ): Promise<UserPreferences> {
    console.log(`⚙️ User ${user.email} updating preferences`);
    return this.usersService.updateUserPreferences(user.id, input);
  }

  /**
   * 👤 Mutation : Promouvoir STUDENT → INSTRUCTOR
   */
  @Mutation(() => User, {
    description: 'Promote STUDENT to INSTRUCTOR (ADMIN only)',
  })
  @Roles(UserRole.ADMIN)
  async promoteToInstructor(
    @Args('input') input: PromoteUserInput,
    @CurrentUser() admin: any,
  ): Promise<User> {
    console.log(`📝 Admin ${admin.email} promoting user ${input.userId}`);
    return this.usersService.promoteToInstructor(input.userId);
  }

  /**
   * 📄 Mutation : Changer le rôle d'un utilisateur
   */
  @Mutation(() => User, { description: 'Update user role (ADMIN only)' })
  @Roles(UserRole.ADMIN)
  async updateUserRole(
    @Args('input') input: UpdateUserRoleInput,
    @CurrentUser() admin: any,
  ): Promise<User> {
    console.log(
      `📝 Admin ${admin.email} changing role of user ${input.userId} to ${input.newRole}`,
    );
    return this.usersService.updateUserRole(input.userId, input.newRole);
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

  /**
   * 🖼️ Met à jour l'avatar de l'utilisateur actuellement authentifié
   *
   * Processus:
   * 1. Récupère l'utilisateur authentifié
   * 2. Appelle users.service.updateUserAvatar()
   * 3. Retourne l'utilisateur mis à jour avec la relation avatar
   *
   * @param currentUser - L'utilisateur authentifié (injecté par @CurrentUser)
   * @param avatarMediaId - ID du MediaAsset à utiliser comme avatar
   * @returns UpdateUserAvatarResponse avec user et avatar mis à jour
   */
  @Mutation(() => UpdateUserAvatarResponse, {
    description:
      "Met à jour l'avatar de l'utilisateur actuellement authentifié",
  })
  @UseGuards(ClerkGqlGuard)
  async updateUserAvatar(
    @CurrentUser() currentUser: User,
    @Args('avatarMediaId') avatarMediaId: string,
  ): Promise<UpdateUserAvatarResponse> {
    console.log('🖼️ Mutation updateUserAvatar pour user:', currentUser.id);

    try {
      const updatedUser = await this.usersService.updateUserAvatar(
        currentUser.id,
        avatarMediaId,
      );

      return {
        success: true,
        user: updatedUser,
        message: 'Avatar mis à jour avec succès',
      };
    } catch (error) {
      console.error('❌ Erreur mise à jour avatar:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Erreur',
      };
    }
  }
}

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
