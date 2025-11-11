import "server-only";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { headers } from "next/headers";

export async function checkIfCourseBought(courseId: string): Promise<boolean> {
  // 1️⃣ Récupérer la session utilisateur
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Si pas de session -> pas d’accès
  if (!session?.user) return false;

  // 2️⃣ Vérifier l’inscription dans la DB
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: session.user.id,
        courseId,
      },
    },
    select: {
      status: true,
    },
  });

  return enrollment?.status === "Active" ? true : false;
}
