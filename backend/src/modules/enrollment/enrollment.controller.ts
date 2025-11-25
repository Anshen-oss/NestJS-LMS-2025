import type { RawBodyRequest } from '@nestjs/common';
import {
  BadRequestException,
  Controller,
  Headers,
  Post,
  Req,
} from '@nestjs/common';
import { EnrollmentStatus } from '@prisma/client';
import Stripe from 'stripe';
import { EnrollmentService } from './enrollment.service';

@Controller('enrollment')
export class EnrollmentController {
  private stripe: Stripe;

  constructor(private readonly enrollmentService: EnrollmentService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2025-11-17.clover',
    });
  }

  @Post('webhook')
  async handleStripeWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() request: RawBodyRequest<Request>,
  ) {
    if (!signature) {
      throw new BadRequestException('Missing stripe-signature header');
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      throw new BadRequestException('Webhook secret not configured');
    }

    let event: Stripe.Event;

    try {
      // Vérifie que l'événement vient bien de Stripe
      event = this.stripe.webhooks.constructEvent(
        request.rawBody!,
        signature,
        webhookSecret,
      );
    } catch (err) {
      console.error('⚠️ Webhook signature verification failed:', err.message);
      throw new BadRequestException(`Webhook Error: ${err.message}`);
    }

    // Traite l'événement
    switch (event.type) {
      case 'checkout.session.completed':
        this.handleCheckoutSessionCompleted(event.data.object);
        break;

      case 'checkout.session.expired':
        this.handleCheckoutSessionExpired(event.data.object);
        break;

      default:
        console.log(`🔔 Unhandled event type: ${event.type}`);
    }

    return { received: true };
  }

  private async handleCheckoutSessionCompleted(
    session: Stripe.Checkout.Session,
  ) {
    console.log('✅ Checkout session completed:', session.id);

    // Récupère l'enrollmentId depuis les metadata
    const enrollmentId = session.metadata?.enrollmentId;

    if (!enrollmentId) {
      console.error('❌ No enrollmentId in session metadata');
      return;
    }

    // Met à jour le statut de l'enrollment
    await this.enrollmentService.updateEnrollmentStatus(
      enrollmentId,
      EnrollmentStatus.Active,
    );

    console.log(`✅ Enrollment ${enrollmentId} activated`);
  }
  private async handleCheckoutSessionExpired(session: Stripe.Checkout.Session) {
    console.log('⏰ Checkout session expired:', session.id);

    const enrollmentId = session.metadata?.enrollmentId;

    if (!enrollmentId) {
      return;
    }

    // Optionnel : Supprimer l'enrollment ou le marquer comme "Expired"
    await this.enrollmentService.updateEnrollmentStatus(
      enrollmentId,
      EnrollmentStatus.Cancelled,
    );
  }
}
