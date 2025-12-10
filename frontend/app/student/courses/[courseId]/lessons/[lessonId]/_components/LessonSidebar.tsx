'use client';

import { cn } from '@/lib/utils';
import { CheckCircle2, ChevronDown, ChevronRight, Circle } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface LessonSidebarProps {
  course: any;
  currentLessonId: string;
}

export function LessonSidebar({ course, currentLessonId }: LessonSidebarProps) {
  // État pour gérer les chapitres ouverts/fermés
  const [expandedChapters, setExpandedChapters] = useState<string[]>(
    // Ouvrir tous les chapitres par défaut
    course.chapters?.map((ch: any) => ch.id) || []
  );

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters(prev =>
      prev.includes(chapterId)
        ? prev.filter(id => id !== chapterId)
        : [...prev, chapterId]
    );
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header - Style Coursera */}
      <div className="px-6 py-5 border-b border-gray-200">
        <h2 className="font-bold text-lg text-gray-900 line-clamp-2">
          {course.title}
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          {course.chapters?.reduce((acc: number, ch: any) => acc + (ch.lessons?.length || 0), 0)} learning items
        </p>
      </div>

      {/* Liste des chapitres et leçons */}
      <div className="flex-1">
        {course.chapters?.map((chapter: any, chapterIndex: number) => {
          const isExpanded = expandedChapters.includes(chapter.id);

          return (
            <div key={chapter.id} className="border-b border-gray-100 last:border-b-0">
              {/* Titre du chapitre - Cliquable pour toggle */}
              <button
                onClick={() => toggleChapter(chapter.id)}
                className="w-full px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center gap-3 text-left"
              >
                <div className="flex-shrink-0">
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-600" />
                  )}
                </div>
                <h3 className="font-semibold text-sm text-gray-900 flex-1">
                  {chapter.title}
                </h3>
                <span className="text-xs text-gray-500">
                  {chapter.lessons?.length || 0}
                </span>
              </button>

              {/* Liste des leçons - Affichée seulement si expanded */}
              {isExpanded && (
                <div>
                  {chapter.lessons?.map((lesson: any) => {
                    const isActive = lesson.id === currentLessonId;
                    const isCompleted = lesson.completed || false; // ✅ Utilise la valeur de la query

                    return (
                      <Link
                        key={lesson.id}
                        href={`/student/courses/${course.id}/lessons/${lesson.id}`}
                        className={cn(
                          "flex items-start gap-3 px-6 py-4 hover:bg-gray-50 transition-colors border-l-4",
                          isActive
                            ? "bg-blue-50 border-blue-600"
                            : "border-transparent"
                        )}
                      >
                        {/* Icône de complétion */}
                        <div className="flex-shrink-0 mt-0.5">
                          {isCompleted ? (
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                          ) : (
                            <Circle className="w-5 h-5 text-gray-300" />
                          )}
                        </div>

                        {/* Contenu */}
                        <div className="flex-1 min-w-0">
                          <div className={cn(
                            "text-sm font-medium line-clamp-2",
                            isActive ? "text-blue-700" : "text-gray-900"
                          )}>
                            {lesson.title}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-500">
                              {lesson.videoUrl ? 'Video' : lesson.content ? 'Reading' : 'Lesson'}
                            </span>
                            {lesson.duration && (
                              <>
                                <span className="text-xs text-gray-400">•</span>
                                <span className="text-xs text-gray-500">
                                  {Math.floor(lesson.duration / 60)} min
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
