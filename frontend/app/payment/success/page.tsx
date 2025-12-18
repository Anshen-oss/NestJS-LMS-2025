'use client';

import { useApolloClient } from '@apollo/client';
import { CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const apolloClient = useApolloClient();

  useEffect(() => {
    const redirect = async () => {
      // ✅ Invalider le cache
      await apolloClient.resetStore();

      // ✅ Rediriger après 2 secondes
      setTimeout(() => {
        router.push('/my-courses');
      }, 2000);
    };

    redirect();
  }, [apolloClient, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="text-center max-w-md px-4">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl animate-bounce">
          <CheckCircle className="w-14 h-14 text-green-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Paiement réussi ! 🎉
        </h1>
        <p className="text-lg text-gray-700 mb-2">
          Inscription confirmée
        </p>
        <p className="text-sm text-gray-600">
          Redirection vers vos cours...
        </p>
      </div>
    </div>
  );
}
