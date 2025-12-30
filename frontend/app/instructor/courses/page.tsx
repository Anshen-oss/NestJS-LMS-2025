'use client';

import { DeleteCourseDialog } from '@/components/instructor/DeleteCourseDialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDeleteCourse } from '@/hooks/use-delete-course';
import { useInstructorCourses } from '@/hooks/use-instructor-dashboard';
import {
  AlertCircle,
  BookOpen,
  DollarSign,
  Edit,
  Eye,
  Plus,
  Search,
  Trash2,
  TrendingUp,
  Users
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';

export default function InstructorCoursesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  // Dialog de suppression
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<{ id: string; title: string } | null>(null);

  // Récupérer tous les cours
  const { courses, loading, error, refetch } = useInstructorCourses();

  // Hook de suppression
  const { deleteCourse, loading: deleteLoading } = useDeleteCourse();

  // Ouvrir le dialog de suppression
  const handleDeleteClick = (course: { id: string; title: string }) => {
    setCourseToDelete(course);
    setDeleteDialogOpen(true);
  };

  // Confirmer la suppression
const handleConfirmDelete = async () => {
  console.log('🗑️ CONFIRM DELETE - Start');
  console.log('Course to delete:', courseToDelete);

  if (!courseToDelete) {
    console.log('❌ No course to delete!');
    return;
  }

  console.log('📞 Calling deleteCourse...');
  const success = await deleteCourse(courseToDelete.id);

  console.log('✅ Delete result:', success);

  if (success) {
    console.log('✅ Success! Closing dialog...');
    setDeleteDialogOpen(false);
    setCourseToDelete(null);

    console.log('🔄 Refetching courses...');
    await refetch();
    console.log('✅ Refetch done!');
  } else {
    console.log('❌ Delete failed!');
  }
};

  // Filtrer les cours selon la recherche
  const filteredCourses = useMemo(() => {
    let filtered = courses;

    // Filtrer par recherche
    if (searchQuery.trim()) {
      filtered = filtered.filter((course) =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filtrer par onglet actif
    if (activeTab === 'published') {
      filtered = filtered.filter((c) => c.status === 'Published');
    } else if (activeTab === 'draft') {
      filtered = filtered.filter((c) => c.status === 'Draft');
    }

    return filtered;
  }, [courses, searchQuery, activeTab]);

  // Compter par statut
  const publishedCount = courses.filter((c) => c.status === 'Published').length;
  const draftCount = courses.filter((c) => c.status === 'Draft').length;

  // Formater la date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  // Afficher une erreur si nécessaire
  if (error) {
    return (
      <div className="py-8 px-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Une erreur s'est produite lors du chargement des cours. Veuillez réessayer.
          </AlertDescription>
        </Alert>
        <Button onClick={() => refetch()} className="mt-4">
          Réessayer
        </Button>
      </div>
    );
  }

  return (
    <div className="py-8 px-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-300 mb-2">Mes Cours</h1>
            <p className="text-gray-500 text-lg">
              Gérez et organisez vos cours
            </p>
          </div>
          <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
            <Link href="/instructor/courses/new">
              <Plus className="w-5 h-5 mr-2" />
              Créer un cours
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher un cours..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
          <TabsTrigger
            value="all"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-6 py-3"
          >
            Tous ({courses.length})
          </TabsTrigger>
          <TabsTrigger
            value="published"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-green-600 data-[state=active]:bg-transparent px-6 py-3"
          >
            Publiés ({publishedCount})
          </TabsTrigger>
          <TabsTrigger
            value="draft"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-gray-600 data-[state=active]:bg-transparent px-6 py-3"
          >
            Brouillons ({draftCount})
          </TabsTrigger>
        </TabsList>

        {/* Tous les cours */}
        <TabsContent value={activeTab} className="mt-6">
          {loading ? (
            // Loading state
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="bg-white">
                  <CardContent className="p-6">
                    <div className="flex gap-6">
                      <Skeleton className="w-64 h-40 rounded-lg" />
                      <div className="flex-1 space-y-4">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                        <div className="flex gap-3">
                          <Skeleton className="h-9 w-24" />
                          <Skeleton className="h-9 w-24" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredCourses.length === 0 ? (
            // Empty state
            <Card className="bg-white">
              <CardContent className="pt-6 text-center py-12">
                <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">
                  {searchQuery ? 'Aucun cours trouvé' : 'Aucun cours'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchQuery
                    ? `Aucun cours ne correspond à "${searchQuery}"`
                    : 'Commencez par créer votre premier cours'}
                </p>
                {!searchQuery && (
                  <Button asChild>
                    <Link href="/instructor/courses/new">
                      <Plus className="w-4 h-4 mr-2" />
                      Créer un cours
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            // Courses list
            <div className="grid grid-cols-1 gap-6">
              {filteredCourses.map((course) => (
                <Card key={course.id} className="bg-white hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex gap-6">
                      {/* Image */}
                      <div className="relative w-64 h-40 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                        {course.imageUrl ? (
                          <Image
                            src={course.imageUrl}
                            alt={course.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <BookOpen className="w-12 h-12 text-gray-400" />
                          </div>
                        )}
                        {/* Status badge */}
                        <div className="absolute top-2 left-2">
                          {course.status === 'Draft' && (
                            <span className="bg-gray-900 text-white text-xs px-2 py-1 rounded">
                              Brouillon
                            </span>
                          )}
                          {course.status === 'Published' && (
                            <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">
                              Publié
                            </span>
                          )}
                          {course.status === 'Archived' && (
                            <span className="bg-orange-600 text-white text-xs px-2 py-1 rounded">
                              Archivé
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Info */}
                      <div className="flex-1 flex flex-col">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-1">
                              {course.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {course.chaptersCount} chapitres • {course.lessonsCount} leçons
                            </p>
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {course.studentsCount} étudiants
                          </span>
                          {course.status === 'Published' && (
                            <>
                              <span className="flex items-center gap-1">
                                <DollarSign className="w-4 h-4" />
                                ${course.revenue.toFixed(2)}
                              </span>
                              <span className="flex items-center gap-1">
                                <TrendingUp className="w-4 h-4" />
                                {course.completionRate.toFixed(1)}% complété
                              </span>
                            </>
                          )}
                          <span className="text-gray-500">
                            Mis à jour le {formatDate(course.updatedAt)}
                          </span>
                        </div>

                        {/* Performance bar */}
                        {course.status === 'Published' && (
                          <div className="mb-4">
                            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                              <span>Taux de complétion</span>
                              <span className="font-semibold">{course.completionRate.toFixed(1)}%</span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all"
                                style={{ width: `${Math.min(course.completionRate, 100)}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center gap-3 mt-auto">
                          <Button asChild variant="default" size="sm">
                            <Link href={`/instructor/courses/${course.id}/edit`}>
                              <Edit className="w-4 h-4 mr-2" />
                              Modifier
                            </Link>
                          </Button>
                          {course.status === 'Published' && (
                            <Button asChild variant="outline" size="sm">
                              <Link href={`/courses/${course.slug}`}>
                                <Eye className="w-4 h-4 mr-2" />
                                Aperçu
                              </Link>
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 ml-auto"
                            onClick={() => handleDeleteClick({ id: course.id, title: course.title })}
                            disabled={deleteLoading}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Supprimer
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Dialog de confirmation de suppression */}
      <DeleteCourseDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        courseTitle={courseToDelete?.title || ''}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
      />
    </div>
  );
}
