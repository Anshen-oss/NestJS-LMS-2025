'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetMyEnrollmentsQuery } from '@/lib/generated/graphql';
import { BookOpen, Loader2, Play } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function MyCoursesPage() {
  const { data, loading, error } = useGetMyEnrollmentsQuery({
    fetchPolicy: 'network-only',
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg font-semibold mb-2">Erreur</p>
          <p className="text-gray-600">{error.message}</p>
        </div>
      </div>
    );
  }

  // Calculer la progression pour chaque cours
  const courses = data?.myEnrollments?.map((enrollment: any) => {
    const totalLessons = enrollment.course.chapters?.reduce((acc: number, ch: any) => {
      return acc + (ch.lessons?.length || 0);
    }, 0) || 0;

    const completedLessons = enrollment.course.chapters?.reduce((acc: number, ch: any) => {
      return acc + (ch.lessons?.filter((l: any) => l.completed).length || 0);
    }, 0) || 0;

    const progress = totalLessons > 0
      ? Math.round((completedLessons / totalLessons) * 100)
      : 0;

    return {
      ...enrollment.course,
      progress,
    };
  }) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Mes Cours</h1>
          <p className="text-gray-600 text-lg">
            {courses.length === 0
              ? "Vous n'êtes inscrit à aucun cours"
              : `${courses.length} cours en cours`}
          </p>
        </div>

        {courses.length === 0 ? (
          <Card className="shadow-lg border-0 bg-white">
            <CardContent className="p-12">
              <div className="text-center">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="h-12 w-12 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Aucun cours inscrit
                </h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Explorez notre catalogue et inscrivez-vous à un cours pour commencer votre apprentissage !
                </p>
                <Button asChild size="lg" className="px-8">
                  <Link href="/courses">
                    Découvrir les cours
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course: any) => (
              <Card
                key={course.id}
                className="group hover:shadow-xl transition-all border-0 shadow-md overflow-hidden bg-white"
              >
                <div className="relative aspect-video">
                  {course.imageUrl ? (
                    <Image
                      src={course.imageUrl}
                      alt={course.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
                      <BookOpen className="w-16 h-16 text-blue-600" />
                    </div>
                  )}

                  {/* Progress overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <div className="flex items-center justify-between text-white text-sm mb-2">
                      <span className="font-medium">{course.progress}% complété</span>
                    </div>
                    <div className="w-full bg-white/30 rounded-full h-2">
                      <div
                        className="bg-white rounded-full h-2 transition-all"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                <CardHeader className="pb-3">
                  <CardTitle className="line-clamp-2 text-gray-900">
                    {course.title}
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <Button
                    asChild
                    className="w-full group-hover:bg-blue-700 transition-colors"
                  >
                    <Link href={`/student/courses/${course.id}`}>
                      <Play className="w-4 h-4 mr-2" />
                      Commencer le cours
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
