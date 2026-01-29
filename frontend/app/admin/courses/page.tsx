"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { gql, useQuery } from "@apollo/client";
import {
  Loader2,
  Plus
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { AdminCoursesTable } from "./_components/AdminCoursesTable";
import { CoursesEmptyState } from "./_components/CoursesEmptyState";
import { CoursesFilterBar } from "./_components/CoursesFilterBar";
import { CoursesLoadingState } from "./_components/CoursesLoadingState";

// ═══════════════════════════════════════════════════════════════════════════════
// GRAPHQL QUERY
// ═══════════════════════════════════════════════════════════════════════════════

const GET_ALL_COURSES_ADMIN = gql`
  query GetAllCoursesAdmin($status: CourseStatus) {
    allCoursesAdmin(status: $status) {
      id
      title
      slug
      smallDescription
      imageUrl
      price
      status
      level
      category
      duration
      createdAt
      updatedAt
      publishedAt

      createdBy {
        id
        name
        email
        role
      }

      enrollmentsCount
      totalRevenue
      chaptersCount
    }
  }
`;

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface CourseAdmin {
  id: string;
  title: string;
  slug: string;
  smallDescription: string;
  imageUrl: string | null;
  price: number;
  status: "Draft" | "Published" | "Archived";
  level: string;
  category: string;
  duration: number | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;

  createdBy: {
    id: string;
    name: string;
    email: string;
    role: string;
  };

  enrollmentsCount: number;
  totalRevenue: number;
  chaptersCount: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

const CATEGORIES = [
  "All Categories",
  "Programming",
  "devOps",
  "Marketing",
  "Business",
  "IA",
  "Frontend",
];

const STATUS_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "Draft", label: "Draft" },
  { value: "Published", label: "Published" },
  { value: "Archived", label: "Archived" },
];

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function AdminCoursesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<{ id: string; title: string } | null>(null);

  // ═══════════════════════════════════════════════════════════════════════════════
  // GRAPHQL QUERY
  // ═══════════════════════════════════════════════════════════════════════════════

  const { data, loading, error, refetch } = useQuery<{ allCoursesAdmin: CourseAdmin[] }>(
    GET_ALL_COURSES_ADMIN,
    {
      variables: {
        status: statusFilter === "all" ? null : statusFilter,
      },
      fetchPolicy: "network-only",
    }
  );

  // ═══════════════════════════════════════════════════════════════════════════════
  // FILTER & SEARCH
  // ═══════════════════════════════════════════════════════════════════════════════

  const filteredCourses = useMemo(() => {
    if (!data?.allCoursesAdmin) return [];

    return data.allCoursesAdmin.filter((course) => {
      // 🔍 Recherche par titre ou instructeur
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        course.title.toLowerCase().includes(searchLower) ||
        course.createdBy.name.toLowerCase().includes(searchLower) ||
        course.createdBy.email.toLowerCase().includes(searchLower);

      // 🏷️ Filtre par catégorie
      const matchesCategory =
        categoryFilter === "All Categories" ||
        course.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [data?.allCoursesAdmin, searchQuery, categoryFilter]);

  // ═══════════════════════════════════════════════════════════════════════════════
  // HANDLERS
  // ═══════════════════════════════════════════════════════════════════════════════

  const handleDeleteClick = (courseId: string, courseTitle: string) => {
    setCourseToDelete({ id: courseId, title: courseTitle });
    setDeleteDialogOpen(true);
  };

  // ═══════════════════════════════════════════════════════════════════════════════
  // RENDER LOADING
  // ═══════════════════════════════════════════════════════════════════════════════

  if (loading) {
    return (
      <div className="container max-w-7xl py-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading courses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container max-w-7xl py-8">
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">Error: {error.message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // RENDER PAGE
  // ═══════════════════════════════════════════════════════════════════════════════
  return (
    <div className="container max-w-7xl py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Cours</h1>
          <p className="text-muted-foreground mt-2">
            Tous les cours ({filteredCourses.length})
          </p>
        </div>
        <Button onClick={() => router.push("/admin/courses/new")}>
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
