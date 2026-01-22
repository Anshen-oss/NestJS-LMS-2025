/* import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class GqlAuthGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;

    try {
      // Récupère le token du header
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        throw new UnauthorizedException('No authorization header');
      }

      const token = authHeader.replace('Bearer ', '');

      // Vérifie le token Clerk
      const payload = await verifyAuth(token, {
        secretKey: process.env.CLERK_SECRET_KEY,
      });

      // Ajoute l'utilisateur au contexte
      ctx.getContext().user = {
        id: payload.sub, // Clerk user ID
        email: payload.email,
      };

      return true;
    } catch (error) {
      console.error('Auth error:', error);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
  */

import { clerkClient } from '@clerk/clerk-sdk-node';
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class GqlAuthGuard {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;

    try {
      // Récupère le token du header
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        throw new UnauthorizedException('No authorization header');
      }

      const token = authHeader.replace('Bearer ', '');

      // Vérifie le token Clerk
      const session = await clerkClient.verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY,
      });

      if (!session || !session.sub) {
        throw new UnauthorizedException('Invalid token');
      }

      // Récupère l'utilisateur depuis la DB
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
      // 🔍 DEBUG: Ajoute ça ici
      console.log('🔍 User object:', user);
      console.log('🔍 Setting to context:', ctx.getContext());
      req.user = user;
      ctx.getContext().user = user;

      console.log('🔍 Context after setting:', ctx.getContext().user);

      // Ajoute l'utilisateur au contexte
      ctx.getContext().user = user;

      return true;
    } catch (error) {
      console.error('Auth error:', error);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
