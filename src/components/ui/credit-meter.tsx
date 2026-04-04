'use client';

import * as React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Tooltip } from '@/components/ui/tooltip';

export interface CreditMeterProps {
  planCreditsLimit: number;      // -1 = unlimited
  planCreditsUsed: number;
  purchasedCredits: number;
  totalAvailable: number;
  periodEnd: string;             // ISO date string
  planSlug: string;
  alertLevel: '75' | '90' | '100' | null;
  collapsed?: boolean;
  className?: string;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function getBarColor(alertLevel: CreditMeterProps['alertLevel']): string {
  if (alertLevel === '100') return 'bg-red-500';
  if (alertLevel === '90') return 'bg-orange-500';
  if (alertLevel === '75') return 'bg-amber-500';
  return 'bg-primary-500';
}

function getDotColor(alertLevel: CreditMeterProps['alertLevel']): string {
  if (alertLevel === '100') return 'bg-red-500';
  if (alertLevel === '90') return 'bg-orange-500';
  if (alertLevel === '75') return 'bg-amber-500';
  return 'bg-primary-500';
}

export function CreditMeter({
  planCreditsLimit,
  planCreditsUsed,
  purchasedCredits,
  totalAvailable,
  periodEnd,
  alertLevel,
  collapsed = false,
  className,
}: CreditMeterProps) {
  const isUnlimited = planCreditsLimit === -1;

  if (isUnlimited) {
    if (collapsed) return null;
    return (
      <div className={cn('text-xs text-secondary-500 dark:text-secondary-400', className)}>
        <p className="font-medium text-secondary-700 dark:text-secondary-300">Credits</p>
        <p className="mt-0.5">Unlimited</p>
      </div>
    );
  }

  const planRemaining = Math.max(0, planCreditsLimit - planCreditsUsed);
  const planPercent = Math.min(100, Math.round((planCreditsUsed / planCreditsLimit) * 100));
  const purchasedPercent = purchasedCredits > 0 && planCreditsLimit > 0
    ? Math.min(100 - planPercent, Math.round((purchasedCredits / planCreditsLimit) * 100))
    : 0;
  const barColor = getBarColor(alertLevel);
  const dotColor = getDotColor(alertLevel);
  const periodEndFormatted = periodEnd ? formatDate(periodEnd) : null;

  const tooltipContent = `${totalAvailable.toLocaleString()} credits remaining (${planPercent}% used)`;

  if (collapsed) {
    return (
      <Tooltip content={tooltipContent} side="right" wrapperClassName="flex items-center justify-center py-1">
        <div
          className={cn('w-2 h-2 rounded-full', dotColor)}
          aria-label={tooltipContent}
        />
      </Tooltip>
    );
  }

  return (
    <Link
      href="/dashboard/billing"
      className={cn('block group/meter focus:outline-none focus:ring-2 focus:ring-primary-500 rounded', className)}
    >
      <p className="text-xs text-secondary-500 dark:text-secondary-400 mb-1.5">Credits</p>

      {/* Segmented bar: plan (blue) + purchased (green) */}
      <div
        className="h-1.5 rounded-full bg-secondary-200 dark:bg-secondary-700 overflow-hidden flex"
        role="progressbar"
        aria-valuenow={planPercent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={tooltipContent}
      >
        <div
          className={cn('h-full rounded-l-full transition-all', barColor)}
          style={{ width: `${planPercent}%` }}
        />
        {purchasedPercent > 0 && (
          <div
            className="h-full bg-green-500 transition-all"
            style={{ width: `${purchasedPercent}%` }}
          />
        )}
      </div>

      <p className="text-xs text-secondary-900 dark:text-secondary-100 mt-1 font-medium">
        {totalAvailable.toLocaleString()} remaining
      </p>

      <div className="flex items-center justify-between">
        {periodEndFormatted && (
          <p className="text-xs text-secondary-400 dark:text-secondary-500 mt-0.5">
            Resets {periodEndFormatted}
          </p>
        )}
        {purchasedCredits > 0 && (
          <p className="text-xs text-green-600 dark:text-green-400 mt-0.5">
            +{purchasedCredits.toLocaleString()} bought
          </p>
        )}
      </div>

      {planRemaining === 0 && (
        <p className="text-xs font-semibold text-red-600 dark:text-red-400 mt-1">
          Plan credits depleted
        </p>
      )}
    </Link>
  );
}
