'use client';

import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useStudentDetail } from '@/hooks/use-instructor-students';
import { Clock, Mail, Trophy, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface StudentDetailProps {
  studentId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function StudentDetail({
  studentId,
  open,
  onOpenChange,
}: StudentDetailProps) {
  const { student, loading } = useStudentDetail(studentId || '');
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  // Réinitialiser le cours sélectionné quand on change d'étudiant
  useEffect(() => {
    if (student && student.courses.length > 0) {
      setSelectedCourse(student.courses[0].courseId);
    }
  }, [student?.id]);

  if (!studentId) return null;

  const currentCourse = student?.courses.find(c => c.courseId === selectedCourse);

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh]">
        {loading ? (
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement du profil...</p>
          </div>
        ) : student ? (
          <>
            {/* Header */}
            <DrawerHeader className="border-b pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4 flex-1">
                  {student.image ? (
                    <img
                      src={student.image}
                      alt={student.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-2xl font-semibold">
                      {student.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <DrawerTitle className="text-2xl">{student.name}</DrawerTitle>
                    <div className="flex items-center gap-2 text-gray-600 mt-1">
                      <Mail className="w-4 h-4" />
                      <a href={`mailto:${student.email}`} className="hover:text-blue-600">
                        {student.email}
                      </a>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Inscrit le{' '}
                      {new Date(student.enrolledAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                <DrawerClose asChild>
                  <Button variant="ghost" size="icon">
                    <X className="h-4 w-4" />
                  </Button>
                </DrawerClose>
              </div>
            </DrawerHeader>

            {/* Contenu */}
            <div className="flex-1 overflow-auto">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="w-full rounded-none border-b">
                  <TabsTrigger value="overview" className="flex-1">
                    Aperçu
                  </TabsTrigger>
                  <TabsTrigger value="courses" className="flex-1">
                    Cours
                  </TabsTrigger>
                  <TabsTrigger value="achievements" className="flex-1">
                    Réalisations
                  </TabsTrigger>
                </TabsList>

                {/* Tab: Overview */}
                <TabsContent value="overview" className="p-6 space-y-6">
                  {/* Stats principales */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Cours suivis</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {student.totalCoursesEnrolled}
                      </p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Terminés</p>
                      <p className="text-2xl font-bold text-green-600">
                        {student.totalCoursesCompleted}
                      </p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Complétion</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {student.overallCompletionRate.toFixed(0)}%
                      </p>
                    </div>
                  </div>

                  {/* Temps passé */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Temps passé</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-600">Total</span>
                          <span className="text-sm font-semibold">
                            {Math.round(student.totalTimeSpent / 60)}h{' '}
                            {student.totalTimeSpent % 60}min
                          </span>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-600">Moyenne par lesson</span>
                          <span className="text-sm font-semibold">
                            {Math.round(student.averageTimePerLesson)}min
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Dernière activité */}
                  {student.lastActivityAt && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>
                          Dernière activité:{' '}
                          {new Date(student.lastActivityAt).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </div>
                  )}
                </TabsContent>

                {/* Tab: Courses */}
                <TabsContent value="courses" className="p-6 space-y-4">
                  {/* Sélection du cours */}
                  <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                    {student.courses.map((course) => (
                      <button
                        key={course.courseId}
                        onClick={() => setSelectedCourse(course.courseId)}
                        className={`p-3 rounded-lg text-left transition-colors ${
                          selectedCourse === course.courseId
                            ? 'bg-blue-100 border border-blue-300'
                            : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        <p className="font-medium text-gray-900">{course.courseTitle}</p>
                        <p className="text-xs text-gray-600 mt-1">
                          {course.enrollment.lessonsCompleted} /{' '}
                          {course.enrollment.totalLessons} lessons
                        </p>
                      </button>
                    ))}
                  </div>

                  {/* Détails du cours sélectionné */}
                  {currentCourse && (
                    <div className="border-t pt-4 space-y-4">
                      <h3 className="font-semibold text-gray-900">
                        {currentCourse.courseTitle}
                      </h3>

                      {/* Image du cours */}
                      {currentCourse.courseImage && (
                        <img
                          src={currentCourse.courseImage}
                          alt={currentCourse.courseTitle}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      )}

                      {/* Progression */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-900">
                            Progression
                          </span>
                          <span className="text-sm font-bold text-blue-600">
                            {currentCourse.enrollment.completionRate.toFixed(0)}%
                          </span>
                        </div>
                        <Progress
                          value={currentCourse.enrollment.completionRate}
                          className="h-2"
                        />
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-blue-50 p-3 rounded">
                          <p className="text-xs text-gray-600 mb-1">Lessons</p>
                          <p className="text-lg font-bold text-blue-600">
                            {currentCourse.enrollment.lessonsCompleted} /{' '}
                            {currentCourse.enrollment.totalLessons}
                          </p>
                        </div>
                        <div className="bg-green-50 p-3 rounded">
                          <p className="text-xs text-gray-600 mb-1">Statut</p>
                          <p className="text-sm font-bold text-green-600">
                            {currentCourse.enrollment.status}
                          </p>
                        </div>
                      </div>

                      {/* Dates */}
                      <div className="space-y-2 text-sm text-gray-600">
                        <div>
                          <span className="text-gray-900 font-medium">Inscrit:</span>{' '}
                          {new Date(currentCourse.enrollment.enrolledAt).toLocaleDateString(
                            'fr-FR'
                          )}
                        </div>
                        {currentCourse.enrollment.lastActivityAt && (
                          <div>
                            <span className="text-gray-900 font-medium">
                              Dernière activité:
                            </span>{' '}
                            {new Date(
                              currentCourse.enrollment.lastActivityAt
                            ).toLocaleDateString('fr-FR')}
                          </div>
                        )}
                      </div>

                      {/* Prix */}
                      {currentCourse.price > 0 && (
                        <div className="bg-gray-50 p-3 rounded">
                          <span className="text-sm text-gray-600">Prix du cours</span>
                          <p className="text-xl font-bold text-gray-900">
                            €{currentCourse.price.toFixed(2)}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </TabsContent>

                {/* Tab: Achievements */}
                <TabsContent value="achievements" className="p-6">
                  {student.achievements && student.achievements.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {student.achievements.map((achievement) => (
                        <div
                          key={achievement.id}
                          className="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200 text-center"
                        >
                          <div className="text-4xl mb-2">
                            {achievement.icon || '🏆'}
                          </div>
                          <h4 className="font-semibold text-gray-900 mb-1">
                            {achievement.title}
                          </h4>
                          <p className="text-xs text-gray-600 mb-2">
                            {achievement.description}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(achievement.unlockedAt).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Trophy className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">Aucune réalisation encore</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </>
        ) : (
          <div className="p-6 text-center text-gray-500">
            Étudiant non trouvé
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
}
