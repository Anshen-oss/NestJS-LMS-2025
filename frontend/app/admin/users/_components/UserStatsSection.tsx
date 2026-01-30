'use client';

import { BookOpen, Shield, Users, Users2 } from 'lucide-react';
import { StatCard } from './StatCard';

interface User {
  id: string;
  name?: string;
  email?: string;
  role: 'ADMIN' | 'INSTRUCTOR' | 'STUDENT';
  banned?: boolean;
  _count?: {
    enrollments: number;
    coursesCreated: number;
  };
}

interface UserStatsSectionProps {
  users: User[];
  totalUsers?: number;
  totalInstructors?: number;
  totalStudents?: number;
  totalAdmins?: number;
}

export function UserStatsSection({
  users,
  totalUsers,
  totalInstructors,
  totalStudents,
  totalAdmins,
}: UserStatsSectionProps) {
  const calculatedStats = {
    total: users.length,
    active: users.filter((u) => !u.banned).length,
    admins: users.filter((u) => u.role === 'ADMIN').length,
    instructors: users.filter((u) => u.role === 'INSTRUCTOR').length,
    students: users.filter((u) => u.role === 'STUDENT').length,
  };

  const stats = {
    total: totalUsers ?? calculatedStats.total,
    active: calculatedStats.active,
    admins: totalAdmins ?? calculatedStats.admins,
    instructors: totalInstructors ?? calculatedStats.instructors,
    students: totalStudents ?? calculatedStats.students,
  };

  const statCards = [
    {
      label: 'Total Utilisateurs',
      value: stats.total,
      icon: Users,
      borderColor: 'border-l-blue-500',
      bgColor: 'bg-blue-50',
      trend: { value: 12, direction: 'up' as const },
    },
    {
      label: 'Utilisateurs Actifs',
      value: stats.active,
      icon: Users2,
      borderColor: 'border-l-green-500',
      bgColor: 'bg-green-50',
      trend: { value: 8, direction: 'up' as const },
    },
    {
      label: 'Administrateurs',
      value: stats.admins,
      icon: Shield,
      borderColor: 'border-l-orange-500',
      bgColor: 'bg-orange-50',
    },
    {
      label: 'Instructeurs',
      value: stats.instructors,
      icon: BookOpen,
      borderColor: 'border-l-purple-500',
      bgColor: 'bg-purple-50',
    },
    {
      label: 'Étudiants',
      value: stats.students,
      icon: Users,
      borderColor: 'border-l-amber-500',
      bgColor: 'bg-amber-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      {statCards.map((stat) => (
        <StatCard
          key={stat.label}
          label={stat.label}
          value={stat.value}
          icon={stat.icon}
          borderColor={stat.borderColor}
          bgColor={stat.bgColor}
          trend={stat.trend}
        />
      ))}
    </div>
  );
}
