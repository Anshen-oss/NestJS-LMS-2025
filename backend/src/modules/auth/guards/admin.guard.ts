import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UserRole } from '@prisma/client';

@Injectable()
export class AdminGuard implements CanActivate {
  /**
   * 🎯 Méthode canActivate - Détermine si la requête peut continuer
   *
   * @param context - Contexte d'exécution de NestJS
   * @returns true si autorisé, sinon lance une exception
   */
  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);
    const { user } = ctx.getContext().req;

    if (!user || user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Admin access required');
    }

    return true;
  }
}
