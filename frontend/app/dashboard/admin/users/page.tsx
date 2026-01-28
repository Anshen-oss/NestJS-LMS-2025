'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useGetAllUsersQuery, useGetUserStatsQuery } from '@/lib/generated/graphql';
import { GraduationCap, Loader2, Search, Shield, UserCheck, Users } from 'lucide-react';
import { useState } from 'react';
import { UserRoleActions } from './_components/UserRoleActions';

type UserRole = 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'ALL'>('ALL');

  const { data: usersData, loading: usersLoading, refetch } = useGetAllUsersQuery();
  const { data: statsData, loading: statsLoading } = useGetUserStatsQuery();

  const users = usersData?.getAllUsers || [];
  const stats = statsData?.getUserStats;

  // Filtrer les utilisateurs
  const filteredUsers = users.filter((user: any) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (usersLoading || statsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h1 className="text-4xl font-bold mb-2">Gestion des utilisateurs</h1>
          <p className="text-blue-100 text-lg">
            Administrez les rôles et permissions
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-blue-500 shadow-md bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Utilisateurs
              </CardTitle>
              <Users className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {stats?.totalUsers || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500 shadow-md bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Étudiants
              </CardTitle>
              <GraduationCap className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {stats?.students || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500 shadow-md bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Instructeurs
              </CardTitle>
              <UserCheck className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {stats?.instructors || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500 shadow-md bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Admins
              </CardTitle>
              <Shield className="h-5 w-5 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {stats?.admins || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtres et Recherche */}
        <Card className="mb-6 shadow-md bg-white">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Recherche */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher par nom ou email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filtre par rôle */}
              <Select
                value={roleFilter}
                onValueChange={(value) => setRoleFilter(value as UserRole | 'ALL')}
              >
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Filtrer par rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Tous les rôles</SelectItem>
                  <SelectItem value="STUDENT">Étudiants</SelectItem>
                  <SelectItem value="INSTRUCTOR">Instructeurs</SelectItem>
                  <SelectItem value="ADMIN">Admins</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={() => refetch()}>
                Actualiser
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tableau des utilisateurs */}
        <Card className="shadow-lg bg-white">
          <CardContent className="pt-6">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Aucun utilisateur trouvé</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Utilisateur
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Email
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Rôle
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Cours créés
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Inscriptions
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Statut
                      </th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user: any) => (
                      <tr key={user.id} className="border-b hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                              {user.name?.[0]?.toUpperCase() || 'U'}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {user.name || 'Sans nom'}
                              </p>
                              <p className="text-sm text-gray-500">
                                Inscrit le{' '}
                                {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-600">
                          {user.email || 'Non renseigné'}
                        </td>
                        <td className="py-4 px-4">
                          <RoleBadge role={user.role} />
                        </td>
                        <td className="py-4 px-4 text-center text-gray-600">
                          {user._count?.coursesCreated || 0}
                        </td>
                        <td className="py-4 px-4 text-center text-gray-600">
                          {user._count?.enrollments || 0}
                        </td>
                        <td className="py-4 px-4">
                          {user.banned ? (
                            <Badge variant="destructive">Banni</Badge>
                          ) : (
                            <Badge variant="outline" className="text-green-600 border-green-600">
                              Actif
                            </Badge>
                          )}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <UserRoleActions user={user} onSuccess={refetch} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Composant Badge pour les rôles
function RoleBadge({ role }: { role: UserRole }) {
  const styles = {
    STUDENT: 'bg-blue-100 text-blue-700 border-blue-300',
    INSTRUCTOR: 'bg-purple-100 text-purple-700 border-purple-300',
    ADMIN: 'bg-orange-100 text-orange-700 border-orange-300',
  };

  const labels = {
    STUDENT: 'Étudiant',
    INSTRUCTOR: 'Instructeur',
    ADMIN: 'Admin',
  };

  return (
    <Badge variant="outline" className={styles[role]}>
      {labels[role]}
    </Badge>
  );
}
