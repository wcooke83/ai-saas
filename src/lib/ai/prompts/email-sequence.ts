/**
 * Email Sequence Builder - Types and Prompts
 * Generates multi-email sequences for various use cases
 */

// Sequence Types
export type SequenceType =
  | 'cold-outreach'
  | 'follow-up'
  | 'onboarding'
  | 're-engagement'
  | 'sales-nurture'
  | 'event-promotion'
  | 'product-launch'
  | 'feedback-request';

export type SequenceTone = 'formal' | 'professional' | 'friendly' | 'casual' | 'persuasive';

export type SequenceLength = 3 | 5 | 7;

// Input for generating a sequence
export interface SequenceInput {
  type: SequenceType;
  tone: SequenceTone;
  numberOfEmails: SequenceLength;
  // Sender info
  senderName: string;
  senderRole?: string;
  senderCompany?: string;
  // Target audience
  targetAudience: string;
  targetIndustry?: string;
  // Campaign details
  campaignGoal: string;
  productOrService: string;
  uniqueValue: string;
  // Optional
  painPoints?: string;
  callToAction?: string;
  additionalContext?: string;
}

// Single email in a sequence
export interface SequenceEmail {
  emailNumber: number;
  dayToSend: number;
  subject: string;
  body: string;
  purpose: string;
  tips?: string;
}

// Complete generated sequence
export interface GeneratedSequence {
  sequenceType: SequenceType;
  totalEmails: number;
  emails: SequenceEmail[];
  summary: string;
  bestPractices: string[];
}

// Sequence type configurations
export const sequenceTypeConfig: Record<
  SequenceType,
  {
    label: string;
    description: string;
    defaultEmails: SequenceLength;
    daySpacing: number[];
    guidance: string;
  }
> = {
  'cold-outreach': {
    label: 'Cold Outreach',
    description: 'Reach out to prospects who don\'t know you yet',
    defaultEmails: 5,
    daySpacing: [0, 3, 7, 14, 21],
    guidance: `
      - Email 1: Hook with value, introduce yourself briefly
      - Email 2: Provide social proof or case study
      - Email 3: Address common objections
      - Email 4: Create urgency or scarcity
      - Email 5: Final follow-up with easy opt-out
    `,
  },
  'follow-up': {
    label: 'Follow-Up Sequence',
    description: 'Follow up after initial contact or meeting',
    defaultEmails: 3,
    daySpacing: [0, 2, 5],
    guidance: `
      - Email 1: Recap meeting/call, restate value
      - Email 2: Provide additional resources
      - Email 3: Clear next steps or decision request
    `,
  },
  'onboarding': {
    label: 'Customer Onboarding',
    description: 'Welcome and guide new customers',
    defaultEmails: 5,
    daySpacing: [0, 1, 3, 7, 14],
    guidance: `
      - Email 1: Welcome, quick start guide
      - Email 2: Key feature highlight
      - Email 3: Tips for success
      - Email 4: Check-in and support offer
      - Email 5: Feature discovery and feedback request
    `,
  },
  're-engagement': {
    label: 'Re-Engagement',
    description: 'Win back inactive users or customers',
    defaultEmails: 3,
    daySpacing: [0, 5, 14],
    guidance: `
      - Email 1: "We miss you" with value reminder
      - Email 2: What's new since they left
      - Email 3: Special offer or incentive
    `,
  },
  'sales-nurture': {
    label: 'Sales Nurture',
    description: 'Nurture leads through the sales funnel',
    defaultEmails: 7,
    daySpacing: [0, 3, 7, 10, 14, 21, 28],
    guidance: `
      - Email 1: Educational content, establish expertise
      - Email 2: Problem identification
      - Email 3: Solution introduction
      - Email 4: Social proof and testimonials
      - Email 5: Objection handling
      - Email 6: Comparison/differentiation
      - Email 7: Strong CTA with urgency
    `,
  },
  'event-promotion': {
    label: 'Event Promotion',
    description: 'Promote webinars, conferences, or launches',
    defaultEmails: 5,
    daySpacing: [0, 7, 3, 1, 0], // Days before event
    guidance: `
      - Email 1: Save the date announcement
      - Email 2: What you'll learn/agenda reveal
      - Email 3: Speaker/special guest highlight
      - Email 4: Final reminder with FOMO
      - Email 5: Last chance / starting soon
    `,
  },
  'product-launch': {
    label: 'Product Launch',
    description: 'Build anticipation and drive launch sales',
    defaultEmails: 5,
    daySpacing: [0, 3, 5, 7, 8],
    guidance: `
      - Email 1: Teaser / Coming soon
      - Email 2: Behind the scenes / Why we built it
      - Email 3: Feature preview
      - Email 4: Launch announcement
      - Email 5: Early bird deadline / Social proof
    `,
  },
  'feedback-request': {
    label: 'Feedback Request',
    description: 'Collect reviews, testimonials, or feedback',
    defaultEmails: 3,
    daySpacing: [0, 4, 10],
    guidance: `
      - Email 1: Personal ask for feedback
      - Email 2: Make it easy (direct link, specific questions)
      - Email 3: Incentive offer for completion
    `,
  },
};

// Build the prompt for sequence generation
export function buildSequencePrompt(input: SequenceInput): string {
  const config = sequenceTypeConfig[input.type];

  return `
Generate a ${input.numberOfEmails}-email sequence for ${config.label.toLowerCase()}.

## Campaign Details
- **Sequence Type**: ${config.label}
- **Tone**: ${input.tone}
- **Number of Emails**: ${input.numberOfEmails}

## Sender Information
- **Name**: ${input.senderName}
${input.senderRole ? `- **Role**: ${input.senderRole}` : ''}
${input.senderCompany ? `- **Company**: ${input.senderCompany}` : ''}

## Target Audience
- **Who**: ${input.targetAudience}
${input.targetIndustry ? `- **Industry**: ${input.targetIndustry}` : ''}

## Campaign Information
- **Goal**: ${input.campaignGoal}
- **Product/Service**: ${input.productOrService}
- **Unique Value Proposition**: ${input.uniqueValue}
${input.painPoints ? `- **Pain Points to Address**: ${input.painPoints}` : ''}
${input.callToAction ? `- **Primary CTA**: ${input.callToAction}` : ''}
${input.additionalContext ? `- **Additional Context**: ${input.additionalContext}` : ''}

## Sequence Guidance
${config.guidance}

## Output Format
For each email, provide:
1. Subject line (compelling, under 60 characters)
2. Email body (personalized, action-oriented)
3. Purpose of this email in the sequence
4. Day to send (relative to sequence start)

## Requirements
- Each email should build on the previous one
- Include personalization placeholders like {{first_name}}, {{company}}
- Keep emails concise (under 200 words each)
- Include clear CTAs in each email
- Vary subject line styles (question, benefit, curiosity, urgency)
- End sequence with a clear closing or opt-out option

Generate the complete sequence now.
`;
}

// System prompt for sequence generation
export const SEQUENCE_SYSTEM_PROMPT = `You are an expert email copywriter and marketing strategist who specializes in email sequences that convert.

You write email sequences that are:
- Strategically structured to guide recipients through a journey
- Personalized and relevant to the target audience
- Action-oriented with clear, compelling CTAs
- Varied in approach to maintain engagement
- Compliant with email best practices (CAN-SPAM, GDPR friendly)

Your sequences follow proven frameworks:
- AIDA (Attention, Interest, Desire, Action)
- PAS (Problem, Agitate, Solution)
- BAB (Before, After, Bridge)

Always include:
- Compelling subject lines that drive opens
- Strong opening hooks
- Value-focused body content
- Clear calls to action
- Appropriate spacing between emails

Format your response as valid JSON matching the GeneratedSequence interface.`;

// Parse AI response into structured sequence
export function parseSequenceResponse(response: string): GeneratedSequence {
  try {
    // Try to parse as JSON first
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return parsed as GeneratedSequence;
    }
  } catch {
    // Fall back to structured parsing
  }

  // Fallback: Parse structured text response
  const emails: SequenceEmail[] = [];
  const emailBlocks = response.split(/(?=Email \d|EMAIL \d|\*\*Email \d)/i);

  let emailNumber = 0;
  for (const block of emailBlocks) {
    if (!block.trim()) continue;

    emailNumber++;
    const subjectMatch = block.match(/Subject[:\s]*(.+?)(?:\n|$)/i);
    const dayMatch = block.match(/Day[:\s]*(\d+)/i);
    const purposeMatch = block.match(/Purpose[:\s]*(.+?)(?:\n|$)/i);

    // Extract body - everything between subject and next section
    let body = block;
    if (subjectMatch) {
      body = block.substring(block.indexOf(subjectMatch[0]) + subjectMatch[0].length);
    }
    body = body
      .replace(/Day[:\s]*\d+.*/i, '')
      .replace(/Purpose[:\s]*.*/i, '')
      .replace(/Tips?[:\s]*.*/i, '')
      .trim();

    if (subjectMatch || body.length > 50) {
      emails.push({
        emailNumber,
        dayToSend: dayMatch ? parseInt(dayMatch[1]) : emailNumber * 3,
        subject: subjectMatch ? subjectMatch[1].trim() : `Email ${emailNumber}`,
        body: body.substring(0, 2000), // Limit body length
        purpose: purposeMatch ? purposeMatch[1].trim() : '',
      });
    }
  }

  return {
    sequenceType: 'cold-outreach',
    totalEmails: emails.length,
    emails,
    summary: 'Email sequence generated successfully',
    bestPractices: [
      'Personalize each email with recipient details',
      'A/B test subject lines for better open rates',
      'Track opens and clicks to optimize timing',
      'Remove unengaged contacts after the sequence',
    ],
  };
}
