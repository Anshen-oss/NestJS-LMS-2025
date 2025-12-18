import { Module } from '@nestjs/common';
import { ClerkService } from 'src/modules/auth/clerk.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ClerkWebhookController } from './clerk-webhook.controller';

@Module({
  imports: [PrismaModule],
  controllers: [ClerkWebhookController],
  providers: [ClerkService],
})
export class WebhooksModule {}
