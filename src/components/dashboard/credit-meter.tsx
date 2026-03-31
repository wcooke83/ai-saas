'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Tooltip } from '@/components/ui/tooltip';

interface UsageData {
  credits_used: number;
  credits_limit: number;
  period_end: string | null;
}

interface CreditMeterProps {
  collapsed: boolean;
}

function getBarColor(percentUsed: number): string {
  if (percentUsed > 90) return 'bg-red-500';
  if (percentUsed >= 75) return 'bg-amber-500';
  return 'bg-primary-500';
}

function getDotColor(percentUsed: number): string {
  if (percentUsed > 90) return 'bg-red-500';
  if (percentUsed >= 75) return 'bg-amber-500';
  return 'bg-primary-500';
}

export function CreditMeter({ collapsed }: CreditMeterProps) {
  const [usage, setUsage] = useState<UsageData | null>(null);

  useEffect(() => {
    async function fetchUsage() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('usage')
        .select('credits_used, credits_limit, period_end')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data) setUsage(data);
    }
    fetchUsage();
  }, []);

  if (!usage) return null;
  if (usage.credits_limit >= 999999) return null;

  const percentUsed = Math.round((usage.credits_used / usage.credits_limit) * 100);
  const barColor = getBarColor(percentUsed);
  const dotColor = getDotColor(percentUsed);

  const periodEndFormatted = usage.period_end
    ? new Date(usage.period_end).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    : null;

  if (collapsed) {
    return (
      <Tooltip content={`Credits: ${percentUsed}% used this period`} side="right" wrapperClassName="flex items-center justify-center py-1">
        <div
          className={`w-2 h-2 rounded-full ${dotColor}`}
          aria-label={`Credits: ${percentUsed}% used this period`}
        />
      </Tooltip>
    );
  }

  return (
    <Link href="/dashboard/usage" className="block group/meter focus:outline-none focus:ring-2 focus:ring-primary-500 rounded">
      <p className="text-xs text-secondary-500 dark:text-secondary-400 mb-1.5">Credits</p>
      <div className="h-1.5 rounded-full bg-secondary-200 dark:bg-secondary-700 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${barColor}`}
          style={{ width: `${Math.min(percentUsed, 100)}%` }}
        />
      </div>
      <p className="text-xs text-secondary-400 mt-1">
        {usage.credits_used.toLocaleString()} / {usage.credits_limit.toLocaleString()}
      </p>
      {periodEndFormatted && (
        <p className="text-xs text-secondary-400 mt-0.5">Resets {periodEndFormatted}</p>
      )}
    </Link>
  );
}
