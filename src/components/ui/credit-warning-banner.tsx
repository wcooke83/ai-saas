'use client';

import * as React from 'react';
import { AlertTriangle, X, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface CreditWarningBannerProps {
  alertLevel: '75' | '90' | '100';
  available: number;
  onDismiss: () => void;
  onBuyCredits: () => void;
  className?: string;
}

const variantConfig = {
  '75': {
    wrapper: 'bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-700',
    icon: 'text-amber-600 dark:text-amber-400',
    title: 'text-amber-800 dark:text-amber-200',
    body: 'text-amber-700 dark:text-amber-300',
    dismiss: 'text-amber-500 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-200',
    heading: 'Running low on credits.',
    getMessage: (available: number) =>
      `${available.toLocaleString()} credits remaining this month.`,
    buttonVariant: 'default' as const,
  },
  '90': {
    wrapper: 'bg-orange-50 dark:bg-orange-900/20 border-orange-300 dark:border-orange-700',
    icon: 'text-orange-600 dark:text-orange-400',
    title: 'text-orange-800 dark:text-orange-200',
    body: 'text-orange-700 dark:text-orange-300',
    dismiss: 'text-orange-500 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-200',
    heading: 'Almost out of credits.',
    getMessage: (available: number) =>
      `Only ${available.toLocaleString()} credits left.`,
    buttonVariant: 'warning' as const,
  },
  '100': {
    wrapper: 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700',
    icon: 'text-red-600 dark:text-red-400',
    title: 'text-red-800 dark:text-red-200',
    body: 'text-red-700 dark:text-red-300',
    dismiss: 'text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-200',
    heading: 'Out of credits.',
    getMessage: () => 'AI features are paused until you add more.',
    buttonVariant: 'destructive' as const,
  },
};

export function CreditWarningBanner({
  alertLevel,
  available,
  onDismiss,
  onBuyCredits,
  className,
}: CreditWarningBannerProps) {
  const config = variantConfig[alertLevel];

  return (
    <div
      role="alert"
      className={cn(
        'relative rounded-lg border p-4 mb-6',
        config.wrapper,
        className
      )}
    >
      <div className="flex items-start gap-3">
        <AlertTriangle
          className={cn('w-5 h-5 flex-shrink-0 mt-0.5', config.icon)}
          aria-hidden="true"
        />
        <div className="flex-1 min-w-0">
          <h3 className={cn('text-sm font-semibold', config.title)}>
            {config.heading}{' '}
            <span className={cn('font-normal', config.body)}>
              {config.getMessage(available)}
            </span>
          </h3>
          <div className="mt-3">
            <Button
              size="sm"
              variant={config.buttonVariant}
              onClick={onBuyCredits}
            >
              <Zap className="w-4 h-4 mr-2" aria-hidden="true" />
              Buy Credits
            </Button>
          </div>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className={cn('flex-shrink-0 transition-colors', config.dismiss)}
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
