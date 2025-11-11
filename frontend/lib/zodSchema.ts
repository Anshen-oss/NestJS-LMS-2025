import { z } from "zod";

export const courseLevels = ["Beginner", "Intermediate", "Advanced"] as const;
export const courseStatus = ["Draft", "Published", "Archived"] as const;

export const courseCategories = [
  "Development",
  "Interviews",
  "Business",
  "DevOps",
  "Design",
  "Data Structures & Algorithms",
  "Web Development Tutorials",
  "Finance",
  "Marketing",
  "Health & Fitness",
] as const;

export const courseSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters long" })
    .max(100, { message: "Title must be at most 100 characters long..." }),
  description: z
    .string()
    .min(3, { message: "Description must be at least 3 characters long" })
    .max(2500, {
      message: "Description must be at most 2500 characters long...",
    }),
  price: z.coerce
    .number()
    .min(1, { message: "Price must be a positive number" }),
  fileKey: z.string().min(1).optional(),
  duration: z.coerce
    .number()
    .min(1, { message: "Duration must be at least 1 hour." })
    .max(500, { message: "Duration must be at most 500 hours." }),
  level: z.enum(courseLevels, { message: "Level is required" }),
  category: z.enum(courseCategories, { message: "Category is required" }),
  smallDescription: z
    .string()
    .min(3, { message: "Small Description must be at least 3 characters long" })
    .max(500, {
      message: "Small Description must be at most 500 characters long...",
    }),
  slug: z
    .string()
    .min(3, { message: "Title must be at least 3 characters long" }),
  status: z.enum(courseStatus, { message: "Status is required" }),
});

export const chapterSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" }),
  courseId: z.uuid({ message: "Invalid course ID" }),
});

export const lessonSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" }),
  courseId: z.uuid({ message: "Invalid course ID" }),
  chapterId: z.uuid({ message: "Invalid chapter ID" }),
  description: z
    .string()
    .min(3, { message: "Description must be at least 3 characters long" })
    .optional(),
  thumbnailKey: z.string().optional(),
  videoKey: z.string().optional(),
  // position: non nécessaire dans le formulaire (calculée)
});

export type CourseSchemaType = z.infer<typeof courseSchema>;
export type ChapterSchemaType = z.infer<typeof chapterSchema>;
export type LessonSchemaType = z.infer<typeof lessonSchema>;
