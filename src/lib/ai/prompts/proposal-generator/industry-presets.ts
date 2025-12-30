/**
 * Industry-Specific Presets
 */

import type { Industry } from '@/types/proposal';
import type { IndustryPreset } from './types';

export const INDUSTRY_PRESETS: Record<Industry, IndustryPreset> = {
  'tech-saas': {
    terminology: [
      'SaaS', 'API', 'integration', 'scalability', 'uptime', 'SLA',
      'cloud-native', 'microservices', 'DevOps', 'CI/CD', 'agile',
      'sprint', 'MVP', 'iteration', 'deployment', 'infrastructure',
    ],
    focusAreas: [
      'ROI and efficiency gains',
      'Automation and time savings',
      'Data security and compliance',
      'Scalability and performance',
      'Integration capabilities',
      'User adoption and training',
    ],
    commonDeliverables: [
      'Implementation and setup',
      'Data migration',
      'Custom integrations',
      'User training',
      'Documentation',
      'Ongoing support',
    ],
    pricingModels: ['subscription', 'per-seat', 'usage-based', 'tiered', 'enterprise'],
    complianceNotes: 'Consider SOC 2, GDPR, HIPAA if applicable',
  },

  'marketing-agency': {
    terminology: [
      'campaign', 'ROI', 'conversion', 'brand awareness', 'KPIs',
      'engagement', 'reach', 'impressions', 'CTR', 'CPA', 'ROAS',
      'funnel', 'lead generation', 'content strategy', 'SEO', 'PPC',
    ],
    focusAreas: [
      'Brand positioning and awareness',
      'Lead generation and conversion',
      'Audience targeting and segmentation',
      'Creative strategy and execution',
      'Performance metrics and reporting',
      'Market differentiation',
    ],
    commonDeliverables: [
      'Strategy documents',
      'Creative assets',
      'Campaign setup and management',
      'Performance reports',
      'A/B testing',
      'Monthly optimization',
    ],
    pricingModels: ['retainer', 'project-based', 'performance-based', 'hourly', 'hybrid'],
  },

  finance: {
    terminology: [
      'ROI', 'IRR', 'NPV', 'compliance', 'audit', 'fiduciary',
      'regulatory', 'risk management', 'due diligence', 'portfolio',
      'asset allocation', 'liquidity', 'capital', 'equity', 'debt',
    ],
    focusAreas: [
      'Risk mitigation and compliance',
      'Cost reduction and efficiency',
      'Regulatory adherence',
      'Data security and privacy',
      'Audit trail and reporting',
      'Process automation',
    ],
    commonDeliverables: [
      'Financial analysis',
      'Compliance documentation',
      'Risk assessment',
      'Process documentation',
      'Training materials',
      'Audit reports',
    ],
    pricingModels: ['fixed-fee', 'hourly', 'retainer', 'success-fee', 'AUM-based'],
    complianceNotes: 'Address SEC, FINRA, SOX, PCI-DSS requirements as applicable',
  },

  healthcare: {
    terminology: [
      'HIPAA', 'EHR', 'EMR', 'patient outcomes', 'clinical workflow',
      'interoperability', 'HL7', 'FHIR', 'telehealth', 'care coordination',
      'population health', 'value-based care', 'patient engagement',
    ],
    focusAreas: [
      'Patient outcomes and safety',
      'HIPAA compliance and data security',
      'Clinical workflow optimization',
      'Interoperability and data exchange',
      'Cost reduction per patient',
      'Staff efficiency and satisfaction',
    ],
    commonDeliverables: [
      'Implementation plan',
      'Training and certification',
      'Compliance documentation',
      'Workflow optimization',
      'Integration setup',
      'Ongoing support',
    ],
    pricingModels: ['per-patient', 'subscription', 'implementation-fee', 'outcome-based'],
    complianceNotes: 'HIPAA compliance is mandatory. Consider HITECH, state regulations',
  },

  legal: {
    terminology: [
      'due diligence', 'compliance', 'liability', 'indemnification',
      'jurisdiction', 'precedent', 'discovery', 'litigation',
      'intellectual property', 'contract', 'confidentiality', 'NDA',
    ],
    focusAreas: [
      'Risk mitigation and liability',
      'Confidentiality and privilege',
      'Regulatory compliance',
      'Document management',
      'Process efficiency',
      'Cost predictability',
    ],
    commonDeliverables: [
      'Legal analysis',
      'Document drafting',
      'Contract review',
      'Compliance audit',
      'Training materials',
      'Policy documentation',
    ],
    pricingModels: ['hourly', 'fixed-fee', 'retainer', 'contingency', 'blended-rate'],
    complianceNotes: 'Address bar requirements, conflict checks, privilege considerations',
  },

  construction: {
    terminology: [
      'scope', 'specifications', 'change order', 'RFI', 'submittal',
      'punch list', 'substantial completion', 'retainage', 'bonding',
      'OSHA', 'safety', 'permits', 'inspection', 'subcontractor',
    ],
    focusAreas: [
      'Safety and compliance',
      'Budget control and cost certainty',
      'Timeline and milestone adherence',
      'Quality assurance',
      'Change order management',
      'Subcontractor coordination',
    ],
    commonDeliverables: [
      'Project plans and drawings',
      'Specifications',
      'Progress reports',
      'Safety documentation',
      'As-built drawings',
      'Warranty documentation',
    ],
    pricingModels: ['fixed-price', 'cost-plus', 'time-and-materials', 'GMP', 'unit-price'],
    complianceNotes: 'Address OSHA, local building codes, permits, bonding requirements',
  },

  education: {
    terminology: [
      'curriculum', 'assessment', 'learning outcomes', 'pedagogy',
      'LMS', 'accreditation', 'engagement', 'retention', 'accessibility',
      'differentiation', 'formative', 'summative', 'rubric', 'competency',
    ],
    focusAreas: [
      'Student outcomes and engagement',
      'Accessibility and inclusion',
      'Faculty adoption and training',
      'Assessment and measurement',
      'Accreditation alignment',
      'Budget constraints',
    ],
    commonDeliverables: [
      'Curriculum design',
      'Training programs',
      'Assessment tools',
      'Implementation plan',
      'Support documentation',
      'Progress reports',
    ],
    pricingModels: ['per-student', 'site-license', 'subscription', 'grant-funded'],
    complianceNotes: 'Consider FERPA, ADA/508 accessibility, state standards',
  },

  nonprofit: {
    terminology: [
      'mission', 'impact', 'stakeholder', 'donor', 'grant',
      'sustainability', 'outcomes', 'stewardship', 'capacity building',
      'program evaluation', 'logic model', 'theory of change',
    ],
    focusAreas: [
      'Mission alignment and impact',
      'Cost-effectiveness and efficiency',
      'Donor and stakeholder communication',
      'Sustainability and scalability',
      'Measurable outcomes',
      'Capacity building',
    ],
    commonDeliverables: [
      'Impact assessment',
      'Program design',
      'Grant documentation',
      'Training and capacity building',
      'Evaluation framework',
      'Stakeholder reports',
    ],
    pricingModels: ['grant-funded', 'reduced-rate', 'in-kind', 'sliding-scale'],
    complianceNotes: 'Consider 501(c)(3) requirements, grant restrictions, reporting obligations',
  },
};

/**
 * Get industry context for prompt injection
 */
export function getIndustryContext(industry: Industry): string {
  const preset = INDUSTRY_PRESETS[industry];

  return `Industry Context: ${industry.replace('-', ' ').toUpperCase()}

Key Terminology to Use:
${preset.terminology.slice(0, 8).join(', ')}

Focus Areas for This Industry:
${preset.focusAreas.map(f => `- ${f}`).join('\n')}

Common Deliverables:
${preset.commonDeliverables.map(d => `- ${d}`).join('\n')}

Pricing Models Common in Industry:
${preset.pricingModels.join(', ')}

${preset.complianceNotes ? `Compliance Notes: ${preset.complianceNotes}` : ''}`;
}
