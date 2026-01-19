'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { UserMenuDropdown } from '@/components/UserMenuDropdown';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useUser } from '@clerk/nextjs';
import {
  BookOpen,
  GraduationCap,
  Home,
  LayoutDashboard,
  Settings,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

export default function StudentLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();

  // ✅ IMPORTANT: Utiliser Apollo SEULEMENT après que Clerk soit chargé
  const { user: apolloUser, loading: apolloLoading } = useCurrentUser();

  // Vérifier que l'utilisateur est STUDENT
  const userRole = clerkUser?.publicMetadata?.role as string | undefined;
  const isStudent = clerkLoaded && clerkUser && userRole === 'STUDENT';

  // Pendant le chargement de Clerk
  if (!clerkLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Chargement...</p>
        </div>
      </div>
    );
  }

  // Si pas student, rediriger (ou afficher 404)
  if (!isStudent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center px-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Accès Refusé
          </h1>
          <p className="text-gray-600 mb-8">
            Cette page est réservée aux étudiants.
          </p>
          <Button asChild>
            <Link href="/">Retour à l'accueil</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Menu items pour student
  const menuItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      href: '/student',
      description: 'Vue d\'ensemble',
    },
    {
      title: 'Mes Cours',
      icon: BookOpen,
      href: '/student/my-courses',
      description: 'Cours inscrits',
    },
    {
      title: 'Parcourir',
      icon: GraduationCap,
      href: '/student/browse',
      description: 'Tous les cours',
    },
    {
      title: 'Ma Progression',
      icon: TrendingUp,
      href: '/student/progress',
      description: 'Statistiques',
    },
  ];

  // ✅ User info - Utiliser Apollo si disponible, sinon Clerk
  const userName = apolloUser?.name || clerkUser?.fullName || clerkUser?.firstName || 'Étudiant';
  const userEmail = apolloUser?.email || clerkUser?.primaryEmailAddress?.emailAddress || '';
  const userAvatar = apolloUser?.image;
  const userInitial = (apolloUser?.name?.charAt(0) || clerkUser?.fullName?.charAt(0) || clerkUser?.firstName?.charAt(0) || 'E').toUpperCase();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        {/* Sidebar */}
        <Sidebar>
          <SidebarHeader className="border-b px-6 py-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-blue-600" />
              <div>
                <h2 className="font-bold text-lg">Student Portal</h2>
                <p className="text-xs text-muted-foreground">Anshen LMS</p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton asChild isActive={isActive}>
                          <Link href={item.href}>
                            <item.icon className="h-4 w-4" />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Paramètres</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/student/settings">
                        <Settings className="h-4 w-4" />
                        <span>Paramètres</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t p-4">
            <SidebarMenu>
              <SidebarMenuItem>
                <div className="flex items-center gap-3 px-2 py-2">
                  {/* ✅ Utiliser Avatar de Shadcn/ui */}
                  {apolloLoading ? (
                    <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
                  ) : (
                    <Avatar className="h-8 w-8">
                      {userAvatar && (
                        <AvatarImage
                          src={userAvatar}
                          alt={userName}
                        />
                      )}
                      <AvatarFallback className="bg-blue-500 text-white text-xs font-semibold">
                        {userInitial}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{userName}</p>
                    <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
                  </div>
                </div>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Header sticky */}
          <div className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-14 items-center justify-between px-4">
              <SidebarTrigger />

              {/* Right side */}
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/">
                    <Home className="h-4 w-4 mr-2" />
                    Accueil
                  </Link>
                </Button>

                {/* ✅ UserMenuDropdown avec Avatar synchronisé */}
                <UserMenuDropdown />
              </div>
            </div>
          </div>

          {/* Contenu scrollable */}
          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
