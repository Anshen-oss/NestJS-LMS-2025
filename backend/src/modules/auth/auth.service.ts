import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  /**
   * Générer un JWT token pour un user
   */
  private async generateToken(user: {
    id: string;
    email?: string | null;
    role: string;
  }): Promise<string> {
    const payload: Record<string, any> = {
      sub: user.id,
      role: user.role,
    };

    if (user.email) {
      payload.email = user.email;
    }

    return this.jwtService.sign(payload);
  }

  /**
   * Valider un JWT et retourner le user
   */
  async validateUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  /**
   * Synchroniser un user Clerk avec la DB
   * (Appelé depuis le webhook Clerk)
   */
  async syncClerkUser(clerkData: {
    clerkId: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    imageUrl?: string;
  }) {
    const { clerkId, email, firstName, lastName, imageUrl } = clerkData;

    // Construire le nom complet
    const name =
      [firstName, lastName].filter(Boolean).join(' ') || email || 'User';

    // Upsert : créer ou mettre à jour
    const user = await this.prisma.user.upsert({
      where: { clerkId },
      update: {
        email,
        name,
        image: imageUrl,
        emailVerified: !!email,
        updatedAt: new Date(),
      },
      create: {
        clerkId,
        email,
        name,
        image: imageUrl,
        emailVerified: !!email,
        role: 'STUDENT', // Rôle par défaut
      },
    });

    return user;
  }

  /**
   * Récupérer un user par son clerkId
   */
  async getUserByClerkId(clerkId: string) {
    return this.prisma.user.findUnique({
      where: { clerkId },
    });
  }
}
