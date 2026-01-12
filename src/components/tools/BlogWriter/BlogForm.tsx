'use client';

import { useId } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, FileText, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BlogPostInput, PostFormat, BlogTone, WordCountPreset } from '@/lib/ai/prompts/blog-writer';
import { POST_FORMATS, BLOG_TONES, WORD_COUNT_PRESETS } from '@/lib/ai/prompts/blog-writer';

interface BlogFormProps {
  input: BlogPostInput;
  isLoading: boolean;
  onUpdateInput: (updates: Partial<BlogPostInput>) => void;
  onSetFormat: (format: PostFormat) => void;
  onSetTone: (tone: BlogTone) => void;
  onSetWordCountPreset: (preset: WordCountPreset) => void;
  onGenerateOutline: () => void;
  className?: string;
}

export function BlogForm({
  input,
  isLoading,
  onUpdateInput,
  onSetFormat,
  onSetTone,
  onSetWordCountPreset,
  onGenerateOutline,
  className,
}: BlogFormProps) {
  const formId = useId();
  const formatId = `${formId}-format`;
  const toneId = `${formId}-tone`;
  const topicId = `${formId}-topic`;
  const audienceId = `${formId}-audience`;
  const keywordsId = `${formId}-keywords`;
  const wordCountId = `${formId}-word-count`;
  const customWordCountId = `${formId}-custom-word-count`;
  const instructionsId = `${formId}-instructions`;

  const isFormValid = input.topic.length >= 10;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary-500" aria-hidden="true" />
          Blog Post Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Format & Tone */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label
              htmlFor={formatId}
              className="text-sm font-medium text-secondary-700 dark:text-secondary-300"
            >
              Post Format
            </label>
            <Select
              id={formatId}
              options={POST_FORMATS.map((f) => ({ value: f.value, label: f.label }))}
              value={input.format}
              onChange={(e) => onSetFormat(e.target.value as PostFormat)}
            />
            <p className="text-xs text-secondary-500 dark:text-secondary-400">
              {POST_FORMATS.find((f) => f.value === input.format)?.description}
            </p>
          </div>
          <div className="space-y-2">
            <label
              htmlFor={toneId}
              className="text-sm font-medium text-secondary-700 dark:text-secondary-300"
            >
              Tone
            </label>
            <Select
              id={toneId}
              options={BLOG_TONES.map((t) => ({ value: t.value, label: t.label }))}
              value={input.tone}
              onChange={(e) => onSetTone(e.target.value as BlogTone)}
            />
          </div>
        </div>

        {/* Topic */}
        <div className="space-y-2">
          <label
            htmlFor={topicId}
            className="text-sm font-medium text-secondary-700 dark:text-secondary-300"
          >
            Topic <span className="text-red-500">*</span>
            <span className="ml-1 text-xs text-secondary-500 dark:text-secondary-400 font-normal">
              (min 10 characters)
            </span>
          </label>
          <Textarea
            id={topicId}
            placeholder="e.g., How to improve email open rates for SaaS companies"
            rows={3}
            value={input.topic}
            onChange={(e) => onUpdateInput({ topic: e.target.value })}
            aria-required="true"
            aria-describedby={`${topicId}-hint`}
          />
          <p id={`${topicId}-hint`} className="text-xs text-secondary-500 dark:text-secondary-400">
            {input.topic.length}/10 characters minimum
          </p>
        </div>

        {/* Target Audience */}
        <div className="space-y-2">
          <label
            htmlFor={audienceId}
            className="text-sm font-medium text-secondary-700 dark:text-secondary-300"
          >
            Target Audience
            <span className="ml-1 text-xs text-secondary-500 dark:text-secondary-400 font-normal">
              (optional)
            </span>
          </label>
          <Input
            id={audienceId}
            placeholder="e.g., Marketing managers at B2B SaaS companies"
            value={input.targetAudience || ''}
            onChange={(e) => onUpdateInput({ targetAudience: e.target.value })}
          />
        </div>

        {/* Target Keywords */}
        <div className="space-y-2">
          <label
            htmlFor={keywordsId}
            className="text-sm font-medium text-secondary-700 dark:text-secondary-300"
          >
            SEO Keywords
            <span className="ml-1 text-xs text-secondary-500 dark:text-secondary-400 font-normal">
              (optional, comma-separated)
            </span>
          </label>
          <Input
            id={keywordsId}
            placeholder="e.g., email marketing, open rates, subject lines"
            value={input.targetKeywords || ''}
            onChange={(e) => onUpdateInput({ targetKeywords: e.target.value })}
          />
        </div>

        {/* Word Count */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
            Target Word Count
          </label>
          <div className="grid gap-2 sm:grid-cols-4">
            {WORD_COUNT_PRESETS.map((preset) => (
              <button
                key={preset.value}
                type="button"
                onClick={() => onSetWordCountPreset(preset.value)}
                className={cn(
                  'px-3 py-2 text-sm rounded-md border transition-colors',
                  'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                  input.wordCountPreset === preset.value
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                    : 'border-secondary-200 dark:border-secondary-700 hover:bg-secondary-50 dark:hover:bg-secondary-800 text-secondary-700 dark:text-secondary-300'
                )}
                aria-pressed={input.wordCountPreset === preset.value}
              >
                {preset.label}
              </button>
            ))}
          </div>
          {input.wordCountPreset === 'custom' && (
            <div className="mt-2">
              <label
                htmlFor={customWordCountId}
                className="sr-only"
              >
                Custom word count
              </label>
              <Input
                id={customWordCountId}
                type="number"
                min={300}
                max={5000}
                placeholder="Enter word count (300-5000)"
                value={input.customWordCount || ''}
                onChange={(e) => onUpdateInput({ customWordCount: Number(e.target.value) || undefined })}
              />
            </div>
          )}
        </div>

        {/* Additional Instructions */}
        <div className="space-y-2">
          <label
            htmlFor={instructionsId}
            className="text-sm font-medium text-secondary-700 dark:text-secondary-300"
          >
            Additional Instructions
            <span className="ml-1 text-xs text-secondary-500 dark:text-secondary-400 font-normal">
              (optional)
            </span>
          </label>
          <Textarea
            id={instructionsId}
            placeholder="e.g., Include statistics from recent studies, mention our product as a solution..."
            rows={2}
            value={input.additionalInstructions || ''}
            onChange={(e) => onUpdateInput({ additionalInstructions: e.target.value })}
          />
        </div>

        {/* Generate Button */}
        <Button
          onClick={onGenerateOutline}
          disabled={!isFormValid || isLoading}
          className="w-full"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
              Generating Outline...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" aria-hidden="true" />
              Generate Outline
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
