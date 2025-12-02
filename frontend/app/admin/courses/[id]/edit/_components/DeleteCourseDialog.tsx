"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteCourseMutation } from "@/lib/generated/graphql";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface DeleteCourseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseId: string;
  courseTitle: string;
  onSuccess: () => void;
}

export function DeleteCourseDialog({
  open,
  onOpenChange,
  courseId,
  courseTitle,
  onSuccess,
}: DeleteCourseDialogProps) {
  const [deleteCourse, { loading }] = useDeleteCourseMutation();

    console.log("🔍 Dialog props:", { open, courseId, courseTitle });

  const handleDelete = async () => {
    try {
      await deleteCourse({
        variables: { id: courseId },
      });

      toast.success("Course deleted successfully");
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      console.error("Delete error:", error);

      // Gérer l'erreur métier (enrollments existants)
      if (error.message?.includes("enrollments")) {
        toast.error("Cannot delete course with active students. Archive it instead.");
      } else {
        toast.error("Failed to delete course");
      }
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Course</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <strong>"{courseTitle}"</strong>?
            <br />
            <br />
            This action cannot be undone. All chapters, lessons, and course data will be permanently deleted.
            {loading && (
              <span className="block mt-2 text-muted-foreground">
                This may take a few moments...
              </span>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={loading}
            className="bg-destructive hover:bg-destructive/90"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Course"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
