import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { LessonsResolver } from './lessons.resolver';
import { LessonsService } from './lessons.service';

@Module({
  imports: [PrismaModule],
  providers: [LessonsService, LessonsResolver],
  exports: [LessonsService],
})
export class LessonsModule {}
