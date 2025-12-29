import {
  useGetVideoProgressQuery,
  useSaveVideoProgressMutation
} from '@/lib/generated/graphql';
import { useCallback, useEffect, useRef, useState } from 'react';

interface UseVideoProgressYouTubeProps {
  lessonId: string;
  autoSaveInterval?: number; // en millisecondes (défaut: 5000ms = 5s)
  onComplete?: () => void;
}

export function useVideoProgressYouTube({
  lessonId,
  autoSaveInterval = 5000,
  onComplete,
}: UseVideoProgressYouTubeProps) {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [localProgress, setLocalProgress] = useState(0);
  const lastSavedTimeRef = useRef<number>(0);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 📊 Charger la progression existante
  const { data, loading, refetch } = useGetVideoProgressQuery({
    variables: { lessonId },
    skip: !lessonId,
  });

  // 💾 Mutation pour sauvegarder
  const [saveProgressMutation] = useSaveVideoProgressMutation();

  // 💾 Fonction de sauvegarde
  const handleSaveProgress = useCallback(async (time: number, dur: number) => {
    if (!lessonId || dur === 0) return;

    // Éviter de sauvegarder si pas de changement significatif (> 2 secondes)
    if (Math.abs(time - lastSavedTimeRef.current) < 2) {
      return;
    }

    try {
      const result = await saveProgressMutation({
        variables: {
          input: {
            lessonId,
            currentTime: time,
            duration: dur,
          },
        },
      });

      lastSavedTimeRef.current = time;

      // 🎉 Si vidéo vient d'être complétée
      const progress = result.data?.saveVideoProgress;
      if (progress?.isCompleted && onComplete) {
        onComplete();
      }

      console.log('✅ YouTube Progress saved:', time, '/', dur);
    } catch (error) {
      console.error('❌ Error saving YouTube progress:', error);
    }
  }, [lessonId, saveProgressMutation, onComplete]);

  // 🔄 Callback pour les mises à jour de temps
  const handleTimeUpdate = useCallback((time: number, dur: number) => {
    setCurrentTime(time);
    setDuration(dur);

    // Calculer la progression locale
    if (dur > 0) {
      const percent = (time / dur) * 100;
      setLocalProgress(percent);
    }

    // Debounce : sauvegarder après X secondes d'inactivité
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      handleSaveProgress(time, dur);
    }, autoSaveInterval);
  }, [handleSaveProgress, autoSaveInterval]);

  // 🧹 Cleanup
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  // 💾 Sauvegarder avant de quitter la page
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (currentTime > 0 && duration > 0) {
        // Utiliser sendBeacon pour sauvegarder de manière fiable
        handleSaveProgress(currentTime, duration);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [currentTime, duration, handleSaveProgress]);

  return {
    progress: data?.getVideoProgress,
    loading,
    localProgress,
    currentTime,
    duration,
    handleTimeUpdate,
    saveProgress: () => handleSaveProgress(currentTime, duration),
    refetch,
  };
}
