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
  DollarSign,
  Home,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Users,
  Video,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

export default function InstructorLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, isLoaded } = useUser();

  // Vérifier que l'utilisateur est INSTRUCTOR
  const userRole = user?.publicMetadata?.role as string | undefined;
  const isInstructor = isLoaded && user && userRole === 'INSTRUCTOR';

  // Pendant le chargement
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Chargement...</p>
        </div>
      </div>
    );
  }

  // Si pas instructor, afficher message
  if (!isInstructor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center px-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Accès Refusé
          </h1>
          <p className="text-gray-600 mb-8">
            Cette page est réservée aux instructeurs.
          </p>
          <Button asChild>
            <Link href="/">Retour à l'accueil</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Menu items pour instructor
  const menuItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      href: '/instructor',
      description: 'Vue d\'ensemble',
    },
    {
      title: 'Mes Cours',
      icon: BookOpen,
      href: '/instructor/courses',
      description: 'Gérer mes cours',
    },
    {
      title: 'Créer un cours',
      icon: Video,
      href: '/instructor/courses/new',
      description: 'Nouveau cours',
    },
    {
      title: 'Étudiants',
      icon: Users,
      href: '/instructor/students',
      description: 'Mes étudiants',
    },
    {
      title: 'Analytics',
      icon: BarChart3,
      href: '/instructor/analytics',
      description: 'Statistiques',
    },
    {
      title: 'Revenus',
      icon: DollarSign,
      href: '/instructor/earnings',
      description: 'Finances',
    },
    {
      title: 'Messages',
      icon: MessageSquare,
      href: '/instructor/messages',
      description: 'Communications',
    },
  ];

  // User info
  const userName = user?.fullName || user?.firstName || 'Instructeur';
  const userEmail = user?.primaryEmailAddress?.emailAddress || '';
  const userInitial = (user?.fullName?.charAt(0) || user?.firstName?.charAt(0) || 'I').toUpperCase();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        {/* Sidebar */}
        <Sidebar>
          <SidebarHeader className="border-b px-6 py-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <Video className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-lg">Instructor Studio</h2>
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
                      <Link href="/instructor/settings">
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
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <span className="text-sm font-semibold text-white">
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
          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
