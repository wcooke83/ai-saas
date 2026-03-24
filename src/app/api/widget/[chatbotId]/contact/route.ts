/**
 * Widget Contact Form API
 * POST /api/widget/:chatbotId/contact - Submit contact form (public, rate limited)
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { createAdminClient } from '@/lib/supabase/admin';
import { getClientIP } from '@/lib/api/utils';
import { getChatbotCorsOrigin } from '@/lib/api/cors';
import { sendContactConfirmation, sendContactAdminNotification } from '@/lib/email/resend';
import { DEFAULT_CREDIT_EXHAUSTION_CONFIG } from '@/lib/chatbots/types';

const contactSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().max(200),
  message: z.string().min(1).max(5000),
});

interface RouteParams {
  params: Promise<{ chatbotId: string }>;
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { chatbotId } = await params;
    const supabase = createAdminClient();

    // Rate limit: 5 per IP per 5 min
    const ip = getClientIP(req);
    const { data: allowed } = await supabase.rpc('check_rate_limit', {
      p_key: `contact:${ip}:${chatbotId}`,
      p_max_requests: 5,
      p_window_seconds: 300,
    });
    if (allowed === false) {
      return corsJson({ success: false, error: { message: 'Rate limit exceeded' } }, 429, req);
    }

    // Get chatbot
    const { data: chatbot } = await supabase
      .from('chatbots')
      .select('id, name, credit_exhaustion_config, allowed_origins')
      .eq('id', chatbotId)
      .single();

    if (!chatbot) {
      return corsJson({ success: false, error: { message: 'Chatbot not found' } }, 404, req);
    }

    const body = await req.json();
    const input = contactSchema.parse(body);

    const config = {
      ...DEFAULT_CREDIT_EXHAUSTION_CONFIG.contact_form,
      ...((chatbot as any).credit_exhaustion_config?.contact_form || {}),
    };

    // Insert submission
    const { data: submission, error } = await supabase
      .from('contact_submissions')
      .insert({
        chatbot_id: chatbotId,
        visitor_name: input.name,
        visitor_email: input.email,
        message: input.message,
      })
      .select()
      .single();

    if (error) {
      console.error('[Widget:Contact] Insert error:', error);
      return corsJson({ success: false, error: { message: 'Failed to submit' } }, 500, req);
    }

    // Send emails (fire-and-forget)
    if (config.autoReplyEnabled) {
      sendContactConfirmation(input.email, {
        name: input.name,
        message: input.message,
      }).catch((e) => console.error('[Widget:Contact] Auto-reply failed:', e));
    }

    if (config.adminNotificationEmail) {
      sendContactAdminNotification(config.adminNotificationEmail, {
        visitorName: input.name,
        visitorEmail: input.email,
        message: input.message,
        chatbotName: (chatbot as any).name,
      }).catch((e) => console.error('[Widget:Contact] Admin notification failed:', e));
    }

    const origin = getChatbotCorsOrigin((chatbot as any).allowed_origins, req.headers.get('origin'));
    return new Response(JSON.stringify({ success: true, data: { id: submission.id } }), {
      status: 201,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': origin },
    });
  } catch (error) {
    console.error('[Widget:Contact] Error:', error);
    const message = error instanceof z.ZodError
      ? `Validation error: ${error.errors.map(e => e.message).join(', ')}`
      : 'Internal server error';
    return corsJson({ success: false, error: { message } }, error instanceof z.ZodError ? 400 : 500, req);
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

function corsJson(body: unknown, status: number, req: NextRequest) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  });
}
