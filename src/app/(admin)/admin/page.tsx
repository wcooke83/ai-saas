'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { H1 } from '@/components/ui/heading';
import {
  Settings,
  Cpu,
  Server,
  Loader2,
  Check,
  Shield,
  Terminal,
  ScrollText,
  Brain,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';

interface AppSettings {
  ai_provider: 'claude' | 'local';
  local_api_url: string;
  local_api_key: string | null;
  local_api_timeout: number;
  local_api_provider: 'default' | 'chatgpt' | 'claude' | 'grok';
  token_multiplier: number;
  multiplier_claude: number;
  multiplier_openai: number;
  multiplier_local: number;
  updated_at: string;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Form state
  const [aiProvider, setAiProvider] = useState<'claude' | 'local'>('claude');
  const [localApiUrl, setLocalApiUrl] = useState('http://localhost:8000');
  const [localApiKey, setLocalApiKey] = useState('');
  const [localApiTimeout, setLocalApiTimeout] = useState(120);
  const [localApiProvider, setLocalApiProvider] = useState<'default' | 'chatgpt' | 'claude' | 'grok'>('default');
  const [multiplierClaude, setMultiplierClaude] = useState(1);
  const [multiplierOpenai, setMultiplierOpenai] = useState(1);
  const [multiplierLocal, setMultiplierLocal] = useState(1);

  const router = useRouter();

  useEffect(() => {
    async function checkAdminAndLoadSettings() {
      try {
        // Check if user is admin
        const checkResponse = await fetch('/api/admin/check');
        const checkData = await checkResponse.json();

        if (!checkData.data?.isAdmin) {
          router.push('/dashboard');
          return;
        }

        setIsAdmin(true);

        // Load settings
        const settingsResponse = await fetch('/api/admin/settings');
        const settingsData = await settingsResponse.json();

        if (settingsData.success && settingsData.data) {
          setSettings(settingsData.data);
          setAiProvider(settingsData.data.ai_provider);
          setLocalApiUrl(settingsData.data.local_api_path || 'http://localhost:8000');
          setLocalApiKey(settingsData.data.local_api_key || '');
          setLocalApiTimeout(settingsData.data.local_api_timeout);
          setLocalApiProvider(settingsData.data.local_api_provider);
          setMultiplierClaude(settingsData.data.multiplier_claude || 1);
          setMultiplierOpenai(settingsData.data.multiplier_openai || 1);
          setMultiplierLocal(settingsData.data.multiplier_local || 1);
        }
      } catch (err) {
        console.error('Failed to load admin settings:', err);
        toast.error('Failed to load settings');
      } finally {
        setLoading(false);
      }
    }

    checkAdminAndLoadSettings();
  }, [router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ai_provider: aiProvider,
          local_api_path: localApiUrl,
          local_api_key: localApiKey || null,
          local_api_timeout: localApiTimeout,
          local_api_provider: localApiProvider,
          multiplier_claude: multiplierClaude,
          multiplier_openai: multiplierOpenai,
          multiplier_local: multiplierLocal,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error?.message || 'Failed to save settings');
      }

      setSettings(data.data);
      toast.success('Settings saved successfully');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-secondary-200 dark:bg-secondary-700 rounded animate-pulse" />
        <Card>
          <CardHeader>
            <div className="h-6 w-32 bg-secondary-200 dark:bg-secondary-700 rounded animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="h-10 bg-secondary-100 dark:bg-secondary-800 rounded animate-pulse" />
              <div className="h-10 bg-secondary-100 dark:bg-secondary-800 rounded animate-pulse" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-100 dark:bg-primary-900/50 rounded-lg">
            <Shield className="w-6 h-6 text-primary-600 dark:text-primary-400" aria-hidden="true" />
          </div>
          <div>
            <H1 variant="dashboard">Admin Settings</H1>
            <p className="text-secondary-600 dark:text-secondary-400">Configure global application settings</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/ai-config">
            <Button variant="outline" className="gap-2">
              <Brain className="w-4 h-4" />
              AI Models
            </Button>
          </Link>
          <Link href="/admin/logs">
            <Button variant="outline" className="gap-2">
              <ScrollText className="w-4 h-4" />
              API Logs
            </Button>
          </Link>
        </div>
      </div>

      <form onSubmit={handleSave}>
        <div className="grid gap-6">
          {/* AI Provider Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-primary-500" aria-hidden="true" />
                AI Provider
              </CardTitle>
              <CardDescription>Choose which AI provider to use for generating content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Claude Option */}
                <label
                  className={`relative flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    aiProvider === 'claude'
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-secondary-200 dark:border-secondary-700 hover:border-secondary-300 dark:hover:border-secondary-600'
                  }`}
                >
                  <input
                    type="radio"
                    name="ai_provider"
                    value="claude"
                    checked={aiProvider === 'claude'}
                    onChange={() => setAiProvider('claude')}
                    className="sr-only"
                  />
                  <div className={`p-2 rounded-lg ${
                    aiProvider === 'claude' ? 'bg-primary-100 dark:bg-primary-800' : 'bg-secondary-100 dark:bg-secondary-800'
                  }`}>
                    <Server className={`w-6 h-6 ${
                      aiProvider === 'claude' ? 'text-primary-600 dark:text-primary-400' : 'text-secondary-600 dark:text-secondary-400'
                    }`} aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-secondary-900 dark:text-secondary-100">Claude API</p>
                      <Badge variant="secondary">Default</Badge>
                    </div>
                    <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-1">
                      Use Anthropic&apos;s Claude API directly. Requires ANTHROPIC_API_KEY.
                    </p>
                  </div>
                  {aiProvider === 'claude' && (
                    <Check className="absolute top-4 right-4 w-5 h-5 text-primary-500" aria-hidden="true" />
                  )}
                </label>

                {/* Local API Option */}
                <label
                  className={`relative flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    aiProvider === 'local'
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-secondary-200 dark:border-secondary-700 hover:border-secondary-300 dark:hover:border-secondary-600'
                  }`}
                >
                  <input
                    type="radio"
                    name="ai_provider"
                    value="local"
                    checked={aiProvider === 'local'}
                    onChange={() => setAiProvider('local')}
                    className="sr-only"
                  />
                  <div className={`p-2 rounded-lg ${
                    aiProvider === 'local' ? 'bg-primary-100 dark:bg-primary-800' : 'bg-secondary-100 dark:bg-secondary-800'
                  }`}>
                    <Terminal className={`w-6 h-6 ${
                      aiProvider === 'local' ? 'text-primary-600 dark:text-primary-400' : 'text-secondary-600 dark:text-secondary-400'
                    }`} aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-secondary-900 dark:text-secondary-100">Local API</p>
                      <Badge variant="outline">Custom</Badge>
                    </div>
                    <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-1">
                      Connect to ai-prompt-api for browser-based AI. No API key required.
                    </p>
                  </div>
                  {aiProvider === 'local' && (
                    <Check className="absolute top-4 right-4 w-5 h-5 text-primary-500" aria-hidden="true" />
                  )}
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Local API Configuration */}
          {aiProvider === 'local' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-primary-500" aria-hidden="true" />
                  Local API Configuration
                </CardTitle>
                <CardDescription>Configure the local AI API connection</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="localApiUrl">API URL</Label>
                  <Input
                    id="localApiUrl"
                    value={localApiUrl}
                    onChange={(e) => setLocalApiUrl(e.target.value)}
                    placeholder="http://localhost:8000"
                  />
                  <p className="text-xs text-secondary-500 dark:text-secondary-400">
                    URL of the ai-prompt-api server (e.g. http://localhost:8000)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="localApiKey">API Key</Label>
                  <Input
                    id="localApiKey"
                    type="password"
                    value={localApiKey}
                    onChange={(e) => setLocalApiKey(e.target.value)}
                    placeholder="Leave empty for no auth (local dev only)"
                  />
                  <p className="text-xs text-secondary-500 dark:text-secondary-400">
                    Must match the AI_PROMPT_API_KEY env var on the API server. Leave empty to disable auth.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="localApiTimeout">Timeout (seconds)</Label>
                    <Input
                      id="localApiTimeout"
                      type="number"
                      min={10}
                      max={600}
                      value={localApiTimeout}
                      onChange={(e) => setLocalApiTimeout(parseInt(e.target.value) || 120)}
                    />
                    <p className="text-xs text-secondary-500 dark:text-secondary-400">
                      Maximum time to wait for a response (10-600s)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="localApiProvider">AI Provider</Label>
                    <select
                      id="localApiProvider"
                      value={localApiProvider}
                      onChange={(e) => setLocalApiProvider(e.target.value as 'default' | 'chatgpt' | 'claude' | 'grok')}
                      className="w-full h-10 px-3 py-2 text-sm border border-secondary-200 dark:border-secondary-700 rounded-md text-secondary-900 dark:text-secondary-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      style={{ backgroundColor: 'rgb(var(--form-element-bg))' }}
                    >
                      <option value="default">Default (use active tab)</option>
                      <option value="claude">Claude</option>
                      <option value="chatgpt">ChatGPT</option>
                      <option value="grok">Grok</option>
                    </select>
                    <p className="text-xs text-secondary-500 dark:text-secondary-400">
                      Which AI provider the API should target
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <p className="font-medium text-amber-800 dark:text-amber-300">Requirements</p>
                      <ul className="text-sm text-amber-700 dark:text-amber-400 mt-1 list-disc list-inside">
                        <li>ai-prompt-api server running at the configured URL</li>
                        <li>Browser extension connected to the API server</li>
                        <li>Logged into the selected AI provider in the browser</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Usage & Billing Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary-500" aria-hidden="true" />
                Usage & Billing
              </CardTitle>
              <CardDescription>Configure token multipliers for each AI provider</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-3">
                {/* Claude Multiplier */}
                <div className="space-y-2">
                  <Label htmlFor="multiplierClaude" className="flex items-center gap-2">
                    <Server className="w-4 h-4 text-orange-500" aria-hidden="true" />
                    Claude (Anthropic)
                  </Label>
                  <Input
                    id="multiplierClaude"
                    type="number"
                    min={0.01}
                    max={100}
                    step={0.01}
                    value={multiplierClaude}
                    onChange={(e) => setMultiplierClaude(parseFloat(e.target.value) || 1)}
                  />
                  <p className="text-xs text-secondary-500 dark:text-secondary-400">
                    Multiplier for Claude API calls
                  </p>
                </div>

                {/* OpenAI Multiplier */}
                <div className="space-y-2">
                  <Label htmlFor="multiplierOpenai" className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-green-500" aria-hidden="true" />
                    OpenAI
                  </Label>
                  <Input
                    id="multiplierOpenai"
                    type="number"
                    min={0.01}
                    max={100}
                    step={0.01}
                    value={multiplierOpenai}
                    onChange={(e) => setMultiplierOpenai(parseFloat(e.target.value) || 1)}
                  />
                  <p className="text-xs text-secondary-500 dark:text-secondary-400">
                    Multiplier for OpenAI API calls
                  </p>
                </div>

                {/* Local Multiplier */}
                <div className="space-y-2">
                  <Label htmlFor="multiplierLocal" className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-blue-500" aria-hidden="true" />
                    Local API
                  </Label>
                  <Input
                    id="multiplierLocal"
                    type="number"
                    min={0.01}
                    max={100}
                    step={0.01}
                    value={multiplierLocal}
                    onChange={(e) => setMultiplierLocal(parseFloat(e.target.value) || 1)}
                  />
                  <p className="text-xs text-secondary-500 dark:text-secondary-400">
                    Multiplier for local API calls
                  </p>
                </div>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-start gap-3">
                  <Cpu className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="font-medium text-blue-800 dark:text-blue-300">Usage Guide</p>
                    <ul className="text-sm text-blue-700 dark:text-blue-400 mt-1 list-disc list-inside">
                      <li>Set different multipliers to normalize costs across providers</li>
                      <li>Example: If Claude is 2x cheaper than OpenAI, set Claude to 2.0</li>
                      <li>Set to 1.0 to bill exact token usage for that provider</li>
                      <li>Set to 0 for free/unbilled usage (e.g., local API)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-secondary-500 dark:text-secondary-400">
              {settings?.updated_at && (
                <>Last updated: {new Date(settings.updated_at).toLocaleString()}</>
              )}
            </p>
            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" />
                  Saving...
                </>
              ) : (
                'Save Settings'
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
