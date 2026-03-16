/**
 * Widget Leads API
 * POST /api/widget/:chatbotId/leads - Save pre-chat form submission (public)
 */

import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

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

    const supabase = await createClient();

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

    // If form_data contains an email and visitor_id is provided, store the email-to-visitor mapping
    const emailValue = form_data.email || form_data.Email || form_data.EMAIL;
    if (emailValue && visitor_id) {
      const normalizedEmail = String(emailValue).toLowerCase().trim();
      await (supabase as any)
        .from('conversation_memory_emails')
        .upsert(
          {
            chatbot_id: chatbotId,
            email: normalizedEmail,
            visitor_id,
            verified_at: new Date().toISOString(),
          },
          { onConflict: 'chatbot_id,email' }
        );
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
