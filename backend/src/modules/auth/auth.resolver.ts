import { clerkClient } from '@clerk/clerk-sdk-node';
import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserRole } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { AuthPayload } from './dto/auth.payload';
import { LoginInput } from './dto/login.input';
import { RegisterInput } from './dto/register.input';
import { User } from './entities/user.entity';
import { ClerkGqlGuard } from './guards/clerk-gql.guard';

@Resolver()
export class AuthResolver {
  constructor(
    private authService: AuthService,
    private prisma: PrismaService,
  ) {}

  @Mutation(() => AuthPayload)
  async login(@Args('input') input: LoginInput) {
    return this.authService.login(input.email, input.password);
  }

  @Mutation(() => AuthPayload)
  async register(@Args('input') input: RegisterInput): Promise<AuthPayload> {
    return this.authService.register(input);
  }

  @Mutation(() => User, { name: 'updateUserRole' }) // ✅ Nom de la mutation
  @UseGuards(ClerkGqlGuard)
  async updateUserRole(
    @Args('role', { type: () => String }) role: string, // ✅ Type explicite
    @CurrentUser() user: User,
  ) {
    // console.log('🔍 updateUserRole called');
    // console.log('🔍 Role:', role);
    // console.log('🔍 User:', user);

    // Valider le rôle
    if (!Object.values(UserRole).includes(role as UserRole)) {
      throw new Error(`Invalid role: ${role}`);
    }

    const userRole = role as UserRole;

    try {
      // Mettre à jour dans la DB
      const updatedUser = await this.prisma.user.update({
        where: { clerkId: user.id },
        data: { role: userRole },
      });

      console.log('✅ User updated in DB:', updatedUser);

      // TODO: Mettre à jour dans Clerk
      // await clerkClient.users.updateUser(user.id, {
      //   publicMetadata: { role: userRole },
      // });

      return updatedUser;
    } catch (error) {
      console.error('❌ Error updating user:', error);
      throw error;
    }
  }

  // ✅ Mutation SANS guard pour l'onboarding
  @Mutation(() => User, { name: 'setupUserRole' })
  async setupUserRole(
    @Args('clerkUserId') clerkUserId: string,
    @Args('role') role: string,
  ) {
    console.log('🔍 setupUserRole called');
    console.log('🔍 Clerk User ID:', clerkUserId);
    console.log('🔍 Role:', role);

    // Valider le rôle
    if (!Object.values(UserRole).includes(role as UserRole)) {
      throw new Error(`Invalid role: ${role}`);
    }

    const userRole = role as UserRole;

    try {
      // Récupérer les infos du user depuis Clerk
      const clerkUser = await clerkClient.users.getUser(clerkUserId);

      console.log('✅ Clerk user found:', clerkUser.id);

      const email = clerkUser.emailAddresses[0]?.emailAddress || '';
      const name =
        `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() ||
        'Unknown';

      // ✅ Vérifier si un user existe déjà avec cet email
      const existingUserByEmail = await this.prisma.user.findUnique({
        where: { email },
      });

      let user;

      if (existingUserByEmail) {
        // User existe avec cet email → Update avec le nouveau clerkId
        console.log('📝 Updating existing user by email');
        user = await this.prisma.user.update({
          where: { email },
          data: {
            clerkId: clerkUserId,
            role: userRole,
            name,
          },
        });
      } else {
        // Sinon, upsert normal par clerkId
        console.log('📝 Upserting user by clerkId');
        user = await this.prisma.user.upsert({
          where: { clerkId: clerkUserId },
          update: {
            role: userRole,
            name,
            email,
          },
          create: {
            clerkId: clerkUserId,
            name,
            email,
            role: userRole,
          },
        });
      }

      console.log('✅ User saved in DB:', user);

      // Mettre à jour dans Clerk
      await clerkClient.users.updateUser(clerkUserId, {
        publicMetadata: { role: userRole },
      });

      console.log('✅ Clerk metadata updated');

      return user;
    } catch (error) {
      console.error('❌ Error in setupUserRole:', error);
      throw error;
    }
  }

  @Query(() => User)
  @UseGuards(ClerkGqlGuard)
  me(@CurrentUser() user: User): User {
    // ✅ Plus de async
    return user;
  }
}
