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
    // Stop at signature or quoted content markers
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
  // Try subject: [CS-XXXXXXXX]
  const subjectMatch = parsed.subject.match(/\[CS-([A-F0-9]{8})\]/i);
  if (subjectMatch) {
    return subjectMatch[1].toLowerCase();
  }

  // Try references/inReplyTo: <cs-{uuid}-timestamp@vocui.com>
  const allIds = [parsed.inReplyTo, ...parsed.references].filter(Boolean) as string[];
  for (const id of allIds) {
    const match = id.match(/cs-([0-9a-f-]{36})/i);
    if (match) return match[1];
  }

  return null;
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
      // Search for unseen messages
      const messages = client.fetch(
        { seen: false },
        {
          envelope: true,
          source: true,
          uid: true,
        }
      );

      for await (const msg of messages) {
        try {
          const envelope = msg.envelope;
          if (!envelope) continue;

          // Extract text from source
          const source = msg.source?.toString('utf-8') || '';
          // Simple text extraction from email source
          let textBody = '';

          // Try to get text/plain content
          const plainMatch = source.match(/Content-Type: text\/plain[^\r\n]*\r?\n(?:Content-Transfer-Encoding:[^\r\n]*\r?\n)?(?:\r?\n)([\s\S]*?)(?=\r?\n--|\r?\n\.\r?\n|$)/i);
          if (plainMatch) {
            textBody = plainMatch[1].trim();
          } else {
            // Fallback: strip HTML tags from html content
            const htmlMatch = source.match(/Content-Type: text\/html[^\r\n]*\r?\n(?:Content-Transfer-Encoding:[^\r\n]*\r?\n)?(?:\r?\n)([\s\S]*?)(?=\r?\n--|\r?\n\.\r?\n|$)/i);
            if (htmlMatch) {
              textBody = htmlMatch[1].replace(/<[^>]+>/g, '').trim();
            }
          }

          const parsed: ParsedReply = {
            from: envelope.from?.[0]?.address || '',
            fromName: envelope.from?.[0]?.name || envelope.from?.[0]?.address || 'Unknown',
            subject: envelope.subject || '',
            text: textBody,
            messageId: envelope.messageId || '',
            inReplyTo: envelope.inReplyTo || null,
            references: [], // imapflow puts these in envelope
            date: envelope.date || new Date(),
          };

          // Skip emails from our own system
          if (parsed.from.toLowerCase() === 'support@vocui.com') continue;

          // Try to match to a submission
          const shortId = extractSubmissionId(parsed);
          if (!shortId) continue;

          // Find the submission - try short ID match first
          let submissionId: string | null = null;

          if (shortId.length === 8) {
            // Short ID from subject - query submissions where id starts with this
            const { data: submissions } = await supabase
              .from('contact_submissions')
              .select('id')
              .ilike('id', `${shortId}%`)
              .limit(1);
            if (submissions?.[0]) submissionId = submissions[0].id;
          } else {
            // Full UUID from references
            submissionId = shortId;
          }

          if (!submissionId) {
            // Also try matching via the email_message_id in contact_replies
            if (parsed.inReplyTo) {
              const { data: reply } = await supabase
                .from('contact_replies')
                .select('submission_id')
                .eq('email_message_id', parsed.inReplyTo)
                .limit(1)
                .single();
              if (reply) submissionId = reply.submission_id;
            }
          }

          if (!submissionId) continue;

          // Check for duplicate (same messageId already stored)
          if (parsed.messageId) {
            const { data: existing } = await supabase
              .from('contact_replies')
              .select('id')
              .eq('email_message_id', parsed.messageId)
              .limit(1);
            if (existing && existing.length > 0) {
              // Already processed, just mark as seen
              await client.messageFlagsAdd(msg.uid, ['\\Seen'], { uid: true });
              continue;
            }
          }

          const replyText = extractReplyText(parsed.text) || parsed.text;

          // Insert the reply
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

          // Update submission status back to 'read' so admin knows there's a new reply
          await supabase
            .from('contact_submissions')
            .update({ status: 'read' })
            .eq('id', submissionId);

          // Mark email as seen
          await client.messageFlagsAdd(msg.uid, ['\\Seen'], { uid: true });
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
