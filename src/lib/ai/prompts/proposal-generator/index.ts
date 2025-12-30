/**
 * Proposal Generator Prompts
 * Central exports for all proposal-related prompts and utilities
 */

// Types
export type {
  SectionPromptConfig,
  IndustryPreset,
  TypeGuidance,
  ToneGuidance,
} from './types';

// Section definitions
export {
  SECTION_PROMPTS,
  DEFAULT_SECTIONS_BY_TYPE,
  ALL_SECTIONS,
} from './sections';

// Industry presets
export {
  INDUSTRY_PRESETS,
  getIndustryContext,
} from './industry-presets';

// Type and tone guidance
export {
  TYPE_GUIDANCE,
  TONE_GUIDANCE,
  getTypeGuidance,
  getToneGuidance,
} from './section-prompts';

// Prompt builders
export {
  PROPOSAL_SYSTEM_PROMPT,
  buildProposalPrompt,
  buildSectionRegenerationPrompt,
} from './build-prompt';
