'use client';

import { ArrowDown, ArrowUp, ArrowUpDown, Minus, TrendingDown, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface CoursePerformance {
  courseId: string;
  courseName: string;
  thumbnailUrl?: string;
  totalEnrollments: number;
  activeStudents: number;
  completionRate: number;
  totalRevenue: number;
  averageProgress: number;
  enrollmentTrend: {
    value: number;
    direction: 'UP' | 'DOWN' | 'STABLE';
    isSignificant: boolean;
  };
}

interface CoursePerformanceTableProps {
  data: CoursePerformance[];
  loading?: boolean;
}

type SortField = 'courseName' | 'totalEnrollments' | 'activeStudents' | 'completionRate' | 'totalRevenue' | 'averageProgress';
type SortDirection = 'asc' | 'desc';

export function CoursePerformanceTable({ data, loading }: CoursePerformanceTableProps) {
  const [sortField, setSortField] = useState<SortField>('totalRevenue');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New field, default to desc
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return sortDirection === 'asc'
      ? (aValue as number) - (bValue as number)
      : (bValue as number) - (aValue as number);
  });

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4 text-gray-400" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="h-4 w-4 text-blue-600" />
    ) : (
      <ArrowDown className="h-4 w-4 text-blue-600" />
    );
  };

  const TrendBadge = ({ trend }: { trend: CoursePerformance['enrollmentTrend'] }) => {
    if (trend.direction === 'UP') {
      return (
        <span className="inline-flex items-center gap-1 text-green-600 text-sm font-medium">
          <TrendingUp className="h-4 w-4" />
          {trend.value.toFixed(1)}%
        </span>
      );
    }
    if (trend.direction === 'DOWN') {
      return (
        <span className="inline-flex items-center gap-1 text-red-600 text-sm font-medium">
          <TrendingDown className="h-4 w-4" />
          {trend.value.toFixed(1)}%
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-gray-600 text-sm font-medium">
        <Minus className="h-4 w-4" />
        {trend.value.toFixed(1)}%
      </span>
    );
  };

  const ProgressBar = ({ value, max = 100 }: { value: number; max?: number }) => {
    const percentage = Math.min((value / max) * 100, 100);

    return (
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    );
  };

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center bg-gray-50 rounded border-2 border-dashed border-gray-300">
        <div className="text-center">
          <p className="text-gray-500 mb-2">📚 Aucun cours trouvé</p>
          <p className="text-sm text-gray-400">
            Créez votre premier cours pour voir les statistiques
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">
              Cours
            </th>
            <th
              className="text-right py-3 px-4 font-semibold text-sm text-gray-700 cursor-pointer hover:bg-gray-50"
              onClick={() => handleSort('totalEnrollments')}
            >
              <div className="flex items-center justify-end gap-2">
                Inscriptions
                <SortIcon field="totalEnrollments" />
              </div>
            </th>
            <th
              className="text-right py-3 px-4 font-semibold text-sm text-gray-700 cursor-pointer hover:bg-gray-50"
              onClick={() => handleSort('activeStudents')}
            >
              <div className="flex items-center justify-end gap-2">
                Actifs
                <SortIcon field="activeStudents" />
              </div>
            </th>
            <th
              className="text-right py-3 px-4 font-semibold text-sm text-gray-700 cursor-pointer hover:bg-gray-50"
              onClick={() => handleSort('completionRate')}
            >
              <div className="flex items-center justify-end gap-2">
                Complétion
                <SortIcon field="completionRate" />
              </div>
            </th>
            <th
              className="text-right py-3 px-4 font-semibold text-sm text-gray-700 cursor-pointer hover:bg-gray-50"
              onClick={() => handleSort('totalRevenue')}
            >
              <div className="flex items-center justify-end gap-2">
                Revenus
                <SortIcon field="totalRevenue" />
              </div>
            </th>
            <th
              className="text-right py-3 px-4 font-semibold text-sm text-gray-700 cursor-pointer hover:bg-gray-50"
              onClick={() => handleSort('averageProgress')}
            >
              <div className="flex items-center justify-end gap-2">
                Progress
                <SortIcon field="averageProgress" />
              </div>
            </th>
            <th className="text-right py-3 px-4 font-semibold text-sm text-gray-700">
              Tendance
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((course) => (
            <tr
              key={course.courseId}
              className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              {/* Course Name with Thumbnail */}
              <td className="py-4 px-4">
                <div className="flex items-center gap-3">
                  {course.thumbnailUrl ? (
                    <div className="relative w-16 h-10 rounded overflow-hidden flex-shrink-0">
                      <Image
                        src={course.thumbnailUrl}
                        alt={course.courseName}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-10 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                      <span className="text-xs text-gray-500">📚</span>
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="font-medium text-gray-900 truncate">
                      {course.courseName}
                    </div>
                  </div>
                </div>
              </td>

              {/* Total Enrollments */}
              <td className="py-4 px-4 text-right">
                <span className="font-semibold text-gray-900">
                  {course.totalEnrollments}
                </span>
              </td>

              {/* Active Students */}
              <td className="py-4 px-4 text-right">
                <span className="text-gray-700">{course.activeStudents}</span>
              </td>

              {/* Completion Rate */}
              <td className="py-4 px-4 text-right">
                <div className="flex flex-col items-end gap-1">
                  <span className="text-sm font-medium text-gray-900">
                    {course.completionRate.toFixed(1)}%
                  </span>
                  <div className="w-20">
                    <ProgressBar value={course.completionRate} />
                  </div>
                </div>
              </td>

              {/* Total Revenue */}
              <td className="py-4 px-4 text-right">
                <span className="font-bold text-gray-900">
                  {course.totalRevenue.toFixed(2)} €
                </span>
              </td>

              {/* Average Progress */}
              <td className="py-4 px-4 text-right">
                <div className="flex flex-col items-end gap-1">
                  <span className="text-sm text-gray-700">
                    {course.averageProgress.toFixed(1)}%
                  </span>
                  <div className="w-16">
                    <ProgressBar value={course.averageProgress} />
                  </div>
                </div>
              </td>

              {/* Enrollment Trend */}
              <td className="py-4 px-4 text-right">
                <TrendBadge trend={course.enrollmentTrend} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
