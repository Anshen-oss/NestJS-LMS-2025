'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAdminActions } from '@/hooks/use-admin-actions';
import { gql, useQuery } from '@apollo/client';
import {
  BookOpen,
  DollarSign,
  Edit,
  Eye,
  MoreHorizontal,
  Trash2,
  TrendingUp,
  UserCheck,
  Users,
  UserX
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

// ==================== GRAPHQL QUERIES ====================

const GET_ADMIN_STATS = gql`
  query GetAdminStats {
    adminStats {
      totalUsers
      totalCourses
      totalRevenue
      activeStudents
      recentEnrollments
    }
  }
`;

const GET_ALL_COURSES = gql`
  query GetAllCourses {
    courses {
      id
      title
      description
      price
      isPublished
      imageUrl
      instructor {
        id
        name
        email
      }
      _count {
        enrollments
        chapters
      }
      createdAt
    }
  }
`;

const GET_ALL_USERS = gql`
  query GetAllUsers {
    users {
      id
      name
      email
      role
      createdAt
      _count {
        enrollments
        courses
      }
    }
  }
`;

// ==================== TYPES ====================

interface AdminStats {
  totalUsers: number;
  totalCourses: number;
  totalRevenue: number;
  activeStudents: number;
  recentEnrollments: number;
}

interface Course {
  id: string;
  title: string;
  description: string | null;
  price: number;
  isPublished: boolean;
  imageUrl: string | null;
  instructor: {
    id: string;
    name: string;
    email: string;
  };
  _count: {
    enrollments: number;
    chapters: number;
  };
  createdAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'INSTRUCTOR' | 'STUDENT';
  createdAt: string;
  _count: {
    enrollments: number;
    courses: number;
  };
}

// ==================== COMPONENTS ====================

function StatCard({ title, value, icon: Icon, description, trend }: {
  title: string;
  value: string | number;
  icon: any;
  description: string;
  trend?: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        {trend && (
          <div className="flex items-center pt-1 text-xs text-green-600">
            <TrendingUp className="mr-1 h-3 w-3" />
            {trend}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function CoursesManagement() {
  const { data, loading, error } = useQuery<{ courses: Course[] }>(GET_ALL_COURSES);
  const { deleteCourse } = useAdminActions();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  const handleDeleteClick = (courseId: string) => {
    setSelectedCourse(courseId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedCourse) {
      await deleteCourse(selectedCourse);
      setDeleteDialogOpen(false);
      setSelectedCourse(null);
    }
  };

  if (loading) return <div className="p-8 text-center">Chargement des cours...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Erreur: {error.message}</div>;

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Gestion des Cours</h3>
            <p className="text-sm text-muted-foreground">
              Vue d'ensemble de tous les cours de la plateforme
            </p>
          </div>
          <Button asChild>
            <Link href="/instructor/courses/create">Créer un cours</Link>
          </Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre</TableHead>
                <TableHead>Instructeur</TableHead>
                <TableHead>Prix</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Étudiants</TableHead>
                <TableHead>Chapitres</TableHead>
                <TableHead>Date de création</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {course.imageUrl && (
                        <img
                          src={course.imageUrl}
                          alt={course.title}
                          className="h-10 w-10 rounded object-cover"
                        />
                      )}
                      <div>
                        <div className="font-medium">{course.title}</div>
                        {course.description && (
                          <div className="text-xs text-muted-foreground line-clamp-1">
                            {course.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium">{course.instructor.name}</div>
                      <div className="text-muted-foreground">{course.instructor.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {course.price > 0 ? `${course.price.toFixed(2)}€` : 'Gratuit'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={course.isPublished ? 'default' : 'secondary'}>
                      {course.isPublished ? 'Publié' : 'Brouillon'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      {course._count.enrollments}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      {course._count.chapters}
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(course.createdAt).toLocaleDateString('fr-FR')}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/courses/${course.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            Voir le cours
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/instructor/courses/${course.id}`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Modifier
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDeleteClick(course.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le cours sera définitivement supprimé.
              Si des étudiants sont inscrits, la suppression sera refusée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function UsersManagement() {
  const { data, loading, error } = useQuery<{ users: User[] }>(GET_ALL_USERS);
  const { promoteToInstructor, deactivateUser } = useAdminActions();

  if (loading) return <div className="p-8 text-center">Chargement des utilisateurs...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Erreur: {error.message}</div>;

  const getRoleBadge = (role: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      ADMIN: 'destructive',
      INSTRUCTOR: 'default',
      STUDENT: 'secondary',
    };
    return <Badge variant={variants[role] || 'secondary'}>{role}</Badge>;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Gestion des Utilisateurs</h3>
          <p className="text-sm text-muted-foreground">
            Gérer les comptes et les rôles des utilisateurs
          </p>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Utilisateur</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead>Cours créés</TableHead>
              <TableHead>Inscriptions</TableHead>
              <TableHead>Date d'inscription</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="text-sm">
                    <div className="font-medium">{user.name}</div>
                    <div className="text-muted-foreground">{user.email}</div>
                  </div>
                </TableCell>
                <TableCell>{getRoleBadge(user.role)}</TableCell>
                <TableCell>
                  {user._count.courses > 0 ? (
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      {user._count.courses}
                    </div>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    {user._count.enrollments}
                  </div>
                </TableCell>
                <TableCell>
                  {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => promoteToInstructor(user.id)}
                        disabled={user.role !== 'STUDENT'}
                      >
                        <UserCheck className="mr-2 h-4 w-4" />
                        Promouvoir en Instructeur
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => deactivateUser(user.id)}
                        disabled={user.role === 'ADMIN'}
                      >
                        <UserX className="mr-2 h-4 w-4" />
                        Désactiver le compte
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// ==================== MAIN COMPONENT ====================

export default function AdminDashboard() {
  const { data: statsData, loading: statsLoading } = useQuery<{ adminStats: AdminStats }>(
    GET_ADMIN_STATS
  );

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard Admin</h2>
          <p className="text-muted-foreground">
            Vue d'ensemble de la plateforme et gestion des ressources
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      {statsLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="space-y-0 pb-2">
                <div className="h-4 w-24 animate-pulse rounded bg-muted" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 animate-pulse rounded bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Utilisateurs Totaux"
            value={statsData?.adminStats.totalUsers || 0}
            icon={Users}
            description="Tous les utilisateurs de la plateforme"
            trend="+12% ce mois"
          />
          <StatCard
            title="Cours Créés"
            value={statsData?.adminStats.totalCourses || 0}
            icon={BookOpen}
            description="Cours disponibles sur la plateforme"
            trend="+5 nouveaux"
          />
          <StatCard
            title="Revenus Totaux"
            value={`${(statsData?.adminStats.totalRevenue || 0).toFixed(2)}€`}
            icon={DollarSign}
            description="Revenus générés"
            trend="+18% ce mois"
          />
          <StatCard
            title="Étudiants Actifs"
            value={statsData?.adminStats.activeStudents || 0}
            icon={TrendingUp}
            description="Étudiants ayant une progression active"
            trend="+7% cette semaine"
          />
        </div>
      )}

      {/* Tabs for Management */}
      <Tabs defaultValue="courses" className="space-y-4">
        <TabsList>
          <TabsTrigger value="courses">Gestion des Cours</TabsTrigger>
          <TabsTrigger value="users">Gestion des Utilisateurs</TabsTrigger>
          <TabsTrigger value="analytics">Analytiques</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-4">
          <CoursesManagement />
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <UsersManagement />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytiques Avancées</CardTitle>
              <CardDescription>
                Statistiques détaillées et rapports de performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex h-[400px] items-center justify-center text-muted-foreground">
                📊 Les analytiques détaillées seront disponibles prochainement
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
