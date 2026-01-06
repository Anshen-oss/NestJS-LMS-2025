'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { formatCurrency, formatDate } from './format-revenue'
interface Transaction {
  id: string
  date: Date
  studentName: string
  courseName: string
  amount: number
  status: 'PAID' | 'PENDING' | 'REFUNDED'
  courseId: string
}

interface TransactionsTableProps {
  transactions: Transaction[]
  loading: boolean
}

function StatusBadge({ status }: { status: string }) {
  const badges = {
    PAID: { bg: 'bg-green-100', text: 'text-green-800', label: 'Payé' },
    PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'En attente' },
    REFUNDED: { bg: 'bg-red-100', text: 'text-red-800', label: 'Remboursé' }
  }

  const badge = badges[status as keyof typeof badges] || badges.PENDING

  return (
    <Badge className={`${badge.bg} ${badge.text} hover:${badge.bg}`}>
      {badge.label}
    </Badge>
  )
}

export function TransactionsTable({ transactions, loading }: TransactionsTableProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Dernières transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 bg-gray-100 rounded animate-pulse" />
        </CardContent>
      </Card>
    )
  }

  if (!transactions || transactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Dernières transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-40 flex items-center justify-center text-muted-foreground">
            Aucune transaction pour cette période
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dernières transactions ({transactions.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Étudiant</TableHead>
                <TableHead>Cours</TableHead>
                <TableHead className="text-right">Montant</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id} className="hover:bg-gray-50">
                  <TableCell className="text-sm text-gray-400">
                    {formatDate(transaction.date)}
                  </TableCell>
                  <TableCell className="font-medium text-gray-400">
                    {transaction.studentName}
                  </TableCell>
                  <TableCell className="text-sm text-gray-400">
                    {transaction.courseName}
                  </TableCell>
                  <TableCell className="text-right font-semibold text-gray-400">
                    {formatCurrency(transaction.amount)}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={transaction.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
