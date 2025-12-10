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
  MoreVertical,
  Pencil,
  Plus,
  Search,
  Trash2,
  Users
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

  const { data, loading, error, refetch } = useGetMyCoursesQuery({
    fetchPolicy: "network-only",
  });


  const filteredCourses = useMemo(() => {
    if (!data?.myCourses) return [];

    return data.myCourses.filter((course) => {
      const matchesSearch = course.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || course.status === statusFilter;
      const matchesCategory =
        categoryFilter === "All Categories" ||
        course.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [data?.myCourses, searchQuery, statusFilter, categoryFilter]);

  if (loading) {
    return (
      <div className="admin-courses-page min-h-screen bg-gray-50">
        <div className="container max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Chargement des cours...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container max-w-7xl mx-auto px-6 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">
              Erreur lors du chargement : {error.message}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ✅ CORRECTION : Ajout de mx-auto px-6 pour les marges */}
      <div className="container max-w-7xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Vos Cours</h1>
            <p className="text-lg text-gray-600">
              Gérez et organisez vos cours
            </p>
          </div>
          <Button
            onClick={() => router.push("/admin/courses/new")}
            size="lg"
            className="gap-2"
          >
            <Plus className="w-5 h-5" />
            Créer un cours
          </Button>
        </div>

        {/* Filters - OPTION 1 : Blanc avec bordures */}
        <Card className="mb-6 bg-white border-gray-200">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">

              {/* Search - Fond blanc avec bordure */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Rechercher un cours..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 !bg-white !border-gray-300 !text-gray-900 placeholder:!text-gray-400 focus-visible:!ring-purple-400"
                />
              </div>

              {/* Status Filter - Fond blanc */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px] !bg-white !border-gray-300 !text-gray-900 data-[placeholder]:!text-gray-400">
                  <SelectValue />
                </SelectTrigger>
                 <SelectContent className="!bg-white">
                  {STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Category Filter - Fond blanc */}
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-[180px] !bg-white !border-gray-300 !text-gray-900 data-[placeholder]:!text-gray-400">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="!bg-white">
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Affichage de <span className="font-semibold text-gray-900">{filteredCourses.length}</span> sur{" "}
            <span className="font-semibold text-gray-900">{data?.myCourses?.length || 0}</span> cours
          </p>
        </div>

        {/* Courses Grid */}
        {filteredCourses.length === 0 ? (
          <Card className="bg-white border-gray-200">
            <CardContent className="pt-6 text-center py-16">
              <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-10 h-10 text-purple-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Aucun cours trouvé</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                {searchQuery || statusFilter !== "all" || categoryFilter !== "All Categories"
                  ? "Essayez d'ajuster vos filtres"
                  : "Commencez par créer votre premier cours"}
              </p>
              {!searchQuery && statusFilter === "all" && categoryFilter === "All Categories" && (
                <Button onClick={() => router.push("/admin/courses/new")} size="lg" className="gap-2">
                  <Plus className="w-5 h-5" />
                  Créer un cours
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
              refetch();
            }}
          />
        )}
      </div>
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
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-gray-200 group bg-white">
      {/* Image */}
      <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-purple-50 to-indigo-50">
        {course.imageUrl ? (
          <Image
            src={course.imageUrl}
            alt={course.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen className="w-16 h-16 text-purple-300" />
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full shadow-sm ${
              course.status === "Published"
                ? "bg-green-500 text-white"
                : "bg-yellow-500 text-white"
            }`}
          >
            {course.status === "Published" ? "Publié" : "Brouillon"}
          </span>
        </div>

        {/* Actions Menu */}
        <div className="absolute top-3 right-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                variant="secondary"
                className="h-9 w-9 bg-white/90 backdrop-blur-sm hover:bg-white shadow-sm"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white text-black">
              <DropdownMenuItem onClick={onEdit}>
                <Pencil className="w-4 h-4 mr-2" />
                Éditer
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onPreview}>
                <Eye className="w-4 h-4 mr-2" />
                Prévisualiser
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onDelete} className="text-red-600 focus:text-red-600">
                <Trash2 className="w-4 h-4 mr-2" />
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Content */}
      <CardContent className="p-5 bg-white">
        <div className="mb-3">
          <h3 className="font-bold text-lg line-clamp-2 mb-2 text-gray-900">
            {course.title}
          </h3>
          {course.smallDescription && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {course.smallDescription}
            </p>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-gray-600 mb-4 bg-gray-50 rounded-lg p-2">
          <div className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            <span className="font-medium">{course.enrollmentsCount || 0} étudiants</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span className="font-medium">{course.chaptersCount || 0} chapitres</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 mb-1">Catégorie</span>
            <span className="text-sm font-medium text-gray-900">{course.category}</span>
          </div>
          <div className="text-right">
            <span className="text-xs text-gray-500 block mb-1">Prix</span>
            <span className="text-xl font-bold text-purple-600">
              {new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: 'EUR',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(course.price)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
