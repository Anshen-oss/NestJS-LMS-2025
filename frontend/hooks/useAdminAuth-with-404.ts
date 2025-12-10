'use client';

import { useMeQuery } from '@/lib/generated/graphql';
import { notFound } from 'next/navigation';
import { useEffect } from 'react';

export function useAdminAuth() {
  const { data, loading, error } = useMeQuery({
    // Ne pas afficher d'erreur dans la console si Unauthorized
    errorPolicy: 'ignore',
  });

  useEffect(() => {
    if (!loading) {
      // Si erreur (Unauthorized) ou pas de données ou pas admin/instructor
      if (error || !data?.me || (data.me.role !== 'ADMIN' && data.me.role !== 'INSTRUCTOR')) {
        // Redirige vers 404
        notFound();
      }
    }
  }, [data, loading, error]);

  return {
    user: data?.me,
    loading,
    isAuthorized: data?.me && (data.me.role === 'ADMIN' || data.me.role === 'INSTRUCTOR'),
  };
}
