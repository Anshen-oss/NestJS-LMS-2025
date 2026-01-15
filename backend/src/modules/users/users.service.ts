import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { S3Service } from '../s3/s3.service';
import { UserPreferences } from './entities/user-preferences.entity';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private s3Service: S3Service,
  ) {}

  /**
   * 📊 Récupérer tous les utilisateurs (pour admin)
   */
  async getAllUsers(): Promise<User[]> {
    return this.prisma.user.findMany({
      select: {
        id: true,
        clerkId: true,
        name: true,
        email: true,
        role: true,
        image: true,
        emailVerified: true,
        banned: true,
        createdAt: true,
        updatedAt: true,
        bio: true,
        profession: true,
        dateOfBirth: true,
        lastLoginAt: true,
        _count: {
          select: {
            coursesCreated: true,
            enrollments: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    }) as Promise<User[]>;
  }

  /**
   * 📊 Récupérer un utilisateur par ID
   */
  async getUserById(userId: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        preferences: true,
        coursesCreated: {
          select: {
            id: true,
            title: true,
            status: true,
          },
        },
        enrollments: {
          select: {
            id: true,
            course: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user as User;
  }

  /**
   * 📊 Récupérer l'utilisateur connecté avec ses préférences
   */
  async getCurrentUser(userId: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        preferences: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user as User;
  }

  /**
   * 📝 Mettre à jour le profil utilisateur
   */
  async updateUserProfile(
    userId: string,
    data: {
      bio?: string;
      profession?: string;
      dateOfBirth?: string;
    },
  ): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Validation stricte
    if (data.bio && data.bio.length > 500) {
      throw new BadRequestException('Bio must not exceed 500 characters');
    }

    if (data.profession && data.profession.length > 100) {
      throw new BadRequestException(
        'Profession must not exceed 100 characters',
      );
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        bio: data.bio ?? user.bio,
        profession: data.profession ?? user.profession,
        dateOfBirth: data.dateOfBirth
          ? new Date(data.dateOfBirth)
          : user.dateOfBirth,
      },
      include: {
        preferences: true,
      },
    });

    console.log(`✅ User ${user.email} profile updated`);
    return updatedUser as User;
  }

  /**
   * ⚙️ Mettre à jour les préférences utilisateur
   */
  async updateUserPreferences(
    userId: string,
    data: {
      emailNotifications?: boolean;
      courseUpdates?: boolean;
      weeklyDigest?: boolean;
      marketingEmails?: boolean;
      videoQuality?: string;
      autoplay?: boolean;
      subtitles?: boolean;
      language?: string;
      timezone?: string;
      theme?: string;
    },
  ): Promise<UserPreferences> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Validation des champs spécifiques
    if (
      data.videoQuality &&
      !['auto', '1080p', '720p', '480p', '360p'].includes(data.videoQuality)
    ) {
      throw new BadRequestException('Invalid video quality');
    }

    if (data.theme && !['light', 'dark', 'auto'].includes(data.theme)) {
      throw new BadRequestException('Invalid theme');
    }

    const preferences = await this.prisma.userPreferences.upsert({
      where: { userId },
      update: data,
      create: {
        userId,
        ...data,
      },
    });

    console.log(`⚙️ User ${user.email} preferences updated`);
    return preferences as UserPreferences;
  }

  /**
   * 🔄 Créer les préférences par défaut pour un nouvel utilisateur
   */
  async createDefaultPreferences(userId: string): Promise<UserPreferences> {
    return this.prisma.userPreferences.create({
      data: {
        userId,
      },
    }) as Promise<UserPreferences>;
  }

  /**
   * 👤 Promouvoir un STUDENT en INSTRUCTOR
   */
  async promoteToInstructor(userId: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role !== UserRole.STUDENT) {
      throw new BadRequestException(
        `Cannot promote user with role ${user.role}. User must be a STUDENT.`,
      );
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { role: UserRole.INSTRUCTOR },
    });

    console.log(`✅ User ${user.email} promoted to INSTRUCTOR`);
    return updatedUser as User;
  }

  /**
   * 📄 Changer le rôle d'un utilisateur (ADMIN uniquement)
   */
  async updateUserRole(userId: string, newRole: UserRole): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role === UserRole.ADMIN) {
      throw new BadRequestException('Cannot modify ADMIN role');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    });

    console.log(
      `✅ User ${user.email} role changed from ${user.role} to ${newRole}`,
    );

    return updatedUser as User;
  }

  /**
   * 🚫 Bannir/Débannir un utilisateur
   */
  async banUser(
    userId: string,
    reason?: string,
    expiresAt?: Date,
  ): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role === UserRole.ADMIN) {
      throw new BadRequestException('Cannot ban ADMIN users');
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        banned: true,
        banReason: reason,
        banExpires: expiresAt,
      },
    }) as Promise<User>;
  }

  async unbanUser(userId: string): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        banned: false,
        banReason: null,
        banExpires: null,
      },
    }) as Promise<User>;
  }

  /**
   * 📊 Statistiques des utilisateurs (pour dashboard admin)
   */
  async getUserStats(): Promise<{
    totalUsers: number;
    students: number;
    instructors: number;
    admins: number;
  }> {
    const [totalUsers, students, instructors, admins] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { role: UserRole.STUDENT } }),
      this.prisma.user.count({ where: { role: UserRole.INSTRUCTOR } }),
      this.prisma.user.count({ where: { role: UserRole.ADMIN } }),
    ]);

    return {
      totalUsers,
      students,
      instructors,
      admins,
    };
  }

  /**
   * 🆕 Met à jour l'avatar d'un utilisateur
   *
   * Processus:
   * 1. Valide que l'utilisateur existe
   * 2. Récupère l'ancien avatarKey (pour suppression)
   * 3. Sauvegarde les nouvelles valeurs en BD
   * 4. Supprime l'ancien avatar de S3
   * 5. Retourne l'utilisateur mis à jour
   *
   * @param userId - ID de l'utilisateur
   * @param avatarUrl - URL publique du nouvel avatar (S3)
   * @param avatarKey - Clé S3 du nouvel avatar
   * @returns User mis à jour avec le nouvel avatar
   * @throws NotFoundException si utilisateur n'existe pas
   */
  async updateUserAvatar(
    userId: string,
    avatarUrl: string,
    avatarKey: string,
  ): Promise<User> {
    console.log('🖼️ Mise à jour avatar pour user:', userId);

    // ✅ ÉTAPE 1 : Vérifier que l'utilisateur existe
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`Utilisateur ${userId} non trouvé`);
    }

    // ✅ ÉTAPE 2 : Récupérer l'ancien avatarKey pour suppression
    const oldAvatarKey = user.avatarKey;
    console.log('🔍 Ancien avatarKey:', oldAvatarKey || 'aucun');

    // ✅ ÉTAPE 3 : Sauvegarder les nouvelles valeurs en BD
    console.log('💾 Sauvegarde en BD...');
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        avatarUrl,
        avatarKey,
      },
      include: {
        preferences: true,
      },
    });

    console.log('✅ User sauvegardé en BD');

    // ✅ ÉTAPE 4 : Supprimer l'ancien avatar de S3 (si existe)
    if (oldAvatarKey) {
      console.log('🗑️ Suppression ancien avatar de S3...');
      try {
        await this.s3Service.deleteUserAvatar(oldAvatarKey);
        console.log('✅ Ancien avatar supprimé de S3');
      } catch (error) {
        // Ne pas bloquer si suppression échoue
        console.warn('⚠️ Erreur suppression ancien avatar:', error);
      }
    }

    // ✅ ÉTAPE 5 : Retourner l'utilisateur mis à jour
    console.log('🎉 Avatar mis à jour avec succès');
    return updatedUser;
  }
}
