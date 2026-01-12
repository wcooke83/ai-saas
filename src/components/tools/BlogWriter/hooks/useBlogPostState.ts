'use client';

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import type {
  BlogPostInput,
  GeneratedOutline,
  GeneratedBlogPost,
  OutlineSection,
  PostFormat,
  BlogTone,
  WordCountPreset,
} from '@/lib/ai/prompts/blog-writer';
import { getTargetWordCount } from '@/lib/ai/prompts/blog-writer';

// ===================
// TYPES
// ===================

export type BlogWriterStep = 'input' | 'outline' | 'preview';

export interface BlogPostState {
  step: BlogWriterStep;
  input: BlogPostInput;
  outline: GeneratedOutline | null;
  post: GeneratedBlogPost | null;
  isGeneratingOutline: boolean;
  isGeneratingPost: boolean;
}

export interface BlogPostActions {
  updateInput: (updates: Partial<BlogPostInput>) => void;
  setFormat: (format: PostFormat) => void;
  setTone: (tone: BlogTone) => void;
  setWordCountPreset: (preset: WordCountPreset) => void;
  generateOutline: (apiKey?: string) => Promise<void>;
  updateOutline: (updates: Partial<GeneratedOutline>) => void;
  updateOutlineSection: (sectionId: string, updates: Partial<OutlineSection>) => void;
  addOutlineSection: () => void;
  removeOutlineSection: (sectionId: string) => void;
  reorderOutlineSections: (startIndex: number, endIndex: number) => void;
  generatePost: (apiKey?: string) => Promise<void>;
  goToStep: (step: BlogWriterStep) => void;
  goBack: () => void;
  reset: () => void;
}

// ===================
// INITIAL STATE
// ===================

const initialInput: BlogPostInput = {
  format: 'how-to',
  tone: 'professional',
  topic: '',
  targetAudience: '',
  targetKeywords: '',
  wordCountPreset: 'medium',
  customWordCount: undefined,
  additionalInstructions: '',
};

// ===================
// HOOK
// ===================

export function useBlogPostState(
  apiEndpoint = '/api/tools/blog-writer'
): BlogPostState & BlogPostActions {
  const [step, setStep] = useState<BlogWriterStep>('input');
  const [input, setInput] = useState<BlogPostInput>(initialInput);
  const [outline, setOutline] = useState<GeneratedOutline | null>(null);
  const [post, setPost] = useState<GeneratedBlogPost | null>(null);
  const [isGeneratingOutline, setIsGeneratingOutline] = useState(false);
  const [isGeneratingPost, setIsGeneratingPost] = useState(false);

  // ===================
  // INPUT UPDATES
  // ===================

  const updateInput = useCallback((updates: Partial<BlogPostInput>) => {
    setInput((prev) => ({ ...prev, ...updates }));
  }, []);

  const setFormat = useCallback((format: PostFormat) => {
    setInput((prev) => ({ ...prev, format }));
  }, []);

  const setTone = useCallback((tone: BlogTone) => {
    setInput((prev) => ({ ...prev, tone }));
  }, []);

  const setWordCountPreset = useCallback((preset: WordCountPreset) => {
    setInput((prev) => ({
      ...prev,
      wordCountPreset: preset,
      customWordCount: preset === 'custom' ? prev.customWordCount || 1000 : undefined,
    }));
  }, []);

  // ===================
  // OUTLINE GENERATION
  // ===================

  const generateOutline = useCallback(
    async (apiKey?: string) => {
      setIsGeneratingOutline(true);

      try {
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };

        if (apiKey) {
          headers['X-API-Key'] = apiKey;
        }

        const wordCount = getTargetWordCount(input);

        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            mode: 'outline',
            format: input.format,
            tone: input.tone,
            topic: input.topic,
            targetAudience: input.targetAudience || undefined,
            targetKeywords: input.targetKeywords || undefined,
            wordCount,
            additionalInstructions: input.additionalInstructions || undefined,
          }),
        });

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error?.message || 'Failed to generate outline');
        }

        setOutline(data.data.outline);
        setStep('outline');
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsGeneratingOutline(false);
      }
    },
    [apiEndpoint, input]
  );

  // ===================
  // OUTLINE EDITING
  // ===================

  const updateOutline = useCallback((updates: Partial<GeneratedOutline>) => {
    setOutline((prev) => (prev ? { ...prev, ...updates } : null));
  }, []);

  const updateOutlineSection = useCallback((sectionId: string, updates: Partial<OutlineSection>) => {
    setOutline((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        sections: prev.sections.map((s) => (s.id === sectionId ? { ...s, ...updates } : s)),
      };
    });
  }, []);

  const addOutlineSection = useCallback(() => {
    setOutline((prev) => {
      if (!prev) return null;
      const newId = String(Math.max(...prev.sections.map((s) => Number(s.id) || 0), 0) + 1);
      return {
        ...prev,
        sections: [
          ...prev.sections,
          {
            id: newId,
            title: 'New Section',
            keyPoints: [],
            estimatedWords: 100,
          },
        ],
      };
    });
  }, []);

  const removeOutlineSection = useCallback((sectionId: string) => {
    setOutline((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        sections: prev.sections.filter((s) => s.id !== sectionId),
      };
    });
  }, []);

  const reorderOutlineSections = useCallback((startIndex: number, endIndex: number) => {
    setOutline((prev) => {
      if (!prev) return null;
      const sections = [...prev.sections];
      const [removed] = sections.splice(startIndex, 1);
      sections.splice(endIndex, 0, removed);
      return { ...prev, sections };
    });
  }, []);

  // ===================
  // POST GENERATION
  // ===================

  const generatePost = useCallback(
    async (apiKey?: string) => {
      if (!outline) {
        toast.error('No outline available');
        return;
      }

      setIsGeneratingPost(true);

      try {
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };

        if (apiKey) {
          headers['X-API-Key'] = apiKey;
        }

        const wordCount = getTargetWordCount(input);

        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            mode: 'full',
            format: input.format,
            tone: input.tone,
            topic: input.topic,
            targetAudience: input.targetAudience || undefined,
            targetKeywords: input.targetKeywords || undefined,
            wordCount,
            additionalInstructions: input.additionalInstructions || undefined,
            outline,
          }),
        });

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error?.message || 'Failed to generate blog post');
        }

        setPost(data.data.post);
        setStep('preview');
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsGeneratingPost(false);
      }
    },
    [apiEndpoint, input, outline]
  );

  // ===================
  // NAVIGATION
  // ===================

  const goToStep = useCallback((newStep: BlogWriterStep) => {
    setStep(newStep);
  }, []);

  const goBack = useCallback(() => {
    if (step === 'preview') {
      setStep('outline');
    } else if (step === 'outline') {
      setStep('input');
    }
  }, [step]);

  // ===================
  // RESET
  // ===================

  const reset = useCallback(() => {
    setStep('input');
    setInput(initialInput);
    setOutline(null);
    setPost(null);
  }, []);

  return {
    // State
    step,
    input,
    outline,
    post,
    isGeneratingOutline,
    isGeneratingPost,
    // Actions
    updateInput,
    setFormat,
    setTone,
    setWordCountPreset,
    generateOutline,
    updateOutline,
    updateOutlineSection,
    addOutlineSection,
    removeOutlineSection,
    reorderOutlineSections,
    generatePost,
    goToStep,
    goBack,
    reset,
  };
}
