/**
 * Per-Chatbot Discord Webhook Handler
 * POST /api/discord/webhook/[chatbotId]
 *
 * Handles Discord Interactions API requests:
 * - PING (type 1): Signature verification / endpoint validation
 * - APPLICATION_COMMAND (type 2): Slash command (/ask)
 *
 * Discord requires the HTTP response within 3 seconds.
 * - For PING: return { type: 1 } (PONG) as the HTTP body.
 * - For commands: return { type: 5 } (DEFERRED) as the HTTP body, then
 *   send the real answer as a follow-up via the webhooks REST endpoint.
 *
 * Pattern:
 * 1. For PING: return PONG immediately (no async work needed).
 * 2. For commands: return DEFERRED immediately, then use Next.js after()
 *    to process the AI response after the HTTP response is sent.
 *    after() keeps the process alive on serverless without blocking the response.
 */

import { after, NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { verifyDiscordSignature, sendFollowup } from '@/lib/discord/client';
import { handleDiscordInteraction } from '@/lib/discord/chat';
import { decryptToken } from '@/lib/telegram/crypto';
import {
  InteractionType,
  InteractionResponseType,
  type DiscordConfig,
  type DiscordInteraction,
} from '@/lib/discord/types';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ chatbotId: string }> }
) {
  const { chatbotId } = await params;

  // Validate chatbotId is a valid UUID
  if (!UUID_RE.test(chatbotId)) {
    return NextResponse.json({ error: 'Invalid chatbot ID' }, { status: 400 });
  }

  try {
    // Read raw body for signature verification (must be exact bytes)
    const rawBody = await request.text();

    // Load discord config from database
    const supabase = createAdminClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: chatbot } = await (supabase.from('chatbots') as any)
      .select('discord_config')
      .eq('id', chatbotId)
      .single();

    if (!chatbot?.discord_config) {
      return NextResponse.json({ error: 'Discord not configured' }, { status: 404 });
    }

    const config = chatbot.discord_config as DiscordConfig;

    if (!config.enabled || !config.public_key) {
      return NextResponse.json({ error: 'Discord integration not enabled' }, { status: 403 });
    }

    // ── Signature Verification ─────────────────────────────────────
    const signature = request.headers.get('X-Signature-Ed25519');
    const timestamp = request.headers.get('X-Signature-Timestamp');

    if (!signature || !timestamp) {
      return NextResponse.json({ error: 'Missing signature headers' }, { status: 401 });
    }

    const isValid = verifyDiscordSignature(config.public_key, signature, timestamp, rawBody);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    // ── Parse Interaction ──────────────────────────────────────────
    const interaction: DiscordInteraction = JSON.parse(rawBody);

    // ── PING (type 1) — Discord endpoint validation ────────────────
    if (interaction.type === InteractionType.PING) {
      return NextResponse.json({ type: InteractionResponseType.PONG });
    }

    // ── APPLICATION_COMMAND (type 2) — Slash commands ──────────────
    if (interaction.type === InteractionType.APPLICATION_COMMAND) {
      if (!config.ai_responses_enabled) {
        return NextResponse.json({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: { content: 'AI responses are currently disabled for this chatbot.' },
        });
      }

      // Decrypt bot token if needed
      const decryptedConfig = { ...config };
      if (decryptedConfig.bot_token) {
        decryptedConfig.bot_token = decryptToken(decryptedConfig.bot_token);
      }

      // Return DEFERRED immediately (Discord requires response within 3s).
      // Schedule AI processing to run after the response is sent using
      // Next.js after() — keeps the process alive without blocking the response.
      after(
        handleDiscordInteraction(chatbotId, decryptedConfig, interaction).catch(
          (err) => {
            console.error('[Discord Webhook] AI chat error:', err);
            sendFollowup(
              interaction.application_id,
              interaction.token,
              'Sorry, an error occurred while processing your question. Please try again.'
            ).catch(() => {});
          }
        )
      );

      return NextResponse.json({
        type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
      });
    }

    // Unhandled interaction type
    return NextResponse.json({ error: 'Unhandled interaction type' }, { status: 400 });
  } catch (error) {
    console.error('[Discord Webhook] Error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Discord webhook endpoint is active',
  });
}
