/**
 * Widget Ticket Submission API
 * POST /api/widget/:chatbotId/tickets - Create ticket (public, rate limited)
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { createAdminClient } from '@/lib/supabase/admin';
import { getClientIP } from '@/lib/api/utils';
import { getChatbotCorsOrigin } from '@/lib/api/cors';
import { sendTicketSubmittedEmail, sendNewTicketAdminEmail } from '@/lib/email/smtp';
import { sendNewTicketNotification } from '@/lib/email/resend';
import { DEFAULT_CREDIT_EXHAUSTION_CONFIG } from '@/lib/chatbots/types';
import { emitWebhookEvent } from '@/lib/webhooks/emit';

const ticketSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().max(200),
  phone: z.string().max(50).optional(),
  subject: z.string().max(300).optional(),
  message: z.string().min(1).max(5000),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  customFields: z.record(z.unknown()).optional(),
});

interface RouteParams {
  params: Promise<{ chatbotId: string }>;
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { chatbotId } = await params;
    const supabase = createAdminClient();

    // Rate limit: 5 tickets per IP per 5 min
    const ip = getClientIP(req);
    const { data: allowed } = await supabase.rpc('check_rate_limit', {
      p_key: `ticket:${ip}:${chatbotId}`,
      p_max_requests: 5,
      p_window_seconds: 300,
    });
    if (allowed === false) {
      return corsResponse({ success: false, error: { message: 'Rate limit exceeded' } }, 429, req, chatbotId);
    }

    // Get chatbot (must be published and active)
    const { data: chatbot } = await supabase
      .from('chatbots')
      .select('id, name, user_id, is_published, status, credit_exhaustion_mode, credit_exhaustion_config, allowed_origins')
      .eq('id', chatbotId)
      .eq('is_published', true)
      .eq('status', 'active')
      .single();

    if (!chatbot) {
      return corsResponse({ success: false, error: { message: 'Chatbot not found' } }, 404, req, chatbotId);
    }

    // Parse body
    const body = await req.json();
    const input = ticketSchema.parse(body);

    // Get config
    const config = {
      ...DEFAULT_CREDIT_EXHAUSTION_CONFIG.tickets,
      ...((chatbot as any).credit_exhaustion_config?.tickets || {}),
    };

    // Generate ticket reference
    const { data: reference } = await supabase.rpc('next_ticket_reference', {
      p_chatbot_id: chatbotId,
      p_prefix: config.ticketReferencePrefix || 'TKT-',
    });

    // Insert ticket
    const { data: ticket, error } = await supabase
      .from('tickets')
      .insert({
        chatbot_id: chatbotId,
        visitor_name: input.name,
        visitor_email: input.email,
        visitor_phone: input.phone || null,
        subject: input.subject || null,
        message: input.message,
        priority: input.priority,
        reference: reference || `TKT-${Date.now()}`,
        custom_fields: (input.customFields || {}) as Record<string, string>,
      })
      .select()
      .single();

    if (error) {
      console.error('[Widget:Tickets] Insert error:', error);
      return corsResponse({ success: false, error: { message: 'Failed to create ticket' } }, 500, req, chatbotId);
    }

    // Emit ticket.created webhook (fire-and-forget)
    if ((chatbot as any).user_id) {
      emitWebhookEvent((chatbot as any).user_id, 'ticket.created', {
        chatbot_id: chatbotId,
        chatbot_name: chatbot.name,
        ticket_id: ticket.id,
        reference: ticket.reference,
        visitor_name: input.name,
        visitor_email: input.email,
        subject: input.subject ?? null,
        priority: input.priority,
      }).catch(() => {});
    }

    // Send emails (fire-and-forget) via SMTP
    const ticketRef = ticket.reference;
    sendTicketSubmittedEmail(input.email, {
      name: input.name,
      reference: ticketRef,
      subject: input.subject,
      message: input.message,
    }).catch((e) => console.error('[Widget:Tickets] Auto-reply failed:', e));

    if (config.adminNotificationEmail) {
      sendNewTicketAdminEmail(config.adminNotificationEmail, {
        reference: ticketRef,
        visitorName: input.name,
        visitorEmail: input.email,
        subject: input.subject,
        message: input.message,
        priority: input.priority,
        chatbotName: (chatbot as any).name,
        dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/chatbots/${chatbotId}/tickets`,
      }).catch((e) => console.error('[Widget:Tickets] Admin notification failed:', e));
    }

    // Notify chatbot owner if they have the preference enabled
    if ((chatbot as any).user_id) {
      supabase
        .from('profiles')
        .select('email, notify_new_ticket')
        .eq('id', (chatbot as any).user_id)
        .single()
        .then(({ data: ownerProfile }) => {
          if (ownerProfile?.notify_new_ticket) {
            sendNewTicketNotification(ownerProfile.email, {
              ticketId: ticketRef,
              visitorName: input.name,
              subject: input.subject,
              chatbotName: (chatbot as any).name,
              dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/chatbots/${chatbotId}/tickets`,
            }).catch(() => {});
          }
        }, () => {});
    }

    return corsResponse({
      success: true,
      data: { ticketId: ticket.id, reference: ticketRef },
    }, 201, req, chatbotId);
  } catch (error) {
    console.error('[Widget:Tickets] Error:', error);
    const message = error instanceof z.ZodError
      ? `Validation error: ${error.errors.map(e => e.message).join(', ')}`
      : 'Internal server error';
    const status = error instanceof z.ZodError ? 400 : 500;
    return new Response(JSON.stringify({ success: false, error: { message } }), {
      status,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
}

export async function OPTIONS(req: NextRequest, { params }: RouteParams) {
  const { chatbotId } = await params;
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

async function corsResponse(body: unknown, status: number, req: NextRequest, chatbotId: string) {
  let origin = '*';
  try {
    const supabase = createAdminClient();
    const { data } = await supabase.from('chatbots').select('allowed_origins').eq('id', chatbotId).single();
    if (data) origin = getChatbotCorsOrigin((data as any).allowed_origins, req.headers.get('origin'));
  } catch {}
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': origin },
  });
}
