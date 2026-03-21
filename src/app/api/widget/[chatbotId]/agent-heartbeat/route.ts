/**
 * Agent Heartbeat API
 * POST /api/widget/:chatbotId/agent-heartbeat — Upsert agent presence (called every 30s from Agent Console)
 * DELETE /api/widget/:chatbotId/agent-heartbeat — Remove agent presence (on sign-off)
 * Auth: Supabase session or chatbot API key
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { validateChatbotAPIKey } from '@/lib/chatbots/api';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

interface RouteParams {
  params: Promise<{ chatbotId: string }>;
}

async function authenticateAgent(req: NextRequest, chatbotId: string): Promise<{ userId: string; name: string } | null> {
  const authHeader = req.headers.get('authorization');
  if (authHeader?.startsWith('Bearer cb_')) {
    const key = authHeader.replace('Bearer ', '');
    const result = await validateChatbotAPIKey(key);
    if (result && result.chatbotId === chatbotId) {
      return { userId: result.userId, name: 'Agent' };
    }
    return null;
  }

  const supabase = await createClient() as any;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: chatbot } = await supabase
    .from('chatbots')
    .select('id')
    .eq('id', chatbotId)
    .eq('user_id', user.id)
    .single();

  if (!chatbot) return null;
  return { userId: user.id, name: user.email?.split('@')[0] || 'Agent' };
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  const { chatbotId } = await params;

  const agent = await authenticateAgent(req, chatbotId);
  if (!agent) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: CORS_HEADERS });
  }

  const body = await req.json().catch(() => ({}));

  // sendBeacon can only POST, so the client sends { _method: 'DELETE' } to signal sign-off
  if (body._method === 'DELETE') {
    const admin = createAdminClient();
    await (admin as any)
      .from('agent_presence')
      .delete()
      .eq('chatbot_id', chatbotId)
      .eq('user_id', agent.userId);
    return NextResponse.json({ success: true }, { headers: CORS_HEADERS });
  }

  const agentName = body.agent_name || agent.name;

  const admin = createAdminClient();
  const { error } = await (admin as any)
    .from('agent_presence')
    .upsert(
      {
        chatbot_id: chatbotId,
        user_id: agent.userId,
        agent_name: agentName,
        last_heartbeat: new Date().toISOString(),
      },
      { onConflict: 'chatbot_id,user_id' }
    );

  if (error) {
    console.error('[Agent Heartbeat] Upsert failed:', error);
    return NextResponse.json({ error: 'Failed to update presence' }, { status: 500, headers: CORS_HEADERS });
  }

  return NextResponse.json({ success: true }, { headers: CORS_HEADERS });
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const { chatbotId } = await params;

  const agent = await authenticateAgent(req, chatbotId);
  if (!agent) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: CORS_HEADERS });
  }

  const admin = createAdminClient();
  await (admin as any)
    .from('agent_presence')
    .delete()
    .eq('chatbot_id', chatbotId)
    .eq('user_id', agent.userId);

  return NextResponse.json({ success: true }, { headers: CORS_HEADERS });
}
