// hooks/useCurrentUser.ts
// ✅ Hook UNIQUE pour récupérer le user synchronisé partout

'use client';

import { useGetCurrentUserQuery } from '@/lib/generated/graphql';
import { useCallback } from 'react';

/**
 * Hook unique pour récupérer le user actuel
 *
 * ✅ Utilisé PARTOUT dans l'app (Navbar, StudentLayout, Settings, etc)
 * ✅ Apollo cache synchronisé automatiquement
 * ✅ Quand tu appelles refetch(), tous les composants reçoivent les nouvelles données
 *
 * Usage:
 * ```tsx
 * const { user, loading, refetch } = useCurrentUser();
 *
 * // Afficher l'avatar
 * <Avatar src={user?.image} name={user?.name} />
 *
 * // Mettre à jour
 * await refetch();
 * ```
 */
export function useCurrentUser() {
  const { data, loading, error, refetch } = useGetCurrentUserQuery({
    fetchPolicy: 'cache-and-network',  // ✅ Important!
  });

  const enhancedRefetch = useCallback(async () => {
    console.log('🔄 Refetching current user from network...');
    const result = await refetch();
    console.log('✅ User refetch completed:', result.data?.getCurrentUser);
    return result;
  }, [refetch]);

  return {
    user: data?.getCurrentUser,
    loading,
    error: error?.message,
    refetch: enhancedRefetch,
  };
}
