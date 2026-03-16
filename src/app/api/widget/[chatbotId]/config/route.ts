/**
 * Widget Configuration API
 * GET /api/widget/:chatbotId/config - Get widget configuration (public)
 */

import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { DEFAULT_WIDGET_CONFIG, DEFAULT_PRE_CHAT_FORM_CONFIG, DEFAULT_POST_CHAT_SURVEY_CONFIG, DEFAULT_FILE_UPLOAD_CONFIG, DEFAULT_PROACTIVE_MESSAGES_CONFIG, DEFAULT_TRANSCRIPT_CONFIG } from '@/lib/chatbots/types';

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
  pre_chat_form_config: Record<string, unknown> | null;
  post_chat_survey_config: Record<string, unknown> | null;
  file_upload_config: Record<string, unknown> | null;
  proactive_messages_config: Record<string, unknown> | null;
  transcript_config: Record<string, unknown> | null;
  is_published: boolean;
  status: string;
  language: string | null;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { chatbotId } = await params;

    const supabase = await createClient();

    // Get chatbot - RLS policy ensures only published+active chatbots are returned
    const { data: chatbotData, error } = await (supabase as any)
      .from('chatbots')
      .select('id, name, welcome_message, placeholder_text, logo_url, widget_config, pre_chat_form_config, post_chat_survey_config, file_upload_config, proactive_messages_config, transcript_config, is_published, status, language')
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
            language: chatbot.language || 'en',
          },
          widgetConfig,
          preChatFormConfig: {
            ...DEFAULT_PRE_CHAT_FORM_CONFIG,
            ...(chatbot.pre_chat_form_config || {}),
          },
          postChatSurveyConfig: {
            ...DEFAULT_POST_CHAT_SURVEY_CONFIG,
            ...(chatbot.post_chat_survey_config || {}),
          },
          fileUploadConfig: {
            ...DEFAULT_FILE_UPLOAD_CONFIG,
            ...(chatbot.file_upload_config || {}),
          },
          proactiveMessagesConfig: {
            ...DEFAULT_PROACTIVE_MESSAGES_CONFIG,
            ...(chatbot.proactive_messages_config || {}),
          },
          transcriptConfig: {
            ...DEFAULT_TRANSCRIPT_CONFIG,
            ...(chatbot.transcript_config || {}),
          },
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
