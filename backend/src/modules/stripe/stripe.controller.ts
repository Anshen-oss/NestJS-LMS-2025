import type { RawBodyRequest } from '@nestjs/common';
import {
  Controller,
  Headers,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { StripeService } from './stripe.service';

@Controller('webhooks')
export class StripeController {
  constructor(private stripeService: StripeService) {}

  @Post('stripe')
  @HttpCode(200)
  async handleStripeWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() request: RawBodyRequest<Request>,
  ): Promise<{ received: boolean }> {
    console.log('🪝 Webhook POST received at /webhooks/stripe');
    console.log('📅 Timestamp:', new Date().toISOString());

    // Vérifier la signature
    if (!signature) {
      console.error('❌ Missing stripe-signature header');
      throw new HttpException(
        'Missing stripe-signature header',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Récupérer le raw body
    const body = request.rawBody;

    if (!body) {
      console.error('❌ Missing raw body');
      throw new HttpException('Missing raw body', HttpStatus.BAD_REQUEST);
    }

    console.log('📦 Body size:', body.length, 'bytes');
    console.log('🔐 Signature present:', !!signature);

    try {
      await this.stripeService.handleWebhook(body, signature);
      console.log('✅ Webhook processed successfully');
      return { received: true };
    } catch (error) {
      console.error('❌ Webhook processing failed:', error.message);
      console.error('📚 Error stack:', error.stack);

      throw new HttpException(
        `Webhook processing failed: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
