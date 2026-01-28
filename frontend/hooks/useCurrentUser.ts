'use client';

import { useGetCurrentUserQuery } from '@/lib/generated/graphql';
import { useAuth } from '@clerk/nextjs';
import { useCallback, useEffect } from 'react';

export function useCurrentUser() {
  const { isLoaded: clerkIsLoaded } = useAuth();
  console.log('🎣 useCurrentUser - clerkIsLoaded:', clerkIsLoaded);

  console.log('🎣 useCurrentUser hook called, clerkIsLoaded:', clerkIsLoaded);

  const result = useGetCurrentUserQuery({
    fetchPolicy: 'cache-and-network',
  });

  console.log('✅ useGetCurrentUserQuery result:', {
    loading: result.loading,
    data: result.data ? 'HAS_DATA' : 'NO_DATA',
    error: result.error ? 'HAS_ERROR' : 'NO_ERROR',
  });

  // ✅ Refetch la query une fois que Clerk est loaded
  useEffect(() => {
    if (clerkIsLoaded && result.loading) {
      console.log('🔄 Clerk loaded! Refetching query...');
      result.refetch();
    }
  }, [clerkIsLoaded, result]);

  const { data, loading, error, refetch } = result;

  const enhancedRefetch = useCallback(async () => {
    console.log('🔄 Refetching current user from network...');
    const refetchResult = await refetch();
    console.log('✅ User refetch completed:', refetchResult.data?.getCurrentUser);
    return refetchResult;
  }, [refetch]);

  return {
    user: data?.getCurrentUser,
    loading,
    error: error?.message,
    refetch: enhancedRefetch,
  };
}
