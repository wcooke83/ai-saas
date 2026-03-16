import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = 'AI SaaS Tools <noreply@gosaas.com>';

export async function sendWelcomeEmail(to: string, name?: string) {
  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: 'Welcome to AI SaaS Tools!',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #6366f1;">Welcome${name ? `, ${name}` : ''}!</h1>
        <p>Thanks for signing up for AI SaaS Tools. You now have access to:</p>
        <ul>
          <li>AI Email Writer</li>
          <li>Proposal Generator</li>
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
    subject: 'Reset your password - AI SaaS Tools',
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

export async function sendApiKeyCreatedEmail(to: string, keyName: string, keyPrefix: string) {
  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: 'New API Key Created - AI SaaS Tools',
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
