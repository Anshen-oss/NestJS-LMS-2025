"use client";

import { GetCourseForEditQuery, useReorderChaptersMutation } from "@/lib/generated/graphql";
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
import { ChapterItem } from "./ChapterItem";

// 👇 Utilise le type généré par Codegen
type Chapter = NonNullable<GetCourseForEditQuery['getCourseForEdit']>['chapters'][number];

interface ChapterListProps {
  chapters: Chapter[];
  courseId: string;
  onUpdate: () => void;
}

export function ChapterList({ chapters, courseId, onUpdate }: ChapterListProps) {
  const [reorderChapters] = useReorderChaptersMutation();

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

    const oldIndex = chapters.findIndex((ch) => ch.id === active.id);
    const newIndex = chapters.findIndex((ch) => ch.id === over.id);

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    // Créer le nouvel ordre
    const reorderedChapters = [...chapters];
    const [movedChapter] = reorderedChapters.splice(oldIndex, 1);
    reorderedChapters.splice(newIndex, 0, movedChapter);

    // Mettre à jour les positions
    const chaptersWithNewPositions = reorderedChapters.map((chapter, index) => ({
      id: chapter.id,
      position: index,
    }));

    try {
      console.log("📤 Sending reorder:", {
        courseId,
        chapters: chaptersWithNewPositions,
      });
      await reorderChapters({
        variables: {
          input: {
            courseId,
            chapters: chaptersWithNewPositions,
          },
        },
      });

      toast.success("Chapters reordered");
      onUpdate();
    } catch (error: any) {
      console.error("Reorder error:", error);
      toast.error(error.message || "Failed to reorder chapters");
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={chapters.map((ch) => ch.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-4">
          {chapters.map((chapter) => (
            <ChapterItem
              key={chapter.id}
              chapter={chapter}
              onUpdate={onUpdate}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
