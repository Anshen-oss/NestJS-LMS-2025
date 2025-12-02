"use client";

import { ChapterItem } from "./ChapterItem";

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

interface ChapterListProps {
  chapters: Chapter[];
  onUpdate: () => void;
}

export function ChapterList({ chapters, onUpdate }: ChapterListProps) {
  return (
    <div className="space-y-4">
      {chapters.map((chapter) => (
        <ChapterItem key={chapter.id} chapter={chapter} onUpdate={onUpdate} />
      ))}
    </div>
  );
}
