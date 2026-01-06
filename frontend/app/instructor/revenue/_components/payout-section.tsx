'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react'
import { formatCurrency, formatDate } from './format-revenue'

interface Payout {
  id: string
  date: Date
  amount: number
  status: 'COMPLETED' | 'PENDING' | 'FAILED'
  bankAccount: string
}

interface PayoutSectionProps {
  availableBalance: number
  nextPayoutDate: Date
  payoutHistory: Payout[]
  loading: boolean
}

function PayoutStatusIcon({ status }: { status: string }) {
  if (status === 'COMPLETED') {
    return <CheckCircle2 className="h-5 w-5 text-green-600" />
  }
  if (status === 'PENDING') {
    return <Clock className="h-5 w-5 text-yellow-600" />
  }
  return <AlertCircle className="h-5 w-5 text-red-600" />
}

function PayoutStatusBadge({ status }: { status: string }) {
  const badges = {
    COMPLETED: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      label: 'Complété'
    },
    PENDING: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      label: 'En attente'
    },
    FAILED: { bg: 'bg-red-100', text: 'text-red-800', label: 'Échoué' }
  }

  const badge = badges[status as keyof typeof badges] || badges.PENDING

  return (
    <Badge className={`${badge.bg} ${badge.text} hover:${badge.bg}`}>
      {badge.label}
    </Badge>
  )
}

export function PayoutSection({
  availableBalance,
  nextPayoutDate,
  payoutHistory,
  loading
}: PayoutSectionProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Available Balance Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Solde disponible
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
          ) : (
            <>
              <div className="text-3xl font-bold text-green-600">
                {formatCurrency(availableBalance)}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Prêt à être viré
              </p>
            </>
          )}
        </CardContent>
      </Card>

      {/* Next Payout Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Prochain virement
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
          ) : (
            <>
              <div className="text-lg font-semibold">
                {formatDate(nextPayoutDate)}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Virement automatique vers votre compte
              </p>
            </>
          )}
        </CardContent>
      </Card>

      {/* Payout Status Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Infos de payout
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            Intégration Stripe en cours de développement
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Phase 2 - Détails complets bientôt disponibles
          </p>
        </CardContent>
      </Card>

      {/* Payout History */}
      {payoutHistory && payoutHistory.length > 0 && (
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Historique des virements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {payoutHistory.map((payout) => (
                <div
                  key={payout.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <PayoutStatusIcon status={payout.status} />
                    <div>
                      <p className="font-medium text-gray-900">
                        {formatCurrency(payout.amount)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(payout.date)}
                      </p>
                    </div>
                  </div>
                  <PayoutStatusBadge status={payout.status} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
