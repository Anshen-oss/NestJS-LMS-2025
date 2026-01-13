// lib/hooks/useTheme.ts
'use client';

import { useTheme as useNextTheme } from 'next-themes';
import { useEffect, useState } from 'react';

/**
 * Hook personnalisé pour gérer le thème avec next-themes
 * Synchronise le thème avec les préférences utilisateur
 */
export function useThemeManager() {
  const { theme, setTheme, systemTheme, resolvedTheme } = useNextTheme();
  const [mounted, setMounted] = useState(false);

  // Éviter les hydration mismatches
  useEffect(() => {
    setMounted(true);
  }, []);

  /**
   * Changer le thème et l'appliquer immédiatement
   * @param newTheme 'light' | 'dark' | 'auto'
   */
  const changeTheme = (newTheme: 'light' | 'dark' | 'auto') => {
    if (newTheme === 'auto') {
      // 'system' = auto dans next-themes
      setTheme('system');
    } else {
      // 'light' ou 'dark'
      setTheme(newTheme);
    }
  };

  // Déterminer le thème actif (pour l'affichage)
  const displayTheme = mounted
    ? theme === 'system'
      ? 'auto'
      : theme
    : 'light';

  // Le thème réel appliqué au DOM
  const activeTheme = mounted ? resolvedTheme : 'light';

  return {
    /** Thème stocké dans les préférences (light, dark, auto) */
    theme: displayTheme,
    /** Thème réellement appliqué au DOM (light ou dark) */
    activeTheme,
    /** Fonction pour changer le thème */
    changeTheme,
    /** Si le composant est monté (pour éviter hydration errors) */
    mounted,
  };
}
