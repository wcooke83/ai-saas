/**
 * Widget Configuration API
 * GET /api/widget/:chatbotId/config - Get widget configuration (public)
 */

import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { DEFAULT_WIDGET_CONFIG } from '@/lib/chatbots/types';

interface RouteParams {
  params: Promise<{ chatbotId: string }>;
}

interface ChatbotConfig {
  id: string;
  name: string;
  welcome_message: string | null;
  placeholder_text: string | null;
  logo_url: string | null;
  widget_config: Record<string, unknown> | null;
  is_published: boolean;
  status: string;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { chatbotId } = await params;

    const supabase = await createClient();

    // Get chatbot - RLS policy ensures only published+active chatbots are returned
    const { data: chatbotData, error } = await (supabase as any)
      .from('chatbots')
      .select('id, name, welcome_message, placeholder_text, logo_url, widget_config, is_published, status')
      .eq('id', chatbotId)
      .single();

    if (error || !chatbotData) {
      return new Response(
        JSON.stringify({ success: false, error: { message: 'Chatbot not found or not available' } }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    const chatbot = chatbotData as ChatbotConfig;

    // Merge widget config with defaults
    const widgetConfig = {
      ...DEFAULT_WIDGET_CONFIG,
      ...(chatbot.widget_config || {}),
    };

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          chatbot: {
            id: chatbot.id,
            name: chatbot.name,
            welcome_message: chatbot.welcome_message,
            placeholder_text: chatbot.placeholder_text,
            logo_url: chatbot.logo_url,
          },
          widgetConfig,
        },
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=60', // Cache for 1 minute
        },
      }
    );
  } catch (error) {
    console.error('Widget config error:', error);
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
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
