// 🔄 Sera généré par codegen
import { useGetVideoProgressQuery, useSaveVideoProgressMutation } from '@/lib/generated/graphql';
import { useCallback, useEffect, useRef } from 'react';

interface UseVideoProgressProps {
  lessonId: string;
  videoRef: React.RefObject<HTMLVideoElement>;
  autoSaveInterval?: number; // en millisecondes (défaut: 5000ms = 5s)
  onComplete?: () => void; // Callback quand vidéo complétée à 90%
}

export function useVideoProgress({
  lessonId,
  videoRef,
  autoSaveInterval = 5000,
  onComplete,
}: UseVideoProgressProps) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedTimeRef = useRef<number>(0);

  // 📊 Charger la progression existante
  const { data, loading, refetch } = useGetVideoProgressQuery({
    variables: { lessonId },
    skip: !lessonId,
  });

  // 💾 Mutation pour sauvegarder
  const [saveProgressMutation] = useSaveVideoProgressMutation();

  // 💾 Fonction de sauvegarde
  const handleSaveProgress = useCallback(async () => {
    const video = videoRef.current;
    if (!video || !lessonId) return;

    const currentTime = video.currentTime;
    const duration = video.duration || 0;

    // Éviter de sauvegarder si pas de changement significatif (> 1 seconde)
    if (Math.abs(currentTime - lastSavedTimeRef.current) < 1) {
      return;
    }

    try {
      const result = await saveProgressMutation({
        variables: {
          input: {
            lessonId,
            currentTime,
            duration,
          },
        },
      });

      lastSavedTimeRef.current = currentTime;

      // 🎉 Si vidéo vient d'être complétée
      const progress = result.data?.saveVideoProgress;
      if (progress?.isCompleted && onComplete) {
        onComplete();
      }

      console.log('✅ Progress saved:', currentTime, '/', duration);
    } catch (error) {
      console.error('❌ Error saving video progress:', error);
    }
  }, [lessonId, saveProgressMutation, videoRef, onComplete]);

  // 🔄 Reprendre là où on s'est arrêté
  useEffect(() => {
    const video = videoRef.current;
    const progress = data?.getVideoProgress;

    if (video && progress && !progress.isCompleted && progress.currentTime > 0) {
      // Reprendre à la dernière position
      video.currentTime = progress.currentTime;
      console.log('▶️ Resuming from:', progress.currentTime);
    }
  }, [data, videoRef]);

  // ⏱️ Auto-save toutes les X secondes
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const startAutoSave = () => {
      if (intervalRef.current) return; // Déjà démarré

      intervalRef.current = setInterval(() => {
        handleSaveProgress();
      }, autoSaveInterval);

      console.log('🔄 Auto-save started (every', autoSaveInterval / 1000, 'seconds)');
    };

    const stopAutoSave = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        console.log('⏸️ Auto-save stopped');
      }
    };

    // Événements
    const handlePlay = () => startAutoSave();
    const handlePause = () => {
      stopAutoSave();
      handleSaveProgress(); // Sauvegarder immédiatement en pause
    };
    const handleEnded = () => {
      stopAutoSave();
      handleSaveProgress(); // Sauvegarder à la fin
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);

    // Cleanup
    return () => {
      stopAutoSave();
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
    };
  }, [videoRef, handleSaveProgress, autoSaveInterval]);

  // 💾 Sauvegarder avant de quitter la page
  useEffect(() => {
    const handleBeforeUnload = () => {
      handleSaveProgress();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [handleSaveProgress]);

  return {
    progress: data?.getVideoProgress,
    loading,
    saveProgress: handleSaveProgress,
    refetch,
  };
}
