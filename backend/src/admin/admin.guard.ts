import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UserRole } from '@prisma/client';

/**
 * 🔐 Guard Admin - Protection des routes administrateur
 *
 * Vérifie que l'utilisateur connecté possède le rôle ADMIN.
 * Doit être utilisé APRÈS GqlAuthGuard pour garantir qu'un utilisateur existe.
 *
 * @example
 * ```typescript
 * @UseGuards(GqlAuthGuard, AdminGuard)
 * @Query(() => AdminStats)
 * async adminStats() {
 *   return this.adminService.getStats();
 * }
 * ```
 */
@Injectable()
export class AdminGuard implements CanActivate {
  /**
   * 🎯 Détermine si la requête peut continuer
   *
   * @param context - Contexte d'exécution NestJS
   * @returns true si l'utilisateur est admin, sinon lance une exception
   * @throws ForbiddenException si l'utilisateur n'est pas admin
   */
  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);
    const { user } = ctx.getContext().req;

    if (!user || user.role !== UserRole.ADMIN) {
      throw new ForbiddenException(
        'Accès refusé : droits administrateur requis',
      );
    }

    return true;
  }
}
