'use client';

import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface RevenueDataPoint {
  date: string | Date;
  revenue: number;
  enrollments: number;
}

interface RevenueChartProps {
  data: RevenueDataPoint[];
  className?: string;
}

export function RevenueChart({ data, className }: RevenueChartProps) {
  // Transformer les données pour Recharts
  const chartData = data.map((point) => ({
    date: typeof point.date === 'string' ? new Date(point.date) : point.date,
    revenue: point.revenue,
    enrollments: point.enrollments,
    // Format pour l'axe X (court)
    dateLabel: format(
      typeof point.date === 'string' ? new Date(point.date) : point.date,
      'dd MMM',
      { locale: fr }
    ),
    // Format pour le tooltip (complet)
    fullDate: format(
      typeof point.date === 'string' ? new Date(point.date) : point.date,
      'dd MMMM yyyy',
      { locale: fr }
    ),
  }));

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: typeof chartData[0] }> }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="text-sm font-semibold text-gray-900 mb-2">
            {data.fullDate}
          </p>
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-gray-600">Revenus:</span>
              <span className="text-sm font-bold text-blue-600">
                {data.revenue.toFixed(2)} €
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-gray-600">Inscriptions:</span>
              <span className="text-sm font-semibold text-gray-900">
                {data.enrollments}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Si pas de données
  if (!data || data.length === 0) {
    return (
      <div className="h-[400px] flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <div className="text-center">
          <p className="text-gray-500 mb-2">📊 Aucune donnée disponible</p>
          <p className="text-sm text-gray-400">
            Sélectionnez une période avec des inscriptions
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          {/* Grille */}
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />

          {/* Axe X (dates) */}
          <XAxis
            dataKey="dateLabel"
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
            tickLine={false}
          />

          {/* Axe Y (revenus) */}
          <YAxis
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
            tickLine={false}
            tickFormatter={(value) => `${value}€`}
          />

          {/* Tooltip personnalisé */}
          <Tooltip content={<CustomTooltip />} />

          {/* Légende */}
          <Legend
            wrapperStyle={{ fontSize: '14px', paddingTop: '20px' }}
            iconType="line"
          />

          {/* Ligne des revenus */}
          <Line
            type="monotone"
            dataKey="revenue"
            name="Revenus (€)"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{
              fill: '#3b82f6',
              strokeWidth: 2,
              r: 4,
              strokeDasharray: '',
            }}
            activeDot={{
              r: 6,
              fill: '#2563eb',
              stroke: '#fff',
              strokeWidth: 2,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
