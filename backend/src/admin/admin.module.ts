import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AdminGuard } from './admin.guard';
import { AdminResolver } from './admin.resolver';
import { AdminService } from './admin.service';

/**
 * 🔐 Module Admin
 *
 * Ce module gère toutes les fonctionnalités d'administration :
 * - Statistiques de la plateforme
 * - Gestion des utilisateurs et des rôles
 * - Gestion des cours
 * - Actions administratives
 *
 * Toutes les routes sont protégées par AdminGuard
 */
@Module({
  imports: [PrismaModule],
  providers: [AdminResolver, AdminService, AdminGuard],
  exports: [AdminService], // Export si d'autres modules ont besoin du service
})
export class AdminModule {}
