'use client';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationControlsProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onNextPage: () => void;
  onPreviousPage: () => void;
}

export default function PaginationControls({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  onNextPage,
  onPreviousPage,
}: PaginationControlsProps) {
  const totalPages = Math.ceil(total / pageSize);
  const startIndex = (page - 1) * pageSize + 1;
  const endIndex = Math.min(page * pageSize, total);

  return (
    <div className="bg-white rounded-lg border p-4 mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Infos */}
      <div className="!text-sm !text-gray-900">
        <p>
          Affichage <span className="!font-semibold">{startIndex}</span> à{' '}
          <span className="!font-semibold">{endIndex}</span> sur{' '}
          <span className="!font-semibold">{total}</span> étudiants
        </p>
      </div>

      {/* Contrôles */}
      <div className="flex items-center gap-4">
        {/* Étudiants par page */}
        <div className="flex items-center gap-2">
          <label className="!text-sm !text-gray-900 !font-medium">Par page:</label>
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => onPageSizeChange(parseInt(value))}
          >
            <SelectTrigger
              className="!w-20 !bg-white !text-gray-900 !border !border-gray-300"
              style={{
                backgroundColor: 'white',
                color: '#111827',
                borderColor: '#d1d5db'
              }}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Numéro de page */}
        <div className="hidden sm:flex items-center gap-2">
          <label className="!text-sm !text-gray-900 !font-medium">Page:</label>
          <Select
            value={page.toString()}
            onValueChange={(value) => onPageChange(parseInt(value))}
          >
            <SelectTrigger
              className="!w-24 !bg-white !text-gray-900 !border !border-gray-300"
              style={{
                backgroundColor: 'white',
                color: '#111827',
                borderColor: '#d1d5db'
              }}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <SelectItem key={p} value={p.toString()}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="!text-sm !text-gray-900 !font-medium">
            sur {totalPages}
          </span>
        </div>

        {/* Boutons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={onPreviousPage}
            disabled={page === 1}
            className="!text-gray-900 !border-gray-300"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={onNextPage}
            disabled={endIndex >= total}
            className="!text-gray-900 !border-gray-300"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
