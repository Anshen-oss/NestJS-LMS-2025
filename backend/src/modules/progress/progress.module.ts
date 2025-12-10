import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProgressResolver } from './progress.resolver';
import { ProgressService } from './progress.service';

@Module({
  imports: [PrismaModule, ProgressModule],
  providers: [ProgressService, ProgressResolver],
  exports: [ProgressService],
})
export class ProgressModule {}
