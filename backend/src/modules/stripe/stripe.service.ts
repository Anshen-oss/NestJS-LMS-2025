import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {
    // Initialiser le client Stripe
    const secretKey = this.config.get<string>('STRIPE_SECRET_KEY');

    if (!secretKey) {
      throw new Error(
        'STRIPE_SECRET_KEY is not defined in environment variables',
      );
    }

    this.stripe = new Stripe(secretKey, {
      apiVersion: '2025-11-17.clover',
    });

    console.log('✅ Stripe client initialized');
  }

  /**
   * Créer une Checkout Session Stripe
   */
  async createCheckoutSession(
    courseId: string,
    userId: string,
    clerkId: string,
  ): Promise<{ url: string }> {
    console.log('🛒 Creating checkout session');
    console.log('📦 Course ID:', courseId);
    console.log('👤 User ID:', userId);

    // 1. Récupérer le cours depuis la DB
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      select: {
        id: true,
        title: true,
        smallDescription: true,
        price: true,
        imageUrl: true,
      },
    });

    if (!course) {
      throw new Error('Course not found');
    }

    if (!course.price) {
      throw new Error("Ce cours n'a pas de prix défini");
    }

    console.log('✅ Course found:', course.title);
    console.log('💰 Price:', course.price, '€');

    // 2. Vérifier si l'user est déjà inscrit
    const existingEnrollment = await this.prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    if (existingEnrollment) {
      throw new Error('Already enrolled in this course');
    }

    // 3. Créer la session Stripe
    const frontendUrl =
      this.config.get<string>('FRONTEND_URL') || 'http://localhost:3000';

    const session = await this.stripe.checkout.sessions.create({
      mode: 'payment',

      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: course.title,
              description:
                course.smallDescription || 'Aucune description disponible',
              images: course.imageUrl ? [course.imageUrl] : [],
            },
            unit_amount: Math.round(course.price * 100), // Prix en centimes
          },
          quantity: 1,
        },
      ],

      success_url: `${frontendUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/payment/cancel`,

      // Métadonnées pour le webhook
      metadata: {
        courseId,
        userId,
        clerkId,
        courseName: course.title,
        userEmail: '', // On peut ajouter l'email si disponible
      },
    });

    console.log('✅ Checkout session created');
    console.log('🔗 URL:', session.url);

    if (!session.url) {
      throw new Error("Stripe n'a pas généré d'URL de session");
    }

    return { url: session.url };
  }

  /**
   * Gérer le webhook Stripe
   */
  async handleWebhook(body: Buffer, signature: string): Promise<void> {
    const webhookSecret = this.config.get<string>('STRIPE_WEBHOOK_SECRET');

    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET is not defined');
    }

    let event: Stripe.Event;

    try {
      // Vérifier la signature du webhook
      event = this.stripe.webhooks.constructEvent(
        body,
        signature,
        webhookSecret,
      );
    } catch (err) {
      console.error('❌ Webhook signature verification failed:', err.message);
      throw new Error(`Webhook signature verification failed: ${err.message}`);
    }

    console.log('✅ Webhook event received:', event.type);
    console.log('📦 Event ID:', event.id);

    // Traiter l'événement selon son type
    switch (event.type) {
      case 'checkout.session.completed':
        await this.handleCheckoutSessionCompleted(event.data.object);
        break;

      case 'payment_intent.succeeded':
        console.log('💰 Payment intent succeeded:', event.data.object.id);
        break;

      case 'payment_intent.payment_failed':
        console.log('❌ Payment intent failed:', event.data.object.id);
        break;

      default:
        console.log(`⚠️ Unhandled event type: ${event.type}`);
    }
  }

  /**
   * Traiter un checkout complété
   */
  private async handleCheckoutSessionCompleted(
    session: Stripe.Checkout.Session,
  ): Promise<void> {
    console.log('🎉 Checkout session completed');
    console.log('📦 Session ID:', session.id);
    console.log('💰 Amount total:', session.amount_total, 'centimes');

    const { courseId, userId, clerkId } = session.metadata || {};

    if (!courseId || !userId) {
      console.error('❌ Missing metadata in session');
      console.error('📦 Metadata:', session.metadata);
      throw new Error('Missing courseId or userId in session metadata');
    }

    console.log('📚 Course ID:', courseId);
    console.log('👤 User ID:', userId);

    try {
      // Vérifier si l'enrollment existe déjà (idempotence)
      const existingEnrollment = await this.prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId,
            courseId,
          },
        },
      });

      if (existingEnrollment) {
        console.log('ℹ️ Enrollment already exists, skipping creation');
        return;
      }

      // Créer l'enrollment
      const enrollment = await this.prisma.enrollment.create({
        data: {
          userId,
          courseId,
          status: 'Active',
          createdAt: new Date(),
          amount: session.amount_total ? session.amount_total / 100 : 0, // ✅ Convertir centimes → euros
        },
      });

      console.log('✅ Enrollment created successfully');
      console.log('📝 Enrollment ID:', enrollment.id);
      console.log('👤 User ID:', enrollment.userId);
      console.log('📚 Course ID:', enrollment.courseId);

      // TODO Phase 10: Envoyer un email de confirmation
      // await this.sendEnrollmentEmail(enrollment);
    } catch (error) {
      console.error('❌ Error creating enrollment:', error);

      // Si c'est une erreur de contrainte unique, c'est OK (idempotence)
      if (error.code === 'P2002') {
        console.log('ℹ️ Enrollment already exists (unique constraint)');
        return;
      }

      throw error;
    }
  }

  /**
   * Récupérer les détails d'une session (optionnel, pour debug)
   */
  async getSessionDetails(sessionId: string): Promise<Stripe.Checkout.Session> {
    return this.stripe.checkout.sessions.retrieve(sessionId);
  }
}
