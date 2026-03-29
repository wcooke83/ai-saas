/**
 * Widget Leads API
 * POST /api/widget/:chatbotId/leads - Save pre-chat form submission (public)
 */

import { NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { emitWebhookEvent } from '@/lib/webhooks/emit';

interface RouteParams {
  params: Promise<{ chatbotId: string }>;
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { chatbotId } = await params;
    const body = await req.json();

    const { session_id, form_data, visitor_id } = body;

    if (!form_data || typeof form_data !== 'object') {
      return new Response(
        JSON.stringify({ success: false, error: { message: 'form_data is required' } }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    const supabase = createAdminClient();

    const { data, error } = await (supabase as any)
      .from('chatbot_leads')
      .insert({
        chatbot_id: chatbotId,
        session_id: session_id || null,
        form_data,
      })
      .select()
      .single();

    if (error) {
      console.error('Failed to save lead:', error);
      return new Response(
        JSON.stringify({ success: false, error: { message: 'Failed to save lead' } }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    console.log(`[Memory Leads] Lead saved for chatbot ${chatbotId}, session ${session_id}`);

    // Emit lead.captured webhook (fire-and-forget)
    const { data: chatbotRow } = await (supabase as any)
      .from('chatbots')
      .select('user_id')
      .eq('id', chatbotId)
      .single();
    if (chatbotRow?.user_id) {
      emitWebhookEvent(chatbotRow.user_id, 'lead.captured', {
        chatbot_id: chatbotId,
        lead_id: data.id,
        session_id: session_id || null,
        form_data,
      }).catch(() => {});
    }

    return new Response(
      JSON.stringify({ success: true, data: { lead_id: data.id } }),
      {
        status: 201,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (error) {
    console.error('Leads API error:', error);
    return new Response(
      JSON.stringify({ success: false, error: { message: 'Internal server error' } }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}

// CORS preflight
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
