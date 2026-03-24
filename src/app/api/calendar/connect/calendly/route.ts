/**
 * Calendly OAuth Callback
 * GET /api/calendar/connect/calendly - Handle OAuth authorization code exchange
 */

import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/lib/auth/session';
import { errorResponse, APIError } from '@/lib/api/utils';
import { createAdminClient } from '@/lib/supabase/admin';
import { exchangeCalendlyCode } from '@/lib/calendar/providers/calendly';

export async function GET(req: NextRequest) {
  try {
    const user = await authenticate(req);
    if (!user) throw APIError.unauthorized();

    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state'); // contains chatbotId
    const error = searchParams.get('error');

    if (error) {
      // Redirect back to dashboard with error
      return NextResponse.redirect(
        new URL(`/dashboard/chatbots/${state}/calendar?error=oauth_denied`, req.url)
      );
    }

    if (!code || !state) {
      throw APIError.badRequest('Missing code or state parameter');
    }

    const chatbotId = state;

    // Verify chatbot ownership
    const supabase = createAdminClient();
    const { data: chatbot } = await supabase
      .from('chatbots')
      .select('user_id')
      .eq('id', chatbotId)
      .single();

    if (!chatbot || chatbot.user_id !== user.id) {
      throw APIError.forbidden();
    }

    // Exchange code for tokens
    const tokens = await exchangeCalendlyCode(code);

    // Get Calendly user info
    const userRes = await fetch('https://api.calendly.com/users/me', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    const userData = await userRes.json();
    const calendlyUser = userData.resource;

    // Get event types
    const eventTypesRes = await fetch(
      `https://api.calendly.com/event_types?user=${calendlyUser.uri}&active=true`,
      { headers: { Authorization: `Bearer ${tokens.access_token}` } }
    );
    const eventTypesData = await eventTypesRes.json();
    const firstEventType = eventTypesData.collection?.[0];

    // Upsert calendar integration
    const config = {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      user_uri: calendlyUser.uri,
      organization_uri: calendlyUser.current_organization,
      event_type_uuid: firstEventType?.uri?.split('/').pop() || null,
    };

    // Deactivate existing Calendly integrations for this chatbot
    await supabase
      .from('calendar_integrations')
      .update({ is_active: false })
      .eq('chatbot_id', chatbotId)
      .eq('provider', 'calendly');

    // Create new integration
    await supabase
      .from('calendar_integrations')
      .insert({
        chatbot_id: chatbotId,
        user_id: user.id,
        provider: 'calendly',
        is_active: true,
        config,
      });

    // Redirect back to calendar settings
    return NextResponse.redirect(
      new URL(`/dashboard/chatbots/${chatbotId}/calendar?connected=calendly`, req.url)
    );
  } catch (error) {
    return errorResponse(error);
  }
}
