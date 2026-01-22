import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ClerkService } from './clerk.service';

@Injectable()
export class ClerkGuard implements CanActivate {
  constructor(private readonly clerkService: ClerkService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;

    const token = this.extractToken(request);
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    // ⚠️ Attention: verifyToken() doit réellement vérifier un JWT (pas getUser(token))
    const clerkUser = await this.clerkService.verifyToken(token);
    if (!clerkUser) {
      throw new UnauthorizedException('Invalid token');
    }

    const user = await this.clerkService.syncUser(clerkUser);

    request.user = user;
    request.clerkUser = clerkUser; // utile pour debug si besoin

    return true;
  }

  private extractToken(request: any): string | null {
    const authHeader: string | undefined =
      request?.headers?.authorization ?? request?.headers?.Authorization;

    if (!authHeader) return null;

    const [type, token] = authHeader.split(' ');
    if (type !== 'Bearer' || !token) return null;

    return token;
  }
}
