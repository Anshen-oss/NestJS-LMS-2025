import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { ClerkService } from './clerk.service';
import { ClerkGqlGuard } from './guards/clerk-gql.guard';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { JwtStrategy } from './stategies/jwt.strategy';

@Module({
  imports: [
    PrismaModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret',
      signOptions: {
        expiresIn: '7d',
      },
    }),
  ],
  providers: [
    AuthService,
    AuthResolver,
    JwtStrategy,
    ClerkGqlGuard,
    ClerkService,
    GqlAuthGuard, // ← Ajouté
  ],
  exports: [
    AuthService,
    ClerkService,
    JwtStrategy,
    ClerkGqlGuard,
    GqlAuthGuard, // ← Ajouté
  ],
})
export class AuthModule {}
