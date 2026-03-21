/**
 * Widget Escalation Report API
 * POST /api/widget/:chatbotId/report - Submit an escalation report (public)
 */

import { NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import type { EscalationReason, EscalationConfig, TelegramConfig } from '@/lib/chatbots/types';
import { DEFAULT_TELEGRAM_CONFIG } from '@/lib/chatbots/types';
import { initiateHandoff } from '@/lib/telegram/handoff';

const VALID_REASONS: EscalationReason[] = ['wrong_answer', 'offensive_content', 'need_human_help', 'other'];
const MAX_REPORTS_PER_HOUR = 5;

const corsHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
};

interface RouteParams {
  params: Promise<{ chatbotId: string }>;
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { chatbotId } = await params;
    const body = await req.json();

    const { session_id, conversation_id, message_id, reason, details } = body;

    // Validate required fields
    if (!session_id || typeof session_id !== 'string') {
      return new Response(
        JSON.stringify({ success: false, error: { message: 'session_id is required' } }),
        { status: 400, headers: corsHeaders }
      );
    }

    if (!reason || !VALID_REASONS.includes(reason)) {
      return new Response(
        JSON.stringify({ success: false, error: { message: `reason must be one of: ${VALID_REASONS.join(', ')}` } }),
        { status: 400, headers: corsHeaders }
      );
    }

    const supabase = createAdminClient();

    // Verify chatbot exists and is active
    const { data: chatbot, error: chatbotError } = await (supabase as any)
      .from('chatbots')
      .select('id, status, escalation_config, telegram_config')
      .eq('id', chatbotId)
      .single();

    if (chatbotError || !chatbot) {
      return new Response(
        JSON.stringify({ success: false, error: { message: 'Chatbot not found' } }),
        { status: 404, headers: corsHeaders }
      );
    }

    if (chatbot.status !== 'active') {
      return new Response(
        JSON.stringify({ success: false, error: { message: 'Chatbot is not active' } }),
        { status: 404, headers: corsHeaders }
      );
    }

    // Check escalation_config is enabled
    const escalationConfig = chatbot.escalation_config as EscalationConfig | null;
    if (!escalationConfig?.enabled) {
      return new Response(
        JSON.stringify({ success: false, error: { message: 'Escalation reporting is not enabled for this chatbot' } }),
        { status: 403, headers: corsHeaders }
      );
    }

    // Anti-abuse: count escalations for this session in the last hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count, error: countError } = await (supabase as any)
      .from('conversation_escalations')
      .select('id', { count: 'exact', head: true })
      .eq('session_id', session_id)
      .gte('created_at', oneHourAgo);

    if (countError) {
      console.error('Failed to check escalation rate limit:', countError);
      return new Response(
        JSON.stringify({ success: false, error: { message: 'Internal server error' } }),
        { status: 500, headers: corsHeaders }
      );
    }

    if ((count ?? 0) >= MAX_REPORTS_PER_HOUR) {
      return new Response(
        JSON.stringify({ success: false, error: { message: 'Too many reports. Please try again later.' } }),
        { status: 429, headers: corsHeaders }
      );
    }

    // Insert escalation
    const { data: result, error: insertError } = await (supabase as any)
      .from('conversation_escalations')
      .insert({
        chatbot_id: chatbotId,
        session_id,
        conversation_id: conversation_id || null,
        message_id: message_id || null,
        reason,
        details: details || null,
        status: 'open',
      })
      .select()
      .single();

    if (insertError) {
      console.error('Failed to save escalation report:', insertError);
      return new Response(
        JSON.stringify({ success: false, error: { message: 'Failed to save escalation report' } }),
        { status: 500, headers: corsHeaders }
      );
    }

    console.log(`[Escalation] Report saved for chatbot ${chatbotId}, session ${session_id}, reason: ${reason}`);

    // Auto-trigger handoff when user requests human help
    let handoffInitiated = false;
    const telegramConfig: TelegramConfig = {
      ...DEFAULT_TELEGRAM_CONFIG,
      ...(chatbot.telegram_config || {}),
    };

    const shouldHandoff = reason === 'need_human_help' || reason === 'other';
    const telegramReady =
      telegramConfig.enabled &&
      telegramConfig.bot_token &&
      telegramConfig.chat_id &&
      (telegramConfig.auto_handoff_on_escalation ?? true);

    if (shouldHandoff && telegramReady) {
      // Telegram is configured — initiate full Telegram handoff
      const handoffResult = await initiateHandoff({
        chatbotId,
        conversationId: conversation_id,
        sessionId: session_id,
        reason,
        details,
        escalationId: result.id,
        visitorName: body.visitor_name,
        visitorEmail: body.visitor_email,
        pageUrl: body.page_url,
      });

      handoffInitiated = handoffResult.success;
      if (handoffInitiated) {
        console.log(`[Escalation] Telegram handoff initiated for conversation ${conversation_id}`);
      }
    } else if (shouldHandoff && conversation_id) {
      // No Telegram — create a platform-only handoff session so the agent console picks it up
      const { data: existingHandoff } = await (supabase as any)
        .from('telegram_handoff_sessions')
        .select('id, status')
        .eq('conversation_id', conversation_id)
        .maybeSingle();

      if (existingHandoff && (existingHandoff.status === 'pending' || existingHandoff.status === 'active')) {
        // Already has an active handoff
        handoffInitiated = true;
      } else if (existingHandoff) {
        // Previous handoff was resolved — reopen it
        const { error: updateError } = await (supabase as any)
          .from('telegram_handoff_sessions')
          .update({
            status: 'pending',
            agent_name: null,
            agent_source: 'platform',
            agent_user_id: null,
            escalation_id: result.id,
            resolved_at: null,
          })
          .eq('id', existingHandoff.id);

        if (updateError) {
          console.error('[Escalation] Failed to reopen platform handoff session:', updateError);
        } else {
          handoffInitiated = true;
          console.log(`[Escalation] Platform handoff reopened for conversation ${conversation_id}`);
        }
      } else {
        // No existing handoff — create new
        const { error: handoffError } = await (supabase as any)
          .from('telegram_handoff_sessions')
          .insert({
            chatbot_id: chatbotId,
            conversation_id,
            session_id,
            status: 'pending',
            agent_source: 'platform',
            escalation_id: result.id,
          });

        if (handoffError) {
          console.error('[Escalation] Failed to create platform handoff session:', handoffError);
        } else {
          handoffInitiated = true;
          console.log(`[Escalation] Platform handoff initiated for conversation ${conversation_id}`);
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          escalation_id: result.id,
          handoff_initiated: handoffInitiated,
        },
      }),
      { status: 201, headers: corsHeaders }
    );
  } catch (error) {
    console.error('Escalation report API error:', error);
    return new Response(
      JSON.stringify({ success: false, error: { message: 'Internal server error' } }),
      { status: 500, headers: corsHeaders }
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
