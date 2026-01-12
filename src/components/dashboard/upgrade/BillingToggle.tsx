'use client';

import { Badge } from '@/components/ui/badge';

interface BillingToggleProps {
  isYearly: boolean;
  onToggle: (isYearly: boolean) => void;
  savingsPercent?: number;
}

export function BillingToggle({
  isYearly,
  onToggle,
  savingsPercent = 20,
}: BillingToggleProps) {
  return (
    <div className="flex items-center justify-center gap-4">
      <span
        className={`text-sm font-medium transition-colors ${
          !isYearly
            ? 'text-secondary-900 dark:text-secondary-100'
            : 'text-secondary-500 dark:text-secondary-400'
        }`}
      >
        Monthly
      </span>
      <button
        onClick={() => onToggle(!isYearly)}
        className={`relative w-14 h-8 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-secondary-900 ${
          isYearly
            ? 'bg-primary-600 dark:bg-primary-500'
            : 'bg-secondary-300 dark:bg-secondary-600'
        }`}
        role="switch"
        aria-checked={isYearly}
        aria-label="Toggle annual billing"
      >
        <span
          className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow transition-transform ${
            isYearly ? 'translate-x-6' : ''
          }`}
        />
      </button>
      <span
        className={`text-sm font-medium transition-colors ${
          isYearly
            ? 'text-secondary-900 dark:text-secondary-100'
            : 'text-secondary-500 dark:text-secondary-400'
        }`}
      >
        Annual
      </span>
      <Badge
        variant="outline"
        className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-700"
      >
        Save {savingsPercent}%
      </Badge>
    </div>
  );
}
