/**
 * Widget Survey API
 * POST /api/widget/:chatbotId/survey - Save post-chat survey response (public)
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

    const { session_id, conversation_id, responses, response_id } = body;

    if (!responses || typeof responses !== 'object') {
      return new Response(
        JSON.stringify({ success: false, error: { message: 'responses is required' } }),
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

    let result;

    // If response_id is provided, update existing record; otherwise insert new
    if (response_id) {
      const { data, error } = await (supabase as any)
        .from('chatbot_survey_responses')
        .update({
          responses,
          updated_at: new Date().toISOString(),
        })
        .eq('id', response_id)
        .eq('chatbot_id', chatbotId)
        .select()
        .single();

      if (error) {
        console.error('Failed to update survey response:', error);
        return new Response(
          JSON.stringify({ success: false, error: { message: 'Failed to update survey response' } }),
          {
            status: 500,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          }
        );
      }

      result = { response_id: data.id };
    } else {
      const { data, error } = await (supabase as any)
        .from('chatbot_survey_responses')
        .insert({
          chatbot_id: chatbotId,
          conversation_id: conversation_id || null,
          session_id: session_id || null,
          responses,
        })
        .select()
        .single();

      if (error) {
        console.error('Failed to save survey response:', error);
        return new Response(
          JSON.stringify({ success: false, error: { message: 'Failed to save survey response' } }),
          {
            status: 500,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          }
        );
      }

      result = { response_id: data.id };
    }

    return new Response(
      JSON.stringify({ success: true, data: result }),
      {
        status: response_id ? 200 : 201,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (error) {
    console.error('Survey API error:', error);
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
