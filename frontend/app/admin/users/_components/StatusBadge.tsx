'use client';

import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle } from 'lucide-react';

interface StatusBadgeProps {
  isActive: boolean;
  isBanned?: boolean;
}

export function StatusBadge({ isActive, isBanned }: StatusBadgeProps) {
  if (isBanned) {
    return (
      <Badge className="bg-red-100 text-red-700 border-red-300 inline-flex items-center gap-1">
        <XCircle className="w-4 h-4" />
        Banni
      </Badge>
    );
  }

  return (
    <Badge
      className={`inline-flex items-center gap-1 ${
        isActive
          ? 'bg-green-100 text-green-700 border-green-300'
          : 'bg-yellow-100 text-yellow-700 border-yellow-300'
      }`}
    >
      <CheckCircle2 className="w-4 h-4" />
      {isActive ? 'Actif' : 'Inactif'}
    </Badge>
  );
}
