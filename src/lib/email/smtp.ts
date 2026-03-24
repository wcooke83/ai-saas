/**
 * SMTP email utility for the ticketing system.
 * Uses nodemailer with mail.cholds.com SMTP server.
 * Sends from support@vocui.com for ticket-related communications.
 */

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'mail.cholds.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // STARTTLS
  auth: {
    user: process.env.SMTP_USER || 'support@vocui.com',
    pass: process.env.SMTP_PASS,
  },
  tls: { rejectUnauthorized: false },
});

const FROM_EMAIL = process.env.SMTP_FROM || 'VocUI Support <support@vocui.com>';

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ============================================
// TICKET SUBMISSION CONFIRMATION (to visitor)
// ============================================
export async function sendTicketSubmittedEmail(
  to: string,
  { name, reference, subject, message }: {
    name: string;
    reference: string;
    subject?: string;
    message: string;
  }
) {
  await transporter.sendMail({
    from: FROM_EMAIL,
    to,
    subject: `Ticket ${reference} received${subject ? `: ${subject}` : ''}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #6366f1; padding: 20px 24px; border-radius: 8px 8px 0 0;">
          <h2 style="color: #ffffff; margin: 0;">Ticket Received</h2>
        </div>
        <div style="padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
          <p>Hi ${escapeHtml(name)},</p>
          <p>We've received your support ticket and will get back to you as soon as possible.</p>
          <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
            <tr>
              <td style="padding: 8px 0; color: #6b7280; width: 120px;">Reference:</td>
              <td style="padding: 8px 0; font-weight: 600;">${escapeHtml(reference)}</td>
            </tr>
            ${subject ? `<tr><td style="padding: 8px 0; color: #6b7280;">Subject:</td><td style="padding: 8px 0;">${escapeHtml(subject)}</td></tr>` : ''}
          </table>
          <div style="background: #f3f4f6; border-radius: 8px; padding: 16px; margin: 16px 0;">
            <p style="margin: 0; white-space: pre-line; font-size: 14px;">${escapeHtml(message)}</p>
          </div>
          <p style="color: #6b7280; font-size: 13px;">You will receive email notifications for any updates to this ticket.</p>
        </div>
      </div>
    `,
  });
}

// ============================================
// TICKET STATUS CHANGE (to visitor)
// ============================================
export async function sendTicketStatusChangeEmail(
  to: string,
  { name, reference, subject, oldStatus, newStatus }: {
    name: string;
    reference: string;
    subject?: string;
    oldStatus: string;
    newStatus: string;
  }
) {
  const statusLabels: Record<string, string> = {
    open: 'Open',
    in_progress: 'In Progress',
    resolved: 'Resolved',
    closed: 'Closed',
  };

  const statusColors: Record<string, string> = {
    open: '#3b82f6',
    in_progress: '#eab308',
    resolved: '#22c55e',
    closed: '#6b7280',
  };

  const newLabel = statusLabels[newStatus] || newStatus;
  const color = statusColors[newStatus] || '#6b7280';

  await transporter.sendMail({
    from: FROM_EMAIL,
    to,
    subject: `Ticket ${reference} status updated to ${newLabel}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #6366f1; padding: 20px 24px; border-radius: 8px 8px 0 0;">
          <h2 style="color: #ffffff; margin: 0;">Ticket Update</h2>
        </div>
        <div style="padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
          <p>Hi ${escapeHtml(name)},</p>
          <p>The status of your ticket <strong>${escapeHtml(reference)}</strong>${subject ? ` (${escapeHtml(subject)})` : ''} has been updated.</p>
          <div style="text-align: center; margin: 24px 0;">
            <span style="display: inline-block; padding: 6px 16px; background: #f3f4f6; border-radius: 20px; font-size: 14px; color: #6b7280;">${statusLabels[oldStatus] || oldStatus}</span>
            <span style="display: inline-block; margin: 0 12px; color: #9ca3af;">&rarr;</span>
            <span style="display: inline-block; padding: 6px 16px; background: ${color}; border-radius: 20px; font-size: 14px; color: #ffffff; font-weight: 600;">${newLabel}</span>
          </div>
          ${newStatus === 'resolved' ? '<p>If this doesn\'t resolve your issue, you can reply to this ticket and we\'ll reopen it.</p>' : ''}
          ${newStatus === 'closed' ? '<p>This ticket has been closed. If you need further assistance, please submit a new ticket.</p>' : ''}
          <p style="color: #6b7280; font-size: 13px;">Reference: ${escapeHtml(reference)}</p>
        </div>
      </div>
    `,
  });
}

// ============================================
// TICKET REPLY NOTIFICATION (to visitor)
// ============================================
export async function sendTicketReplyEmail(
  to: string,
  { visitorName, reference, subject, replyMessage, replierName }: {
    visitorName: string;
    reference: string;
    subject?: string;
    replyMessage: string;
    replierName: string;
  }
) {
  await transporter.sendMail({
    from: FROM_EMAIL,
    to,
    subject: `Re: Ticket ${reference}${subject ? ` - ${subject}` : ''}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #6366f1; padding: 20px 24px; border-radius: 8px 8px 0 0;">
          <h2 style="color: #ffffff; margin: 0;">New Reply on Ticket ${escapeHtml(reference)}</h2>
        </div>
        <div style="padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
          <p>Hi ${escapeHtml(visitorName)},</p>
          <p><strong>${escapeHtml(replierName)}</strong> has replied to your ticket${subject ? ` regarding <em>${escapeHtml(subject)}</em>` : ''}:</p>
          <div style="background: #f3f4f6; border-left: 4px solid #6366f1; border-radius: 0 8px 8px 0; padding: 16px; margin: 16px 0;">
            <p style="margin: 0; white-space: pre-line; font-size: 14px;">${escapeHtml(replyMessage)}</p>
          </div>
          <p style="color: #6b7280; font-size: 13px;">Reference: ${escapeHtml(reference)}</p>
        </div>
      </div>
    `,
  });
}

// ============================================
// NEW TICKET ADMIN NOTIFICATION
// ============================================
// ============================================
// CONTACT REPLY (admin → visitor)
// ============================================
export async function sendContactReplyEmail(
  to: string,
  { visitorName, submissionId, replyMessage, replierName, inReplyToMessageId }: {
    visitorName: string;
    submissionId: string;
    replyMessage: string;
    replierName: string;
    inReplyToMessageId?: string;
  }
): Promise<string> {
  const shortId = submissionId.slice(0, 8).toUpperCase();
  const subject = `Re: Your contact submission [CS-${shortId}]`;
  const messageId = `<cs-${submissionId}-${Date.now()}@vocui.com>`;

  const headers: Record<string, string> = { 'Message-ID': messageId };
  if (inReplyToMessageId) {
    headers['In-Reply-To'] = inReplyToMessageId;
    headers['References'] = inReplyToMessageId;
  }

  await transporter.sendMail({
    from: FROM_EMAIL,
    to,
    subject,
    headers,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #6366f1; padding: 20px 24px; border-radius: 8px 8px 0 0;">
          <h2 style="color: #ffffff; margin: 0;">Reply to Your Message</h2>
        </div>
        <div style="padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
          <p>Hi ${escapeHtml(visitorName)},</p>
          <p><strong>${escapeHtml(replierName)}</strong> has responded to your message:</p>
          <div style="background: #f3f4f6; border-left: 4px solid #6366f1; border-radius: 0 8px 8px 0; padding: 16px; margin: 16px 0;">
            <p style="margin: 0; white-space: pre-line; font-size: 14px;">${escapeHtml(replyMessage)}</p>
          </div>
          <p style="color: #6b7280; font-size: 13px;">You can reply directly to this email to continue the conversation.</p>
          <p style="color: #9ca3af; font-size: 11px;">Ref: CS-${shortId}</p>
        </div>
      </div>
    `,
  });

  return messageId;
}

// ============================================
// NEW TICKET ADMIN NOTIFICATION
// ============================================
export async function sendNewTicketAdminEmail(
  to: string,
  { reference, visitorName, visitorEmail, subject, message, priority, chatbotName, dashboardUrl }: {
    reference: string;
    visitorName: string;
    visitorEmail: string;
    subject?: string;
    message: string;
    priority: string;
    chatbotName: string;
    dashboardUrl?: string;
  }
) {
  const priorityColors: Record<string, string> = {
    low: '#22c55e',
    medium: '#eab308',
    high: '#f97316',
    urgent: '#ef4444',
  };

  await transporter.sendMail({
    from: FROM_EMAIL,
    to,
    subject: `[${priority.toUpperCase()}] New ticket ${reference} - ${chatbotName}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #6366f1; padding: 20px 24px; border-radius: 8px 8px 0 0;">
          <h2 style="color: #ffffff; margin: 0;">New Ticket: ${escapeHtml(reference)}</h2>
        </div>
        <div style="padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #6b7280; width: 100px;">From:</td><td style="padding: 8px 0;">${escapeHtml(visitorName)} (${escapeHtml(visitorEmail)})</td></tr>
            ${subject ? `<tr><td style="padding: 8px 0; color: #6b7280;">Subject:</td><td style="padding: 8px 0;">${escapeHtml(subject)}</td></tr>` : ''}
            <tr><td style="padding: 8px 0; color: #6b7280;">Priority:</td><td style="padding: 8px 0;"><span style="color: ${priorityColors[priority] || '#666'}; font-weight: bold;">${priority.toUpperCase()}</span></td></tr>
            <tr><td style="padding: 8px 0; color: #6b7280;">Chatbot:</td><td style="padding: 8px 0;">${escapeHtml(chatbotName)}</td></tr>
          </table>
          <div style="background: #f3f4f6; border-radius: 8px; padding: 16px; margin: 16px 0;">
            <p style="margin: 0; white-space: pre-line; font-size: 14px;">${escapeHtml(message)}</p>
          </div>
          ${dashboardUrl ? `<p><a href="${dashboardUrl}" style="background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">View Ticket</a></p>` : ''}
        </div>
      </div>
    `,
  });
}
