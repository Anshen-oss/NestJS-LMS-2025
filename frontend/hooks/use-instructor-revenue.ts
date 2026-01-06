import { gql, useQuery } from '@apollo/client';

// ================================================================
// TYPES
// ================================================================

export interface RevenueStats {
  totalRevenue: number;
  monthlyRevenue: number;
  weeklyRevenue: number;
  totalTransactions: number;
  averageOrderValue: number;
  refundRate: number; // pourcentage
  pendingAmount: number; // Montant en attente de paiement
}

export type TransactionStatus = 'COMPLETED' | 'PENDING' | 'FAILED' | 'REFUNDED' | 'DISPUTED';

export interface Transaction {
  id: string;
  courseId: string;
  courseTitle: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  amount: number;
  currency: string;
  status: TransactionStatus;
  paymentMethod: 'CARD' | 'PAYPAL' | 'BANK_TRANSFER' | 'CRYPTO' | 'OTHER';
  stripePaymentIntentId: string;
  createdAt: string;
  completedAt?: string | null;
  refundedAt?: string | null;
  refundAmount?: number | null;
  notes?: string | null;
}

export interface DailyRevenue {
  date: string;
  revenue: number;
  transactionCount: number;
}

export interface CourseRevenue {
  courseId: string;
  courseTitle: string;
  courseSlug: string;
  courseImage?: string | null;
  totalRevenue: number;
  transactionCount: number;
  studentCount: number;
  refundCount: number;
  averagePrice: number;
  lastSale?: string | null;
}

export interface TransactionsResponse {
  transactions: Transaction[];
  total: number;
  page: number;
  pageSize: number;
}

export interface RevenueChartData {
  data: DailyRevenue[];
  startDate: string;
  endDate: string;
  totalRevenue: number;
  averageDailyRevenue: number;
}

export interface PayoutSchedule {
  id: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  scheduledDate: string;
  completedAt?: string | null;
  bankAccount?: string | null;
  method: 'BANK_TRANSFER' | 'STRIPE';
}

// ================================================================
// GRAPHQL QUERIES
// ================================================================

const GET_REVENUE_STATS = gql`
  query GetRevenueStats($startDate: String, $endDate: String) {
    revenueStats(startDate: $startDate, endDate: $endDate) {
      totalRevenue
      monthlyRevenue
      weeklyRevenue
      totalTransactions
      averageOrderValue
      refundRate
      pendingAmount
    }
  }
`;

const GET_TRANSACTIONS = gql`
  query GetTransactions(
    $page: Int
    $pageSize: Int
    $courseId: String
    $status: String
    $startDate: String
    $endDate: String
    $search: String
    $sortBy: String
  ) {
    transactions(
      page: $page
      pageSize: $pageSize
      courseId: $courseId
      status: $status
      startDate: $startDate
      endDate: $endDate
      search: $search
      sortBy: $sortBy
    ) {
      transactions {
        id
        courseId
        courseTitle
        studentId
        studentName
        studentEmail
        amount
        currency
        status
        paymentMethod
        stripePaymentIntentId
        createdAt
        completedAt
        refundedAt
        refundAmount
        notes
      }
      total
      page
      pageSize
    }
  }
`;

const GET_REVENUE_CHART_DATA = gql`
  query GetRevenueChartData($startDate: String!, $endDate: String!) {
    revenueChartData(startDate: $startDate, endDate: $endDate) {
      data {
        date
        revenue
        transactionCount
      }
      startDate
      endDate
      totalRevenue
      averageDailyRevenue
    }
  }
`;

const GET_COURSE_REVENUES = gql`
  query GetCourseRevenues($page: Int, $pageSize: Int, $sortBy: String) {
    courseRevenues(page: $page, pageSize: $pageSize, sortBy: $sortBy) {
      courseId
      courseTitle
      courseSlug
      courseImage
      totalRevenue
      transactionCount
      studentCount
      refundCount
      averagePrice
      lastSale
    }
  }
`;

const GET_PAYOUT_SCHEDULE = gql`
  query GetPayoutSchedule {
    payoutSchedule {
      id
      amount
      currency
      status
      scheduledDate
      completedAt
      bankAccount
      method
    }
  }
`;

const GET_STRIPE_CONNECT_STATUS = gql`
  query GetStripeConnectStatus {
    stripeConnectStatus {
      isConnected: Boolean
      accountId: String
      chargesEnabled: Boolean
      payoutsEnabled: Boolean
      defaultCurrency: String
      balance {
        available: [String]
        pending: [String]
      }
    }
  }
`;

// ================================================================
// HOOKS
// ================================================================

/**
 * Hook pour récupérer les statistiques de revenus
 */
export function useRevenueStats(startDate?: string, endDate?: string) {
  const { data, loading, error, refetch } = useQuery<
    { revenueStats: RevenueStats },
    { startDate?: string; endDate?: string }
  >(GET_REVENUE_STATS, {
    variables: { startDate, endDate },
    fetchPolicy: 'cache-and-network',
  });

  return {
    stats: data?.revenueStats,
    loading,
    error,
    refetch,
  };
}

/**
 * Hook pour récupérer les transactions
 * Supporte filtrage par cours, statut, période, et recherche
 */
export function useTransactions(
  page: number = 1,
  pageSize: number = 10,
  courseId?: string,
  status?: string,
  startDate?: string,
  endDate?: string,
  search?: string,
  sortBy: string = 'createdAt'
) {
  const { data, loading, error, refetch, fetchMore } = useQuery<
    { transactions: TransactionsResponse },
    {
      page: number;
      pageSize: number;
      courseId?: string;
      status?: string;
      startDate?: string;
      endDate?: string;
      search?: string;
      sortBy: string;
    }
  >(GET_TRANSACTIONS, {
    variables: { page, pageSize, courseId, status, startDate, endDate, search, sortBy },
    fetchPolicy: 'cache-and-network',
  });

  const handleNextPage = () => {
    const nextPage = (data?.transactions.page || 1) + 1;
    fetchMore({
      variables: { page: nextPage },
    });
  };

  const handlePreviousPage = () => {
    const prevPage = Math.max((data?.transactions.page || 1) - 1, 1);
    fetchMore({
      variables: { page: prevPage },
    });
  };

  return {
    transactions: data?.transactions.transactions || [],
    total: data?.transactions.total || 0,
    page: data?.transactions.page || 1,
    pageSize: data?.transactions.pageSize || 10,
    loading,
    error,
    refetch,
    handleNextPage,
    handlePreviousPage,
  };
}

/**
 * Hook pour récupérer les données du graphique de revenus
 */
export function useRevenueChartData(startDate: string, endDate: string) {
  const { data, loading, error, refetch } = useQuery<
    { revenueChartData: RevenueChartData },
    { startDate: string; endDate: string }
  >(GET_REVENUE_CHART_DATA, {
    variables: { startDate, endDate },
    fetchPolicy: 'cache-and-network',
    skip: !startDate || !endDate,
  });

  return {
    chartData: data?.revenueChartData,
    loading,
    error,
    refetch,
  };
}

/**
 * Hook pour récupérer les revenus par cours
 */
export function useCourseRevenues(
  page: number = 1,
  pageSize: number = 10,
  sortBy: string = 'totalRevenue'
) {
  const { data, loading, error, refetch, fetchMore } = useQuery<
    { courseRevenues: CourseRevenue[] },
    { page: number; pageSize: number; sortBy: string }
  >(GET_COURSE_REVENUES, {
    variables: { page, pageSize, sortBy },
    fetchPolicy: 'cache-and-network',
  });

  return {
    courseRevenues: data?.courseRevenues || [],
    loading,
    error,
    refetch,
  };
}

/**
 * Hook pour récupérer le calendrier des paiements (payouts)
 */
export function usePayoutSchedule() {
  const { data, loading, error, refetch } = useQuery<
    { payoutSchedule: PayoutSchedule[] }
  >(GET_PAYOUT_SCHEDULE, {
    fetchPolicy: 'cache-and-network',
  });

  return {
    payouts: data?.payoutSchedule || [],
    loading,
    error,
    refetch,
  };
}

/**
 * Hook pour vérifier le statut de la connexion Stripe
 */
export function useStripeConnectStatus() {
  const { data, loading, error, refetch } = useQuery<{
    stripeConnectStatus: {
      isConnected: boolean;
      accountId: string;
      chargesEnabled: boolean;
      payoutsEnabled: boolean;
      defaultCurrency: string;
      balance: {
        available: string[];
        pending: string[];
      };
    };
  }>(GET_STRIPE_CONNECT_STATUS, {
    fetchPolicy: 'cache-and-network',
  });

  return {
    stripeStatus: data?.stripeConnectStatus,
    loading,
    error,
    refetch,
  };
}
