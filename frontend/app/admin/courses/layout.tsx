'use client';

import { Navbar } from '@/app/(publicRoutes)/_components/Navbar';
import { useMeQuery } from '@/lib/generated/graphql';

export default function AdminCoursesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data, loading, error } = useMeQuery({
    errorPolicy: 'all',
  });

  // Pendant le chargement
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Vérification des accès...</p>
        </div>
      </div>
    );
  }

  // Vérifier l'autorisation
  const isAuthorized = !error && data?.me && (
    data.me.role === 'ADMIN' ||
    data.me.role === 'INSTRUCTOR'
  );

  // Si pas autorisé, afficher une belle page 404 inline
  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <div className="text-center px-4">
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              404
            </h1>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Page introuvable
          </h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            {error
              ? "Vous devez être connecté pour accéder à cette page."
              : "Vous n'avez pas les permissions nécessaires pour accéder à cette page."}
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="/"
              className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              Retour à l'accueil
            </a>
            <a
              href="/login"
              className="px-6 py-3 border border-purple-600 text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition-colors"
            >
              Se connecter
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Si autorisé, afficher le contenu normal
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
}
