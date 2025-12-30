/**
 * Per-Section Prompt Templates
 */

import type { ProposalType, ProposalTone } from '@/types/proposal';
import type { TypeGuidance, ToneGuidance } from './types';

// ===================
// TYPE GUIDANCE
// ===================

export const TYPE_GUIDANCE: Record<ProposalType, TypeGuidance> = {
  sales: {
    description: 'A persuasive proposal to win new business',
    keyFocus: [
      'Value proposition and ROI',
      'Addressing pain points',
      'Competitive differentiation',
      'Clear call to action',
    ],
    mustInclude: [
      'Compelling executive summary',
      'Clear pricing with value justification',
      'Social proof (case studies/testimonials)',
      'Urgency and next steps',
    ],
    avoid: [
      'Technical jargon without explanation',
      'Focusing on features over benefits',
      'Unclear or hidden pricing',
      'Weak or missing call to action',
    ],
  },

  'rfp-response': {
    description: 'A comprehensive response to a formal request for proposal',
    keyFocus: [
      'Point-by-point RFP compliance',
      'Technical capability demonstration',
      'Team qualifications',
      'Methodology and approach',
    ],
    mustInclude: [
      'All required sections per RFP',
      'Compliance matrix if applicable',
      'Detailed methodology',
      'Team bios and qualifications',
      'Complete pricing breakdown',
    ],
    avoid: [
      'Missing required sections',
      'Vague or generic responses',
      'Ignoring evaluation criteria',
      'Incomplete pricing',
    ],
  },

  partnership: {
    description: 'A proposal for mutual collaboration or partnership',
    keyFocus: [
      'Mutual benefit and value exchange',
      'Strategic alignment',
      'Shared goals and vision',
      'Governance and structure',
    ],
    mustInclude: [
      'Clear value for both parties',
      'Partnership structure and roles',
      'Success metrics',
      'Exit provisions and terms',
    ],
    avoid: [
      'One-sided benefits',
      'Vague partnership terms',
      'Missing governance structure',
      'Unclear expectations',
    ],
  },

  pricing: {
    description: 'A detailed pricing breakdown and cost proposal',
    keyFocus: [
      'Transparent cost structure',
      'Value justification',
      'Payment terms',
      'Scope clarity',
    ],
    mustInclude: [
      'Itemized pricing',
      'Scope inclusions and exclusions',
      'Payment schedule',
      'Terms and conditions',
    ],
    avoid: [
      'Hidden fees or ambiguity',
      'Missing scope definition',
      'Unclear payment terms',
      'Pricing without context',
    ],
  },

  project: {
    description: 'A comprehensive project proposal with scope and timeline',
    keyFocus: [
      'Clear project objectives',
      'Detailed scope and deliverables',
      'Realistic timeline',
      'Risk management',
    ],
    mustInclude: [
      'Project objectives and success criteria',
      'Detailed scope of work',
      'Milestone timeline',
      'Risk mitigation plan',
      'Resource requirements',
    ],
    avoid: [
      'Scope ambiguity',
      'Unrealistic timelines',
      'Missing dependencies',
      'Ignoring potential risks',
    ],
  },

  'service-quote': {
    description: 'A quick quote for specific services',
    keyFocus: [
      'Clear service description',
      'Straightforward pricing',
      'Timeline commitment',
      'Terms clarity',
    ],
    mustInclude: [
      'Service description',
      'Fixed or estimated pricing',
      'Delivery timeline',
      'Basic terms',
    ],
    avoid: [
      'Overcomplicating simple services',
      'Vague pricing',
      'Missing timeline',
      'Unclear deliverables',
    ],
  },

  'capability-statement': {
    description: 'A showcase of company capabilities and qualifications',
    keyFocus: [
      'Core competencies',
      'Past performance',
      'Differentiators',
      'Credentials',
    ],
    mustInclude: [
      'Company overview',
      'Core competencies',
      'Past performance examples',
      'Certifications and credentials',
    ],
    avoid: [
      'Generic descriptions',
      'Unsubstantiated claims',
      'Missing credentials',
      'Outdated information',
    ],
  },

  sow: {
    description: 'A detailed statement of work with specific deliverables',
    keyFocus: [
      'Precise scope definition',
      'Measurable deliverables',
      'Clear acceptance criteria',
      'Timeline and milestones',
    ],
    mustInclude: [
      'Detailed scope',
      'Specific deliverables',
      'Acceptance criteria',
      'Timeline with milestones',
      'Assumptions and dependencies',
    ],
    avoid: [
      'Ambiguous language',
      'Unmeasurable deliverables',
      'Missing acceptance criteria',
      'Unclear responsibilities',
    ],
  },

  grant: {
    description: 'A funding proposal for grants or foundations',
    keyFocus: [
      'Problem significance',
      'Solution viability',
      'Measurable impact',
      'Budget justification',
    ],
    mustInclude: [
      'Problem statement with data',
      'Proposed solution and methodology',
      'Expected outcomes and metrics',
      'Detailed budget',
      'Organizational capacity',
    ],
    avoid: [
      'Weak problem justification',
      'Vague outcomes',
      'Unrealistic budget',
      'Missing evaluation plan',
    ],
  },

  consulting: {
    description: 'A professional services engagement proposal',
    keyFocus: [
      'Expertise demonstration',
      'Methodology clarity',
      'Value delivery',
      'Team qualifications',
    ],
    mustInclude: [
      'Diagnostic insights',
      'Proposed methodology',
      'Team expertise',
      'Expected outcomes',
      'Engagement structure',
    ],
    avoid: [
      'Generic methodology',
      'Unqualified team',
      'Vague deliverables',
      'Missing expertise proof',
    ],
  },
};

// ===================
// TONE GUIDANCE
// ===================

export const TONE_GUIDANCE: Record<ProposalTone, ToneGuidance> = {
  formal: {
    style: 'Professional, structured, and authoritative',
    language: 'Use formal business language, avoid contractions, maintain professional distance',
    examples: 'We are pleased to present... | The organization proposes... | It is recommended that...',
  },
  professional: {
    style: 'Business-appropriate but approachable',
    language: 'Clear and direct, occasional contractions acceptable, confident but not stiff',
    examples: "We're excited to share... | Our team will deliver... | Here's what we propose...",
  },
  friendly: {
    style: 'Warm, personable, and conversational',
    language: 'Use contractions, first-person plural, create connection while maintaining credibility',
    examples: "We'd love to help you... | Let's work together to... | Here's how we can make this happen...",
  },
};

/**
 * Get type guidance for prompt injection
 */
export function getTypeGuidance(type: ProposalType): string {
  const guidance = TYPE_GUIDANCE[type];

  return `Proposal Type: ${type.replace(/-/g, ' ').toUpperCase()}
${guidance.description}

Key Focus Areas:
${guidance.keyFocus.map(f => `- ${f}`).join('\n')}

Must Include:
${guidance.mustInclude.map(m => `- ${m}`).join('\n')}

Avoid:
${guidance.avoid.map(a => `- ${a}`).join('\n')}`;
}

/**
 * Get tone guidance for prompt injection
 */
export function getToneGuidance(tone: ProposalTone): string {
  const guidance = TONE_GUIDANCE[tone];

  return `Tone: ${tone.toUpperCase()}
Style: ${guidance.style}
Language: ${guidance.language}
Example phrases: ${guidance.examples}`;
}
