"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  useDeleteChapterMutation,
  useUpdateChapterMutation,
} from "@/lib/generated/graphql";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ChevronDown,
  ChevronRight,
  GripVertical,
  Loader2,
  MoreVertical,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { CreateLessonForm } from "./CreateLessonForm";
import { LessonsList } from "./LessonsList";

interface Chapter {
  id: string;
  title: string;
  position: number;
  lessons?: Lesson[];
  lessonsCount?: number;
}

interface Lesson {
  id: string;
  title: string;
  description?: string | null;
  videoUrl?: string | null;
  duration?: number | null;
  position: number;
  isFree: boolean;
}

interface ChapterItemProps {
  chapter: Chapter;
  courseId: string; // ✅ FIX : Ajouter courseId dans les props
  onUpdate: () => void;
}

export function ChapterItem({ chapter, courseId, onUpdate }: ChapterItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(chapter.title);
  const [showCreateLesson, setShowCreateLesson] = useState(false);

  const [updateChapter, { loading: updating }] = useUpdateChapterMutation();
  const [deleteChapter, { loading: deleting }] = useDeleteChapterMutation();

  // Sortable hook
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: chapter.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleSave = async () => {
    if (!editedTitle.trim()) {
      toast.error("Chapter title cannot be empty");
      return;
    }

    try {
      await updateChapter({
        variables: {
          input: {
            id: chapter.id,
            title: editedTitle.trim(),
          },
        },
      });

      toast.success("Chapter updated");
      setIsEditing(false);
      onUpdate();
    } catch (error: any) {
      console.error("Update error:", error);
      toast.error(error.message || "Failed to update chapter");
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete chapter "${chapter.title}"? This will also delete all lessons.`)) {
      return;
    }

    try {
      await deleteChapter({
        variables: { id: chapter.id },
      });

      toast.success("Chapter deleted");
      onUpdate();
    } catch (error: any) {
      console.error("Delete error:", error);
      toast.error(error.message || "Failed to delete chapter");
    }
  };

  const lessonsCount = chapter.lessons?.length || 0;

  return (
    <Card ref={setNodeRef} style={style}>
      <CardHeader className="p-4">
        <div className="flex items-center gap-3">
          {/* Drag Handle */}
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
          >
            <GripVertical className="w-5 h-5" />
          </button>

          {/* Expand/Collapse */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-muted-foreground hover:text-foreground"
          >
            {isExpanded ? (
              <ChevronDown className="w-5 h-5" />
            ) : (
              <ChevronRight className="w-5 h-5" />
            )}
          </button>

          {/* Title */}
          <div className="flex-1">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <Input
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSave();
                    if (e.key === "Escape") {
                      setIsEditing(false);
                      setEditedTitle(chapter.title);
                    }
                  }}
                  autoFocus
                  disabled={updating}
                />
                <Button size="sm" onClick={handleSave} disabled={updating}>
                  {updating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setEditedTitle(chapter.title);
                  }}
                  disabled={updating}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <h3 className="font-semibold">
                  Chapter {chapter.position + 1}: {chapter.title}
                </h3>
                <span className="text-sm text-muted-foreground">
                  ({lessonsCount} {lessonsCount === 1 ? "lesson" : "lessons"})
                </span>
              </div>
            )}
          </div>

          {/* Actions */}
          {!isEditing && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" disabled={deleting}>
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
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setIsExpanded(true);
                    setShowCreateLesson(true);
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Lesson
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
          )}
        </div>
      </CardHeader>

      {/* Lessons */}
      {isExpanded && (
        <CardContent className="pt-0 pb-4">
          {/* Create Lesson Form */}
          {showCreateLesson && (
            <div className="mb-4">
              <CreateLessonForm
                chapterId={chapter.id}
                onSuccess={() => {
                  setShowCreateLesson(false);
                  onUpdate();
                }}
                onCancel={() => setShowCreateLesson(false)}
              />
            </div>
          )}

          {/* Lessons List */}
          {lessonsCount === 0 && !showCreateLesson ? (
            <div className="text-center py-8 text-muted-foreground">
              <p className="mb-4">No lessons yet</p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowCreateLesson(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Lesson
              </Button>
            </div>
          ) : (
            <>
              <LessonsList
                lessons={chapter.lessons || []}
                chapterId={chapter.id}
                courseId={courseId} // ✅ FIX : Passer courseId à LessonsList
                onUpdate={onUpdate}
              />

              {/* Add Lesson Button */}
              {!showCreateLesson && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCreateLesson(true)}
                  className="w-full mt-2"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Lesson
                </Button>
              )}
            </>
          )}
        </CardContent>
      )}
    </Card>
  );
}
