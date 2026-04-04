/**
 * POST /api/onboarding/complete
 * Called by the wizard when the user finishes or explicitly skips onboarding.
 *
 * Body: { milestone: 'completed' | 'skipped', step?: number }
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { authenticate } from '@/lib/auth/session';
import { successResponse, errorResponse, APIError, parseBody } from '@/lib/api/utils';
import { createAdminClient } from '@/lib/supabase/admin';
import { trackActivationMilestone } from '@/lib/onboarding/activation';

const completeSchema = z.object({
  milestone: z.enum(['completed', 'skipped']),
  step: z.number().int().min(1).max(5).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const user = await authenticate(req);
    if (!user) {
      throw APIError.unauthorized('Authentication required');
    }

    const input = await parseBody(req, completeSchema);

    const supabase = createAdminClient();

    if (input.milestone === 'completed') {
      // Mark profile as onboarding complete
      await (supabase as any)
        .from('profiles')
        .update({ onboarding_completed_at: new Date().toISOString() })
        .eq('id', user.id);

      await trackActivationMilestone(user.id, 'onboarding_completed', {
        step_reached: input.step ?? null,
      });
    } else {
      await trackActivationMilestone(user.id, 'onboarding_skipped', {
        step_reached: input.step ?? null,
      });
    }

    return successResponse({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
