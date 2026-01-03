'use client';

import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

interface EnrollmentDataPoint {
  date: string | Date;
  enrollments: number;
}

interface EnrollmentChartProps {
  data: EnrollmentDataPoint[];
  className?: string;
}

export function EnrollmentChart({ data, className }: EnrollmentChartProps) {
  // Transformer les données pour Recharts
  const chartData = data.map((point) => ({
    date: typeof point.date === 'string' ? new Date(point.date) : point.date,
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
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-gray-600">Inscriptions:</span>
            <span className="text-sm font-bold text-orange-600">
              {data.enrollments}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  // Si pas de données
  if (!data || data.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <div className="text-center">
          <p className="text-gray-500 mb-2">📚 Aucune inscription</p>
          <p className="text-sm text-gray-400">
            Sélectionnez une période avec des inscriptions
          </p>
        </div>
      </div>
    );
  }

  // Calculer le total
  const totalEnrollments = chartData.reduce(
    (sum, point) => sum + point.enrollments,
    0
  );

  return (
    <div className={className}>
      {/* Header avec total */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-medium text-gray-700">
            Nouvelles inscriptions
          </h4>
          <p className="text-xs text-gray-500 mt-0.5">Par jour</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-orange-600">
            {totalEnrollments}
          </div>
          <div className="text-xs text-gray-500">Total</div>
        </div>
      </div>

      {/* Graphique */}
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={chartData}
          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
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

          {/* Axe Y (inscriptions) */}
          <YAxis
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
            tickLine={false}
            allowDecimals={false}
          />

          {/* Tooltip personnalisé */}
          <Tooltip content={<CustomTooltip />} />

          {/* Area avec gradient */}
          <defs>
            <linearGradient id="enrollmentGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
            </linearGradient>
          </defs>

          {/* Area des inscriptions */}
          <Area
            type="monotone"
            dataKey="enrollments"
            stroke="#f97316"
            strokeWidth={3}
            fill="url(#enrollmentGradient)"
            dot={{
              fill: '#f97316',
              strokeWidth: 2,
              r: 4,
            }}
            activeDot={{
              r: 6,
              fill: '#ea580c',
              stroke: '#fff',
              strokeWidth: 2,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
