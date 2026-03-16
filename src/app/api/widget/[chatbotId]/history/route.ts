/**
 * Widget Chat History API
 * GET /api/widget/:chatbotId/history - Fetch previous messages for a verified visitor
 *
 * Query params:
 *   visitor_id  — required, the visitor's ID
 *   before      — optional ISO timestamp cursor for pagination
 *   limit       — optional, default 20, max 50
 *
 * Returns messages grouped by conversation session, newest first.
 */

import { NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

interface RouteParams {
  params: Promise<{ chatbotId: string }>;
}

interface HistoryMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at: string;
  conversation_id: string;
}

interface ConversationGroup {
  conversation_id: string;
  started_at: string;
  messages: HistoryMessage[];
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { chatbotId } = await params;
    const url = new URL(req.url);
    const visitorId = url.searchParams.get('visitor_id');
    const before = url.searchParams.get('before');
    const limitParam = url.searchParams.get('limit');
    const limit = Math.min(Math.max(parseInt(limitParam || '20', 10) || 20, 1), 50);

    if (!visitorId) {
      return new Response(
        JSON.stringify({ success: false, error: { message: 'visitor_id is required' } }),
        { status: 400, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
      );
    }

    const supabase = createAdminClient() as any;

    // Find conversations for this visitor + chatbot
    let convoQuery = supabase
      .from('conversations')
      .select('id, created_at')
      .eq('chatbot_id', chatbotId)
      .eq('visitor_id', visitorId)
      .order('created_at', { ascending: false });

    const { data: conversations, error: convoError } = await convoQuery;

    if (convoError || !conversations || conversations.length === 0) {
      return new Response(
        JSON.stringify({ success: true, data: { groups: [], has_more: false, next_cursor: null } }),
        { status: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
      );
    }

    const conversationIds = conversations.map((c: any) => c.id);
    const conversationStartMap: Record<string, string> = {};
    conversations.forEach((c: any) => {
      conversationStartMap[c.id] = c.created_at;
    });

    // Fetch messages across all conversations for this visitor
    let msgQuery = supabase
      .from('messages')
      .select('id, role, content, created_at, conversation_id')
      .in('conversation_id', conversationIds)
      .in('role', ['user', 'assistant'])
      .order('created_at', { ascending: false })
      .limit(limit + 1); // +1 to detect has_more

    if (before) {
      msgQuery = msgQuery.lt('created_at', before);
    }

    const { data: messages, error: msgError } = await msgQuery;

    if (msgError) {
      console.error('History fetch error:', msgError);
      return new Response(
        JSON.stringify({ success: false, error: { message: 'Failed to fetch history' } }),
        { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
      );
    }

    const hasMore = (messages || []).length > limit;
    const trimmedMessages: HistoryMessage[] = (messages || []).slice(0, limit);

    // Determine next cursor (oldest message timestamp in this batch)
    const nextCursor = hasMore && trimmedMessages.length > 0
      ? trimmedMessages[trimmedMessages.length - 1].created_at
      : null;

    // Group messages by conversation, preserving chronological order within each group
    const groupMap = new Map<string, HistoryMessage[]>();
    // Messages are newest-first from DB; reverse to get chronological within groups
    const chronological = [...trimmedMessages].reverse();

    for (const msg of chronological) {
      if (!groupMap.has(msg.conversation_id)) {
        groupMap.set(msg.conversation_id, []);
      }
      groupMap.get(msg.conversation_id)!.push(msg);
    }

    // Build groups ordered by conversation start time (oldest first so they render top-to-bottom)
    const groups: ConversationGroup[] = [];
    const sortedConvoIds = Array.from(groupMap.keys()).sort((a, b) => {
      const aTime = conversationStartMap[a] || '';
      const bTime = conversationStartMap[b] || '';
      return aTime.localeCompare(bTime);
    });

    for (const convoId of sortedConvoIds) {
      groups.push({
        conversation_id: convoId,
        started_at: conversationStartMap[convoId] || '',
        messages: groupMap.get(convoId)!,
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          groups,
          has_more: hasMore,
          next_cursor: nextCursor,
        },
      }),
      { status: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
    );
  } catch (error) {
    console.error('History API error:', error);
    return new Response(
      JSON.stringify({ success: false, error: { message: 'Internal server error' } }),
      { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
