'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { useGetCourseBySlugQuery } from '@/lib/generated/graphql';
import { ReactNode, use } from 'react';
//import { CourseSidebar } from '../_components/CourseSidebar';

interface CourseLayoutProps {
  params: Promise<{ slug: string }>;
  children: ReactNode;
}

export default function CourseLayout({ children, params }: CourseLayoutProps) {
  const { slug } = use(params);

  // Query GraphQL pour récupérer le cours
  const { data, loading, error } = useGetCourseBySlugQuery({
    variables: { slug },
  });

  if (loading) {
    return (
      <div className="flex flex-1">
        <div className="w-80 border-r border-border shrink-0 p-4">
          <Skeleton className="h-12 w-full mb-4" />
          <Skeleton className="h-8 w-full mb-2" />
          <Skeleton className="h-8 w-full mb-2" />
          <Skeleton className="h-8 w-full" />
        </div>
        <div className="flex-1 overflow-hidden">{children}</div>
      </div>
    );
  }

  if (error || !data?.courseBySlug) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-destructive">Erreur : Cours introuvable</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1">
      {/* Sidebar - 30% */}
      <div className="w-80 border-r border-border shrink-0">
        {/* <CourseSidebar course={data.courseBySlug} /> */}
      </div>
      {/* Main - 70% */}
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  );
}
