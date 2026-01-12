'use client';

import { cn } from '@/lib/utils';
import { useBlogPostState } from './hooks/useBlogPostState';
import { BlogForm } from './BlogForm';
import { OutlineEditor } from './OutlineEditor';
import { BlogPreview } from './BlogPreview';
import { Badge } from '@/components/ui/badge';

interface BlogWriterProps {
  className?: string;
  apiEndpoint?: string;
  apiKey?: string;
  onGenerate?: (result: { title: string; content: string }) => void;
}

export function BlogWriter({
  className,
  apiEndpoint = '/api/tools/blog-writer',
  apiKey,
  onGenerate,
}: BlogWriterProps) {
  const state = useBlogPostState(apiEndpoint);

  // Call onGenerate callback when post is generated
  const handleGeneratePost = async () => {
    await state.generatePost(apiKey);
    if (state.post && onGenerate) {
      onGenerate({ title: state.post.title, content: state.post.content });
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Step Indicator */}
      <StepIndicator currentStep={state.step} />

      {/* Step Content */}
      {state.step === 'input' && (
        <BlogForm
          input={state.input}
          isLoading={state.isGeneratingOutline}
          onUpdateInput={state.updateInput}
          onSetFormat={state.setFormat}
          onSetTone={state.setTone}
          onSetWordCountPreset={state.setWordCountPreset}
          onGenerateOutline={() => state.generateOutline(apiKey)}
        />
      )}

      {state.step === 'outline' && state.outline && (
        <OutlineEditor
          outline={state.outline}
          isLoading={state.isGeneratingPost}
          onUpdateOutline={state.updateOutline}
          onUpdateSection={state.updateOutlineSection}
          onAddSection={state.addOutlineSection}
          onRemoveSection={state.removeOutlineSection}
          onReorderSections={state.reorderOutlineSections}
          onGeneratePost={handleGeneratePost}
          onGoBack={state.goBack}
        />
      )}

      {state.step === 'preview' && state.post && (
        <BlogPreview
          post={state.post}
          onGoBack={state.goBack}
          onReset={state.reset}
        />
      )}
    </div>
  );
}

// Step Indicator Component
function StepIndicator({ currentStep }: { currentStep: 'input' | 'outline' | 'preview' }) {
  const steps = [
    { key: 'input', label: 'Details', number: 1 },
    { key: 'outline', label: 'Outline', number: 2 },
    { key: 'preview', label: 'Preview', number: 3 },
  ];

  const currentIndex = steps.findIndex((s) => s.key === currentStep);

  return (
    <div className="flex items-center justify-center gap-2">
      {steps.map((step, index) => {
        const isActive = step.key === currentStep;
        const isCompleted = index < currentIndex;

        return (
          <div key={step.key} className="flex items-center">
            {index > 0 && (
              <div
                className={cn(
                  'w-8 h-0.5 mx-2',
                  isCompleted || isActive
                    ? 'bg-primary-500'
                    : 'bg-secondary-200 dark:bg-secondary-700'
                )}
              />
            )}
            <Badge
              variant={isActive ? 'default' : isCompleted ? 'default' : 'outline'}
              className={cn(
                'gap-1.5',
                !isActive && !isCompleted && 'opacity-50'
              )}
            >
              <span
                className={cn(
                  'flex h-5 w-5 items-center justify-center rounded-full text-xs',
                  isActive
                    ? 'bg-white text-primary-600'
                    : isCompleted
                      ? 'bg-primary-600 text-white'
                      : 'bg-secondary-200 dark:bg-secondary-700 text-secondary-600 dark:text-secondary-400'
                )}
              >
                {isCompleted ? '✓' : step.number}
              </span>
              {step.label}
            </Badge>
          </div>
        );
      })}
    </div>
  );
}

// Re-export for convenience
export { useBlogPostState } from './hooks/useBlogPostState';
