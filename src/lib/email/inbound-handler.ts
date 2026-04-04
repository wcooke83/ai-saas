/**
 * Email Inbound Handler
 * Central orchestration for incoming emails — mirrors src/lib/whatsapp/chat.ts
 *
 * Note: email_config column is not yet in the generated DB types (needs db:gen-types
 * after migration runs). We use `any` casts until then.
 */

import { createAdminClient } from '@/lib/supabase/admin';
import { executeChat, QuotaExhaustedError } from '@/lib/chatbots/execute-chat';
import { checkEmailRateLimit } from './rate-limit';
import { resolveOrCreateThread } from './thread-tracker';
import { sendEmailReply } from './sender';
import type { PostmarkInboundPayload } from './postmark-types';

/** In-memory dedup set for Postmark MessageIDs — prevents double-processing on retry delivery */
const seenMessageIds = new Map<string, number>();
const MESSAGE_ID_TTL_MS = 5 * 60 * 1000; // 5 minutes

function isEmailDuplicate(messageId: string): boolean {
  const now = Date.now();
  // Prune expired entries
  for (const [id, ts] of seenMessageIds.entries()) {
    if (now - ts > MESSAGE_ID_TTL_MS) seenMessageIds.delete(id);
  }
  if (seenMessageIds.has(messageId)) return true;
  seenMessageIds.set(messageId, now);
  return false;
}

const INBOUND_DOMAIN = process.env.POSTMARK_INBOUND_DOMAIN || 'inbound.vocui.com';

export async function handleInboundEmail(
  chatbotId: string,
  payload: PostmarkInboundPayload
): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createAdminClient() as any;

  // 1. Fetch chatbot — must be published + email enabled + ai_responses_enabled
  const { data: chatbot } = await supabase
    .from('chatbots')
    .select('id, name, is_published, email_config')
    .eq('id', chatbotId)
    .single();

  if (!chatbot || !chatbot.is_published) return;

  const emailConfig = chatbot.email_config as Record<string, unknown> | null;
  if (!emailConfig || !emailConfig.enabled) return;
  if (emailConfig.ai_responses_enabled === false) return;

  // 2. Extract text — prefer StrippedTextReply, fallback TextBody, truncate at 8000 chars
  const rawText = (payload.StrippedTextReply?.trim() || payload.TextBody?.trim() || '').slice(0, 8000);

  // 3. Silent drop if empty text
  if (!rawText) return;

  // 3b. Dedup — Postmark retries if we don't 200 fast enough; avoid double replies
  if (payload.MessageID && isEmailDuplicate(payload.MessageID)) {
    console.log(`[Email:Inbound] Skipping duplicate message ${payload.MessageID}`);
    return;
  }

  // 4. Sender email — ReplyTo takes precedence over From
  const senderEmail = (payload.ReplyTo?.trim() || payload.From?.trim());
  if (!senderEmail) return;

  // 5. Rate limit by sender email
  const rateLimit = checkEmailRateLimit(chatbotId, senderEmail);
  if (!rateLimit.allowed) {
    console.warn(
      `[Email:Inbound] Rate limited sender ${senderEmail} for chatbot ${chatbotId} (reason: ${rateLimit.reason})`
    );
    return;
  }

  // 6. Resolve or create thread → sessionId
  const { sessionId } = await resolveOrCreateThread(chatbotId, payload);

  // 7. Execute chat
  try {
    const result = await executeChat({
      chatbotId,
      message: rawText,
      sessionId,
      channel: 'email',
      visitorId: senderEmail,
      stream: false,
    });

    // 8. Silent drop if handoff active
    if (result.handoffActive) return;

    // 9. Send reply
    const fromAddress = `${chatbotId}@${INBOUND_DOMAIN}`;
    const fromName = (emailConfig.reply_name as string | undefined) || (chatbot.name as string) || 'Support';

    // Extract References chain from inbound headers
    const referencesHeader = payload.Headers.find(
      (h) => h.Name.toLowerCase() === 'references'
    );
    const referencesChain = referencesHeader?.Value || '';

    await sendEmailReply({
      to: senderEmail,
      fromAddress,
      fromName,
      subject: payload.Subject || '(no subject)',
      textBody: result.content,
      inReplyToMessageId: payload.MessageID,
      referencesChain,
    });
  } catch (error) {
    // 10. Quota exhausted → silent drop (do NOT bounce)
    if (error instanceof QuotaExhaustedError) {
      console.warn(
        `[Email:Inbound] Chatbot "${chatbot.name || chatbotId}" hit monthly message limit`
      );
      return;
    }
    throw error;
  }
}
