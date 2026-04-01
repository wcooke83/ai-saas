/**
 * Teams AI Chat Handler
 * Processes incoming Teams messages through the shared executeChat() pipeline,
 * mirroring the pattern used by the Telegram integration.
 */

import { createAdminClient } from '@/lib/supabase/admin';
import { executeChat, QuotaExhaustedError } from '@/lib/chatbots/execute-chat';
import { sendTeamsMessage, sendTeamsTypingIndicator, validateServiceUrl } from './client';
import { checkTeamsRateLimit } from './rate-limit';
import type { TeamsActivity, TeamsConfig } from './types';

/**
 * Handle an incoming Teams message with AI-powered responses.
 *
 * Called when ai_responses_enabled is true and the activity is a text message.
 */
export async function handleTeamsMessage(
  chatbotId: string,
  config: TeamsConfig,
  activity: TeamsActivity
): Promise<void> {
  const supabase = createAdminClient();
  const { data: chatbot } = await supabase
    .from('chatbots')
    .select('id, name, is_published')
    .eq('id', chatbotId)
    .single();

  if (!chatbot || !chatbot.is_published) return;

  if (!activity.text || !activity.from) return;

  // Validate serviceUrl before making any outbound requests (SSRF prevention)
  validateServiceUrl(activity.serviceUrl);

  // Rate limit per user
  const rateLimit = checkTeamsRateLimit(chatbotId, activity.from.id);
  if (!rateLimit.allowed) {
    await sendTeamsMessage(
      config,
      activity.serviceUrl,
      activity.conversation.id,
      activity.id,
      `Please wait ${rateLimit.retryAfterSeconds}s before sending another message.`
    );
    return;
  }

  let text = activity.text.trim();
  if (!text) return;

  // In group chats / channels, only respond when @mentioned
  const conversationType = activity.conversation.conversationType;
  const isGroup =
    activity.conversation.isGroup ||
    conversationType === 'groupChat' ||
    conversationType === 'channel';

  if (isGroup) {
    // Teams includes mention entities — check if the bot is mentioned
    const botMention = activity.entities?.find(
      (e) =>
        e.type === 'mention' &&
        e.mentioned?.id === activity.recipient.id
    );

    if (!botMention) return;

    // Strip the @mention text from the message
    if (botMention.text) {
      text = text.replace(botMention.text, '').trim();
    }
    if (!text) return;
  }

  // Each Teams conversation gets one session
  const sessionId = `teams_${activity.conversation.id}`;
  const visitorId = activity.from.id;

  // Show typing indicator (best-effort, don't await)
  sendTeamsTypingIndicator(config, activity.serviceUrl, activity.conversation.id).catch(() => {});

  try {
    const result = await executeChat({
      chatbotId,
      message: text,
      sessionId,
      channel: 'teams',
      visitorId,
      stream: false,
    });

    // When a handoff is active, executeChat returns empty content after forwarding
    // the message to the support agent — don't send an empty reply to the user.
    if (result.handoffActive) return;

    // Send response via Teams
    await sendTeamsMessage(
      config,
      activity.serviceUrl,
      activity.conversation.id,
      activity.id,
      result.content
    );
  } catch (error) {
    if (error instanceof QuotaExhaustedError) {
      console.warn(
        `[Teams:Limit] Chatbot "${chatbot.name || chatbotId}" hit monthly message limit`
      );
      await sendTeamsMessage(
        config,
        activity.serviceUrl,
        activity.conversation.id,
        activity.id,
        'This chatbot has reached its monthly message limit. Please contact the chatbot owner.'
      );
      return;
    }
    // Re-throw unexpected errors so the caller can log them
    throw error;
  }
}
