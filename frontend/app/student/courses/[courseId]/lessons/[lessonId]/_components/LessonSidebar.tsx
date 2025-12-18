'use client';

import { cn } from '@/lib/utils';
import { CheckCircle2, ChevronDown, ChevronRight, Circle, FileText, PlayCircle } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface LessonSidebarProps {
  course: any;
  currentLessonId: string;
}

export function LessonSidebar({ course, currentLessonId }: LessonSidebarProps) {


  course.chapters?.forEach((chapter: any) => {

    chapter.lessons?.forEach((lesson: any) => {
      //console.log(`  📝 Lesson: ${lesson.title}, completed: ${lesson.completed}`);
    });
  });

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

  const totalLessons = course.chapters?.reduce(
    (acc: number, ch: any) => acc + (ch.lessons?.length || 0),
    0
  );

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header - Modernisé */}
      <div className="px-6 py-6 border-b border-gray-200 bg-blue-50">
        <h2 className="font-bold text-lg text-gray-900 line-clamp-2 leading-snug mb-2">
          {course.title}
        </h2>
        <p className="text-sm text-gray-600 flex items-center gap-2">
          <span className="inline-flex items-center gap-1">
            <PlayCircle className="w-4 h-4" />
            {totalLessons} leçons
          </span>
        </p>
      </div>

      {/* Liste des chapitres et leçons */}
      <div className="flex-1 overflow-y-auto">
        {course.chapters?.map((chapter: any, chapterIndex: number) => {
          const isExpanded = expandedChapters.includes(chapter.id);
          const completedLessons = chapter.lessons?.filter((l: any) => l.completed).length || 0;
          const totalChapterLessons = chapter.lessons?.length || 0;

          return (
            <div key={chapter.id} className="border-b border-gray-100 last:border-b-0">
              {/* Titre du chapitre - Modernisé */}
              <button
                onClick={() => toggleChapter(chapter.id)}
                className="w-full px-6 py-4 bg-white hover:bg-gray-50 transition-all flex items-center gap-3 text-left group"
              >
                <div className="flex-shrink-0">
                  {isExpanded ? (
                    <ChevronDown className="w-5 h-5 text-blue-600 transition-transform" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm text-gray-900 mb-1">
                    {chapter.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{totalChapterLessons} leçons</span>
                    {completedLessons > 0 && (
                      <>
                        <span>•</span>
                        <span className="text-green-600 font-medium">
                          {completedLessons} complétées
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </button>

              {/* Liste des leçons - Affichée seulement si expanded */}
              {isExpanded && (
                <div className="bg-gray-50/50">
                  {chapter.lessons?.map((lesson: any) => {
                    const isActive = lesson.id === currentLessonId;
                    const isCompleted = lesson.completed || false;

                    return (
                      <Link
                        key={lesson.id}
                        href={`/student/courses/${course.id}/lessons/${lesson.id}`}
                        className={cn(
                          "flex items-start gap-3 px-6 py-3.5 hover:bg-white transition-all border-l-4",
                          isActive
                            ? "bg-blue-50 border-blue-600 shadow-sm"
                            : "border-transparent hover:border-gray-300"
                        )}
                      >
                        {/* Icône de complétion - Modernisée */}
                        <div className="flex-shrink-0 mt-1">
                          {isCompleted ? (
                            <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                              <CheckCircle2 className="w-4 h-4 text-green-600" />
                            </div>
                          ) : (
                            <Circle className="w-5 h-5 text-gray-300" strokeWidth={2} />
                          )}
                        </div>

                        {/* Contenu */}
                        <div className="flex-1 min-w-0">
                          <div className={cn(
                            "text-sm font-medium line-clamp-2 mb-1",
                            isActive ? "text-blue-700" : "text-gray-900"
                          )}>
                            {lesson.title}
                          </div>
                          <div className="flex items-center gap-2">
                            {/* Type de contenu */}
                            <div className="flex items-center gap-1">
                              {lesson.videoUrl ? (
                                <PlayCircle className="w-3.5 h-3.5 text-gray-400" />
                              ) : (
                                <FileText className="w-3.5 h-3.5 text-gray-400" />
                              )}
                              <span className="text-xs text-gray-500">
                                {lesson.videoUrl ? 'Vidéo' : 'Lecture'}
                              </span>
                            </div>
                            {lesson.duration && (
                              <>
                                <span className="text-xs text-gray-300">•</span>
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
