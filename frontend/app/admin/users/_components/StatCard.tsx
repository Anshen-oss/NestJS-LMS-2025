'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: number | undefined;
  icon: LucideIcon;
  borderColor: string;
  bgColor: string;
  trend?: { value: number; direction: 'up' | 'down' };
}

export function StatCard({
  label,
  value,
  icon: Icon,
  borderColor,
  bgColor,
  trend,
}: StatCardProps) {
  const colorMap = {
    'border-l-blue-500': { bg: 'bg-blue-600', text: 'text-blue-600', light: 'bg-blue-50' },
    'border-l-green-500': { bg: 'bg-green-600', text: 'text-green-600', light: 'bg-green-50' },
    'border-l-orange-500': { bg: 'bg-orange-600', text: 'text-orange-600', light: 'bg-orange-50' },
    'border-l-purple-500': { bg: 'bg-purple-600', text: 'text-purple-600', light: 'bg-purple-50' },
    'border-l-amber-500': { bg: 'bg-amber-600', text: 'text-amber-600', light: 'bg-amber-50' },
  };

  const colors = colorMap[borderColor as keyof typeof colorMap] || colorMap['border-l-blue-500'];

  return (
    <Card className={`relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 ${colors.light}`}>
      {/* Top Color Bar */}
      <div className={`h-1.5 ${colors.bg} w-full`} />

      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-bold text-gray-700">
            {label}
          </CardTitle>
          <div className={`p-3 rounded-lg ${colors.bg} text-white`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className={`text-4xl font-black ${colors.text}`}>
          {value ?? 0}
        </div>

        {trend && (
          <div className={`text-xs font-bold ${trend.direction === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trend.direction === 'up' ? '✨ Croissance' : '⚠️ Baisse'}: {trend.direction === 'up' ? '+' : '-'}{Math.abs(trend.value)}%
          </div>
        )}
      </CardContent>
    </Card>
  );
}
