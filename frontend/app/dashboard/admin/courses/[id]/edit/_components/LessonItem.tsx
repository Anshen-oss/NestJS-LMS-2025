"use client";

import { LessonEditor } from "@/components/admin/lessons/LessonEditor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useDeleteLessonMutation,
} from "@/lib/generated/graphql";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Clock,
  FileEdit,
  GripVertical,
  Loader2,
  MoreVertical,
  Pencil,
  PlayCircle,
  Trash2,
  Unlock,
  Video, // 🆕 Import Video icon
} from "lucide-react";
import { useRouter } from "next/navigation"; // 🆕 Import useRouter
import { useState } from "react";
import { toast } from "sonner";
import { EditLessonForm } from "./EditLessonForm";

interface Lesson {
  id: string;
  title: string;
  description?: string | null;
  content?: string | null;
  isPublished?: boolean;
  videoUrl?: string | null;
  duration?: number | null;
  position: number;
  isFree: boolean;
}

interface LessonItemProps {
  lesson: Lesson;
  index: number;
  courseId: string; // 🆕 Ajout courseId
  chapterId: string; // 🆕 Ajout chapterId
  onUpdate: () => void;
}

export function LessonItem({
  lesson,
  index,
  courseId, // 🆕
  chapterId, // 🆕
  onUpdate
}: LessonItemProps) {
  const router = useRouter(); // 🆕
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingContent, setIsEditingContent] = useState(false);
  const [deleteLesson, { loading: deleting }] = useDeleteLessonMutation();

  // Sortable hook
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lesson.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleDelete = async () => {
    if (!confirm(`Delete lesson "${lesson.title}"?`)) {
      return;
    }

    try {
      await deleteLesson({
        variables: { id: lesson.id },
      });

      toast.success("Lesson deleted");
      onUpdate();
    } catch (error: any) {
      console.error("Delete error:", error);
      toast.error(error.message || "Failed to delete lesson");
    }
  };

  // 🆕 Handler pour naviguer vers la page d'édition complète
  const handleEditVideo = () => {
    // ✅ Route correcte : /admin/courses/[id]/lessons/[lessonId]
    const url = `/admin/courses/${courseId}/lessons/${lesson.id}?courseId=${courseId}&chapterId=${chapterId}`;

    console.log('🚀 Navigation to edit video:', {
      courseId,
      chapterId,
      lessonId: lesson.id,
      fullUrl: url
    });

    router.push(url);
  };

  const formatDuration = (seconds: number | null | undefined) => {
    if (!seconds) return "No duration";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Mode édition
  if (isEditing) {
    return (
      <EditLessonForm
        lesson={lesson}
        onSuccess={() => {
          setIsEditing(false);
          onUpdate();
        }}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  // Mode affichage normal
  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className="group flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
      >
        {/* Drag Handle */}
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <GripVertical className="w-4 h-4" />
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium">
               {index + 1}. {lesson.title}
            </span>
            {lesson.isFree && (
              <Badge variant="secondary" className="text-xs">
                <Unlock className="w-3 h-3 mr-1" />
                Free
              </Badge>
            )}
          </div>

          {lesson.description && (
            <p className="text-sm text-muted-foreground line-clamp-1">
              {lesson.description}
            </p>
          )}

          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
            {lesson.videoUrl && (
              <span className="flex items-center gap-1">
                <PlayCircle className="w-3 h-3" />
                Video
              </span>
            )}
            {lesson.duration && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatDuration(lesson.duration)}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              disabled={deleting}
            >
              {deleting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <MoreVertical className="w-4 h-4" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setIsEditing(true)}>
              <Pencil className="w-4 h-4 mr-2" />
              Edit Info
            </DropdownMenuItem>
            {/* 🆕 Nouvelle option pour éditer la vidéo */}
            <DropdownMenuItem onClick={handleEditVideo}>
              <Video className="w-4 h-4 mr-2" />
              Edit Video
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setIsEditingContent(true)}>
              <FileEdit className="w-4 h-4 mr-2" />
              Edit Content
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleDelete}
              className="text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Dialog pour éditer le contenu */}
      <Dialog open={isEditingContent} onOpenChange={setIsEditingContent}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Edit Content: {lesson.title}</DialogTitle>
            <DialogDescription>
              Edit the lesson content using the rich text editor below.
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto pr-2">
            {lesson.id && (
              <LessonEditor
                lessonId={lesson.id}
                initialContent={lesson.content || ""}
                isPublished={lesson.isPublished ?? false}
                onSave={onUpdate}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
