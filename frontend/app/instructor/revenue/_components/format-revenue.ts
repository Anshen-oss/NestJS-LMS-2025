/**
 * Formate un montant en devise EUR
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Formate une date pour l'affichage
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d)
}

/**
 * Formate une date pour le graphique (format court)
 */
export function formatChartDate(date: string): string {
  const d = new Date(date)
  return new Intl.DateTimeFormat('fr-FR', {
    month: 'short',
    day: 'numeric',
  }).format(d)
}

/**
 * Retourne un indicateur de changement (+ ou -)
 */
export function getChangeIndicator(
  changePercentage: number,
  direction: 'UP' | 'DOWN' | 'STABLE'
): { icon: string; color: string; text: string } {
  if (direction === 'UP') {
    return {
      icon: '↑',
      color: 'text-green-600',
      text: `+${changePercentage.toFixed(1)}%`
    }
  }
  if (direction === 'DOWN') {
    return {
      icon: '↓',
      color: 'text-red-600',
      text: `${changePercentage.toFixed(1)}%`
    }
  }
  return {
    icon: '→',
    color: 'text-gray-600',
    text: `${changePercentage.toFixed(1)}%`
  }
}
