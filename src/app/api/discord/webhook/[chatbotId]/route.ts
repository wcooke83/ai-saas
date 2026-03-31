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
 * In Next.js Node.js runtime, we can't return a response AND continue
 * processing in the same handler (the response is sent when handler returns).
 * So the pattern is:
 * 1. For PING: return PONG immediately (no async work needed).
 * 2. For commands: return DEFERRED immediately AND fire off the async work.
 *    In Node.js serverless, the process may die after the response is sent,
 *    so we await the chat promise before returning to keep the process alive.
 *    Discord is tolerant of a slightly delayed HTTP response (< ~5s in practice)
 *    as long as the response type is DEFERRED.
 *    For true fire-and-forget, we would need edge runtime + waitUntil.
 */

import { NextRequest, NextResponse } from 'next/server';
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

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ chatbotId: string }> }
) {
  const { chatbotId } = await params;

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

      // Process the AI response asynchronously.
      // handleDiscordInteraction sends the result via follow-up webhook.
      const chatPromise = handleDiscordInteraction(chatbotId, decryptedConfig, interaction).catch(
        (err) => {
          console.error('[Discord Webhook] AI chat error:', err);
          sendFollowup(
            interaction.application_id,
            interaction.token,
            'Sorry, an error occurred while processing your question. Please try again.'
          ).catch(() => {});
        }
      );

      // Await to keep the Node.js process alive (same pattern as Telegram).
      // The DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE response type tells Discord
      // to show a "thinking..." indicator while we process.
      await chatPromise;

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
