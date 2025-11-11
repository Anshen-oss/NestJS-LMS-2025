import "server-only";
import { requireAdmin } from "./require-admin";
import { prisma } from "@/lib/db";

export async function adminGetRecentCourses() {
  //await new Promise((resolve) => setTimeout(resolve, 5000));

  await requireAdmin();

  const data = await prisma.course.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 2,
    select: {
      id: true,
      title: true,
      smallDescription: true,
      price: true,
      duration: true,
      level: true,
      status: true,
      fileKey: true,
      slug: true,
    },
  });

  return data;
}
