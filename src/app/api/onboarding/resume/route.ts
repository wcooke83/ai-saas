/**
 * GET /api/onboarding/resume
 * Find the user's in-progress onboarding chatbot.
 */

import { NextRequest } from 'next/server';
import { authenticate } from '@/lib/auth/session';
import { successResponse, errorResponse, APIError } from '@/lib/api/utils';
import { createClient } from '@/lib/supabase/server';
import type { Chatbot } from '@/lib/chatbots/types';

export async function GET(req: NextRequest) {
  try {
    const user = await authenticate(req);
    if (!user) {
      throw APIError.unauthorized('Authentication required');
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from('chatbots')
      .select('*')
      .eq('user_id', user.id)
      .not('onboarding_step', 'is', null)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;

    return successResponse({ chatbot: (data as unknown as Chatbot) ?? null });
  } catch (error) {
    return errorResponse(error);
  }
}
