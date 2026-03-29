'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { H1 } from '@/components/ui/heading';
import { Textarea } from '@/components/ui/textarea';
import {
  KeyRound,
  Plus,
  Copy,
  Check,
  Trash2,
  Clock,
  ChevronDown,
  Shield,
  Eye,
  EyeOff,
  ArrowRight,
  Globe,
  X,
  Settings,
  Info,
} from 'lucide-react';
import { Tooltip } from '@/components/ui/tooltip';

interface APIKey {
  id: string;
  name: string;
  key_prefix: string;
  scopes: string[];
  allowed_domains: string[] | null;
  last_used_at: string | null;
  expires_at: string | null;
  created_at: string;
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

function getKeyStatus(key: APIKey): { label: string; variant: 'success' | 'warning' | 'destructive' | 'secondary' } {
  if (key.expires_at && new Date(key.expires_at) < new Date()) {
    return { label: 'Expired', variant: 'destructive' };
  }
  if (!key.last_used_at) {
    return { label: 'Never used', variant: 'secondary' };
  }
  return { label: 'Active', variant: 'success' };
}

function KeySkeleton() {
  return (
    <div className="py-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-secondary-100 dark:bg-secondary-800 rounded-lg" />
          <div className="space-y-2">
            <div className="h-4 w-32 bg-secondary-100 dark:bg-secondary-800 rounded" />
            <div className="h-3 w-24 bg-secondary-100 dark:bg-secondary-800 rounded" />
          </div>
        </div>
        <div className="h-8 w-20 bg-secondary-100 dark:bg-secondary-800 rounded" />
      </div>
    </div>
  );
}

export default function APIKeysPage() {
  const [keys, setKeys] = useState<APIKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyDomains, setNewKeyDomains] = useState('');
  const [newKey, setNewKey] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showUsage, setShowUsage] = useState(false);
  const [showNewKey, setShowNewKey] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingDomainsKey, setEditingDomainsKey] = useState<APIKey | null>(null);
  const [editDomainsValue, setEditDomainsValue] = useState('');
  const [savingDomains, setSavingDomains] = useState(false);

  const supabase = createClient();
  const searchParams = useSearchParams();
  const router = useRouter();
  const returnUrl = searchParams.get('return');

  useEffect(() => {
    fetchKeys();
  }, []);

  const fetchKeys = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      toast.error(error.message);
    } else {
      setKeys(data || []);
    }
    setLoading(false);
  };

  const parseDomains = (input: string): string[] | null => {
    const trimmed = input.trim();
    if (!trimmed) return null; // No restriction
    return trimmed
      .split(/[\n,]+/)
      .map((d) => d.trim().toLowerCase())
      .filter((d) => d.length > 0);
  };

  const createKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    setCreating(true);

    try {
      const allowed_domains = parseDomains(newKeyDomains);

      const response = await fetch('/api/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newKeyName, allowed_domains }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create API key');
      }

      setNewKey(data.plainKey);
      setNewKeyName('');
      setNewKeyDomains('');
      setShowCreateForm(false);
      setShowNewKey(true);
      fetchKeys();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to create API key');
    } finally {
      setCreating(false);
    }
  };

  const saveDomains = async () => {
    if (!editingDomainsKey) return;

    setSavingDomains(true);

    try {
      const allowed_domains = parseDomains(editDomainsValue);

      const response = await fetch(`/api/keys/${editingDomainsKey.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ allowed_domains }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update domains');
      }

      setEditingDomainsKey(null);
      setEditDomainsValue('');
      fetchKeys();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update domains');
    } finally {
      setSavingDomains(false);
    }
  };

  const openDomainsEditor = (key: APIKey) => {
    setEditingDomainsKey(key);
    setEditDomainsValue(key.allowed_domains?.join('\n') || '');
  };

  const deleteKey = async (keyId: string) => {
    setDeletingId(keyId);
    try {
      const response = await fetch(`/api/keys/${keyId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete API key');
      }

      fetchKeys();
      toast.success('API key deleted');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete API key');
    } finally {
      setDeletingId(null);
    }
  };

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-100 dark:bg-primary-900/50 rounded-lg">
            <KeyRound className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <H1 variant="dashboard">API Keys</H1>
            <p className="text-secondary-600 dark:text-secondary-400">Manage your API keys for external integrations</p>
          </div>
        </div>
        <Button onClick={() => setShowCreateForm(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Create New Key
        </Button>
      </div>

      {/* New Key Created Success */}
      {newKey && (
        <Card className="border-green-200 dark:border-green-800 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-[rgb(5,46,22)] dark:to-[rgb(5,46,22)] dark:bg-none">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-green-100 dark:bg-green-900/50 rounded-full">
                  <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-green-800 dark:text-green-50">API Key Created Successfully</CardTitle>
              </div>
              <button
                onClick={() => setShowNewKey(!showNewKey)}
                className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
              >
                {showNewKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <CardDescription className="text-green-700 dark:text-green-200">
              Copy this key now — you won&apos;t be able to see it again!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-stretch gap-2">
              <code className="flex-1 flex items-center p-3 bg-white dark:bg-secondary-800 rounded-lg border border-green-200 dark:border-green-700 font-mono text-sm break-all text-secondary-900 dark:text-amber-200">
                {showNewKey ? newKey : '•'.repeat(40)}
              </code>
              <Button
                variant="outline"
                className="h-auto gap-2 border-green-300 dark:border-green-700 hover:bg-green-100 dark:hover:bg-green-900/30 dark:text-green-100"
                onClick={() => copyToClipboard(newKey, 'new-key')}
              >
                {copiedId === 'new-key' ? (
                  <>
                    <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="text-green-700 hover:text-green-800 hover:bg-green-100 dark:text-green-200 dark:hover:text-green-100 dark:hover:bg-green-900/30"
                onClick={() => setNewKey(null)}
              >
                I&apos;ve saved my key, dismiss this
              </Button>
              {returnUrl && (
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => {
                    setNewKey(null);
                    router.push(returnUrl);
                  }}
                >
                  Continue to Integrations
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create Form */}
      {showCreateForm && !newKey && (
        <Card className="border-primary-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary-500" />
              Create New API Key
            </CardTitle>
            <CardDescription>Give your key a descriptive name to identify it later</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={createKey} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="keyName">Key Name</Label>
                <Input
                  id="keyName"
                  placeholder="e.g., Production Server, Development, Mobile App"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="keyDomains" className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Allowed Domains (optional)
                </Label>
                <Textarea
                  id="keyDomains"
                  placeholder="example.com&#10;*.myapp.com&#10;localhost:3000"
                  value={newKeyDomains}
                  onChange={(e) => setNewKeyDomains(e.target.value)}
                />
                <p className="text-xs text-secondary-500 dark:text-secondary-400">
                  One domain per line. Use *.domain.com for subdomains. Leave empty for no restriction.
                </p>
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={creating} className="gap-2">
                  {creating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <KeyRound className="w-4 h-4" />
                      Create Key
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowCreateForm(false);
                    setNewKeyDomains('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Edit Domains Modal */}
      {editingDomainsKey && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div
            className="w-full max-w-md rounded-lg border shadow-lg"
            style={{ backgroundColor: 'rgb(var(--modal-bg))', borderColor: 'rgb(var(--modal-border))' }}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-primary-500" />
                  Domain Restrictions
                </CardTitle>
                <button
                  onClick={() => setEditingDomainsKey(null)}
                  className="text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <CardDescription>
                Restrict &quot;{editingDomainsKey.name}&quot; to specific domains
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="editDomains">Allowed Domains</Label>
                <Textarea
                  id="editDomains"
                  placeholder="example.com&#10;*.myapp.com&#10;localhost:3000"
                  value={editDomainsValue}
                  onChange={(e) => setEditDomainsValue(e.target.value)}
                  className="min-h-[120px]"
                  autoFocus
                />
                <p className="text-xs text-secondary-500 dark:text-secondary-400">
                  One domain per line. Use *.domain.com for subdomains. Leave empty for no restriction (key works on all domains).
                </p>
              </div>
              <div className="flex gap-2">
                <Button onClick={saveDomains} disabled={savingDomains} className="gap-2">
                  {savingDomains ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      Save
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={() => setEditingDomainsKey(null)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </div>
        </div>
      )}

      {/* Keys List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Your API Keys</CardTitle>
              <CardDescription>
                {keys.length} key{keys.length !== 1 ? 's' : ''} created
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="divide-y divide-secondary-100">
              <KeySkeleton />
              <KeySkeleton />
              <KeySkeleton />
            </div>
          ) : keys.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-12 h-12 bg-secondary-100 dark:bg-secondary-800 rounded-full flex items-center justify-center mb-4">
                <KeyRound className="w-6 h-6 text-secondary-400" />
              </div>
              <h3 className="text-secondary-900 dark:text-white font-medium mb-1">No API keys yet</h3>
              <p className="text-secondary-500 dark:text-secondary-400 text-sm mb-4">Create your first API key to get started</p>
              <Button onClick={() => setShowCreateForm(true)} variant="outline" className="gap-2">
                <Plus className="w-4 h-4" />
                Create Your First Key
              </Button>
            </div>
          ) : (
            <div className="-mx-2">
              {keys.map((key) => {
                const status = getKeyStatus(key);
                const hasDomainRestriction = key.allowed_domains && key.allowed_domains.length > 0;
                return (
                  <div
                    key={key.id}
                    className="py-4 px-2 flex items-center justify-between group hover:bg-secondary-50 dark:hover:bg-white/5 transition-colors rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 bg-secondary-100 dark:bg-secondary-800 rounded-lg group-hover:bg-secondary-200 dark:group-hover:bg-secondary-700 transition-colors">
                        <KeyRound className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-secondary-900 dark:text-white">{key.name}</p>
                          <Badge variant={status.variant}>{status.label}</Badge>
                          {hasDomainRestriction ? (
                            <Badge variant="outline" className="gap-1 text-xs">
                              <Globe className="w-3 h-3" />
                              {key.allowed_domains!.length} domain{key.allowed_domains!.length !== 1 ? 's' : ''}
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="gap-1 text-xs">
                              <Globe className="w-3 h-3" />
                              All domains
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm font-mono text-secondary-500 dark:text-secondary-400 flex items-center gap-1">
                          {key.key_prefix}•••••••••
                          <Tooltip content="Only the first few characters are shown for security. Copy the full key when creating it — it cannot be retrieved later.">
                            <Info className="w-3.5 h-3.5 text-secondary-400 cursor-help" />
                          </Tooltip>
                        </p>
                        <div className="flex items-center gap-3 text-xs text-secondary-400 dark:text-secondary-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Created {formatRelativeTime(key.created_at)}
                          </span>
                          {key.last_used_at && (
                            <span>Last used {formatRelativeTime(key.last_used_at)}</span>
                          )}
                          {key.expires_at && (
                            <span className={new Date(key.expires_at) < new Date() ? 'text-red-500' : 'text-yellow-600'}>
                              {new Date(key.expires_at) < new Date()
                                ? 'Expired'
                                : `Expires ${formatRelativeTime(key.expires_at)}`}
                            </span>
                          )}
                        </div>
                        {hasDomainRestriction && (
                          <div className="flex items-center gap-1 flex-wrap mt-1">
                            {key.allowed_domains!.slice(0, 3).map((domain, i) => (
                              <span
                                key={i}
                                className="text-xs bg-secondary-100 dark:bg-secondary-800 px-1.5 py-0.5 rounded"
                              >
                                {domain}
                              </span>
                            ))}
                            {key.allowed_domains!.length > 3 && (
                              <span className="text-xs text-secondary-400">
                                +{key.allowed_domains!.length - 3} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-secondary-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:text-primary-400 dark:hover:bg-primary-500/10 gap-2"
                        onClick={() => openDomainsEditor(key)}
                      >
                        <Settings className="w-4 h-4" />
                        Domains
                      </Button>
                      <Tooltip content="Permanently invalidates this key. Any application using it will immediately lose access.">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-secondary-400 hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-500/10 gap-2"
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this API key? This action cannot be undone.')) {
                              deleteKey(key.id);
                            }
                          }}
                          disabled={deletingId === key.id}
                        >
                          {deletingId === key.id ? (
                            <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                          Delete
                        </Button>
                      </Tooltip>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Usage Instructions - Collapsible */}
      <Card className="group">
        <CardHeader
          className="cursor-pointer transition-colors"
          onClick={() => setShowUsage(!showUsage)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary-500 transition-colors group-hover:text-primary-400" />
              <div>
                <CardTitle className="transition-colors group-hover:text-primary-500 dark:group-hover:text-primary-400">Using Your API Key</CardTitle>
                <CardDescription>Learn how to authenticate your API requests</CardDescription>
              </div>
            </div>
            <ChevronDown className={`w-5 h-5 text-secondary-500 dark:text-secondary-400 transition-transform duration-200 ${showUsage ? 'rotate-180' : ''}`} />
          </div>
        </CardHeader>
        {showUsage && (
          <CardContent className="space-y-4 pt-0">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg space-y-2">
                <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300">Authorization Header</p>
                <code className="block p-2 bg-white dark:bg-secondary-900 rounded border border-secondary-200 dark:border-secondary-700 text-sm font-mono text-secondary-800 dark:text-secondary-200">
                  Authorization: Bearer sk_live_xxxxx
                </code>
              </div>
              <div className="p-4 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg space-y-2">
                <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300">X-API-Key Header</p>
                <code className="block p-2 bg-white dark:bg-secondary-900 rounded border border-secondary-200 dark:border-secondary-700 text-sm font-mono text-secondary-800 dark:text-secondary-200">
                  X-API-Key: sk_live_xxxxx
                </code>
              </div>
            </div>
            <div className="p-4 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg space-y-2">
              <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300">Example cURL Request</p>
              <div className="relative">
                <code className="block p-3 bg-secondary-900 text-secondary-100 rounded-lg text-sm font-mono whitespace-pre-wrap overflow-x-auto">
{`curl -X POST https://your-domain.com/api/chatbots/{id}/chat \\
  -H "Authorization: Bearer sk_live_xxxxx" \\
  -H "Content-Type: application/json" \\
  -d '{"message": "Hello, how can I help?"}'`}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 text-secondary-400 hover:text-white hover:bg-secondary-700 dark:hover:bg-white/10 p-1.5 rounded transition-colors"
                  onClick={() => copyToClipboard(
                    `curl -X POST https://your-domain.com/api/chatbots/{id}/chat \\\n  -H "Authorization: Bearer sk_live_xxxxx" \\\n  -H "Content-Type: application/json" \\\n  -d '{"message": "Hello, how can I help?"}'`,
                    'curl'
                  )}
                >
                  {copiedId === 'curl' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
