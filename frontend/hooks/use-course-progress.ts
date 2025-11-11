import { CourseSidebarDataType } from "@/app/data/course/get-course-sidebar-data";
import { useMemo } from "react";

interface iAppProps {
  courseData: CourseSidebarDataType["course"];
}

interface CourseProgressResult {
  completedLessons: number;
  totalLessons: number;
  progressPercentage: number;
}

export function useCourseProgress({
  courseData,
}: iAppProps): CourseProgressResult {
  return useMemo(() => {
    let totalLessons = 0;
    let completedLessons = 0;

    courseData.chapter.forEach((chapter) => {
      chapter.lessons.forEach((lesson) => {
        totalLessons++;

        // check if the lesson is completed
        const isCompleted = lesson.lessonProgress.some(
          (progress) => progress.lessonId === lesson.id && progress.completed
        );

        if (isCompleted) {
          completedLessons++;
        }
      });
    });

    // Calculate the progress percentage
    const progressPercentage =
      totalLessons > 0
        ? Math.round((completedLessons / totalLessons) * 100)
        : 0;

    return {
      completedLessons,
      totalLessons,
      progressPercentage,
    };
  }, [courseData]);
}
