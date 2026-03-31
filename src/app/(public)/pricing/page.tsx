import { createAdminClient } from '@/lib/supabase/admin';
import type { SubscriptionPlan } from '@/types/billing';
import PricingClient from './pricing-client';

export const revalidate = 3600; // revalidate every hour

export default async function PricingPage() {
  let plans: SubscriptionPlan[] = [];

  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('is_active', true)
      .eq('is_hidden', false)
      .order('display_order', { ascending: true });

    plans = (data as SubscriptionPlan[]) ?? [];
  } catch (error) {
    console.error('Error fetching plans:', error);
  }

  return <PricingClient plans={plans} />;
}
