import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { EnrollmentStatus } from '@prisma/client'; // ← Ajoute cet import en haut
import Stripe from 'stripe';
import { PrismaService } from '../../prisma/prisma.service';
import { EnrollmentResponse } from './types/enrollment-response.type';

@Injectable()
export class EnrollmentService {
  private stripe: Stripe;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    // Initialiser Stripe
    const stripeSecretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (!stripeSecretKey) {
      throw new Error('STRIPE_SECRET_KEY is not defined');
    }
    this.stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2025-11-17.clover',
    });
  }

  async enrollInCourse(
    courseId: string,
    userId: string,
  ): Promise<EnrollmentResponse> {
    try {
      // 1️⃣ Récupérer le cours
      const course = await this.prisma.course.findUnique({
        where: { id: courseId },
        select: {
          id: true,
          title: true,
          price: true,
          slug: true,
          stripePriceId: true,
        },
      });

      if (!course) {
        throw new NotFoundException('Course not found');
      }

      if (!course.stripePriceId) {
        throw new BadRequestException(
          'Stripe price not configured for this course',
        );
      }

      // 2️⃣ Récupérer l'utilisateur
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          name: true,
          stripeCustomerId: true,
        },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      // 3️⃣ Créer ou récupérer le customer Stripe
      let stripeCustomerId: string;

      // Vérifie si le customer existe ET s'il est valide
      if (user.stripeCustomerId && user.stripeCustomerId !== 'null') {
        // Vérifie que le customer existe vraiment dans Stripe
        try {
          await this.stripe.customers.retrieve(user.stripeCustomerId);
          stripeCustomerId = user.stripeCustomerId;
          console.log('✅ Customer Stripe existant utilisé:', stripeCustomerId);
        } catch (error) {
          // Customer n'existe plus dans Stripe, on va en créer un nouveau
          console.log("⚠️ Customer Stripe invalide, création d'un nouveau");

          const customer = await this.stripe.customers.create({
            email: user.email ?? undefined, // ✅ ici
            name: user.name || undefined,
            metadata: { userId: user.id },
          });
          stripeCustomerId = customer.id;

          // Sauvegarder le nouveau customer ID
          await this.prisma.user.update({
            where: { id: user.id },
            data: { stripeCustomerId },
          });
        }
      } else {
        // Pas de customer, on en crée un
        console.log("✅ Création d'un nouveau customer Stripe");
        const customer = await this.stripe.customers.create({
          email: user.email ?? undefined, // ✅ ici
          name: user.name || undefined,
          metadata: { userId: user.id },
        });
        stripeCustomerId = customer.id;

        // Sauvegarder le customer ID
        await this.prisma.user.update({
          where: { id: user.id },
          data: { stripeCustomerId },
        });
      }

      // 4️⃣ Vérifier si déjà enrollé
      const existingEnrollment = await this.prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId: user.id,
            courseId: course.id,
          },
        },
      });

      if (existingEnrollment?.status === 'Active') {
        return {
          success: true,
          message: 'You are already enrolled in this course',
        };
      }

      // 5️⃣ Créer ou mettre à jour l'enrollment
      let enrollment;

      if (existingEnrollment) {
        enrollment = await this.prisma.enrollment.update({
          where: { id: existingEnrollment.id },
          data: {
            amount: course.price,
            status: 'Pending',
            updatedAt: new Date(),
          },
        });
      } else {
        enrollment = await this.prisma.enrollment.create({
          data: {
            userId: user.id,
            courseId: course.id,
            amount: course.price,
            status: 'Pending',
          },
        });
      }

      // 6️⃣ Créer la session Stripe Checkout
      const baseUrl =
        this.configService.get<string>('FRONTEND_URL') ||
        'http://localhost:3000';

      const checkoutSession = await this.stripe.checkout.sessions.create({
        customer: stripeCustomerId,
        line_items: [
          {
            price: course.stripePriceId,
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${baseUrl}/payment/success`,
        cancel_url: `${baseUrl}/payment/cancel`,
        metadata: {
          userId: user.id,
          courseId: course.id,
          enrollmentId: enrollment.id,
        },
      });

      return {
        success: true,
        message: 'Checkout session created',
        checkoutUrl: checkoutSession.url || undefined,
        enrollmentId: enrollment.id,
      };
    } catch (error) {
      // ✅ LOG DÉTAILLÉ
      console.error('❌ Enrollment error:', error);

      if (error instanceof Stripe.errors.StripeError) {
        console.error('❌ Stripe error type:', error.type);
        console.error('❌ Stripe error message:', error.message);
        console.error('❌ Stripe error code:', error.code);

        throw new BadRequestException(`Payment system error: ${error.message}`);
      }
      throw error;
    }
  }

  // Dans enrollment.service.ts
  async getMyEnrollments(userId: string) {
    const enrollments = await this.prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          include: {
            chapters: {
              orderBy: { position: 'asc' },
              include: {
                lessons: {
                  orderBy: { order: 'asc' },
                },
              },
            },
            createdBy: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // ✅ Cast pour satisfaire TypeScript
    return enrollments as any;
  }

  async updateEnrollmentStatus(enrollmentId: string, status: EnrollmentStatus) {
    return this.prisma.enrollment.update({
      where: { id: enrollmentId },
      data: { status },
    });
  }

  async isEnrolled(userId: string, courseId: string): Promise<boolean> {
    console.log('🔍 isEnrolled called with:', { userId, courseId });

    // ✅ Récupérer le user
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true, clerkId: true },
    });

    console.log('👤 User found:', user);

    // ✅ Si ADMIN, accès à tous les cours
    if (user?.role === 'ADMIN') {
      console.log('✅ User is ADMIN, returning true');
      return true;
    }

    // ✅ Vérifier l'enrollment
    const enrollment = await this.prisma.enrollment.findFirst({
      where: {
        userId,
        courseId,
        status: 'Active',
      },
    });

    console.log('📚 Enrollment found:', enrollment);

    return !!enrollment;
  }
}
