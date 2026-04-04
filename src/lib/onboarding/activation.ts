/**
 * Onboarding activation milestone tracker.
 * All writes use the admin client so they bypass RLS and are not
 * blocked by an unauthenticated (embed widget) request context.
 */

import { createAdminClient } from '@/lib/supabase/admin';

export type OnboardingMilestone =
  | 'onboarding_started'
  | 'chatbot_created'
  | 'knowledge_added'
  | 'first_test_message'
  | 'chatbot_deployed'
  | 'onboarding_completed'
  | 'onboarding_skipped'
  | 'onboarding_abandoned';

/**
 * Milestones that should only be recorded once per user.
 * Calling trackActivationMilestone for these a second time is a no-op.
 */
const ONCE_MILESTONES: ReadonlySet<OnboardingMilestone> = new Set([
  'onboarding_started',
  'chatbot_created',
  'knowledge_added',
  'first_test_message',
  'chatbot_deployed',
  'onboarding_completed',
]);

/**
 * Record an onboarding activation milestone for a user.
 * Idempotent for milestones in ONCE_MILESTONES — safe to call multiple times.
 * Never throws; logs errors to console.
 */
export async function trackActivationMilestone(
  userId: string,
  milestone: OnboardingMilestone,
  metadata?: Record<string, unknown>,
): Promise<void> {
  try {
    const supabase = createAdminClient();

    if (ONCE_MILESTONES.has(milestone)) {
      const { count } = await (supabase as any)
        .from('onboarding_activation_events')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('milestone', milestone);

      if (count && count > 0) return;
    }

    const { error } = await (supabase as any)
      .from('onboarding_activation_events')
      .insert({
        user_id: userId,
        milestone,
        metadata: metadata ?? null,
      });

    if (error) {
      console.error(`[Activation] Failed to record milestone ${milestone}:`, error.message);
    }
  } catch (err) {
    console.error(`[Activation] Unexpected error recording milestone ${milestone}:`, err);
  }
}
