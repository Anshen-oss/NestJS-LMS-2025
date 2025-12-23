import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // ✅ AJOUTÉ
import { PrismaModule } from '../../prisma/prisma.module';
import { CoursesResolver } from './courses.resolver';
import { CoursesService } from './courses.service';

// ✅ IMPORTANT : Importer les enums pour les enregistrer dans GraphQL
import { ProgressModule } from '../progress/progress.module';
import './enums';

@Module({
  imports: [
    PrismaModule,
    ProgressModule,
    ConfigModule, // ✅ AJOUTÉ pour que CoursesService puisse utiliser ConfigService
  ],
  providers: [CoursesResolver, CoursesService],
  exports: [CoursesService],
})
export class CoursesModule {}
