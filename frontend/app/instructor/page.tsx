'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useUser } from '@clerk/nextjs';
import {
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

  // TODO: Remplacer par de vraies données GraphQL
  const stats = {
    totalCourses: 3,
    totalStudents: 127,
    totalRevenue: 4850,
    totalViews: 1543,
  };

  const recentCourses = [
    {
      id: '1',
      title: 'TypeScript 2025 - Devenir expert',
      students: 67,
      revenue: 2680,
      status: 'published',
    },
    {
      id: '2',
      title: 'Node.js',
      students: 45,
      revenue: 1800,
      status: 'published',
    },
    {
      id: '3',
      title: 'Python pour les nuls',
      students: 15,
      revenue: 370,
      status: 'draft',
    },
  ];

  const recentActivity = [
    { type: 'enrollment', student: 'Marie Dubois', course: 'TypeScript 2025', time: 'Il y a 2h' },
    { type: 'completion', student: 'Jean Martin', course: 'Node.js', time: 'Il y a 5h' },
    { type: 'review', student: 'Sophie Chen', course: 'TypeScript 2025', time: 'Il y a 1j' },
  ];

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
        <Card className="border-l-4 border-l-blue-500 bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Cours Actifs
            </CardTitle>
            <BookOpen className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{stats.totalCourses}</div>
            <p className="text-xs text-gray-500 mt-1">
              Cours publiés
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Étudiants
            </CardTitle>
            <Users className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{stats.totalStudents}</div>
            <p className="text-xs text-gray-500 mt-1">
              Total inscrits
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500 bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Revenus
            </CardTitle>
            <DollarSign className="h-5 w-5 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">${stats.totalRevenue}</div>
            <p className="text-xs text-gray-500 mt-1">
              Ce mois-ci
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Vues
            </CardTitle>
            <Eye className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{stats.totalViews}</div>
            <p className="text-xs text-gray-500 mt-1">
              Cette semaine
            </p>
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
            <div className="space-y-4">
              {recentCourses.map((course) => (
                <div key={course.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900">{course.title}</h4>
                      {course.status === 'draft' && (
                        <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded">
                          Brouillon
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {course.students} étudiants
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        ${course.revenue}
                      </span>
                    </div>
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/instructor/courses/${course.id}`}>
                      Gérer
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Activité récente */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Activité Récente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    activity.type === 'enrollment' ? 'bg-green-100' :
                    activity.type === 'completion' ? 'bg-blue-100' :
                    'bg-yellow-100'
                  }`}>
                    {activity.type === 'enrollment' && <Users className="w-5 h-5 text-green-600" />}
                    {activity.type === 'completion' && <BookOpen className="w-5 h-5 text-blue-600" />}
                    {activity.type === 'review' && <TrendingUp className="w-5 h-5 text-yellow-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.type === 'enrollment' && `${activity.student} s'est inscrit`}
                      {activity.type === 'completion' && `${activity.student} a terminé`}
                      {activity.type === 'review' && `${activity.student} a laissé un avis`}
                    </p>
                    <p className="text-xs text-gray-600">{activity.course}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Chart */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Performance des 7 derniers jours
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day, index) => {
              const value = [65, 75, 80, 70, 85, 60, 90][index];
              return (
                <div key={day} className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-600 w-12">{day}</span>
                  <div className="flex-1">
                    <Progress value={value} className="h-2" />
                  </div>
                  <span className="text-sm text-gray-600">{value}%</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
