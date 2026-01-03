import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AnalyticsResolver } from './analytics.resolver';
import { AnalyticsService } from './analytics.service';

@Module({
  providers: [AnalyticsResolver, AnalyticsService, PrismaService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
