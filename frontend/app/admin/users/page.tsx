'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useGetAllUsersQuery, useGetUserStatsQuery } from '@/lib/generated/graphql';
import { Loader2, RefreshCw, Search, Users } from 'lucide-react';
import { useMemo, useState } from 'react';
import { RoleBadge } from './_components/RoleBadge';
import { StatusBadge } from './_components/StatusBadge';
import { UserRoleActions } from './_components/UserRoleActions';
import { UserStatsSection } from './_components/UserStatsSection';

type UserRole = 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'ALL'>('ALL');

  // 📊 Récupérer les données
  const { data: usersData, loading: usersLoading, refetch } = useGetAllUsersQuery();
  const { data: statsData, loading: statsLoading } = useGetUserStatsQuery();

  const users = usersData?.getAllUsers || [];
  const stats = statsData?.getUserStats;

  // 🔍 Filtrer par recherche et rôle
  const filteredUsers = useMemo(() => {
    if (!users) return [];

    return users.filter((user: any) => {
      const matchesSearch =
        user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, roleFilter]);

  // 🎨 Loading state
  if (usersLoading || statsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Chargement des utilisateurs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* 📋 Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Gestion des Utilisateurs
          </h1>
          <p className="text-gray-600">
            Administrez les rôles, permissions et statuts des utilisateurs
          </p>
        </div>

        {/* 📊 Stats Section - COMPOSANT RÉUTILISABLE */}
        <UserStatsSection
          users={filteredUsers}
          totalUsers={stats?.totalUsers}
          totalAdmins={stats?.admins}
          totalInstructors={stats?.instructors}
          totalStudents={stats?.students}
        />

        {/* 🔍 Filters & Search */}
        <Card className="mb-6 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:gap-4">
              {/* Search Input */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher par nom ou email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10"
                />
              </div>

              {/* Role Filter */}
              <Select
                value={roleFilter}
                onValueChange={(value) => setRoleFilter(value as UserRole | 'ALL')}
              >
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filtrer par rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Tous les rôles</SelectItem>
                  <SelectItem value="STUDENT">Étudiants</SelectItem>
                  <SelectItem value="INSTRUCTOR">Instructeurs</SelectItem>
                  <SelectItem value="ADMIN">Administrateurs</SelectItem>
                </SelectContent>
              </Select>

              {/* Refresh Button */}
              <Button
                variant="outline"
                size="icon"
                onClick={() => refetch()}
                className="h-10"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>

            {/* Résultats */}
            {filteredUsers.length > 0 && (
              <p className="text-sm text-gray-500 mt-3">
                {filteredUsers.length} utilisateur(s) trouvé(s)
              </p>
            )}
          </CardContent>
        </Card>

        {/* 📋 Table */}
        <Card className="shadow-md overflow-hidden">
          <CardContent className="p-0">
            {filteredUsers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Users className="h-16 w-16 text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg font-medium">
                  Aucun utilisateur trouvé
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Essayez de modifier vos filtres de recherche
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  {/* Header */}
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Utilisateur
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Rôle
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                        Courses
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                        Inscriptions
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Statut
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  {/* Body */}
                  <tbody>
                    {filteredUsers.map((user: any) => (
                      <tr
                        key={user.id}
                        className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        {/* Utilisateur */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {/* Avatar */}
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                              {user.name?.[0]?.toUpperCase() || 'U'}
                            </div>
                            {/* Name & Date */}
                            <div>
                              <p className="font-medium text-gray-900">
                                {user.name || 'Sans nom'}
                              </p>
                              <p className="text-xs text-gray-500">
                                Inscrit le{' '}
                                {new Date(user.createdAt).toLocaleDateString('fr-FR', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                })}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Email */}
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {user.email || '—'}
                        </td>

                        {/* Rôle - COMPOSANT RÉUTILISABLE */}
                        <td className="px-6 py-4">
                          <RoleBadge role={user.role} size="sm" />
                        </td>

                        {/* Courses Créés */}
                        <td className="px-6 py-4 text-center text-gray-600 font-medium">
                          {user._count?.coursesCreated || 0}
                        </td>

                        {/* Enrollments */}
                        <td className="px-6 py-4 text-center text-gray-600 font-medium">
                          {user._count?.enrollments || 0}
                        </td>

                        {/* Statut - COMPOSANT RÉUTILISABLE */}
                        <td className="px-6 py-4">
                          <StatusBadge isActive={!user.banned} isBanned={user.banned} />
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-right">
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

        {/* Pagination Info */}
        <div className="mt-4 text-center text-sm text-gray-500">
          Affichage de {filteredUsers.length} sur {users.length} utilisateurs
        </div>
      </div>
    </div>
  );
}
