/**
 * Per-Chatbot Teams Webhook Handler
 * POST /api/teams/webhook/[chatbotId]
 *
 * Each chatbot gets its own webhook URL registered in Azure Bot Registration.
 * Receives Bot Framework Activity objects from Microsoft Teams.
 *
 * Auth: Verifies JWT Bearer token from Bot Framework.
 * Processing: Returns 200 immediately, processes message async.
 */

import { NextRequest, NextResponse } from 'next/server';
import type { TeamsActivity } from '@/lib/teams/types';
import type { TeamsConfig } from '@/lib/chatbots/types';
import { verifyTeamsToken } from '@/lib/teams/auth';
import { handleTeamsMessage } from '@/lib/teams/chat';
import { createAdminClient } from '@/lib/supabase/admin';
import { decryptToken } from '@/lib/telegram/crypto';

/**
 * Load and decrypt Teams config from the chatbot record.
 */
async function getTeamsConfig(chatbotId: string): Promise<TeamsConfig | null> {
  const supabase = createAdminClient();
  // teams_config column not yet in generated DB types — use wildcard select + cast
  const { data } = await supabase
    .from('chatbots')
    .select('*')
    .eq('id', chatbotId)
    .single();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw = (data as any)?.teams_config;
  if (!raw || typeof raw !== 'object') {
    return null;
  }

  const config = raw as TeamsConfig;

  // Decrypt app_secret if encrypted
  if (config.app_secret) {
    config.app_secret = decryptToken(config.app_secret);
  }

  return config;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ chatbotId: string }> }
) {
  const { chatbotId } = await params;

  try {
    // Load Teams config
    const config = await getTeamsConfig(chatbotId);
    if (!config || !config.enabled) {
      return NextResponse.json({ error: 'Teams integration not configured' }, { status: 404 });
    }

    if (!config.app_id) {
      return NextResponse.json({ error: 'Teams App ID not configured' }, { status: 500 });
    }

    // Verify Bot Framework JWT token
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Missing authorization header' }, { status: 401 });
    }

    try {
      await verifyTeamsToken(authHeader, config.app_id);
    } catch (authError) {
      console.error('[Teams Webhook] Auth failed:', authError);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse the activity
    const activity: TeamsActivity = await request.json();

    // Handle conversationUpdate (welcome message on bot install)
    if (activity.type === 'conversationUpdate') {
      // Optional: send welcome message when bot is added to a conversation
      // This fires when members are added/removed
      return NextResponse.json({ ok: true });
    }

    // Only process text messages
    if (activity.type !== 'message' || !activity.text) {
      return NextResponse.json({ ok: true });
    }

    // Only process if AI responses are enabled
    if (!config.ai_responses_enabled) {
      return NextResponse.json({ ok: true });
    }

    // Process the message (await to keep Node.js process alive)
    const chatPromise = handleTeamsMessage(chatbotId, config, activity).catch((err) => {
      console.error('[Teams Webhook] Chat error:', err);
    });

    await chatPromise;

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[Teams Webhook] Error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Teams webhook endpoint is active',
  });
}
