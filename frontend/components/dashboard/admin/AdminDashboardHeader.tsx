// ============================================================================
// FILE: src/components/dashboard/admin/AdminDashboardHeader.tsx
// ============================================================================
// 📌 Composant réutilisable pour afficher le header du Admin Dashboard
// avec avatar + nom de l'admin en top-right

'use client';

import { useGetCurrentUser } from '@/hooks/useUserProfile';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

interface AdminDashboardHeaderProps {
  title?: string;
  description?: string;
}

export function AdminDashboardHeader({
  title = 'Dashboard Admin',
  description = 'Vue d\'ensemble de la plateforme et gestion des ressources'
}: AdminDashboardHeaderProps) {
  const { user, loading } = useGetCurrentUser();

  return (
    <div className="flex items-center justify-between mb-8">
      {/* Left Side - Title & Description */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
      </div>

      {/* Right Side - Avatar + Name */}
      {loading ? (
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      ) : user ? (
        <Link href="/admin/settings">
          <div className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
            {/* Avatar */}
            {user.image ? (
              <img
                src={user.image}
                alt={user.name || 'Admin'}
                className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold text-sm">
                {user.name?.charAt(0).toUpperCase() || 'A'}
              </div>
            )}

            {/* Name & Role */}
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-900">
                {user.name || 'Admin'}
              </span>
              <span className="text-xs text-gray-500">Admin</span>
            </div>
          </div>
        </Link>
      ) : null}
    </div>
  );
}
