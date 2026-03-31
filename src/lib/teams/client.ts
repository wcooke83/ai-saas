/**
 * Microsoft Teams Bot Client
 * Per-chatbot Teams API wrapper for sending messages via Bot Framework.
 *
 * Authentication: OAuth2 client credentials flow against Microsoft identity.
 * Messages: POST to the serviceUrl provided in each incoming activity.
 */

import type { TeamsConfig, BotFrameworkTokenResponse } from './types';

const TOKEN_URL =
  'https://login.microsoftonline.com/botframework.com/oauth2/v2.0/token';
const BOT_FRAMEWORK_SCOPE = 'https://api.botframework.com/.default';

// ── Token Cache ────────────────────────────────────────────────────

interface TokenCache {
  token: string;
  expiresAt: number; // Unix ms
}

/** Per-appId token cache. Bot Framework tokens last ~1 hour. */
const tokenCache = new Map<string, TokenCache>();

/**
 * Get an OAuth token for the Bot Framework API.
 * Caches tokens and refreshes 5 minutes before expiry.
 */
export async function getTeamsBotToken(config: TeamsConfig): Promise<string> {
  if (!config.app_id || !config.app_secret) {
    throw new Error('[Teams] App ID and App Secret are required');
  }

  const cached = tokenCache.get(config.app_id);
  const now = Date.now();

  // Use cached token if still valid (with 5 min buffer)
  if (cached && cached.expiresAt > now + 5 * 60 * 1000) {
    return cached.token;
  }

  try {
    const body = new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: config.app_id,
      client_secret: config.app_secret,
      scope: BOT_FRAMEWORK_SCOPE,
    });

    const response = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Token request failed (${response.status}): ${errorText}`);
    }

    const data: BotFrameworkTokenResponse = await response.json();

    tokenCache.set(config.app_id, {
      token: data.access_token,
      expiresAt: now + data.expires_in * 1000,
    });

    return data.access_token;
  } catch (error) {
    console.error('[Teams] Failed to get bot token:', error);
    throw error;
  }
}

// ── Message Sending ────────────────────────────────────────────────

/**
 * Send a reply message to a Teams conversation.
 *
 * @param config - Teams config with app_id and app_secret
 * @param serviceUrl - The serviceUrl from the incoming activity
 * @param conversationId - The conversation ID to reply in
 * @param activityId - The activity ID being replied to (for threading)
 * @param text - The message text to send
 */
export async function sendTeamsMessage(
  config: TeamsConfig,
  serviceUrl: string,
  conversationId: string,
  activityId: string,
  text: string
): Promise<boolean> {
  if (!config.app_id || !config.app_secret) {
    console.error('[Teams] App ID or App Secret not configured');
    return false;
  }

  try {
    const token = await getTeamsBotToken(config);

    // Ensure serviceUrl ends without trailing slash
    const baseUrl = serviceUrl.replace(/\/+$/, '');
    const url = `${baseUrl}/v3/conversations/${conversationId}/activities/${activityId}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'message',
        text,
        textFormat: 'markdown',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Teams] Failed to send message:', response.status, errorText);
      return false;
    }

    return true;
  } catch (error) {
    console.error('[Teams] Failed to send message:', error);
    return false;
  }
}

/**
 * Send a typing indicator to a Teams conversation.
 * Shows "bot is typing..." in the Teams UI.
 */
export async function sendTeamsTypingIndicator(
  config: TeamsConfig,
  serviceUrl: string,
  conversationId: string
): Promise<void> {
  if (!config.app_id || !config.app_secret) return;

  try {
    const token = await getTeamsBotToken(config);
    const baseUrl = serviceUrl.replace(/\/+$/, '');
    const url = `${baseUrl}/v3/conversations/${conversationId}/activities`;

    await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'typing',
      }),
    });
  } catch {
    // Typing indicator is best-effort, don't fail on errors
  }
}

/**
 * Clear the token cache. Useful for testing.
 */
export function clearTokenCache(): void {
  tokenCache.clear();
}
