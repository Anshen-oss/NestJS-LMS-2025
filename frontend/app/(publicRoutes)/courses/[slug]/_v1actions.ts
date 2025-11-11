"use server";

import { requireUser } from "@/app/data/user/require-user";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import { stripe } from "@/lib/stripe";
import { ApiResponse } from "@/lib/types";
import { redirect } from "next/navigation";
import Stripe from "stripe";
import { request } from "@arcjet/next";
import arcjet, { fixedWindow } from "@/lib/arcjet";

const aj = arcjet.withRule(
  fixedWindow({
    mode: "LIVE", // en mode blocage réel
    window: "1m", // fenêtre de 1 minute
    max: 5, // max 5 tentatives par minute
  })
);

export async function enrollInCourseAction(
  courseId: string
): Promise<ApiResponse | never> {
  const user = await requireUser();
  let checkoutUrl: string;

  try {
    const req = await request();
    const decision = await aj.protect(req, { fingerprint: user.id });

    if (decision.isDenied()) {
      return { status: "error", message: "You have been blocked" };
    }

    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
      select: {
        id: true,
        title: true,
        price: true,
        slug: true,
        stripePriceId: true, // 👈 ajouter ça
      },
    });

    if (!course) {
      return {
        status: "error",
        message: "Course not found",
      };
    }

    // sécurité si jamais un cours a été créé sans price (dev/env)
    if (!course.stripePriceId) {
      return {
        status: "error",
        message: "Stripe price not configured for this course",
      };
    }

    const row = await prisma.user.findUnique({
      where: { id: user.id },
      select: { stripeCustomerId: true },
    });

    const existingCustomerId = row?.stripeCustomerId ?? null;

    let stripeCustomerId: string;
    if (existingCustomerId) {
      stripeCustomerId = existingCustomerId;
    } else {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name ?? undefined,
        metadata: { userId: user.id },
      });
      stripeCustomerId = customer.id;
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId },
      });
    }

    const result = await prisma.$transaction(async (tx) => {
      /* 1️⃣ Check if the user is already registered */
      const existingEnrollment = await prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId: user.id,
            courseId: course.id,
          },
        },
        select: {
          status: true,
          id: true,
        },
      });

      /* 2️⃣ Blocage si déjà inscrit */
      if (existingEnrollment?.status === "Active") {
        return {
          status: "Success",
          message: "You are already enrolled in this course",
        };
      }

      /* 3️⃣ Mise à jour d’une inscription existante */

      let enrollment;

      if (existingEnrollment) {
        enrollment = await tx.enrollment.update({
          where: {
            id: existingEnrollment.id,
          },
          data: {
            amount: course.price,
            status: "Pending",
            updatedAt: new Date(),
          },
        });
      } else {
        /*  4️⃣ Creation d’une nouvelle inscription */
        enrollment = await tx.enrollment.create({
          data: {
            userId: user.id,
            courseId: course.id,
            amount: course.price,
            status: "Pending",
          },
        });
      }

      const checkoutSession = await stripe.checkout.sessions.create({
        customer: stripeCustomerId,
        line_items: [
          {
            price: course.stripePriceId, // 👈 utiliser le prix du cours
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${env.BETTER_AUTH_URL}/payment/success`,
        cancel_url: `${env.BETTER_AUTH_URL}/payment/cancel`,
        metadata: {
          userId: user.id,
          courseId: course.id,
          enrollmentId: enrollment.id,
        },
      });

      return {
        enrollment: enrollment,
        checkoutUrl: checkoutSession.url,
      };
    });

    checkoutUrl = result.checkoutUrl as string;
  } catch (error) {
    //console.error("[enrollInCourseAction] Stripe error:", error);
    if (error instanceof Stripe.errors.StripeError) {
      return {
        status: "error",
        message: "Payment system error. Please try again later",
      };
    }
    return {
      status: "error",
      message: "Failed to enroll in course",
    };
  }
  redirect(checkoutUrl);
}
