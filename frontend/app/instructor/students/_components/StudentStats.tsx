'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useInstructorStudents } from '@/hooks/use-instructor-students';
import { BarChart3, BookOpen, TrendingUp, Users } from 'lucide-react';

export default function StudentStats() {
  const { students, total, loading } = useInstructorStudents(1, 1);

  // Calculer les stats
  const totalStudents = total;
  const completedCourses = students.reduce((acc, s) => acc + s.totalCoursesCompleted, 0);
  const avgCompletion = students.length > 0
    ? Math.round(
        students.reduce((acc, s) => acc + s.overallCompletionRate, 0) / students.length
      )
    : 0;
  const activeStudents = students.filter(s => s.lastActivityAt).length;

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Étudiants',
      value: totalStudents,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-l-blue-500',
    },
    {
      title: 'Étudiants Actifs',
      value: activeStudents,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-l-green-500',
    },
    {
      title: 'Complétion Moyenne',
      value: `${avgCompletion}%`,
      icon: BarChart3,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-l-yellow-500',
    },
    {
      title: 'Cours Terminés',
      value: completedCourses,
      icon: BookOpen,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-l-purple-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => (
        <Card key={stat.title} className={`border-l-4 ${stat.borderColor} ${stat.bgColor}`}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-5 w-5 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${stat.color}`}>
              {stat.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
