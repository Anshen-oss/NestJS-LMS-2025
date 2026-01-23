"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GetCourseForEditQuery } from "@/lib/generated/graphql"; // 👈 NOUVEAU
import { BookOpen, Plus } from "lucide-react";
import { useState } from "react";
import { ChapterList } from "./ChapterList";
import { CreateChapterForm } from "./CreateChapterForm";

type Chapter = NonNullable<GetCourseForEditQuery['getCourseForEdit']>['chapters'][number];


interface CurriculumTabProps {
  courseId: string;
  chapters: Chapter[]; // 👈 NOUVEAU : Reçoit les chapters
  onUpdate: () => void;
}

export function CurriculumTab({ courseId, chapters, onUpdate }: CurriculumTabProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);

return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Course Curriculum</h2>
          <p className="text-muted-foreground mt-1">
            Organize your course into chapters and lessons
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Chapter
        </Button>
      </div>

      {/* Create Chapter Form */}
      {showCreateForm && (
        <CreateChapterForm
          courseId={courseId}
          onSuccess={() => {
            setShowCreateForm(false);
            onUpdate(); // 👈 MODIFIÉ : Appelle onUpdate au lieu de refetch
          }}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      {/* Chapters List */}
      {chapters.length === 0 && !showCreateForm ? (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No chapters yet</h3>
            <p className="text-muted-foreground mb-4">
              Start building your course by adding your first chapter
            </p>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Chapter
            </Button>
          </CardContent>
        </Card>
      ) : (
        <ChapterList chapters={chapters} courseId={courseId} onUpdate={onUpdate} />
      )}

      {/* Stats */}
      {chapters.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Curriculum Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-primary">
                  {chapters.length}
                </div>
                <div className="text-sm text-muted-foreground">Chapters</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">
                  {chapters.reduce((acc, ch) => acc + (ch.lessons?.length || 0), 0)}
                </div>
                <div className="text-sm text-muted-foreground">Lessons</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">
                  {Math.round(
                    chapters.reduce(
                      (acc, ch) =>
                        acc +
                        (ch.lessons?.reduce((sum, l) => sum + (l.duration || 0), 0) || 0),
                      0
                    ) / 60
                  )}
                  min
                </div>
                <div className="text-sm text-muted-foreground">Total Duration</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
