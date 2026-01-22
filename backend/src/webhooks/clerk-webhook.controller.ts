import {
  Controller,
  Headers,
  HttpException,
  HttpStatus,
  Logger,
  Post,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { Webhook } from 'svix';
import { ClerkService } from '../modules/auth/clerk.service';

type RawBodyRequest = Request & { rawBody?: Buffer };

// ⚠️ En local, l'URL webhook change à chaque redémarrage de ngrok

@Controller('webhooks/clerk')
export class ClerkWebhookController {
  private readonly logger = new Logger(ClerkWebhookController.name);

  constructor(private clerkService: ClerkService) {}

  @Post()
  async handleWebhook(
    @Req() req: RawBodyRequest,
    @Headers('svix-id') svixId: string,
    @Headers('svix-timestamp') svixTimestamp: string,
    @Headers('svix-signature') svixSignature: string,
  ) {
    const secret = process.env.CLERK_WEBHOOK_SECRET;
    if (!secret) {
      this.logger.error('CLERK_WEBHOOK_SECRET is not defined');
      throw new HttpException(
        'Webhook secret not configured',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    // ✅ LE point critique : utiliser le RAW body exact
    const payloadString = Buffer.isBuffer(req.body)
      ? req.body.toString('utf8')
      : null;
    if (!payloadString) {
      this.logger.error(
        'Missing rawBody. rawBody must be enabled in NestFactory.',
      );
      throw new HttpException('Missing raw body', HttpStatus.BAD_REQUEST);
    }

    const wh = new Webhook(secret);

    let evt: any;
    try {
      evt = wh.verify(payloadString, {
        'svix-id': svixId,
        'svix-timestamp': svixTimestamp,
        'svix-signature': svixSignature,
      });
    } catch (error) {
      this.logger.error(
        `❌ Webhook verification failed: ${error?.message ?? error}`,
        error?.stack ?? undefined,
      );
      throw new HttpException('Invalid signature', HttpStatus.UNAUTHORIZED);
    }

    this.logger.log(`Webhook received: ${evt.type} for user ${evt.data?.id}`);
    this.logger.log(`➡️ user id: ${evt.data?.id}`);

    try {
      switch (evt.type) {
        case 'user.created':
          await this.clerkService.handleUserCreated(evt.data);
          break;
        case 'user.updated':
          await this.clerkService.handleUserUpdated(evt.data);
          break;
        case 'user.deleted':
          await this.clerkService.handleUserDeleted(evt.data);
          break;
        default:
          this.logger.warn(`Unhandled event type: ${evt.type}`);
      }

      return { success: true, eventType: evt.type };
    } catch (error) {
      this.logger.error(
        `❌ Error handling webhook ${evt?.type}: ${error?.message ?? error}`,
        error?.stack ?? undefined,
      );
      throw new HttpException(
        'Error processing webhook',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
