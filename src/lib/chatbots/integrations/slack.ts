/**
 * Slack Integration for Chatbots
 * Handles OAuth, message sending, and event processing
 */

import crypto from 'crypto';
import { createAdminClient } from '@/lib/supabase/admin';
import { getChatbot } from '../api';
import { executeChat, QuotaExhaustedError } from '../execute-chat';

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

/** Max age for OAuth state parameter (10 minutes) */
const OAUTH_STATE_MAX_AGE_MS = 10 * 60 * 1000;

/**
 * Sign an OAuth state parameter with HMAC-SHA256.
 * Format: chatbotId:timestamp:signature
 */
export function signOAuthState(chatbotId: string): string {
  const timestamp = Date.now().toString();
  const signature = crypto
    .createHmac('sha256', SLACK_CLIENT_SECRET)
    .update(`${chatbotId}${timestamp}`)
    .digest('hex');
  return `${chatbotId}:${timestamp}:${signature}`;
}

/**
 * Verify and extract chatbot ID from a signed OAuth state parameter.
 * Returns the chatbot ID if valid, null if invalid or expired.
 */
export function verifyOAuthState(state: string): string | null {
  const parts = state.split(':');
  if (parts.length !== 3) return null;

  const [chatbotId, timestamp, signature] = parts;
  if (!chatbotId || !timestamp || !signature) return null;

  // Check timestamp is not older than 10 minutes
  const ts = parseInt(timestamp, 10);
  if (isNaN(ts) || Date.now() - ts > OAUTH_STATE_MAX_AGE_MS) return null;

  // Verify HMAC signature
  const expectedSignature = crypto
    .createHmac('sha256', SLACK_CLIENT_SECRET)
    .update(`${chatbotId}${timestamp}`)
    .digest('hex');

  const signatureBuffer = Buffer.from(signature, 'hex');
  const expectedBuffer = Buffer.from(expectedSignature, 'hex');
  if (signatureBuffer.length !== expectedBuffer.length) return null;

  if (!crypto.timingSafeEqual(signatureBuffer, expectedBuffer)) return null;

  return chatbotId;
}

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
    state: signOAuthState(chatbotId),
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
  bot_user_id?: string;
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
    bot_user_id: data.bot_user_id,
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
  userId: string,
  botUserId?: string | null
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
        ...(botUserId !== undefined && { bot_user_id: botUserId }),
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
      bot_user_id: botUserId ?? null,
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
 * Update Slack integration config (mention_only, channel_ids)
 */
export async function updateSlackIntegrationConfig(
  chatbotId: string,
  config: { mention_only?: boolean; channel_ids?: string[] }
): Promise<SlackIntegration> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('slack_integrations')
    .update({
      ...(config.mention_only !== undefined && { mention_only: config.mention_only }),
      ...(config.channel_ids !== undefined && { channel_ids: config.channel_ids }),
      updated_at: new Date().toISOString(),
    })
    .eq('chatbot_id', chatbotId)
    .eq('is_active', true)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Check if another chatbot already owns this Slack workspace
 */
export async function getWorkspaceConflict(
  teamId: string,
  currentChatbotId: string
): Promise<{ chatbot_id: string; chatbot_name: string; team_name: string } | null> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('slack_integrations')
    .select('chatbot_id, team_name, chatbots!inner(name)')
    .eq('team_id', teamId)
    .eq('is_active', true)
    .neq('chatbot_id', currentChatbotId)
    .limit(1)
    .single();

  if (error || !data) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chatbots = data.chatbots as any;
  return {
    chatbot_id: data.chatbot_id,
    chatbot_name: chatbots?.name || 'Unknown',
    team_name: data.team_name || '',
  };
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

const SLACK_MAX_MSG_LENGTH = 3900;

/**
 * Split text into chunks at the nearest newline or space boundary
 */
function splitMessage(text: string): string[] {
  if (text.length <= SLACK_MAX_MSG_LENGTH) return [text];

  const chunks: string[] = [];
  let remaining = text;

  while (remaining.length > SLACK_MAX_MSG_LENGTH) {
    let splitIdx = remaining.lastIndexOf('\n', SLACK_MAX_MSG_LENGTH);
    if (splitIdx <= 0) splitIdx = remaining.lastIndexOf(' ', SLACK_MAX_MSG_LENGTH);
    if (splitIdx <= 0) splitIdx = SLACK_MAX_MSG_LENGTH;

    chunks.push(remaining.slice(0, splitIdx));
    remaining = remaining.slice(splitIdx).trimStart();
  }

  if (remaining) chunks.push(remaining);
  return chunks;
}

/**
 * Send a message to Slack (auto-splits messages exceeding 4000 char limit)
 */
export async function sendSlackMessage(
  botToken: string,
  channel: string,
  text: string,
  threadTs?: string
): Promise<{ ok: boolean; ts?: string; error?: string }> {
  const chunks = splitMessage(text);
  let lastResult: { ok: boolean; ts?: string; error?: string } = { ok: false };

  for (const chunk of chunks) {
    const response = await fetch('https://slack.com/api/chat.postMessage', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${botToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        channel,
        text: chunk,
        ...(threadTs && { thread_ts: threadTs }),
      }),
    });

    lastResult = await response.json();
    if (!lastResult.ok) return lastResult;
  }

  return lastResult;
}

/**
 * Verify Slack request signature
 */
export function verifySlackSignature(
  signature: string,
  timestamp: string,
  body: string
): boolean {
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
 *
 * Delegates to the shared executeChat() pipeline so Slack automatically
 * gets visitor memory, performance logging, sentiment analysis, webhook
 * events, calendar integration, and quota management — same as the widget.
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
  // Get chatbot and integration (Slack-specific guards)
  const chatbot = await getChatbot(chatbotId);
  if (!chatbot || !chatbot.is_published) return;

  const integration = await getSlackIntegration(chatbotId);
  if (!integration) return;

  // Skip bot's own messages to prevent infinite loops
  if (integration.bot_user_id && event.user === integration.bot_user_id) return;

  // Channel filtering: if channel_ids is non-empty, only process events from those channels
  if (integration.channel_ids && integration.channel_ids.length > 0) {
    if (!integration.channel_ids.includes(event.channel)) return;
  }

  // Mention-only mode: only process app_mention events, ignore DMs/messages
  if (integration.mention_only) {
    if (event.type !== 'app_mention') return;
  }

  // Clean message text (remove bot mention)
  const cleanText = event.text.replace(/<@[A-Z0-9]+>/g, '').trim();
  if (!cleanText) return;

  // Thread-based session ID (Slack-specific)
  const sessionId = `slack_${event.channel}_${event.thread_ts || event.ts}`;

  try {
    // Delegate to shared chat pipeline (handles quota, RAG, memory,
    // sentiment, webhooks, perf logging, message persistence)
    const result = await executeChat({
      chatbotId,
      message: cleanText,
      sessionId,
      channel: 'slack',
      visitorId: event.user,
      stream: false,
    });

    // Reply in Slack (Slack-specific: message splitting for 4000 char limit)
    await sendSlackMessage(
      integration.bot_token,
      event.channel,
      result.content,
      event.thread_ts || event.ts
    );
  } catch (error) {
    if (error instanceof QuotaExhaustedError) {
      console.warn(
        `[Slack:Limit] Chatbot "${chatbot.name || chatbotId}" hit monthly message limit`
      );
      await sendSlackMessage(
        integration.bot_token,
        event.channel,
        'This chatbot has reached its monthly message limit. Please contact the chatbot owner.',
        event.thread_ts || event.ts
      );
      return;
    }
    // Re-throw unexpected errors
    throw error;
  }
}
