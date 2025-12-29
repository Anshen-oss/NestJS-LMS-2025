'use client';

import { useGetUserVideoProgressQuery } from '@/lib/generated/graphql';
import { Loader2 } from 'lucide-react';
import { VideoProgressCard } from './VideoProgressCard';

export function ContinueWatching() {
  const { data, loading, error } = useGetUserVideoProgressQuery();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    console.error('🎬 Error:', error);
    return <div className="text-red-500">Erreur: {error.message}</div>;
  }

  const allVideos = data?.getUserVideoProgress || [];
  console.log('🎬 All videos:', allVideos);

  // Filtrer : uniquement les vidéos en cours (0% < progression < 100%)
  const inProgressVideos = allVideos.filter(
    (progress) => {
      console.log('🎬 Filtering:', {
        id: progress.id,
        percent: progress.progressPercent,
        completed: progress.isCompleted,
        passesFilter: progress.progressPercent > 0 && progress.progressPercent < 100 && !progress.isCompleted
      });
      return progress.progressPercent > 0 &&
             progress.progressPercent < 100 &&
             !progress.isCompleted;
    }
  );

  console.log('🎬 In progress videos:', inProgressVideos);
    if (inProgressVideos.length === 0) {
    console.log('🎬 No videos in progress - component hidden');
    return null;
  }

  // Si aucune vidéo en cours, ne rien afficher
  if (inProgressVideos.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Continuer à regarder 🎬
          </h2>
          <p className="text-gray-600 mt-1">
            {inProgressVideos.length} vidéo{inProgressVideos.length > 1 ? 's' : ''} en cours
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {inProgressVideos.map((progress) => (
          <VideoProgressCard
            key={progress.id}
            progress={progress}
          />
        ))}
      </div>
    </div>
  );
}
