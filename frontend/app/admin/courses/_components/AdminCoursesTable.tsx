"use client";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { useState } from "react";
import { DeleteCourseDialog } from "../[id]/edit/_components/DeleteCourseDialog";
import { CourseTableRow } from "./CourseTableRow";

export interface CourseRowData {
  id: string;
  title: string;
  slug: string;
  smallDescription: string;
  imageUrl: string | null;
  price: number;
  status: "Draft" | "Published" | "Archived";
  category: string;

  createdBy: {
    id: string;
    name: string;
    email: string;
  };

  enrollmentsCount: number;
  totalRevenue: number;
  chaptersCount: number;
}

interface AdminCoursesTableProps {
  courses: CourseRowData[];
  onDelete?: () => void;
}

export function AdminCoursesTable({ courses, onDelete }: AdminCoursesTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const handleDeleteClick = (courseId: string, courseTitle: string) => {
    setCourseToDelete({ id: courseId, title: courseTitle });
    setDeleteDialogOpen(true);
  };

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titre</TableHead>
              <TableHead>Instructeur</TableHead>
              <TableHead className="text-center">Étudiants</TableHead>
              <TableHead className="text-right">Revenus</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.map((course) => (
              <CourseTableRow
                key={course.id}
                course={course}
                onDelete={() => handleDeleteClick(course.id, course.title)}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      {courseToDelete && (
        <DeleteCourseDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          courseId={courseToDelete.id}
          courseTitle={courseToDelete.title}
          onSuccess={() => {
            setCourseToDelete(null);
            onDelete?.();
          }}
        />
      )}
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// USAGE EXEMPLE dans app/admin/courses/page.tsx
// ═══════════════════════════════════════════════════════════════════════════════

/*
import { AdminCoursesTable } from "./_components/AdminCoursesTable";
import { CoursesFilterBar } from "./_components/CoursesFilterBar";
import { CoursesEmptyState } from "./_components/CoursesEmptyState";
import { CoursesLoadingState } from "./_components/CoursesLoadingState";
import { CoursesStatsCard } from "./_components/CoursesStatsCard";

export default function AdminCoursesPage() {
  // ... state and queries ...

  return (
    <div className="container max-w-7xl py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Cours</h1>
          <p className="text-muted-foreground mt-2">
            Tous les cours ({filteredCourses.length})
          </p>
        </div>
        <Button onClick={() => router.push("/instructor/courses/new")}>
          <Plus className="w-4 h-4 mr-2" />
          Create Course
        </Button>
      </div>

      <CoursesFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        totalCourses={filteredCourses.length}
      />

      {loading ? (
        <CoursesLoadingState />
      ) : filteredCourses.length === 0 ? (
        <CoursesEmptyState
          searchQuery={searchQuery}
          categoryFilter={categoryFilter}
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>All Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <AdminCoursesTable
              courses={filteredCourses}
              onDelete={() => refetch()}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
*/
