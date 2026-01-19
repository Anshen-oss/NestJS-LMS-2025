'use client';

import { Avatar } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useGetCurrentUserQuery } from '@/lib/generated/graphql';
import { SignedIn, SignedOut, useUser } from '@clerk/nextjs';
import { LogOut, Settings, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function Navbar() {
  const router = useRouter();
  const { user: clerkUser } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  // ✅ Récupère le user AVEC avatarUrl depuis Apollo
  const { data, loading } = useGetCurrentUserQuery();
  const user = data?.getCurrentUser;

  const handleSignOut = async () => {
    // Clerk sign out logic here if needed
    router.push('/');
  };

  return (
    <header className="w-full border-b">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg">
          Anshen LMS
        </Link>

        <nav className="flex items-center gap-4">
          <SignedOut>
            <Link href="/sign-in" className="hover:text-primary">
              Se connecter
            </Link>
            <Link href="/sign-up" className="hover:text-primary">
              Créer un compte
            </Link>
          </SignedOut>

          <SignedIn>
            {loading ? (
              // Skeleton pendant le chargement
              <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
            ) : user ? (
              // ✅ Menu Dropdown avec Avatar Personnalisé
              <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-full hover:bg-gray-100 p-1 transition-colors">
                    {/* ✅ Avatar personnalisé avec URL de la BD */}
                    <Avatar
                      src={user.image || undefined}
                      name={user.name || 'Utilisateur'}
                      size="md"
                    />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-56">
                  {/* Affiche le nom de l'utilisateur */}
                  <div className="px-2 py-1.5 text-sm font-medium">
                    {user.name || 'Utilisateur'}
                  </div>
                  <div className="px-2 text-xs text-gray-500">
                    {user.email}
                  </div>

                  <DropdownMenuSeparator />

                  {/* Menu Items */}
                  <DropdownMenuItem onClick={() => router.push('/dashboard/profile')}>
                    <User className="w-4 h-4 mr-2" />
                    Mon Profil
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => router.push('/dashboard/settings')}>
                    <Settings className="w-4 h-4 mr-2" />
                    Paramètres
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="text-red-600 focus:bg-red-50"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null}
          </SignedIn>
        </nav>
      </div>
    </header>
  );
}
