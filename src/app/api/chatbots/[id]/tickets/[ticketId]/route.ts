/**
 * Admin Single Ticket API
 * PATCH /api/chatbots/:id/tickets/:ticketId - Update ticket status/notes
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { authenticate } from '@/lib/auth/session';
import { successResponse, errorResponse, APIError, parseBody } from '@/lib/api/utils';
import { getChatbot } from '@/lib/chatbots/api';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendTicketStatusChangeEmail } from '@/lib/email/smtp';

const updateTicketSchema = z.object({
  status: z.enum(['open', 'in_progress', 'resolved', 'closed']).optional(),
  admin_notes: z.string().max(5000).optional(),
});

interface RouteParams {
  params: Promise<{ id: string; ticketId: string }>;
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const { id, ticketId } = await params;
    const user = await authenticate(req);
    if (!user) throw APIError.unauthorized();

    const chatbot = await getChatbot(id);
    if (!chatbot || chatbot.user_id !== user.id) throw APIError.notFound('Chatbot not found');

    const input = await parseBody(req, updateTicketSchema);

    const supabase = createAdminClient();

    // Fetch current ticket to get old status for email
    const { data: currentTicket } = await supabase
      .from('tickets')
      .select('*')
      .eq('id', ticketId)
      .eq('chatbot_id', id)
      .single();

    if (!currentTicket) throw APIError.notFound('Ticket not found');

    const updates: Record<string, unknown> = {
      ...input,
      updated_at: new Date().toISOString(),
    };

    if (input.status === 'resolved') {
      updates.resolved_at = new Date().toISOString();
    }

    const { data: ticket, error } = await supabase
      .from('tickets')
      .update(updates)
      .eq('id', ticketId)
      .eq('chatbot_id', id)
      .select()
      .single();

    if (error || !ticket) throw APIError.notFound('Ticket not found');

    // Send status change email if status actually changed
    if (input.status && input.status !== currentTicket.status) {
      sendTicketStatusChangeEmail(ticket.visitor_email, {
        name: ticket.visitor_name,
        reference: ticket.reference,
        subject: ticket.subject || undefined,
        oldStatus: currentTicket.status,
        newStatus: input.status,
      }).catch((e) => console.error('[Tickets] Status change email failed:', e));
    }

    return successResponse({ ticket });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id, ticketId } = await params;
    const user = await authenticate(req);
    if (!user) throw APIError.unauthorized();

    const chatbot = await getChatbot(id);
    if (!chatbot || chatbot.user_id !== user.id) throw APIError.notFound('Chatbot not found');

    const supabase = createAdminClient();
    const { data: ticket, error } = await supabase
      .from('tickets')
      .select('*')
      .eq('id', ticketId)
      .eq('chatbot_id', id)
      .single();

    if (error || !ticket) throw APIError.notFound('Ticket not found');

    return successResponse({ ticket });
  } catch (error) {
    return errorResponse(error);
  }
}
