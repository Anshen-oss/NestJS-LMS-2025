'use client';

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
import { UserButton, useUser } from '@clerk/nextjs';
import {
  BarChart3,
  BookOpen,
  Home,
  LayoutDashboard,
  Settings,
  Shield,
  Users
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, isLoaded } = useUser();

  // Récupérer le rôle depuis metadata
  const userRole = user?.publicMetadata?.role as string | undefined;

  const isAuthorized = isLoaded && user && (
    userRole === 'ADMIN' || userRole === 'INSTRUCTOR'
  );

  // Pendant le chargement
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Vérification des accès...</p>
        </div>
      </div>
    );
  }

  // Si pas autorisé, afficher 404 inline
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
            {!user
              ? "Vous devez être connecté pour accéder à cette page."
              : "Vous n'avez pas les permissions nécessaires pour accéder à cette page."}
          </p>
          <div className="flex gap-4 justify-center">

              <a href="/"
              className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              Retour à l'accueil
            </a>

              <a href="/sign-in"
              className="px-6 py-3 border border-purple-600 text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition-colors"
            >
              Se connecter
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Menu items
  const menuItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      href: '/admin',
      description: 'Vue d\'ensemble',
    },
    {
      title: 'Cours',
      icon: BookOpen,
      href: '/admin/courses',
      description: 'Gérer les cours',
    },
    {
      title: 'Utilisateurs',
      icon: Users,
      href: '/admin/users',
      description: 'Gérer les utilisateurs',
    },
    {
      title: 'Analytics',
      icon: BarChart3,
      href: '/admin/analytics',
      description: 'Statistiques',
    },
  ];

  // Helpers pour affichage utilisateur
  const userName = user?.fullName || user?.firstName || 'Admin';
  const userEmail = user?.primaryEmailAddress?.emailAddress || '';
  const userInitial = (user?.fullName?.charAt(0) || user?.firstName?.charAt(0) || 'A').toUpperCase();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        {/* Sidebar */}
        <Sidebar>
          <SidebarHeader className="border-b px-6 py-4">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-purple-600" />
              <div>
                <h2 className="font-bold text-lg">Admin Panel</h2>
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
                      <Link href="/dashboard/admin/settings">
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
                  <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                    <span className="text-sm font-semibold text-purple-600">
                      {userInitial}
                    </span>
                  </div>
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
          {/* Header sticky en haut */}
          <div className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-14 items-center justify-between px-4">
              <SidebarTrigger />

              {/* Right side menu */}
              <div className="flex items-center gap-2">
                {/* Home Button */}
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/">
                    <Home className="h-4 w-4 mr-2" />
                    Accueil
                  </Link>
                </Button>

                {/* Clerk UserButton */}
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: 'h-8 w-8',
                    }
                  }}
                />
              </div>
            </div>
          </div>

          {/* Contenu scrollable */}
          <div className="flex-1 overflow-auto p-6">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
