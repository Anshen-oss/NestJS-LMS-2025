'use client';

import { useApolloClient } from '@apollo/client';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardRedirect() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const apolloClient = useApolloClient();

  useEffect(() => {
    const redirect = async () => {
      if (isLoaded) {
        // ✅ Invalider tout le cache après payment Stripe
        await apolloClient.resetStore();

        if (!user) {
          router.push('/sign-in');
          return;
        }

        const role = user.publicMetadata?.role as string;

        switch (role) {
          case 'ADMIN':
          case 'INSTRUCTOR':
            router.push('/admin');
            break;
          case 'STUDENT':
            router.push('/student');
            break;
          default:
            router.push('/onboarding');
        }
      }
    };

    redirect();
  }, [isLoaded, user, router, apolloClient]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 font-medium">Mise à jour de vos cours...</p>
      </div>
    </div>
  );
}
