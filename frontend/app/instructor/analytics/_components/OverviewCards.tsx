'use client';

interface PercentageChange {
  value: number;
  direction: 'UP' | 'DOWN' | 'STABLE';
  isSignificant: boolean;
}

interface AnalyticsOverview {
  totalRevenue: number;
  totalEnrollments: number;
  averageCompletionRate: number;
  totalStudents: number;
  revenueChange: PercentageChange;
  enrollmentsChange: PercentageChange;
  completionRateChange: PercentageChange;
  studentsChange: PercentageChange;
}

interface OverviewCardsProps {
  data: AnalyticsOverview;
}

interface MetricCardProps {
  icon: string;
  label: string;
  value: string | number;
  change: PercentageChange;
  suffix?: string;
}

function MetricCard({ icon, label, value, change, suffix = '' }: MetricCardProps) {
  const getChangeColor = () => {
    if (change.direction === 'UP') return 'text-green-600';
    if (change.direction === 'DOWN') return 'text-red-600';
    return 'text-gray-600';
  };

  const getChangeIcon = () => {
    if (change.direction === 'UP') return '↑';
    if (change.direction === 'DOWN') return '↓';
    return '→';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Label avec icône */}
      <div className="text-sm font-medium text-gray-600 mb-3">
        {icon} {label}
      </div>

      {/* Valeur principale */}
      <div className="text-3xl font-bold text-gray-900 mb-2">
        {value}{suffix}
      </div>

      {/* Changement vs période précédente */}
      <div className="flex items-center">
        <span className={`inline-flex items-center text-sm font-medium ${getChangeColor()}`}>
          {getChangeIcon()}
          <span className="ml-1">{change.value.toFixed(1)}%</span>
        </span>
        <span className="ml-2 text-xs text-gray-500">vs période précédente</span>
      </div>
    </div>
  );
}

export function OverviewCards({ data }: OverviewCardsProps) {
  const cards = [
    {
      icon: '💰',
      label: 'Revenus totaux',
      value: data.totalRevenue.toFixed(2),
      suffix: ' €',
      change: data.revenueChange,
    },
    {
      icon: '📚',
      label: 'Inscriptions',
      value: data.totalEnrollments,
      suffix: '',
      change: data.enrollmentsChange,
    },
    {
      icon: '✅',
      label: 'Taux de complétion',
      value: data.averageCompletionRate.toFixed(1),
      suffix: '%',
      change: data.completionRateChange,
    },
    {
      icon: '👥',
      label: 'Étudiants actifs',
      value: data.totalStudents,
      suffix: '',
      change: data.studentsChange,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <MetricCard key={index} {...card} />
      ))}
    </div>
  );
}
