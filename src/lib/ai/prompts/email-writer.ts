/**
 * Email Writer Prompt Templates
 * Professional email generation for various use cases
 */

export type EmailType =
  | 'cold-outreach'
  | 'follow-up'
  | 'introduction'
  | 'thank-you'
  | 'meeting-request'
  | 'proposal'
  | 'feedback-request';

export type EmailTone = 'formal' | 'professional' | 'friendly' | 'casual';

export interface EmailInput {
  type: EmailType;
  tone: EmailTone;
  senderName: string;
  senderRole?: string;
  senderCompany?: string;
  recipientName: string;
  recipientRole?: string;
  recipientCompany?: string;
  purpose: string;
  keyPoints?: string;
  callToAction?: string;
  additionalContext?: string;
}

const EMAIL_TYPE_GUIDANCE: Record<EmailType, string> = {
  'cold-outreach': `This is a cold outreach email to someone who doesn't know the sender.
- Lead with value, not a pitch
- Keep it under 150 words
- Make it personal and relevant
- End with a clear, low-commitment ask`,

  'follow-up': `This is a follow-up email after previous contact.
- Reference the previous interaction briefly
- Provide additional value or context
- Be respectful of their time
- Include a specific next step`,

  'introduction': `This is an introduction or networking email.
- Establish credibility quickly
- Find common ground
- Be specific about why you're reaching out
- Keep the ask simple`,

  'thank-you': `This is a thank-you email.
- Be specific about what you're thanking them for
- Mention the impact or value received
- Keep it sincere and brief
- Optionally mention next steps`,

  'meeting-request': `This is a meeting request email.
- State the purpose clearly
- Propose specific times
- Mention the expected duration
- Explain what you hope to accomplish`,

  'proposal': `This is a proposal or pitch email.
- Lead with the benefit to them
- Be specific about what you're proposing
- Include relevant details or numbers
- End with clear next steps`,

  'feedback-request': `This is a feedback request email.
- Be specific about what feedback you want
- Make it easy to respond
- Explain why their feedback matters
- Set expectations on time commitment`,
};

const TONE_GUIDANCE: Record<EmailTone, string> = {
  formal: 'Use formal language, proper titles (Mr./Ms./Dr.), and traditional business conventions. Avoid contractions.',
  professional: 'Use professional but approachable language. Contractions are okay. Balance warmth with professionalism.',
  friendly: 'Use warm, personable language while remaining professional. Show genuine interest and enthusiasm.',
  casual: 'Use conversational language as if writing to a colleague. Keep it relaxed but still respectful.',
};

export function buildEmailPrompt(input: EmailInput): string {
  const {
    type,
    tone,
    senderName,
    senderRole,
    senderCompany,
    recipientName,
    recipientRole,
    recipientCompany,
    purpose,
    keyPoints,
    callToAction,
    additionalContext,
  } = input;

  const senderInfo = [
    senderName,
    senderRole && `(${senderRole})`,
    senderCompany && `at ${senderCompany}`,
  ]
    .filter(Boolean)
    .join(' ');

  const recipientInfo = [
    recipientName,
    recipientRole && `(${recipientRole})`,
    recipientCompany && `at ${recipientCompany}`,
  ]
    .filter(Boolean)
    .join(' ');

  return `Write a ${type.replace('-', ' ')} email with the following specifications:

## Sender
${senderInfo}

## Recipient
${recipientInfo}

## Purpose
${purpose}

${keyPoints ? `## Key Points to Include\n${keyPoints}` : ''}

${callToAction ? `## Desired Call to Action\n${callToAction}` : ''}

${additionalContext ? `## Additional Context\n${additionalContext}` : ''}

## Email Type Guidelines
${EMAIL_TYPE_GUIDANCE[type]}

## Tone
${TONE_GUIDANCE[tone]}

## Output Requirements
1. Generate a compelling subject line
2. Write the email body
3. Keep the email concise and scannable
4. Use short paragraphs (2-3 sentences max)
5. End with a clear call to action

Format your response exactly as:
SUBJECT: [subject line]

[email body]

Do not include any other text, explanations, or formatting outside this structure.`;
}

export const EMAIL_SYSTEM_PROMPT = `You are an expert email copywriter who specializes in business communication.
You write emails that are:
- Clear and concise
- Appropriately toned for the context
- Action-oriented with clear next steps
- Respectful of the reader's time
- Personalized and relevant

You understand the nuances of professional communication across industries and know how to:
- Capture attention quickly
- Build rapport naturally
- Ask for what you want without being pushy
- Close with effective calls to action

Always write emails that the recipient would actually want to read and respond to.`;
