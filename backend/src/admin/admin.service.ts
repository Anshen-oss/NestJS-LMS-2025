import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AdminActionResponse, AdminStats } from './admin.types';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  /**
   * 📊 Récupérer les statistiques globales de la plateforme
   */
  async getAdminStats(): Promise<AdminStats> {
    // Compter tous les utilisateurs
    const totalUsers = await this.prisma.user.count();

    // Compter tous les cours
    const totalCourses = await this.prisma.course.count();

    // Compter les étudiants actifs (ayant au moins une inscription)
    const activeStudents = await this.prisma.user.count({
      where: {
        enrollments: {
          some: {}, // Au moins une inscription
        },
      },
    });

    // Récupérer toutes les inscriptions avec les cours pour calculer le revenu
    const enrollments = await this.prisma.enrollment.findMany({
      include: {
        course: {
          select: {
            price: true,
          },
        },
      },
    });

    // Calculer le revenu total
    const totalRevenue = enrollments.reduce((sum, enrollment) => {
      return sum + (enrollment.course?.price || 0);
    }, 0);

    // Nombre total d'inscriptions
    const recentEnrollments = enrollments.length;

    return {
      totalUsers,
      totalCourses,
      totalRevenue,
      activeStudents,
      recentEnrollments,
    };
  }

  /**
   * 👥 Récupérer tous les utilisateurs avec leurs statistiques
   */
  async getAllUsers() {
    return this.prisma.user.findMany({
      include: {
        _count: {
          select: {
            enrollments: true,
            coursesCreated: true, // ✅ CORRIGÉ : c'est 'coursesCreated' dans le schema
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * 📚 Récupérer tous les cours avec leurs statistiques
   */
  async getAllCourses() {
    return this.prisma.course.findMany({
      include: {
        createdBy: {
          // ✅ CORRIGÉ : c'est 'createdBy' pas 'instructor'
          select: {
            id: true,
            name: true,
            email: true,
            role: true, // Inclure le role pour CourseCreator
          },
        },
        _count: {
          select: {
            enrollments: true,
            chapters: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * 🔄 Modifier le rôle d'un utilisateur
   */
  async updateUserRole(
    userId: string,
    newRole: UserRole,
  ): Promise<AdminActionResponse> {
    // Vérifier que l'utilisateur existe
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(
        `Utilisateur avec l'ID ${userId} introuvable`,
      );
    }

    // Ne pas permettre de changer le rôle d'un admin (pour éviter de se bloquer)
    if (user.role === UserRole.ADMIN && newRole !== UserRole.ADMIN) {
      throw new BadRequestException(
        'Impossible de rétrograder un administrateur. Contactez un super-admin.',
      );
    }

    // Mettre à jour le rôle
    await this.prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    });

    return {
      success: true,
      message: `Rôle de ${user.name} modifié en ${newRole} avec succès`,
    };
  }

  /**
   * 🗑️ Supprimer un cours (soft delete recommandé en production)
   */
  async deleteCourse(courseId: string): Promise<AdminActionResponse> {
    // Vérifier que le cours existe
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: {
        _count: {
          select: {
            enrollments: true,
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundException(`Cours avec l'ID ${courseId} introuvable`);
    }

    // Avertir si le cours a des inscriptions
    if (course._count.enrollments > 0) {
      throw new BadRequestException(
        `Impossible de supprimer ce cours : ${course._count.enrollments} étudiants y sont inscrits. Dépubliez-le d'abord.`,
      );
    }

    // Supprimer le cours (cascade configuré dans Prisma schema)
    await this.prisma.course.delete({
      where: { id: courseId },
    });

    return {
      success: true,
      message: `Cours "${course.title}" supprimé avec succès`,
    };
  }

  /**
   * 🚫 Désactiver un compte utilisateur
   */
  async deactivateUser(userId: string): Promise<AdminActionResponse> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(
        `Utilisateur avec l'ID ${userId} introuvable`,
      );
    }

    // Ne pas permettre de désactiver un admin
    if (user.role === UserRole.ADMIN) {
      throw new BadRequestException(
        'Impossible de désactiver un compte administrateur',
      );
    }

    // TODO: Ajouter un champ "isActive" dans le schema Prisma
    // Pour l'instant, on peut juste retourner un message
    // await this.prisma.user.update({
    //   where: { id: userId },
    //   data: { isActive: false },
    // });

    return {
      success: true,
      message: `Compte de ${user.name} désactivé (fonctionnalité à implémenter dans le schema)`,
    };
  }

  /**
   * 📈 Promouvoir un utilisateur en instructeur
   */
  async promoteToInstructor(userId: string): Promise<AdminActionResponse> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(
        `Utilisateur avec l'ID ${userId} introuvable`,
      );
    }

    if (user.role === UserRole.INSTRUCTOR) {
      throw new BadRequestException('Cet utilisateur est déjà instructeur');
    }

    if (user.role === UserRole.ADMIN) {
      throw new BadRequestException(
        'Un administrateur ne peut pas être instructeur',
      );
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { role: UserRole.INSTRUCTOR },
    });

    return {
      success: true,
      message: `${user.name} a été promu instructeur avec succès`,
    };
  }
}
