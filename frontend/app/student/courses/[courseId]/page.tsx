'use client';

import { useGetCourseWithLessonsQuery } from '@/lib/generated/graphql';
import { Loader2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

export default function StudentCoursePage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;

  const { data, loading, error } = useGetCourseWithLessonsQuery({
    variables: { id: courseId },
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Erreur : {error.message}</p>
          <button onClick={() => router.push('/student')}>
            Retour à mes cours
          </button>
        </div>
      </div>
    );
  }

  const course = data?.course;

  // Trouver la première leçon
  const firstChapter = course?.chapters?.find(ch => ch.lessons.length > 0);
  const firstLesson = firstChapter?.lessons?.[0];

  if (!firstLesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Ce cours n'a pas encore de leçons</p>
          <button onClick={() => router.push('/student')}>
            Retour à mes cours
          </button>
        </div>
      </div>
    );
  }

  // Rediriger automatiquement vers la première leçon
  router.push(`/student/courses/${courseId}/lessons/${firstLesson.id}`);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
    </div>
  );
}
