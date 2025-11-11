"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { courseSchema, CourseSchemaType } from "@/lib/zodSchema";
import arcjet, { fixedWindow } from "@/lib/arcjet";
import { request } from "@arcjet/next";
import { stripe } from "@/lib/stripe";

const aj = arcjet.withRule(
  fixedWindow({
    mode: "LIVE",
    window: "1m",
    max: 2,
  })
);
export async function CreateCourse(
  values: CourseSchemaType
): Promise<ApiResponse> {
  const session = await requireAdmin();

  try {
    const req = await request();
    const decision = await aj.protect(req, {
      fingerprint: session.user.id,
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return {
          status: "error",
          message: "You have been blocked due to rate limiting",
        };
      } else {
        return {
          status: "error",
          message: "You are a bot! If this is a mistake contact our support.",
        };
      }
    }

    // ---- Zod parsing (modèle demandé) ----
    const parsed = courseSchema.safeParse(values);
    if (!parsed.success) {
      return { status: "error", message: "Invalid Form Data" };
    }
    const data = parsed.data; // <- données validées par Zod
    const {
      title,
      description,
      smallDescription,
      category,
      slug,
      duration,
      fileKey,
      price,
    } = data;

    // fileKey requis par Prisma (String non nul)
    if (!fileKey) {
      return { status: "error", message: "Missing file key" };
    }

    // Prix en centimes (Int) pour Stripe et pour ta DB
    //const priceCents = Math.round(price * 100);
    const priceCents = Math.round(price);

    // 1) Créer le produit (catalogue)
    const product = await stripe.products.create({
      name: title,
      description: smallDescription,
      metadata: { slug, category },
    });

    // 2) Créer le prix lié au produit
    const createdPrice = await stripe.prices.create({
      currency: "eur",
      unit_amount: priceCents,
      product: product.id,
    });

    // 3) Persister en base (mapper explicitement les champs du modèle Prisma)
    await prisma.course.create({
      data: {
        title,
        description,
        fileKey,
        price: priceCents, // Int en DB (centimes)
        duration,
        stripePriceId: createdPrice.id, // string garanti
        category,
        smallDescription,
        slug,
        userId: session.user.id as string,
        // level et status non fournis -> Prisma utilisera les valeurs par défaut
      },
    });

    return {
      status: "success",
      message: "Course created successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to create course",
    };
  }
}
