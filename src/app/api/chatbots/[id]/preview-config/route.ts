/**
 * Preview Configuration API
 * GET /api/chatbots/:id/preview-config - Get widget config for dashboard preview (authenticated)
 *
 * Same data as /api/widget/:chatbotId/config but requires a valid dashboard
 * session instead of checking is_published/status. This allows the deploy page
 * preview iframe to work for unpublished chatbots.
 */

import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import {
  DEFAULT_WIDGET_CONFIG,
  DEFAULT_PRE_CHAT_FORM_CONFIG,
  DEFAULT_POST_CHAT_SURVEY_CONFIG,
  DEFAULT_FILE_UPLOAD_CONFIG,
  DEFAULT_PROACTIVE_MESSAGES_CONFIG,
  DEFAULT_TRANSCRIPT_CONFIG,
  DEFAULT_ESCALATION_CONFIG,
  DEFAULT_FEEDBACK_CONFIG,
  DEFAULT_LIVE_HANDOFF_CONFIG,
  DEFAULT_TELEGRAM_CONFIG,
  DEFAULT_CREDIT_EXHAUSTION_CONFIG,
} from '@/lib/chatbots/types';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id: chatbotId } = await params;

    // Require authenticated dashboard session
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return new Response(
        JSON.stringify({ success: false, error: { message: 'Authentication required' } }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Fetch chatbot WITHOUT is_published/status checks, but verify ownership
    const adminSupabase = createAdminClient();
    const { data: chatbotData, error } = await (adminSupabase as any)
      .from('chatbots')
      .select(
        'id, name, welcome_message, placeholder_text, logo_url, widget_config, pre_chat_form_config, post_chat_survey_config, file_upload_config, proactive_messages_config, transcript_config, escalation_config, feedback_config, live_handoff_config, telegram_config, credit_exhaustion_mode, credit_exhaustion_config, monthly_message_limit, messages_this_month, purchased_credits_remaining, memory_enabled, session_ttl_hours, is_published, status, language, allowed_origins, user_id'
      )
      .eq('id', chatbotId)
      .single();

    if (error || !chatbotData) {
      return new Response(
        JSON.stringify({ success: false, error: { message: 'Chatbot not found' } }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Verify the authenticated user owns this chatbot
    if (chatbotData.user_id !== user.id) {
      return new Response(
        JSON.stringify({ success: false, error: { message: 'Forbidden' } }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Build the same config response as the public widget config endpoint
    const widgetConfig = {
      ...DEFAULT_WIDGET_CONFIG,
      ...(chatbotData.widget_config || {}),
    };

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          chatbot: {
            id: chatbotData.id,
            name: chatbotData.name,
            welcome_message: chatbotData.welcome_message,
            placeholder_text: chatbotData.placeholder_text,
            logo_url: chatbotData.logo_url,
            language: chatbotData.language || 'en',
          },
          widgetConfig,
          preChatFormConfig: {
            ...DEFAULT_PRE_CHAT_FORM_CONFIG,
            ...(chatbotData.pre_chat_form_config || {}),
          },
          postChatSurveyConfig: {
            ...DEFAULT_POST_CHAT_SURVEY_CONFIG,
            ...(chatbotData.post_chat_survey_config || {}),
          },
          fileUploadConfig: {
            ...DEFAULT_FILE_UPLOAD_CONFIG,
            ...(chatbotData.file_upload_config || {}),
          },
          proactiveMessagesConfig: {
            ...DEFAULT_PROACTIVE_MESSAGES_CONFIG,
            ...(chatbotData.proactive_messages_config || {}),
          },
          transcriptConfig: {
            ...DEFAULT_TRANSCRIPT_CONFIG,
            ...(chatbotData.transcript_config || {}),
          },
          escalationConfig: {
            ...DEFAULT_ESCALATION_CONFIG,
            ...(chatbotData.escalation_config || {}),
          },
          feedbackConfig: {
            ...DEFAULT_FEEDBACK_CONFIG,
            ...(chatbotData.feedback_config || {}),
          },
          liveHandoffConfig: {
            ...DEFAULT_LIVE_HANDOFF_CONFIG,
            ...(chatbotData.live_handoff_config || {}),
          },
          agentsAvailable: (() => {
            const lhConfig = {
              ...DEFAULT_LIVE_HANDOFF_CONFIG,
              ...(chatbotData.live_handoff_config || {}),
            };
            if (!lhConfig.enabled) return false;
            const tc = {
              ...DEFAULT_TELEGRAM_CONFIG,
              ...(chatbotData.telegram_config || {}),
            };
            if (tc.enabled && !!tc.bot_token && !!tc.chat_id) return true;
            return false;
          })(),
          creditExhausted: (() => {
            if (!chatbotData.monthly_message_limit || chatbotData.monthly_message_limit <= 0)
              return false;
            const monthlyRemaining = Math.max(
              0,
              chatbotData.monthly_message_limit - (chatbotData.messages_this_month || 0)
            );
            const purchasedRemaining = chatbotData.purchased_credits_remaining || 0;
            if ((chatbotData.credit_exhaustion_mode || 'tickets') === 'purchase_credits')
              return false;
            return monthlyRemaining + purchasedRemaining <= 0;
          })(),
          creditLow: (() => {
            if ((chatbotData.credit_exhaustion_mode || 'tickets') === 'purchase_credits')
              return false;
            if (!chatbotData.monthly_message_limit || chatbotData.monthly_message_limit <= 0)
              return false;
            const monthlyRemaining = Math.max(
              0,
              chatbotData.monthly_message_limit - (chatbotData.messages_this_month || 0)
            );
            const purchasedRemaining = chatbotData.purchased_credits_remaining || 0;
            const totalRemaining = monthlyRemaining + purchasedRemaining;
            const totalExhausted = totalRemaining <= 0;
            const usageRatio =
              (chatbotData.messages_this_month || 0) / chatbotData.monthly_message_limit;
            return usageRatio >= 0.8 && !totalExhausted;
          })(),
          creditRemaining: (() => {
            if ((chatbotData.credit_exhaustion_mode || 'tickets') === 'purchase_credits')
              return null;
            if (!chatbotData.monthly_message_limit || chatbotData.monthly_message_limit <= 0)
              return null;
            const monthlyRemaining = Math.max(
              0,
              chatbotData.monthly_message_limit - (chatbotData.messages_this_month || 0)
            );
            return monthlyRemaining + (chatbotData.purchased_credits_remaining || 0);
          })(),
          creditExhaustionMode: chatbotData.credit_exhaustion_mode || 'tickets',
          creditExhaustionConfig: {
            ...DEFAULT_CREDIT_EXHAUSTION_CONFIG,
            ...(chatbotData.credit_exhaustion_config || {}),
          },
          creditPackages: [],
          memoryEnabled: chatbotData.memory_enabled === true,
          sessionTtlHours: chatbotData.session_ttl_hours ?? 24,
        },
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          // No caching -- preview config is for authenticated dashboard use only
          'Cache-Control': 'no-store',
        },
      }
    );
  } catch (error) {
    console.error('[Preview:Config] Unexpected error:', error);
    return new Response(
      JSON.stringify({ success: false, error: { message: 'Internal server error' } }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
