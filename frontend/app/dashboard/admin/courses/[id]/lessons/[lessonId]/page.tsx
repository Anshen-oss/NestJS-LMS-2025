"use client";

import { Button } from "@/components/ui/button";
import { useGetLessonForEditQuery } from "@/lib/generated/graphql";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { LessonFormComplete } from "./_components/LessonFormComplete";

export default function EditLessonPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams(); // ✅ Hook Next.js

  const lessonId = params.lessonId as string;

  // ✅ Récupérer depuis params.id OU query params
  const courseId = (params.id as string) || searchParams.get('courseId') || '';
  const chapterId = searchParams.get('chapterId') || '';

  // Debug logs
  console.log("📍 Route params:", {
    paramsId: params.id,
    courseIdFromQuery: searchParams.get('courseId'),
    chapterIdFromQuery: searchParams.get('chapterId'),
    courseIdFinal: courseId,
    chapterIdFinal: chapterId,
    lessonId,
    allParams: params,
  });

  // Fetch lesson data
  const { data, loading, error } = useGetLessonForEditQuery({
    variables: { id: lessonId },
    skip: !lessonId,
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data?.lessonForEdit) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <p className="text-lg text-destructive mb-4">
            Erreur lors du chargement de la lesson
          </p>
          <Button onClick={() => router.back()}>Retour</Button>
        </div>
      </div>
    );
  }

  const lesson = data.lessonForEdit;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push(`/admin/courses/${courseId}/edit`)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Éditer la lesson</h1>
          <p className="text-muted-foreground mt-1">
            Modifiez les informations et le contenu de la lesson
          </p>
        </div>
      </div>

      {/* Form */}
      <LessonFormComplete
        lesson={lesson}
        courseId={courseId}
        chapterId={chapterId}
      />
    </div>
  );
}
