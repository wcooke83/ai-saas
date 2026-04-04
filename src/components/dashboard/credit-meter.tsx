'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { CreditMeter as CreditMeterUI } from '@/components/ui/credit-meter';

interface UsageData {
  credits_used: number;
  credits_limit: number;
  period_end: string | null;
}

interface CreditMeterProps {
  collapsed: boolean;
}

export function CreditMeter({ collapsed }: CreditMeterProps) {
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [purchasedCredits, setPurchasedCredits] = useState(0);

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

      // Fetch purchased credits
      try {
        const res = await fetch('/api/billing/credits');
        if (res.ok) {
          const result = await res.json();
          const balance = result?.data?.balance;
          if (balance) {
            setPurchasedCredits((balance.purchasedCredits ?? 0) + (balance.bonusCredits ?? 0));
          }
        }
      } catch {
        // non-critical — omit purchased credits display
      }
    }
    fetchUsage();
  }, []);

  if (!usage) return null;
  if (usage.credits_limit >= 999999) return null;

  const planUsed = usage.credits_used;
  const planLimit = usage.credits_limit;
  const planRemaining = Math.max(0, planLimit - planUsed);
  const totalAvailable = planRemaining + purchasedCredits;
  const percentUsed = Math.round((planUsed / planLimit) * 100);

  let alertLevel: '75' | '90' | '100' | null = null;
  if (totalAvailable <= 0) alertLevel = '100';
  else if (percentUsed >= 90) alertLevel = '90';
  else if (percentUsed >= 75) alertLevel = '75';

  return (
    <CreditMeterUI
      planCreditsLimit={planLimit}
      planCreditsUsed={planUsed}
      purchasedCredits={purchasedCredits}
      totalAvailable={totalAvailable}
      periodEnd={usage.period_end ?? new Date().toISOString()}
      planSlug=""
      alertLevel={alertLevel}
      collapsed={collapsed}
    />
  );
}
