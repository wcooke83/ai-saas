'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, X, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';

interface SubscriptionStatus {
  status: string;
  gracePeriodEndsAt: string | null;
  paymentFailedAt: string | null;
}

export function PastDueBanner() {
  const [subStatus, setSubStatus] = useState<SubscriptionStatus | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    async function checkStatus() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('subscriptions')
        .select('status, grace_period_ends_at')
        .eq('user_id', user.id)
        .maybeSingle();

      if (data && (data as any).status === 'past_due') {
        setSubStatus({
          status: (data as any).status,
          gracePeriodEndsAt: (data as any).grace_period_ends_at,
          paymentFailedAt: null, // Not used, will be added in future migration
        });
      }
    }

    checkStatus();
  }, []);

  if (!subStatus || subStatus.status !== 'past_due' || dismissed) {
    return null;
  }

  const graceEnd = subStatus.gracePeriodEndsAt ? new Date(subStatus.gracePeriodEndsAt) : null;
  const now = new Date();
  const isGraceExpired = graceEnd && graceEnd <= now;
  const daysRemaining = graceEnd
    ? Math.max(0, Math.ceil((graceEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
    : 0;

  return (
    <div
      className={`relative rounded-lg border p-4 mb-6 ${
        isGraceExpired
          ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700'
          : 'bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-700'
      }`}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <AlertTriangle
          className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
            isGraceExpired
              ? 'text-red-600 dark:text-red-400'
              : 'text-amber-600 dark:text-amber-400'
          }`}
          aria-hidden="true"
        />
        <div className="flex-1 min-w-0">
          <h3
            className={`text-sm font-semibold ${
              isGraceExpired
                ? 'text-red-800 dark:text-red-200'
                : 'text-amber-800 dark:text-amber-200'
            }`}
          >
            {isGraceExpired
              ? 'Your account has been restricted'
              : 'Payment failed — action required'}
          </h3>
          <p
            className={`text-sm mt-1 ${
              isGraceExpired
                ? 'text-red-700 dark:text-red-300'
                : 'text-amber-700 dark:text-amber-300'
            }`}
          >
            {isGraceExpired
              ? 'Your subscription payment is overdue and the grace period has expired. Your account features are restricted until payment is resolved.'
              : `We were unable to process your subscription payment. Please update your payment method within ${daysRemaining} day${daysRemaining === 1 ? '' : 's'} to avoid service interruption.`}
          </p>
          <div className="mt-3">
            <Button size="sm" variant={isGraceExpired ? 'destructive' : 'default'} asChild>
              <Link href="/dashboard/billing">
                <CreditCard className="w-4 h-4 mr-2" aria-hidden="true" />
                Update Payment Method
              </Link>
            </Button>
          </div>
        </div>
        {!isGraceExpired && (
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="text-amber-500 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-200"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
