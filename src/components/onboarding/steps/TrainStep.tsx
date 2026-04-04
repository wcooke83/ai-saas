'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import {
  Globe,
  Type,
  Plus,
  Loader2,
  CheckCircle,
  XCircle,
  ArrowRight,
  ChevronLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { validateUrl } from '@/lib/utils';
import { getClient } from '@/lib/supabase/client';
import { useOnboarding } from '@/components/onboarding/OnboardingContext';
import type { KnowledgeSource } from '@/lib/chatbots/types';

type SourceTab = 'url' | 'text';

export function TrainStep() {
  const { chatbotId, goToStep, completeCurrentStep, loading: contextLoading } =
    useOnboarding();

  const [sources, setSources] = useState<KnowledgeSource[]>([]);
  const [loadingSources, setLoadingSources] = useState(true);
  const [activeTab, setActiveTab] = useState<SourceTab>('url');
  const [submitting, setSubmitting] = useState(false);

  // URL form state
  const [urlInput, setUrlInput] = useState('');
  const [urlError, setUrlError] = useState<string | null>(null);
  const [crawlEnabled, setCrawlEnabled] = useState(true);
  const [maxPages, setMaxPages] = useState(25);

  // Text form state
  const [textName, setTextName] = useState('');
  const [textInput, setTextInput] = useState('');

  const fetchSources = useCallback(
    async (signal?: AbortSignal) => {
      if (!chatbotId) return;
      try {
        const res = await fetch(`/api/chatbots/${chatbotId}/knowledge`, {
          signal,
        });
        if (!res.ok) return;
        const data = await res.json();
        setSources(data.data.sources ?? []);
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
      } finally {
        setLoadingSources(false);
      }
    },
    [chatbotId]
  );

  // Initial fetch + realtime subscription
  useEffect(() => {
    if (!chatbotId) return;

    const controller = new AbortController();
    fetchSources(controller.signal);

    const supabase = getClient();
    const channel = supabase
      .channel(`onboarding-knowledge-${chatbotId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'knowledge_sources',
          filter: `chatbot_id=eq.${chatbotId}`,
        },
        () => {
          fetchSources();
        }
      )
      .subscribe();

    return () => {
      controller.abort();
      supabase.removeChannel(channel);
    };
  }, [chatbotId, fetchSources]);

  const handleAddSource = async () => {
    if (!chatbotId) return;
    setSubmitting(true);

    try {
      let body: Record<string, unknown> = {};

      if (activeTab === 'url') {
        const result = validateUrl(urlInput);
        if (!result.valid) {
          setUrlError(result.error);
          setSubmitting(false);
          return;
        }
        body = { type: 'url', url: result.url, crawl: crawlEnabled, maxPages };
      } else {
        if (!textInput.trim()) {
          toast.error('Please paste some text content before adding.');
          setSubmitting(false);
          return;
        }
        body = {
          type: 'text',
          content: textInput.trim(),
          name: textName.trim() || undefined,
        };
      }

      const res = await fetch(`/api/chatbots/${chatbotId}/knowledge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error?.message || 'Could not add that source. Please try again.');
      }

      // Reset form
      setUrlInput('');
      setUrlError(null);
      setTextName('');
      setTextInput('');
      await fetchSources();
      toast.success(
        activeTab === 'url' && crawlEnabled
          ? 'Website crawl started'
          : 'Knowledge source added'
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not add that source. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    completeCurrentStep();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
          Train it on your content
        </h2>
        <p className="mt-1 text-secondary-500 dark:text-secondary-400">
          Add a source and your chatbot will learn from it immediately.
        </p>
      </div>

      {/* Source type tabs */}
      <div className="space-y-4">
        <div className="flex gap-2" role="tablist" aria-label="Source type">
          <button
            type="button"
            role="tab"
            id="tab-url"
            aria-selected={activeTab === 'url'}
            aria-controls="tabpanel-url"
            onClick={() => setActiveTab('url')}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 text-sm font-medium motion-safe:transition-all',
              activeTab === 'url'
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                : 'border-secondary-200 dark:border-secondary-700 text-secondary-600 dark:text-secondary-400 hover:border-secondary-300 dark:hover:border-secondary-600'
            )}
            style={
              activeTab !== 'url'
                ? { backgroundColor: 'rgb(var(--card-bg))' }
                : undefined
            }
          >
            <Globe className="w-4 h-4" aria-hidden="true" />
            Add a URL
          </button>
          <button
            type="button"
            role="tab"
            id="tab-text"
            aria-selected={activeTab === 'text'}
            aria-controls="tabpanel-text"
            onClick={() => setActiveTab('text')}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 text-sm font-medium motion-safe:transition-all',
              activeTab === 'text'
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                : 'border-secondary-200 dark:border-secondary-700 text-secondary-600 dark:text-secondary-400 hover:border-secondary-300 dark:hover:border-secondary-600'
            )}
            style={
              activeTab !== 'text'
                ? { backgroundColor: 'rgb(var(--card-bg))' }
                : undefined
            }
          >
            <Type className="w-4 h-4" aria-hidden="true" />
            Paste text
          </button>
        </div>

        {/* URL form */}
        {activeTab === 'url' && (
          <Card role="tabpanel" id="tabpanel-url" aria-labelledby="tab-url">
            <CardHeader>
              <CardTitle className="text-base">Import from a website <span className="font-normal text-sm text-secondary-400 dark:text-secondary-500">-- we&apos;ll read and organize the content automatically</span></CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="url-input">Website URL</Label>
                <Input
                  id="url-input"
                  type="text"
                  placeholder="https://yoursite.com/support"
                  value={urlInput}
                  onChange={(e) => {
                    setUrlInput(e.target.value);
                    setUrlError(null);
                  }}
                  className={urlError ? 'border-red-500 focus:ring-red-500' : ''}
                />
                {urlError && (
                  <p className="text-sm text-red-500">{urlError}</p>
                )}
                <p className="text-xs text-secondary-500">
                  https:// will be added automatically if not included
                </p>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg border border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-800/50">
                <input
                  id="crawl-toggle"
                  type="checkbox"
                  checked={crawlEnabled}
                  onChange={(e) => setCrawlEnabled(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-secondary-300 text-primary-500 focus:ring-primary-500"
                />
                <div className="flex-1">
                  <Label htmlFor="crawl-toggle" className="font-medium cursor-pointer">
                    Crawl linked pages
                  </Label>
                  <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-0.5">
                    Automatically discover and import content from linked pages
                    on the same domain.
                  </p>

                  {crawlEnabled && (
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="max-pages" className="text-sm">
                          Max pages
                        </Label>
                        <span className="text-sm font-medium text-primary-500">
                          {maxPages}
                        </span>
                      </div>
                      <input
                        id="max-pages"
                        type="range"
                        min={5}
                        max={100}
                        step={5}
                        value={maxPages}
                        onChange={(e) => setMaxPages(Number(e.target.value))}
                        className="w-full h-2 bg-secondary-200 dark:bg-secondary-700 rounded-lg appearance-none cursor-pointer accent-primary-500"
                      />
                      <div className="relative h-4 text-xs text-secondary-400">
                        <span className="absolute" style={{ left: '0%' }}>
                          5
                        </span>
                        <span
                          className="absolute -translate-x-1/2"
                          style={{ left: '21.05%' }}
                        >
                          25
                        </span>
                        <span
                          className="absolute -translate-x-1/2"
                          style={{ left: '47.37%' }}
                        >
                          50
                        </span>
                        <span
                          className="absolute -translate-x-1/2"
                          style={{ left: '73.68%' }}
                        >
                          75
                        </span>
                        <span className="absolute right-0">100</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <Button onClick={handleAddSource} disabled={submitting || !urlInput.trim()}>
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 motion-safe:animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Website
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Text form */}
        {activeTab === 'text' && (
          <Card role="tabpanel" id="tabpanel-text" aria-labelledby="tab-text">
            <CardHeader>
              <CardTitle className="text-base">Paste text content <span className="font-normal text-sm text-secondary-400 dark:text-secondary-500">-- FAQs, product info, policies, or anything else</span></CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="text-name">Name (optional)</Label>
                <Input
                  id="text-name"
                  placeholder="e.g., Product FAQ"
                  value={textName}
                  onChange={(e) => setTextName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="text-content">Content</Label>
                <Textarea
                  id="text-content"
                  placeholder="Paste your FAQs, product info, or any text you want the chatbot to know..."
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  className="min-h-[160px] resize-y"
                />
              </div>
              <Button
                onClick={handleAddSource}
                disabled={submitting || !textInput.trim()}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 motion-safe:animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Text
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Source list -- aria-live so screen readers announce status changes */}
      {sources.length > 0 && (
        <div className="space-y-3" aria-live="polite" aria-relevant="additions text">
          <h3 className="text-sm font-semibold text-secondary-700 dark:text-secondary-300 uppercase tracking-wide">
            Knowledge sources ({sources.length})
          </h3>
          {/* Visually hidden status summary for screen readers */}
          <p className="sr-only">
            {(() => {
              const completed = sources.filter((s) => s.status === 'completed').length;
              const processing = sources.filter((s) => s.status === 'processing' || s.status === 'pending').length;
              const failed = sources.filter((s) => s.status === 'failed').length;
              const parts: string[] = [];
              if (completed > 0) parts.push(`${completed} completed`);
              if (processing > 0) parts.push(`${processing} processing`);
              if (failed > 0) parts.push(`${failed} failed`);
              return `${sources.length} sources: ${parts.join(', ')}.`;
            })()}
          </p>
          <div className="space-y-2">
            {sources.map((source) => (
              <div
                key={source.id}
                className="flex items-center gap-3 px-4 py-3 rounded-lg border border-secondary-200 dark:border-secondary-700"
                style={{ backgroundColor: 'rgb(var(--card-bg))' }}
              >
                <SourceStatusIcon status={source.status} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100 truncate">
                    {source.name}
                  </p>
                  {source.status === 'failed' && source.error_message && (
                    <p className="text-xs text-red-500 mt-0.5 truncate">
                      {source.error_message}
                    </p>
                  )}
                </div>
                <span
                  className={cn(
                    'text-xs font-medium capitalize',
                    source.status === 'completed' && 'text-green-600 dark:text-green-400',
                    source.status === 'processing' && 'text-blue-600 dark:text-blue-400',
                    source.status === 'pending' && 'text-yellow-600 dark:text-yellow-400',
                    source.status === 'failed' && 'text-red-600 dark:text-red-400'
                  )}
                >
                  {source.status === 'processing' ? 'Reading your content… this takes about 30 seconds.' : source.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex flex-col gap-3 pt-2 border-t border-secondary-200 dark:border-secondary-700 sm:flex-row sm:items-center sm:justify-between">
        <Button variant="ghost" onClick={() => goToStep(1)} className="self-start">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back
        </Button>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:gap-4">
          <button
            type="button"
            onClick={handleNext}
            disabled={contextLoading}
            className="text-sm text-center text-secondary-500 dark:text-secondary-400 hover:text-secondary-700 dark:hover:text-secondary-200 motion-safe:transition-colors"
          >
            I&apos;ll add knowledge later
          </button>
          <Button onClick={handleNext} disabled={contextLoading} size="lg" className="w-full sm:w-auto">
            {contextLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 motion-safe:animate-spin" />
                Saving...
              </>
            ) : (
              <>
                Next: Test your chatbot
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

function SourceStatusIcon({ status }: { status: string }) {
  switch (status) {
    case 'completed':
      return <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />;
    case 'failed':
      return <XCircle className="w-5 h-5 text-red-500 shrink-0" />;
    case 'processing':
    case 'pending':
      return <Loader2 className="w-5 h-5 text-blue-500 motion-safe:animate-spin shrink-0" />;
    default:
      return null;
  }
}
