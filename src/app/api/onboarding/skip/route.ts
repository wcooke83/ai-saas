/**
 * POST /api/onboarding/skip
 * Mark onboarding complete for the current user without finishing the wizard.
 * Sets profiles.onboarding_completed_at = now() so the middleware won't
 * redirect them back to /onboarding on next login.
 */

import { NextRequest } from 'next/server';
import { authenticate } from '@/lib/auth/session';
import { successResponse, errorResponse, APIError } from '@/lib/api/utils';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
  try {
    const user = await authenticate(req);
    if (!user) {
      throw APIError.unauthorized('Authentication required');
    }

    const admin = createAdminClient();
    const { error } = await admin
      .from('profiles')
      .update({ onboarding_completed_at: new Date().toISOString() })
      .eq('id', user.id);

    if (error) throw error;

    return successResponse({ skipped: true });
  } catch (error) {
    return errorResponse(error);
  }
}
