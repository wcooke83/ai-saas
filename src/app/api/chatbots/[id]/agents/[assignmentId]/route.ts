/**
 * Chatbot Agent Assignment Management
 * PATCH  /api/chatbots/:id/agents/:assignmentId — Update permissions (owner only)
 * DELETE /api/chatbots/:id/agents/:assignmentId — Revoke assignment (owner only)
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { authenticate } from '@/lib/auth/session';
import { successResponse, errorResponse, APIError, parseBody } from '@/lib/api/utils';
import { getChatbot } from '@/lib/chatbots/api';
import { createAdminClient, logAuditEvent } from '@/lib/supabase/admin';

const updatePermissionsSchema = z.object({
  can_modify_settings:  z.boolean().optional(),
  can_manage_knowledge: z.boolean().optional(),
  can_view_analytics:   z.boolean().optional(),
});

interface RouteParams {
  params: Promise<{ id: string; assignmentId: string }>;
}

async function verifyOwnership(chatbotId: string, assignmentId: string, ownerId: string) {
  const admin = createAdminClient();
  const { data: assignment, error } = await (admin as any)
    .from('chatbot_agent_assignments')
    .select('id, chatbot_id, owner_id, agent_id, can_handle_conversations, can_modify_settings, can_manage_knowledge, can_view_analytics, status')
    .eq('id', assignmentId)
    .eq('chatbot_id', chatbotId)
    .eq('owner_id', ownerId)
    .maybeSingle();

  if (error) {
    console.error('[assignment verifyOwnership] query error:', error);
    throw APIError.internal('Failed to verify assignment');
  }

  if (!assignment) {
    throw APIError.notFound('Assignment not found');
  }

  return assignment;
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const { id, assignmentId } = await params;

    const user = await authenticate(req);
    if (!user) throw APIError.unauthorized('Authentication required');

    const chatbot = await getChatbot(id);
    if (!chatbot || chatbot.user_id !== user.id) {
      throw APIError.notFound('Chatbot not found');
    }

    await verifyOwnership(id, assignmentId, user.id);

    const input = await parseBody(req, updatePermissionsSchema);
    const admin = createAdminClient();

    const { data: updated, error } = await (admin as any)
      .from('chatbot_agent_assignments')
      .update(input)
      .eq('id', assignmentId)
      .select('id, agent_id, can_handle_conversations, can_modify_settings, can_manage_knowledge, can_view_analytics, status')
      .single();

    if (error) {
      console.error('[assignment PATCH] update error:', error);
      throw APIError.internal('Failed to update assignment');
    }

    await logAuditEvent({
      user_id: user.id,
      action: 'agent_assignment.permissions_updated',
      entity_type: 'chatbot_agent_assignment',
      entity_id: assignmentId,
      metadata: { chatbot_id: id },
    });

    return successResponse({ assignment: updated });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const { id, assignmentId } = await params;

    const user = await authenticate(req);
    if (!user) throw APIError.unauthorized('Authentication required');

    const chatbot = await getChatbot(id);
    if (!chatbot || chatbot.user_id !== user.id) {
      throw APIError.notFound('Chatbot not found');
    }

    await verifyOwnership(id, assignmentId, user.id);

    const admin = createAdminClient();
    const { error } = await (admin as any)
      .from('chatbot_agent_assignments')
      .update({ status: 'revoked', revoked_at: new Date().toISOString() })
      .eq('id', assignmentId);

    if (error) {
      console.error('[assignment DELETE] update error:', error);
      throw APIError.internal('Failed to revoke assignment');
    }

    await logAuditEvent({
      user_id: user.id,
      action: 'agent_assignment.revoked',
      entity_type: 'chatbot_agent_assignment',
      entity_id: assignmentId,
      metadata: { chatbot_id: id },
    });

    return successResponse({ revoked: true });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key',
    },
  });
}
