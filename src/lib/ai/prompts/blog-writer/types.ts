/**
 * Blog Post Writer Types
 * Type definitions for blog post generation
 */

// Post formats
export type PostFormat =
  | 'listicle'
  | 'how-to'
  | 'thought-leadership'
  | 'tutorial'
  | 'review'
  | 'case-study';

export const POST_FORMATS: { value: PostFormat; label: string; description: string }[] = [
  { value: 'listicle', label: 'Listicle', description: 'Top 10, Best Of, numbered lists' },
  { value: 'how-to', label: 'How-To Guide', description: 'Step-by-step instructions' },
  { value: 'thought-leadership', label: 'Thought Leadership', description: 'Industry insights and opinions' },
  { value: 'tutorial', label: 'Technical Tutorial', description: 'In-depth educational content' },
  { value: 'review', label: 'Product/Service Review', description: 'Detailed analysis and recommendations' },
  { value: 'case-study', label: 'Case Study', description: 'Real-world examples and results' },
];

// Tones
export type BlogTone =
  | 'professional'
  | 'conversational'
  | 'expert'
  | 'friendly'
  | 'persuasive'
  | 'educational';

export const BLOG_TONES: { value: BlogTone; label: string }[] = [
  { value: 'professional', label: 'Professional' },
  { value: 'conversational', label: 'Conversational' },
  { value: 'expert', label: 'Expert/Authoritative' },
  { value: 'friendly', label: 'Friendly & Approachable' },
  { value: 'persuasive', label: 'Persuasive' },
  { value: 'educational', label: 'Educational' },
];

// Word count presets
export type WordCountPreset = 'short' | 'medium' | 'long' | 'custom';

export const WORD_COUNT_PRESETS: { value: WordCountPreset; label: string; words: number }[] = [
  { value: 'short', label: 'Short (~500 words)', words: 500 },
  { value: 'medium', label: 'Medium (~1000 words)', words: 1000 },
  { value: 'long', label: 'Long (~1500+ words)', words: 1500 },
  { value: 'custom', label: 'Custom', words: 0 },
];

// Outline section
export interface OutlineSection {
  id: string;
  title: string;
  keyPoints: string[];
  estimatedWords: number;
}

// Form input
export interface BlogPostInput {
  format: PostFormat;
  tone: BlogTone;
  topic: string;
  targetAudience?: string;
  targetKeywords?: string;
  wordCountPreset: WordCountPreset;
  customWordCount?: number;
  additionalInstructions?: string;
}

// Generated outline
export interface GeneratedOutline {
  suggestedTitle: string;
  alternativeTitles: string[];
  metaDescription: string;
  sections: OutlineSection[];
  estimatedTotalWords: number;
}

// Generated post
export interface GeneratedBlogPost {
  title: string;
  metaDescription: string;
  suggestedTitleTags: string[];
  content: string;
  wordCount: number;
}

// API request types
export interface BlogOutlineRequest {
  mode: 'outline';
  format: PostFormat;
  tone: BlogTone;
  topic: string;
  targetAudience?: string;
  targetKeywords?: string;
  wordCount: number;
  additionalInstructions?: string;
}

export interface BlogFullPostRequest {
  mode: 'full';
  format: PostFormat;
  tone: BlogTone;
  topic: string;
  targetAudience?: string;
  targetKeywords?: string;
  wordCount: number;
  additionalInstructions?: string;
  outline: GeneratedOutline;
}

export type BlogApiRequest = BlogOutlineRequest | BlogFullPostRequest;

// Helper to get word count from input
export function getTargetWordCount(input: BlogPostInput): number {
  if (input.wordCountPreset === 'custom' && input.customWordCount) {
    return input.customWordCount;
  }
  const preset = WORD_COUNT_PRESETS.find((p) => p.value === input.wordCountPreset);
  return preset?.words || 1000;
}
