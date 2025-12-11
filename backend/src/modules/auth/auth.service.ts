import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'; // ✅ Import correct
import { PrismaService } from '../../prisma/prisma.service';
import { AuthPayload } from './dto/auth.payload';
import { RegisterInput } from './dto/register.input';
//import { UserRole } from './entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // ✅ Méthode privée pour générer le token
  private async generateToken(user: {
    id: string;
    email: string;
    role: string;
  }): Promise<string> {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    return this.jwtService.sign(payload);
  }

  /**
   * Login avec email/password
   * Compatible avec Better-Auth (lit le password depuis la table account)
   */

  async login(email: string, password: string) {
    // 1️⃣ Trouver le user
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        accounts: {
          where: {
            providerId: 'credential', // ✅ Better-Auth utilise 'credential'
          },
        },
      },
    });

    // console.log('👤 User found:', user ? 'YES' : 'NO');
    // console.log('🔑 Accounts:', user?.accounts.length);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 2️⃣ Trouver le compte credential (password)
    const credentialAccount = user.accounts[0];

    if (!credentialAccount || !credentialAccount.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    console.log('🔐 Password hash exists:', !!credentialAccount.password);

    // 3️⃣ Vérifier le password
    const isPasswordValid = await bcrypt.compare(
      password,
      credentialAccount.password,
    );

    console.log('✅ Password valid:', isPasswordValid);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 4️⃣ Générer JWT
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);

    // 5️⃣ Retourner user + token
    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async register(registerInput: RegisterInput): Promise<AuthPayload> {
    const { email, password, name } = registerInput;

    // 1️⃣ Vérifier si l'email existe déjà
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // 2️⃣ Hasher le password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3️⃣ Créer l'utilisateur + account dans une transaction
    const now = new Date();

    const user = await this.prisma.user.create({
      data: {
        id: crypto.randomUUID(),
        email,
        name: name || email, // ✅ Valeur par défaut
        emailVerified: false,
        role: 'USER',
        createdAt: now,
        updatedAt: now,
        accounts: {
          create: {
            id: crypto.randomUUID(),
            accountId: email,
            providerId: 'credential',
            password: hashedPassword,
            // ❌ NE PAS mettre userId ici - Prisma le gère automatiquement
            createdAt: now,
            updatedAt: now,
          },
        },
      },
      include: {
        accounts: true,
      },
    });

    // 4️⃣ Générer le JWT
    const accessToken = await this.generateToken(user);

    // 5️⃣ Retourner AuthPayload
    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role, // ✅ Cast nécessaire
        createdAt: user.createdAt,
      },
    };
  }

  /**
   * Valider un JWT et retourner le user
   */
  async validateUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }
}
