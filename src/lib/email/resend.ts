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
