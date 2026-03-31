/**
 * WhatsApp AI Chat Handler
 * Processes incoming WhatsApp messages through the shared executeChat() pipeline,
 * mirroring the pattern used by the Telegram integration.
 */

import { createAdminClient } from '@/lib/supabase/admin';
import { executeChat, QuotaExhaustedError } from '@/lib/chatbots/execute-chat';
import { sendWhatsAppMessage } from './client';
import { checkWhatsAppRateLimit } from './rate-limit';
import type { WhatsAppConfig, WhatsAppMessage, WhatsAppContact } from './types';

/**
 * Handle an incoming WhatsApp message with AI-powered responses.
 *
 * Called when ai_responses_enabled is true and the message contains text.
 */
export async function handleWhatsAppMessage(
  chatbotId: string,
  config: WhatsAppConfig,
  message: WhatsAppMessage,
  contact: WhatsAppContact | undefined
): Promise<void> {
  const supabase = createAdminClient();
  const { data: chatbot } = await supabase
    .from('chatbots')
    .select('id, name, is_published')
    .eq('id', chatbotId)
    .single();

  if (!chatbot || !chatbot.is_published) return;

  // Only handle text messages
  if (message.type !== 'text' || !message.text?.body) return;

  const phone = message.from;

  // Rate limit per phone number
  const rateLimit = checkWhatsAppRateLimit(chatbotId, phone);
  if (!rateLimit.allowed) {
    await sendWhatsAppMessage(
      config,
      phone,
      `Please wait ${rateLimit.retryAfterSeconds}s before sending another message.`
    );
    return;
  }

  const text = message.text.body.trim();
  if (!text) return;

  // Each WhatsApp phone number gets its own session
  const sessionId = `whatsapp_${phone}`;
  const visitorId = phone;

  // Pass contact name as userData for visitor identification
  const userData: Record<string, string> = {};
  if (contact?.profile?.name) {
    userData.name = contact.profile.name;
  }

  try {
    const result = await executeChat({
      chatbotId,
      message: text,
      sessionId,
      channel: 'whatsapp',
      visitorId,
      userData: Object.keys(userData).length > 0 ? userData : undefined,
      stream: false,
    });

    // When a handoff is active, executeChat returns empty content after forwarding
    // the message to the support channel — don't send an empty reply to the user.
    if (result.handoffActive) return;

    // Send response via WhatsApp (auto-splits long messages)
    await sendWhatsAppMessage(config, phone, result.content);
  } catch (error) {
    if (error instanceof QuotaExhaustedError) {
      console.warn(
        `[WhatsApp:Limit] Chatbot "${chatbot.name || chatbotId}" hit monthly message limit`
      );
      await sendWhatsAppMessage(
        config,
        phone,
        'This chatbot has reached its monthly message limit. Please contact the chatbot owner.'
      );
      return;
    }
    // Re-throw unexpected errors so the caller can log them
    throw error;
  }
}
