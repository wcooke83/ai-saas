/**
 * POST /api/onboarding/start
 * Create a chatbot from the onboarding wizard (step 1 complete, entering step 2).
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { authenticate, requireToolAccess } from '@/lib/auth/session';
import { successResponse, errorResponse, APIError, parseBody } from '@/lib/api/utils';
import {
  createChatbot,
  generateUniqueSlug,
  checkChatbotLimit,
} from '@/lib/chatbots/api';
import { DEFAULT_WIDGET_CONFIG, DEFAULT_FILE_UPLOAD_CONFIG } from '@/lib/chatbots/types';
import { getPlanLimits, FREE_PLAN_LIMITS } from '@/lib/chatbots/plan-limits';
import { createClient as createAdminClient } from '@/lib/supabase/admin';
import { trackActivationMilestone } from '@/lib/onboarding/activation';

const startSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  system_prompt: z.string().min(10, 'System prompt must be at least 10 characters').max(5000),
});

export async function POST(req: NextRequest) {
  try {
    const user = await authenticate(req);
    if (!user) {
      throw APIError.unauthorized('Authentication required');
    }

    await requireToolAccess(user, 'chatbots');

    const input = await parseBody(req, startSchema);

    // Check plan limits
    const canCreate = await checkChatbotLimit(user.id, user.plan || 'free');
    if (!canCreate) {
      throw APIError.forbidden(
        'You have reached the maximum number of chatbots for your plan. Upgrade to create more.'
      );
    }

    // generateSlug strips non-alphanumeric chars. If the name is entirely special
    // characters the slug would be empty, so fall back to a random ID.
    const slug = await generateUniqueSlug(user.id, input.name || 'chatbot');

    const planLimits = await getPlanLimits(user.plan || 'free').catch(() => FREE_PLAN_LIMITS);
    const monthlyMessageLimit = planLimits.monthlyMessageLimit;

    const chatbot = await createChatbot({
      user_id: user.id,
      name: input.name,
      slug,
      monthly_message_limit: monthlyMessageLimit,
      description: null,
      system_prompt: input.system_prompt,
      widget_config: DEFAULT_WIDGET_CONFIG,
      file_upload_config: DEFAULT_FILE_UPLOAD_CONFIG,
      language: 'en',
      welcome_message: 'Hi! How can I help you today?',
      enable_prompt_protection: true,
      status: 'draft',
      onboarding_step: 2,
    });

    // Update profile milestone if not already set
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const admin = createAdminClient() as any;
    const { data: profile } = await admin
      .from('profiles')
      .select('onboarding_milestones')
      .eq('id', user.id)
      .single();

    const milestones = (profile?.onboarding_milestones as Record<string, unknown>) || {};
    if (!milestones.first_chatbot_created_at) {
      await admin
        .from('profiles')
        .update({
          onboarding_milestones: {
            ...milestones,
            first_chatbot_created_at: new Date().toISOString(),
          },
        })
        .eq('id', user.id);
    }

    // Track activation milestones (fire-and-forget)
    trackActivationMilestone(user.id, 'onboarding_started').catch(() => {});
    trackActivationMilestone(user.id, 'chatbot_created', { chatbot_id: chatbot.id }).catch(() => {});

    return successResponse({ chatbot }, undefined, 201);
  } catch (error) {
    return errorResponse(error);
  }
}
