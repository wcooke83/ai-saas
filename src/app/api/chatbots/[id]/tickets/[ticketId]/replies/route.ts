/**
 * Ticket Replies API
 * GET  /api/chatbots/:id/tickets/:ticketId/replies - List replies
 * POST /api/chatbots/:id/tickets/:ticketId/replies - Add a reply (admin)
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { authenticate } from '@/lib/auth/session';
import { successResponse, errorResponse, APIError, parseBody } from '@/lib/api/utils';
import { getChatbot } from '@/lib/chatbots/api';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendTicketReplyEmail } from '@/lib/email/smtp';

const replySchema = z.object({
  message: z.string().min(1).max(10000),
});

interface RouteParams {
  params: Promise<{ id: string; ticketId: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id, ticketId } = await params;
    const user = await authenticate(req);
    if (!user) throw APIError.unauthorized();

    const chatbot = await getChatbot(id);
    if (!chatbot || chatbot.user_id !== user.id) throw APIError.notFound('Chatbot not found');

    const supabase = createAdminClient();
    const { data: replies, error } = await supabase
      .from('ticket_replies')
      .select('*')
      .eq('ticket_id', ticketId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    return successResponse({ replies: replies || [] });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { id, ticketId } = await params;
    const user = await authenticate(req);
    if (!user) throw APIError.unauthorized();

    const chatbot = await getChatbot(id);
    if (!chatbot || chatbot.user_id !== user.id) throw APIError.notFound('Chatbot not found');

    const input = await parseBody(req, replySchema);

    const supabase = createAdminClient();

    // Get the ticket to find visitor info
    const { data: ticket, error: ticketError } = await supabase
      .from('tickets')
      .select('*')
      .eq('id', ticketId)
      .eq('chatbot_id', id)
      .single();

    if (ticketError || !ticket) throw APIError.notFound('Ticket not found');

    // Get admin profile for sender name
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, email')
      .eq('id', user.id)
      .single();

    const senderName = profile?.full_name || 'Support Team';
    const senderEmail = profile?.email || 'support@vocui.com';

    // Insert reply
    const { data: reply, error: insertError } = await supabase
      .from('ticket_replies')
      .insert({
        ticket_id: ticketId,
        sender_type: 'admin',
        sender_email: senderEmail,
        sender_name: senderName,
        message: input.message,
      })
      .select()
      .single();

    if (insertError) throw insertError;

    // Auto-set status to in_progress if currently open
    if (ticket.status === 'open') {
      await supabase
        .from('tickets')
        .update({ status: 'in_progress', updated_at: new Date().toISOString() })
        .eq('id', ticketId);
    }

    // Send email notification to visitor (fire-and-forget)
    sendTicketReplyEmail(ticket.visitor_email, {
      visitorName: ticket.visitor_name,
      reference: ticket.reference,
      subject: ticket.subject || undefined,
      replyMessage: input.message,
      replierName: senderName,
    }).catch((e) => console.error('[Tickets] Reply email failed:', e));

    return successResponse({ reply }, undefined, 201);
  } catch (error) {
    return errorResponse(error);
  }
}
