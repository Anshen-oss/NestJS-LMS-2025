'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Clock, Play, PlayCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface VideoProgressCardProps {
  progress: any;
}

export function VideoProgressCard({ progress }: VideoProgressCardProps) {
  const lesson = progress.lesson;
  const course = lesson?.chapter?.course;

  if (!lesson || !course) {
    return null;
  }

  // Formater le temps écoulé depuis la dernière vue
  const lastWatchedText = progress.lastWatchedAt
    ? formatDistanceToNow(new Date(progress.lastWatchedAt), {
        addSuffix: true,
        locale: fr,
      })
    : null;

  // Formater la durée restante
  const remainingPercent = 100 - progress.progressPercent;
  const remainingTime = lesson.duration
    ? Math.ceil((lesson.duration * remainingPercent) / 100 / 60)
    : null;

  return (
    <Card className="group hover:shadow-xl transition-all border-0 shadow-md overflow-hidden bg-white">
      <div className="relative aspect-video">
        <Image
          src={course.imageUrl || '/placeholder-course.jpg'}
          alt={course.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Overlay avec progression */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-white/90 backdrop-blur-sm rounded-full p-4">
            <PlayCircle className="h-12 w-12 text-blue-600" />
          </div>
        </div>

        {/* Badge durée restante */}
        {remainingTime && (
          <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 font-medium">
            <Clock className="h-3 w-3" />
            <span>{remainingTime} min</span>
          </div>
        )}

        {/* Progress overlay en bas */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <div className="flex items-center justify-between text-white text-sm mb-2">
            <span className="font-medium">{Math.round(progress.progressPercent)}% complété</span>
          </div>
          <div className="w-full bg-white/30 rounded-full h-2">
            <div
              className="bg-white rounded-full h-2 transition-all"
              style={{ width: `${progress.progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      <CardContent className="p-6">
        <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-2">
          {course.title}
        </p>
        <h3 className="font-bold text-lg mb-3 line-clamp-2 text-gray-900">
          {lesson.title}
        </h3>

        {lastWatchedText && (
          <p className="text-xs text-gray-500 mb-4 italic">
            Dernière vue {lastWatchedText}
          </p>
        )}

        <Button
          asChild
          className="w-full group-hover:bg-blue-700 transition-colors"
        >
          <Link href={`/student/courses/${course.id}/lessons/${lesson.id}`}>
            <Play className="w-4 h-4 mr-2" />
            Reprendre
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
