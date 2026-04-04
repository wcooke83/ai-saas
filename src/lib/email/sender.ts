/**
 * Email Reply Sender
 * Sends reply emails via Postmark HTTP API with correct threading headers.
 */

export async function sendEmailReply(opts: {
  to: string;
  fromAddress: string;
  fromName: string;
  subject: string;
  textBody: string;
  inReplyToMessageId: string;
  referencesChain: string;
}): Promise<boolean> {
  const token = process.env.POSTMARK_SERVER_TOKEN;
  if (!token) {
    console.error('[Email:Sender] POSTMARK_SERVER_TOKEN not set');
    return false;
  }

  // Ensure "Re: " prefix
  const subject = opts.subject.startsWith('Re:') ? opts.subject : `Re: ${opts.subject}`;

  // Wrap plain text in HTML with word-wrap
  const htmlBody = `<pre style="white-space:pre-wrap;word-wrap:break-word;font-family:inherit;margin:0">${escapeHtml(opts.textBody)}</pre>`;

  // Build References: include inReplyTo plus any existing chain
  const referencesChain = buildReferences(opts.inReplyToMessageId, opts.referencesChain);

  const payload = {
    From: `${opts.fromName} <${opts.fromAddress}>`,
    To: opts.to,
    Subject: subject,
    TextBody: opts.textBody,
    HtmlBody: htmlBody,
    Headers: [
      { Name: 'In-Reply-To', Value: `<${opts.inReplyToMessageId}>` },
      { Name: 'References', Value: referencesChain },
    ],
    MessageStream: 'outbound',
  };

  try {
    const res = await fetch('https://api.postmarkapp.com/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Postmark-Server-Token': token,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error(`[Email:Sender] Postmark error ${res.status}:`, body);
      return false;
    }

    return true;
  } catch (err) {
    console.error('[Email:Sender] Network error:', err);
    return false;
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function buildReferences(inReplyToId: string, existingChain: string): string {
  const bracketedId = `<${inReplyToId}>`;
  if (!existingChain) return bracketedId;
  if (existingChain.includes(inReplyToId)) return existingChain;
  return `${existingChain} ${bracketedId}`.trim();
}
