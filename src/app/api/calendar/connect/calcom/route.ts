/**
 * Cal.com Connection API
 * POST /api/calendar/connect/calcom - Validate and store customer's Cal.com API key
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { authenticate } from '@/lib/auth/session';
import { successResponse, errorResponse, APIError, parseBody } from '@/lib/api/utils';
import { createAdminClient } from '@/lib/supabase/admin';
import { createCalendarProvider } from '@/lib/calendar/provider-factory';

const connectSchema = z.object({
  chatbotId: z.string().uuid(),
  apiKey: z.string().min(1),
  baseUrl: z.string().url(),
  eventTypeId: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const user = await authenticate(req);
    if (!user) throw APIError.unauthorized();

    const input = await parseBody(req, connectSchema);

    // Verify chatbot ownership
    const supabase = createAdminClient();
    const { data: chatbot } = await supabase
      .from('chatbots')
      .select('user_id')
      .eq('id', input.chatbotId)
      .single();

    if (!chatbot || chatbot.user_id !== user.id) {
      throw APIError.forbidden();
    }

    // Validate the API key by making a test request
    const config = {
      api_key: input.apiKey,
      base_url: input.baseUrl,
      event_type_id: input.eventTypeId,
    };

    const adapter = createCalendarProvider('customer_calcom', config);
    const validation = await adapter.validateConfig();

    if (!validation.valid) {
      throw APIError.badRequest(validation.error || 'Invalid Cal.com configuration');
    }

    // Deactivate existing customer_calcom integrations for this chatbot
    await supabase
      .from('calendar_integrations')
      .update({ is_active: false })
      .eq('chatbot_id', input.chatbotId)
      .eq('provider', 'customer_calcom');

    // Create new integration
    const { data: integration, error } = await supabase
      .from('calendar_integrations')
      .insert({
        chatbot_id: input.chatbotId,
        user_id: user.id,
        provider: 'customer_calcom',
        is_active: true,
        config,
      })
      .select()
      .single();

    if (error) throw error;

    return successResponse({ integration, validated: true });
  } catch (error) {
    return errorResponse(error);
  }
}
