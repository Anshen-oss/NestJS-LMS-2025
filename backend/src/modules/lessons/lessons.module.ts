import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { ProgressModule } from '../progress/progress.module';
import { S3Module } from '../s3/s3.module';
import { LessonsResolver } from './lessons.resolver';
import { LessonsService } from './lessons.service';

@Module({
  imports: [PrismaModule, ProgressModule, S3Module],
  providers: [LessonsService, LessonsResolver],
  exports: [LessonsService],
})
export class LessonsModule {}
