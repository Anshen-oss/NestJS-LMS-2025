import "server-only";
import { prisma } from "@/lib/db";
import { requireAdmin } from "./require-admin";

//const sleep = (ms: number) => new Promise<void>((res) => setTimeout(res, ms));

export async function adminGetCourses() {
  //await sleep(5000);
  await requireAdmin();

  const data = await prisma.course.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      title: true,
      smallDescription: true,
      duration: true,
      level: true,
      status: true,
      price: true,
      fileKey: true,
      slug: true,
    },
  });

  return data;
}

export type AdminCourseType = Awaited<ReturnType<typeof adminGetCourses>>[0];
