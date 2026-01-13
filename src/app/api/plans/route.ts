/**
 * Public Plans API
 * Returns active, non-hidden plans for public pricing page
 */

import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import type { SubscriptionPlan } from '@/types/billing';

export async function GET() {
  try {
    const supabase = createAdminClient();

    // Fetch all active, non-hidden plans ordered by display_order
    const { data: plans, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('is_active', true)
      .eq('is_hidden', false)
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching plans:', error);
      return NextResponse.json(
        { error: 'Failed to fetch plans' },
        { status: 500 }
      );
    }

    return NextResponse.json({ plans: plans as SubscriptionPlan[] });
  } catch (error) {
    console.error('Error in public plans API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
