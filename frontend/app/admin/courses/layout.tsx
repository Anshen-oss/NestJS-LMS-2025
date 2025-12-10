'use client';

import { Navbar } from '@/app/(publicRoutes)/_components/Navbar';
import { useMeQuery } from '@/lib/generated/graphql';

// Composant 404 inline
function Unauthorized404() {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(135deg, #faf5ff 0%, #ffffff 50%, #eff6ff 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{
        maxWidth: '600px',
        width: '100%',
        textAlign: 'center',
        background: 'white',
        padding: '48px 24px',
        borderRadius: '24px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{
          fontSize: '120px',
          fontWeight: 'bold',
          background: 'linear-gradient(to right, #9333ea, #3b82f6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '32px',
          lineHeight: '1'
        }}>
          404
        </h1>

        <h2 style={{
          fontSize: '36px',
          fontWeight: 'bold',
          color: '#111827',
          marginBottom: '16px',
        }}>
          Accès non autorisé
        </h2>

        <p style={{
          fontSize: '18px',
          color: '#6b7280',
          marginBottom: '48px',
        }}>
          Vous devez être administrateur pour accéder à cette page.
        </p>

        <div style={{
          display: 'flex',
          gap: '16px',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}>
          <a
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '14px 28px',
              backgroundColor: '#9333ea',
              color: 'white',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '16px',
            }}
          >
            🏠 Retour à l'accueil
          </a>

          <a
            href="/courses"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '14px 28px',
              backgroundColor: 'white',
              color: '#374151',
              border: '2px solid #d1d5db',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '16px',
            }}
          >
            📚 Parcourir les cours
          </a>
        </div>
      </div>
    </div>
  );
}

export default function AdminCoursesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data, loading, error } = useMeQuery({
    errorPolicy: 'all',
  });

  // Pendant le chargement, ne rien afficher
  if (loading) {
    return null;
  }

  // Si erreur ou pas admin, afficher la 404
  if (error || !data?.me || (data.me.role !== 'ADMIN' && data.me.role !== 'INSTRUCTOR')) {
    return <Unauthorized404 />;
  }

  // Sinon, afficher le contenu avec Navbar
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
}
