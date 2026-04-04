/**
 * Agent Assignments Bootstrap API
 * GET /api/agent/assignments — List all chatbots assigned to the authenticated user
 */

import { NextRequest } from 'next/server';
import { authenticate } from '@/lib/auth/session';
import { successResponse, errorResponse, APIError } from '@/lib/api/utils';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(req: NextRequest) {
  try {
    const user = await authenticate(req);
    if (!user) throw APIError.unauthorized('Authentication required');

    const admin = createAdminClient();

    const { data: assignments, error } = await (admin as any)
      .from('chatbot_agent_assignments')
      .select(`
        id,
        chatbot_id,
        can_handle_conversations,
        can_modify_settings,
        can_manage_knowledge,
        can_view_analytics,
        chatbot:chatbots!chatbot_agent_assignments_chatbot_id_fkey (
          name,
          description,
          status
        )
      `)
      .eq('agent_id', user.id)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[Agent Assignments GET] query error:', error);
      throw APIError.internal('Failed to fetch assignments');
    }

    const shaped = (assignments || []).map((a: any) => ({
      id: a.id,
      chatbot_id: a.chatbot_id,
      chatbot_name: a.chatbot?.name || null,
      chatbot_description: a.chatbot?.description || null,
      chatbot_status: a.chatbot?.status || null,
      can_handle_conversations: a.can_handle_conversations,
      can_modify_settings: a.can_modify_settings,
      can_manage_knowledge: a.can_manage_knowledge,
      can_view_analytics: a.can_view_analytics,
    }));

    return successResponse({ assignments: shaped });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key',
    },
  });
}
