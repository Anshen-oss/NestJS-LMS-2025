'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useInstructorCourses } from '@/hooks/use-instructor-dashboard';
import { Search, X } from 'lucide-react';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

interface SearchAndFiltersProps {
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  courseFilter: string;
  setCourseFilter: Dispatch<SetStateAction<string>>;
  sortBy: string;
  setSortBy: Dispatch<SetStateAction<string>>;
  onSearch: () => void;
}

export default function SearchAndFilters({
  search,
  setSearch,
  courseFilter,
  setCourseFilter,
  sortBy,
  setSortBy,
  onSearch,
}: SearchAndFiltersProps) {
  const { courses, loading: coursesLoading } = useInstructorCourses();
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  // Debounce de la recherche (500ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      onSearch();
    }, 500);

    return () => clearTimeout(timer);
  }, [search, onSearch]);

  const handleClearSearch = () => {
    setSearch('');
    setDebouncedSearch('');
  };

  return (
    <div className="bg-white rounded-lg border p-4 mb-6 space-y-4">
      {/* Row 1: Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Chercher par nom ou email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="!pl-10 !text-gray-900 !placeholder-gray-500"
        />
        {search && (
          <button
            onClick={handleClearSearch}
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Row 2: Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {/* Filtre par cours */}
        <div>
          <label className="!text-sm !font-medium !text-gray-900 !mb-2 !block">
            Cours
          </label>
          <Select value={courseFilter} onValueChange={setCourseFilter}>
            <SelectTrigger
              className="!bg-white !text-gray-900 !border !border-gray-300 !placeholder-gray-500"
              style={{
                backgroundColor: 'white',
                color: '#111827',
                borderColor: '#d1d5db'
              }}
            >
              <SelectValue placeholder="Tous les cours" />
            </SelectTrigger>
            <SelectContent>
              {coursesLoading ? (
                <SelectItem value="loading" disabled>
                  Chargement...
                </SelectItem>
              ) : (
                <>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.title}
                    </SelectItem>
                  ))}
                </>
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Filtre par tri */}
        <div>
          <label className="!text-sm !font-medium !text-gray-900 !mb-2 !block">
            Trier par
          </label>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger
              className="!bg-white !text-gray-900 !border !border-gray-300 !placeholder-gray-500"
              style={{
                backgroundColor: 'white',
                color: '#111827',
                borderColor: '#d1d5db'
              }}
            >
              <SelectValue placeholder="Récemment inscrit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="enrolledAt">Récemment inscrit</SelectItem>
              <SelectItem value="name">Nom (A-Z)</SelectItem>
              <SelectItem value="completionRate">Complétion (Haut → Bas)</SelectItem>
              <SelectItem value="lastActivityAt">Dernière activité</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bouton Réinitialiser */}
        <div className="flex items-end">
          <Button
            variant="outline"
            onClick={() => {
              setSearch('');
              setCourseFilter('');
              setSortBy('enrolledAt');
            }}
            className="!w-full !text-gray-900 !border-gray-300"
          >
            Réinitialiser
          </Button>
        </div>
      </div>
    </div>
  );
}
