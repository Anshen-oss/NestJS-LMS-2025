"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import {
  chapterSchema,
  ChapterSchemaType,
  courseSchema,
  CourseSchemaType,
  lessonSchema,
  LessonSchemaType,
} from "@/lib/zodSchema";

import arcjet, { fixedWindow } from "@/lib/arcjet";
import { request } from "@arcjet/next";
import { revalidatePath } from "next/cache";

const aj = arcjet.withRule(
  fixedWindow({
    mode: "LIVE",
    window: "1m",
    max: 2,
  })
);

export async function editCourse(
  data: CourseSchemaType,
  courseId: string
): Promise<ApiResponse> {
  const session = await requireAdmin();
  const { user } = session;

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

    const result = courseSchema.safeParse(data);

    if (!result.success) {
      return {
        status: "error",
        message: "Invalid data",
      };
    }

    await prisma.course.update({
      where: {
        id: courseId,
        userId: user.id,
      },
      data: {
        ...result.data,
      },
    });

    return { status: "success", message: "Course updated successfully" };
  } catch (err) {
    console.error("[editCourse] ❌ Error:", err);
    return {
      status: "error",
      message: "An error occurred while updating the course",
    };
  }
}

export async function reorderLessons(
  chapterId: string,
  lessons: { id: string; position: number }[],
  courseId: string
): Promise<ApiResponse> {
  // 🔐 Authorization (before try/catch to let redirect if non-admin)
  await requireAdmin();

  try {
    if (!lessons || lessons.length === 0) {
      return {
        status: "error",
        message: "No lessons for reordering",
      };
    }

    // 🧱 Préparer les commandes d'update (une par leçon)
    const updates = lessons.map((lesson) =>
      prisma.lesson.update({
        where: {
          id: lesson.id,
          // garde-fou: on met aussi chapterId pour s'assurer du bon parent
          chapterId,
        },
        data: {
          position: lesson.position,
        },
      })
    );

    // 🧨 Exécuter toutes les updates en une seule transaction
    await prisma.$transaction(updates);

    // 🧼 Purger le cache pour recharger la nouvelle structure
    revalidatePath(`/admin/courses/${courseId}/edit`);

    return { status: "success", message: "Lesson reordered successfully" };
  } catch {
    return {
      status: "error",
      message: "Failed to reorder lessons.",
    };
  }
}

export async function reorderChapters(
  courseId: string,
  chapters: { id: string; position: number }[]
): Promise<ApiResponse> {
  try {
    // 🔐 Authorization
    await requireAdmin();

    if (!chapters || chapters.length === 0) {
      return { status: "error", message: "" };
    }

    //Generates one update command per chapter
    const updates = chapters.map((chapter) =>
      prisma.chapter.update({
        where: {
          id: chapter.id,
          courseId, // garde-fou: s’assure d’appartenir au bon cours
        },
        data: {
          position: chapter.position,
        },
      })
    );

    // 🧨 Transaction unique
    await prisma.$transaction(updates);

    // 🧼 Revalidation de la page d’édition du cours
    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      status: "success",
      message: "Chapters reordered successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to reorder chapters.",
    };
  }
}

export async function createChapter(
  values: ChapterSchemaType
): Promise<ApiResponse> {
  await requireAdmin();
  try {
    const result = chapterSchema.safeParse(values);

    if (!result.success) {
      return {
        status: "error",
        message: "Invalid data",
      };
    }

    await prisma.$transaction(async (tx) => {
      const maxPosition = await tx.chapter.findFirst({
        where: { courseId: result.data.courseId },
        select: { position: true },
        orderBy: { position: "desc" },
      });

      await tx.chapter.create({
        data: {
          title: result.data.name,
          courseId: result.data.courseId,
          position: (maxPosition?.position ?? 0) + 1,
        },
      });
    });

    revalidatePath(`/admin/courses/${result.data.courseId}/edit`);
    return { status: "success", message: "Chapter created successfully" };
  } catch {
    return { status: "error", message: "Failed to create chapter." };
  }
}

export async function createLesson(
  values: LessonSchemaType
): Promise<ApiResponse> {
  await requireAdmin();
  try {
    const result = lessonSchema.safeParse(values);

    if (!result.success) {
      return {
        status: "error",
        message: "Invalid data",
      };
    }

    await prisma.$transaction(async (tx) => {
      const maxPosition = await tx.lesson.findFirst({
        where: { chapterId: result.data.chapterId },
        select: { position: true },
        orderBy: { position: "desc" },
      });

      await tx.lesson.create({
        data: {
          title: result.data.name,
          description: result.data.description,
          thumbnailKey: result.data.thumbnailKey,
          videoKey: result.data.videoKey,
          chapterId: result.data.chapterId,
          position: (maxPosition?.position ?? 0) + 1,
        },
      });
    });

    revalidatePath(`/admin/courses/${result.data.courseId}/edit`);
    return { status: "success", message: "Lesson created successfully" };
  } catch {
    return { status: "error", message: "Failed to create lesson." };
  }
}

export async function deleteLesson({
  chapterId,
  courseId,
  lessonId,
}: {
  chapterId: string;
  courseId: string;
  lessonId: string;
}): Promise<ApiResponse> {
  await requireAdmin();
  try {
    // 1) Récupérer le chapitre avec ses leçons (id + position), triées ASC
    const chapterWithLessons = await prisma.chapter.findUnique({
      where: { id: chapterId },
      select: {
        lessons: {
          orderBy: { position: "asc" },
          select: { id: true, position: true },
        },
      },
    });

    // 2) Chapter not found
    if (!chapterWithLessons) {
      return { status: "error", message: "Chapter not found" };
    }

    const lessons = chapterWithLessons.lessons;

    // 3) Find the lesson to delete
    const lessonToDelete = lessons.find((lesson) => lesson.id === lessonId);

    if (!lessonToDelete) {
      return { status: "error", message: "Lesson not found in the chapter" };
    }

    // 4) Keep remaining lessons
    const remainingLessons = lessons.filter((lesson) => lesson.id !== lessonId);

    // 5) Préparer la renumérotation (index + 1)
    const updates = remainingLessons.map((lesson, index) => {
      return prisma.lesson.update({
        where: { id: lesson.id },
        data: { position: index + 1 },
      });
    });

    // 6) Transaction : updates + suppression sécurisée (id + chapterId)
    await prisma.$transaction([
      ...updates,
      prisma.lesson.delete({ where: { id: lessonId, chapterId: chapterId } }),
    ]);

    revalidatePath(`/admin/courses/${courseId}/edit`);
    return { status: "success", message: "Lesson deleted successfully" };
  } catch {
    return { status: "error", message: "Failed to delete lesson" };
  }
}

// export async function deleteChapter({
//   chapterId,
//   courseId,
// }: {
//   chapterId: string;
//   courseId: string;
// }): Promise<ApiResponse> {
//   await requireAdmin();
//   try {
//     // 1) // Charger les chapitres du cours triés par position
//     const courseWithChapters = await prisma.course.findUnique({
//       where: { id: courseId },
//       select: {
//         chapter: {
//           orderBy: { position: "asc" },
//           select: { id: true, position: true },
//         },
//       },
//     });

//     // 2) Chapter not found
//     if (!courseWithChapters) {
//       return { status: "error", message: "Course not found" };
//     }

//     const chapters = courseWithChapters.chapter;

//     // 3) Find the lesson to delete
//     const chapterToDelete = chapters.find(
//       (chapter) => chapter.id === chapterId
//     );

//     if (!chapterToDelete) {
//       return { status: "error", message: "Chapter not found in the Course" };
//     }

//     // 4) Keep remaining lessons
//     const remainingChapters = chapters.filter(
//       (chapter) => chapter.id !== chapterId
//     );

//     // 5) Préparer la renumérotation (index + 1)
//     const updates = remainingChapters.map((chapter, index) => {
//       return prisma.chapter.update({
//         where: { id: chapter.id },
//         data: { position: index + 1 },
//       });
//     });

//     // 6) Transaction : updates + suppression sécurisée (id + chapterId)
//     await prisma.$transaction([
//       ...updates,
//       prisma.chapter.delete({ where: { id: chapterId } }),
//     ]);

//     revalidatePath(`/admin/courses/${courseId}/edit`);
//     return {
//       status: "success",
//       message: "Chapter deleted and position reordered successfully",
//     };
//   } catch {
//     return { status: "error", message: "Failed to delete chapter" };
//   }
// }

export async function deleteChapter({
  chapterId,
  courseId,
}: {
  chapterId: string;
  courseId: string;
}): Promise<ApiResponse> {
  await requireAdmin();
  try {
    // Charger les chapitres du cours triés par position
    const courseWithChapters = await prisma.course.findUnique({
      where: { id: courseId },
      select: {
        chapter: {
          orderBy: { position: "asc" },
          select: { id: true, position: true },
        },
      },
    });

    if (!courseWithChapters) {
      return { status: "error", message: "Course not found" };
    }

    const chapters = courseWithChapters.chapter;
    const chapterToDelete = chapters.find((c) => c.id === chapterId);
    if (!chapterToDelete) {
      return { status: "error", message: "Chapter not found in the course" };
    }

    // Prépare les positions APRÈS suppression
    const remainingChapters = chapters
      .filter((c) => c.id !== chapterId)
      .map((c, index) => ({
        id: c.id,
        position: index + 1,
      }));

    await prisma.$transaction([
      // 1) Supprimer d'abord les leçons (évite la contrainte FK)
      prisma.lesson.deleteMany({ where: { chapterId } }),

      // 2) Supprimer le chapitre
      prisma.chapter.delete({ where: { id: chapterId } }),

      // 3) Renuméroter les chapitres restants
      ...remainingChapters.map((c) =>
        prisma.chapter.update({
          where: { id: c.id },
          data: { position: c.position },
        })
      ),
    ]);

    revalidatePath(`/admin/courses/${courseId}/edit`);
    return {
      status: "success",
      message: "Chapter deleted and positions reordered successfully",
    };
  } catch (e) {
    console.error("deleteChapter error:", e);
    return { status: "error", message: "Failed to delete chapter" };
  }
}
