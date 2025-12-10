import { cn } from '@/lib/utils';

interface ProgressBarProps {
  percentage: number;
  completedCount: number;
  totalCount: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export function ProgressBar({
  percentage,
  completedCount,
  totalCount,
  size = 'md',
  showLabel = true,
  className,
}: ProgressBarProps) {
  const heights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-3',
  };

  return (
    <div className={cn('space-y-2', className)}>
      {/* Barre de progression */}
      <div className={cn('w-full bg-gray-200 rounded-full overflow-hidden', heights[size])}>
        <div
className="h-full bg-gradient-to-r from-purple-500 to-violet-600 transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Label */}
      {showLabel && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">
            {completedCount} / {totalCount} leçons
          </span>
          <span className="font-semibold text-gray-900">
            {percentage}% complété
          </span>
        </div>
      )}
    </div>
  );
}
