/**
 * Discord Integration Setup
 * POST /api/discord/setup - Save config, register slash command, return webhook URL
 * GET  /api/discord/setup - Get config status
 * DELETE /api/discord/setup - Clear config, deregister command
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { authenticate } from '@/lib/auth/session';
import { successResponse, errorResponse, APIError, parseBody } from '@/lib/api/utils';
import { createAdminClient } from '@/lib/supabase/admin';
import { encryptToken, decryptToken } from '@/lib/telegram/crypto';
import { registerSlashCommand, deleteSlashCommand } from '@/lib/discord/client';
import { CHATBOT_PLAN_LIMITS } from '@/lib/chatbots/types';
import type { DiscordConfig } from '@/lib/discord/types';

const setupSchema = z.object({
  chatbot_id: z.string().uuid(),
  bot_token: z.string().min(1),
  application_id: z.string().min(1),
  public_key: z.string().min(1),
  guild_id: z.string().optional(),
  ai_responses_enabled: z.boolean().optional(),
});

const statusSchema = z.object({
  chatbot_id: z.string().uuid(),
});

/**
 * POST — Save Discord config, register slash command, return webhook URL.
 */
export async function POST(req: NextRequest) {
  try {
    const user = await authenticate(req);
    if (!user) throw APIError.unauthorized('Authentication required');

    const input = await parseBody(req, setupSchema);
    const supabase = createAdminClient();

    // Verify chatbot ownership
    const { data: chatbot } = await supabase
      .from('chatbots')
      .select('id, user_id')
      .eq('id', input.chatbot_id)
      .single();

    if (!chatbot || chatbot.user_id !== user.id) {
      throw APIError.notFound('Chatbot not found');
    }

    // Plan gate: Pro+ required
    const { data: sub } = await supabase
      .from('subscriptions')
      .select('plan')
      .eq('user_id', user.id)
      .single();

    const planSlug = sub?.plan || 'free';
    const planAllowed = CHATBOT_PLAN_LIMITS[planSlug]?.discordIntegration ?? false;
    if (!planAllowed) {
      throw APIError.forbidden('Discord integration requires a Pro or Agency plan');
    }

    // Register slash command with Discord
    const registration = await registerSlashCommand(
      input.application_id,
      input.bot_token,
      input.guild_id
    );

    if (!registration.success) {
      throw new APIError(
        `Failed to register slash command with Discord: ${registration.error}`,
        502
      );
    }

    // Build config with encrypted bot token
    const config: DiscordConfig = {
      enabled: true,
      bot_token: encryptToken(input.bot_token),
      application_id: input.application_id,
      public_key: input.public_key,
      guild_id: input.guild_id,
      command_id: registration.commandId,
      ai_responses_enabled: input.ai_responses_enabled ?? true,
    };

    // Save to chatbot record
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: updateError } = await (supabase.from('chatbots') as any)
      .update({ discord_config: config })
      .eq('id', input.chatbot_id);

    if (updateError) {
      // Rollback: deregister the slash command we just created
      await deleteSlashCommand(
        input.application_id,
        input.bot_token,
        registration.commandId!,
        input.guild_id
      ).catch(() => {});
      throw new APIError('Failed to save Discord configuration', 500);
    }

    // Build webhook URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SUPABASE_URL?.replace('.supabase.co', '.vercel.app') || '';
    const webhookUrl = `${baseUrl}/api/discord/webhook/${input.chatbot_id}`;

    return successResponse({
      webhook_url: webhookUrl,
      command_id: registration.commandId,
      message: 'Discord integration configured. Set the webhook URL as your Interactions Endpoint URL in the Discord Developer Portal.',
    });
  } catch (error) {
    return errorResponse(error);
  }
}

/**
 * GET — Check Discord config status for a chatbot.
 */
export async function GET(req: NextRequest) {
  try {
    const user = await authenticate(req);
    if (!user) throw APIError.unauthorized('Authentication required');

    const chatbotId = req.nextUrl.searchParams.get('chatbot_id');
    if (!chatbotId) throw APIError.badRequest('chatbot_id is required');

    statusSchema.parse({ chatbot_id: chatbotId });

    const supabase = createAdminClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: chatbot } = await (supabase.from('chatbots') as any)
      .select('id, user_id, discord_config')
      .eq('id', chatbotId)
      .single();

    if (!chatbot || chatbot.user_id !== user.id) {
      throw APIError.notFound('Chatbot not found');
    }

    const config = chatbot.discord_config as DiscordConfig | null;
    if (!config || !config.enabled) {
      return successResponse({ configured: false });
    }

    // Build webhook URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || '';
    const webhookUrl = `${baseUrl}/api/discord/webhook/${chatbotId}`;

    return successResponse({
      configured: true,
      enabled: config.enabled,
      application_id: config.application_id,
      guild_id: config.guild_id,
      ai_responses_enabled: config.ai_responses_enabled,
      webhook_url: webhookUrl,
      // Never expose bot_token or public_key to client
    });
  } catch (error) {
    return errorResponse(error);
  }
}

/**
 * DELETE — Remove Discord config and deregister slash command.
 */
export async function DELETE(req: NextRequest) {
  try {
    const user = await authenticate(req);
    if (!user) throw APIError.unauthorized('Authentication required');

    const chatbotId = req.nextUrl.searchParams.get('chatbot_id');
    if (!chatbotId) throw APIError.badRequest('chatbot_id is required');

    const supabase = createAdminClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: chatbot } = await (supabase.from('chatbots') as any)
      .select('id, user_id, discord_config')
      .eq('id', chatbotId)
      .single();

    if (!chatbot || chatbot.user_id !== user.id) {
      throw APIError.notFound('Chatbot not found');
    }

    const config = chatbot.discord_config as DiscordConfig | null;

    // Deregister the slash command if we have the details
    if (config?.application_id && config.bot_token && config.command_id) {
      const botToken = decryptToken(config.bot_token);
      await deleteSlashCommand(
        config.application_id,
        botToken,
        config.command_id,
        config.guild_id
      );
    }

    // Clear config
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: clearError } = await (supabase.from('chatbots') as any)
      .update({ discord_config: null })
      .eq('id', chatbotId);

    if (clearError) {
      throw new APIError('Failed to remove Discord configuration', 500);
    }

    return successResponse({ message: 'Discord integration removed' });
  } catch (error) {
    return errorResponse(error);
  }
}
