import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  /**
   * 📊 Récupérer tous les utilisateurs (pour admin)
   */
  async getAllUsers(): Promise<any[]> {
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
        _count: {
          select: {
            coursesCreated: true,
            enrollments: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * 📊 Récupérer un utilisateur par ID
   */
  async getUserById(userId: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
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

    return user;
  }

  /**
   * 👑 Promouvoir un STUDENT en INSTRUCTOR
   */
  async promoteToInstructor(userId: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Vérifier que c'est un STUDENT
    if (user.role !== UserRole.STUDENT) {
      throw new BadRequestException(
        `Cannot promote user with role ${user.role}. User must be a STUDENT.`,
      );
    }

    // Promouvoir en INSTRUCTOR
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { role: UserRole.INSTRUCTOR },
    });

    console.log(`✅ User ${user.email} promoted to INSTRUCTOR`);

    return updatedUser;
  }

  /**
   * 🔄 Changer le rôle d'un utilisateur (ADMIN uniquement)
   */
  async updateUserRole(userId: string, newRole: UserRole): Promise<any> {
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
      data: { role: newRole }, // ← newRole
    });

    console.log(
      `✅ User ${user.email} role changed from ${user.role} to ${newRole}`,
    );

    return updatedUser;
  }

  /**
   * 🚫 Bannir/Débannir un utilisateur
   */
  async banUser(
    userId: string,
    reason?: string,
    expiresAt?: Date,
  ): Promise<any> {
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
    });
  }

  async unbanUser(userId: string): Promise<any> {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        banned: false,
        banReason: null,
        banExpires: null,
      },
    });
  }

  /**
   * 📊 Statistiques des utilisateurs (pour dashboard admin)
   */
  async getUserStats(): Promise<any> {
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
}
