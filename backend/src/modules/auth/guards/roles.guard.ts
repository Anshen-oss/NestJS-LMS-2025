import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UserRole } from '@prisma/client';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    console.log('🔐 RolesGuard - Required roles:', requiredRoles);

    if (!requiredRoles) {
      return true;
    }

    const ctx = GqlExecutionContext.create(context);
    const { user } = ctx.getContext().req;

    console.log('👤 RolesGuard - User:', user);
    console.log('👤 RolesGuard - User role:', user?.role);

    if (!user) {
      console.log('❌ RolesGuard - No user!');
      return false;
    }

    // ✅ FIX : Convertir l'enum en string pour la comparaison
    const hasRole = requiredRoles.some(
      (role) => String(role) === String(user.role),
    );
    console.log('✅ RolesGuard - Has required role?', hasRole);

    return hasRole;
  }
}
