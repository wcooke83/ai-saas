/**
 * Proposal Section Definitions
 */

import type { ProposalType, SectionType } from '@/types/proposal';
import type { SectionPromptConfig } from './types';

// ===================
// SECTION PROMPTS
// ===================

export const SECTION_PROMPTS: Record<SectionType, SectionPromptConfig> = {
  'executive-summary': {
    guidance: `Write a compelling executive summary that:
- Opens with a hook addressing the client's main challenge
- Summarizes the proposed solution in 2-3 sentences
- Highlights 3 key benefits and expected outcomes
- Creates urgency and demonstrates understanding
- Keeps total length under 200 words`,
    maxWords: 250,
    required: true,
  },
  'company-overview': {
    guidance: `Present the company credentials:
- Brief history and mission (2-3 sentences)
- Core competencies relevant to this project
- Key differentiators from competitors
- Notable achievements or certifications
- Team size and expertise areas`,
    maxWords: 300,
    required: false,
  },
  'problem-statement': {
    guidance: `Articulate the client's challenges:
- Demonstrate deep understanding of their situation
- Quantify the impact with specific metrics where possible
- Identify root causes, not just symptoms
- Create urgency without being alarmist
- Set up the solution naturally`,
    maxWords: 300,
    required: false,
  },
  'proposed-solution': {
    guidance: `Detail the proposed solution:
- Explain the approach clearly and concisely
- Connect directly to the problems identified
- Highlight innovative or unique aspects
- Explain why this approach is optimal
- Include high-level implementation overview`,
    maxWords: 400,
    required: true,
  },
  'scope-of-work': {
    guidance: `Define the project scope precisely:
- List all included services and activities
- Clearly state what is NOT included (exclusions)
- Define boundaries and assumptions
- Specify client responsibilities
- Include any dependencies`,
    maxWords: 400,
    required: false,
  },
  'deliverables': {
    guidance: `List concrete deliverables:
- Be specific about each deliverable
- Include format and specifications
- Note any review/approval milestones
- Organize by phase if applicable
- Include acceptance criteria`,
    maxWords: 350,
    required: false,
  },
  'timeline-milestones': {
    guidance: `Present the project timeline:
- Break into clear phases or milestones
- Include start and end points for each phase
- Note key decision points
- Account for review cycles
- Be realistic about dependencies`,
    maxWords: 300,
    required: false,
  },
  'pricing-fees': {
    guidance: `Present pricing clearly:
- Structure fees logically (phases, components, or flat)
- Explain what's included in each price point
- Note payment terms and schedule
- Include any optional add-ons
- Be transparent about potential additional costs`,
    maxWords: 350,
    required: true,
  },
  'team-qualifications': {
    guidance: `Showcase team expertise:
- Highlight relevant experience
- Include brief bios of key team members
- Note certifications and specializations
- Reference similar successful projects
- Demonstrate industry knowledge`,
    maxWords: 350,
    required: false,
  },
  'case-studies': {
    guidance: `Present relevant success stories:
- Choose 2-3 most relevant examples
- Include challenge, solution, and results
- Quantify outcomes where possible
- Highlight similarities to current project
- Include client testimonials if available`,
    maxWords: 400,
    required: false,
  },
  'methodology': {
    guidance: `Explain your approach:
- Describe the methodology or framework
- Explain why this approach works
- Detail key phases and activities
- Include quality assurance measures
- Show how you handle challenges`,
    maxWords: 350,
    required: false,
  },
  'terms-conditions': {
    guidance: `Outline standard terms:
- Payment terms and late payment policy
- Intellectual property rights
- Confidentiality provisions
- Termination conditions
- Liability limitations
- Warranty or guarantee terms`,
    maxWords: 400,
    required: false,
  },
  'next-steps': {
    guidance: `Provide clear call to action:
- Outline immediate next steps
- Include timeline for decision
- Provide contact information
- Create sense of urgency
- Make it easy to say yes`,
    maxWords: 200,
    required: false,
  },
  'appendix': {
    guidance: `Include supporting materials:
- Technical specifications
- Detailed breakdowns
- Supporting documentation
- References and resources
- Additional case studies`,
    maxWords: 500,
    required: false,
  },
  'budget-breakdown': {
    guidance: `Provide detailed cost analysis:
- Break down costs by category
- Explain each line item
- Show cost assumptions
- Include contingency if applicable
- Compare options if relevant`,
    maxWords: 400,
    required: false,
  },
  'success-metrics': {
    guidance: `Define measurable outcomes:
- Specify KPIs and targets
- Explain measurement methodology
- Set realistic expectations
- Include timeline for achieving metrics
- Define success criteria`,
    maxWords: 300,
    required: false,
  },
  'risk-mitigation': {
    guidance: `Address potential risks:
- Identify key project risks
- Assess likelihood and impact
- Propose mitigation strategies
- Include contingency plans
- Show proactive risk management`,
    maxWords: 300,
    required: false,
  },
  'competitive-analysis': {
    guidance: `Position against alternatives:
- Compare to relevant competitors
- Highlight unique advantages
- Address potential objections
- Demonstrate value proposition
- Support claims with evidence`,
    maxWords: 350,
    required: false,
  },
};

// ===================
// DEFAULT SECTIONS BY TYPE
// ===================

export const DEFAULT_SECTIONS_BY_TYPE: Record<ProposalType, SectionType[]> = {
  sales: [
    'executive-summary',
    'problem-statement',
    'proposed-solution',
    'pricing-fees',
    'case-studies',
    'next-steps',
  ],
  'rfp-response': [
    'executive-summary',
    'company-overview',
    'proposed-solution',
    'methodology',
    'team-qualifications',
    'timeline-milestones',
    'pricing-fees',
    'terms-conditions',
  ],
  partnership: [
    'executive-summary',
    'company-overview',
    'proposed-solution',
    'success-metrics',
    'terms-conditions',
    'next-steps',
  ],
  pricing: [
    'executive-summary',
    'scope-of-work',
    'deliverables',
    'pricing-fees',
    'budget-breakdown',
    'terms-conditions',
  ],
  project: [
    'executive-summary',
    'problem-statement',
    'proposed-solution',
    'scope-of-work',
    'deliverables',
    'timeline-milestones',
    'pricing-fees',
    'risk-mitigation',
    'next-steps',
  ],
  'service-quote': [
    'executive-summary',
    'scope-of-work',
    'deliverables',
    'pricing-fees',
    'timeline-milestones',
    'terms-conditions',
  ],
  'capability-statement': [
    'company-overview',
    'team-qualifications',
    'case-studies',
    'methodology',
    'competitive-analysis',
  ],
  sow: [
    'executive-summary',
    'scope-of-work',
    'deliverables',
    'timeline-milestones',
    'success-metrics',
    'terms-conditions',
    'appendix',
  ],
  grant: [
    'executive-summary',
    'problem-statement',
    'proposed-solution',
    'methodology',
    'timeline-milestones',
    'budget-breakdown',
    'success-metrics',
    'team-qualifications',
  ],
  consulting: [
    'executive-summary',
    'problem-statement',
    'methodology',
    'team-qualifications',
    'deliverables',
    'timeline-milestones',
    'pricing-fees',
    'case-studies',
    'next-steps',
  ],
};

// ===================
// ALL SECTIONS LIST
// ===================

export const ALL_SECTIONS: SectionType[] = [
  'executive-summary',
  'company-overview',
  'problem-statement',
  'proposed-solution',
  'scope-of-work',
  'deliverables',
  'timeline-milestones',
  'pricing-fees',
  'team-qualifications',
  'case-studies',
  'methodology',
  'terms-conditions',
  'next-steps',
  'appendix',
  'budget-breakdown',
  'success-metrics',
  'risk-mitigation',
  'competitive-analysis',
];
