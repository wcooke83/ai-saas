import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = 'VocUI <noreply@vocui.com>';

export async function sendWelcomeEmail(to: string, name?: string) {
  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: 'Welcome to VocUI!',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #6366f1;">Welcome${name ? `, ${name}` : ''}!</h1>
        <p>Thanks for signing up for VocUI. You now have access to:</p>
        <ul>
          <li>Custom AI Chatbot Builder</li>
          <li>RAG-powered knowledge bases</li>
          <li>API access for integrations</li>
        </ul>
        <p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard"
             style="background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Go to Dashboard
          </a>
        </p>
        <p style="color: #666; font-size: 14px; margin-top: 32px;">
          Questions? Reply to this email - we're here to help.
        </p>
      </div>
    `,
  });

  if (error) {
    console.error('Failed to send welcome email:', error);
    throw error;
  }

  return data;
}

export async function sendPasswordResetEmail(to: string, resetLink: string) {
  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: 'Reset your password - VocUI',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Password Reset Request</h2>
        <p>Click the button below to reset your password:</p>
        <p>
          <a href="${resetLink}"
             style="background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Reset Password
          </a>
        </p>
        <p style="color: #666; font-size: 14px;">
          This link expires in 1 hour. If you didn't request this, ignore this email.
        </p>
      </div>
    `,
  });

  if (error) {
    console.error('Failed to send password reset email:', error);
    throw error;
  }

  return data;
}

export async function sendMemoryVerificationEmail(to: string, code: string, chatbotName: string) {
  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `Your verification code: ${code}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6366f1;">Verify Your Identity</h2>
        <p>You requested to load your previous conversation history with <strong>${chatbotName}</strong>.</p>
        <p>Your verification code is:</p>
        <div style="background: #f3f4f6; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1f2937;">${code}</span>
        </div>
        <p style="color: #666; font-size: 14px;">
          This code expires in 10 minutes. If you didn't request this, you can safely ignore this email.
        </p>
      </div>
    `,
  });

  if (error) {
    console.error('Failed to send verification email:', error);
    throw error;
  }

  return data;
}

export interface TranscriptMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at: string;
}

export async function sendTranscriptEmail(
  to: string,
  chatbotName: string,
  logoUrl: string | null,
  primaryColor: string,
  messages: TranscriptMessage[]
) {
  const messageRows = messages
    .filter((m) => m.role !== 'system')
    .map((m) => {
      const isUser = m.role === 'user';
      const label = isUser ? 'You' : chatbotName;
      const time = new Date(m.created_at).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
      const bgColor = isUser ? primaryColor : '#f1f5f9';
      const textColor = isUser ? '#ffffff' : '#0f172a';
      // Escape HTML in content
      const safeContent = m.content
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\n/g, '<br/>');
      return `
        <tr>
          <td style="padding: 6px 0;">
            <div style="font-size: 11px; color: #9ca3af; margin-bottom: 2px; ${isUser ? 'text-align: right;' : ''}">${label} · ${time}</div>
            <div style="background: ${bgColor}; color: ${textColor}; padding: 10px 14px; border-radius: 12px; ${isUser ? 'border-bottom-right-radius: 4px; margin-left: 40px;' : 'border-bottom-left-radius: 4px; margin-right: 40px;'} font-size: 14px; line-height: 1.5;">
              ${safeContent}
            </div>
          </td>
        </tr>`;
    })
    .join('');

  const logoHtml = logoUrl
    ? `<img src="${logoUrl}" alt="${chatbotName}" style="width: 36px; height: 36px; border-radius: 6px; margin-right: 10px; vertical-align: middle;" />`
    : '';

  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `Chat transcript with ${chatbotName}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
        <div style="background: ${primaryColor}; padding: 20px 24px; border-radius: 8px 8px 0 0;">
          <div style="display: flex; align-items: center;">
            ${logoHtml}
            <span style="color: #ffffff; font-size: 18px; font-weight: 600;">${chatbotName}</span>
          </div>
          <div style="color: rgba(255,255,255,0.85); font-size: 13px; margin-top: 4px;">Conversation transcript · ${dateStr}</div>
        </div>
        <div style="padding: 16px 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
            ${messageRows}
          </table>
        </div>
        <div style="padding: 16px 24px; text-align: center;">
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">
            This transcript was sent at your request from ${chatbotName}.
          </p>
        </div>
      </div>
    `,
  });

  if (error) {
    console.error('Failed to send transcript email:', error);
    throw error;
  }

  return data;
}

// ============================================
// TICKET & CONTACT FORM EMAILS
// ============================================

export async function sendTicketConfirmation(
  to: string,
  { name, ticketId, subject, autoReplyText }: { name: string; ticketId: string; subject?: string; autoReplyText?: string }
) {
  const body = autoReplyText
    ? autoReplyText
        .replace(/\{\{name\}\}/g, name)
        .replace(/\{\{ticketId\}\}/g, ticketId)
        .replace(/\{\{subject\}\}/g, subject || 'No subject')
    : `Hi ${name},\n\nWe've received your ticket (${ticketId}). Our team will get back to you soon.`;

  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `Ticket received: ${ticketId}${subject ? ` - ${subject}` : ''}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6366f1;">Ticket Confirmation</h2>
        <p><strong>Reference:</strong> ${ticketId}</p>
        ${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ''}
        <div style="background: #f3f4f6; border-radius: 8px; padding: 16px; margin: 16px 0; white-space: pre-line;">${body}</div>
        <p style="color: #666; font-size: 14px;">You will receive a response to this email address.</p>
      </div>
    `,
  });

  if (error) {
    console.error('Failed to send ticket confirmation:', error);
    throw error;
  }
  return data;
}

export async function sendTicketAdminNotification(
  to: string,
  { ticketId, visitorName, visitorEmail, subject, message, priority, chatbotName }: {
    ticketId: string; visitorName: string; visitorEmail: string; subject?: string;
    message: string; priority: string; chatbotName: string;
  }
) {
  const priorityColors: Record<string, string> = {
    low: '#22c55e', medium: '#eab308', high: '#f97316', urgent: '#ef4444',
  };

  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `[${priority.toUpperCase()}] New ticket ${ticketId} - ${chatbotName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>New Ticket: ${ticketId}</h2>
        <p><strong>Chatbot:</strong> ${chatbotName}</p>
        <p><strong>From:</strong> ${visitorName} (${visitorEmail})</p>
        ${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ''}
        <p><strong>Priority:</strong> <span style="color: ${priorityColors[priority] || '#666'}; font-weight: bold;">${priority.toUpperCase()}</span></p>
        <div style="background: #f3f4f6; border-radius: 8px; padding: 16px; margin: 16px 0; white-space: pre-line;">${message}</div>
        <p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/chatbots" style="background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            View Tickets
          </a>
        </p>
      </div>
    `,
  });

  if (error) {
    console.error('Failed to send ticket admin notification:', error);
    throw error;
  }
  return data;
}

export async function sendContactConfirmation(
  to: string,
  { name, message }: { name: string; message: string }
) {
  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: 'We received your message',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6366f1;">Message Received</h2>
        <p>Hi ${name},</p>
        <p>Thank you for reaching out. We've received your message and will get back to you shortly.</p>
        <div style="background: #f3f4f6; border-radius: 8px; padding: 16px; margin: 16px 0; white-space: pre-line;">${message}</div>
      </div>
    `,
  });

  if (error) {
    console.error('Failed to send contact confirmation:', error);
    throw error;
  }
  return data;
}

export async function sendContactAdminNotification(
  to: string,
  { visitorName, visitorEmail, message, chatbotName }: {
    visitorName: string; visitorEmail: string; message: string; chatbotName: string;
  }
) {
  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `New contact form submission - ${chatbotName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>New Contact Submission</h2>
        <p><strong>Chatbot:</strong> ${chatbotName}</p>
        <p><strong>From:</strong> ${visitorName} (${visitorEmail})</p>
        <div style="background: #f3f4f6; border-radius: 8px; padding: 16px; margin: 16px 0; white-space: pre-line;">${message}</div>
        <p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/chatbots" style="background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            View Submissions
          </a>
        </p>
      </div>
    `,
  });

  if (error) {
    console.error('Failed to send contact admin notification:', error);
    throw error;
  }
  return data;
}

export async function sendCreditPurchaseConfirmation(
  to: string,
  { name, creditAmount, amountPaid }: { name: string; creditAmount: number; amountPaid: string }
) {
  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: 'Credit Purchase Confirmation',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6366f1;">Purchase Confirmed</h2>
        <p>Hi ${name},</p>
        <p>Your credit purchase has been processed successfully.</p>
        <div style="background: #f3f4f6; border-radius: 8px; padding: 16px; margin: 16px 0;">
          <p><strong>Credits added:</strong> ${creditAmount}</p>
          <p><strong>Amount paid:</strong> ${amountPaid}</p>
        </div>
        <p>Your credits are now available. You can continue using the chatbot.</p>
      </div>
    `,
  });

  if (error) {
    console.error('Failed to send credit purchase confirmation:', error);
    throw error;
  }
  return data;
}

export async function sendCreditAlert75Email(to: string, firstName: string) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: "You've used 75% of your VocUI credits this month",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6366f1;">Heads up on your credits</h2>
        <p>Hi ${firstName},</p>
        <p>You've used 75% of your monthly credits on VocUI. Your chatbots are still running fine — this is just a heads-up.</p>
        <p>If you run out, your chatbots will stop responding until credits are renewed or topped up.</p>
        <p><strong>Two ways to stay covered:</strong></p>
        <ul>
          <li>Enable auto-topup so credits refill automatically when you run low</li>
          <li>Buy a one-time credit pack now</li>
        </ul>
        <p>
          <a href="${appUrl}/dashboard/billing"
             style="background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Add Credits
          </a>
        </p>
        <p style="color: #666; font-size: 14px; margin-top: 32px;">The VocUI Team</p>
      </div>
    `,
  });

  if (error) {
    console.error('Failed to send credit alert 75% email:', error);
    throw error;
  }

  return data;
}

export async function sendCreditAlert90Email(to: string, firstName: string) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: 'Action needed: your VocUI credits are almost gone',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6366f1;">Your credits are almost gone</h2>
        <p>Hi ${firstName},</p>
        <p>You have less than 10% of your monthly credits left. When credits hit zero, your chatbots go offline and stop responding to users.</p>
        <p>To keep them running without interruption, enable auto-topup or add credits now.</p>
        <p>
          <a href="${appUrl}/dashboard/billing"
             style="background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Add Credits
          </a>
        </p>
        <p style="color: #666; font-size: 14px; margin-top: 32px;">The VocUI Team</p>
      </div>
    `,
  });

  if (error) {
    console.error('Failed to send credit alert 90% email:', error);
    throw error;
  }

  return data;
}

export async function sendFirstConversationEmail(to: string, chatbotName: string) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `"${chatbotName}" just answered its first question`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6366f1;">Your chatbot is live and working</h2>
        <p>${chatbotName} just answered its first question from a real visitor.</p>
        <p>Check the conversation in your dashboard to see how it went.</p>
        <p>
          <a href="${appUrl}/dashboard/chatbots"
             style="background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            View Conversations
          </a>
        </p>
        <p style="color: #666; font-size: 14px; margin-top: 32px;">The VocUI Team</p>
      </div>
    `,
  });

  if (error) {
    console.error('Failed to send first conversation email:', error);
    throw error;
  }

  return data;
}

export async function sendNewTicketNotification(
  to: string,
  { ticketId, visitorName, subject, chatbotName, dashboardUrl }: {
    ticketId: string; visitorName: string; subject?: string; chatbotName: string; dashboardUrl: string;
  }
) {
  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `New ticket from ${visitorName} — ${chatbotName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6366f1; margin-bottom: 4px;">New support ticket</h2>
        <p style="color: #666; margin-top: 0;">A visitor submitted a ticket through <strong>${chatbotName}</strong>.</p>
        <div style="background: #f3f4f6; border-radius: 8px; padding: 16px; margin: 16px 0;">
          <p style="margin: 0 0 8px;"><strong>From:</strong> ${visitorName}</p>
          <p style="margin: 0 0 8px;"><strong>Reference:</strong> ${ticketId}</p>
          ${subject ? `<p style="margin: 0;"><strong>Subject:</strong> ${subject}</p>` : ''}
        </div>
        <p>
          <a href="${dashboardUrl}" style="background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            View Ticket
          </a>
        </p>
      </div>
    `,
  });

  if (error) {
    console.error('Failed to send new ticket notification:', error);
    throw error;
  }
  return data;
}

export async function sendNewEscalationNotification(
  to: string,
  { visitorName, reason, chatbotName, dashboardUrl }: {
    visitorName?: string; reason: string; chatbotName: string; dashboardUrl: string;
  }
) {
  const fromLabel = visitorName || 'A visitor';
  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `Escalation flagged in ${chatbotName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #f97316; margin-bottom: 4px;">Escalation flagged</h2>
        <p style="color: #666; margin-top: 0;">${fromLabel} escalated a conversation in <strong>${chatbotName}</strong>.</p>
        <div style="background: #f3f4f6; border-radius: 8px; padding: 16px; margin: 16px 0;">
          <p style="margin: 0 0 8px;"><strong>Visitor:</strong> ${fromLabel}</p>
          <p style="margin: 0;"><strong>Reason:</strong> ${reason}</p>
        </div>
        <p>
          <a href="${dashboardUrl}" style="background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            View Issues
          </a>
        </p>
      </div>
    `,
  });

  if (error) {
    console.error('Failed to send new escalation notification:', error);
    throw error;
  }
  return data;
}

export async function sendApiKeyCreatedEmail(to: string, keyName: string, keyPrefix: string) {
  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: 'New API Key Created - VocUI',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>New API Key Created</h2>
        <p>A new API key has been created on your account:</p>
        <p><strong>Name:</strong> ${keyName}</p>
        <p><strong>Key prefix:</strong> ${keyPrefix}...</p>
        <p style="color: #666; font-size: 14px;">
          If you didn't create this key, please secure your account immediately.
        </p>
        <p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/api-keys"
             style="background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Manage API Keys
          </a>
        </p>
      </div>
    `,
  });

  if (error) {
    console.error('Failed to send API key email:', error);
  }

  return data;
}
