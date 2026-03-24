'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  Loader2, Globe, Plus, Check, X, Pencil, Clock, ChevronDown, ChevronUp,
  ListChecks, Link2, Trash2, RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';

interface ExtractionPrompt {
  id: string;
  question: string;
  enabled: boolean;
  sort_order: number;
}

type Schedule = 'manual' | 'daily' | 'weekly' | 'monthly';

interface ArticleGenerationProps {
  chatbotId: string;
  /** Called after articles are generated so the parent can refresh its data */
  onGenerated?: () => void;
  /** Show the "Generate from Knowledge" button */
  showKnowledgeGenerate?: boolean;
  /** Compact mode hides section titles for embedding in other pages */
  compact?: boolean;
}

export function ArticleGeneration({
  chatbotId,
  onGenerated,
  showKnowledgeGenerate = false,
  compact = false,
}: ArticleGenerationProps) {
  // URL generation state
  const [urlInput, setUrlInput] = useState('');
  const [generatingFromUrl, setGeneratingFromUrl] = useState(false);
  const [generatingFromKnowledge, setGeneratingFromKnowledge] = useState(false);

  // Extraction prompts state
  const [prompts, setPrompts] = useState<ExtractionPrompt[]>([]);
  const [promptsLoading, setPromptsLoading] = useState(true);
  const [newPromptInput, setNewPromptInput] = useState('');
  const [editingPromptId, setEditingPromptId] = useState<string | null>(null);
  const [editingPromptText, setEditingPromptText] = useState('');
  const [showPrompts, setShowPrompts] = useState(false);

  // Schedule state
  const [schedule, setSchedule] = useState<Schedule>('manual');
  const [lastGeneratedAt, setLastGeneratedAt] = useState<string | null>(null);
  const [showSchedule, setShowSchedule] = useState(false);

  const isGenerating = generatingFromUrl || generatingFromKnowledge;

  // --- Data Fetching ---

  const fetchPrompts = async () => {
    setPromptsLoading(true);
    try {
      const res = await fetch(`/api/chatbots/${chatbotId}/articles/prompts`);
      const data = await res.json();
      if (data.success) setPrompts(data.data.prompts);
    } catch {
      toast.error('Failed to load extraction prompts');
    } finally {
      setPromptsLoading(false);
    }
  };

  const fetchSchedule = async () => {
    try {
      const res = await fetch(`/api/chatbots/${chatbotId}/articles/schedule`);
      const data = await res.json();
      if (data.success) {
        setSchedule(data.data.schedule || 'manual');
        setLastGeneratedAt(data.data.lastGeneratedAt);
      }
    } catch {
      // non-critical
    }
  };

  useEffect(() => {
    fetchPrompts();
    fetchSchedule();
  }, [chatbotId]);

  // --- Generation Actions ---

  const generateFromKnowledge = async () => {
    setGeneratingFromKnowledge(true);
    try {
      const res = await fetch(`/api/chatbots/${chatbotId}/articles/generate`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'Failed');
      toast.success(data.data?.message || 'Articles generated');
      fetchSchedule();
      onGenerated?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to generate');
    } finally {
      setGeneratingFromKnowledge(false);
    }
  };

  const generateFromUrl = async () => {
    if (!urlInput.trim()) return;
    setGeneratingFromUrl(true);
    try {
      const res = await fetch(`/api/chatbots/${chatbotId}/articles/generate-from-url`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlInput.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'Failed');
      toast.success(data.data?.message || 'Articles generated from URL');
      setUrlInput('');
      fetchSchedule();
      onGenerated?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to generate from URL');
    } finally {
      setGeneratingFromUrl(false);
    }
  };

  // --- Extraction Prompt Actions ---

  const addPrompt = async () => {
    if (!newPromptInput.trim()) return;
    try {
      const res = await fetch(`/api/chatbots/${chatbotId}/articles/prompts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: newPromptInput.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'Failed');
      setPrompts(prev => [...prev, data.data.prompt]);
      setNewPromptInput('');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to add prompt');
    }
  };

  const togglePrompt = async (promptId: string, enabled: boolean) => {
    try {
      const res = await fetch(`/api/chatbots/${chatbotId}/articles/prompts/${promptId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled }),
      });
      if (!res.ok) throw new Error('Failed');
      setPrompts(prev => prev.map(p => p.id === promptId ? { ...p, enabled } : p));
    } catch {
      toast.error('Failed to update prompt');
    }
  };

  const savePromptEdit = async (promptId: string) => {
    if (!editingPromptText.trim()) return;
    try {
      const res = await fetch(`/api/chatbots/${chatbotId}/articles/prompts/${promptId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: editingPromptText.trim() }),
      });
      if (!res.ok) throw new Error('Failed');
      setPrompts(prev => prev.map(p => p.id === promptId ? { ...p, question: editingPromptText.trim() } : p));
      setEditingPromptId(null);
    } catch {
      toast.error('Failed to update prompt');
    }
  };

  const deletePrompt = async (promptId: string) => {
    try {
      const res = await fetch(`/api/chatbots/${chatbotId}/articles/prompts/${promptId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed');
      setPrompts(prev => prev.filter(p => p.id !== promptId));
    } catch {
      toast.error('Failed to delete prompt');
    }
  };

  // --- Schedule Actions ---

  const updateSchedule = async (newSchedule: Schedule) => {
    try {
      const res = await fetch(`/api/chatbots/${chatbotId}/articles/schedule`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ article_schedule: newSchedule }),
      });
      if (!res.ok) throw new Error('Failed');
      setSchedule(newSchedule);
      toast.success(`Schedule updated to ${newSchedule}`);
    } catch {
      toast.error('Failed to update schedule');
    }
  };

  const enabledPromptsCount = prompts.filter(p => p.enabled).length;

  return (
    <div className="space-y-4">
      {/* Generate from Knowledge button */}
      {showKnowledgeGenerate && (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={generateFromKnowledge}
            disabled={isGenerating}
          >
            {generatingFromKnowledge ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
            {generatingFromKnowledge ? 'Generating...' : 'Generate from Knowledge'}
          </Button>
        </div>
      )}

      {/* Generate from URL */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Generate from Website URL
          </CardTitle>
          <CardDescription className="text-xs">
            Scrape a website and generate articles that are added to your knowledge base
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="https://example.com"
              value={urlInput}
              onChange={e => setUrlInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && generateFromUrl()}
              disabled={isGenerating}
              className="flex-1"
            />
            <Button
              size="sm"
              onClick={generateFromUrl}
              disabled={isGenerating || !urlInput.trim()}
            >
              {generatingFromUrl ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Link2 className="w-4 h-4 mr-2" />}
              {generatingFromUrl ? 'Scraping...' : 'Generate'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Extraction Prompts */}
      <Card>
        <CardHeader
          className="pb-3 cursor-pointer select-none"
          onClick={() => setShowPrompts(!showPrompts)}
        >
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm flex items-center gap-2">
                <ListChecks className="w-4 h-4" />
                Extraction Prompts
                <Badge variant="outline" className="text-xs ml-1">
                  {enabledPromptsCount}/{prompts.length} active
                </Badge>
              </CardTitle>
              <CardDescription className="text-xs mt-1">
                Questions to extract targeted articles from your content
              </CardDescription>
            </div>
            {showPrompts ? <ChevronUp className="w-4 h-4 text-secondary-400" /> : <ChevronDown className="w-4 h-4 text-secondary-400" />}
          </div>
        </CardHeader>
        {showPrompts && (
          <CardContent className="pt-0">
            {promptsLoading ? (
              <div className="flex justify-center py-4"><Loader2 className="w-5 h-5 animate-spin text-secondary-400" /></div>
            ) : (
              <div className="space-y-2">
                {prompts.map((prompt) => (
                  <div key={prompt.id} className="flex items-center gap-2 group">
                    <button
                      onClick={() => togglePrompt(prompt.id, !prompt.enabled)}
                      className={`flex-shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                        prompt.enabled
                          ? 'bg-primary-600 border-primary-600 text-white'
                          : 'border-secondary-300 dark:border-secondary-600 hover:border-primary-400'
                      }`}
                    >
                      {prompt.enabled && <Check className="w-3 h-3" />}
                    </button>

                    {editingPromptId === prompt.id ? (
                      <div className="flex-1 flex gap-1">
                        <Input
                          value={editingPromptText}
                          onChange={e => setEditingPromptText(e.target.value)}
                          onKeyDown={e => {
                            if (e.key === 'Enter') savePromptEdit(prompt.id);
                            if (e.key === 'Escape') setEditingPromptId(null);
                          }}
                          className="h-8 text-xs"
                          autoFocus
                        />
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => savePromptEdit(prompt.id)}>
                          <Check className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => setEditingPromptId(null)}>
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <span className={`flex-1 text-sm ${!prompt.enabled ? 'text-secondary-400 line-through' : ''}`}>
                          {prompt.question}
                        </span>
                        <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0"
                            onClick={() => {
                              setEditingPromptId(prompt.id);
                              setEditingPromptText(prompt.question);
                            }}
                          >
                            <Pencil className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0 text-red-500 hover:text-red-600"
                            onClick={() => deletePrompt(prompt.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ))}

                {/* Add new prompt */}
                <div className="flex gap-2 mt-3 pt-3 border-t border-secondary-100 dark:border-secondary-800">
                  <Input
                    placeholder="Add a custom question, e.g. &quot;Do you offer group discounts?&quot;"
                    value={newPromptInput}
                    onChange={e => setNewPromptInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addPrompt()}
                    className="flex-1 h-8 text-xs"
                  />
                  <Button size="sm" variant="outline" className="h-8" onClick={addPrompt} disabled={!newPromptInput.trim()}>
                    <Plus className="w-3 h-3 mr-1" /> Add
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* Schedule Settings */}
      <Card>
        <CardHeader
          className="pb-3 cursor-pointer select-none"
          onClick={() => setShowSchedule(!showSchedule)}
        >
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Auto-Regeneration Schedule
                <Badge variant="outline" className="text-xs ml-1">
                  {schedule === 'manual' ? 'Off' : schedule}
                </Badge>
              </CardTitle>
              <CardDescription className="text-xs mt-1">
                Automatically regenerate articles to keep content up to date
              </CardDescription>
            </div>
            {showSchedule ? <ChevronUp className="w-4 h-4 text-secondary-400" /> : <ChevronDown className="w-4 h-4 text-secondary-400" />}
          </div>
        </CardHeader>
        {showSchedule && (
          <CardContent className="pt-0">
            <div className="space-y-3">
              <div>
                <Label className="text-xs mb-1.5 block">Regeneration Frequency</Label>
                <Select
                  value={schedule}
                  onChange={e => updateSchedule(e.target.value as Schedule)}
                  options={[
                    { value: 'manual', label: 'Manual only' },
                    { value: 'daily', label: 'Daily' },
                    { value: 'weekly', label: 'Weekly' },
                    { value: 'monthly', label: 'Monthly' },
                  ]}
                />
              </div>
              {lastGeneratedAt && (
                <p className="text-xs text-secondary-500">
                  Last generated: {new Date(lastGeneratedAt).toLocaleString()}
                </p>
              )}
              {schedule !== 'manual' && (
                <p className="text-xs text-secondary-400">
                  Articles will be regenerated from knowledge sources and website URLs on a {schedule} basis.
                  New articles are created as drafts for your review and added to the knowledge base.
                </p>
              )}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
