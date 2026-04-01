/**
 * Zapier Action: List Chatbots
 * GET /api/zapier/actions/list-chatbots
 *
 * Returns the user's chatbots. Used by Zapier as a dynamic dropdown
 * so users can pick which chatbot to target in triggers and actions.
 *
 * Auth: Bearer API key (from api_keys table)
 */

import { NextRequest, NextResponse } from 'next/server';
import { authenticateAPIKeyStrict } from '@/lib/auth/session';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization') || req.headers.get('x-api-key');
    const user = await authenticateAPIKeyStrict(authHeader);

    const supabase = createAdminClient();
    const { data: chatbots, error } = await supabase
      .from('chatbots')
      .select('id, name, status, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[Zapier:ListChatbots] Query failed:', error);
      return NextResponse.json({ error: 'Failed to list chatbots' }, { status: 500 });
    }

    // Zapier expects an array of objects with id and a label field
    const results = (chatbots ?? []).map((bot) => ({
      id: bot.id,
      name: bot.name,
      status: bot.status,
      created_at: bot.created_at,
    }));

    return NextResponse.json(results);
  } catch (err) {
    console.error('[Zapier:ListChatbots] Error:', err);
    const message = err instanceof Error ? err.message : 'Internal error';
    const status = message.includes('API key') || message.includes('Unauthorized') ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
