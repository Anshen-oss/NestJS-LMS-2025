'use client';

import { useGetCourseForEditQuery } from '@/lib/generated/graphql';
import { useParams } from 'next/navigation';
import { CourseProgressHeader } from './_components/CourseProgressHeader';
import { LessonContent } from './_components/LessonContent';
import { LessonSidebar } from './_components/LessonSidebar';

export default function StudentLessonPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const lessonId = params.lessonId as string;

  const { data, loading, refetch } = useGetCourseForEditQuery({
    variables: { id: courseId },
  });

  const handleProgressUpdate = async () => {
    await refetch();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const course = data?.getCourseForEdit;

  if (!course) {
    return <div>Cours introuvable</div>;
  }

  return (
    <div className="student-lesson-page"><div className="flex flex-col h-screen bg-white">
      {/* Header avec progression - NOUVEAU */}
      <CourseProgressHeader
        courseId={courseId}
        courseTitle={course.title}
        courseDuration={course.duration}
      />

      {/* Contenu principal */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar fixe gauche - Style Coursera */}
        <aside className="w-[340px] border-r border-gray-200 flex-shrink-0 overflow-y-auto">
          <LessonSidebar
            course={course}
            currentLessonId={lessonId}
          />
        </aside>

        {/* Contenu principal - UNE seule scrollbar */}
        <main className="flex-1 overflow-y-auto">
          <LessonContent
            courseId={courseId}
            lessonId={lessonId}
            course={course}
            onProgressUpdate={handleProgressUpdate}
          />
        </main>
      </div>
    </div></div>

  );
}
