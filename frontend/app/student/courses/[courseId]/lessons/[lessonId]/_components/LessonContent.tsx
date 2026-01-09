'use client';

import { MessagesTab } from '@/app/student/messages/_components/MessagesTab';
import { RenderDescription } from '@/components/rich-text-editor/RenderDescription';
import { Button } from '@/components/ui/button';
import { VideoPlayer } from '@/components/video/VideoPlayer';
import { useLessonAttachmentsQuery, useToggleLessonCompletionMutation } from '@/lib/generated/graphql';
import { CheckCircle2, Download, FileIcon, FileText, Loader2, MessageCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface LessonContentProps {
  courseId: string;
  lessonId: string;
  course: any;
  onProgressUpdate?: () => void;
}

export function LessonContent({ courseId, lessonId, course, onProgressUpdate }: LessonContentProps) {
  const [toggleCompletion, { loading: toggleLoading }] = useToggleLessonCompletionMutation();
  const [isCompleted, setIsCompleted] = useState(false);
const [activeTab, setActiveTab] = useState<'notes' | 'downloads' | 'messages'>('notes');

  // Query pour récupérer les pièces jointes
  const { data: attachmentsData, loading: attachmentsLoading } = useLessonAttachmentsQuery({
    variables: { lessonId },
  });

  const attachments = attachmentsData?.lessonAttachments || [];

  const currentLesson = course.chapters
    ?.flatMap((chapter: any) => chapter.lessons)
    .find((lesson: any) => lesson.id === lessonId);

      // 🆕 LOG TEMPORAIRE - AVANT LE RETURN
  useEffect(() => {
    console.log('COURSE DATA FOR MESSAGES:');
    console.log('courseId:', courseId);
    console.log('course.userId:', course?.userId);
    console.log('course.createdBy?.id:', course?.createdBy?.id);
  }, [course, courseId]);

  // Sync avec les props du cours (si la progression est déjà chargée)
  useEffect(() => {
    console.log('📚 Course data:', course);
    console.log('👨‍🏫 Instructor ID (userId):', course?.userId);
    if (currentLesson?.completed !== undefined) {
      setIsCompleted(currentLesson.completed);
    }
  }, [currentLesson, course]);

  const handleToggleCompletion = async () => {
    try {
      const result = await toggleCompletion({
        variables: { lessonId },
      });

      const newCompletedState = result.data?.toggleLessonCompletion?.completed ?? false;
      setIsCompleted(newCompletedState);

      toast.success(
        newCompletedState
          ? "Leçon marquée comme complétée ! 🎉"
          : "Leçon marquée comme non complétée"
      );

      // Notifier le parent pour rafraîchir la sidebar
      if (onProgressUpdate) {
        onProgressUpdate();
      }
    } catch (error) {
      console.error("Error toggling completion:", error);
      toast.error("Erreur lors de la mise à jour");
    }
  };

  if (!currentLesson) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-xl font-medium text-gray-900">Leçon introuvable</p>
          <p className="text-gray-600 mt-2">Cette leçon n'existe pas ou a été supprimée.</p>
        </div>
      </div>
    );
  }

  // Déterminer le type de contenu (JSON Tiptap ou HTML)
  let contentType: 'json' | 'html' | 'none' = 'none';
  let parsedContent = null;

  if (currentLesson.content) {
    if (currentLesson.content.startsWith('{') || currentLesson.content.startsWith('[')) {
      try {
        parsedContent = JSON.parse(currentLesson.content);
        contentType = 'json';
      } catch (error) {
        contentType = 'html';
      }
    } else {
      contentType = 'html';
    }
  }

  return (
    <div className="bg-white">
      {/* Container principal */}
      <div className="max-w-4xl mx-auto">

      {/* Zone vidéo */}
      <div className="w-full bg-gray-100">
        <VideoPlayer
          lessonId={currentLesson.id}  // ✅ currentLesson au lieu de lesson
          videoUrl={currentLesson.videoUrl}
          externalVideoUrl={currentLesson.externalVideoUrl}
          title={currentLesson.title}
          onComplete={() => {
            console.log('🎉 Leçon terminée !');
          }}
        />
      </div>

        {/* Contenu sous la vidéo */}
        <div className="px-8 py-8 space-y-8">

          {/* Titre de la leçon */}
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              {currentLesson.title}
            </h1>
            {currentLesson.description && (
              <p className="text-lg text-gray-700">{currentLesson.description}</p>
            )}
          </div>

          {/* Bouton de complétion */}
          <div className="flex justify-end border-b border-gray-200 pb-6">
            <Button
              size="lg"
              className={`gap-2 transition-all ${
                isCompleted
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
              onClick={handleToggleCompletion}
              disabled={toggleLoading}
            >
              {toggleLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Mise à jour...
                </>
              ) : isCompleted ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  Leçon complétée ✓
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  Marquer comme complété
                </>
              )}
            </Button>
          </div>

          {/* Contenu de la leçon - Onglets custom modernes */}
          <div className="w-full">
            {/* Custom Tab Buttons */}
            <div className="w-full bg-white border border-gray-200 p-1 flex gap-1 rounded-lg mb-6">
              <button
                onClick={() => setActiveTab('notes')}
                className={`flex items-center gap-2 px-6 py-3 rounded-md transition-all font-medium ${
                  activeTab === 'notes'
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Notes</span>
              </button>

              <button
                onClick={() => setActiveTab('downloads')}
                className={`flex items-center gap-2 px-6 py-3 rounded-md transition-all font-medium ${
                  activeTab === 'downloads'
                    ? 'bg-purple-500 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Download className="w-4 h-4" />
                <span>Téléchargements</span>
                {attachments.length > 0 && (
                  <span
                    className={`ml-1 px-2 py-0.5 text-xs rounded-full font-semibold ${
                      activeTab === 'downloads'
                        ? 'bg-white text-purple-600'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {attachments.length}
                  </span>
                )}
              </button>
              {/* BOUTON MESSAGES 🆕 */}
              <button
                onClick={() => setActiveTab('messages')}
                className={`flex items-center gap-2 px-6 py-3 rounded-md transition-all font-medium ${
                  activeTab === 'messages'
                    ? 'bg-green-500 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <MessageCircle className="w-4 h-4" />
                <span>Messages</span>
              </button>
            </div>

            {/* ONGLET NOTES */}
            {activeTab === 'notes' && (
              <div>
              {contentType === 'json' && parsedContent && (
                <div className="prose prose-lg max-w-none">
                  <RenderDescription json={parsedContent} />
                </div>
              )}

              {contentType === 'html' && (
                <div
                  className="lesson-content"
                  dangerouslySetInnerHTML={{ __html: currentLesson.content }}
                />
              )}

              {contentType === 'none' && (
                <div className="py-12 text-center">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500">Aucune note disponible pour cette leçon.</p>
                </div>
              )}
            </div>
            )}

            {/* ONGLET TÉLÉCHARGEMENTS */}
            {activeTab === 'downloads' && (
              <div>
              {attachmentsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                </div>
              ) : attachments.length > 0 ? (
                <div className="space-y-3">
                  {attachments.map((attachment: any) => (
                    <div
                      key={attachment.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-sm transition-all bg-white"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                            <FileIcon className="w-6 h-6 text-blue-600" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 truncate">
                              {attachment.fileName}
                            </p>
                            <p className="text-sm text-gray-500">
                              {(attachment.fileSize / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <Button
                          className="gap-2 bg-blue-600 hover:bg-blue-700 text-white flex-shrink-0"
                          size="sm"
                          onClick={() => window.open(attachment.fileUrl, '_blank')}
                        >
                          <Download className="w-4 h-4" />
                          Télécharger
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <Download className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500">Aucun fichier à télécharger pour cette leçon.</p>
                </div>
              )}
            </div>
            )}

            {/* ONGLET MESSAGES 🆕 */}
            {activeTab === 'messages' && (
              <MessagesTab
                courseId={courseId}
                instructorId={course.userId}
                conversationId={undefined} // Sera rempli automatiquement
              />
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
