'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3, DollarSign, TrendingDown, TrendingUp } from 'lucide-react'
import { formatCurrency, getChangeIndicator } from './format-revenue'

interface RevenueOverviewProps {
  totalRevenue: number
  changePercentage: number
  changeDirection: 'UP' | 'DOWN' | 'STABLE'
  averageDailyRevenue: number
  transactionCount: number
  loading: boolean
}

export function RevenueOverview({
  totalRevenue,
  changePercentage,
  changeDirection,
  averageDailyRevenue,
  transactionCount,
  loading
}: RevenueOverviewProps) {
  const changeIndicator = getChangeIndicator(changePercentage, changeDirection)

  const cards = [
    {
      title: 'Revenus totaux',
      value: formatCurrency(totalRevenue),
      icon: DollarSign,
      color: 'bg-blue-100 text-blue-600',
      trend: {
        text: changeIndicator.text,
        icon: changeDirection === 'UP' ? TrendingUp : TrendingDown,
        color: changeIndicator.color
      }
    },
    {
      title: 'Croissance',
      value: changeIndicator.text,
      icon: changeDirection === 'UP' ? TrendingUp : TrendingDown,
      color: changeDirection === 'UP' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600',
      subtext: 'vs période précédente'
    },
    {
      title: 'Revenu quotidien moyen',
      value: formatCurrency(averageDailyRevenue),
      icon: BarChart3,
      color: 'bg-purple-100 text-purple-600',
      subtext: 'Moyenne sur la période'
    },
    {
      title: 'Transactions',
      value: transactionCount.toString(),
      icon: BarChart3,
      color: 'bg-orange-100 text-orange-600',
      subtext: 'Paiements reçus'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => {
        const IconComponent = card.icon
        return (
          <Card key={index} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${card.color}`}>
                <IconComponent className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? (
                  <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
                ) : (
                  card.value
                )}
              </div>
              {card.trend && (
                <p className={`text-xs font-medium ${card.trend.color} mt-2`}>
                  {card.trend.text}
                </p>
              )}
              {card.subtext && (
                <p className="text-xs text-muted-foreground mt-2">{card.subtext}</p>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
