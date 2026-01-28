// ============================================================================
// FILE: src/components/dashboard/instructor/InstructorDashboardHeader.tsx
// ============================================================================
// 📌 Composant réutilisable pour afficher le header du Instructor Dashboard
// avec avatar + nom de l'instructeur en top-right

'use client';

import { useGetCurrentUser } from '@/hooks/useUserProfile';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

interface InstructorDashboardHeaderProps {
  firstName?: string;
  subtitle?: string;
}

export function InstructorDashboardHeader({
  firstName = 'Instructeur',
  subtitle = 'Voici un aperçu de votre activité d\'enseignement'
}: InstructorDashboardHeaderProps) {
  const { user, loading } = useGetCurrentUser();

  return (
    <div className="flex items-center justify-between mb-8">
      {/* Left Side - Greeting */}
      <div>
        <h1 className="text-4xl font-bold text-gray-300 mb-2">
          Bonjour {firstName} ! 👋
        </h1>
        <p className="text-gray-500 text-lg">
          {subtitle}
        </p>
      </div>

      {/* Right Side - Avatar + Name */}
      {loading ? (
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      ) : user ? (
        <Link href="/instructor/settings">
          <div className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
            {/* Avatar */}
            {user.image ? (
              <img
                src={user.image}
                alt={user.name || 'Instructeur'}
                className="w-10 h-10 rounded-full object-cover border-2 border-blue-400"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                {user.name?.charAt(0).toUpperCase() || 'I'}
              </div>
            )}

            {/* Name & Role */}
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-300">
                {user.name || 'Instructeur'}
              </span>
              <span className="text-xs text-gray-400">Instructeur</span>
            </div>
          </div>
        </Link>
      ) : null}
    </div>
  );
}
