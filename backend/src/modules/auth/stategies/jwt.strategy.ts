import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';

// 📦 Type du payload JWT
export interface JwtPayload {
  sub: string; // User ID
  email: string; // User email
  role: string; // User role (ADMIN, USER)
  iat?: number; // Issued at (timestamp)
  exp?: number; // Expiration (timestamp)
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    // ✅ ConfigService gère automatiquement les variables d'environnement
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      // 🔍 Où chercher le token ? Dans le header Authorization: Bearer <token>
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      // ⚠️ Rejeter les tokens expirés
      ignoreExpiration: false,

      // 🔑 Secret pour vérifier la signature
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  /**
   * 🔐 Méthode appelée APRÈS vérification du JWT
   *
   * @param payload - Le contenu décodé du JWT
   * @returns L'utilisateur (qui sera attaché à req.user)
   * @throws UnauthorizedException si l'utilisateur n'existe plus
   */

  async validate(payload: JwtPayload) {
    // 1️⃣ Vérifier que l'utilisateur existe toujours en DB
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        emailVerified: true,
        image: true,
        createdAt: true,
      },
    });

    // 2️⃣ Si l'utilisateur a été supprimé entre-temps
    if (!user) {
      throw new UnauthorizedException('User no longr exists');
    }
    // 3️⃣ Retourner l'utilisateur (sera disponible dans req.user)
    return user;
  }
}
