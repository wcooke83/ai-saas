/**
 * GET /api/onboarding/status
 * Returns the user's current onboarding state for the wizard to rehydrate on page load.
 */

import { NextRequest } from 'next/server';
import { authenticate } from '@/lib/auth/session';
import { successResponse, errorResponse, APIError } from '@/lib/api/utils';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(req: NextRequest) {
  try {
    const user = await authenticate(req);
    if (!user) {
      throw APIError.unauthorized('Authentication required');
    }

    const supabase = createAdminClient();

    // Fetch profile onboarding state
    const { data: profile, error: profileError } = await (supabase as any)
      .from('profiles')
      .select('onboarding_step, onboarding_completed_at')
      .eq('id', user.id)
      .single();

    if (profileError) throw profileError;

    // Fetch recorded milestones
    const { data: events } = await (supabase as any)
      .from('onboarding_activation_events')
      .select('milestone')
      .eq('user_id', user.id);

    const milestones: string[] = (events ?? []).map(
      (e: { milestone: string }) => e.milestone,
    );

    // Fetch first onboarding chatbot
    const { data: chatbotRow } = await (supabase as any)
      .from('chatbots')
      .select('id')
      .eq('user_id', user.id)
      .not('onboarding_step', 'is', null)
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle();

    return successResponse({
      step: profile?.onboarding_step ?? 1,
      completedAt: profile?.onboarding_completed_at ?? null,
      milestones,
      chatbotId: chatbotRow?.id ?? null,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
