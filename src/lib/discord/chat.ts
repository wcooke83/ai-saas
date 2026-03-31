/**
 * Discord AI Chat Handler
 * Processes incoming Discord interactions through the shared executeChat() pipeline,
 * mirroring the pattern used by the Telegram integration.
 */

import { createAdminClient } from '@/lib/supabase/admin';
import { executeChat, QuotaExhaustedError } from '@/lib/chatbots/execute-chat';
import { sendFollowup } from './client';
import { checkDiscordRateLimit } from './rate-limit';
import type { DiscordConfig, DiscordInteraction } from './types';
import { InteractionType } from './types';

/**
 * Handle an incoming Discord interaction (slash command).
 *
 * Called after the webhook route has already sent a DEFERRED response
 * to Discord (within the 3-second deadline). This function processes
 * the AI response and sends it as a follow-up message.
 */
export async function handleDiscordInteraction(
  chatbotId: string,
  config: DiscordConfig,
  interaction: DiscordInteraction
): Promise<void> {
  // Only handle application commands
  if (interaction.type !== InteractionType.APPLICATION_COMMAND) return;

  // Only handle the /ask command
  if (!interaction.data || interaction.data.name !== 'ask') return;

  const supabase = createAdminClient();
  const { data: chatbot } = await supabase
    .from('chatbots')
    .select('id, name, is_published')
    .eq('id', chatbotId)
    .single();

  if (!chatbot || !chatbot.is_published) {
    await sendFollowup(
      interaction.application_id,
      interaction.token,
      'This chatbot is not currently available.'
    );
    return;
  }

  // Extract question from slash command options
  const question = interaction.data.options?.find((o) => o.name === 'question')?.value;
  if (!question?.trim()) {
    await sendFollowup(
      interaction.application_id,
      interaction.token,
      'Please provide a question. Usage: `/ask What is your refund policy?`'
    );
    return;
  }

  // Resolve user — in guilds it's under member.user, in DMs it's top-level user
  const user = interaction.member?.user ?? interaction.user;
  if (!user) {
    await sendFollowup(
      interaction.application_id,
      interaction.token,
      'Could not identify the user.'
    );
    return;
  }

  // Rate limit per user
  const rateLimit = checkDiscordRateLimit(chatbotId, user.id);
  if (!rateLimit.allowed) {
    await sendFollowup(
      interaction.application_id,
      interaction.token,
      `Please wait ${rateLimit.retryAfterSeconds}s before sending another command.`
    );
    return;
  }

  // Each Discord user gets their own session per channel
  const channelId = interaction.channel_id || 'dm';
  const sessionId = `discord_${channelId}_${user.id}`;
  const visitorId = user.id;

  try {
    const result = await executeChat({
      chatbotId,
      message: question.trim(),
      sessionId,
      channel: 'discord',
      visitorId,
      stream: false,
    });

    // When a handoff is active, executeChat returns empty content
    if (result.handoffActive) {
      await sendFollowup(
        interaction.application_id,
        interaction.token,
        'Your message has been forwarded to a human agent. Please wait for a response.'
      );
      return;
    }

    // Send AI response as follow-up (auto-splits if > 2000 chars)
    await sendFollowup(
      interaction.application_id,
      interaction.token,
      result.content
    );
  } catch (error) {
    if (error instanceof QuotaExhaustedError) {
      console.warn(
        `[Discord:Limit] Chatbot "${chatbot.name || chatbotId}" hit monthly message limit`
      );
      await sendFollowup(
        interaction.application_id,
        interaction.token,
        'This chatbot has reached its monthly message limit. Please contact the chatbot owner.'
      );
      return;
    }
    // Re-throw unexpected errors so the caller can log them
    throw error;
  }
}
