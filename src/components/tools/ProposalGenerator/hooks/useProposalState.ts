'use client';

import { useState, useCallback } from 'react';
import type {
  ProposalInput,
  ProposalSection,
  ProposalType,
  Industry,
  ProposalTone,
  SectionType,
} from '@/types/proposal';
import { DEFAULT_SECTIONS_BY_TYPE } from '@/lib/ai/prompts/proposal-generator';

// ===================
// INITIAL STATE
// ===================

const initialInput: ProposalInput = {
  proposalType: 'project',
  industry: 'tech-saas',
  title: '',
  clientName: '',
  clientCompany: '',
  clientRole: '',
  senderName: '',
  senderCompany: '',
  senderRole: '',
  senderEmail: '',
  projectDescription: '',
  objectives: '',
  timeline: '',
  budget: '',
  constraints: '',
  competitiveAdvantage: '',
  previousWork: '',
  additionalNotes: '',
  tone: 'professional',
  selectedSections: DEFAULT_SECTIONS_BY_TYPE['project'],
};

// ===================
// HOOK
// ===================

export interface ProposalState {
  input: ProposalInput;
  sections: ProposalSection[];
  isGenerating: boolean;
  regeneratingSection: string | null;
  error: string | null;
  hasGenerated: boolean;
}

export interface ProposalActions {
  updateInput: (updates: Partial<ProposalInput>) => void;
  setProposalType: (type: ProposalType) => void;
  generateProposal: (apiKey?: string) => Promise<void>;
  regenerateSection: (sectionId: string, instructions?: string, apiKey?: string) => Promise<void>;
  updateSectionContent: (sectionId: string, content: string) => void;
  toggleSection: (sectionId: string) => void;
  reorderSections: (startIndex: number, endIndex: number) => void;
  toggleSectionSelection: (sectionType: SectionType) => void;
  resetProposal: () => void;
  clearError: () => void;
}

export function useProposalState(apiEndpoint = '/api/tools/proposal-generator'): ProposalState & ProposalActions {
  const [input, setInput] = useState<ProposalInput>(initialInput);
  const [sections, setSections] = useState<ProposalSection[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [regeneratingSection, setRegeneratingSection] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasGenerated, setHasGenerated] = useState(false);

  // ===================
  // INPUT UPDATES
  // ===================

  const updateInput = useCallback((updates: Partial<ProposalInput>) => {
    setInput(prev => ({ ...prev, ...updates }));
  }, []);

  const setProposalType = useCallback((type: ProposalType) => {
    setInput(prev => ({
      ...prev,
      proposalType: type,
      selectedSections: DEFAULT_SECTIONS_BY_TYPE[type],
    }));
  }, []);

  const toggleSectionSelection = useCallback((sectionType: SectionType) => {
    setInput(prev => {
      const current = prev.selectedSections;
      const isSelected = current.includes(sectionType);

      return {
        ...prev,
        selectedSections: isSelected
          ? current.filter(s => s !== sectionType)
          : [...current, sectionType],
      };
    });
  }, []);

  // ===================
  // GENERATION
  // ===================

  const generateProposal = useCallback(async (apiKey?: string) => {
    setIsGenerating(true);
    setError(null);

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (apiKey) {
        headers['X-API-Key'] = apiKey;
      }

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(input),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error?.message || 'Failed to generate proposal');
      }

      setSections(data.data.sections);
      setHasGenerated(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsGenerating(false);
    }
  }, [apiEndpoint, input]);

  const regenerateSection = useCallback(async (
    sectionId: string,
    instructions?: string,
    apiKey?: string
  ) => {
    const section = sections.find(s => s.id === sectionId);
    if (!section) return;

    setRegeneratingSection(sectionId);
    setError(null);

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (apiKey) {
        headers['X-API-Key'] = apiKey;
      }

      const response = await fetch(`${apiEndpoint}/section`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          sectionType: section.type,
          context: {
            proposalType: input.proposalType,
            industry: input.industry,
            clientName: input.clientName,
            clientCompany: input.clientCompany,
            senderName: input.senderName,
            senderCompany: input.senderCompany,
            projectDescription: input.projectDescription,
            objectives: input.objectives,
            tone: input.tone,
          },
          existingSections: sections.map(s => ({
            type: s.type,
            content: s.content,
          })),
          instructions,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error?.message || 'Failed to regenerate section');
      }

      setSections(prev => prev.map(s =>
        s.id === sectionId
          ? { ...s, content: data.data.content, isEdited: false }
          : s
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setRegeneratingSection(null);
    }
  }, [apiEndpoint, input, sections]);

  // ===================
  // SECTION MANAGEMENT
  // ===================

  const updateSectionContent = useCallback((sectionId: string, content: string) => {
    setSections(prev => prev.map(s =>
      s.id === sectionId
        ? { ...s, content, isEdited: true }
        : s
    ));
  }, []);

  const toggleSection = useCallback((sectionId: string) => {
    setSections(prev => prev.map(s =>
      s.id === sectionId && !s.isRequired
        ? { ...s, isEnabled: !s.isEnabled }
        : s
    ));
  }, []);

  const reorderSections = useCallback((startIndex: number, endIndex: number) => {
    setSections(prev => {
      const result = [...prev];
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);

      return result.map((s, i) => ({ ...s, order: i }));
    });
  }, []);

  // ===================
  // RESET
  // ===================

  const resetProposal = useCallback(() => {
    setInput(initialInput);
    setSections([]);
    setError(null);
    setHasGenerated(false);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    input,
    sections,
    isGenerating,
    regeneratingSection,
    error,
    hasGenerated,
    // Actions
    updateInput,
    setProposalType,
    generateProposal,
    regenerateSection,
    updateSectionContent,
    toggleSection,
    reorderSections,
    toggleSectionSelection,
    resetProposal,
    clearError,
  };
}
