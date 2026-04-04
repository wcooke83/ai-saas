import { createAdminClient } from '@/lib/supabase/admin';
import { executeChat, QuotaExhaustedError } from '@/lib/chatbots/execute-chat';
import { sendInstagramMessage } from './client';
import { checkInstagramRateLimit } from './rate-limit';
import type { InstagramConfig, InstagramMessagingEvent } from './types';

export async function handleInstagramMessage(
  chatbotId: string,
  config: InstagramConfig,
  event: InstagramMessagingEvent
): Promise<void> {
  // Skip echo messages
  if (event.message?.is_echo) return;
  // Only handle text messages
  if (!event.message?.text) return;

  const supabase = createAdminClient();
  const { data: chatbot } = await supabase
    .from('chatbots')
    .select('id, name, is_published')
    .eq('id', chatbotId)
    .single();

  if (!chatbot || !chatbot.is_published) return;

  const igUserId = event.sender.id;
  const text = event.message.text.trim();
  if (!text) return;

  const rateLimit = checkInstagramRateLimit(chatbotId, igUserId);
  if (!rateLimit.allowed) {
    await sendInstagramMessage(
      config,
      igUserId,
      `Please wait ${rateLimit.retryAfterSeconds}s before sending another message.`
    );
    return;
  }

  const sessionId = `instagram_${igUserId}`;
  const visitorId = igUserId;

  try {
    const result = await executeChat({
      chatbotId,
      message: text,
      sessionId,
      channel: 'instagram',
      visitorId,
      stream: false,
    });

    if (result.handoffActive) return;

    await sendInstagramMessage(config, igUserId, result.content);
  } catch (error) {
    if (error instanceof QuotaExhaustedError) {
      console.warn(
        `[Instagram:Limit] Chatbot "${chatbot.name || chatbotId}" hit monthly message limit`
      );
      await sendInstagramMessage(
        config,
        igUserId,
        'This chatbot has reached its monthly message limit. Please contact the chatbot owner.'
      );
      return;
    }
    throw error;
  }
}
