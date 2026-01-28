"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateLessonMutation } from "@/lib/generated/graphql";
import { Loader2, Save, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface EditLessonFormProps {
  lesson: {
    id: string;
    title: string;
    description?: string | null;
    isFree: boolean;
  };
  onSuccess: () => void;
  onCancel: () => void;
}

export function EditLessonForm({
  lesson,
  onSuccess,
  onCancel,
}: EditLessonFormProps) {
  const [title, setTitle] = useState(lesson.title);
  const [description, setDescription] = useState(lesson.description || "");
  const [isFree, setIsFree] = useState(lesson.isFree);

  const [updateLesson, { loading }] = useUpdateLessonMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Lesson title is required");
      return;
    }

    try {
      await updateLesson({
        variables: {
          id: lesson.id,
          input: {
            title: title.trim(),
            description: description.trim() || null,
            isFree,
          },
        },
      });

      toast.success("Lesson updated successfully");
      onSuccess();
    } catch (error: any) {
      console.error("Update lesson error:", error);
      toast.error(error.message || "Failed to update lesson");
    }
  };

  return (
    <Card className="border-primary">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <Label htmlFor="edit-lesson-title">Lesson Title</Label>
            <Input
              id="edit-lesson-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Variables and Data Types"
              autoFocus
              disabled={loading}
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="edit-lesson-description">Description (optional)</Label>
            <Textarea
              id="edit-lesson-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of what students will learn"
              rows={3}
              disabled={loading}
            />
          </div>

          {/* Free Preview */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="edit-is-free">Free Preview</Label>
              <p className="text-sm text-muted-foreground">
                Allow everyone to watch this lesson for free
              </p>
            </div>
            <Switch
              id="edit-is-free"
              checked={isFree}
              onCheckedChange={setIsFree}
              disabled={loading}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 justify-end pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
