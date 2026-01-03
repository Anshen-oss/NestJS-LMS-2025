'use client';

import { endOfDay, format, startOfDay, startOfMonth, startOfYear, subDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import * as React from 'react';
import { DateRange } from 'react-day-picker';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface DateRangePickerProps {
  value: DateRange | undefined;
  onChange: (range: DateRange | undefined) => void;
  className?: string;
}

type Preset = {
  label: string;
  getValue: () => DateRange;
};

const presets: Preset[] = [
  {
    label: '7 derniers jours',
    getValue: () => ({
      from: startOfDay(subDays(new Date(), 6)),
      to: endOfDay(new Date()),
    }),
  },
  {
    label: '30 derniers jours',
    getValue: () => ({
      from: startOfDay(subDays(new Date(), 29)),
      to: endOfDay(new Date()),
    }),
  },
  {
    label: '90 derniers jours',
    getValue: () => ({
      from: startOfDay(subDays(new Date(), 89)),
      to: endOfDay(new Date()),
    }),
  },
  {
    label: 'Ce mois',
    getValue: () => ({
      from: startOfMonth(new Date()),
      to: endOfDay(new Date()),
    }),
  },
  {
    label: 'Cette année',
    getValue: () => ({
      from: startOfYear(new Date()),
      to: endOfDay(new Date()),
    }),
  },
];

export function DateRangePicker({
  value,
  onChange,
  className,
}: DateRangePickerProps) {
  const [date, setDate] = React.useState<DateRange | undefined>(value);
  const [isOpen, setIsOpen] = React.useState(false);

  // Update internal state when value prop changes
  React.useEffect(() => {
    setDate(value);
  }, [value]);

  const handleSelect = (range: DateRange | undefined) => {
    setDate(range);
  };

  const handlePresetClick = (preset: Preset) => {
    const range = preset.getValue();
    setDate(range);
    onChange(range);
    setIsOpen(false);
  };

  const handleApply = () => {
    if (date?.from && date?.to) {
      onChange(date);
      setIsOpen(false);
    }
  };

  const formatDateRange = () => {
    if (!date?.from) {
      return 'Sélectionner une période';
    }

    if (!date.to) {
      return format(date.from, 'dd MMM yyyy', { locale: fr });
    }

    return `${format(date.from, 'dd MMM', { locale: fr })} - ${format(
      date.to,
      'dd MMM yyyy',
      { locale: fr }
    )}`;
  };

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              'w-[300px] justify-start text-left font-normal text-black',
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {formatDateRange()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex">
            {/* Presets sidebar */}
            <div className="flex flex-col gap-1 border-r p-3">
              <div className="text-xs font-semibold text-muted-foreground mb-2">
                PÉRIODES
              </div>
              {presets.map((preset) => (
                <Button
                  key={preset.label}
                  variant="ghost"
                  size="sm"
                  className="justify-start font-normal"
                  onClick={() => handlePresetClick(preset)}
                >
                  {preset.label}
                </Button>
              ))}
            </div>

            {/* Calendar */}
            <div className="p-3">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={handleSelect}
                numberOfMonths={2}
                locale={fr}
              />

              {/* Apply button for custom range */}
              <div className="flex justify-end mt-3 pt-3 border-t">
                <Button
                  size="sm"
                  onClick={handleApply}
                  disabled={!date?.from || !date?.to}
                >
                  Appliquer
                </Button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
