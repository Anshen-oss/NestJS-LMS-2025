'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useGetMyEnrolledCoursesQuery } from '@/lib/generated/graphql';
import { BookOpen } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function StudentDashboard() {
  const { data, loading, error } = useGetMyEnrolledCoursesQuery({
    fetchPolicy: 'network-only',
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container max-w-7xl py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Chargement de vos cours...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container max-w-7xl py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">
              Erreur lors du chargement : {error.message}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const courses = data?.myEnrolledCourses || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container max-w-7xl py-8">
        {courses.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="h-10 w-10 text-blue-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Aucun cours inscrit
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Explorez notre catalogue et commencez votre parcours d'apprentissage dès aujourd'hui !
            </p>
            <Button asChild size="lg" className="gap-2">
              <Link href="/courses">
                <BookOpen className="w-5 h-5" />
                Parcourir les cours
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Mes Cours</h1>
              <p className="text-lg text-gray-600">
                Continuez votre apprentissage là où vous vous êtes arrêté
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course: any) => (
                <Card
                  key={course.id}
                  className="overflow-hidden hover:shadow-xl transition-all duration-300 border-gray-200 group bg-white"
                >
                  <div className="relative aspect-video bg-gradient-to-br from-blue-50 to-indigo-50 overflow-hidden">
                    {course.imageUrl ? (
                      <Image
                        src={course.imageUrl}
                        alt={course.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="w-16 h-16 text-blue-300" />
                      </div>
                    )}
                  </div>

                  <CardHeader className="pb-3 bg-white">
                    <CardTitle className="line-clamp-2 text-xl text-gray-900">
                      {course.title}
                    </CardTitle>

                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                        {course.createdBy.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium">{course.createdBy.name}</span>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4 pt-0 bg-white">
                    <div className="space-y-2 bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-700 font-medium">Progression</span>
                        <span className="font-bold text-blue-600">
                          {course.progress.percentage}%
                        </span>
                      </div>
                      <Progress
                        value={course.progress.percentage}
                        className="h-2.5 bg-gray-200"
                      />
                      <p className="text-xs text-gray-600 flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5" />
                        {course.progress.completedCount} / {course.progress.totalCount} leçons complétées
                      </p>
                    </div>

                    <Button asChild className="w-full h-11 font-semibold">
                      <Link href={`/student/courses/${course.id}`}>
                        {course.progress.percentage === 0 ? 'Commencer le cours' : 'Continuer'}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
