'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { useInstructorCourses, useInstructorStats, useRecentActivity } from '@/hooks/use-instructor-dashboard';
import { useUser } from '@clerk/nextjs';
import {
  AlertCircle,
  BookOpen,
  DollarSign,
  Eye,
  Plus,
  TrendingUp,
  Users
} from 'lucide-react';
import Link from 'next/link';

export default function InstructorDashboard() {
  const { user } = useUser();

  // Utiliser les hooks custom
  const { stats, loading: statsLoading, error: statsError } = useInstructorStats();
  const { courses, loading: coursesLoading, error: coursesError } = useInstructorCourses();
  const { activities, loading: activitiesLoading, error: activitiesError } = useRecentActivity(10);

  // Fonction pour formater les types d'activité
  const getActivityText = (activity: typeof activities[0]) => {
    switch (activity.type) {
      case 'ENROLLMENT':
        return `${activity.student.name} s'est inscrit`;
      case 'LESSON_COMPLETED':
        return `${activity.student.name} a terminé`;
      case 'COMPLETION':
        return `${activity.student.name} a complété`;
      case 'REVIEW':
        return `${activity.student.name} a laissé un avis`;
      default:
        return `${activity.student.name}`;
    }
  };

  // Fonction pour formater le temps relatif
  const getRelativeTime = (date: string) => {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now.getTime() - past.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return 'Il y a moins d\'1h';
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays === 1) return 'Il y a 1j';
    return `Il y a ${diffDays}j`;
  };

  // Afficher une erreur si nécessaire
  if (statsError || coursesError || activitiesError) {
    return (
      <div className="py-8 px-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Une erreur s'est produite lors du chargement des données. Veuillez réessayer.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="py-8 px-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-300 mb-2">
              Bonjour {user?.firstName} ! 👋
            </h1>
            <p className="text-gray-500 text-lg">
              Voici un aperçu de votre activité d'enseignement
            </p>
          </div>
          <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
            <Link href="/instructor/courses/new">
              <Plus className="w-5 h-5 mr-2" />
              Créer un cours
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Cours Actifs */}
        <Card className="border-l-4 border-l-blue-500 bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Cours Actifs
            </CardTitle>
            <BookOpen className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-10 w-20" />
            ) : (
              <>
                <div className="text-3xl font-bold text-gray-900">{stats?.totalCourses || 0}</div>
                <p className="text-xs text-gray-500 mt-1">
                  {stats?.publishedCourses || 0} publiés
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Étudiants */}
        <Card className="border-l-4 border-l-green-500 bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Étudiants
            </CardTitle>
            <Users className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-10 w-20" />
            ) : (
              <>
                <div className="text-3xl font-bold text-gray-900">{stats?.totalStudents || 0}</div>
                <p className="text-xs text-gray-500 mt-1">
                  {stats?.activeStudents || 0} actifs
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Revenus */}
        <Card className="border-l-4 border-l-yellow-500 bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Revenus
            </CardTitle>
            <DollarSign className="h-5 w-5 text-yellow-600" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-10 w-20" />
            ) : (
              <>
                <div className="text-3xl font-bold text-gray-900">
                  ${stats?.totalRevenue.toFixed(2) || '0.00'}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  ${stats?.monthlyRevenue.toFixed(2) || '0.00'} ce mois
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Vues */}
        <Card className="border-l-4 border-l-purple-500 bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Vues
            </CardTitle>
            <Eye className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-10 w-20" />
            ) : (
              <>
                <div className="text-3xl font-bold text-gray-900">{stats?.totalViews || 0}</div>
                <p className="text-xs text-gray-500 mt-1">
                  {stats?.weeklyViews || 0} cette semaine
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Mes cours */}
        <Card className="bg-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Mes Cours</CardTitle>
              <Button asChild variant="ghost" size="sm">
                <Link href="/instructor/courses">
                  Voir tout
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {coursesLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {courses.slice(0, 3).map((course) => (
                  <div key={course.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900">{course.title}</h4>
                        {course.status === 'Draft' && (
                          <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded">
                            Brouillon
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {course.studentsCount} étudiants
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          ${course.revenue.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/courses/${course.id}/edit`}>
                        Gérer
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Activité Récente */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Activité Récente</CardTitle>
          </CardHeader>
          <CardContent>
            {activitiesLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {activities.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      activity.type === 'ENROLLMENT' ? 'bg-green-100' :
                      activity.type === 'LESSON_COMPLETED' ? 'bg-blue-100' :
                      'bg-yellow-100'
                    }`}>
                      {activity.type === 'ENROLLMENT' && <Users className="w-5 h-5 text-green-600" />}
                      {activity.type === 'LESSON_COMPLETED' && <BookOpen className="w-5 h-5 text-blue-600" />}
                      {activity.type === 'REVIEW' && <TrendingUp className="w-5 h-5 text-yellow-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {getActivityText(activity)}
                      </p>
                      <p className="text-xs text-gray-600">{activity.course.title}</p>
                      {activity.lessonTitle && (
                        <p className="text-xs text-gray-500">Leçon : {activity.lessonTitle}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">{getRelativeTime(activity.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Performance Chart */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Taux de complétion moyen
          </CardTitle>
        </CardHeader>
        <CardContent>
          {statsLoading ? (
            <Skeleton className="h-32 w-full" />
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Progress value={stats?.averageCompletionRate || 0} className="h-4" />
                </div>
                <span className="text-2xl font-bold text-gray-900">
                  {stats?.averageCompletionRate.toFixed(1) || 0}%
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Taux de complétion moyen de tous vos cours
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
