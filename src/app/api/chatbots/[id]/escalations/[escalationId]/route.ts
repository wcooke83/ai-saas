/**
 * Single Escalation API
 * PATCH /api/chatbots/:id/escalations/:escalationId - Update escalation status
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import type { TypedSupabaseClient } from '@/lib/supabase/admin';
import { checkChatbotOwnership } from '@/lib/chatbots/api';
import { APIError, successResponse, errorResponse, parseBody } from '@/lib/api/utils';

interface RouteParams {
  params: Promise<{ id: string; escalationId: string }>;
}

const updateSchema = z.object({
  status: z.enum(['acknowledged', 'resolved']),
});

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const { id: chatbotId, escalationId } = await params;

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

    // Validate body
    const body = await parseBody(req, updateSchema);

    const db = supabase as any;

    // Update escalation — WHERE includes both id and chatbot_id
    const { data: escalation, error } = await db
      .from('conversation_escalations')
      .update({
        status: body.status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', escalationId)
      .eq('chatbot_id', chatbotId)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw APIError.notFound('Escalation not found');
      }
      console.error('Failed to update escalation:', error);
      throw APIError.internal('Failed to update escalation');
    }

    return successResponse(escalation);
  } catch (error) {
    return errorResponse(error);
  }
}
