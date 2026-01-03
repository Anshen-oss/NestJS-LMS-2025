'use client';

import { BarChart3, Download, FileText, Table } from 'lucide-react';
import { useState } from 'react';
import { DateRange } from 'react-day-picker';

interface ExportButtonProps {
  dateRange: DateRange;
}

type ExportType = 'overview' | 'revenue' | 'courses';

export function ExportButton({ dateRange }: ExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [exporting, setExporting] = useState<ExportType | null>(null);

  const handleExport = async (type: ExportType) => {
    if (!dateRange.from || !dateRange.to) {
      alert('Veuillez sélectionner une période');
      return;
    }

    setExporting(type);
    setIsOpen(false);

    try {
      // Fetch l'export depuis le backend
      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            query ExportAnalytics($dateRange: DateRangeInput!, $type: String!) {
              exportAnalytics(dateRange: $dateRange, type: $type)
            }
          `,
          variables: {
            dateRange: {
              startDate: dateRange.from,
              endDate: dateRange.to,
            },
            type,
          },
        }),
      });

      const result = await response.json();
      const csvData = result.data?.exportAnalytics;

      if (!csvData) {
        throw new Error('Pas de données à exporter');
      }

      // Créer un blob et télécharger
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      const filename = `analytics-${type}-${new Date().toISOString().split('T')[0]}.csv`;

      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Export error:', error);
      alert('Erreur lors de l\'export. Veuillez réessayer.');
    } finally {
      setExporting(null);
    }
  };

  const exportOptions = [
    {
      type: 'overview' as ExportType,
      label: 'Vue d\'ensemble',
      description: 'Métriques principales',
      icon: FileText,
    },
    {
      type: 'revenue' as ExportType,
      label: 'Revenus détaillés',
      description: 'Jour par jour',
      icon: BarChart3,
    },
    {
      type: 'courses' as ExportType,
      label: 'Performance cours',
      description: 'Tous les cours',
      icon: Table,
    },
  ];

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={!!exporting}
        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {exporting ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            Export en cours...
          </>
        ) : (
          <>
            <Download className="h-4 w-4" />
            Exporter
          </>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && !exporting && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-20 overflow-hidden">
            <div className="py-1">
              {exportOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.type}
                    onClick={() => handleExport(option.type)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-start gap-3"
                  >
                    <div className="mt-0.5">
                      <Icon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {option.label}
                      </div>
                      <div className="text-sm text-gray-500">
                        {option.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="border-t border-gray-200 px-4 py-2 bg-gray-50">
              <p className="text-xs text-gray-600">
                Format: CSV • Compatible Excel, Google Sheets
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
