import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, School, TimerIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface PublicCourseType {
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

interface iAppProps {
  data: PublicCourseType;
  isEnrolled?: boolean;
}

export function PublicCourseCard({ data, isEnrolled = false }: iAppProps) {
  const thumbnailUrl = data.imageUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop';

  return (
    <Card className="group relative py-0 gap-0">
      <Badge className="absolute top-2 right-2 z-10">{data.level}</Badge>

      {/* Badge "Inscrit" */}
      {isEnrolled && (
        <Badge className="absolute top-2 left-2 z-10 bg-green-600 hover:bg-green-700 flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" />
          Inscrit
        </Badge>
      )}

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
          href={`/courses/${data.slug}`}
        >
          {data.title}
        </Link>
        <p className="line-clamp-2 text-sm text-muted-foreground leading-tight mt-2">
          {data.smallDescription}
        </p>
        <div className="flex mt-4 items-center gap-x-5">
          <div className="flex items-center gap-x-2">
            <TimerIcon className="size-6 p-1 rounded-md text-primary bg-primary/10" />
            <p className="text-sm text-muted-foreground">{data.duration}h</p>
          </div>
          <div className="flex items-center gap-x-2">
            <School className="size-6 p-1 rounded-md text-primary bg-primary/10" />
            <p className="text-sm text-muted-foreground">{data.category}</p>
          </div>
        </div>

        {/* Bouton avec style inline pour forcer les couleurs */}
        {isEnrolled ? (
          <Button
            asChild
            className="mt-4 w-full"
            style={{ backgroundColor: '#16a34a', color: 'white' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#15803d'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#16a34a'}
          >
            <Link href={`/student/courses/${data.id}`}>
              Commencer le cours
            </Link>
          </Button>
        ) : (
          <Button asChild className="mt-4 w-full">
            <Link href={`/courses/${data.slug}`}>
              Learn More
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export function PublicCourseCardSkeleton() {
  return (
    <Card className="group relative py-0 gap-0" role="status" aria-live="polite" aria-busy="true">
      <div className="absolute top-2 right-2 z-10 flex items-center">
        <Skeleton className="w-20 h-6 rounded-full" />
      </div>
      <div className="w-full relative h-fit">
        <Skeleton className="w-full rounded-t-xl aspect-video" />
      </div>
      <CardContent className="p-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-3/4" />
        </div>
        <div className="space-y-2 mt-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
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
        <Skeleton className="mt-4 w-full h-10 rounded-md" />
      </CardContent>
    </Card>
  );
}
