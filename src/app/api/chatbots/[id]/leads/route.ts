/**
 * Chatbot Leads API
 * GET /api/chatbots/:id/leads - Get all pre-chat form submissions for a chatbot
 */

import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { TypedSupabaseClient } from '@/lib/supabase/admin';
import { checkChatbotOwnership } from '@/lib/chatbots/api';
import { APIError } from '@/lib/api/utils';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id: chatbotId } = await params;

    const supabase = await createClient();

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw APIError.unauthorized('Authentication required');
    }

    // Verify chatbot ownership
    const isOwner = await checkChatbotOwnership(chatbotId, user.id, supabase as unknown as TypedSupabaseClient);
    if (!isOwner) {
      throw APIError.forbidden('Access denied');
    }

    // Get query params
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Fetch leads
    const { data: leads, error, count } = await (supabase as any)
      .from('chatbot_leads')
      .select('*', { count: 'exact' })
      .eq('chatbot_id', chatbotId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Failed to fetch leads:', error);
      throw APIError.internal('Failed to fetch leads');
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          leads: leads || [],
          total: count || 0,
          limit,
          offset,
        },
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    if (error instanceof APIError) {
      return new Response(
        JSON.stringify({ success: false, error: { message: error.message, code: error.code } }),
        { status: (error as any).status ?? 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    console.error('Leads API error:', error);
    return new Response(
      JSON.stringify({ success: false, error: { message: 'Internal server error' } }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
