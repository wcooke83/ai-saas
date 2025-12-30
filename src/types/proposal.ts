/**
 * Proposal Generator Types
 */

// ===================
// PROPOSAL TYPES
// ===================

export type ProposalType =
  | 'sales'
  | 'rfp-response'
  | 'partnership'
  | 'pricing'
  | 'project'
  | 'service-quote'
  | 'capability-statement'
  | 'sow'
  | 'grant'
  | 'consulting';

export const PROPOSAL_TYPES: { value: ProposalType; label: string }[] = [
  { value: 'sales', label: 'Sales Proposal' },
  { value: 'rfp-response', label: 'RFP Response' },
  { value: 'partnership', label: 'Partnership Pitch' },
  { value: 'pricing', label: 'Pricing Proposal' },
  { value: 'project', label: 'Project Proposal' },
  { value: 'service-quote', label: 'Service Quote' },
  { value: 'capability-statement', label: 'Capability Statement' },
  { value: 'sow', label: 'Statement of Work' },
  { value: 'grant', label: 'Grant Proposal' },
  { value: 'consulting', label: 'Consulting Proposal' },
];

// Free tier allowed types
export const FREE_PROPOSAL_TYPES: ProposalType[] = [
  'sales',
  'project',
  'pricing',
  'service-quote',
];

// ===================
// INDUSTRIES
// ===================

export type Industry =
  | 'tech-saas'
  | 'marketing-agency'
  | 'finance'
  | 'healthcare'
  | 'legal'
  | 'construction'
  | 'education'
  | 'nonprofit';

export const INDUSTRIES: { value: Industry; label: string }[] = [
  { value: 'tech-saas', label: 'Technology / SaaS' },
  { value: 'marketing-agency', label: 'Marketing / Agency' },
  { value: 'finance', label: 'Finance / Banking' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'legal', label: 'Legal Services' },
  { value: 'construction', label: 'Construction' },
  { value: 'education', label: 'Education' },
  { value: 'nonprofit', label: 'Nonprofit' },
];

// Free tier allowed industries
export const FREE_INDUSTRIES: Industry[] = [
  'tech-saas',
  'marketing-agency',
  'finance',
];

// ===================
// SECTIONS
// ===================

export type SectionType =
  | 'executive-summary'
  | 'company-overview'
  | 'problem-statement'
  | 'proposed-solution'
  | 'scope-of-work'
  | 'deliverables'
  | 'timeline-milestones'
  | 'pricing-fees'
  | 'team-qualifications'
  | 'case-studies'
  | 'methodology'
  | 'terms-conditions'
  | 'next-steps'
  | 'appendix'
  | 'budget-breakdown'
  | 'success-metrics'
  | 'risk-mitigation'
  | 'competitive-analysis';

export const SECTION_LABELS: Record<SectionType, string> = {
  'executive-summary': 'Executive Summary',
  'company-overview': 'Company Overview',
  'problem-statement': 'Problem Statement',
  'proposed-solution': 'Proposed Solution',
  'scope-of-work': 'Scope of Work',
  'deliverables': 'Deliverables',
  'timeline-milestones': 'Timeline & Milestones',
  'pricing-fees': 'Pricing & Fees',
  'team-qualifications': 'Team & Qualifications',
  'case-studies': 'Case Studies',
  'methodology': 'Methodology',
  'terms-conditions': 'Terms & Conditions',
  'next-steps': 'Next Steps',
  'appendix': 'Appendix',
  'budget-breakdown': 'Budget Breakdown',
  'success-metrics': 'Success Metrics',
  'risk-mitigation': 'Risk Mitigation',
  'competitive-analysis': 'Competitive Analysis',
};

export interface ProposalSection {
  id: string;
  type: SectionType;
  title: string;
  content: string;
  isEnabled: boolean;
  isEdited: boolean;
  order: number;
  isRequired: boolean;
}

// ===================
// TONE
// ===================

export type ProposalTone = 'formal' | 'professional' | 'friendly';

export const PROPOSAL_TONES: { value: ProposalTone; label: string }[] = [
  { value: 'formal', label: 'Formal' },
  { value: 'professional', label: 'Professional' },
  { value: 'friendly', label: 'Friendly' },
];

// ===================
// FORM INPUT
// ===================

export interface ProposalInput {
  // Basic Info
  proposalType: ProposalType;
  industry: Industry;
  title?: string;

  // Client Info
  clientName: string;
  clientCompany: string;
  clientRole?: string;

  // Sender Info
  senderName: string;
  senderCompany: string;
  senderRole?: string;
  senderEmail?: string;

  // Project Details
  projectDescription: string;
  objectives: string;
  timeline?: string;
  budget?: string;
  constraints?: string;

  // Additional Context
  competitiveAdvantage?: string;
  previousWork?: string;
  additionalNotes?: string;

  // Configuration
  tone: ProposalTone;
  selectedSections: SectionType[];
}

// ===================
// BRANDING (Pro)
// ===================

export interface BrandingConfig {
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  companyName: string;
  tagline?: string;
  footerText?: string;
}

// ===================
// GENERATED PROPOSAL
// ===================

export interface GeneratedProposal {
  id: string;
  input: ProposalInput;
  sections: ProposalSection[];
  metadata: {
    generatedAt: string;
    tokensUsed: number;
    version: number;
  };
}

// ===================
// EXPORT OPTIONS
// ===================

export type ExportFormat = 'markdown' | 'pdf' | 'docx';

export interface ExportOptions {
  format: ExportFormat;
  includeCoverPage: boolean;
  includeTableOfContents: boolean;
  includePageNumbers: boolean;
  branding?: BrandingConfig;
}

// ===================
// TIER RESTRICTIONS
// ===================

export interface TierRestrictions {
  allowedTypes: ProposalType[] | 'all';
  allowedIndustries: Industry[] | 'all';
  maxSections: number;
  features: {
    sectionRegeneration: boolean;
    docxExport: boolean;
    pdfExport: boolean;
    branding: boolean;
    reordering: boolean;
  };
}

export const TIER_RESTRICTIONS: Record<'free' | 'pro', TierRestrictions> = {
  free: {
    allowedTypes: FREE_PROPOSAL_TYPES,
    allowedIndustries: FREE_INDUSTRIES,
    maxSections: 6,
    features: {
      sectionRegeneration: false,
      docxExport: false,
      pdfExport: true, // Watermarked
      branding: false,
      reordering: false,
    },
  },
  pro: {
    allowedTypes: 'all',
    allowedIndustries: 'all',
    maxSections: Infinity,
    features: {
      sectionRegeneration: true,
      docxExport: true,
      pdfExport: true,
      branding: true,
      reordering: true,
    },
  },
};
