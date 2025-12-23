import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'src/prisma/prisma.module';
import { StripeController } from './stripe.controller';
import { StripeResolver } from './stripe.resolver';
import { StripeService } from './stripe.service';

@Module({
  imports: [ConfigModule, PrismaModule],
  providers: [StripeService, StripeResolver],
  controllers: [StripeController],
  exports: [StripeService],
})
export class StripeModule {}
