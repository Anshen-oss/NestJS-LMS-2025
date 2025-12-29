"use client";

import { Progress } from "@/components/ui/progress";
import { useVideoProgress } from "@/hooks/useVideoProgress";
import { useVideoProgressYouTube } from "@/hooks/useVideoProgressYouTube";
import { cn } from "@/lib/utils";
import { getVideoInfo } from "@/lib/utils/video-utils";
import { CheckCircle2, PlayCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { YouTubePlayer } from "./Youtubeplayer";

interface VideoPlayerProps {
  lessonId: string;
  videoUrl?: string | null;
  externalVideoUrl?: string | null;
  title?: string;
  onComplete?: () => void;
  className?: string;
}

export function VideoPlayer({
  lessonId,
  videoUrl,
  externalVideoUrl,
  title,
  onComplete,
  className = "",
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [localProgress, setLocalProgress] = useState(0);
  const [youtubePlayer, setYoutubePlayer] = useState<any>(null);

  const sourceUrl = externalVideoUrl || videoUrl;
  const videoInfo = sourceUrl ? getVideoInfo(sourceUrl) : null;
  const isYouTube = videoInfo?.source === 'youtube';

  const { progress: uploadedProgress, loading: uploadedLoading } = useVideoProgress({
    lessonId,
    videoRef,
    autoSaveInterval: 5000,
    onComplete,
  });

  const {
    progress: youtubeProgress,
    loading: youtubeLoading,
    localProgress: youtubeLocalProgress,
    handleTimeUpdate: handleYouTubeTimeUpdate,
  } = useVideoProgressYouTube({
    lessonId,
    autoSaveInterval: 5000,
    onComplete,
  });

  const progress = isYouTube ? youtubeProgress : uploadedProgress;
  const loading = isYouTube ? youtubeLoading : uploadedLoading;

  useEffect(() => {
    const video = videoRef.current;
    if (!video || isYouTube) return;

    const updateProgress = () => {
      if (video.duration > 0) {
        const percent = (video.currentTime / video.duration) * 100;
        setLocalProgress(percent);
      }
    };

    video.addEventListener('timeupdate', updateProgress);
    return () => video.removeEventListener('timeupdate', updateProgress);
  }, [isYouTube]);

  // 🔄 Reprendre YouTube quand player ET progress sont prêts
  const handleYouTubeReady = (player: any) => {
    console.log('✅ YouTube Player ready');
    setYoutubePlayer(player);
  };

  useEffect(() => {
    if (!youtubePlayer || !youtubeProgress || !isYouTube) return;

    console.log('🎬 YouTube Progress loaded:', youtubeProgress);

    if (!youtubeProgress.isCompleted && youtubeProgress.currentTime > 0) {
      youtubePlayer.seekTo(youtubeProgress.currentTime, true);
      console.log('▶️ YouTube resuming from:', youtubeProgress.currentTime);
    }
  }, [youtubePlayer, youtubeProgress, isYouTube]);

  // 1️⃣ Pas de vidéo
  if (!sourceUrl) {
    return (
      <div className={cn("aspect-video bg-gray-900 flex items-center justify-center", className)}>
        <div className="text-center z-10">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
            <PlayCircle className="w-12 h-12 text-white" />
          </div>
          <p className="text-xl font-semibold text-white">Vidéo à venir</p>
        </div>
      </div>
    );
  }

  // 2️⃣ YouTube
  if (isYouTube && videoInfo?.videoId) {
    return (
      <div className="space-y-4">
        <YouTubePlayer
          videoId={videoInfo.videoId}
          onReady={handleYouTubeReady}
          onTimeUpdate={handleYouTubeTimeUpdate}
          className={cn("rounded-lg overflow-hidden", className)}
        />
        <ProgressIndicator
          progress={progress}
          localProgress={youtubeLocalProgress}
          loading={loading}
        />
      </div>
    );
  }

  // 3️⃣ Vidéo uploadée (S3) - AVANT Vimeo
  if (videoInfo?.source === 'direct' || videoUrl) {
    return (
      <div className="space-y-4">
        <div className={cn("aspect-video bg-gray-900 rounded-lg overflow-hidden", className)}>
          <video
            ref={videoRef}
            controls
            className="w-full h-full"
            controlsList="nodownload"
            preload="metadata"
          >
            <source src={sourceUrl} type="video/mp4" />
            <source src={sourceUrl} type="video/webm" />
            Votre navigateur ne supporte pas la lecture de vidéos.
          </video>
        </div>
        <ProgressIndicator
          progress={progress}
          localProgress={localProgress}
          loading={loading}
        />
      </div>
    );
  }

  // 4️⃣ Vimeo, Dailymotion (APRÈS vidéos uploadées)
  if (videoInfo?.embedUrl) {
    return (
      <div className="space-y-4">
        <div className={cn("aspect-video bg-gray-900 rounded-lg overflow-hidden", className)}>
          <iframe
            src={videoInfo.embedUrl}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={title || "Video player"}
          />
        </div>
        <div className="text-sm text-muted-foreground italic">
          ⚠️ Le suivi de progression n'est pas disponible pour ce type de vidéo
        </div>
      </div>
    );
  }

  // 5️⃣ URL non reconnue
  return (
    <div className={cn("aspect-video bg-gray-900 flex items-center justify-center", className)}>
      <div className="text-center text-white p-8">
        <PlayCircle className="w-16 h-16 mx-auto mb-4 text-red-400" />
        <p className="text-lg font-semibold mb-2">Format vidéo non supporté</p>
        <p className="text-sm text-gray-400 break-all max-w-md">{sourceUrl}</p>
      </div>
    </div>
  );
}

// ... ProgressIndicator reste identique
// 📊 Composant indicateur de progression
interface ProgressIndicatorProps {
  progress: any;
  localProgress: number;
  loading?: boolean;
}

function ProgressIndicator({ progress, localProgress, loading }: ProgressIndicatorProps) {
  const displayProgress = progress?.progressPercent || localProgress;
  const isCompleted = progress?.isCompleted || localProgress >= 90;

  if (loading) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Chargement de la progression...</span>
        </div>
        <Progress value={0} className="h-2" />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          Progression : {Math.round(displayProgress)}%
        </span>
        {isCompleted && (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle2 className="h-4 w-4" />
            <span className="font-medium">Terminé</span>
          </div>
        )}
      </div>
      <Progress
        value={displayProgress}
        className={cn(
          'h-2',
          isCompleted && 'bg-green-100'
        )}
      />
      {progress?.lastWatchedAt && (
        <p className="text-xs text-muted-foreground">
          Dernière vue : {new Date(progress.lastWatchedAt).toLocaleString('fr-FR')}
        </p>
      )}
    </div>
  );
}
