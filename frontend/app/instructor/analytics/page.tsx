'use client';

import { endOfDay, startOfDay, subDays } from 'date-fns';
import { useState } from 'react';
import { DateRange } from 'react-day-picker';

// Hook custom
import { useAnalytics } from '@/hooks/useAnalytics';
import { CoursePerformanceTable } from './_components/CoursePerformanceTable';
import { DateRangePicker } from './_components/DateRangePicker';
import { EngagementMetrics } from './_components/EngagementMetrics';
import { EnrollmentChart } from './_components/EnrollmentChart';
import { ExportButton } from './_components/ExportButton';
import { OverviewCards } from './_components/OverviewCards';
import { RevenueChart } from './_components/RevenueChart';

// Composants


export default function AnalyticsPage() {
  // État pour la période sélectionnée (30 derniers jours par défaut)
  const [dateRange, setDateRange] = useState<DateRange>({
    from: startOfDay(subDays(new Date(), 29)),
    to: endOfDay(new Date()),
  });

  // Hook custom qui gère toutes les queries
  const {
    analytics,
    revenue,
    coursePerformance,
    loading,
    error,
  } = useAnalytics({ dateRange });

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des analytics...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600 max-w-2xl text-center">
          <h2 className="text-xl font-bold mb-2">❌ Erreur</h2>
          <p>{error.message}</p>
        </div>
      </div>
    );
  }

  // No data state
  if (!analytics) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-yellow-600">⚠️ Pas de données disponibles</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header avec Export */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Analytics Dashboard
            </h1>
            <p className="text-gray-600">
              Suivez les performances de vos cours en temps réel
            </p>
          </div>
          <ExportButton dateRange={dateRange} />
        </div>

        {/* Date Range Picker */}
        <div className="mb-8">
          <DateRangePicker value={dateRange} onChange={setDateRange} />
        </div>

        {/* Overview Cards (4 métriques principales) */}
        <div className="mb-8">
          <OverviewCards data={analytics} />
        </div>

        {/* Charts Section - Grid 2 colonnes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  📈 Évolution des revenus
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Revenus générés jour par jour
                </p>
              </div>
              {revenue && (
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">
                    {revenue.totalRevenue.toFixed(2)} €
                  </div>
                  <div className="text-xs text-gray-500">Total période</div>
                </div>
              )}
            </div>

            {revenue?.dataPoints ? (
              <RevenueChart data={revenue.dataPoints} />
            ) : (
              <div className="h-[400px] flex items-center justify-center bg-gray-50 rounded border-2 border-dashed border-gray-300">
                <p className="text-gray-500">Aucune donnée de revenus</p>
              </div>
            )}
          </div>

          {/* Enrollment Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                📚 Évolution des inscriptions
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Nouveaux étudiants jour par jour
              </p>
            </div>

            {revenue?.dataPoints ? (
              <EnrollmentChart
                data={revenue.dataPoints.map((point) => ({
                  date: point.date,
                  enrollments: point.enrollments,
                }))}
              />
            ) : (
              <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded border-2 border-dashed border-gray-300">
                <p className="text-gray-500">Aucune donnée d&apos;inscriptions</p>
              </div>
            )}
          </div>
        </div>

        {/* Engagement Metrics */}
        <div className="mb-8">
          <EngagementMetrics
            averageWatchTime={analytics.averageWatchTime}
            totalStudents={analytics.totalStudents}
            averageCompletionRate={analytics.averageCompletionRate}
            totalEnrollments={analytics.totalEnrollments}
          />
        </div>

        {/* Course Performance Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              🎯 Performance par cours
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Statistiques détaillées de chaque cours
            </p>
          </div>

          <CoursePerformanceTable
            data={coursePerformance}
            loading={false}
          />
        </div>

        {/* Additional Info Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Informations de période
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-sm text-gray-600 mb-1">Période actuelle</div>
              <div className="text-lg font-semibold text-gray-900">
                {new Date(analytics.currentPeriod.startDate).toLocaleDateString('fr-FR')}
                {' - '}
                {new Date(analytics.currentPeriod.endDate).toLocaleDateString('fr-FR')}
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-600 mb-1">
                Période de comparaison
              </div>
              <div className="text-lg font-semibold text-gray-900">
                {new Date(analytics.comparisonPeriod.startDate).toLocaleDateString('fr-FR')}
                {' - '}
                {new Date(analytics.comparisonPeriod.endDate).toLocaleDateString('fr-FR')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
