'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { RevenuePagePeriod } from '@/hooks/use-instructor-revenue-page'
import { Download, Loader2 } from 'lucide-react'
import { useState } from 'react'

interface ExportButtonProps {
  onExport: (period: RevenuePagePeriod) => Promise<void>
  loading: boolean
}

export function ExportButton({ onExport, loading }: ExportButtonProps) {
  const [open, setOpen] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState<RevenuePagePeriod>(
    RevenuePagePeriod.LAST_30_DAYS
  )
  const [exporting, setExporting] = useState(false)

  const periods = [
    { value: RevenuePagePeriod.LAST_7_DAYS, label: '7 derniers jours' },
    { value: RevenuePagePeriod.LAST_30_DAYS, label: '30 derniers jours' },
    { value: RevenuePagePeriod.LAST_90_DAYS, label: '90 derniers jours' },
    { value: RevenuePagePeriod.YEAR, label: 'Cette année' }
  ]

  const handleExport = async () => {
    try {
      setExporting(true)
      await onExport(selectedPeriod)
      setOpen(false)
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setExporting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="gap-2 text-black"
          disabled={loading || exporting}
        >
          <Download className="h-4 w-4" />
          Exporter en CSV
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Exporter les données de revenus</DialogTitle>
          <DialogDescription>
            Sélectionnez la période à exporter dans un fichier CSV
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-3">
            {periods.map((period) => (
              <label
                key={period.value}
                className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition"
              >
                <input
                  type="radio"
                  name="period"
                  value={period.value}
                  checked={selectedPeriod === period.value}
                  onChange={(e) =>
                    setSelectedPeriod(e.target.value as RevenuePagePeriod)
                  }
                  className="h-4 w-4 text-blue-600 cursor-pointer"
                />
                <span className="ml-3 font-medium text-gray-400">
                  {period.label}
                </span>
              </label>
            ))}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-900">
              💡 Le fichier CSV contient: dates, étudiants, cours, montants et
              statuts
            </p>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={exporting}
          >
            Annuler
          </Button>
          <Button
            onClick={handleExport}
            disabled={exporting}
            className="gap-2"
          >
            {exporting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Export en cours...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Télécharger CSV
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
