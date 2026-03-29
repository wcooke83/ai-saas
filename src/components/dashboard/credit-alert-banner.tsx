'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, X, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';

interface CreditUsage {
  credits_used: number;
  credits_limit: number;
  period_start: string;
}

export function CreditAlertBanner() {
  const [creditUsage, setCreditUsage] = useState<CreditUsage | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    async function checkCredits() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('usage')
        .select('credits_used, credits_limit, period_start')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data) {
        setCreditUsage(data as CreditUsage);
      }
    }

    checkCredits();
  }, []);

  if (!creditUsage) return null;

  const { credits_used, credits_limit, period_start } = creditUsage;

  // Unlimited plans
  if (credits_limit >= 999999) return null;

  const percentUsed = Math.round((credits_used / credits_limit) * 100);

  if (percentUsed < 75) return null;

  const threshold = percentUsed >= 90 ? 90 : 75;
  const dismissKey = `credit-alert-dismissed-${threshold}-${period_start}`;

  // Check localStorage dismissal (done after threshold calculation so key is stable)
  if (typeof window !== 'undefined' && localStorage.getItem(dismissKey) === 'true') {
    return null;
  }

  if (dismissed) return null;

  function handleDismiss() {
    if (typeof window !== 'undefined') {
      localStorage.setItem(dismissKey, 'true');
    }
    setDismissed(true);
  }

  if (threshold === 90) {
    return (
      <div
        className="relative rounded-lg border p-4 mb-6 bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700"
        role="alert"
      >
        <div className="flex items-start gap-3">
          <AlertTriangle
            className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-600 dark:text-red-400"
            aria-hidden="true"
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-red-800 dark:text-red-200">
              Only 10% of your credits remain
            </h3>
            <p className="text-sm mt-1 text-red-700 dark:text-red-300">
              When you hit zero, all your chatbots go offline and stop answering questions. Add credits now or enable auto-topup before that happens.
            </p>
            <div className="mt-3">
              <Button size="sm" variant="destructive" asChild>
                <Link href="/dashboard/billing">
                  <Zap className="w-4 h-4 mr-2" aria-hidden="true" />
                  Add Credits Now
                </Link>
              </Button>
            </div>
          </div>
          <button
            type="button"
            onClick={handleDismiss}
            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-200"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <p className="mt-2 ml-8 text-xs">
          <button
            type="button"
            onClick={handleDismiss}
            className="text-red-600 dark:text-red-400 hover:underline"
          >
            I'll handle it later
          </button>
        </p>
      </div>
    );
  }

  return (
    <div
      className="relative rounded-lg border p-4 mb-6 bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-700"
      role="alert"
    >
      <div className="flex items-start gap-3">
        <AlertTriangle
          className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-600 dark:text-amber-400"
          aria-hidden="true"
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-200">
            You've used 75% of your monthly credits
          </h3>
          <p className="text-sm mt-1 text-amber-700 dark:text-amber-300">
            Your chatbots will stop responding when credits run out. Enable auto-topup to stay online automatically, or buy more credits now.
          </p>
          <div className="mt-3">
            <Button size="sm" variant="default" asChild>
              <Link href="/dashboard/billing">
                <Zap className="w-4 h-4 mr-2" aria-hidden="true" />
                Add Credits
              </Link>
            </Button>
          </div>
        </div>
        <button
          type="button"
          onClick={handleDismiss}
          className="text-amber-500 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-200"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <p className="mt-2 ml-8 text-xs">
        <button
          type="button"
          onClick={handleDismiss}
          className="text-amber-600 dark:text-amber-400 hover:underline"
        >
          Remind me later
        </button>
      </p>
    </div>
  );
}
