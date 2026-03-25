/**
 * Widget Configuration API
 * GET /api/widget/:chatbotId/config - Get widget configuration (public)
 */

import { NextRequest } from 'next/server';
import { DEFAULT_WIDGET_CONFIG, DEFAULT_PRE_CHAT_FORM_CONFIG, DEFAULT_POST_CHAT_SURVEY_CONFIG, DEFAULT_FILE_UPLOAD_CONFIG, DEFAULT_PROACTIVE_MESSAGES_CONFIG, DEFAULT_TRANSCRIPT_CONFIG, DEFAULT_ESCALATION_CONFIG, DEFAULT_FEEDBACK_CONFIG, DEFAULT_LIVE_HANDOFF_CONFIG, DEFAULT_TELEGRAM_CONFIG, DEFAULT_CREDIT_EXHAUSTION_CONFIG } from '@/lib/chatbots/types';
import { createAdminClient } from '@/lib/supabase/admin';
import { getChatbotCorsOrigin } from '@/lib/api/cors';

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
  feedback_config: Record<string, unknown> | null;
  live_handoff_config: Record<string, unknown> | null;
  telegram_config: Record<string, unknown> | null;
  credit_exhaustion_mode: string | null;
  credit_exhaustion_config: Record<string, unknown> | null;
  monthly_message_limit: number;
  messages_this_month: number;
  memory_enabled: boolean;
  session_ttl_hours: number | null;
  is_published: boolean;
  status: string;
  language: string | null;
  allowed_origins: string[] | null;
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
      .select('id, name, welcome_message, placeholder_text, logo_url, widget_config, pre_chat_form_config, post_chat_survey_config, file_upload_config, proactive_messages_config, transcript_config, escalation_config, feedback_config, live_handoff_config, telegram_config, credit_exhaustion_mode, credit_exhaustion_config, monthly_message_limit, messages_this_month, memory_enabled, session_ttl_hours, is_published, status, language, allowed_origins')
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
    const corsOrigin = getChatbotCorsOrigin(chatbot.allowed_origins, req.headers.get('origin'));

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
          feedbackConfig: {
            ...DEFAULT_FEEDBACK_CONFIG,
            ...(chatbot.feedback_config || {}),
          },
          liveHandoffConfig: {
            ...DEFAULT_LIVE_HANDOFF_CONFIG,
            ...(chatbot.live_handoff_config || {}),
          },
          agentsAvailable: (() => {
            const lhConfig = { ...DEFAULT_LIVE_HANDOFF_CONFIG, ...(chatbot.live_handoff_config || {}) };
            if (!lhConfig.enabled) return false;
            // Telegram is always-on if configured
            const tc = { ...DEFAULT_TELEGRAM_CONFIG, ...(chatbot.telegram_config || {}) };
            if (tc.enabled && !!tc.bot_token && !!tc.chat_id) return true;
            // Agent console presence is detected via Supabase Realtime Presence
            // on the `agent-presence:${chatbotId}` channel — no server query needed
            return false;
          })(),
          creditExhausted: chatbot.monthly_message_limit > 0 && chatbot.messages_this_month >= chatbot.monthly_message_limit,
          creditLow: (() => {
            const creditExhausted = chatbot.monthly_message_limit > 0 && chatbot.messages_this_month >= chatbot.monthly_message_limit;
            const usageRatio = chatbot.monthly_message_limit > 0 ? chatbot.messages_this_month / chatbot.monthly_message_limit : 0;
            return chatbot.monthly_message_limit > 0 && usageRatio >= 0.8 && !creditExhausted;
          })(),
          creditRemaining: chatbot.monthly_message_limit > 0 ? Math.max(0, chatbot.monthly_message_limit - chatbot.messages_this_month) : null,
          creditExhaustionMode: chatbot.credit_exhaustion_mode || 'tickets',
          creditExhaustionConfig: {
            ...DEFAULT_CREDIT_EXHAUSTION_CONFIG,
            ...(chatbot.credit_exhaustion_config || {}),
          },
          creditPackages: await (async () => {
            if ((chatbot.credit_exhaustion_mode || 'tickets') !== 'purchase_credits') return [];
            const creditExhausted = chatbot.monthly_message_limit > 0 && chatbot.messages_this_month >= chatbot.monthly_message_limit;
            const usageRatio = chatbot.monthly_message_limit > 0 ? chatbot.messages_this_month / chatbot.monthly_message_limit : 0;
            const creditLow = chatbot.monthly_message_limit > 0 && usageRatio >= 0.8 && !creditExhausted;
            if (!creditExhausted && !creditLow) return [];
            // Fetch global packages, filter out any disabled by this chatbot
            const { data: pkgs } = await supabase
              .from('credit_packages')
              .select('id, name, credit_amount, price_cents, stripe_price_id')
              .eq('is_global', true)
              .eq('active', true)
              .order('sort_order', { ascending: true });
            const disabledIds: string[] = (chatbot.credit_exhaustion_config as any)?.purchase_credits?.disabledPackageIds || [];
            return (pkgs || [])
              .filter((p: any) => !disabledIds.includes(p.id))
              .map((p: any) => ({
                id: p.id, name: p.name, creditAmount: p.credit_amount,
                priceCents: p.price_cents, stripePriceId: p.stripe_price_id,
              }));
          })(),
          memoryEnabled: chatbot.memory_enabled === true,
          sessionTtlHours: chatbot.session_ttl_hours ?? 24,
        },
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': corsOrigin,
          'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
        },
      }
    );
  } catch (error) {
    console.error('[Widget:Config] Unexpected error:', error);
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
export async function OPTIONS(req: NextRequest, { params }: RouteParams) {
  const { chatbotId } = await params;
  let corsOriginHeader = '*';
  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from('chatbots')
      .select('allowed_origins')
      .eq('id', chatbotId)
      .single();
    if (data) {
      corsOriginHeader = getChatbotCorsOrigin(
        (data as any).allowed_origins,
        req.headers.get('origin')
      );
    }
  } catch {
    // Fall through with wildcard
  }
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': corsOriginHeader,
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
