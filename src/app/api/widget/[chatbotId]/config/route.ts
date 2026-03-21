/**
 * Widget Configuration API
 * GET /api/widget/:chatbotId/config - Get widget configuration (public)
 */

import { NextRequest } from 'next/server';
import { DEFAULT_WIDGET_CONFIG, DEFAULT_PRE_CHAT_FORM_CONFIG, DEFAULT_POST_CHAT_SURVEY_CONFIG, DEFAULT_FILE_UPLOAD_CONFIG, DEFAULT_PROACTIVE_MESSAGES_CONFIG, DEFAULT_TRANSCRIPT_CONFIG, DEFAULT_ESCALATION_CONFIG, DEFAULT_LIVE_HANDOFF_CONFIG, DEFAULT_TELEGRAM_CONFIG } from '@/lib/chatbots/types';
import { createAdminClient } from '@/lib/supabase/admin';

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
  escalation_config: Record<string, unknown> | null;
  live_handoff_config: Record<string, unknown> | null;
  telegram_config: Record<string, unknown> | null;
  memory_enabled: boolean;
  session_ttl_hours: number | null;
  is_published: boolean;
  status: string;
  language: string | null;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { chatbotId } = await params;
    console.log('[Widget:Config] Fetching config for chatbot:', chatbotId);

    const supabase = createAdminClient();

    // Use admin client since widget visitors are unauthenticated
    // Filter to only published+active chatbots manually
    const { data: chatbotData, error } = await (supabase as any)
      .from('chatbots')
      .select('id, name, welcome_message, placeholder_text, logo_url, widget_config, pre_chat_form_config, post_chat_survey_config, file_upload_config, proactive_messages_config, transcript_config, escalation_config, live_handoff_config, telegram_config, memory_enabled, session_ttl_hours, is_published, status, language')
      .eq('id', chatbotId)
      .eq('is_published', true)
      .eq('status', 'active')
      .single();

    if (error || !chatbotData) {
      console.error('[Widget:Config] Chatbot not found:', { chatbotId, error: error?.message, code: error?.code, details: error?.details });
      return new Response(
        JSON.stringify({ success: false, error: { message: 'Chatbot not found or not available', details: error?.message } }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }
    console.log('[Widget:Config] Chatbot found:', chatbotData.id, chatbotData.name);

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
          escalationConfig: {
            ...DEFAULT_ESCALATION_CONFIG,
            ...(chatbot.escalation_config || {}),
          },
          liveHandoffConfig: {
            ...DEFAULT_LIVE_HANDOFF_CONFIG,
            ...(chatbot.live_handoff_config || {}),
          },
          agentsAvailable: await (async () => {
            try {
              const lhConfig = { ...DEFAULT_LIVE_HANDOFF_CONFIG, ...(chatbot.live_handoff_config || {}) };
              if (!lhConfig.enabled) return false;

              // Telegram is one channel
              const tc = { ...DEFAULT_TELEGRAM_CONFIG, ...(chatbot.telegram_config || {}) };
              const telegramReady = tc.enabled && !!tc.bot_token && !!tc.chat_id;
              if (telegramReady) return true;

              // Check online agents via heartbeat table
              if (lhConfig.require_agent_online !== false) {
                const admin = createAdminClient();
                const cutoff = new Date(Date.now() - 60_000).toISOString();
                const { count } = await (admin as any)
                  .from('agent_presence')
                  .select('id', { count: 'exact', head: true })
                  .eq('chatbot_id', chatbotId)
                  .gte('last_heartbeat', cutoff);
                return (count ?? 0) > 0;
              }

              return true;
            } catch {
              return false;
            }
          })(),
          memoryEnabled: chatbot.memory_enabled === true,
          sessionTtlHours: chatbot.session_ttl_hours ?? 24,
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
    console.error('[Widget:Config] Unexpected error:', error);
    return new Response(
      JSON.stringify({ success: false, error: { message: 'Internal server error', details: error instanceof Error ? error.message : String(error) } }),
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
