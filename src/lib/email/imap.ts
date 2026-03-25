/**
 * IMAP email polling for contact submission replies.
 * Connects to mail.cholds.com via IMAP (port 993, SSL/TLS)
 * and checks for visitor replies to contact submissions.
 */

import { ImapFlow } from 'imapflow';
import { createAdminClient } from '@/lib/supabase/admin';

interface ParsedReply {
  from: string;
  fromName: string;
  subject: string;
  text: string;
  messageId: string;
  inReplyTo: string | null;
  references: string[];
  date: Date;
  uid: number;
}

function getImapClient(): ImapFlow {
  return new ImapFlow({
    host: process.env.SMTP_HOST || 'mail.cholds.com',
    port: parseInt(process.env.IMAP_PORT || '993'),
    secure: true,
    auth: {
      user: process.env.SMTP_USER || 'support@vocui.com',
      pass: process.env.SMTP_PASS || '',
    },
    logger: false,
    tls: { rejectUnauthorized: false },
    connectionTimeout: 30000,
  });
}

/**
 * Extract plain text from an email message envelope/body.
 * Strips quoted reply content (lines starting with >) and signatures.
 */
function extractReplyText(text: string): string {
  const lines = text.split('\n');
  const cleaned: string[] = [];
  for (const line of lines) {
    if (line.trim() === '--' || line.startsWith('On ') && line.includes('wrote:')) break;
    if (line.startsWith('>')) continue;
    cleaned.push(line);
  }
  return cleaned.join('\n').trim();
}

/**
 * Extract submission ID from email subject or references.
 * Looks for [CS-XXXXXXXX] pattern in subject or cs-{uuid} in message IDs.
 */
function extractSubmissionId(parsed: ParsedReply): string | null {
  const subjectMatch = parsed.subject.match(/\[CS-([A-F0-9]{8})\]/i);
  if (subjectMatch) {
    return subjectMatch[1].toLowerCase();
  }

  const allIds = [parsed.inReplyTo, ...parsed.references].filter(Boolean) as string[];
  for (const id of allIds) {
    const match = id.match(/cs-([0-9a-f-]{36})/i);
    if (match) return match[1];
  }

  return null;
}

/**
 * Extract text body from raw email source.
 */
function extractTextFromSource(source: string): string {
  const plainMatch = source.match(/Content-Type: text\/plain[^\r\n]*\r?\n(?:Content-Transfer-Encoding:[^\r\n]*\r?\n)?(?:\r?\n)([\s\S]*?)(?=\r?\n--|\r?\n\.\r?\n|$)/i);
  if (plainMatch) return plainMatch[1].trim();

  const htmlMatch = source.match(/Content-Type: text\/html[^\r\n]*\r?\n(?:Content-Transfer-Encoding:[^\r\n]*\r?\n)?(?:\r?\n)([\s\S]*?)(?=\r?\n--|\r?\n\.\r?\n|$)/i);
  if (htmlMatch) return htmlMatch[1].replace(/<[^>]+>/g, '').trim();

  return '';
}

/**
 * Poll IMAP inbox for unread emails that are replies to contact submissions.
 * Matches them to submissions, creates contact_reply records, and marks as read.
 * Returns the number of new replies processed.
 */
export async function pollContactReplies(): Promise<{ processed: number; errors: string[] }> {
  const client = getImapClient();
  const supabase = createAdminClient();
  let processed = 0;
  const errors: string[] = [];

  try {
    await client.connect();
    const lock = await client.getMailboxLock('INBOX');

    try {
      // Search for unseen messages first, then fetch individually
      const unseenUids = await client.search({ seen: false });
      if (!unseenUids || unseenUids.length === 0) {
        lock.release();
        await client.logout();
        return { processed: 0, errors: [] };
      }

      // Process each unseen message by UID using fetchOne (avoids async iterator hang)
      for (const uid of unseenUids) {
        try {
          const msg = await client.fetchOne(uid, { envelope: true, source: true }, { uid: true });
          if (!msg) continue;

          const envelope = msg.envelope;
          if (!envelope) continue;
          const from = envelope.from?.[0]?.address || '';

          // Skip emails from our own system
          if (from.toLowerCase() === 'support@vocui.com') {
            await client.messageFlagsAdd(uid, ['\\Seen'], { uid: true });
            continue;
          }

          const subject = envelope.subject || '';
          const subjectMatch = subject.match(/\[CS-([A-F0-9]{8})\]/i);
          const inReplyTo = envelope.inReplyTo || null;

          if (!subjectMatch && !inReplyTo) {
            continue;
          }

          const textBody = extractTextFromSource(msg.source?.toString('utf-8') || '');

          const parsed: ParsedReply = {
            from,
            fromName: envelope.from?.[0]?.name || from || 'Unknown',
            subject,
            text: textBody,
            messageId: envelope.messageId || '',
            inReplyTo,
            references: [],
            date: envelope.date || new Date(),
            uid,
          };

          // Try to match to a submission
          const shortId = extractSubmissionId(parsed);
          let submissionId: string | null = null;

          if (shortId) {
            if (shortId.length === 8) {
              // UUID prefix match — fetch recent submissions and match in JS
              // (Supabase PostgREST doesn't support LIKE on UUID columns)
              const { data: submissions } = await supabase
                .from('contact_submissions')
                .select('id')
                .order('created_at', { ascending: false })
                .limit(200);
              const match = submissions?.find((s: any) =>
                (s.id as string).toLowerCase().startsWith(shortId.toLowerCase())
              );
              if (match) submissionId = match.id;
            } else {
              submissionId = shortId;
            }
          }

          if (!submissionId && parsed.inReplyTo) {
            const { data: reply } = await supabase
              .from('contact_replies')
              .select('submission_id')
              .eq('email_message_id', parsed.inReplyTo)
              .limit(1)
              .single();
            if (reply) submissionId = reply.submission_id;
          }

          if (!submissionId) continue;

          // Check for duplicate
          if (parsed.messageId) {
            const { data: existing } = await supabase
              .from('contact_replies')
              .select('id')
              .eq('email_message_id', parsed.messageId)
              .limit(1);
            if (existing && existing.length > 0) {
              await client.messageFlagsAdd(uid, ['\\Seen'], { uid: true });
              continue;
            }
          }

          const replyText = extractReplyText(parsed.text) || parsed.text;

          const { error } = await supabase.from('contact_replies').insert({
            submission_id: submissionId,
            sender_type: 'visitor',
            sender_name: parsed.fromName,
            sender_email: parsed.from,
            message: replyText.slice(0, 10000),
            email_message_id: parsed.messageId || null,
          });

          if (error) {
            errors.push(`Insert error for ${parsed.messageId}: ${error.message}`);
            continue;
          }

          // Update submission status back to 'read'
          await supabase
            .from('contact_submissions')
            .update({ status: 'read' })
            .eq('id', submissionId);

          await client.messageFlagsAdd(uid, ['\\Seen'], { uid: true });
          processed++;
        } catch (msgErr) {
          errors.push(`Message processing error: ${(msgErr as Error).message}`);
        }
      }
    } finally {
      lock.release();
    }

    await client.logout();
  } catch (err) {
    errors.push(`IMAP connection error: ${(err as Error).message}`);
  }

  return { processed, errors };
}
