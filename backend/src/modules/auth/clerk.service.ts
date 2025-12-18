import { verifyToken } from '@clerk/backend';
import { clerkClient } from '@clerk/clerk-sdk-node';
import { Injectable, Logger } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ClerkService {
  private readonly logger = new Logger(ClerkService.name);

  constructor(private prisma: PrismaService) {}

  // async verifyToken(token: string) {
  //   try {
  //     const clerkUser = await clerkClient.users.getUser(token);
  //     return clerkUser;
  //   } catch (error) {
  //     this.logger.error('Error verifying Clerk token:', error);
  //     return null;
  //   }
  // }
  // ⬇️ ajoute cet import en haut de ton fichier

  async verifyToken(token: string) {
    try {
      // 1) Vérifier la signature JWT (Clerk)
      const { payload } = await verifyToken(token, {
        jwtKey: process.env.CLERK_JWT_KEY, // ✅ recommandé (sans appel réseau)
        // sinon tu peux omettre jwtKey et Clerk ira chercher le JWKS (appel réseau)
      });

      const userId = (payload as any).sub as string | undefined;
      if (!userId) return null;

      // 2) Récupérer l'utilisateur Clerk (vrai User object)
      const clerkUser = await clerkClient.users.getUser(userId);
      return clerkUser;
    } catch (error) {
      this.logger.error('Error verifying Clerk token:', error);
      return null;
    }
  }

  // ========================================
  // MÉTHODES WEBHOOK (nouvelles)
  // ========================================

  async handleUserCreated(clerkUser: any) {
    this.logger.log(`Upserting user in DB: ${clerkUser.id}`);

    const firstName = clerkUser.first_name || '';
    const lastName = clerkUser.last_name || '';
    const name = `${firstName} ${lastName}`.trim() || 'Utilisateur';

    const emails = clerkUser.email_addresses ?? [];
    const primary =
      emails.find((e: any) => e.id === clerkUser.primary_email_address_id) ??
      emails[0] ??
      null;

    const email = primary?.email_address ?? null;
    const emailVerified = primary?.verification?.status === 'verified';

    const user = await this.prisma.user.upsert({
      where: { clerkId: clerkUser.id },
      create: {
        clerkId: clerkUser.id,
        email, // string | null
        name,
        emailVerified,
        image: clerkUser.image_url ?? null,
        role: UserRole.STUDENT,
      },
      update: {
        email,
        name,
        emailVerified,
        image: clerkUser.image_url ?? null,
      },
    });

    // Ne set le rôle que s’il n’existe pas déjà côté Clerk
    if (!clerkUser.public_metadata?.role) {
      await clerkClient.users.updateUserMetadata(clerkUser.id, {
        publicMetadata: { role: UserRole.STUDENT },
      });
    }

    this.logger.log(`✅ User upserted in DB: ${user.id}`);
    return user;
  }

  async handleUserUpdated(clerkUser: any) {
    this.logger.log(`Updating user in DB: ${clerkUser.id}`);

    const firstName = clerkUser.first_name || '';
    const lastName = clerkUser.last_name || '';
    const fullName = `${firstName} ${lastName}`.trim() || 'Utilisateur';
    const email = clerkUser.email_addresses?.[0]?.email_address || '';

    try {
      // Mettre à jour l'utilisateur dans la DB
      const user = await this.prisma.user.update({
        where: { clerkId: clerkUser.id },
        data: {
          email: email,
          name: fullName,
          emailVerified:
            clerkUser.email_addresses?.[0]?.verification?.status === 'verified',
          image: clerkUser.image_url || null,
          updatedAt: clerkUser.updated_at
            ? new Date(clerkUser.updated_at)
            : new Date(),
        },
      });

      this.logger.log(`✅ User updated in DB: ${user.id}`);
      return user;
    } catch (error) {
      this.logger.error(`❌ Error updating user ${clerkUser.id}:`, error);
      throw error;
    }
  }

  async handleUserDeleted(clerkUser: any) {
    this.logger.log(`Deleting user from DB: ${clerkUser.id}`);

    try {
      // Supprimer l'utilisateur de la DB
      await this.prisma.user.delete({
        where: { clerkId: clerkUser.id },
      });

      this.logger.log(`✅ User deleted from DB: ${clerkUser.id}`);
    } catch (error) {
      this.logger.error(`❌ Error deleting user ${clerkUser.id}:`, error);
      throw error;
    }
  }

  // ========================================
  // MÉTHODE GUARD (existante, garde-la)
  // ========================================

  async syncUser(clerkUser: {
    id: string;
    emailAddresses: Array<{ emailAddress: string }>;
    firstName: string | null;
    lastName: string | null;
  }) {
    // Chercher l'utilisateur dans la DB
    let user = await this.prisma.user.findUnique({
      where: { clerkId: clerkUser.id },
    });

    // Si pas trouvé, le créer
    if (!user) {
      const firstName = clerkUser.firstName || '';
      const lastName = clerkUser.lastName || '';
      const fullName = `${firstName} ${lastName}`.trim() || 'Utilisateur';

      user = await this.prisma.user.create({
        data: {
          id: clerkUser.id,
          clerkId: clerkUser.id,
          email: clerkUser.emailAddresses[0]?.emailAddress || '',
          name: fullName,
          emailVerified: false,
          image: null,
          role: UserRole.STUDENT,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }

    return user;
  }
}
