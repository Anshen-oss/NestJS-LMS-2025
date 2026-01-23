"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useCreateLessonMutation } from "@/lib/generated/graphql";
import { Loader2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface CreateLessonFormProps {
  chapterId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function CreateLessonForm({
  chapterId,
  onSuccess,
  onCancel,
}: CreateLessonFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isFree, setIsFree] = useState(false);

  const [createLesson, { loading }] = useCreateLessonMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Lesson title is required");
      return;
    }

    try {
      await createLesson({
        variables: {
          chapterId,
          input: {
            title: title.trim(),
            description: description.trim() || undefined,
            isFree,
          },
        },
      });

      toast.success("Lesson created successfully");
      onSuccess();
    } catch (error: any) {
      console.error("Create lesson error:", error);
      toast.error(error.message || "Failed to create lesson");
    }
  };

  return (
    <Card className="border-primary">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <Label htmlFor="lesson-title">Lesson Title</Label>
            <Input
              id="lesson-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Variables and Data Types"
              autoFocus
              disabled={loading}
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="lesson-description">Description (optional)</Label>
            <Textarea
              id="lesson-description"
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
              <Label htmlFor="is-free">Free Preview</Label>
              <p className="text-sm text-muted-foreground">
                Allow everyone to watch this lesson for free
              </p>
            </div>
            <Switch
              id="is-free"
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
                  Creating...
                </>
              ) : (
                "Create Lesson"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
