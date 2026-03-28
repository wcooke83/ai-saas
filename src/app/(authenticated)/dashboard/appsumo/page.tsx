'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { H1 } from '@/components/ui/heading';
import { KeyRound } from 'lucide-react';
import LicenseKeyRedemption from '@/components/dashboard/LicenseKeyRedemption';
import type { Database } from '@/types/database';

type Subscription = Database['public']['Tables']['subscriptions']['Row'];

export default function AppSumoPage() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [purchaseSource, setPurchaseSource] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient() as any;

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const { data: sub } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (sub) {
        setSubscription(sub);
        setPurchaseSource(sub.purchase_source);
      }

      setLoading(false);
    }

    loadData();
  }, [router, supabase]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-secondary-200 dark:bg-secondary-700 rounded animate-pulse" />
        <div className="h-48 bg-secondary-100 dark:bg-secondary-800 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary-100 dark:bg-primary-900/50 rounded-lg">
          <KeyRound className="w-6 h-6 text-primary-600 dark:text-primary-400" />
        </div>
        <div>
          <H1 variant="dashboard">Redeem License Key</H1>
          <p className="text-secondary-600 dark:text-secondary-400">
            Activate or upgrade your plan with a license key
          </p>
        </div>
      </div>

      <LicenseKeyRedemption
        purchaseSource={purchaseSource}
        currentPlanSlug={subscription?.plan}
        onRedeemed={() => window.location.reload()}
      />
    </div>
  );
}
