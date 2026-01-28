import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { MediaLibraryService } from '../media-library/services/media-library.service';
import { UserPreferences } from './entities/user-preferences.entity';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private mediaLibraryService: MediaLibraryService,
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
        avatar: true,
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
        avatar: true,
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
        avatar: true,
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
      include: {
        avatar: true,
      },
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
      include: {
        avatar: true,
      },
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
      include: {
        avatar: true,
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
      include: {
        avatar: true,
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
   * 🖼️ Met à jour l'avatar d'un utilisateur avec un MediaAsset
   *
   * Processus:
   * 1. Valide que l'utilisateur existe
   * 2. Valide que le MediaAsset existe
   * 3. Met à jour la relation avatarMediaId
   * 4. Retourne l'utilisateur avec son avatar mis à jour
   *
   * @param userId - ID de l'utilisateur
   * @param avatarMediaId - ID du MediaAsset à utiliser comme avatar
   * @returns User mis à jour avec la relation avatar
   * @throws NotFoundException si utilisateur ou MediaAsset n'existe pas
   */
  async updateUserAvatar(userId: string, avatarMediaId: string): Promise<User> {
    console.log('🖼️ Mise à jour avatar pour user:', userId);
    console.log('📸 Avatar MediaId:', avatarMediaId);

    // ✅ Vérifier que l'utilisateur existe
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`Utilisateur ${userId} non trouvé`);
    }

    // ✅ Vérifier que le MediaAsset existe
    const mediaAsset = await this.prisma.mediaAsset.findUnique({
      where: { id: avatarMediaId },
    });

    if (!mediaAsset) {
      throw new NotFoundException(`MediaAsset ${avatarMediaId} non trouvé`);
    }

    // ✅ Mettre à jour la relation avatarMediaId
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        avatarMediaId,
      },
      include: {
        preferences: true,
        avatar: true,
      },
    });

    console.log('✅ Avatar mis à jour avec succès');
    console.log('🖼️ Avatar URL:', mediaAsset.urlLarge || mediaAsset.urlMedium);

    return updatedUser as User;
  }
  async getUserWithAvatar(userId: string) {
    console.log('🔍 getUserWithAvatar:', userId);

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        avatar: {
          select: {
            id: true,
            urlMedium: true,
            urlLarge: true,
          },
        },
      },
    });

    return user;
  }

  async getUserMedia(userId: string, limit: number = 50) {
    try {
      console.log(
        `📸 getUserMedia called for userId: ${userId}, limit: ${limit}`,
      );

      const assets = await this.prisma.mediaAsset.findMany({
        where: { uploadedById: userId },
        select: {
          id: true,
          filename: true,
          urlMedium: true,
          urlLarge: true,
        },
        take: limit,
        orderBy: { createdAt: 'desc' },
      });

      console.log(`📸 Found ${assets.length} images`);
      return { assets };
    } catch (error) {
      console.error('❌ Error in getUserMedia:', error);
      throw error;
    }
  }

  // src/modules/users/users.service.ts

  async uploadAvatarFile(
    userId: string,
    file: Express.Multer.File,
  ): Promise<any> {
    try {
      console.log(`📤 Uploading file: ${file.originalname}`);

      // ✅ Utilise uploadMedia avec file.buffer
      const mediaAsset = await this.mediaLibraryService.uploadMedia(
        file.buffer, // ✅ Buffer du fichier
        file.originalname,
        userId,
      );

      console.log('✅ File uploaded:', mediaAsset.mediaId);

      return {
        success: true,
        media: {
          id: mediaAsset.mediaId,
          filename: mediaAsset.filename,
          urlMedium: mediaAsset.urlMedium,
          urlLarge: mediaAsset.urlLarge,
        },
      };
    } catch (error) {
      console.error('❌ Upload error:', error);
      throw error;
    }
  }
}
