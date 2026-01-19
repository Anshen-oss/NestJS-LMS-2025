// components/UserMenuDropdown.tsx
'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useClerk } from '@clerk/nextjs';
import { LogOut, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';

/**
 * UserMenuDropdown
 *
 * Utilise le composant Avatar de Shadcn/ui (Radix UI)
 * avec AvatarImage + AvatarFallback
 */
export function UserMenuDropdown() {
  const router = useRouter();
  const { signOut } = useClerk();
  const { user, loading } = useCurrentUser();

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  // Loading state
  if (loading) {
    return (
      <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
    );
  }

  // User not found
  if (!user) {
    return null;
  }

  const userInitial = user.name?.charAt(0)?.toUpperCase() || 'E';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="rounded-full hover:bg-gray-100 p-1 transition-colors">
          {/* ✅ Utiliser Avatar de Shadcn/ui */}
          <Avatar className="h-8 w-8">
            {user.image && (
              <AvatarImage
                src={user.image}
                alt={user.name || 'Utilisateur'}
              />
            )}
            <AvatarFallback className="bg-blue-500 text-white text-xs font-semibold">
              {userInitial}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        {/* Header avec infos user */}
        <div className="px-2 py-1.5 text-sm font-medium">
          {user.name || 'Utilisateur'}
        </div>
        <div className="px-2 text-xs text-gray-500">
          {user.email}
        </div>

        <DropdownMenuSeparator />

        {/* Menu Items */}
        <DropdownMenuItem onClick={() => router.push('/student/settings')}>
          <Settings className="w-4 h-4 mr-2" />
          Paramètres
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Déconnexion */}
        <DropdownMenuItem
          onClick={handleSignOut}
          className="text-red-600 focus:bg-red-50 focus:text-red-600"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Déconnexion
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
