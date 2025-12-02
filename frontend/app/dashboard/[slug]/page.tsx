'use client';

import { useGetCourseBySlugQuery } from '@/lib/generated/graphql';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { use, useEffect } from 'react';

interface CourseSlugPageProps {
  params: Promise<{ slug: string }>;
}

export default function CourseSlugPage({ params }: CourseSlugPageProps) {
  const { slug } = use(params);
  const router = useRouter();

  const { data, loading, error } = useGetCourseBySlugQuery({
    variables: { slug },
  });

  useEffect(() => {
    if (data?.courseBySlug) {
      const course = data.courseBySlug;
      const firstChapter = course.chapters?.[0];
      const firstLesson = firstChapter?.lessons?.[0];

      if (firstLesson) {
        // Rediriger vers la première leçon
        router.push(`/dashboard/${slug}/${firstLesson.id}`);
      }
    }
  }, [data, slug, router]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold text-destructive">Erreur</h2>
        <p className="text-muted-foreground">{error.message}</p>
      </div>
    );
  }

  // Si pas de leçons
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-bold">No lessons available</h2>
      <p className="text-muted-foreground">
        This course does not have any lessons yet!
      </p>
    </div>
  );
}
