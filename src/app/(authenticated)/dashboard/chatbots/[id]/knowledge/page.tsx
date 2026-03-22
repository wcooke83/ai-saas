'use client';

import { useState, useEffect, useCallback, use } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  FileText,
  Globe,
  MessageSquare,
  Type,
  Plus,
  Trash2,
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  RotateCw,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { getClient } from '@/lib/supabase/client';
import { H1 } from '@/components/ui/heading';
import type { KnowledgeSource } from '@/lib/chatbots/types';

interface KnowledgePageProps {
  params: Promise<{ id: string }>;
}

export default function KnowledgePage({ params }: KnowledgePageProps) {
  const { id } = use(params);
  const [sources, setSources] = useState<KnowledgeSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [addMode, setAddMode] = useState<'url' | 'text' | 'qa' | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [urlInput, setUrlInput] = useState('');
  const [crawlEnabled, setCrawlEnabled] = useState(false);
  const [maxPages, setMaxPages] = useState(25);
  const [textInput, setTextInput] = useState('');
  const [textName, setTextName] = useState('');
  const [qaQuestion, setQaQuestion] = useState('');
  const [qaAnswer, setQaAnswer] = useState('');

  // Confirm dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
  }>({ open: false, title: '', description: '', onConfirm: () => {} });

  const fetchSources = useCallback(async (signal?: AbortSignal) => {
    try {
      const response = await fetch(`/api/chatbots/${id}/knowledge`, { signal });
      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.error?.message || 'Failed to fetch sources');
      }
      const data = await response.json();
      const fetched: KnowledgeSource[] = data.data.sources;
      setSources(fetched);
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return;
      toast.error(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Initial fetch + Realtime subscription for knowledge source changes
  useEffect(() => {
    const controller = new AbortController();
    fetchSources(controller.signal);

    const supabase = getClient();
    const channel = supabase
      .channel(`knowledge-sources-${id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'knowledge_sources',
        filter: `chatbot_id=eq.${id}`,
      }, () => {
        fetchSources();
      })
      .subscribe();

    return () => {
      controller.abort();
      supabase.removeChannel(channel);
    };
  }, [fetchSources, id]);

  const handleAddSource = async () => {
    setSubmitting(true);

    try {
      let body: Record<string, unknown> = {};

      switch (addMode) {
        case 'url':
          if (!urlInput.trim()) throw new Error('URL is required');
          body = { type: 'url', url: urlInput.trim(), crawl: crawlEnabled, maxPages };
          break;
        case 'text':
          if (!textInput.trim()) throw new Error('Content is required');
          body = { type: 'text', content: textInput.trim(), name: textName.trim() || undefined };
          break;
        case 'qa':
          if (!qaQuestion.trim() || !qaAnswer.trim()) throw new Error('Both question and answer are required');
          body = { type: 'qa_pair', question: qaQuestion.trim(), answer: qaAnswer.trim() };
          break;
      }

      const response = await fetch(`/api/chatbots/${id}/knowledge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error?.message || 'Failed to add source');
      }

      // Reset form and refresh
      setAddMode(null);
      setUrlInput('');
      setCrawlEnabled(false);
      setMaxPages(25);
      setTextInput('');
      setTextName('');
      setQaQuestion('');
      setQaAnswer('');
      await fetchSources();
      toast.success(crawlEnabled ? 'Website crawl started — pages will appear as they are processed' : 'Knowledge source added');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to add source');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTogglePriority = async (source: KnowledgeSource) => {
    const newPriority = !source.is_priority;
    // Optimistic update
    setSources((prev) =>
      prev.map((s) => (s.id === source.id ? { ...s, is_priority: newPriority } : s))
    );
    try {
      const response = await fetch(`/api/chatbots/${id}/knowledge/${source.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_priority: newPriority }),
      });
      if (!response.ok) throw new Error('Failed to update');
      toast.success(newPriority ? 'Source pinned — always included in AI context' : 'Source unpinned');
    } catch {
      // Rollback
      setSources((prev) =>
        prev.map((s) => (s.id === source.id ? { ...s, is_priority: !newPriority } : s))
      );
      toast.error('Failed to update source priority');
    }
  };

  const confirmReprocessSource = (source: KnowledgeSource) => {
    setConfirmDialog({
      open: true,
      title: `Re-process "${source.name}"?`,
      description: 'This will delete existing chunks and re-embed with the current AI model.',
      onConfirm: () => handleReprocessSource(source),
    });
  };

  const handleReprocessSource = async (source: KnowledgeSource) => {
    // Optimistic update
    setSources((prev) =>
      prev.map((s) => (s.id === source.id ? { ...s, status: 'processing' as const } : s))
    );
    try {
      const response = await fetch(`/api/chatbots/${id}/knowledge/${source.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reprocess' }),
      });
      if (!response.ok) throw new Error('Failed to start reprocessing');
      toast.success('Re-processing started — status will update automatically');
    } catch {
      setSources((prev) =>
        prev.map((s) => (s.id === source.id ? { ...s, status: source.status } : s))
      );
      toast.error('Failed to start reprocessing');
    }
  };

  const confirmDeleteSource = (sourceId: string) => {
    setConfirmDialog({
      open: true,
      title: 'Delete knowledge source?',
      description: 'This will permanently remove this source and all its chunks. This cannot be undone.',
      onConfirm: () => handleDeleteSource(sourceId),
    });
  };

  const handleDeleteSource = async (sourceId: string) => {

    try {
      const response = await fetch(`/api/chatbots/${id}/knowledge/${sourceId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete source');
      setSources(sources.filter((s) => s.id !== sourceId));
      toast.success('Knowledge source deleted');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete source');
    }
  };

  const sourceTypeIcons = {
    document: FileText,
    url: Globe,
    qa_pair: MessageSquare,
    text: Type,
  };

  const statusStyles = {
    pending: { icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-100 dark:bg-yellow-900/30' },
    processing: { icon: Loader2, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    completed: { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/30' },
    failed: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900/30' },
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <H1 variant="dashboard">
            Knowledge Base
          </H1>
          <p className="text-secondary-600 dark:text-secondary-400 mt-1">
            Train your chatbot with custom knowledge
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => fetchSources()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Add Source Cards */}
      {!addMode && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setAddMode('url')}
            className="p-6 text-left rounded-lg border-2 border-dashed border-secondary-300 dark:border-secondary-700 hover:border-primary-500 dark:hover:border-primary-500 transition-colors"
          >
            <Globe className="w-8 h-8 text-primary-500 mb-3" />
            <h3 className="font-semibold text-secondary-900 dark:text-secondary-100">
              Add Website URL
            </h3>
            <p className="text-sm text-secondary-500 mt-1">
              Scrape content from a webpage
            </p>
          </button>

          <button
            onClick={() => setAddMode('text')}
            className="p-6 text-left rounded-lg border-2 border-dashed border-secondary-300 dark:border-secondary-700 hover:border-primary-500 dark:hover:border-primary-500 transition-colors"
          >
            <Type className="w-8 h-8 text-primary-500 mb-3" />
            <h3 className="font-semibold text-secondary-900 dark:text-secondary-100">
              Add Text Content
            </h3>
            <p className="text-sm text-secondary-500 mt-1">
              Paste text or documentation
            </p>
          </button>

          <button
            onClick={() => setAddMode('qa')}
            className="p-6 text-left rounded-lg border-2 border-dashed border-secondary-300 dark:border-secondary-700 hover:border-primary-500 dark:hover:border-primary-500 transition-colors"
          >
            <MessageSquare className="w-8 h-8 text-primary-500 mb-3" />
            <h3 className="font-semibold text-secondary-900 dark:text-secondary-100">
              Add Q&A Pair
            </h3>
            <p className="text-sm text-secondary-500 mt-1">
              Add a specific question and answer
            </p>
          </button>
        </div>
      )}

      {/* Add Form */}
      {addMode && (
        <Card>
          <CardHeader>
            <CardTitle>
              {addMode === 'url' && 'Add Website URL'}
              {addMode === 'text' && 'Add Text Content'}
              {addMode === 'qa' && 'Add Q&A Pair'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {addMode === 'url' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="url">Website URL</Label>
                  <Input
                    id="url"
                    type="url"
                    placeholder="https://example.com"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                  />
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
                      Automatically discover and import content from linked pages on the same domain.
                      Uses sitemap.xml when available, then follows links.
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
                          <span className="absolute" style={{ left: '0%' }}>5</span>
                          <span className="absolute -translate-x-1/2" style={{ left: '21.05%' }}>25</span>
                          <span className="absolute -translate-x-1/2" style={{ left: '47.37%' }}>50</span>
                          <span className="absolute -translate-x-1/2" style={{ left: '73.68%' }}>75</span>
                          <span className="absolute right-0">100</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {addMode === 'text' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="textName">Name (optional)</Label>
                  <Input
                    id="textName"
                    placeholder="e.g., Product FAQ"
                    value={textName}
                    onChange={(e) => setTextName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="textContent">Content</Label>
                  <textarea
                    id="textContent"
                    placeholder="Paste your text content here..."
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    className="w-full min-h-[200px] px-3 py-2 rounded-md border border-secondary-300 dark:border-secondary-600 text-secondary-900 dark:text-secondary-100 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-y"
                    style={{ backgroundColor: 'rgb(var(--form-element-bg))' }}
                  />
                </div>
              </>
            )}

            {addMode === 'qa' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="question">Question</Label>
                  <Input
                    id="question"
                    placeholder="What is your return policy?"
                    value={qaQuestion}
                    onChange={(e) => setQaQuestion(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="answer">Answer</Label>
                  <textarea
                    id="answer"
                    placeholder="We offer a 30-day return policy..."
                    value={qaAnswer}
                    onChange={(e) => setQaAnswer(e.target.value)}
                    className="w-full min-h-[120px] px-3 py-2 rounded-md border border-secondary-300 dark:border-secondary-600 text-secondary-900 dark:text-secondary-100 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-y"
                    style={{ backgroundColor: 'rgb(var(--form-element-bg))' }}
                  />
                </div>
              </>
            )}

            <div className="flex gap-3">
              <Button onClick={handleAddSource} disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Source
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={() => setAddMode(null)} disabled={submitting}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Source List */}
      {sources.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
            Sources ({sources.length})
          </h2>
          {sources.map((source) => {
            const TypeIcon = sourceTypeIcons[source.type];
            const status = statusStyles[source.status];
            const StatusIcon = status.icon;

            return (
              <Card key={source.id}>
                <CardContent className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-secondary-100 dark:bg-secondary-800 rounded-lg">
                      <TypeIcon className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
                    </div>
                    <div>
                      <p className="font-medium text-secondary-900 dark:text-secondary-100">
                        {source.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={status.bg}>
                          <StatusIcon className={`w-3 h-3 mr-1 ${status.color} ${source.status === 'processing' ? 'animate-spin' : ''}`} />
                          {source.status}
                        </Badge>
                        {source.chunks_count > 0 && (
                          <span className="text-xs text-secondary-500">
                            {source.chunks_count} chunks
                          </span>
                        )}
                        {source.error_message && (
                          <span className="text-xs text-red-500" title={source.error_message}>
                            Error: {source.error_message.substring(0, 50)}...
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleTogglePriority(source)}
                      className={source.is_priority
                        ? 'text-yellow-500 hover:text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
                        : 'text-secondary-400 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
                      }
                      title={source.is_priority ? 'Unpin — remove from always-included context' : 'Pin — always include in AI context'}
                    >
                      <Star className={`w-4 h-4 ${source.is_priority ? 'fill-current' : ''}`} />
                    </Button>
                    {(source.status === 'completed' || source.status === 'failed') && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => confirmReprocessSource(source)}
                        className="text-secondary-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20"
                        title="Re-process — delete chunks and re-embed with current AI model"
                      >
                        <RotateCw className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => confirmDeleteSource(source.id)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        !addMode && (
          <Card className="py-12">
            <CardContent className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-secondary-100 dark:bg-secondary-800 rounded-full flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-secondary-400" />
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
                No knowledge sources yet
              </h3>
              <p className="text-secondary-500 max-w-md">
                Add knowledge sources to train your chatbot. It will use this information to answer questions more accurately.
              </p>
            </CardContent>
          </Card>
        )
      )}

      {/* Confirm Dialog */}
      <Dialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog((prev) => ({ ...prev, open }))}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{confirmDialog.title}</DialogTitle>
            <DialogDescription>{confirmDialog.description}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setConfirmDialog((prev) => ({ ...prev, open: false }))}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setConfirmDialog((prev) => ({ ...prev, open: false }));
                confirmDialog.onConfirm();
              }}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
