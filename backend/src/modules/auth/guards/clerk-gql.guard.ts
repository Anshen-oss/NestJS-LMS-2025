import { clerkClient } from '@clerk/clerk-sdk-node';
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class ClerkGqlGuard {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;

    // Extraire le token du header Authorization
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('No token provided');
    }

    const token = authHeader.split(' ')[1];

    try {
      // Vérifier le token avec Clerk
      const session = await clerkClient.verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY,
      });

      if (!session || !session.sub) {
        throw new UnauthorizedException('Invalid token');
      }

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
        throw new UnauthorizedException('User not found in database');
      }

      // Attacher l'utilisateur à la requête (disponible via @CurrentUser)
      request.user = user;

      return true;
    } catch (error) {
      console.error('❌ Clerk auth error:', error);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
