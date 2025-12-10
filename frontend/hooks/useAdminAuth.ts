'use client';

import { useMeQuery } from '@/lib/generated/graphql';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function useAdminAuth() {
  const router = useRouter();
  const { data, loading } = useMeQuery();

  useEffect(() => {
    if (!loading && data) {
      const user = data.me;

      // Rediriger si pas admin ou instructor
      if (user.role !== 'ADMIN' && user.role !== 'INSTRUCTOR') {
        router.push('/');
      }
    }
  }, [data, loading, router]);

  return {
    user: data?.me,
    loading,
    isAuthorized: data?.me && (data.me.role === 'ADMIN' || data.me.role === 'INSTRUCTOR'),
  };
}
