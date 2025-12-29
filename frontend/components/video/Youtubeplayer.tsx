'use client';

import { useEffect, useRef, useState } from 'react';

// Déclaration TypeScript pour l'API YouTube
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface YouTubePlayerProps {
  videoId: string;
  onReady?: (player: any) => void;
  onStateChange?: (event: any) => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  className?: string;
}

export function YouTubePlayer({
  videoId,
  onReady,
  onStateChange,
  onTimeUpdate,
  className = '',
}: YouTubePlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isAPIReady, setIsAPIReady] = useState(false);

  // 1️⃣ Charger l'API YouTube
  useEffect(() => {
    // Si l'API est déjà chargée
    if (window.YT && window.YT.Player) {
      setIsAPIReady(true);
      return;
    }

    // Sinon, charger le script
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    // Callback globale quand l'API est prête
    window.onYouTubeIframeAPIReady = () => {
      setIsAPIReady(true);
    };
  }, []);

  // 2️⃣ Créer le player YouTube quand l'API est prête
  useEffect(() => {
    if (!isAPIReady || !containerRef.current || playerRef.current) {
      return;
    }

    playerRef.current = new window.YT.Player(containerRef.current, {
      videoId,
      playerVars: {
        autoplay: 0,
        controls: 1,
        modestbranding: 1,
        rel: 0,
      },
      events: {
        onReady: (event: any) => {
          console.log('✅ YouTube Player ready');
          if (onReady) {
            onReady(event.target);
          }
        },
        onStateChange: (event: any) => {
          handleStateChange(event);
          if (onStateChange) {
            onStateChange(event);
          }
        },
      },
    });

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [isAPIReady, videoId]);

  // 3️⃣ Gérer les changements d'état (play, pause, etc.)
  const handleStateChange = (event: any) => {
    const YT = window.YT;

    if (event.data === YT.PlayerState.PLAYING) {
      // Vidéo en lecture → Démarrer le tracking
      startTracking();
    } else if (
      event.data === YT.PlayerState.PAUSED ||
      event.data === YT.PlayerState.ENDED
    ) {
      // Vidéo en pause ou terminée → Arrêter le tracking
      stopTracking();
      // Envoyer une dernière mise à jour
      if (onTimeUpdate && playerRef.current) {
        const currentTime = playerRef.current.getCurrentTime();
        const duration = playerRef.current.getDuration();
        onTimeUpdate(currentTime, duration);
      }
    }
  };

  // 4️⃣ Tracking temps réel (toutes les secondes)
  const startTracking = () => {
    if (intervalRef.current) return; // Déjà démarré

    intervalRef.current = setInterval(() => {
      if (playerRef.current && onTimeUpdate) {
        try {
          const currentTime = playerRef.current.getCurrentTime();
          const duration = playerRef.current.getDuration();

          if (currentTime && duration) {
            onTimeUpdate(currentTime, duration);
          }
        } catch (error) {
          console.error('Error getting YouTube player time:', error);
        }
      }
    }, 5000); // Mise à jour chaque seconde
  };

  const stopTracking = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // 5️⃣ Cleanup
  useEffect(() => {
    return () => {
      stopTracking();
    };
  }, []);

  return (
    <div className={`aspect-video bg-black ${className}`}>
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
}
