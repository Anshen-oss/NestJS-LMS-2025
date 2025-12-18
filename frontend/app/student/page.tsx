'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetMyEnrollmentsQuery } from '@/lib/generated/graphql';
import { useUser } from '@clerk/nextjs';
import { Award, BookOpen, Clock, Loader2, Play, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function StudentDashboard() {
  const { user } = useUser();
  const { data, loading } = useGetMyEnrollmentsQuery();

  // ✅ Calculer la progression pour chaque enrollment
  const enrolledCourses = data?.myEnrollments?.map((enrollment: any) => {
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
      ...enrollment,
      progress,  // ✅ Ajouter le champ calculé
    };
  }) || [];

  const activeCourses = enrolledCourses.length;

  // Calculer les stats globales
  const totalLessons = enrolledCourses.reduce((acc, enrollment: any) => {
    return acc + (enrollment.course.chapters?.reduce((chAcc: number, ch: any) => {
      return chAcc + (ch.lessons?.length || 0);
    }, 0) || 0);
  }, 0);

  const completedLessons = enrolledCourses.reduce((acc, enrollment: any) => {
    return acc + (enrollment.course.chapters?.reduce((chAcc: number, ch: any) => {
      return chAcc + (ch.lessons?.filter((l: any) => l.completed).length || 0);
    }, 0) || 0);
  }, 0);

  const globalProgress = totalLessons > 0
    ? Math.round((completedLessons / totalLessons) * 100)
    : 0;

  // Compter les cours 100% complétés
  const completedCoursesCount = enrolledCourses.filter((e: any) => e.progress === 100).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec dégradé */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                Salut {user?.firstName} ! 👋
              </h1>
              <p className="text-blue-100 text-lg">
                Prêt à apprendre quelque chose de nouveau aujourd'hui ?
              </p>
            </div>
            <Button
              asChild
              size="lg"
              className="bg-white text-blue-600 hover:bg-blue-50"
            >
              <Link href="/courses">
                Découvrir des cours
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-8">
        {/* Stats Cards avec ombres */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-blue-500 shadow-md hover:shadow-lg transition-shadow bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Cours actifs
              </CardTitle>
              <BookOpen className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{activeCourses}</div>
              <p className="text-xs text-gray-500 mt-1">
                {activeCourses === 0 ? 'Aucun cours' : `${activeCourses} cours en cours`}
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500 shadow-md hover:shadow-lg transition-shadow bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Leçons terminées
              </CardTitle>
              <Clock className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{completedLessons}</div>
              <p className="text-xs text-gray-500 mt-1">
                Sur {totalLessons} leçons
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-yellow-500 shadow-md hover:shadow-lg transition-shadow bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Certificats
              </CardTitle>
              <Award className="h-5 w-5 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{completedCoursesCount}</div>
              <p className="text-xs text-gray-500 mt-1">
                Cours complétés
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500 shadow-md hover:shadow-lg transition-shadow bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Progression
              </CardTitle>
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{globalProgress}%</div>
              <p className="text-xs text-gray-500 mt-1">
                Moyenne globale
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Mes cours ou Empty State */}
        {activeCourses === 0 ? (
          <Card className="shadow-lg border-0 bg-white">
            <CardContent className="p-12">
              <div className="text-center">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="h-12 w-12 text-blue-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                  Commencez votre voyage d'apprentissage ! 🚀
                </h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
                  Explorez notre catalogue de cours et trouvez celui qui vous correspond !
                </p>
                <Button asChild size="lg" className="px-8">
                  <Link href="/courses">
                    Parcourir les cours
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Mes cours ({activeCourses})
              </h2>
              <Button asChild>
                <Link href="/student/my-courses">
                  Voir tous mes cours
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.map((enrollment: any) => (
                <Card key={enrollment.id} className="group hover:shadow-xl transition-all border-0 shadow-md overflow-hidden bg-white">
                  <div className="relative aspect-video">
                    <Image
                      src={enrollment.course.imageUrl || '/placeholder-course.jpg'}
                      alt={enrollment.course.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* Progress overlay */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                      <div className="flex items-center justify-between text-white text-sm mb-2">
                        <span className="font-medium">{enrollment.progress}% complété</span>
                      </div>
                      <div className="w-full bg-white/30 rounded-full h-2">
                        <div
                          className="bg-white rounded-full h-2 transition-all"
                          style={{ width: `${enrollment.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg mb-2 line-clamp-2 text-gray-900">
                      {enrollment.course.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                      {enrollment.course.smallDescription || 'Aucune description disponible'}
                    </p>
                    <Button asChild className="w-full group-hover:bg-blue-700 transition-colors">
                      <Link href={`/student/courses/${enrollment.course.id}`}>
                        <Play className="w-4 h-4 mr-2" />
                        Continuer
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
