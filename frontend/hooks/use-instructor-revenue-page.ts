import { gql, useLazyQuery, useQuery } from '@apollo/client'
import { useCallback, useMemo } from 'react'

// ================================================================
// TYPES
// ================================================================

export enum RevenuePagePeriod {
  LAST_7_DAYS = 'LAST_7_DAYS',
  LAST_30_DAYS = 'LAST_30_DAYS',
  LAST_90_DAYS = 'LAST_90_DAYS',
  YEAR = 'YEAR'
}

export interface RevenueChartDataPoint {
  date: string
  revenue: number
  transactionCount: number
}

export interface RevenueTransaction {
  id: string
  date: Date
  studentName: string
  courseName: string
  amount: number
  status: 'PAID' | 'PENDING' | 'REFUNDED'
  courseId: string
}

export interface RevenuePayout {
  id: string
  date: Date
  amount: number
  status: 'COMPLETED' | 'PENDING' | 'FAILED'
  bankAccount: string
}

export interface InstructorRevenueData {
  totalRevenue: number
  previousPeriodRevenue: number
  changePercentage: number
  changeDirection: 'UP' | 'DOWN' | 'STABLE'
  averageDailyRevenue: number
  dataPoints: RevenueChartDataPoint[]
  transactions: RevenueTransaction[]
  transactionCount: number
  availableBalance: number
  nextPayoutDate: Date
  payoutHistory: RevenuePayout[]
  periodStart: Date
  periodEnd: Date
  currency: string
}

export interface ExportRevenueResponse {
  success: boolean
  downloadUrl: string
  filename: string
}

// ================================================================
// GRAPHQL QUERIES & MUTATIONS
// ================================================================

const GET_INSTRUCTOR_REVENUE = gql`
  query GetInstructorRevenue($period: RevenueInstructorPeriod!) {
    getInstructorRevenue(period: $period) {
      totalRevenue
      previousPeriodRevenue
      changePercentage
      changeDirection
      averageDailyRevenue
      dataPoints {
        date
        revenue
        transactionCount
      }
      transactions {
        id
        date
        studentName
        courseName
        amount
        status
        courseId
      }
      transactionCount
      availableBalance
      nextPayoutDate
      payoutHistory {
        id
        date
        amount
        status
        bankAccount
      }
      periodStart
      periodEnd
      currency
    }
  }
`
const EXPORT_REVENUE = gql`
  query ExportRevenue($period: RevenueInstructorPeriod!) {
    exportRevenue(period: $period) {
      success
      downloadUrl
      filename
    }
  }
`

// ================================================================
// HOOK
// ================================================================

interface UseInstructorRevenuePageOptions {
  skip?: boolean
  pollInterval?: number
}

/**
 * Hook pour récupérer les données de la Revenue Page
 * @param period - Période à afficher (7j, 30j, 90j, 1an)
 * @param options - Options (skip, pollInterval)
 */
export const useInstructorRevenuePage = (
  period: RevenuePagePeriod = RevenuePagePeriod.LAST_30_DAYS,
  options?: UseInstructorRevenuePageOptions
) => {
  // Query pour récupérer les données
 const { data, loading, error, refetch } = useQuery<
    { getInstructorRevenue: InstructorRevenueData },
    { period: string }
  >(
    GET_INSTRUCTOR_REVENUE,
    {
      variables: { period },
      skip: options?.skip,
      pollInterval: options?.pollInterval ?? 0,
      fetchPolicy: 'cache-first',
      errorPolicy: 'all'
    }
  )


  // Mutation pour exporter CSV
const [executeExport, { loading: exporting, data: exportData }] = useLazyQuery<
  { exportRevenue: ExportRevenueResponse },
  { period: string }
>(
  EXPORT_REVENUE,
  {
    onCompleted: (data) => {
      if (data?.exportRevenue?.downloadUrl) {
        window.location.href = data.exportRevenue.downloadUrl
      }
    }
  }
)

  // Fonction pour actualiser les données
  const refresh = useCallback(async () => {
    return refetch({ period })
  }, [period, refetch])

  // Fonction pour exporter en CSV
const exportAsCSV = useCallback(async () => {
  try {
    await executeExport({
      variables: { period }
    })
  } catch (err) {
    console.error('Export failed:', err)
    throw err
  }
}, [period, executeExport])

  // Retourner l'interface publique du hook
  return useMemo(() => ({
    // Data
    data: data?.getInstructorRevenue,
    totalRevenue: data?.getInstructorRevenue?.totalRevenue ?? 0,
    changePercentage: data?.getInstructorRevenue?.changePercentage ?? 0,
    changeDirection: data?.getInstructorRevenue?.changeDirection,
    dataPoints: data?.getInstructorRevenue?.dataPoints ?? [],
    transactions: data?.getInstructorRevenue?.transactions ?? [],
    payoutHistory: data?.getInstructorRevenue?.payoutHistory ?? [],
    availableBalance: data?.getInstructorRevenue?.availableBalance ?? 0,

    // States
    loading,
    error,
    exporting,

    // Actions
    refresh,
    exportAsCSV
 }), [data, loading, error, exporting, refresh, executeExport])
}
