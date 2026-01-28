import { clerkClient } from '@clerk/clerk-sdk-node';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ClerkRestGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // ✅ CHANGE: REST au lieu de GraphQL
    const request = context.switchToHttp().getRequest<Request>();

    console.log('🔐 ClerkRestGuard: Starting authentication check');

    // Extraire le token du header Authorization
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('❌ No valid authorization header');
      throw new UnauthorizedException('No token provided');
    }

    const token = authHeader.split(' ')[1];

    console.log('🔑 Token extracted (first 20 chars):', token.substring(0, 20));

    try {
      console.log('🔐 Verifying token with Clerk...');

      // Vérifier le token avec Clerk (MÊME logique que GraphQL)
      const session = await clerkClient.verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY,
      });

      if (!session || !session.sub) {
        console.error('❌ Invalid session or missing sub');
        throw new UnauthorizedException('Invalid token');
      }

      console.log('✅ Token verified successfully');

      // Récupérer l'utilisateur depuis la DB via clerkId
      const user = await this.prisma.user.findUnique({
        where: { clerkId: session.sub },
        select: {
          id: true,
          clerkId: true,
          email: true,
          name: true,
          role: true,
          image: true,
          emailVerified: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        console.error(
          '❌ User not found in database for clerkId:',
          session.sub,
        );
        throw new UnauthorizedException('User not found in database');
      }

      // Attacher l'utilisateur à la requête
      (request as any).user = user;

      console.log('✅ Authentication successful for:', user.email);

      return true;
    } catch (error) {
      console.error('❌ Clerk auth error:', error);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
