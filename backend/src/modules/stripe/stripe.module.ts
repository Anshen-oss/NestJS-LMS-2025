import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'src/prisma/prisma.module';
import { InstructorModule } from '../instructor/instructor.module'; // ← AJOUTER
import { StripeController } from './stripe.controller';
import { StripeResolver } from './stripe.resolver';
import { StripeService } from './stripe.service';

@Module({
  imports: [ConfigModule, PrismaModule, InstructorModule],
  providers: [StripeService, StripeResolver],
  controllers: [StripeController],
  exports: [StripeService],
})
export class StripeModule {}
