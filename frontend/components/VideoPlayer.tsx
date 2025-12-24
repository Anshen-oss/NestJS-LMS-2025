"use client";

import { getVideoInfo } from "@/lib/utils/video-utils";
import { PlayCircle } from "lucide-react";

interface VideoPlayerProps {
  videoUrl?: string | null;
  externalVideoUrl?: string | null;
  className?: string;
}

export function VideoPlayer({
  videoUrl,
  externalVideoUrl,
  className = "",
}: VideoPlayerProps) {
  // Priorité : externalVideoUrl > videoUrl
  const sourceUrl = externalVideoUrl || videoUrl;

  if (!sourceUrl) {
    // Pas de vidéo
    return (
      <div className={`aspect-video bg-gray-900 flex items-center justify-center ${className}`}>
        <div className="text-center z-10">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
            <PlayCircle className="w-12 h-12 text-white" />
          </div>
          <p className="text-xl font-semibold text-white">Vidéo à venir</p>
        </div>
      </div>
    );
  }

  const videoInfo = getVideoInfo(sourceUrl);

  // Vidéo uploadée (S3) ou URL directe
  if (videoInfo.source === 'direct' || !externalVideoUrl) {
    return (
      <div className={`aspect-video bg-gray-900 ${className}`}>
        <video controls className="w-full h-full">
          <source src={sourceUrl} type="video/mp4" />
          <source src={sourceUrl} type="video/webm" />
          Votre navigateur ne supporte pas la lecture de vidéos.
        </video>
      </div>
    );
  }

  // YouTube, Vimeo, Dailymotion
  if (videoInfo.embedUrl) {
    return (
      <div className={`aspect-video bg-gray-900 ${className}`}>
        <iframe
          src={videoInfo.embedUrl}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Video player"
        />
      </div>
    );
  }

  // URL non reconnue
  return (
    <div className={`aspect-video bg-gray-900 flex items-center justify-center ${className}`}>
      <div className="text-center text-white p-8">
        <PlayCircle className="w-16 h-16 mx-auto mb-4 text-red-400" />
        <p className="text-lg font-semibold mb-2">Format vidéo non supporté</p>
        <p className="text-sm text-gray-400 break-all max-w-md">{sourceUrl}</p>
      </div>
    </div>
  );
}
