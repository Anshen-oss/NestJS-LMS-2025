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
   * 🆕 PHASE 16: Créer une conversation automatiquement après enrollment
   *
   * Appelé depuis handleCheckoutSessionCompleted()
   *
   * Flow:
   * 1. Récupère le course (avec instructor)
   * 2. Créer Conversation (instructor ↔ student + courseId)
   * 3. Créer un message d'accueil détaillé avec lien du cours
   * 4. Idempotent (ne crée pas 2x si webhook replay)
   *
   * @param studentId - ID du student (nouveau member du cours)
   * @param courseId - ID du cours
   */
  private async createConversationOnEnrollment(
    studentId: string,
    courseId: string,
  ): Promise<void> {
    console.log('💬 Creating conversation on enrollment');
    console.log('👤 Student ID:', studentId);
    console.log('📚 Course ID:', courseId);

    try {
      // 1️⃣ Récupérer le course + instructor
      const course = await this.prisma.course.findUnique({
        where: { id: courseId },
        select: {
          id: true,
          title: true,
          userId: true, // ← instructorId
        },
      });

      if (!course) {
        console.error('❌ Course not found:', courseId);
        throw new Error(`Course not found: ${courseId}`);
      }

      const instructorId = course.userId;
      console.log('👨‍🏫 Instructor ID:', instructorId);

      // 2️⃣ Créer ou récupérer la conversation
      // ✅ Idempotent: si existe déjà, retourner existante
      const conversation = await this.prisma.conversation.upsert({
        where: {
          instructorId_studentId_courseId: {
            instructorId,
            studentId,
            courseId,
          },
        },
        update: {
          // Si existe: mettre à jour lastMessageAt + courseId (par sécurité)
          lastMessageAt: new Date(),
          courseId, // Au cas où l'enrollment change de contexte
        },
        create: {
          // Si n'existe pas: créer
          instructorId,
          studentId,
          courseId,
          lastMessageAt: new Date(),
        },
      });

      console.log('✅ Conversation upserted');
      console.log('🆔 Conversation ID:', conversation.id);

      // 3️⃣ Vérifier si message d'accueil existe déjà
      const existingMessages = await this.prisma.message.count({
        where: {
          conversationId: conversation.id,
        },
      });

      // 4️⃣ Si c'est une nouvelle conversation, créer message d'accueil
      // 4️⃣ Si c'est une nouvelle conversation, créer message d'accueil
      if (existingMessages === 0) {
        const courseLink = `${this.config.get<string>('FRONTEND_URL') || 'http://localhost:3000'}/courses/${courseId}`;

        // 🆕 Message en JSON Tiptap pour le formatage
        const welcomeContent = {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              attrs: { textAlign: 'left' },
              content: [
                {
                  type: 'text',
                  text: `Bienvenue dans "${course.title}"! 👋`,
                  marks: [{ type: 'bold' }],
                },
              ],
            },
            {
              type: 'paragraph',
              attrs: { textAlign: 'left' },
              content: [
                {
                  type: 'text',
                  text: "Je suis heureux de t'avoir dans ce cours!",
                },
              ],
            },
            {
              type: 'heading',
              attrs: { level: 3, textAlign: 'left' },
              content: [{ type: 'text', text: '📚 Accès au cours' }],
            },
            {
              type: 'paragraph',
              attrs: { textAlign: 'left' },
              content: [
                {
                  type: 'text',
                  text: 'Commence par la première leçon: ',
                },
                {
                  type: 'text',
                  text: courseLink,
                  marks: [
                    {
                      type: 'link',
                      attrs: {
                        href: courseLink,
                        target: '_blank',
                        rel: 'noopener noreferrer',
                      },
                    },
                  ],
                },
              ],
            },
            {
              type: 'heading',
              attrs: { level: 3, textAlign: 'left' },
              content: [{ type: 'text', text: '💬 Questions & Support' }],
            },
            {
              type: 'paragraph',
              attrs: { textAlign: 'left' },
              content: [
                {
                  type: 'text',
                  text: "N'hésite pas à me poser des questions directement ici - je vais répondre aussi rapidement que possible!",
                },
              ],
            },
            {
              type: 'heading',
              attrs: { level: 3, textAlign: 'left' },
              content: [{ type: 'text', text: '🎯 Conseils pour réussir' }],
            },
            {
              type: 'bulletList',
              content: [
                {
                  type: 'listItem',
                  content: [
                    {
                      type: 'paragraph',
                      attrs: { textAlign: 'left' },
                      content: [
                        { type: 'text', text: 'Regarde une leçon par jour' },
                      ],
                    },
                  ],
                },
                {
                  type: 'listItem',
                  content: [
                    {
                      type: 'paragraph',
                      attrs: { textAlign: 'left' },
                      content: [
                        { type: 'text', text: 'Prends des notes et pratique' },
                      ],
                    },
                  ],
                },
                {
                  type: 'listItem',
                  content: [
                    {
                      type: 'paragraph',
                      attrs: { textAlign: 'left' },
                      content: [
                        { type: 'text', text: 'Fais les exercices pratiques' },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              type: 'paragraph',
              attrs: { textAlign: 'left' },
              content: [
                {
                  type: 'text',
                  text: 'Bonne chance! On va construire ça ensemble! 🚀',
                  marks: [{ type: 'bold' }],
                },
              ],
            },
          ],
        };

        const message = await this.prisma.message.create({
          data: {
            content: JSON.stringify(welcomeContent), // ✅ JSON au lieu de plain text
            senderId: instructorId,
            conversationId: conversation.id,
            status: 'SENT',
          },
        });

        console.log('✅ Welcome message created with rich formatting');
        console.log('💬 Message ID:', message.id);
      }

      console.log('✅ Conversation + Message created successfully');
    } catch (error) {
      // ⚠️ Ne pas throw: le webhook réussissait de toute façon
      // On log l'erreur mais l'enrollment a été créé
      console.error('⚠️ Error creating conversation:', error.message);
      console.error('📝 Error details:', error);

      // En production: envoyer un log/alert au sentry ou email
      // Mais NE PAS faire échouer le webhook
    }
  }

  /**
   * Traiter un checkout complété
   */
  private async handleCheckoutSessionCompleted(
    session: Stripe.Checkout.Session,
  ): Promise<void> {
    console.log('🎉 Checkout session completed');
    console.log('🔗 Session ID:', session.id);
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
      // 1️⃣ Vérifier si l'enrollment existe déjà (idempotence)
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

      // 2️⃣ Créer l'enrollment
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

      // 3️⃣ 🆕 PHASE 16: Créer conversation + message d'accueil
      await this.createConversationOnEnrollment(userId, courseId);

      // TODO Phase 20: Envoyer un email de bienvenue
      // await this.sendEnrollmentEmail(enrollment);
    } catch (error) {
      console.error('❌ Error creating enrollment:', error);
      console.error('⚠️ Error creating conversation:');
      console.error('Error message:', error?.message);
      console.error('Error code:', error?.code);
      console.error('Full error:', JSON.stringify(error, null, 2));

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
