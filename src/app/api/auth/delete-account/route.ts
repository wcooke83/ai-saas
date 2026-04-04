/**
 * Delete Account API
 *
 * Permanently deletes the authenticated user's account, all chatbots,
 * knowledge sources, conversations, and associated Stripe data.
 *
 * POST /api/auth/delete-account
 * Requires: authenticated session
 */

import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireAuth } from '@/lib/auth/session';
import { successResponse, errorResponse, APIError } from '@/lib/api/utils';

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(req);

    const supabase = createAdminClient();

    // 1. Delete all chatbots (cascade handles knowledge_sources, chunks, sessions, messages)
    await (supabase as any).from('chatbots').delete().eq('user_id', user.id);

    // 2. Try to cancel Stripe subscription (non-fatal)
    try {
      const { data: sub } = await (supabase as any)
        .from('subscriptions')
        .select('stripe_subscription_id')
        .eq('user_id', user.id)
        .single();

      if (sub?.stripe_subscription_id) {
        const { getStripeClient, isStripeConfigured } = await import('@/lib/stripe/client');
        if (isStripeConfigured()) {
          const stripe = getStripeClient();
          await stripe.subscriptions.cancel(sub.stripe_subscription_id);
        }
      }
    } catch {
      // Non-fatal: continue with account deletion
    }

    // 3. Delete the Supabase auth user (this also cascades profile via trigger)
    const adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const { error: deleteError } = await adminClient.auth.admin.deleteUser(user.id);
    if (deleteError) {
      throw new APIError(`Failed to delete user: ${deleteError.message}`, 500);
    }

    return successResponse({ message: 'Account deleted successfully' });
  } catch (err) {
    return errorResponse(err);
  }
}
