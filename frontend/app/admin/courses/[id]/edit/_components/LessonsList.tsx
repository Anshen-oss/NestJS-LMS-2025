"use client";

import { useReorderLessonsMutation } from "@/lib/generated/graphql";
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { toast } from "sonner";
import { LessonItem } from "./LessonItem";

interface Lesson {
  id: string;
  title: string;
  description?: string | null;
  videoUrl?: string | null;
  duration?: number | null;
  position: number;
  isFree: boolean;
}

interface LessonsListProps {
  lessons: Lesson[];
  chapterId: string;
  onUpdate: () => void;
}

export function LessonsList({ lessons, chapterId, onUpdate }: LessonsListProps) {
  const [reorderLessons] = useReorderLessonsMutation();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = lessons.findIndex((l) => l.id === active.id);
    const newIndex = lessons.findIndex((l) => l.id === over.id);

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    // Créer le nouvel ordre
    const reorderedLessons = [...lessons];
    const [movedLesson] = reorderedLessons.splice(oldIndex, 1);
    reorderedLessons.splice(newIndex, 0, movedLesson);

    // Mettre à jour les positions
    const lessonsWithNewPositions = reorderedLessons.map((lesson, index) => ({
      id: lesson.id,
      position: index,
    }));

    try {
      console.log("📤 Sending reorder lessons:", {
  chapterId,
  lessons: lessonsWithNewPositions,
});
      await reorderLessons({
        variables: {
          input: {
            chapterId,
            lessons: lessonsWithNewPositions,
          },
        },
      });

      toast.success("Lessons reordered");
      onUpdate();
    } catch (error: any) {
      console.error("Reorder error:", error);
      toast.error(error.message || "Failed to reorder lessons");
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={lessons.map((l) => l.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
          {lessons.map((lesson) => (
            <LessonItem key={lesson.id} lesson={lesson} onUpdate={onUpdate} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
