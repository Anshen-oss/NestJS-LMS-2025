"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetCourseForEditQuery } from "@/lib/generated/graphql";
import { ArrowLeft, BookOpen, FileText, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { use } from "react";
import { CourseInfoTab } from "./_components/CourseInfoTab";
import { CurriculumTab } from "./_components/CurriculumTab";

interface EditCoursePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditCoursePage({ params }: EditCoursePageProps) {
  const { id: courseId } = use(params);
  const router = useRouter();

  // Query
  const { data, loading, error, refetch } = useGetCourseForEditQuery({ // 👈 Ajoute refetch
    variables: { id: courseId },
    fetchPolicy: "network-only",
    nextFetchPolicy: "network-only",
  });

  // 👇 NOUVEAU : Fonction de refetch avec log
const handleUpdate = async () => {
  console.log("🔄 handleUpdate appelé - refetch en cours...");
  await refetch();
  console.log("✅ Refetch terminé");
};

  // 1. LOADING
  if (loading) {
    return (
      <div className="container max-w-7xl py-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading course...</p>
        </div>
      </div>
    );
  }

  // 2. ERROR
  if (error || !data?.getCourseForEdit) {
    return (
      <div className="container max-w-7xl py-8">
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">Error loading course</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => router.push("/admin/courses")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to courses
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 3. SUCCESS
  const course = data.getCourseForEdit;

  return (
    <div className="container max-w-7xl py-8">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          size="sm"
          className="mb-4"
          onClick={() => router.push("/admin/courses")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to courses
        </Button>
        <h1 className="text-3xl font-bold">{course.title}</h1>
        <p className="text-muted-foreground mt-2">
          Manage your course content and curriculum
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="info" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="info" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Course Info
          </TabsTrigger>
          <TabsTrigger value="curriculum" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Curriculum
          </TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <CourseInfoTab course={course} />
        </TabsContent>

      <TabsContent value="curriculum">
        <CurriculumTab
          courseId={courseId}
          chapters={course.chapters} // 👈 NOUVEAU : Passe les chapters
          onUpdate={handleUpdate}
        />
      </TabsContent>
      </Tabs>
    </div>
  );
}
