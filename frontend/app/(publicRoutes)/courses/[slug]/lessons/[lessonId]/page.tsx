"use client";

import { useGetLessonQuery } from "@/lib/generated/graphql";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";

export default function LessonPage() {
  const params = useParams();
  const lessonId = params.lessonId as string;

  const { data, loading, error } = useGetLessonQuery({
    variables: { id: lessonId },
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error || !data?.lesson) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-red-500">Error loading lesson</p>
      </div>
    );
  }

  const lesson = data.lesson;

  // Ne pas afficher si non publié
  if (!lesson.isPublished) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-muted-foreground">This lesson is not available yet.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">{lesson.title}</h1>

      {lesson.content && (
        <div className="prose prose-lg max-w-none">
          <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
        </div>
      )}
    </div>
  );
}
