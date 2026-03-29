'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { H1 } from '@/components/ui/heading';
import { WEBHOOK_EVENTS } from '@/lib/sdk/webhook';
import {
  Plus,
  Trash2,
  Copy,
  Check,
  AlertTriangle,
  Webhook,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface WebhookRow {
  id: string;
  url: string;
  events: string[] | null;
  is_active: boolean | null;
  last_triggered_at: string | null;
  failure_count: number | null;
  created_at: string | null;
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

function truncateUrl(url: string, maxLen = 52): string {
  if (url.length <= maxLen) return url;
  return url.slice(0, maxLen) + '…';
}

const ALL_EVENTS = Object.keys(WEBHOOK_EVENTS) as (keyof typeof WEBHOOK_EVENTS)[];

export default function WebhooksPage() {
  const [webhooks, setWebhooks] = useState<WebhookRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formUrl, setFormUrl] = useState('');
  const [formEvents, setFormEvents] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [newSecret, setNewSecret] = useState<string | null>(null);
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchWebhooks();
  }, []);

  const fetchWebhooks = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/webhooks');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'Failed to load webhooks');
      setWebhooks(data.data.webhooks);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to load webhooks');
    } finally {
      setLoading(false);
    }
  };

  const toggleEvent = (event: string) => {
    setFormEvents((prev) =>
      prev.includes(event) ? prev.filter((e) => e !== event) : [...prev, event]
    );
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formUrl.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/webhooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: formUrl.trim(), events: formEvents }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'Failed to create webhook');

      setNewSecret(data.data.webhook.secret);
      setWebhooks((prev) => [data.data.webhook, ...prev]);
      setFormUrl('');
      setFormEvents([]);
      setShowForm(false);
      toast.success('Webhook created');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to create webhook');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (webhook: WebhookRow) => {
    setTogglingId(webhook.id);
    try {
      const res = await fetch(`/api/webhooks/${webhook.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !webhook.is_active }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'Failed to update webhook');

      setWebhooks((prev) =>
        prev.map((wh) => (wh.id === webhook.id ? data.data.webhook : wh))
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update webhook');
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this webhook? This cannot be undone.')) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/webhooks/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'Failed to delete webhook');

      setWebhooks((prev) => prev.filter((wh) => wh.id !== id));
      toast.success('Webhook deleted');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete webhook');
    } finally {
      setDeletingId(null);
    }
  };

  const copySecret = async () => {
    if (!newSecret) return;
    await navigator.clipboard.writeText(newSecret);
    setCopiedSecret(true);
    setTimeout(() => setCopiedSecret(false), 2000);
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-100 dark:bg-primary-900/50 rounded-lg">
            <Webhook className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <H1 variant="dashboard">Webhooks</H1>
            <p className="text-secondary-600 dark:text-secondary-400">Receive real-time HTTP notifications when events happen in your chatbots</p>
          </div>
        </div>
        <Button onClick={() => setShowForm((v) => !v)} className="flex items-center gap-2">
          {showForm ? <ChevronUp className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? 'Cancel' : 'Add Webhook'}
        </Button>
      </div>

      {/* New secret banner — shown once after creation */}
      {newSecret && (
        <Card className="border-amber-300 dark:border-amber-600 bg-amber-50 dark:bg-amber-900/20">
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                  Save this secret now — it will not be shown again
                </p>
                <p className="mt-1 text-xs text-amber-700 dark:text-amber-400">
                  Use it to verify incoming webhook signatures via HMAC-SHA256.
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <code className="flex-1 px-3 py-2 text-xs font-mono bg-amber-100 dark:bg-amber-900/40 border border-amber-200 dark:border-amber-700 rounded-md truncate">
                    {newSecret}
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copySecret}
                    className="flex-shrink-0 flex items-center gap-1.5"
                  >
                    {copiedSecret ? (
                      <><Check className="w-3.5 h-3.5" /> Copied</>
                    ) : (
                      <><Copy className="w-3.5 h-3.5" /> Copy</>
                    )}
                  </Button>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setNewSecret(null)}
                className="text-amber-500 hover:text-amber-700 dark:hover:text-amber-300 text-lg leading-none"
                aria-label="Dismiss"
              >
                &times;
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">New Webhook</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="webhook-url">Endpoint URL</Label>
                <Input
                  id="webhook-url"
                  type="url"
                  placeholder="https://your-server.com/webhook"
                  value={formUrl}
                  onChange={(e) => setFormUrl(e.target.value)}
                  required
                />
                <p className="text-xs text-secondary-500">Must be an HTTPS URL.</p>
              </div>

              <div className="space-y-2">
                <Label>Events</Label>
                <p className="text-xs text-secondary-500">
                  Leave all unchecked to receive every event.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
                  {ALL_EVENTS.map((event) => (
                    <label
                      key={event}
                      className="flex items-start gap-2.5 p-2.5 rounded-md border border-secondary-200 dark:border-secondary-700 hover:bg-secondary-50 dark:hover:bg-secondary-800 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        className="mt-0.5 rounded"
                        checked={formEvents.includes(event)}
                        onChange={() => toggleEvent(event)}
                      />
                      <span className="min-w-0">
                        <span className="block text-sm font-mono text-secondary-800 dark:text-secondary-200 truncate">
                          {event}
                        </span>
                        <span className="block text-xs text-secondary-500 mt-0.5">
                          {WEBHOOK_EVENTS[event]}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting || !formUrl.trim()}>
                  {submitting ? 'Creating…' : 'Create Webhook'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Webhook list */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {loading ? 'Loading…' : `${webhooks.length} Webhook${webhooks.length !== 1 ? 's' : ''}`}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="divide-y divide-secondary-100 dark:divide-secondary-800">
              {[1, 2].map((i) => (
                <div key={i} className="px-6 py-4 animate-pulse">
                  <div className="h-4 w-64 bg-secondary-100 dark:bg-secondary-800 rounded mb-2" />
                  <div className="h-3 w-40 bg-secondary-100 dark:bg-secondary-800 rounded" />
                </div>
              ))}
            </div>
          ) : webhooks.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <Webhook className="w-10 h-10 text-secondary-300 dark:text-secondary-600 mx-auto mb-3" />
              <p className="text-sm text-secondary-500">No webhooks yet.</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => setShowForm(true)}
              >
                Add your first webhook
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-secondary-100 dark:divide-secondary-800">
              {webhooks.map((wh) => (
                <div key={wh.id} className="px-6 py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-sm text-secondary-900 dark:text-secondary-100 truncate">
                          {truncateUrl(wh.url)}
                        </span>
                        <Badge variant={wh.is_active ? 'success' : 'secondary'}>
                          {wh.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                        {(wh.failure_count ?? 0) > 0 && (
                          <Badge variant="destructive">
                            {wh.failure_count} failure{(wh.failure_count ?? 0) !== 1 ? 's' : ''}
                          </Badge>
                        )}
                      </div>

                      {/* Event badges */}
                      <div className="mt-2 flex flex-wrap gap-1">
                        {!wh.events?.length ? (
                          <Badge variant="secondary" className="text-xs">All events</Badge>
                        ) : (
                          wh.events.map((ev) => (
                            <Badge key={ev} variant="outline" className="text-xs font-mono">
                              {ev}
                            </Badge>
                          ))
                        )}
                      </div>

                      {/* Metadata */}
                      <div className="mt-2 flex flex-wrap gap-3 text-xs text-secondary-500">
                        {wh.last_triggered_at && (
                          <span>Last fired {formatRelativeTime(wh.last_triggered_at)}</span>
                        )}
                        {wh.created_at && (
                          <span>Created {formatRelativeTime(wh.created_at)}</span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggle(wh)}
                        disabled={togglingId === wh.id}
                      >
                        {togglingId === wh.id
                          ? '…'
                          : wh.is_active
                          ? 'Disable'
                          : 'Enable'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(wh.id)}
                        disabled={deletingId === wh.id}
                        className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300"
                      >
                        {deletingId === wh.id ? (
                          '…'
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
