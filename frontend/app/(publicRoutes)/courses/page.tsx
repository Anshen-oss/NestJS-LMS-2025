'use client';

import { useGetPublicCoursesQuery } from '@/lib/generated/graphql';
import { PublicCourseCard, PublicCourseCardSkeleton } from '../_components/PublicCourseCard';

interface Course {
  id: string;
  title: string;
  slug: string;
  smallDescription: string;
  price: number;
  duration: number;
  level: string;
  category: string;
  imageUrl: string | null;
}

export default function CoursesPage() {
  const { data, loading, error } = useGetPublicCoursesQuery();


  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-2">
            Erreur de chargement
          </h2>
          <p className="text-muted-foreground">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Explore Courses</h1>
        <p className="text-muted-foreground text-lg">
          Discover our comprehensive collection of courses
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <PublicCourseCardSkeleton key={i} />
            ))
          : data?.publicCourses.map((course: Course) => (
              <PublicCourseCard key={course.id} data={course} />
            ))}
      </div>

      {!loading && data?.publicCourses.length === 0 && (
        <div className="text-center text-muted-foreground py-12">
          <p className="text-xl">No courses available yet.</p>
        </div>
      )}
    </div>
  );
}
