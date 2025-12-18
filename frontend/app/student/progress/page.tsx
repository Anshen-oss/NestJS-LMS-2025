'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetMyEnrollmentsQuery } from '@/lib/generated/graphql';
import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Flame,
  Loader2,
  Play,
  Target,
  TrendingUp,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function ProgressPage() {
  const { data, loading } = useGetMyEnrollmentsQuery({
    fetchPolicy: 'network-only',
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  // Calculer les stats avec progression
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
      ...enrollment,
      course: enrollment.course,
      totalLessons,
      completedLessons,
      progress,
    };
  }) || [];

  // Stats globales
  const totalCourses = courses.length;
  const activeCourses = courses.filter((c: any) => c.progress > 0 && c.progress < 100).length;
  const completedCourses = courses.filter((c: any) => c.progress === 100).length;

  const totalLessonsGlobal = courses.reduce((acc: number, c: any) => acc + c.totalLessons, 0);
  const completedLessonsGlobal = courses.reduce((acc: number, c: any) => acc + c.completedLessons, 0);
  const globalProgress = totalLessonsGlobal > 0
    ? Math.round((completedLessonsGlobal / totalLessonsGlobal) * 100)
    : 0;

  // Trier par progression
  const inProgressCourses = courses.filter((c: any) => c.progress > 0 && c.progress < 100);
  const notStartedCourses = courses.filter((c: any) => c.progress === 0);
  const completedCoursesData = courses.filter((c: any) => c.progress === 100);

  // Série de progression (simule activité sur 7 derniers jours)
  const activityData = [65, 59, 80, 81, 56, 55, 40];

  return (
    <div className="py-8 px-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-300 mb-2">Ma Progression</h1>
        <p className="text-gray-400 text-lg">
          Suivez votre parcours d'apprentissage et vos accomplissements
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="border-l-4 border-l-blue-500 bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Progression Globale
            </CardTitle>
            <Target className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{globalProgress}%</div>
            <Progress value={globalProgress} className="mt-2" />
            <p className="text-xs text-gray-500 mt-2">
              {completedLessonsGlobal} / {totalLessonsGlobal} leçons
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Cours Actifs
            </CardTitle>
            <BookOpen className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{activeCourses}</div>
            <p className="text-xs text-gray-500 mt-1">
              En cours d'apprentissage
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500 bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Cours Complétés
            </CardTitle>
            <Award className="h-5 w-5 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{completedCourses}</div>
            <p className="text-xs text-gray-500 mt-1">
              Sur {totalCourses} cours inscrits
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Série d'Activité
            </CardTitle>
            <Flame className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">7 🔥</div>
            <p className="text-xs text-gray-500 mt-1">
              Jours consécutifs
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Activity Chart (simple representation) */}
      <Card className="mb-8 bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Activité des 7 derniers jours
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-2 h-32">
            {activityData.map((value, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-blue-500 rounded-t transition-all hover:bg-blue-600"
                  style={{ height: `${value}%` }}
                ></div>
                <span className="text-xs text-gray-500">
                  {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'][index]}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tabs pour cours */}
      <Tabs defaultValue="in-progress" className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
          <TabsTrigger
            value="in-progress"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-6 py-3"
          >
            En cours ({inProgressCourses.length})
          </TabsTrigger>
          <TabsTrigger
            value="completed"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-green-600 data-[state=active]:bg-transparent px-6 py-3"
          >
            Complétés ({completedCoursesData.length})
          </TabsTrigger>
          <TabsTrigger
            value="not-started"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-gray-600 data-[state=active]:bg-transparent px-6 py-3"
          >
            Non commencés ({notStartedCourses.length})
          </TabsTrigger>
        </TabsList>

        {/* En cours */}
        <TabsContent value="in-progress" className="mt-6">
          {inProgressCourses.length === 0 ? (
            <Card className="bg-white">
              <CardContent className="pt-6 text-center py-12">
                <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">Aucun cours en cours</h3>
                <p className="text-gray-600 mb-4">
                  Commencez un cours pour voir votre progression ici
                </p>
                <Button asChild>
                  <Link href="/student/my-courses">Voir mes cours</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {inProgressCourses.map((course: any) => (
                <Card key={course.id} className="bg-white hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex gap-6">
                      {/* Image */}
                      <div className="relative w-48 h-32 flex-shrink-0 rounded-lg overflow-hidden">
                        <Image
                          src={course.course.imageUrl || '/placeholder.jpg'}
                          alt={course.course.title}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 flex flex-col">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">
                              {course.course.title}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <CheckCircle2 className="w-4 h-4" />
                                {course.completedLessons}/{course.totalLessons} leçons
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {course.course.duration}h
                              </span>
                            </div>
                          </div>
                          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                            {course.progress}%
                          </Badge>
                        </div>

                        {/* Progress bar */}
                        <div className="mb-4">
                          <Progress value={course.progress} className="h-2" />
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">
                            Mis à jour il y a 2 jours
                          </span>
                          <Button asChild size="sm">
                            <Link href={`/student/courses/${course.course.id}`}>
                              <Play className="w-4 h-4 mr-2" />
                              Continuer
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Complétés */}
        <TabsContent value="completed" className="mt-6">
          {completedCoursesData.length === 0 ? (
            <Card className="bg-white">
              <CardContent className="pt-6 text-center py-12">
                <Award className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">Aucun cours complété</h3>
                <p className="text-gray-600">
                  Terminez un cours pour obtenir votre certificat
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {completedCoursesData.map((course: any) => (
                <Card key={course.id} className="bg-white hover:shadow-lg transition-shadow">
                  <div className="relative aspect-video">
                    <Image
                      src={course.course.imageUrl || '/placeholder.jpg'}
                      alt={course.course.title}
                      fill
                      className="object-cover rounded-t-lg"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-green-600 text-white">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Complété
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {course.course.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Complété le 15 déc. 2024
                      </span>
                    </div>
                    <Button asChild variant="outline" className="w-full">
                      <Link href={`/student/courses/${course.course.id}`}>
                        Revoir le cours
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Non commencés */}
        <TabsContent value="not-started" className="mt-6">
          {notStartedCourses.length === 0 ? (
            <Card className="bg-white">
              <CardContent className="pt-6 text-center py-12">
                <Target className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">Tous les cours commencés</h3>
                <p className="text-gray-600">
                  Excellent ! Vous avez commencé tous vos cours
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {notStartedCourses.map((course: any) => (
                <Card key={course.id} className="bg-white hover:shadow-lg transition-shadow">
                  <div className="relative aspect-video">
                    <Image
                      src={course.course.imageUrl || '/placeholder.jpg'}
                      alt={course.course.title}
                      fill
                      className="object-cover rounded-t-lg"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {course.course.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {course.totalLessons} leçons • {course.course.duration}h
                    </p>
                    <Button asChild className="w-full">
                      <Link href={`/student/courses/${course.course.id}`}>
                        <Play className="w-4 h-4 mr-2" />
                        Commencer
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
