'use client'

import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RevenuePagePeriod, useInstructorRevenuePage } from '@/hooks/use-instructor-revenue-page'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { useState } from 'react'
import { ExportButton } from './_components/export-button'
import { PayoutSection } from './_components/payout-section'
import { RevenueChart } from './_components/revenue-chart'
import { RevenueOverview } from './_components/revenue-overview'
import { TransactionsTable } from './_components/transactions-table'

export default function RevenuePage() {
  const [period, setPeriod] = useState<RevenuePagePeriod>(
    RevenuePagePeriod.LAST_30_DAYS
  )

  const {
    data,
    totalRevenue,
    changePercentage,
    changeDirection,
    dataPoints,
    transactions,
    payoutHistory,
    availableBalance,
    nextPayoutDate,
    loading,
    error,
    exporting,
    refresh,
    exportAsCSV
  } = useInstructorRevenuePage(period)

  const handlePeriodChange = (newPeriod: string) => {
    setPeriod(newPeriod as RevenuePagePeriod)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Revenus</h1>
              <p className="text-gray-600 mt-1">
                Suivez vos revenus et gérez vos virements
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={refresh}
                disabled={loading}
                className="gap-2 text-black"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Actualiser
              </Button>
              <ExportButton onExport={exportAsCSV} loading={exporting} />
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4 flex gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-red-900">Erreur</h3>
              <p className="text-sm text-red-700 mt-1">
                {error.message || 'Impossible de charger les données'}
              </p>
            </div>
          </div>
        )}

        {/* Period Tabs */}
        <Tabs value={period} onValueChange={handlePeriodChange} className="mb-8">
          <TabsList className="grid w-full grid-cols-4 sm:w-auto">
            <TabsTrigger value={RevenuePagePeriod.LAST_7_DAYS}>
              7 jours
            </TabsTrigger>
            <TabsTrigger value={RevenuePagePeriod.LAST_30_DAYS}>
              30 jours
            </TabsTrigger>
            <TabsTrigger value={RevenuePagePeriod.LAST_90_DAYS}>
              90 jours
            </TabsTrigger>
            <TabsTrigger value={RevenuePagePeriod.YEAR}>
              Année
            </TabsTrigger>
          </TabsList>

          {/* Content for all periods (same data, different filtering on backend) */}
          <TabsContent value={period} className="space-y-8 mt-8">
            {/* Overview Cards */}
            <RevenueOverview
              totalRevenue={totalRevenue}
              changePercentage={changePercentage}
              changeDirection={changeDirection}
              averageDailyRevenue={data?.averageDailyRevenue ?? 0}
              transactionCount={data?.transactionCount ?? 0}
              loading={loading}
            />

            {/* Chart */}
            <RevenueChart dataPoints={dataPoints} loading={loading} />

            {/* Payout Section */}
            <PayoutSection
              availableBalance={availableBalance}
              nextPayoutDate={nextPayoutDate}
              payoutHistory={payoutHistory}
              loading={loading}
            />

            {/* Transactions Table */}
            <TransactionsTable transactions={transactions} loading={loading} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
