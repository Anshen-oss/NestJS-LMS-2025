"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCreateChapterMutation } from "@/lib/generated/graphql";
import { Loader2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface CreateChapterFormProps {
  courseId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function CreateChapterForm({
  courseId,
  onSuccess,
  onCancel,
}: CreateChapterFormProps) {
  const [title, setTitle] = useState("");
  const [createChapter, { loading }] = useCreateChapterMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Chapter title is required");
      return;
    }

    try {
      await createChapter({
        variables: {
          input: {
            courseId,
            title: title.trim(),
          },
        },
      });

      toast.success("Chapter created successfully");
      onSuccess();
    } catch (error: any) {
      console.error("Create chapter error:", error);
      toast.error(error.message || "Failed to create chapter");
    }
  };

  return (
    <Card className="border-primary">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Chapter Title
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Introduction to TypeScript"
              autoFocus
              disabled={loading}
            />
          </div>

          <div className="flex gap-2 justify-end">
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
                "Create Chapter"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
