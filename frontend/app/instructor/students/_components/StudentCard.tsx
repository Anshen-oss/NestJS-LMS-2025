'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { StudentListItem } from '@/hooks/use-instructor-students';
import { BookOpen, Clock, Users } from 'lucide-react';

interface StudentCardProps {
  student: StudentListItem;
  onClick: () => void;
}

export default function StudentCard({ student, onClick }: StudentCardProps) {
  return (
    <Card
      onClick={onClick}
      className="cursor-pointer hover:shadow-md transition-shadow"
    >
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          {student.image ? (
            <img
              src={student.image}
              alt={student.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">
              {student.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">
              {student.name}
            </h3>
            <p className="text-xs text-gray-500 truncate">{student.email}</p>
          </div>
        </div>

        {/* Progression */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-600">Complétion</span>
            <span className="text-xs font-bold text-blue-600">
              {student.overallCompletionRate.toFixed(0)}%
            </span>
          </div>
          <Progress
            value={student.overallCompletionRate}
            className="h-2"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="flex justify-center mb-1">
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-xs font-semibold text-gray-900">
              {student.totalCoursesEnrolled}
            </p>
            <p className="text-xs text-gray-500">Cours</p>
          </div>
          <div>
            <div className="flex justify-center mb-1">
              <BookOpen className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-xs font-semibold text-gray-900">
              {student.totalCoursesCompleted}
            </p>
            <p className="text-xs text-gray-500">Terminés</p>
          </div>
          <div>
            <div className="flex justify-center mb-1">
              <Clock className="w-4 h-4 text-orange-600" />
            </div>
            <p className="text-xs font-semibold text-gray-900">
              {student.lastActivityAt
                ? new Date(student.lastActivityAt).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'short',
                  })
                : 'N/A'}
            </p>
            <p className="text-xs text-gray-500">Activité</p>
          </div>
        </div>

        {/* Inscription */}
        <div className="mt-3 pt-3 border-t">
          <p className="text-xs text-gray-500">
            Inscrit le{' '}
            {new Date(student.enrolledAt).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
