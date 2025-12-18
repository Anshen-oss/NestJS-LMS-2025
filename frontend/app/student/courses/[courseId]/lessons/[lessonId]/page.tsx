
'use client';

import { Button } from '@/components/ui/button';
import { useGetCourseWithLessonsQuery } from '@/lib/generated/graphql';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { CourseProgressHeader } from './_components/CourseProgressHeader';
import { LessonContent } from './_components/LessonContent';
import { LessonSidebar } from './_components/LessonSidebar';

export default function StudentLessonPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;
  const lessonId = params.lessonId as string;

  const { data, loading, refetch } = useGetCourseWithLessonsQuery({
    variables: { id: courseId },
    fetchPolicy: 'network-only', // ✅ Force le refetch depuis le serveur
  });

const handleProgressUpdate = async () => {
  await refetch();
};

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-700 font-medium">Chargement du cours...</p>
        </div>
      </div>
    );
  }

  const course = data?.course;

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">😕</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Cours introuvable</h2>
          <p className="text-gray-600 mb-6">Ce cours n'existe pas ou a été supprimé.</p>
          <Button onClick={() => router.push('/student')}>
            Retour au dashboard
          </Button>
        </div>
      </div>
    );
  }

  // Trouver la leçon actuelle, précédente et suivante
  const allLessons = course.chapters?.flatMap((ch: any) => ch.lessons) || [];
  const currentIndex = allLessons.findIndex((l: any) => l.id === lessonId);
  const previousLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  // Calculer la durée totale du cours (somme des durées des leçons)
  const courseDuration = allLessons.reduce((total: number, lesson: any) => {
    return total + (lesson.duration || 0);
  }, 0);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header avec progression */}
      <CourseProgressHeader
        courseId={courseId}
        courseTitle={course.title}
        courseDuration={courseDuration}
      />

      {/* Contenu principal */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar gauche */}
        <aside className="w-[360px] bg-white border-r border-gray-200 flex-shrink-0 overflow-y-auto">
          <LessonSidebar
            key={`sidebar-${courseId}-${Date.now()}`}
            course={course}
            currentLessonId={lessonId}
          />
        </aside>

        {/* Contenu principal - Scrollable */}
        <main className="flex-1 overflow-y-auto bg-white">
          <LessonContent
            courseId={courseId}
            lessonId={lessonId}
            course={course}
            onProgressUpdate={handleProgressUpdate} // ← Vérifie que c'est bien passé
          />

          {/* Navigation Précédent/Suivant */}
          <div className="max-w-4xl mx-auto px-8 pb-12">
            <div className="flex items-center justify-between pt-8 border-t border-gray-200">
              {previousLesson ? (
                <Button
                  variant="outline"
                  onClick={() => router.push(`/student/courses/${courseId}/lessons/${previousLesson.id}`)}
                  className="border-gray-300 text-gray-900 hover:bg-gray-50"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Précédent
                </Button>
              ) : (
                <div />
              )}

              {nextLesson ? (
                <Button
                  onClick={() => router.push(`/student/courses/${courseId}/lessons/${nextLesson.id}`)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Suivant
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={() => router.push('/student')}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Terminer le cours
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
