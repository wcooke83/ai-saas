/**
 * Slack Integration for Chatbots
 * Handles OAuth, message sending, and event processing
 */

import { createAdminClient } from '@/lib/supabase/admin';
import { getRAGContext, buildRAGPrompt, buildSystemPrompt } from '../rag';
import { getChatbot, createMessage, getOrCreateConversation, getMessages } from '../api';
import { generate } from '@/lib/ai/provider';
import type { Chatbot } from '../types';

export interface SlackIntegration {
  id: string;
  chatbot_id: string;
  team_id: string;
  team_name: string | null;
  bot_token: string;
  bot_user_id: string | null;
  channel_ids: string[] | null;
  is_active: boolean | null;
  mention_only: boolean | null;
  user_id: string;
  created_at: string | null;
  updated_at: string | null;
}

const SLACK_CLIENT_ID = process.env.SLACK_CLIENT_ID || '';
const SLACK_CLIENT_SECRET = process.env.SLACK_CLIENT_SECRET || '';
const SLACK_SIGNING_SECRET = process.env.SLACK_SIGNING_SECRET || '';

/**
 * Generate Slack OAuth URL
 */
export function getSlackOAuthURL(chatbotId: string, redirectUri: string): string {
  const scopes = [
    'app_mentions:read',
    'channels:history',
    'channels:read',
    'chat:write',
    'im:history',
    'im:read',
    'im:write',
    'users:read',
  ].join(',');

  const params = new URLSearchParams({
    client_id: SLACK_CLIENT_ID,
    scope: scopes,
    redirect_uri: redirectUri,
    state: chatbotId,
  });

  return `https://slack.com/oauth/v2/authorize?${params.toString()}`;
}

/**
 * Exchange OAuth code for access token
 */
export async function exchangeSlackCode(
  code: string,
  redirectUri: string
): Promise<{
  ok: boolean;
  team_id?: string;
  team_name?: string;
  access_token?: string;
  app_id?: string;
  error?: string;
}> {
  const response = await fetch('https://slack.com/api/oauth.v2.access', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: SLACK_CLIENT_ID,
      client_secret: SLACK_CLIENT_SECRET,
      code,
      redirect_uri: redirectUri,
    }),
  });

  const data = await response.json();

  if (!data.ok) {
    return { ok: false, error: data.error };
  }

  return {
    ok: true,
    team_id: data.team?.id,
    team_name: data.team?.name,
    access_token: data.access_token,
    app_id: data.app_id,
  };
}

/**
 * Save Slack integration
 */
export async function saveSlackIntegration(
  chatbotId: string,
  teamId: string,
  teamName: string,
  botToken: string,
  userId: string
): Promise<SlackIntegration> {
  const supabase = createAdminClient();

  // Check if integration already exists
  const { data: existing } = await supabase
    .from('slack_integrations')
    .select('*')
    .eq('chatbot_id', chatbotId)
    .eq('team_id', teamId)
    .single();

  if (existing) {
    // Update existing
    const { data, error } = await supabase
      .from('slack_integrations')
      .update({
        bot_token: botToken,
        team_name: teamName,
        is_active: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Create new
  const { data, error } = await supabase
    .from('slack_integrations')
    .insert({
      chatbot_id: chatbotId,
      team_id: teamId,
      team_name: teamName,
      bot_token: botToken,
      user_id: userId,
      channel_ids: [],
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get Slack integration for a chatbot
 */
export async function getSlackIntegration(chatbotId: string): Promise<SlackIntegration | null> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('slack_integrations')
    .select('*')
    .eq('chatbot_id', chatbotId)
    .eq('is_active', true)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

/**
 * Delete Slack integration
 */
export async function deleteSlackIntegration(chatbotId: string): Promise<void> {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from('slack_integrations')
    .update({ is_active: false })
    .eq('chatbot_id', chatbotId);

  if (error) throw error;
}

/**
 * Send a message to Slack
 */
export async function sendSlackMessage(
  botToken: string,
  channel: string,
  text: string,
  threadTs?: string
): Promise<{ ok: boolean; ts?: string; error?: string }> {
  const response = await fetch('https://slack.com/api/chat.postMessage', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${botToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      channel,
      text,
      ...(threadTs && { thread_ts: threadTs }),
    }),
  });

  return response.json();
}

/**
 * Verify Slack request signature
 */
export function verifySlackSignature(
  signature: string,
  timestamp: string,
  body: string
): boolean {
  const crypto = require('crypto');
  const baseString = `v0:${timestamp}:${body}`;
  const expectedSignature = `v0=${crypto
    .createHmac('sha256', SLACK_SIGNING_SECRET)
    .update(baseString)
    .digest('hex')}`;

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

/**
 * Handle Slack event (mention or DM)
 */
export async function handleSlackEvent(
  chatbotId: string,
  event: {
    type: string;
    user: string;
    text: string;
    channel: string;
    ts: string;
    thread_ts?: string;
  }
): Promise<void> {
  // Get chatbot and integration
  const chatbot = await getChatbot(chatbotId);
  if (!chatbot || !chatbot.is_published) return;

  const integration = await getSlackIntegration(chatbotId);
  if (!integration) return;

  // Clean message text (remove bot mention)
  const cleanText = event.text.replace(/<@[A-Z0-9]+>/g, '').trim();
  if (!cleanText) return;

  // Create session ID from channel and thread
  const sessionId = `slack_${event.channel}_${event.thread_ts || event.ts}`;

  // Get or create conversation
  const conversation = await getOrCreateConversation(
    chatbotId,
    sessionId,
    'slack',
    event.user
  );

  // Get conversation history
  const history = await getMessages(conversation.id);

  // Save user message
  await createMessage({
    conversation_id: conversation.id,
    chatbot_id: chatbotId,
    role: 'user',
    content: cleanText,
    metadata: {
      slack_user: event.user,
      slack_channel: event.channel,
      slack_ts: event.ts,
    },
  });

  // Get RAG context
  const ragContext = await getRAGContext(chatbot, cleanText);

  // Build prompt
  const systemPrompt = buildSystemPrompt(chatbot, ragContext.chunks.length > 0);
  const userPrompt = buildRAGPrompt(ragContext, history, cleanText);

  // Generate response
  const modelMap: Record<string, 'balanced' | 'powerful' | 'fast'> = {
    'claude-3-haiku-20240307': 'fast',
    'claude-3-5-sonnet-20241022': 'balanced',
    'claude-sonnet-4-20250514': 'powerful',
  };
  const modelLevel = modelMap[chatbot.model] || 'balanced';

  const result = await generate(userPrompt, {
    provider: 'claude',
    model: modelLevel,
    systemPrompt,
    temperature: chatbot.temperature,
    maxTokens: chatbot.max_tokens,
  });

  // Save assistant message
  await createMessage({
    conversation_id: conversation.id,
    chatbot_id: chatbotId,
    role: 'assistant',
    content: result.content,
    model: chatbot.model,
    tokens_input: result.tokensInput,
    tokens_output: result.tokensOutput,
    context_chunks: ragContext.chunks.map((c) => c.id),
  });

  // Reply in Slack
  await sendSlackMessage(
    integration.bot_token,
    event.channel,
    result.content,
    event.thread_ts || event.ts
  );
}
