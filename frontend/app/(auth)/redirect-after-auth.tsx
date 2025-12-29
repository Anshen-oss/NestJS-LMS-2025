'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function RedirectAfterAuth() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && user) {
      const role = user.publicMetadata?.role as string;

      console.log('User role:', role);

      // ✅ Rediriger selon le rôle
      switch (role) {
        case 'ADMIN':
          console.log('Redirecting to /admin');
          router.push('/admin');
          break;

        case 'INSTRUCTOR':  // ✅ Séparé !
          console.log('Redirecting to /instructor');
          router.push('/instructor');
          break;

        case 'STUDENT':
          console.log('Redirecting to /student');
          router.push('/student');
          break;

        default:
          // Pas de rôle = nouveau user = onboarding
          console.log('Redirecting to /onboarding');
          router.push('/onboarding');
      }
    }
  }, [isLoaded, user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 font-medium">Redirection...</p>
      </div>
    </div>
  );
}
