"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetMyCoursesQuery } from "@/lib/generated/graphql";
import {
  BookOpen,
  Eye,
  Loader2,
  MoreVertical,
  Pencil,
  Plus,
  Search,
  Trash2,
  Users,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { DeleteCourseDialog } from "./[id]/edit/_components/DeleteCourseDialog";
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
];

export default function AdminCoursesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<{ id: string; title: string } | null>(null);

  // Fetch courses
  const { data, loading, error, refetch } = useGetMyCoursesQuery({
    fetchPolicy: "network-only",
  });

  // Filtered courses
  const filteredCourses = useMemo(() => {
    if (!data?.myCourses) return [];

    return data.myCourses.filter((course) => {
      // Search filter
      const matchesSearch = course.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      // Status filter
      const matchesStatus =
        statusFilter === "all" || course.status === statusFilter;

      // Category filter
      const matchesCategory =
        categoryFilter === "All Categories" ||
        course.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [data?.myCourses, searchQuery, statusFilter, categoryFilter]);

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
            <p className="text-destructive">Error loading courses: {error.message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Your Courses</h1>
          <p className="text-muted-foreground mt-2">
            Manage and organize your courses
          </p>
        </div>
        <Button onClick={() => router.push("/admin/courses/new")}>
          <Plus className="w-4 h-4 mr-2" />
          Create Course
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Status Filter */}
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Category Filter */}
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="mb-6 text-sm text-muted-foreground">
        Showing {filteredCourses.length} of {data?.myCourses?.length || 0} courses
      </div>

      {/* Courses Grid */}
      {filteredCourses.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No courses found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || statusFilter !== "all" || categoryFilter !== "All Categories"
                ? "Try adjusting your filters"
                : "Get started by creating your first course"}
            </p>
            {!searchQuery && statusFilter === "all" && categoryFilter === "All Categories" && (
              <Button onClick={() => router.push("/admin/courses/new")}>
                <Plus className="w-4 h-4 mr-2" />
                Create Course
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onEdit={() => router.push(`/admin/courses/${course.id}/edit`)}
              onPreview={() => router.push(`/courses/${course.slug}`)}
              onDelete={() => {
                 setCourseToDelete({ id: course.id, title: course.title });
                setDeleteDialogOpen(true);
              }}
            />
          ))}
        </div>
      )}

  {/* Delete Dialog */}
      {courseToDelete && (
        <DeleteCourseDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          courseId={courseToDelete.id}
          courseTitle={courseToDelete.title}
          onSuccess={() => {
            setCourseToDelete(null);
            refetch(); // Recharge la liste
          }}
        />
      )}
    </div>
  );
}

// Course Card Component
interface CourseCardProps {
  course: any;
  onEdit: () => void;
  onPreview: () => void;
  onDelete: () => void;
}

function CourseCard({ course, onEdit, onPreview, onDelete }: CourseCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
      {/* Image */}
      <div className="relative aspect-video overflow-hidden bg-muted">
        {course.imageUrl ? (
          <Image
            src={course.imageUrl}
            alt={course.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen className="w-12 h-12 text-muted-foreground" />
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-2 left-2">
          <span
            className={`px-2 py-1 text-xs font-semibold rounded-full ${
              course.status === "Published"
                ? "bg-green-500/90 text-white"
                : "bg-yellow-500/90 text-white"
            }`}
          >
            {course.status}
          </span>
        </div>

        {/* Actions Menu */}
        <div className="absolute top-2 right-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                variant="secondary"
                className="h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-background"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>
                <Pencil className="w-4 h-4 mr-2" />
                Edit Course
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onPreview}>
                <Eye className="w-4 h-4 mr-2" />
                Preview Course
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onDelete} className="text-destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Course
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Content */}
      <CardContent className="p-4">
        <div className="mb-2">
          <h3 className="font-semibold line-clamp-2 mb-1">{course.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {course.smallDescription}
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span>{course.enrollmentsCount || 0} students</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="w-3 h-3" />
            <span>{course.chaptersCount || 0} chapters</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t">
          <div>
            <span className="text-xs text-muted-foreground">{course.category}</span>
            <span className="mx-2 text-muted-foreground">•</span>
            <span className="text-xs text-muted-foreground">{course.level}</span>
          </div>
          <div className="text-lg font-bold text-primary">
            €{course.price.toFixed(2)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
