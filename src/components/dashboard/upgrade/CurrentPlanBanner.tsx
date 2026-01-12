'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, ExternalLink } from 'lucide-react';
import type { SubscriptionPlan, SubscriptionDetails, EffectivePlan } from '@/types/billing';

interface CurrentPlanBannerProps {
  currentPlan: SubscriptionPlan | null;
  subscription: SubscriptionDetails | null;
  effectivePlan: EffectivePlan | null;
}

export function CurrentPlanBanner({
  currentPlan,
  subscription,
  effectivePlan,
}: CurrentPlanBannerProps) {
  if (!currentPlan && !effectivePlan) {
    return null;
  }

  const planName = effectivePlan?.planName || currentPlan?.name || 'Free';
  const isTrial = effectivePlan?.isTrial || false;
  const trialEndsAt = effectivePlan?.trialExpiresAt || subscription?.trialEndsAt;
  const cancelAtPeriodEnd = subscription?.cancelAtPeriodEnd || false;
  const currentPeriodEnd = subscription?.currentPeriodEnd;

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const daysUntil = (date: Date | null | undefined) => {
    if (!date) return null;
    const now = new Date();
    const target = new Date(date);
    const diff = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const trialDaysLeft = isTrial ? daysUntil(trialEndsAt) : null;

  return (
    <div className="bg-secondary-50 dark:bg-secondary-800/50 border border-secondary-200 dark:border-secondary-700 rounded-lg p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-secondary-600 dark:text-secondary-400">
                Current plan:
              </span>
              <span className="font-semibold text-secondary-900 dark:text-secondary-100">
                {planName}
              </span>
              {isTrial && (
                <Badge
                  variant="outline"
                  className="bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-700"
                >
                  <Clock className="w-3 h-3 mr-1" />
                  Trial
                </Badge>
              )}
              {cancelAtPeriodEnd && (
                <Badge variant="destructive">Canceling</Badge>
              )}
            </div>

            {/* Trial info */}
            {isTrial && trialDaysLeft !== null && (
              <p className="text-sm text-amber-600 dark:text-amber-400 mt-1 flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {trialDaysLeft === 0
                  ? 'Trial ends today'
                  : trialDaysLeft === 1
                    ? '1 day left in trial'
                    : `${trialDaysLeft} days left in trial`}
                {trialEndsAt && ` (${formatDate(trialEndsAt)})`}
              </p>
            )}

            {/* Billing date */}
            {!isTrial && currentPeriodEnd && (
              <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-1 flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {cancelAtPeriodEnd
                  ? `Access ends ${formatDate(currentPeriodEnd)}`
                  : `Next billing: ${formatDate(currentPeriodEnd)}`}
              </p>
            )}
          </div>
        </div>

        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/billing">
            Manage Subscription
            <ExternalLink className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
