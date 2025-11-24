'use client';

import { RenderDescription } from '@/components/rich-text-editor/RenderDescription';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { GET_COURSE_BY_SLUG } from '@/lib/graphql/courses';
import { useQuery } from '@apollo/client';
import { CollapsibleTrigger } from '@radix-ui/react-collapsible';
import {
  IconBook,
  IconCategory,
  IconChartBar,
  IconChevronDown,
  IconClock,
  IconPlayerPlay,
} from '@tabler/icons-react';
import { CheckIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { use } from 'react';
import { EnrollmentButton } from './_components/EnrollmentButton';

type Params = Promise<{ slug: string }>;

export default function CourseSlugPage({ params }: { params: Params }) {
  // ✅ Unwrap params (Next.js 15)
  const { slug } = use(params);

  // ✅ Query GraphQL pour le cours
  const { data, loading, error } = useQuery(GET_COURSE_BY_SLUG, {
    variables: { slug },
  });

  // ✅ TODO : Query pour vérifier enrollment (Phase 4.2)
  // const { data: enrollmentData } = useQuery(CHECK_ENROLLMENT, {
  //   variables: { courseId: data?.courseBySlug?.id },
  //   skip: !data?.courseBySlug?.id,
  // });
  // const isEnrolled = enrollmentData?.isEnrolled || false;

  // ✅ Pour l'instant, pas d'enrollment check
  const isEnrolled = false;

  if (loading) {
    return <CourseDetailSkeleton />;
  }

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

  const course = data?.courseBySlug;

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Cours introuvable</h2>
          <p className="text-muted-foreground">Ce cours n'existe pas ou a été supprimé.</p>
          <Link href="/courses" className={buttonVariants({ className: 'mt-4' })}>
            Retour aux cours
          </Link>
        </div>
      </div>
    );
  }

  // ✅ Utilise directement imageUrl
  const thumbnailUrl = course.imageUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=675&fit=crop';

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 mt-5">
      {/* Left Side */}
      <div className="order-1 lg:col-span-2">
        <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-lg">
          <Image
            src={thumbnailUrl}
            alt={course.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>

        <div className="mt-8 space-y-6">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">
              {course.title}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {course.smallDescription}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Badge className="flex items-center gap-1 px-3 py-1">
              <IconChartBar className="size-4" />
              <span>{course.level}</span>
            </Badge>

            <Badge className="flex items-center gap-1 px-3 py-1">
              <IconCategory className="size-4" />
              <span>{course.category}</span>
            </Badge>

            <Badge className="flex items-center gap-1 px-3 py-1">
              <IconClock className="size-4" />
              <span>{course.duration} hours</span>
            </Badge>
          </div>

          <Separator className="my-8" />
          {/* Description riche */}
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold tracking-tight">
              Course description
            </h2>
            {course.description && (
    <>
      {(() => {
        try {
          const jsonDescription = JSON.parse(course.description);
          return <RenderDescription json={jsonDescription} />;
        } catch (error) {
          return (
            <div className="prose prose-slate max-w-none">
              <p className="text-muted-foreground whitespace-pre-wrap">
                {course.description}
              </p>
            </div>
          );
        }
      })()}
    </>
  )}
          </div>
        </div>

        <div className="mt-12 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-semibold tracking-tight">
              Course Content
            </h2>
            <div className="">
              {course.chapters.length} chapters |{' '}
              {course.chapters.reduce(
                (total, chapter) => total + chapter.lessons.length,
                0
              ) || 0}{' '}
              Lessons
            </div>
          </div>

          <div className="space-y-4">
            {course.chapters.map((chapter, index) => (
              <Collapsible
                key={chapter.id}
                defaultOpen={index === 0}
              >
                <Card className="p-0 overflow-hidden border-2 transition-all duration-200 hover:shadow-md gap-0">
                  <CollapsibleTrigger>
                    <div className="">
                      <CardContent className="p-6 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <p className="flex size-10 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                              {index + 1}
                            </p>
                            <div>
                              <h3 className="text-xl font-semibold text-left">
                                {chapter.title}
                              </h3>
                              <p className="text-muted-foreground text-sm mt-1 text-left">
                                {chapter.lessons.length} lesson
                                {chapter.lessons.length !== 1 ? 's' : ''}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="text-xs">
                              {chapter.lessons.length} lesson
                              {chapter.lessons.length !== 1 ? 's' : ''}
                            </Badge>

                            <IconChevronDown className="size-5 text-muted-foreground" />
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="p-6 bg-muted/50">
                    <div className="border-t bg-muted/20">
                      <div className="p-6 pt-4 space-y-3">
                        {chapter.lessons.map((lesson, lessonIndex) => (
                          <div
                            className="flex items-center gap-4 rounded-lg p-3 hover:bg-accent transition-colors group"
                            key={lesson.id}
                          >
                            <div className="flex size-8 items-center justify-center rounded-full bg-background border-2 border-primary/20">
                              <IconPlayerPlay className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-sm">
                                {lesson.title}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Lesson {lessonIndex + 1}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            ))}
          </div>
        </div>
      </div>

      {/* Enrollment Card */}
      <div className="order-2 lg:col-span-1">
        <div className="sticky top-20">
          <Card className="py-0">
            <CardContent className="py-6">
              <div className="flex items-center justify-between mb-6">
                <span className="text-lg font-medium">Price:</span>
                <span className="text-2xl font-bold text-primary">
                  {new Intl.NumberFormat('fr-FR', {
                    style: 'currency',
                    currency: 'EUR',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(course.price)}
                </span>
              </div>

              <div className="mb-6 space-y-3 rounded-lg bg-muted p-4">
                <h4 className="font-medium">What you will get:</h4>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <IconClock className="size-4" />
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium mr-3">
                        Course duration
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {course.duration} hours
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <IconChartBar className="size-4" />
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium mr-3">Level</p>
                    <p className="text-sm text-muted-foreground">
                      {course.level}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <IconCategory className="size-4" />
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium mr-3">Category</p>
                    <p className="text-sm text-muted-foreground">
                      {course.category}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <IconBook className="size-4" />
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium mr-3">Total Lessons</p>
                    <p className="text-sm text-muted-foreground">
                      {course.chapters.reduce(
                        (total, chapter) => total + chapter.lessons.length,
                        0
                      ) || 0}{' '}
                      Lessons
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-6 space-y-6">
                <h4>This course includes:</h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <div className="rounded-full p-1 bg-green-500/10 text-green-500">
                      <CheckIcon className="size-3" />
                    </div>
                    <span>Full lifetime access</span>
                  </li>

                  <li className="flex items-center gap-2 text-sm">
                    <div className="rounded-full p-1 bg-green-500/10 text-green-500">
                      <CheckIcon className="size-3" />
                    </div>
                    <span>Access on mobile and desktop</span>
                  </li>

                  <li className="flex items-center gap-2 text-sm">
                    <div className="rounded-full p-1 bg-green-500/10 text-green-500">
                      <CheckIcon className="size-3" />
                    </div>
                    <span>Certificate of completion</span>
                  </li>
                </ul>
              </div>

              {isEnrolled ? (
                <Link
                  className={buttonVariants({ className: 'w-full' })}
                  href="/dashboard"
                >
                  Watch Course
                </Link>
              ) : (
                <EnrollmentButton courseId={course.id} />
              )}

              <p className="mt-3 text-center text-xs text-muted-foreground">
                30-day money-back guarantee
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ✅ Skeleton pour le loading
function CourseDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 mt-5">
      <div className="order-1 lg:col-span-2">
        <Skeleton className="w-full aspect-video rounded-xl" />
        <div className="mt-8 space-y-6">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-6 w-full" />
          <div className="flex gap-3">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
      </div>
      <div className="order-2 lg:col-span-1">
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    </div>
  );
}
