'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { useInstructorStudents } from '@/hooks/use-instructor-students';
import { AlertCircle } from 'lucide-react';
import { useCallback, useState } from 'react';
import PaginationControls from './_components/PaginationControls';
import SearchAndFilters from './_components/SearchAndFilters';
import StudentDetail from './_components/StudentDetail';
import StudentsList from './_components/StudentsList';
import StudentStats from './_components/StudentStats';

export default function StudentsPage() {
  // State pour les filtres
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [sortBy, setSortBy] = useState('enrolledAt');

  // State pour le drawer
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Récupérer les étudiants avec les filtres
  const { students, total, loading, error, handleNextPage, handlePreviousPage } =
    useInstructorStudents(page, pageSize, search || undefined, courseFilter || undefined, sortBy);

  // Callback pour l'ouverture du détail
  const handleSelectStudent = useCallback((studentId: string) => {
    setSelectedStudentId(studentId);
    setIsDetailOpen(true);
  }, []);

  // Callbacks pour la pagination
  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handlePageSizeChange = useCallback((newSize: number) => {
    setPageSize(newSize);
    setPage(1); // Revenir à la première page
  }, []);

  const handleNext = useCallback(() => {
    handleNextPage();
    setPage(prev => prev + 1);
  }, [handleNextPage]);

  const handlePrevious = useCallback(() => {
    handlePreviousPage();
    setPage(prev => Math.max(prev - 1, 1));
  }, [handlePreviousPage]);

  // Callback pour la recherche
  const handleSearch = useCallback(() => {
    setPage(1); // Revenir à la première page lors d'une nouvelle recherche
  }, []);

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Mes Étudiants</h1>
        <p className="text-gray-600">
          Gérez et suivez la progression de tous vos étudiants
        </p>
      </div>

      {/* Erreur */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Une erreur s'est produite lors du chargement des étudiants. Veuillez réessayer.
          </AlertDescription>
        </Alert>
      )}

      {/* Stats */}
      <StudentStats />

      {/* Recherche et filtres */}
      <SearchAndFilters
        search={search}
        setSearch={setSearch}
        courseFilter={courseFilter}
        setCourseFilter={setCourseFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        onSearch={handleSearch}
      />

      {/* Liste des étudiants */}
      <StudentsList
        students={students}
        loading={loading}
        onSelectStudent={handleSelectStudent}
      />

      {/* Pagination */}
      {!loading && students.length > 0 && (
        <PaginationControls
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onNextPage={handleNext}
          onPreviousPage={handlePrevious}
        />
      )}

      {/* Drawer détail étudiant */}
      <StudentDetail
        studentId={selectedStudentId}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
      />
    </div>
  );
}
