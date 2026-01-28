'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { gql, useQuery } from '@apollo/client';
import {
  Award,
  BookOpen,
  Clock,
  DollarSign,
  Loader2,
  Target,
  TrendingDown,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useState } from 'react';

// ==================== GRAPHQL QUERIES ====================

const GET_ANALYTICS_DATA = gql`
  query GetAnalyticsData {
    adminStats {
      totalUsers
      totalCourses
      totalRevenue
      activeStudents
      recentEnrollments
    }
  }
`;

// ==================== TYPES ====================

interface AnalyticsData {
  totalUsers: number;
  totalCourses: number;
  totalRevenue: number;
  activeStudents: number;
  recentEnrollments: number;
}

// ==================== COMPONENTS ====================

function StatCard({
  title,
  value,
  change,
  icon: Icon,
  trend
}: {
  title: string;
  value: string | number;
  change: string;
  icon: any;
  trend: 'up' | 'down';
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className={`flex items-center text-xs ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
          {trend === 'up' ? (
            <TrendingUp className="mr-1 h-3 w-3" />
          ) : (
            <TrendingDown className="mr-1 h-3 w-3" />
          )}
          {change}
        </div>
      </CardContent>
    </Card>
  );
}

function OverviewTab({ data }: { data: AnalyticsData }) {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Revenus Totaux"
          value={`${data.totalRevenue.toFixed(2)}€`}
          change="+20.1% ce mois"
          icon={DollarSign}
          trend="up"
        />
        <StatCard
          title="Nouveaux Étudiants"
          value={data.recentEnrollments}
          change="+15.2% cette semaine"
          icon={Users}
          trend="up"
        />
        <StatCard
          title="Cours Actifs"
          value={data.totalCourses}
          change="+5 nouveaux"
          icon={BookOpen}
          trend="up"
        />
        <StatCard
          title="Taux de Complétion"
          value="68%"
          change="-2.5% ce mois"
          icon={Target}
          trend="down"
        />
      </div>

      {/* Charts Placeholder */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenus par Mois</CardTitle>
            <CardDescription>Performance des 6 derniers mois</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center border-2 border-dashed rounded-lg">
              <div className="text-center">
                <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  Graphique des revenus
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  (Intégration Chart.js/Recharts à venir)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inscriptions par Jour</CardTitle>
            <CardDescription>Tendance sur 30 jours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center border-2 border-dashed rounded-lg">
              <div className="text-center">
                <Users className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  Graphique des inscriptions
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  (Intégration Chart.js/Recharts à venir)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function CoursesTab() {
  const topCourses = [
    { id: 1, title: 'Introduction à React', enrollments: 245, revenue: 3675, rating: 4.8 },
    { id: 2, title: 'Node.js Avancé', enrollments: 189, revenue: 2835, rating: 4.7 },
    { id: 3, title: 'Docker pour Débutants', enrollments: 167, revenue: 2505, rating: 4.9 },
    { id: 4, title: 'TypeScript Masterclass', enrollments: 143, revenue: 2145, rating: 4.6 },
    { id: 5, title: 'GraphQL Complet', enrollments: 128, revenue: 1920, rating: 4.8 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cours Populaire</CardTitle>
            <Award className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Introduction à React</div>
            <p className="text-xs text-muted-foreground">245 inscriptions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Durée Moyenne</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8.5h</div>
            <p className="text-xs text-muted-foreground">Par cours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Note Moyenne</CardTitle>
            <Award className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.7/5</div>
            <p className="text-xs text-muted-foreground">Tous les cours</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top 5 Cours par Revenus</CardTitle>
          <CardDescription>Classement des cours les plus rentables</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topCourses.map((course, index) => (
              <div key={course.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-600 font-bold">
                    #{index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{course.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {course.enrollments} étudiants • Note: {course.rating}/5
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">{course.revenue}€</p>
                  <p className="text-xs text-muted-foreground">Revenus</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function UsersTab({ data }: { data: AnalyticsData }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs Totaux</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalUsers}</div>
            <p className="text-xs text-muted-foreground">+12% ce mois</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs Actifs</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.activeStudents}</div>
            <p className="text-xs text-muted-foreground">Derniers 30 jours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de Rétention</CardTitle>
            <Target className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">84%</div>
            <p className="text-xs text-muted-foreground">+3% ce mois</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activité des Utilisateurs</CardTitle>
          <CardDescription>Répartition par type d'activité</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center border-2 border-dashed rounded-lg">
            <div className="text-center">
              <Users className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                Graphique d'activité
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                (Intégration Chart.js/Recharts à venir)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ==================== MAIN COMPONENT ====================

export default function AnalyticsPage() {
  const [period, setPeriod] = useState('30d');

  const { data, loading, error } = useQuery<{ adminStats: AnalyticsData }>(
    GET_ANALYTICS_DATA,
    {
      fetchPolicy: 'network-only',
    }
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Chargement des analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="pt-6">
          <p className="text-destructive">Erreur: {error.message}</p>
        </CardContent>
      </Card>
    );
  }

  if (!data?.adminStats) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">Aucune donnée disponible</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground mt-2">
            Statistiques et rapports de performance de la plateforme
          </p>
        </div>

        {/* Period Selector */}
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">7 derniers jours</SelectItem>
            <SelectItem value="30d">30 derniers jours</SelectItem>
            <SelectItem value="90d">90 derniers jours</SelectItem>
            <SelectItem value="1y">Cette année</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="courses">Cours</TabsTrigger>
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab data={data.adminStats} />
        </TabsContent>

        <TabsContent value="courses">
          <CoursesTab />
        </TabsContent>

        <TabsContent value="users">
          <UsersTab data={data.adminStats} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
