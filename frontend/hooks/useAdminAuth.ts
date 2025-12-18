'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function useAdminAuth() {
  const router = useRouter();
  const { user, isLoaded } = useUser();

  // Récupérer le rôle depuis Clerk metadata
  const userRole = user?.publicMetadata?.role as string | undefined;

  useEffect(() => {
    if (isLoaded && user) {
      // Rediriger si pas admin ou instructor
      if (userRole !== 'ADMIN' && userRole !== 'INSTRUCTOR') {
        router.push('/');
      }
    }
  }, [isLoaded, user, userRole, router]);

  return {
    user: user ? {
      id: user.id,
      name: user.fullName || user.firstName || '',
      email: user.primaryEmailAddress?.emailAddress || '',
      role: userRole || 'STUDENT',
    } : null,
    loading: !isLoaded,
    isAuthorized: user && (userRole === 'ADMIN' || userRole === 'INSTRUCTOR'),
  };
}
