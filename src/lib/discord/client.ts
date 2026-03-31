/**
 * Discord Bot Client
 * Per-chatbot Discord API wrapper for the slash-command integration.
 * Uses the Discord Interactions API (HTTP, no WebSocket gateway).
 */

import crypto from 'crypto';

const DISCORD_API_BASE = 'https://discord.com/api/v10';
const DISCORD_MAX_MSG_LENGTH = 2000;

// ── Signature Verification ─────────────────────────────────────────

/**
 * Verify a Discord interaction request signature using Ed25519.
 * Discord sends X-Signature-Ed25519 and X-Signature-Timestamp headers.
 */
export function verifyDiscordSignature(
  publicKey: string,
  signature: string,
  timestamp: string,
  body: string
): boolean {
  try {
    const message = Buffer.from(timestamp + body);
    const sig = Buffer.from(signature, 'hex');
    const key = Buffer.from(publicKey, 'hex');

    return crypto.verify(null, message, { key: createEd25519PublicKey(key), format: 'pem' }, sig);
  } catch {
    return false;
  }
}

/**
 * Convert a raw Ed25519 public key (32 bytes) to PEM format for Node.js crypto.verify.
 */
function createEd25519PublicKey(rawKey: Buffer): string {
  // Ed25519 public key DER prefix (ASN.1 header for Ed25519)
  const derPrefix = Buffer.from('302a300506032b6570032100', 'hex');
  const derKey = Buffer.concat([derPrefix, rawKey]);
  const b64 = derKey.toString('base64');
  return `-----BEGIN PUBLIC KEY-----\n${b64}\n-----END PUBLIC KEY-----`;
}

// ── Interaction Responses ──────────────────────────────────────────

/**
 * Send an initial response to an interaction (within 3-second window).
 * This is used for immediate replies or deferred acks.
 */
export async function respondToInteraction(
  interactionId: string,
  interactionToken: string,
  responseType: number,
  content?: string
): Promise<boolean> {
  try {
    const payload: Record<string, unknown> = { type: responseType };
    if (content) {
      payload.data = { content: truncateMessage(content) };
    }

    const response = await fetch(
      `${DISCORD_API_BASE}/interactions/${interactionId}/${interactionToken}/callback`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const text = await response.text();
      console.error('[Discord] respondToInteraction error:', response.status, text);
      return false;
    }

    return true;
  } catch (error) {
    console.error('[Discord] respondToInteraction failed:', error);
    return false;
  }
}

/**
 * Send a follow-up message after a deferred response.
 * Used when the AI response takes longer than 3 seconds.
 */
export async function sendFollowup(
  applicationId: string,
  interactionToken: string,
  content: string
): Promise<boolean> {
  const chunks = splitDiscordMessage(content);

  for (const chunk of chunks) {
    try {
      const response = await fetch(
        `${DISCORD_API_BASE}/webhooks/${applicationId}/${interactionToken}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: chunk }),
        }
      );

      if (!response.ok) {
        const text = await response.text();
        console.error('[Discord] sendFollowup error:', response.status, text);
        return false;
      }
    } catch (error) {
      console.error('[Discord] sendFollowup failed:', error);
      return false;
    }
  }

  return true;
}

// ── Slash Command Registration ─────────────────────────────────────

/**
 * Register the /ask slash command with Discord.
 * If guildId is provided, registers as a guild command (instant);
 * otherwise registers globally (may take up to 1 hour to propagate).
 */
export async function registerSlashCommand(
  applicationId: string,
  botToken: string,
  guildId?: string
): Promise<{ success: boolean; commandId?: string; error?: string }> {
  const url = guildId
    ? `${DISCORD_API_BASE}/applications/${applicationId}/guilds/${guildId}/commands`
    : `${DISCORD_API_BASE}/applications/${applicationId}/commands`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bot ${botToken}`,
      },
      body: JSON.stringify({
        name: 'ask',
        description: 'Ask the AI chatbot a question',
        type: 1, // CHAT_INPUT
        options: [
          {
            name: 'question',
            description: 'Your question for the chatbot',
            type: 3, // STRING
            required: true,
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[Discord] registerSlashCommand error:', data);
      return { success: false, error: data.message || 'Failed to register command' };
    }

    console.log('[Discord] Slash command registered:', data.id);
    return { success: true, commandId: data.id };
  } catch (error) {
    console.error('[Discord] registerSlashCommand failed:', error);
    return { success: false, error: String(error) };
  }
}

/**
 * Delete a registered slash command.
 */
export async function deleteSlashCommand(
  applicationId: string,
  botToken: string,
  commandId: string,
  guildId?: string
): Promise<boolean> {
  const url = guildId
    ? `${DISCORD_API_BASE}/applications/${applicationId}/guilds/${guildId}/commands/${commandId}`
    : `${DISCORD_API_BASE}/applications/${applicationId}/commands/${commandId}`;

  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: { Authorization: `Bot ${botToken}` },
    });

    return response.ok || response.status === 404;
  } catch (error) {
    console.error('[Discord] deleteSlashCommand failed:', error);
    return false;
  }
}

// ── Message Utilities ──────────────────────────────────────────────

/**
 * Split text into chunks respecting Discord's 2000 char limit.
 * Breaks at newline or space boundaries when possible.
 */
export function splitDiscordMessage(text: string, maxLength = DISCORD_MAX_MSG_LENGTH): string[] {
  if (text.length <= maxLength) return [text];

  const chunks: string[] = [];
  let remaining = text;

  while (remaining.length > maxLength) {
    let splitIdx = remaining.lastIndexOf('\n', maxLength);
    if (splitIdx <= 0) splitIdx = remaining.lastIndexOf(' ', maxLength);
    if (splitIdx <= 0) splitIdx = maxLength;

    chunks.push(remaining.slice(0, splitIdx));
    remaining = remaining.slice(splitIdx).trimStart();
  }

  if (remaining) chunks.push(remaining);
  return chunks;
}

/**
 * Truncate a message to fit within the Discord limit.
 */
function truncateMessage(text: string, maxLength = DISCORD_MAX_MSG_LENGTH): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}
