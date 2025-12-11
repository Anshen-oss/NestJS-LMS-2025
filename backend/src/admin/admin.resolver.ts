import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from 'src/modules/auth/entities/user.entity';
import { GqlAuthGuard } from 'src/modules/auth/guards/gql-auth.guard';
import { Course } from 'src/modules/courses/entities/course.entity';
import { AdminGuard } from './admin.guard';
import { AdminService } from './admin.service';
import {
  AdminActionResponse,
  AdminStats,
  UpdateUserRoleInput,
} from './admin.types';

/**
 * 🔐 Resolver Admin - Toutes les routes nécessitent le rôle ADMIN
 *
 * Ce resolver gère :
 * - Les statistiques de la plateforme
 * - La gestion des utilisateurs (rôles, désactivation)
 * - La gestion des cours (suppression)
 * - Les actions administratives
 */
@Resolver()
@UseGuards(GqlAuthGuard, AdminGuard) // Protection double : authentifié + admin
export class AdminResolver {
  constructor(private readonly adminService: AdminService) {}

  // ==================== QUERIES ====================

  /**
   * 📊 Récupérer les statistiques globales de la plateforme
   *
   * @returns {AdminStats} Statistiques agrégées
   */
  @Query(() => AdminStats, {
    description: 'Statistiques globales de la plateforme (ADMIN uniquement)',
  })
  async adminStats(): Promise<AdminStats> {
    return this.adminService.getAdminStats();
  }

  /**
   * 👥 Récupérer tous les utilisateurs avec leurs statistiques
   *
   * @returns {User[]} Liste de tous les utilisateurs
   */
  @Query(() => [User], {
    description: 'Liste de tous les utilisateurs (ADMIN uniquement)',
  })
  @UseGuards(GqlAuthGuard, AdminGuard)
  async users(): Promise<User[]> {
    return this.adminService.getAllUsers();
  }

  /**
   * 📚 Récupérer tous les cours (pour l'admin, pas de filtre published)
   *
   * @returns {Course[]} Liste de tous les cours
   */
  @Query(() => [Course], {
    description: 'Liste de tous les cours, publiés ou non (ADMIN uniquement)',
  })
  async courses(): Promise<Course[]> {
    return this.adminService.getAllCourses() as any; // Type assertion car Prisma retourne le bon format
  }

  // ==================== MUTATIONS ====================

  /**
   * 🔄 Modifier le rôle d'un utilisateur
   *
   * @param {UpdateUserRoleInput} input - ID utilisateur et nouveau rôle
   * @returns {AdminActionResponse} Confirmation de l'action
   */
  @Mutation(() => AdminActionResponse, {
    description: "Modifier le rôle d'un utilisateur (ADMIN uniquement)",
  })
  async updateUserRole(
    @Args('input') input: UpdateUserRoleInput,
  ): Promise<AdminActionResponse> {
    return this.adminService.updateUserRole(input.userId, input.newRole);
  }

  /**
   * 📈 Promouvoir un utilisateur en instructeur
   *
   * @param {string} userId - ID de l'utilisateur à promouvoir
   * @returns {AdminActionResponse} Confirmation de l'action
   */
  @Mutation(() => AdminActionResponse, {
    description: 'Promouvoir un utilisateur en instructeur (ADMIN uniquement)',
  })
  async promoteToInstructor(
    @Args('userId') userId: string,
  ): Promise<AdminActionResponse> {
    return this.adminService.promoteToInstructor(userId);
  }

  /**
   * 🗑️ Supprimer un cours définitivement
   *
   * @param {string} courseId - ID du cours à supprimer
   * @returns {AdminActionResponse} Confirmation de l'action
   */
  @Mutation(() => AdminActionResponse, {
    description: 'Supprimer un cours définitivement (ADMIN uniquement)',
  })
  async deleteCourse(
    @Args('courseId') courseId: string,
  ): Promise<AdminActionResponse> {
    return this.adminService.deleteCourse(courseId);
  }

  /**
   * 🚫 Désactiver un compte utilisateur
   *
   * @param {string} userId - ID de l'utilisateur à désactiver
   * @returns {AdminActionResponse} Confirmation de l'action
   */
  @Mutation(() => AdminActionResponse, {
    description: 'Désactiver un compte utilisateur (ADMIN uniquement)',
  })
  async deactivateUser(
    @Args('userId') userId: string,
  ): Promise<AdminActionResponse> {
    return this.adminService.deactivateUser(userId);
  }
}
