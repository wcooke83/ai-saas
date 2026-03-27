'use client';

import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import {
  Loader2, Globe, Plus, Check, X, Pencil, Clock, ChevronDown, ChevronUp,
  ListChecks, Link2, Trash2, RefreshCw, Save,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { validateUrl } from '@/lib/utils';

interface ExtractionPrompt {
  id: string;
  question: string;
  enabled: boolean;
  sort_order: number;
  schedule: string; // 'inherit' | 'manual' | 'daily' | 'weekly' | 'monthly'
  last_generated_at: string | null;
}

type Schedule = 'manual' | 'daily' | 'weekly' | 'monthly';
type PromptSchedule = 'inherit' | Schedule;

const SCHEDULE_LABELS: Record<string, string> = {
  inherit: 'Inherit',
  manual: 'Manual',
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
};

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
  const [urlError, setUrlError] = useState<string | null>(null);
  const [savedUrls, setSavedUrls] = useState<string[]>([]);
  const [generatingFromUrl, setGeneratingFromUrl] = useState(false);
  const [generatingFromKnowledge, setGeneratingFromKnowledge] = useState(false);

  // Extraction prompts state
  const [prompts, setPrompts] = useState<ExtractionPrompt[]>([]);
  const [promptsLoading, setPromptsLoading] = useState(true);
  const [newPromptInput, setNewPromptInput] = useState('');
  const [addingPrompt, setAddingPrompt] = useState(false);
  const [editingPromptId, setEditingPromptId] = useState<string | null>(null);
  const [editingPromptText, setEditingPromptText] = useState('');
  const [savingPromptId, setSavingPromptId] = useState<string | null>(null);
  const [deletingPromptId, setDeletingPromptId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [showPrompts, setShowPrompts] = useState(false);

  // Schedule state
  const [schedule, setSchedule] = useState<Schedule>('manual');
  const [lastGeneratedAt, setLastGeneratedAt] = useState<string | null>(null);
  const [updatingSchedule, setUpdatingSchedule] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);

  // Ref to prevent onBlur save when clicking cancel
  const cancelClickRef = useRef(false);

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
        if (data.data.sourceUrls) setSavedUrls(data.data.sourceUrls);
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
    const result = validateUrl(urlInput);
    if (!result.valid) {
      setUrlError(result.error);
      return;
    }
    setGeneratingFromUrl(true);
    try {
      const res = await fetch(`/api/chatbots/${chatbotId}/articles/generate-from-url`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: result.url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'Failed');
      toast.success(data.data?.message || 'Articles generated from URL');
      setUrlInput('');
      setUrlError(null);
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
    setAddingPrompt(true);
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
      toast.success('Prompt added');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to add prompt');
    } finally {
      setAddingPrompt(false);
    }
  };

  const togglePrompt = async (promptId: string, enabled: boolean) => {
    // Optimistic update
    setPrompts(prev => prev.map(p => p.id === promptId ? { ...p, enabled } : p));
    try {
      const res = await fetch(`/api/chatbots/${chatbotId}/articles/prompts/${promptId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled }),
      });
      if (!res.ok) throw new Error('Failed');
      toast.success(enabled ? 'Prompt enabled' : 'Prompt disabled');
    } catch {
      // Rollback
      setPrompts(prev => prev.map(p => p.id === promptId ? { ...p, enabled: !enabled } : p));
      toast.error('Failed to update prompt');
    }
  };

  const savePromptEdit = async (promptId: string) => {
    if (!editingPromptText.trim()) return;
    // Check if text actually changed
    const original = prompts.find(p => p.id === promptId);
    if (original && original.question === editingPromptText.trim()) {
      setEditingPromptId(null);
      return;
    }
    setSavingPromptId(promptId);
    try {
      const res = await fetch(`/api/chatbots/${chatbotId}/articles/prompts/${promptId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: editingPromptText.trim() }),
      });
      if (!res.ok) throw new Error('Failed');
      setPrompts(prev => prev.map(p => p.id === promptId ? { ...p, question: editingPromptText.trim() } : p));
      setEditingPromptId(null);
      toast.success('Prompt updated');
    } catch {
      toast.error('Failed to update prompt');
    } finally {
      setSavingPromptId(null);
    }
  };

  const handleEditBlur = (promptId: string) => {
    // Small delay to check if cancel was clicked
    setTimeout(() => {
      if (cancelClickRef.current) {
        cancelClickRef.current = false;
        return;
      }
      if (editingPromptId === promptId && editingPromptText.trim()) {
        savePromptEdit(promptId);
      }
    }, 150);
  };

  const handleCancelEdit = () => {
    cancelClickRef.current = true;
    setEditingPromptId(null);
    setEditingPromptText('');
  };

  const deletePrompt = async (promptId: string) => {
    setDeletingPromptId(promptId);
    try {
      const res = await fetch(`/api/chatbots/${chatbotId}/articles/prompts/${promptId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed');
      setPrompts(prev => prev.filter(p => p.id !== promptId));
      toast.success('Prompt deleted');
    } catch {
      toast.error('Failed to delete prompt');
    } finally {
      setDeletingPromptId(null);
      setConfirmDeleteId(null);
    }
  };

  const updatePromptSchedule = async (promptId: string, newSchedule: PromptSchedule) => {
    // Optimistic update
    setPrompts(prev => prev.map(p => p.id === promptId ? { ...p, schedule: newSchedule } : p));
    try {
      const res = await fetch(`/api/chatbots/${chatbotId}/articles/prompts/${promptId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ schedule: newSchedule }),
      });
      if (!res.ok) throw new Error('Failed');
      toast.success(`Prompt schedule set to ${SCHEDULE_LABELS[newSchedule].toLowerCase()}`);
    } catch {
      // Rollback
      const original = prompts.find(p => p.id === promptId);
      if (original) {
        setPrompts(prev => prev.map(p => p.id === promptId ? { ...p, schedule: original.schedule } : p));
      }
      toast.error('Failed to update prompt schedule');
    }
  };

  // --- Schedule Actions ---

  const updateSchedule = async (newSchedule: Schedule) => {
    setUpdatingSchedule(true);
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
    } finally {
      setUpdatingSchedule(false);
    }
  };

  const enabledPromptsCount = prompts.filter(p => p.enabled).length;
  const promptsWithActiveSchedule = prompts.filter(p => {
    if (p.schedule === 'inherit') return schedule !== 'manual';
    return p.schedule !== 'manual';
  }).length;

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
            Generate Articles from URL
          </CardTitle>
          <CardDescription className="text-xs">
            AI generates structured help articles from a website, then adds them to your knowledge base.
            This is a one-time extraction &mdash; to keep content updated automatically, add the URL as a knowledge source instead.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                placeholder="example.com or https://example.com"
                value={urlInput}
                onChange={e => { setUrlInput(e.target.value); setUrlError(null); }}
                onKeyDown={e => e.key === 'Enter' && generateFromUrl()}
                disabled={isGenerating}
                className={`flex-1 ${urlError ? 'border-red-500 focus:ring-red-500' : ''}`}
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
            {urlError && (
              <p className="text-sm text-red-500">{urlError}</p>
            )}
          </div>
        </CardContent>
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
                <Badge variant="outline" className={`text-xs ml-1 ${
                  schedule === 'manual' && promptsWithActiveSchedule > 0
                    ? 'text-blue-600 dark:text-blue-400 border-blue-300 dark:border-blue-700'
                    : ''
                }`}>
                  {schedule === 'manual'
                    ? promptsWithActiveSchedule > 0
                      ? `${promptsWithActiveSchedule} prompt${promptsWithActiveSchedule !== 1 ? 's' : ''} scheduled`
                      : 'Off'
                    : schedule.charAt(0).toUpperCase() + schedule.slice(1)
                  }
                </Badge>
              </CardTitle>
              <CardDescription className="text-xs mt-1">
                Default schedule for all prompts. Individual prompts can override this with their own schedule.
              </CardDescription>
            </div>
            {showSchedule ? <ChevronUp className="w-4 h-4 text-secondary-400" /> : <ChevronDown className="w-4 h-4 text-secondary-400" />}
          </div>
        </CardHeader>
        {showSchedule && (
          <CardContent className="pt-0">
            <div className="space-y-3">
              <div>
                <Label className="text-xs mb-1.5 block">Default Regeneration Frequency</Label>
                <div className="flex items-center gap-2">
                  <Select
                    value={schedule}
                    onChange={e => updateSchedule(e.target.value as Schedule)}
                    disabled={updatingSchedule}
                    options={[
                      { value: 'manual', label: 'Manual only' },
                      { value: 'daily', label: 'Daily' },
                      { value: 'weekly', label: 'Weekly' },
                      { value: 'monthly', label: 'Monthly' },
                    ]}
                  />
                  {updatingSchedule && <Loader2 className="w-4 h-4 animate-spin text-secondary-400" />}
                </div>
              </div>
              {lastGeneratedAt && (
                <p className="text-xs text-secondary-500">
                  Last generated: {new Date(lastGeneratedAt).toLocaleString()}
                </p>
              )}
              {schedule !== 'manual' ? (
                <p className="text-xs text-secondary-400">
                  All prompts set to &ldquo;Use default&rdquo; will regenerate on a {schedule} basis.
                  Individual prompts can override this in their schedule dropdown.
                </p>
              ) : (
                <p className="text-xs text-secondary-400">
                  Prompts set to &ldquo;Use default&rdquo; will not regenerate automatically.
                  {promptsWithActiveSchedule > 0 && (
                    <span className="text-blue-500 dark:text-blue-400">
                      {' '}{promptsWithActiveSchedule} prompt{promptsWithActiveSchedule !== 1 ? 's have' : ' has'} {promptsWithActiveSchedule !== 1 ? 'their' : 'its'} own schedule and will still run.
                    </span>
                  )}
                </p>
              )}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Extraction Prompts */}
      <Card>
        <CardHeader
          className="pb-3 cursor-pointer select-none"
          onClick={() => {
            // Prevent collapse while editing
            if (editingPromptId) return;
            setShowPrompts(!showPrompts);
          }}
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
                Questions to extract targeted articles from your content. Each prompt generates one focused article.
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
                      disabled={!!savingPromptId || !!deletingPromptId}
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
                            if (e.key === 'Escape') handleCancelEdit();
                          }}
                          onBlur={() => handleEditBlur(prompt.id)}
                          disabled={savingPromptId === prompt.id}
                          className="h-8 text-xs"
                          autoFocus
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          onClick={() => savePromptEdit(prompt.id)}
                          disabled={savingPromptId === prompt.id}
                        >
                          {savingPromptId === prompt.id
                            ? <Loader2 className="w-3 h-3 animate-spin" />
                            : <Check className="w-3 h-3" />
                          }
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          onMouseDown={() => { cancelClickRef.current = true; }}
                          onClick={handleCancelEdit}
                          disabled={savingPromptId === prompt.id}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <span className={`flex-1 text-sm ${!prompt.enabled ? 'text-secondary-400 line-through' : ''}`}>
                          {prompt.question}
                        </span>

                        {/* Per-prompt schedule indicator */}
                        {prompt.schedule !== 'inherit' ? (
                          <Badge
                            variant="outline"
                            className="text-[10px] px-1.5 py-0 h-5 text-blue-600 dark:text-blue-400 border-blue-300 dark:border-blue-700"
                          >
                            <Clock className="w-2.5 h-2.5 mr-0.5" />
                            {SCHEDULE_LABELS[prompt.schedule]}
                          </Badge>
                        ) : (
                          <span className="text-[10px] text-secondary-400 flex items-center gap-0.5">
                            <Clock className="w-2.5 h-2.5" />
                            {schedule === 'manual' ? 'Manual' : schedule.charAt(0).toUpperCase() + schedule.slice(1)}
                          </span>
                        )}

                        <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          {/* Schedule dropdown */}
                          <select
                            value={prompt.schedule || 'inherit'}
                            onChange={e => updatePromptSchedule(prompt.id, e.target.value as PromptSchedule)}
                            onClick={e => e.stopPropagation()}
                            className="h-7 text-[10px] rounded border border-secondary-200 dark:border-secondary-700 bg-transparent px-1 text-secondary-500 hover:text-secondary-700 dark:hover:text-secondary-300 cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary-500"
                            title="Set schedule for this prompt"
                          >
                            <option value="inherit">{`Use default (${schedule === 'manual' ? 'Manual' : schedule.charAt(0).toUpperCase() + schedule.slice(1)})`}</option>
                            <option value="manual">Manual only</option>
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                          </select>

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

                          {confirmDeleteId === prompt.id ? (
                            <div className="flex items-center gap-0.5">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                onClick={() => deletePrompt(prompt.id)}
                                disabled={deletingPromptId === prompt.id}
                              >
                                {deletingPromptId === prompt.id
                                  ? <Loader2 className="w-3 h-3 animate-spin" />
                                  : <Check className="w-3 h-3" />
                                }
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 w-7 p-0"
                                onClick={() => setConfirmDeleteId(null)}
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 w-7 p-0 text-red-500 hover:text-red-600"
                              onClick={() => setConfirmDeleteId(prompt.id)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                ))}

                {/* Add new prompt */}
                <div className="flex gap-2 mt-3 pt-3 border-t border-secondary-100 dark:border-secondary-800">
                  <Input
                    placeholder={'Add a custom extraction question...'}
                    value={newPromptInput}
                    onChange={e => setNewPromptInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addPrompt()}
                    disabled={addingPrompt}
                    className="flex-1 h-8 text-xs"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8"
                    onClick={addPrompt}
                    disabled={!newPromptInput.trim() || addingPrompt}
                  >
                    {addingPrompt
                      ? <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                      : <Plus className="w-3 h-3 mr-1" />
                    }
                    {addingPrompt ? 'Adding...' : 'Add'}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  );
}
