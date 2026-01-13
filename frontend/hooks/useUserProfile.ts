'use client';

import {
  useGetCurrentUserQuery,
  useUpdateUserPreferencesMutation,
  useUpdateUserProfileMutation
} from '@/lib/generated/graphql';
import { useCallback } from 'react';
import { toast } from 'sonner';
import { useThemeManager } from './useTheme'; // ← AJOUTER CETTE IMPORT

// ========================================
// HOOK 1️⃣ : useGetCurrentUser (Query)
// ========================================
export function useGetCurrentUser() {
  const { data, loading, error, refetch } = useGetCurrentUserQuery({
    fetchPolicy: 'cache-and-network',
  });

  return {
    user: data?.getCurrentUser,
    loading,
    error: error?.message,
    refetch,
  };
}

// ========================================
// HOOK 2️⃣ : useUpdateUserProfile (Mutation)
// ========================================
export function useUpdateUserProfile() {
  const [mutate, { loading, error }] = useUpdateUserProfileMutation({
    onCompleted: (data) => {
      if (data?.updateUserProfile) {
        toast.success('✅ Profil mis à jour avec succès !');
      }
    },
    onError: (err) => {
      console.error('❌ Erreur lors de la mise à jour du profil :', err);
      toast.error(`❌ Erreur : ${err.message}`);
    },
  });

  const updateProfile = useCallback(
    async (input: {
      bio?: string;
      profession?: string;
      dateOfBirth?: string;
    }) => {
      // Validation côté client
      if (input.bio && input.bio.length > 500) {
        toast.error('❌ La bio ne peut pas dépasser 500 caractères');
        return null;
      }

      if (input.profession && input.profession.length > 100) {
        toast.error('❌ La profession ne peut pas dépasser 100 caractères');
        return null;
      }

      try {
        const result = await mutate({
          variables: { input },
        });

        return result.data?.updateUserProfile || null;
      } catch (err) {
        console.error('Error updating profile:', err);
        return null;
      }
    },
    [mutate],
  );

  return {
    updateProfile,
    loading,
    error: error?.message,
  };
}

// ========================================
// HOOK 3️⃣ : useUpdateUserPreferences (Mutation)
// ========================================
export function useUpdateUserPreferences() {
  const [mutate, { loading, error }] = useUpdateUserPreferencesMutation({
    onCompleted: (data) => {
      if (data?.updateUserPreferences) {
        toast.success('✅ Préférences sauvegardées !');
      }
    },
    onError: (err) => {
      console.error('❌ Erreur lors de la mise à jour des préférences :', err);
      toast.error(`❌ Erreur : ${err.message}`);
    },
  });

  const updatePreferences = useCallback(
    async (input: {
      emailNotifications?: boolean;
      courseUpdates?: boolean;
      weeklyDigest?: boolean;
      marketingEmails?: boolean;
      videoQuality?: string;
      autoplay?: boolean;
      subtitles?: boolean;
      language?: string;
      timezone?: string;
      theme?: string;
    }) => {
      // Validation côté client
      if (input.videoQuality) {
        const validQualities = ['auto', '1080p', '720p', '480p', '360p'];
        if (!validQualities.includes(input.videoQuality)) {
          toast.error('❌ Qualité vidéo invalide');
          return null;
        }
      }

      if (input.theme) {
        const validThemes = ['light', 'dark', 'auto'];
        if (!validThemes.includes(input.theme)) {
          toast.error('❌ Thème invalide');
          return null;
        }
      }

      try {
        const result = await mutate({
          variables: { input },
        });

        return result.data?.updateUserPreferences || null;
      } catch (err) {
        console.error('Error updating preferences:', err);
        return null;
      }
    },
    [mutate],
  );

  return {
    updatePreferences,
    loading,
    error: error?.message,
  };
}

// ========================================
// HOOK COMBINÉ : useUserSettings
// ========================================
// Combine tout pour la page Settings
// VERSION MISE À JOUR AVEC GESTION DU THÈME
export function useUserSettings() {
  const { user, loading: loadingUser, refetch } = useGetCurrentUser();
  const { updateProfile, loading: loadingProfile, error: profileError } = useUpdateUserProfile();
  const { updatePreferences: updatePreferencesBase, loading: loadingPrefs, error: prefsError } = useUpdateUserPreferences();
  const { changeTheme } = useThemeManager(); // ← AJOUTER

  // ✅ NOUVELLE FONCTION : Mettre à jour les préférences + appliquer le thème
  const updatePreferences = useCallback(
    async (prefs: any) => {
      // 1️⃣ Si le thème change, l'appliquer IMMÉDIATEMENT
      if (prefs.theme) {
        changeTheme(prefs.theme as 'light' | 'dark' | 'auto');
      }

      // 2️⃣ Sauvegarder en BD
      const result = await updatePreferencesBase(prefs);

      return result;
    },
    [updatePreferencesBase, changeTheme],
  );

  return {
    user,
    updateProfile,
    updatePreferences, // ← Utiliser la nouvelle fonction avec thème
    loading: loadingUser || loadingProfile || loadingPrefs,
    errors: {
      profile: profileError,
      preferences: prefsError,
    },
    refetch,
  };
}
