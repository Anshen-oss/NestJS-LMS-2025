'use client';

import { Badge } from '@/components/ui/badge';
import { GraduationCap, Shield, UserCheck } from 'lucide-react';
import React from 'react';

type UserRole = 'ADMIN' | 'INSTRUCTOR' | 'STUDENT';

interface RoleBadgeProps {
  role: UserRole;
  size?: 'sm' | 'md' | 'lg';
}

export function RoleBadge({ role, size = 'md' }: RoleBadgeProps) {
  const config: Record<
    UserRole,
    {
      label: string;
      icon: React.ElementType;
      className: string;
    }
  > = {
    STUDENT: {
      label: 'Étudiant',
      icon: GraduationCap,
      className: 'bg-blue-50 text-blue-700 border-blue-300 hover:bg-blue-100',
    },
    INSTRUCTOR: {
      label: 'Instructeur',
      icon: UserCheck,
      className: 'bg-purple-50 text-purple-700 border-purple-300 hover:bg-purple-100',
    },
    ADMIN: {
      label: 'Admin',
      icon: Shield,
      className: 'bg-orange-50 text-orange-700 border-orange-300 hover:bg-orange-100',
    },
  };

  const { label, icon: Icon, className } = config[role];

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-sm px-3 py-1 gap-1.5',
    lg: 'text-base px-4 py-2 gap-2',
  };

  return (
    <Badge
      variant="outline"
      className={`inline-flex items-center ${className} ${sizeClasses[size]}`}
    >
      <Icon className={size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5'} />
      {label}
    </Badge>
  );
}
