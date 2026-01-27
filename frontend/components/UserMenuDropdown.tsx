'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useClerk } from '@clerk/nextjs';
import { LogOut, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface UserMenuDropdownProps {
  avatar?: string;
  name: string;
  email: string;
  isLoading?: boolean;
}

export function UserMenuDropdown({
  avatar,
  name,
  email,
  isLoading = false
}: UserMenuDropdownProps) {
  const router = useRouter();
  const { signOut } = useClerk();

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
    );
  }

  const userInitial = name?.charAt(0)?.toUpperCase() || 'I';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="rounded-full hover:bg-gray-100 p-1 transition-colors">
          <Avatar className="h-8 w-8">
            {avatar && (
              <AvatarImage
                src={avatar}
                alt={name}
              />
            )}
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-xs font-semibold">
              {userInitial}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5 text-sm font-medium">
          {name}
        </div>
        <div className="px-2 text-xs text-gray-500">
          {email}
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => router.push('/instructor/settings')}>
          <Settings className="w-4 h-4 mr-2" />
          Paramètres
        </DropdownMenuItem>

        <DropdownMenuSeparator />

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
