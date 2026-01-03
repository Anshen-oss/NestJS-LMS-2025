import { differenceInDays, subDays } from 'date-fns';
import {
  ChangeDirection,
  PercentageChange,
} from './dto/analytics-response.dto';
import { DateRangeInput } from './dto/date-range.input';

/**
 * Calcule le changement en pourcentage entre deux valeurs
 */
export function calculatePercentageChange(
  current: number,
  previous: number,
): PercentageChange {
  if (previous === 0) {
    return {
      value: current > 0 ? 100 : 0,
      direction: current > 0 ? ChangeDirection.UP : ChangeDirection.STABLE,
      isSignificant: current > 0,
    };
  }

  const percentChange = ((current - previous) / previous) * 100;

  return {
    value: Math.abs(percentChange),
    direction:
      percentChange > 0
        ? ChangeDirection.UP
        : percentChange < 0
          ? ChangeDirection.DOWN
          : ChangeDirection.STABLE,
    isSignificant: Math.abs(percentChange) > 5,
  };
}

/**
 * Calcule la période de comparaison (même durée avant)
 */
export function getComparisonPeriod(dateRange: DateRangeInput): DateRangeInput {
  const duration = differenceInDays(dateRange.endDate, dateRange.startDate);

  return {
    startDate: subDays(dateRange.startDate, duration + 1),
    endDate: subDays(dateRange.startDate, 1),
  };
}

/**
 * Génère les dates pour un graphique jour par jour
 */
export function generateDateRange(startDate: Date, endDate: Date): Date[] {
  const dates: Date[] = [];
  const current = new Date(startDate);

  while (current <= endDate) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

/**
 * Formate une valeur de revenu
 */
export function formatRevenue(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount / 100); // Stripe utilise les centimes
}
