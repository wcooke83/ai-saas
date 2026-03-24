'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

interface CalcomConnectFormProps {
  chatbotId: string;
  onConnected: () => void;
}

export function CalcomConnectForm({ chatbotId, onConnected }: CalcomConnectFormProps) {
  const [apiKey, setApiKey] = useState('');
  const [baseUrl, setBaseUrl] = useState('https://api.cal.com');
  const [eventTypeId, setEventTypeId] = useState('');
  const [loading, setLoading] = useState(false);
  const [showKey, setShowKey] = useState(false);

  async function handleConnect() {
    if (!apiKey.trim()) {
      toast.error('API key is required');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/calendar/connect/calcom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatbotId,
          apiKey: apiKey.trim(),
          baseUrl: baseUrl.trim(),
          eventTypeId: eventTypeId.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || 'Connection failed');
      }

      toast.success('Cal.com connected successfully');
      onConnected();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to connect';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="calcom-api-key">API Key</Label>
        <div className="relative mt-1">
          <Input
            id="calcom-api-key"
            type={showKey ? 'text' : 'password'}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="cal_live_..."
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-600 focus-visible:ring-2 focus-visible:ring-primary-500 rounded outline-none"
            aria-label={showKey ? 'Hide API key' : 'Show API key'}
          >
            {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>
      <div>
        <Label htmlFor="calcom-base-url">Base URL</Label>
        <Input
          id="calcom-base-url"
          value={baseUrl}
          onChange={(e) => setBaseUrl(e.target.value)}
          placeholder="https://api.cal.com"
          className="mt-1"
        />
        <p className="text-xs text-secondary-500 mt-1">
          Use https://api.cal.com for Cal.com Cloud, or your self-hosted URL.
        </p>
      </div>
      <div>
        <Label htmlFor="calcom-event-type">Event Type ID (optional)</Label>
        <Input
          id="calcom-event-type"
          value={eventTypeId}
          onChange={(e) => setEventTypeId(e.target.value)}
          placeholder="123"
          className="mt-1"
        />
      </div>
      <Button onClick={handleConnect} disabled={loading || !apiKey.trim()}>
        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        Connect Cal.com
      </Button>
    </div>
  );
}
