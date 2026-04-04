/**
 * Chatbot Agent Assignments API
 * GET  /api/chatbots/:id/agents — List assignments (owner only)
 * POST /api/chatbots/:id/agents — Assign agent by email (owner only)
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { authenticate } from '@/lib/auth/session';
import { successResponse, errorResponse, APIError, parseBody } from '@/lib/api/utils';
import { getChatbot } from '@/lib/chatbots/api';
import { createAdminClient, logAuditEvent } from '@/lib/supabase/admin';

const assignAgentSchema = z.object({
  email: z.string().email(),
  can_modify_settings:  z.boolean().optional().default(false),
  can_manage_knowledge: z.boolean().optional().default(false),
  can_view_analytics:   z.boolean().optional().default(false),
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const user = await authenticate(req);
    if (!user) throw APIError.unauthorized('Authentication required');

    const chatbot = await getChatbot(id);
    if (!chatbot || chatbot.user_id !== user.id) {
      throw APIError.notFound('Chatbot not found');
    }

    const admin = createAdminClient();
    const { data: assignments, error } = await (admin as any)
      .from('chatbot_agent_assignments')
      .select(`
        id,
        agent_id,
        can_handle_conversations,
        can_modify_settings,
        can_manage_knowledge,
        can_view_analytics,
        status,
        created_at,
        agent:profiles!chatbot_agent_assignments_agent_id_fkey (
          full_name,
          email
        )
      `)
      .eq('chatbot_id', id)
      .eq('owner_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[Agents GET] query error:', error);
      throw APIError.internal('Failed to fetch assignments');
    }

    const shaped = (assignments || []).map((a: any) => ({
      id: a.id,
      agent_id: a.agent_id,
      agent_name: a.agent?.full_name || null,
      agent_email: a.agent?.email || null,
      can_handle_conversations: a.can_handle_conversations,
      can_modify_settings: a.can_modify_settings,
      can_manage_knowledge: a.can_manage_knowledge,
      can_view_analytics: a.can_view_analytics,
      status: a.status,
      created_at: a.created_at,
    }));

    return successResponse({ assignments: shaped });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const user = await authenticate(req);
    if (!user) throw APIError.unauthorized('Authentication required');

    const chatbot = await getChatbot(id);
    if (!chatbot || chatbot.user_id !== user.id) {
      throw APIError.notFound('Chatbot not found');
    }

    const input = await parseBody(req, assignAgentSchema);
    const admin = createAdminClient();

    // Lookup agent profile by email (case-insensitive)
    const { data: agentProfile, error: profileError } = await (admin as any)
      .from('profiles')
      .select('id, full_name, email')
      .ilike('email', input.email)
      .maybeSingle();

    if (profileError) {
      console.error('[Agents POST] profile lookup error:', profileError);
      throw APIError.internal('Failed to look up user');
    }

    if (!agentProfile) {
      throw APIError.notFound('No VocUI account found for that email');
    }

    if (agentProfile.id === user.id) {
      throw APIError.badRequest('Cannot assign chatbot to yourself');
    }

    // Upsert: reactivate revoked row or insert new
    const { data: assignment, error: upsertError } = await (admin as any)
      .from('chatbot_agent_assignments')
      .upsert(
        {
          chatbot_id:              id,
          owner_id:                user.id,
          agent_id:                agentProfile.id,
          can_handle_conversations: true,
          can_modify_settings:     input.can_modify_settings,
          can_manage_knowledge:    input.can_manage_knowledge,
          can_view_analytics:      input.can_view_analytics,
          status:                  'active',
          revoked_at:              null,
        },
        {
          onConflict: 'chatbot_id,agent_id',
          ignoreDuplicates: false,
        }
      )
      .select('id, agent_id, can_handle_conversations, can_modify_settings, can_manage_knowledge, can_view_analytics, status')
      .single();

    if (upsertError) {
      console.error('[Agents POST] upsert error:', upsertError);
      throw APIError.internal('Failed to create assignment');
    }

    await logAuditEvent({
      user_id: user.id,
      action: 'agent_assignment.created',
      entity_type: 'chatbot_agent_assignment',
      entity_id: assignment.id,
      metadata: {
        chatbot_id: id,
        agent_id: agentProfile.id,
      },
    });

    return successResponse(
      {
        assignment: {
          id: assignment.id,
          agent_id: assignment.agent_id,
          agent_name: agentProfile.full_name,
          agent_email: agentProfile.email,
          permissions: {
            can_handle_conversations: assignment.can_handle_conversations,
            can_modify_settings: assignment.can_modify_settings,
            can_manage_knowledge: assignment.can_manage_knowledge,
            can_view_analytics: assignment.can_view_analytics,
          },
          status: assignment.status,
        },
      },
      undefined,
      201
    );
  } catch (error) {
    return errorResponse(error);
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key',
    },
  });
}
