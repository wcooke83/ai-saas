/**
 * Calendar Integrations API
 * GET /api/calendar/integrations?chatbotId=xxx - Get integration for a chatbot
 * POST /api/calendar/integrations - Create/update hosted Cal.com integration
 * DELETE /api/calendar/integrations?id=xxx - Remove an integration
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { authenticate } from '@/lib/auth/session';
import { successResponse, errorResponse, APIError, parseBody } from '@/lib/api/utils';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(req: NextRequest) {
  try {
    const user = await authenticate(req);
    if (!user) throw APIError.unauthorized();

    const chatbotId = req.nextUrl.searchParams.get('chatbotId');
    if (!chatbotId) throw APIError.badRequest('chatbotId is required');

    // Verify ownership
    const supabase = createAdminClient();
    const { data: chatbot } = await supabase
      .from('chatbots')
      .select('user_id')
      .eq('id', chatbotId)
      .single();

    if (!chatbot || chatbot.user_id !== user.id) {
      throw APIError.forbidden();
    }

    const { data: integration } = await supabase
      .from('calendar_integrations')
      .select('*')
      .eq('chatbot_id', chatbotId)
      .eq('is_active', true)
      .maybeSingle();

    // Also get recent bookings
    const { data: bookings } = await supabase
      .from('calendar_bookings')
      .select('*')
      .eq('chatbot_id', chatbotId)
      .order('created_at', { ascending: false })
      .limit(50);

    return successResponse({ integration, bookings: bookings || [] });
  } catch (error) {
    return errorResponse(error);
  }
}

const hostedCalcomSchema = z.object({
  chatbotId: z.string().uuid(),
  config: z.object({
    calcom_user_id: z.string().optional(),
    event_type_id: z.string().optional(),
    calendar_id: z.string().optional(),
  }),
});

export async function POST(req: NextRequest) {
  try {
    const user = await authenticate(req);
    if (!user) throw APIError.unauthorized();

    const input = await parseBody(req, hostedCalcomSchema);

    // Verify ownership
    const supabase = createAdminClient();
    const { data: chatbot } = await supabase
      .from('chatbots')
      .select('user_id')
      .eq('id', input.chatbotId)
      .single();

    if (!chatbot || chatbot.user_id !== user.id) {
      throw APIError.forbidden();
    }

    // Deactivate all existing integrations for this chatbot
    await supabase
      .from('calendar_integrations')
      .update({ is_active: false })
      .eq('chatbot_id', input.chatbotId);

    // Create hosted Cal.com integration
    const { data: integration, error } = await supabase
      .from('calendar_integrations')
      .insert({
        chatbot_id: input.chatbotId,
        user_id: user.id,
        provider: 'hosted_calcom',
        is_active: true,
        config: input.config,
      })
      .select()
      .single();

    if (error) throw error;

    return successResponse(integration);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await authenticate(req);
    if (!user) throw APIError.unauthorized();

    const id = req.nextUrl.searchParams.get('id');
    if (!id) throw APIError.badRequest('id is required');

    const supabase = createAdminClient();

    // Verify ownership
    const { data: integration } = await supabase
      .from('calendar_integrations')
      .select('user_id')
      .eq('id', id)
      .single();

    if (!integration || integration.user_id !== user.id) {
      throw APIError.forbidden();
    }

    await supabase
      .from('calendar_integrations')
      .update({ is_active: false })
      .eq('id', id);

    return successResponse({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
}
