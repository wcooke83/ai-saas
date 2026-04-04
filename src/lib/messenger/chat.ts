import { createAdminClient } from '@/lib/supabase/admin';
import { executeChat, QuotaExhaustedError } from '@/lib/chatbots/execute-chat';
import { sendMessengerMessage } from './client';
import { checkMessengerRateLimit } from './rate-limit';
import type { MessengerConfig, MessengerMessagingEvent } from './types';

export async function handleMessengerMessage(
  chatbotId: string,
  config: MessengerConfig,
  event: MessengerMessagingEvent
): Promise<void> {
  // Skip echo messages (page sent, not customer)
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

  const psid = event.sender.id;
  const text = event.message.text.trim();
  if (!text) return;

  const rateLimit = checkMessengerRateLimit(chatbotId, psid);
  if (!rateLimit.allowed) {
    await sendMessengerMessage(
      config,
      psid,
      `Please wait ${rateLimit.retryAfterSeconds}s before sending another message.`
    );
    return;
  }

  const sessionId = `messenger_${psid}`;
  const visitorId = psid;

  try {
    const result = await executeChat({
      chatbotId,
      message: text,
      sessionId,
      channel: 'messenger',
      visitorId,
      stream: false,
    });

    if (result.handoffActive) return;

    await sendMessengerMessage(config, psid, result.content);
  } catch (error) {
    if (error instanceof QuotaExhaustedError) {
      console.warn(
        `[Messenger:Limit] Chatbot "${chatbot.name || chatbotId}" hit monthly message limit`
      );
      await sendMessengerMessage(
        config,
        psid,
        'This chatbot has reached its monthly message limit. Please contact the chatbot owner.'
      );
      return;
    }
    throw error;
  }
}
