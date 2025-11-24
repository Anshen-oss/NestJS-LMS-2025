import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { CoursesResolver } from './courses.resolver';
import { CoursesService } from './courses.service';

// ✅ IMPORTANT : Importer les enums pour les enregistrer dans GraphQL
import './enums';

@Module({
  imports: [PrismaModule],
  providers: [CoursesResolver, CoursesService],
  exports: [CoursesService],
})
export class CoursesModule {}
