'use client';

import { useId } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Loader2,
  List,
  Sparkles,
  ArrowLeft,
  Plus,
  Trash2,
  GripVertical,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { GeneratedOutline, OutlineSection } from '@/lib/ai/prompts/blog-writer';

interface OutlineEditorProps {
  outline: GeneratedOutline;
  isLoading: boolean;
  onUpdateOutline: (updates: Partial<GeneratedOutline>) => void;
  onUpdateSection: (sectionId: string, updates: Partial<OutlineSection>) => void;
  onAddSection: () => void;
  onRemoveSection: (sectionId: string) => void;
  onReorderSections: (startIndex: number, endIndex: number) => void;
  onGeneratePost: () => void;
  onGoBack: () => void;
  className?: string;
}

export function OutlineEditor({
  outline,
  isLoading,
  onUpdateOutline,
  onUpdateSection,
  onAddSection,
  onRemoveSection,
  onReorderSections,
  onGeneratePost,
  onGoBack,
  className,
}: OutlineEditorProps) {
  const formId = useId();
  const titleId = `${formId}-title`;
  const metaId = `${formId}-meta`;

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < outline.sections.length) {
      onReorderSections(index, newIndex);
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Title & Meta Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <List className="h-5 w-5 text-primary-500" aria-hidden="true" />
            Post Outline
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Title Selection */}
          <div className="space-y-2">
            <label
              htmlFor={titleId}
              className="text-sm font-medium text-secondary-700 dark:text-secondary-300"
            >
              Title
            </label>
            <Input
              id={titleId}
              value={outline.suggestedTitle}
              onChange={(e) => onUpdateOutline({ suggestedTitle: e.target.value })}
            />
            {outline.alternativeTitles.length > 0 && (
              <div className="space-y-1">
                <p className="text-xs text-secondary-500 dark:text-secondary-400">
                  Alternative titles (click to use):
                </p>
                <div className="flex flex-wrap gap-2">
                  {outline.alternativeTitles.map((title, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => onUpdateOutline({ suggestedTitle: title })}
                      className="text-xs px-2 py-1 rounded bg-secondary-100 dark:bg-secondary-800 hover:bg-secondary-200 dark:hover:bg-secondary-700 text-secondary-700 dark:text-secondary-300 transition-colors"
                    >
                      {title}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Meta Description */}
          <div className="space-y-2">
            <label
              htmlFor={metaId}
              className="text-sm font-medium text-secondary-700 dark:text-secondary-300"
            >
              Meta Description
              <span className="ml-1 text-xs text-secondary-500 dark:text-secondary-400 font-normal">
                ({outline.metaDescription.length}/160 characters)
              </span>
            </label>
            <Textarea
              id={metaId}
              rows={2}
              value={outline.metaDescription}
              onChange={(e) => onUpdateOutline({ metaDescription: e.target.value })}
              maxLength={160}
            />
          </div>
        </CardContent>
      </Card>

      {/* Sections */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">
              Sections ({outline.sections.length})
            </CardTitle>
            <Button variant="outline" size="sm" onClick={onAddSection}>
              <Plus className="h-4 w-4 mr-1" aria-hidden="true" />
              Add Section
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {outline.sections.map((section, index) => (
            <SectionCard
              key={section.id}
              section={section}
              index={index}
              totalSections={outline.sections.length}
              onUpdate={(updates) => onUpdateSection(section.id, updates)}
              onRemove={() => onRemoveSection(section.id)}
              onMoveUp={() => moveSection(index, 'up')}
              onMoveDown={() => moveSection(index, 'down')}
            />
          ))}

          {outline.sections.length === 0 && (
            <p className="text-sm text-secondary-500 dark:text-secondary-400 text-center py-4">
              No sections. Click &quot;Add Section&quot; to add one.
            </p>
          )}

          {/* Estimated Total */}
          <div className="pt-2 border-t border-secondary-200 dark:border-secondary-700">
            <p className="text-sm text-secondary-600 dark:text-secondary-400">
              Estimated total:{' '}
              <span className="font-medium text-secondary-900 dark:text-secondary-100">
                {outline.sections.reduce((sum, s) => sum + s.estimatedWords, 0)} words
              </span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={onGoBack} disabled={isLoading}>
          <ArrowLeft className="h-4 w-4 mr-2" aria-hidden="true" />
          Back to Input
        </Button>
        <Button
          onClick={onGeneratePost}
          disabled={isLoading || outline.sections.length === 0}
          className="flex-1"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
              Generating Post...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" aria-hidden="true" />
              Generate Full Post
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

// Section Card Component
interface SectionCardProps {
  section: OutlineSection;
  index: number;
  totalSections: number;
  onUpdate: (updates: Partial<OutlineSection>) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

function SectionCard({
  section,
  index,
  totalSections,
  onUpdate,
  onRemove,
  onMoveUp,
  onMoveDown,
}: SectionCardProps) {
  const sectionId = useId();

  const handleKeyPointsChange = (value: string) => {
    const keyPoints = value
      .split('\n')
      .map((line) => line.replace(/^[-•]\s*/, '').trim())
      .filter(Boolean);
    onUpdate({ keyPoints });
  };

  return (
    <div className="rounded-lg border border-secondary-200 dark:border-secondary-700 p-4 space-y-3">
      <div className="flex items-start gap-3">
        {/* Reorder Controls */}
        <div className="flex flex-col gap-1">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={index === 0}
            className="p-1 rounded hover:bg-secondary-100 dark:hover:bg-secondary-800 disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Move section up"
          >
            <ChevronUp className="h-4 w-4" aria-hidden="true" />
          </button>
          <GripVertical className="h-4 w-4 text-secondary-400 mx-auto" aria-hidden="true" />
          <button
            type="button"
            onClick={onMoveDown}
            disabled={index === totalSections - 1}
            className="p-1 rounded hover:bg-secondary-100 dark:hover:bg-secondary-800 disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Move section down"
          >
            <ChevronDown className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {/* Section Content */}
        <div className="flex-1 space-y-3">
          {/* Title */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-secondary-500 dark:text-secondary-400 w-6">
              {index + 1}.
            </span>
            <Input
              id={`${sectionId}-title`}
              value={section.title}
              onChange={(e) => onUpdate({ title: e.target.value })}
              placeholder="Section title"
              className="flex-1"
            />
            <Input
              id={`${sectionId}-words`}
              type="number"
              min={50}
              max={2000}
              value={section.estimatedWords}
              onChange={(e) => onUpdate({ estimatedWords: Number(e.target.value) || 100 })}
              className="w-24"
              aria-label="Estimated words"
            />
            <span className="text-xs text-secondary-500 dark:text-secondary-400">words</span>
          </div>

          {/* Key Points */}
          <div className="space-y-1">
            <label
              htmlFor={`${sectionId}-points`}
              className="text-xs text-secondary-500 dark:text-secondary-400"
            >
              Key points (one per line)
            </label>
            <Textarea
              id={`${sectionId}-points`}
              rows={2}
              value={section.keyPoints.map((p) => `• ${p}`).join('\n')}
              onChange={(e) => handleKeyPointsChange(e.target.value)}
              placeholder="• First key point&#10;• Second key point"
              className="text-sm"
            />
          </div>
        </div>

        {/* Delete Button */}
        <button
          type="button"
          onClick={onRemove}
          className="p-2 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-secondary-400 hover:text-red-500 transition-colors"
          aria-label="Remove section"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
