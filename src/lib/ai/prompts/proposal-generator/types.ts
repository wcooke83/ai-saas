/**
 * Proposal Generator Prompt Types
 */

import type { ProposalType, Industry, SectionType, ProposalTone } from '@/types/proposal';

export interface SectionPromptConfig {
  guidance: string;
  maxWords: number;
  required: boolean;
}

export interface IndustryPreset {
  terminology: string[];
  focusAreas: string[];
  commonDeliverables: string[];
  pricingModels: string[];
  complianceNotes?: string;
}

export interface TypeGuidance {
  description: string;
  keyFocus: string[];
  mustInclude: string[];
  avoid: string[];
}

export interface ToneGuidance {
  style: string;
  language: string;
  examples: string;
}

export type SectionPrompts = Record<SectionType, SectionPromptConfig>;
export type IndustryPresets = Record<Industry, IndustryPreset>;
export type TypeGuidanceMap = Record<ProposalType, TypeGuidance>;
export type ToneGuidanceMap = Record<ProposalTone, ToneGuidance>;
