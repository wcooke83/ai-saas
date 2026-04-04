/**
 * PATCH /api/onboarding/[chatbotId]/step
 * Update the onboarding wizard step for a chatbot.
 *
 * Transition rules:
 *   - Forward: new step must be exactly current step + 1 (no skipping)
 *   - Backward: any step < current step is allowed (re-navigation)
 *   - Complete (null): allowed from any step (user can skip ahead to finish)
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { authenticate } from '@/lib/auth/session';
import { successResponse, errorResponse, APIError, parseBody } from '@/lib/api/utils';
import { getChatbot, updateChatbot } from '@/lib/chatbots/api';
import type { ChatbotUpdate } from '@/lib/chatbots/types';
import { trackActivationMilestone } from '@/lib/onboarding/activation';

const stepSchema = z.object({
  step: z.union([
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal(4),
    z.literal(5),
    z.null(),
  ]),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ chatbotId: string }> }
) {
  try {
    const user = await authenticate(req);
    if (!user) {
      throw APIError.unauthorized('Authentication required');
    }

    const { chatbotId } = await params;
    const input = await parseBody(req, stepSchema);

    // Fetch chatbot and verify ownership
    const chatbot = await getChatbot(chatbotId);
    if (!chatbot) {
      throw APIError.notFound('Chatbot not found');
    }
    if (chatbot.user_id !== user.id) {
      throw APIError.notFound('Chatbot not found');
    }
    if (chatbot.onboarding_step == null) {
      throw APIError.badRequest('Chatbot is not in onboarding');
    }

    const currentStep = chatbot.onboarding_step;

    // Validate step transition
    if (input.step !== null) {
      // Forward: must be exactly current + 1 (no skipping from 2 -> 4)
      if (input.step > currentStep && input.step !== currentStep + 1) {
        throw APIError.badRequest(
          `Cannot jump from step ${currentStep} to step ${input.step}. Complete step ${currentStep} first.`
        );
      }
      // Backward or same step: always allowed (re-navigation)
    }
    // null (complete): allowed from any step

    const updates: ChatbotUpdate = {
      onboarding_step: input.step,
    };

    // On completion, set widget_reviewed_at if not already set
    if (input.step === null && !chatbot.widget_reviewed_at) {
      updates.widget_reviewed_at = new Date().toISOString();
    }

    const updated = await updateChatbot(chatbotId, updates);

    // Track deploy milestone when user reaches step 5 (the deploy step)
    if (input.step === 5) {
      trackActivationMilestone(user.id, 'chatbot_deployed', { chatbot_id: chatbotId }).catch(() => {});
    }

    return successResponse({ chatbot: updated });
  } catch (error) {
    return errorResponse(error);
  }
}
