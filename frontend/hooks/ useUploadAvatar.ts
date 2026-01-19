// src/hooks/useUploadAvatar.ts

'use client';

import { useToast } from '@/components/ui/use-toast';
import {
  UPDATE_USER_AVATAR,
  UPLOAD_USER_AVATAR,
} from '@/graphql/mutations/avatarMutations';
// À adapter selon ta config
import { useMutation } from '@apollo/client';
import { useState } from 'react';

interface UseUploadAvatarReturn {
  /**
   * Fonction pour uploader un avatar
   * Gère les deux mutations en séquence
   * @param file - Fichier à uploader
   * @returns URL de l'avatar uploadé
   * @throws Error si l'upload échoue
   */
  upload: (file: File) => Promise<string>;

  /**
   * État de loading pendant l'upload
   */
  isLoading: boolean;

  /**
   * Message d'erreur si l'upload échoue
   */
  error: string | null;

  /**
   * Réinitialiser l'erreur
   */
  resetError: () => void;
}

/**
 * Hook personnalisé pour l'upload d'avatar
 *
 * Réutilise la logique d'upload en séquence des deux mutations
 * Utile si tu veux upload un avatar depuis plusieurs endroits
 *
 * @example
 * const { upload, isLoading, error } = useUploadAvatar();
 *
 * const handleUpload = async () => {
 *   try {
 *     const avatarUrl = await upload(selectedFile);
 *     console.log('Succès:', avatarUrl);
 *   } catch (err) {
 *     console.error('Erreur:', err);
 *   }
 * };
 */
export const useUploadAvatar = (): UseUploadAvatarReturn => {
  // ============================================
  // ÉTATS
  // ============================================

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ============================================
  // MUTATIONS APOLLO
  // ============================================

  const [uploadUserAvatar] = useMutation(UPLOAD_USER_AVATAR);
  const [updateUserAvatar] = useMutation(UPDATE_USER_AVATAR);

  const { toast } = useToast();

  // ============================================
  // LOGIQUE UPLOAD
  // ============================================

  /**
   * Fonction upload qui gère les deux mutations en séquence
   *
   * 1. uploadUserAvatar → Upload S3 + compression
   * 2. updateUserAvatar → Sauvegarde BD
   *
   * @param file - Fichier à uploader
   * @returns Nouvelle URL de l'avatar
   */
  const upload = async (file: File): Promise<string> => {
    setIsLoading(true);
    setError(null);

    try {
      // ─── ÉTAPE 1: Upload S3 ───
      const uploadResponse = await uploadUserAvatar({
        variables: { file },
      });

      if (!uploadResponse.data?.uploadUserAvatar?.success) {
        throw new Error(
          uploadResponse.data?.uploadUserAvatar?.message ||
            'L\'upload a échoué'
        );
      }

      const { avatarUrl, avatarKey } = uploadResponse.data.uploadUserAvatar;

      // ─── ÉTAPE 2: Sauvegarde BD ───
      const updateResponse = await updateUserAvatar({
        variables: { avatarUrl, avatarKey },
        refetchQueries: ['GetCurrentUser'],
      });

      if (!updateResponse.data?.updateUserAvatar?.success) {
        throw new Error(
          updateResponse.data?.updateUserAvatar?.message ||
            'La sauvegarde a échoué'
        );
      }

      // Succès
      toast({
        title: 'Avatar changé!',
        description: 'Votre photo de profil a été mise à jour.',
      });

      return avatarUrl;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(errorMessage);

      toast({
        title: 'Erreur',
        description: errorMessage,
        variant: 'destructive',
      });

      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================
  // RETOUR
  // ============================================

  return {
    upload,
    isLoading,
    error,
    resetError: () => setError(null),
  };
};
