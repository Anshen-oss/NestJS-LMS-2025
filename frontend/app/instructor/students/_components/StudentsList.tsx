'use client';

import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { StudentListItem } from '@/hooks/use-instructor-students';
import { ChevronRight } from 'lucide-react';
import StudentCard from './StudentCard';

interface StudentsListProps {
  students: StudentListItem[];
  loading: boolean;
  onSelectStudent: (studentId: string) => void;
}

export default function StudentsList({
  students,
  loading,
  onSelectStudent,
}: StudentsListProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-16" />
        ))}
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="bg-white rounded-lg border p-12 text-center">
        <p className="text-gray-500 text-lg">Aucun étudiant trouvé</p>
      </div>
    );
  }

  return (
    <>
      {/* Version Desktop: Tableau */}
      <div className="hidden md:block bg-white rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-12">
                <div className="w-8 h-8" />
              </TableHead>
              <TableHead>Étudiant</TableHead>
              <TableHead className="text-center">Cours</TableHead>
              <TableHead className="text-center">Complétion</TableHead>
              <TableHead className="text-center">Activité</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <TableRow
                key={student.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => onSelectStudent(student.id)}
              >
                {/* Avatar */}
                <TableCell>
                  {student.image ? (
                    <img
                      src={student.image}
                      alt={student.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-semibold">
                      {student.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </TableCell>

                {/* Nom et email */}
                <TableCell>
                  <div>
                    <p className="font-medium text-gray-900">{student.name}</p>
                    <p className="text-sm text-gray-500">{student.email}</p>
                  </div>
                </TableCell>

                {/* Nombre de cours */}
                <TableCell className="text-center">
                  <div>
                    <p className="font-semibold text-gray-900">
                      {student.totalCoursesEnrolled}
                    </p>
                    <p className="text-xs text-gray-500">
                      {student.totalCoursesCompleted} terminés
                    </p>
                  </div>
                </TableCell>

                {/* Complétion */}
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${student.overallCompletionRate}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-900 w-10 text-right">
                      {student.overallCompletionRate.toFixed(0)}%
                    </span>
                  </div>
                </TableCell>

                {/* Dernière activité */}
                <TableCell className="text-center">
                  <p className="text-sm text-gray-600">
                    {student.lastActivityAt
                      ? new Date(student.lastActivityAt).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                        })
                      : 'N/A'}
                  </p>
                </TableCell>

                {/* Action */}
                <TableCell className="text-right">
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Version Mobile: Cards */}
      <div className="md:hidden space-y-3">
        {students.map((student) => (
          <StudentCard
            key={student.id}
            student={student}
            onClick={() => onSelectStudent(student.id)}
          />
        ))}
      </div>
    </>
  );
}
