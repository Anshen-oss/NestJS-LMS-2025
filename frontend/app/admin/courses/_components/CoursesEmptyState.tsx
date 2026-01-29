import { Card, CardContent } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

interface CoursesEmptyStateProps {
  searchQuery: string;
  categoryFilter: string;
}

export function CoursesEmptyState({
  searchQuery,
  categoryFilter,
}: CoursesEmptyStateProps) {
  const hasFilters = searchQuery || categoryFilter !== "All Categories";

  return (
    <Card>
      <CardContent className="pt-6 text-center py-12">
        <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">No courses found</h3>
        <p className="text-muted-foreground">
          {hasFilters
            ? "Try adjusting your filters"
            : "No courses available yet"}
        </p>
      </CardContent>
    </Card>
  );
}
