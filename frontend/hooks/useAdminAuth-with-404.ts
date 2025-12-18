'use client';

import { useUser } from '@clerk/nextjs';
import { notFound } from 'next/navigation';
import { useEffect } from 'react';

export function useAdminAuth() {
  const { user, isLoaded } = useUser();

  // Récupérer le rôle depuis Clerk metadata
  const userRole = user?.publicMetadata?.role as string | undefined;

  useEffect(() => {
    if (isLoaded) {
      // Si pas d'utilisateur ou pas admin/instructor
      if (!user || (userRole !== 'ADMIN' && userRole !== 'INSTRUCTOR')) {
        // Redirige vers 404
        notFound();
      }
    }
  }, [isLoaded, user, userRole]);

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
