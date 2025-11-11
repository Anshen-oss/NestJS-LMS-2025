/* eslint-disable @typescript-eslint/no-explicit-any */
"use client ";
import { EnrolledCourseType } from "@/app/data/user/get-enrolled-courses";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useConstructUrl } from "@/hooks/use-construct-url";
import Image from "next/image";
import Link from "next/link";
import { useCourseProgress } from "../../../hooks/use-course-progress";
import { Progress } from "@/components/ui/progress";

interface iAppProps {
  data: EnrolledCourseType;
}
export function CourseProgressCard({ data }: iAppProps) {
  const thumbnailUrl = useConstructUrl(data.Course.fileKey);
  const { totalLessons, completedLessons, progressPercentage } =
    useCourseProgress({ courseData: data.Course as any });
  return (
    <Card className="group relative py-0 gap-0">
      {/* Badge avec le niveau du cours */}
      <Badge className="absolute top-2 right-2 z-10">{data.Course.level}</Badge>

      <Image
        src={thumbnailUrl}
        alt="Thumbnail Image of Course"
        className="w-full h-full object-cover rounded-t-xl aspect-video"
        width={600}
        height={400}
      />
      <CardContent className="p-4">
        <Link
          className="font-medium text-lg line-clamp-2 hover:underline group-hover:text-primary transition-colors"
          href={`/dashboard/${data.Course.slug}`}
        >
          {data.Course.title}
        </Link>
        <p className="line-clamp-2 text-sm text-muted-foreground leading-tight mt-2">
          {data.Course.smallDescription}
        </p>

        <div className="space-y-4 mt-5">
          <div className="flex justify-between mb-1 text-sm">
            <p>Progress:</p>
            <p className="font-medium">{progressPercentage}%</p>
          </div>
          <Progress value={progressPercentage} className="h-1.5" />

          <p className="text-xs text-muted-foreground mt-1">
            {completedLessons} of {totalLessons} lessons completed
          </p>
        </div>

        <Link
          className={buttonVariants({ className: "mt-4 w-full" })}
          href={`/dashboard/${data.Course.slug}`}
        >
          Learn More
        </Link>
      </CardContent>
    </Card>
  );
}

export function PublicCourseCardSkeleton() {
  return (
    <Card
      className="group relative py-0 gap-0"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="absolute top-2 right-2 z-10 flex items-center">
        <Skeleton className="w-20 h-6 rounded-full" />
      </div>

      <div className="w-full relative h-fit">
        <Skeleton className="w-full rounded-t-xl aspect-video" />
      </div>

      <CardContent className="p-4">
        {/* Titre (2 lignes épaisses) */}
        <div className="space-y-2">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-3/4" />
        </div>

        {/* Description (2 lignes fines) */}
        <div className="space-y-2 mt-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        {/* Infos (durée + catégorie) */}
        <div className="mt-4 flex items-center gap-x-5">
          <div className="flex items-center gap-x-2">
            <Skeleton className="size-6 rounded-md" />
            <Skeleton className="h-4 w-8" />
          </div>
          <div className="flex items-center gap-x-2">
            <Skeleton className="size-6 rounded-md" />
            <Skeleton className="h-4 w-12" />
          </div>
        </div>

        {/* Bouton */}
        <Skeleton className="mt-4 w-full h-10 rounded-md" />
      </CardContent>
    </Card>
  );
}
