'use client';

import { useState } from 'react';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { CalendarIntegration } from '@/lib/calendar/types';

interface ConnectionStatusProps {
  integration: CalendarIntegration | null;
  onDisconnect: () => void;
  onTest: () => void;
  testing?: boolean;
}

export function ConnectionStatus({ integration, onDisconnect, onTest, testing }: ConnectionStatusProps) {
  const [confirming, setConfirming] = useState(false);

  if (!integration) {
    return (
      <div className="flex items-center gap-2 text-secondary-500">
        <XCircle className="w-4 h-4" />
        <span className="text-sm">Not connected</span>
      </div>
    );
  }

  const providerLabels: Record<string, string> = {
    hosted_calcom: 'Hosted Calendar',
    customer_calcom: 'Cal.com',
    calendly: 'Calendly',
  };

  return (
    <div className="flex items-center justify-between p-4 rounded-lg border border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-800/50">
      <div className="flex items-center gap-3">
        <CheckCircle2 className="w-5 h-5 text-green-500" />
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
              Connected to {providerLabels[integration.provider] || integration.provider}
            </span>
            <Badge variant="outline" className="text-xs">
              {integration.is_active ? 'Active' : 'Inactive'}
            </Badge>
          </div>
          <span className="text-xs text-secondary-500">
            Connected {new Date(integration.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button size="sm" variant="outline" onClick={onTest} disabled={testing}>
          {testing && <Loader2 className="w-3 h-3 mr-1 animate-spin" />}
          Test
        </Button>
        {confirming ? (
          <>
            <span className="text-xs text-red-500">Disconnect? This may affect active bookings.</span>
            <Button size="sm" variant="destructive" onClick={() => { onDisconnect(); setConfirming(false); }}>
              Yes, disconnect
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setConfirming(false)}>
              Cancel
            </Button>
          </>
        ) : (
          <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-700" onClick={() => setConfirming(true)}>
            Disconnect
          </Button>
        )}
      </div>
    </div>
  );
}
