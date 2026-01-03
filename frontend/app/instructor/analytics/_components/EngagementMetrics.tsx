'use client';

import { Award, Clock, TrendingUp, Users } from 'lucide-react';

interface EngagementMetricsProps {
  averageWatchTime: number; // en minutes
  totalStudents: number;
  averageCompletionRate: number;
  totalEnrollments: number;
}

interface MetricItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtext: string;
  color: string;
}

function MetricItem({ icon, label, value, subtext, color }: MetricItemProps) {
  return (
    <div className="flex items-start gap-3">
      <div className={`p-2 rounded-lg ${color}`}>{icon}</div>
      <div className="flex-1">
        <div className="text-sm text-gray-600 mb-1">{label}</div>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <div className="text-xs text-gray-500 mt-0.5">{subtext}</div>
      </div>
    </div>
  );
}

export function EngagementMetrics({
  averageWatchTime,
  totalStudents,
  averageCompletionRate,
  totalEnrollments,
}: EngagementMetricsProps) {
  // Calculer des métriques dérivées
  const averageEnrollmentsPerStudent =
    totalStudents > 0 ? totalEnrollments / totalStudents : 0;

  // Convertir temps en format lisible
  const formatWatchTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes.toFixed(0)} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}min`;
  };

  // Déterminer le niveau d'engagement
  const getEngagementLevel = () => {
    if (averageCompletionRate >= 80) return { label: 'Excellent', color: 'text-green-600' };
    if (averageCompletionRate >= 60) return { label: 'Bon', color: 'text-blue-600' };
    if (averageCompletionRate >= 40) return { label: 'Moyen', color: 'text-orange-600' };
    return { label: 'Faible', color: 'text-red-600' };
  };

  const engagementLevel = getEngagementLevel();

  const metrics = [
    {
      icon: <Clock className="h-5 w-5 text-blue-600" />,
      label: 'Temps de visionnage moyen',
      value: formatWatchTime(averageWatchTime),
      subtext: 'Par étudiant actif',
      color: 'bg-blue-50',
    },
    {
      icon: <Users className="h-5 w-5 text-purple-600" />,
      label: 'Inscriptions par étudiant',
      value: averageEnrollmentsPerStudent.toFixed(1),
      subtext: totalStudents > 1 ? 'Étudiants multi-cours' : 'Cours unique',
      color: 'bg-purple-50',
    },
    {
      icon: <TrendingUp className="h-5 w-5 text-orange-600" />,
      label: 'Taux de complétion',
      value: `${averageCompletionRate.toFixed(1)}%`,
      subtext: 'Leçons complétées',
      color: 'bg-orange-50',
    },
    {
      icon: <Award className="h-5 w-5 text-green-600" />,
      label: 'Niveau d&apos;engagement',
      value: engagementLevel.label,
      subtext: `Basé sur la complétion (${averageCompletionRate.toFixed(0)}%)`,
      color: 'bg-green-50',
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          📊 Métriques d&apos;engagement
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Comment vos étudiants interagissent avec vos cours
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {metrics.map((metric, index) => (
          <MetricItem key={index} {...metric} />
        ))}
      </div>

      {/* Insights Section */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">
          💡 Insights
        </h4>
        <div className="space-y-2">
          {averageCompletionRate >= 80 && (
            <div className="flex items-start gap-2 text-sm">
              <span className="text-green-600">✓</span>
              <p className="text-gray-700">
                Excellent taux de complétion! Vos étudiants sont très engagés.
              </p>
            </div>
          )}

          {averageCompletionRate < 50 && (
            <div className="flex items-start gap-2 text-sm">
              <span className="text-orange-600">!</span>
              <p className="text-gray-700">
                Taux de complétion modéré. Envisagez d&apos;ajouter plus d&apos;interactions ou de raccourcir les leçons.
              </p>
            </div>
          )}

          {averageWatchTime < 10 && totalStudents > 0 && (
            <div className="flex items-start gap-2 text-sm">
              <span className="text-blue-600">ℹ</span>
              <p className="text-gray-700">
                Temps de visionnage faible. Vérifiez si vos leçons captent l&apos;attention dès le début.
              </p>
            </div>
          )}

          {averageEnrollmentsPerStudent > 1.5 && (
            <div className="flex items-start gap-2 text-sm">
              <span className="text-purple-600">★</span>
              <p className="text-gray-700">
                Vos étudiants s&apos;inscrivent à plusieurs cours! Excellente fidélisation.
              </p>
            </div>
          )}

          {totalStudents === 0 && (
            <div className="flex items-start gap-2 text-sm">
              <span className="text-gray-400">—</span>
              <p className="text-gray-500">
                Pas encore d&apos;étudiants actifs dans cette période.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
