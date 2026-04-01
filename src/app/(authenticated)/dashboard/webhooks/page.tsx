'use client';

import { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { H1 } from '@/components/ui/heading';
import { useConfirmDialog } from '@/components/ui/confirm-dialog';
import { WEBHOOK_EVENTS } from '@/lib/sdk/webhook';
import {
  Plus,
  X,
  Trash2,
  Copy,
  Check,
  AlertTriangle,
  Webhook,
  ChevronDown,
  Shield,
  Play,
  History,
  CheckCircle2,
  XCircle,
  FlaskConical,
  Loader2,
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

interface DeliveryEntry {
  id: string;
  delivery_id: string | null;
  event: string | null;
  chatbot_id: string | null;
  status: 'success' | 'failed';
  status_code: number | null;
  attempts: number | null;
  error: string | null;
  is_test: boolean;
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
  const [showDocs, setShowDocs] = useState(false);
  const [testingId, setTestingId] = useState<string | null>(null);
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const [deliveryLogs, setDeliveryLogs] = useState<Record<string, DeliveryEntry[]>>({});
  const [loadingLogs, setLoadingLogs] = useState<string | null>(null);

  const { confirm: confirmDelete, ConfirmDialog: DeleteConfirmDialog } = useConfirmDialog({
    title: 'Delete webhook?',
    description: 'This cannot be undone. The endpoint will stop receiving events immediately.',
    confirmText: 'Delete',
    cancelText: 'Cancel',
    variant: 'danger',
  });

  const urlError = useMemo(() => {
    if (!formUrl) return null;
    try {
      const u = new URL(formUrl);
      if (u.protocol !== 'https:') return 'URL must use HTTPS.';
      return null;
    } catch {
      return 'Please enter a valid URL.';
    }
  }, [formUrl]);

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
    const confirmed = await confirmDelete();
    if (!confirmed) return;

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

  const handleTest = async (webhookId: string) => {
    setTestingId(webhookId);
    try {
      const res = await fetch(`/api/webhooks/${webhookId}/test`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'Test delivery failed');

      if (data.data?.success) {
        toast.success(`Test delivered (HTTP ${data.data.status_code})`);
      } else {
        toast.error(`Test failed: ${data.data?.error || 'Unknown error'}`);
      }

      // Refresh delivery logs if expanded
      if (expandedLogId === webhookId) {
        fetchDeliveryLogs(webhookId);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Test delivery failed');
    } finally {
      setTestingId(null);
    }
  };

  const fetchDeliveryLogs = async (webhookId: string) => {
    setLoadingLogs(webhookId);
    try {
      const res = await fetch(`/api/webhooks/${webhookId}/deliveries?limit=20`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'Failed to load delivery logs');
      setDeliveryLogs((prev) => ({ ...prev, [webhookId]: data.data.deliveries }));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to load logs');
    } finally {
      setLoadingLogs(null);
    }
  };

  const toggleDeliveryLogs = (webhookId: string) => {
    if (expandedLogId === webhookId) {
      setExpandedLogId(null);
    } else {
      setExpandedLogId(webhookId);
      if (!deliveryLogs[webhookId]) {
        fetchDeliveryLogs(webhookId);
      }
    }
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
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
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
                  <code className="flex-1 px-3 py-2 text-xs font-mono bg-amber-100 dark:bg-amber-900/40 border border-amber-200 dark:border-amber-700 rounded-md break-all select-all">
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
                className="flex items-center justify-center w-8 h-8 rounded-md text-amber-500 hover:text-amber-700 dark:hover:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/30 focus:outline-none focus:ring-2 focus:ring-amber-500 flex-shrink-0"
                aria-label="Dismiss"
              >
                <X className="w-4 h-4" />
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
                  autoFocus
                  className={urlError ? 'border-red-400 focus-visible:ring-red-400' : ''}
                  aria-describedby="webhook-url-hint webhook-url-error"
                />
                {urlError ? (
                  <p id="webhook-url-error" className="text-xs text-red-600 dark:text-red-400" role="alert">{urlError}</p>
                ) : (
                  <p id="webhook-url-hint" className="text-xs text-secondary-500">Must be an HTTPS URL.</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Events</Label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      className="text-xs text-primary-600 dark:text-primary-400 hover:underline"
                      onClick={() => setFormEvents(ALL_EVENTS as unknown as string[])}
                    >
                      Select all
                    </button>
                    <button
                      type="button"
                      className="text-xs text-secondary-500 hover:underline"
                      onClick={() => setFormEvents([])}
                    >
                      Clear
                    </button>
                  </div>
                </div>
                <p className="text-xs text-secondary-500">
                  Leave all unchecked to receive every event.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
                  {ALL_EVENTS.map((event) => (
                    <label
                      key={event}
                      htmlFor={`event-${event}`}
                      className="flex items-start gap-2.5 p-2.5 rounded-md border border-secondary-200 dark:border-secondary-700 hover:bg-secondary-50 dark:hover:bg-secondary-800 cursor-pointer"
                    >
                      <input
                        id={`event-${event}`}
                        type="checkbox"
                        className="mt-0.5 rounded accent-primary-600 w-4 h-4 cursor-pointer"
                        aria-describedby={`event-${event}-desc`}
                        checked={formEvents.includes(event)}
                        onChange={() => toggleEvent(event)}
                      />
                      <span className="min-w-0">
                        <span className="block text-sm font-mono text-secondary-800 dark:text-secondary-200 truncate">
                          {event}
                        </span>
                        <span id={`event-${event}-desc`} className="block text-xs text-secondary-500 mt-0.5">
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
                <Button type="submit" disabled={submitting || !formUrl.trim() || !!urlError}>
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
            {loading ? 'Webhooks' : `${webhooks.length} Webhook${webhooks.length !== 1 ? 's' : ''}`}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="divide-y divide-secondary-100 dark:divide-secondary-800">
              {[1, 2, 3].map((i) => (
                <div key={i} className="px-6 py-4 animate-pulse">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-56 bg-secondary-100 dark:bg-secondary-800 rounded" />
                        <div className="h-5 w-14 bg-secondary-100 dark:bg-secondary-800 rounded-full" />
                      </div>
                      <div className="flex gap-1">
                        <div className="h-5 w-20 bg-secondary-100 dark:bg-secondary-800 rounded-full" />
                        <div className="h-5 w-24 bg-secondary-100 dark:bg-secondary-800 rounded-full" />
                      </div>
                      <div className="h-3 w-36 bg-secondary-100 dark:bg-secondary-800 rounded" />
                    </div>
                    <div className="flex gap-2">
                      <div className="h-9 w-16 bg-secondary-100 dark:bg-secondary-800 rounded-md" />
                      <div className="h-9 w-9 bg-secondary-100 dark:bg-secondary-800 rounded-md" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : webhooks.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto w-12 h-12 bg-secondary-100 dark:bg-secondary-800 rounded-full flex items-center justify-center mb-4">
                <Webhook className="w-6 h-6 text-secondary-400" aria-hidden="true" />
              </div>
              <h3 className="text-sm font-medium text-secondary-900 dark:text-secondary-100 mb-1">No webhooks configured</h3>
              <p className="text-sm text-secondary-500 dark:text-secondary-400 mb-4 max-w-xs mx-auto">
                Webhooks let you receive HTTP POST notifications when events happen in your chatbots.
              </p>
              <Button variant="outline" size="sm" onClick={() => setShowForm(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                Add your first webhook
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-secondary-100 dark:divide-secondary-800">
              {webhooks.map((wh) => (
                <div key={wh.id} className="px-6 py-4">
                  <div className="flex items-start justify-between gap-4 flex-wrap sm:flex-nowrap">
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
                        onClick={() => handleTest(wh.id)}
                        disabled={testingId === wh.id}
                        title="Send test delivery"
                        className="gap-1.5"
                      >
                        {testingId === wh.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Play className="w-3.5 h-3.5" />
                        )}
                        Test
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleDeliveryLogs(wh.id)}
                        title="View delivery history"
                        className="gap-1.5"
                      >
                        <History className="w-3.5 h-3.5" />
                        Logs
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggle(wh)}
                        disabled={togglingId === wh.id}
                      >
                        {togglingId === wh.id ? (
                          <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : (
                          wh.is_active ? 'Disable' : 'Enable'
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(wh.id)}
                        disabled={deletingId === wh.id}
                        className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300"
                      >
                        {deletingId === wh.id ? (
                          <div className="w-3.5 h-3.5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Delivery log panel */}
                  {expandedLogId === wh.id && (
                    <div className="mt-3 border-t border-secondary-100 dark:border-secondary-800 pt-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-xs font-medium text-secondary-700 dark:text-secondary-300 flex items-center gap-1.5">
                          <History className="w-3.5 h-3.5" />
                          Recent Deliveries
                        </h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => fetchDeliveryLogs(wh.id)}
                          disabled={loadingLogs === wh.id}
                          className="text-xs h-7 px-2"
                        >
                          {loadingLogs === wh.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            'Refresh'
                          )}
                        </Button>
                      </div>

                      {loadingLogs === wh.id && !deliveryLogs[wh.id] ? (
                        <div className="py-6 text-center text-xs text-secondary-500">
                          <Loader2 className="w-4 h-4 animate-spin mx-auto mb-2" />
                          Loading delivery history...
                        </div>
                      ) : !deliveryLogs[wh.id]?.length ? (
                        <div className="py-6 text-center text-xs text-secondary-500">
                          No deliveries yet. Click &quot;Test&quot; to send a test event.
                        </div>
                      ) : (
                        <div className="space-y-1 max-h-64 overflow-y-auto">
                          {deliveryLogs[wh.id].map((entry) => (
                            <div
                              key={entry.id}
                              className="flex items-center gap-3 px-3 py-2 rounded-md bg-secondary-50 dark:bg-secondary-800/50 text-xs"
                            >
                              {entry.status === 'success' ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                              ) : (
                                <XCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                              )}
                              <span className="font-mono text-secondary-700 dark:text-secondary-300 min-w-0 truncate">
                                {entry.event || 'unknown'}
                              </span>
                              {entry.is_test && (
                                <span className="flex items-center gap-0.5 text-amber-600 dark:text-amber-400 flex-shrink-0">
                                  <FlaskConical className="w-3 h-3" />
                                  test
                                </span>
                              )}
                              {entry.status_code && (
                                <span className={`flex-shrink-0 ${entry.status === 'success' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                  {entry.status_code}
                                </span>
                              )}
                              {entry.attempts && entry.attempts > 1 && (
                                <span className="text-secondary-500 flex-shrink-0">
                                  {entry.attempts} attempts
                                </span>
                              )}
                              {entry.error && (
                                <span className="text-red-500 truncate min-w-0" title={entry.error}>
                                  {entry.error}
                                </span>
                              )}
                              <span className="ml-auto text-secondary-400 flex-shrink-0 whitespace-nowrap">
                                {entry.created_at ? formatRelativeTime(entry.created_at) : ''}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Signature verification docs */}
      <Card className="group">
        <CardHeader
          className="cursor-pointer"
          onClick={() => setShowDocs(!showDocs)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary-500" />
              <div>
                <CardTitle className="text-base">Verifying Webhook Signatures</CardTitle>
                <CardDescription>How to validate incoming webhook requests</CardDescription>
              </div>
            </div>
            <ChevronDown className={`w-5 h-5 text-secondary-500 transition-transform duration-200 ${showDocs ? 'rotate-180' : ''}`} />
          </div>
        </CardHeader>
        {showDocs && (
          <CardContent className="space-y-4 pt-0">
            <p className="text-sm text-secondary-600 dark:text-secondary-400">
              Each request includes three headers. Compute{' '}
              <code className="text-xs font-mono bg-secondary-100 dark:bg-secondary-800 px-1 rounded">
                HMAC-SHA256(timestamp + &quot;.&quot; + body, secret)
              </code>{' '}
              and compare against{' '}
              <code className="text-xs font-mono bg-secondary-100 dark:bg-secondary-800 px-1 rounded">
                X-Webhook-Signature
              </code>.
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { header: 'X-Webhook-Signature', desc: 'HMAC-SHA256 hex digest' },
                { header: 'X-Webhook-Timestamp', desc: 'Unix epoch seconds' },
                { header: 'X-Webhook-Event', desc: 'Event name e.g. lead.captured' },
              ].map(({ header, desc }) => (
                <div key={header} className="p-3 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg space-y-1">
                  <code className="text-xs font-mono text-secondary-800 dark:text-secondary-200 break-all">{header}</code>
                  <p className="text-xs text-secondary-500">{desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>

      <DeleteConfirmDialog />
    </div>
  );
}
