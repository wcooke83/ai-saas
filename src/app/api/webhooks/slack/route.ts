/**
 * Slack Webhook Handler
 * Receives and processes Slack events
 */

import { NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { handleSlackEvent, verifySlackSignature } from '@/lib/chatbots/integrations/slack';

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const payload = JSON.parse(body);

    // Handle URL verification challenge
    if (payload.type === 'url_verification') {
      return new Response(JSON.stringify({ challenge: payload.challenge }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Verify request signature
    const signature = req.headers.get('x-slack-signature') || '';
    const timestamp = req.headers.get('x-slack-request-timestamp') || '';

    // Check timestamp to prevent replay attacks (within 5 minutes)
    const fiveMinutesAgo = Math.floor(Date.now() / 1000) - 60 * 5;
    if (parseInt(timestamp) < fiveMinutesAgo) {
      return new Response('Request too old', { status: 400 });
    }

    // Skip signature verification in development
    if (process.env.NODE_ENV === 'production') {
      if (!verifySlackSignature(signature, timestamp, body)) {
        return new Response('Invalid signature', { status: 401 });
      }
    }

    // Handle event callback
    if (payload.type === 'event_callback') {
      const event = payload.event;

      // Handle app_mention or direct message
      if (event.type === 'app_mention' || event.type === 'message') {
        // Skip bot messages
        if (event.bot_id || event.subtype === 'bot_message') {
          return new Response('OK', { status: 200 });
        }

        // Find the chatbot associated with this Slack team
        const supabase = createAdminClient();
        const { data: integration } = await supabase
          .from('slack_integrations')
          .select('chatbot_id')
          .eq('team_id', payload.team_id)
          .eq('is_active', true)
          .single();

        if (integration) {
          // Process asynchronously
          handleSlackEvent(integration.chatbot_id, {
            type: event.type,
            user: event.user,
            text: event.text,
            channel: event.channel,
            ts: event.ts,
            thread_ts: event.thread_ts,
          }).catch(console.error);
        }
      }
    }

    // Always return 200 quickly to acknowledge receipt
    return new Response('OK', { status: 200 });
  } catch (error) {
    console.error('Slack webhook error:', error);
    return new Response('Error processing webhook', { status: 500 });
  }
}
