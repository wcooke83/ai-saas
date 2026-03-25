/**
 * Calendar Integrations API
 * GET /api/calendar/integrations?chatbotId=xxx - Get integration for a chatbot
 * DELETE /api/calendar/integrations?id=xxx - Remove an integration
 */

import { NextRequest } from 'next/server';
import { authenticate } from '@/lib/auth/session';
import { successResponse, errorResponse, APIError } from '@/lib/api/utils';
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
      throw APIError.notFound('Chatbot not found');
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
      throw APIError.notFound('Integration not found');
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
