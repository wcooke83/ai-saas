'use client';

import { useState } from 'react';
import { CheckCircle2, Loader2, AlertCircle, WifiOff, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip } from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import type { CalendarIntegration, EAConnectionState } from '@/lib/calendar/types';

interface ConnectionStatusProps {
  integration: CalendarIntegration | null;
  connectionState: EAConnectionState;
  activeBookingCount: number;
  onDisconnect: () => void;
  onTest: () => void;
  testing?: boolean;
}

export function ConnectionStatus({
  integration,
  connectionState,
  activeBookingCount,
  onDisconnect,
  onTest,
  testing,
}: ConnectionStatusProps) {
  const [showDisconnectDialog, setShowDisconnectDialog] = useState(false);

  if (connectionState === 'not_configured') {
    return (
      <div className="flex items-start gap-3 p-4 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20">
        <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
            Easy!Appointments is not configured
          </p>
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
            Contact your administrator to set up the EASY_APPOINTMENTS_URL and EASY_APPOINTMENTS_KEY environment variables.
          </p>
        </div>
      </div>
    );
  }

  if (connectionState === 'unreachable') {
    return (
      <div className="flex items-start gap-3 p-4 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20">
        <WifiOff className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
            Unable to connect to Easy!Appointments
          </p>
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
            The server may be temporarily unavailable. Check your connection and try again.
          </p>
        </div>
        <Tooltip content="Retry connecting to Easy!Appointments">
          <Button size="sm" variant="outline" onClick={onTest} disabled={testing}>
            {testing ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <RefreshCw className="w-3 h-3 mr-1" />}
            Retry
          </Button>
        </Tooltip>
      </div>
    );
  }

  if (connectionState === 'not_connected' || !integration) {
    return (
      <div className="flex items-start gap-3 p-4 rounded-lg border border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-800/50">
        <AlertCircle className="w-5 h-5 text-secondary-400 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-secondary-500">
          Not connected &mdash; Configure your calendar below and save to enable automated booking.
        </p>
      </div>
    );
  }

  // Connected state
  return (
    <>
      <div className="flex items-center justify-between p-4 rounded-lg border border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-800/50">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-500" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
                Connected to Easy!Appointments
              </span>
              <Tooltip content={integration.is_active ? 'Calendar is accepting bookings' : 'Calendar is not accepting bookings'}>
                <Badge variant="outline" className="text-xs">
                  {integration.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </Tooltip>
            </div>
            <span className="text-xs text-secondary-500">
              Connected {new Date(integration.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Tooltip content="Test the connection to Easy!Appointments">
            <Button size="sm" variant="outline" onClick={onTest} disabled={testing}>
              {testing && <Loader2 className="w-3 h-3 mr-1 animate-spin" />}
              Test
            </Button>
          </Tooltip>
          <Tooltip content="Remove the calendar connection. Existing bookings are not affected.">
            <Button
              size="sm"
              variant="ghost"
              className="text-red-500 hover:text-red-700"
              onClick={() => setShowDisconnectDialog(true)}
            >
              Disconnect
            </Button>
          </Tooltip>
        </div>
      </div>

      <Dialog open={showDisconnectDialog} onOpenChange={setShowDisconnectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Disconnect Calendar?</DialogTitle>
            <DialogDescription>
              {activeBookingCount > 0
                ? `You have ${activeBookingCount} active booking${activeBookingCount !== 1 ? 's' : ''}. Disconnecting will not cancel them, but the chatbot will no longer be able to create new bookings.`
                : 'Disconnecting will prevent the chatbot from creating new bookings.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowDisconnectDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                onDisconnect();
                setShowDisconnectDialog(false);
              }}
            >
              Disconnect
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
