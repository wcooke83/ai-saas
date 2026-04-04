/**
 * Email Thread Tracker
 * Associates reply emails to ongoing chat sessions via email threading headers.
 * Uses the email_threads table so thread state survives Vercel cold starts.
 *
 * Note: email_threads is not yet in the generated DB types (needs db:gen-types
 * after migration runs). We use `any` casts until then.
 */

import { createAdminClient } from '@/lib/supabase/admin';
import type { PostmarkInboundPayload } from './postmark-types';

function normalizeMessageId(raw: string): string {
  return raw.trim().replace(/^<|>$/g, '');
}

/**
 * Extract the root thread ID from email headers.
 * Priority: References (leftmost = oldest ancestor) → In-Reply-To → current MessageID
 */
function extractRootThreadId(payload: PostmarkInboundPayload): string {
  // Check References header — space-separated list of Message-IDs, leftmost is oldest
  const referencesHeader = payload.Headers.find(
    (h) => h.Name.toLowerCase() === 'references'
  );
  if (referencesHeader?.Value) {
    const refs = referencesHeader.Value.trim().split(/\s+/).filter(Boolean);
    if (refs.length > 0) {
      return normalizeMessageId(refs[0]);
    }
  }

  // Fall back to In-Reply-To header
  const inReplyToHeader = payload.Headers.find(
    (h) => h.Name.toLowerCase() === 'in-reply-to'
  );
  if (inReplyToHeader?.Value) {
    const inReplyTo = inReplyToHeader.Value.trim();
    if (inReplyTo) {
      return normalizeMessageId(inReplyTo);
    }
  }

  // Fall back to current MessageID — this starts a new thread
  return normalizeMessageId(payload.MessageID);
}

export async function resolveOrCreateThread(
  chatbotId: string,
  payload: PostmarkInboundPayload
): Promise<{ sessionId: string; threadId: string; isNew: boolean }> {
  const rootThreadId = extractRootThreadId(payload);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createAdminClient() as any;

  // Look up existing thread
  const { data: existing } = await supabase
    .from('email_threads')
    .select('session_id')
    .eq('chatbot_id', chatbotId)
    .eq('thread_id', rootThreadId)
    .single();

  if (existing) {
    // Update last_message_at and return existing session
    await supabase
      .from('email_threads')
      .update({ last_message_at: new Date().toISOString() })
      .eq('chatbot_id', chatbotId)
      .eq('thread_id', rootThreadId);

    return { sessionId: existing.session_id, threadId: rootThreadId, isNew: false };
  }

  // Create new thread
  const sessionId = `email_${rootThreadId}`;
  const senderEmail = payload.ReplyTo || payload.From;

  await supabase.from('email_threads').insert({
    chatbot_id: chatbotId,
    thread_id: rootThreadId,
    session_id: sessionId,
    sender_email: senderEmail,
    subject: payload.Subject || null,
    last_message_at: new Date().toISOString(),
  });

  return { sessionId, threadId: rootThreadId, isNew: true };
}
