/**
 * Agent Permission Helpers
 * Granular access control for chatbot agent assignments.
 */

import { createAdminClient } from '@/lib/supabase/admin';
import { APIError } from '@/lib/api/utils';

// =====================
// TYPES
// =====================

export type AgentPermission =
  | 'can_handle_conversations'
  | 'can_modify_settings'
  | 'can_manage_knowledge'
  | 'can_view_analytics';

export interface AssignmentGrant {
  assignmentId: string;
  chatbotId: string;
  agentId: string;
  permissions: Record<AgentPermission, boolean>;
}

// =====================
// HELPERS
// =====================

/**
 * Returns 'owner' if userId owns the chatbot.
 * Returns AssignmentGrant if userId has an active assignment with the required permission.
 * Throws APIError 404 if chatbot not found.
 * Throws APIError 403 if access is denied or permission is missing.
 *
 * Always uses the admin client — never trusts RLS alone.
 */
export async function requireChatbotAccess(
  chatbotId: string,
  userId: string,
  permission: AgentPermission
): Promise<'owner' | AssignmentGrant> {
  const admin = createAdminClient();

  // 1. Fetch chatbot
  const { data: chatbot, error: chatbotError } = await (admin as any)
    .from('chatbots')
    .select('id, user_id')
    .eq('id', chatbotId)
    .maybeSingle();

  if (chatbotError) {
    console.error('[requireChatbotAccess] chatbot query error:', chatbotError);
    throw APIError.internal('Failed to verify chatbot access');
  }

  if (!chatbot) {
    throw APIError.notFound('Chatbot not found');
  }

  // 2. Owner short-circuit
  if (chatbot.user_id === userId) {
    return 'owner';
  }

  // 3. Check assignment
  const { data: assignment, error: assignError } = await (admin as any)
    .from('chatbot_agent_assignments')
    .select('id, chatbot_id, agent_id, can_handle_conversations, can_modify_settings, can_manage_knowledge, can_view_analytics')
    .eq('chatbot_id', chatbotId)
    .eq('agent_id', userId)
    .eq('status', 'active')
    .maybeSingle();

  if (assignError) {
    console.error('[requireChatbotAccess] assignment query error:', assignError);
    throw APIError.internal('Failed to verify agent assignment');
  }

  if (!assignment) {
    throw APIError.forbidden('Access denied');
  }

  if (assignment[permission] !== true) {
    throw APIError.forbidden(`Missing permission: ${permission}`);
  }

  return {
    assignmentId: assignment.id as string,
    chatbotId: assignment.chatbot_id as string,
    agentId: assignment.agent_id as string,
    permissions: {
      can_handle_conversations: assignment.can_handle_conversations as boolean,
      can_modify_settings: assignment.can_modify_settings as boolean,
      can_manage_knowledge: assignment.can_manage_knowledge as boolean,
      can_view_analytics: assignment.can_view_analytics as boolean,
    },
  };
}
