/**
 * SMS AI Chat Handler
 * Processes incoming SMS messages through the shared executeChat() pipeline.
 */

import { createAdminClient } from '@/lib/supabase/admin';
import { executeChat, QuotaExhaustedError } from '@/lib/chatbots/execute-chat';
import { checkSmsRateLimit } from './rate-limit';
import type { SmsConfig } from './types';

/**
 * Handle an incoming SMS message with AI-powered responses.
 *
 * Returns the reply string, or null if no reply should be sent
 * (e.g. handoff active, rate-limited with no message, etc.).
 */
export async function handleSmsMessage(
  chatbotId: string,
  config: SmsConfig,
  from: string,
  body: string
): Promise<string | null> {
  const supabase = createAdminClient();
  const { data: chatbot } = await supabase
    .from('chatbots')
    .select('id, name, is_published')
    .eq('id', chatbotId)
    .single();

  if (!chatbot || !chatbot.is_published) return null;

  const text = body.trim();
  if (!text) return null;

  // Rate limit per phone number
  const rateLimit = checkSmsRateLimit(chatbotId, from);
  if (!rateLimit.allowed) {
    return `Please wait ${rateLimit.retryAfterSeconds}s before sending another message.`;
  }

  // Each SMS phone number gets its own persistent session
  const sessionId = `sms_${from}`;
  const visitorId = from;

  try {
    const result = await executeChat({
      chatbotId,
      message: text,
      sessionId,
      channel: 'sms',
      visitorId,
      stream: false,
    });

    // When a handoff is active, executeChat returns empty content after
    // forwarding the message to the support channel — don't reply to the user.
    if (result.handoffActive) return null;

    // Truncate to configured max length (default 320 = 2 SMS segments)
    const maxLen = config.max_response_length ?? 320;
    const reply = result.content.length > maxLen
      ? result.content.slice(0, maxLen - 3) + '...'
      : result.content;

    return reply;
  } catch (error) {
    if (error instanceof QuotaExhaustedError) {
      console.warn(
        `[SMS:Limit] Chatbot "${chatbot.name || chatbotId}" hit monthly message limit`
      );
      return 'This chatbot has reached its monthly message limit. Please contact the chatbot owner.';
    }
    throw error;
  }
}
