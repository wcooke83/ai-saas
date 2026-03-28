'use client';

import { Loader2, Save, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip } from '@/components/ui/tooltip';

interface StickySaveBarProps {
  isDirty: boolean;
  saving: boolean;
  onSave: () => void;
  onTest?: () => void;
  testing?: boolean;
  isNewSetup?: boolean;
  hasIntegration: boolean;
}

export function StickySaveBar({
  isDirty,
  saving,
  onSave,
  onTest,
  testing,
  isNewSetup,
  hasIntegration,
}: StickySaveBarProps) {
  if (!isDirty && !isNewSetup) return null;

  return (
    <div className="flex items-center justify-end gap-3 pt-2">
      {isDirty && (
        <div className="flex items-center gap-1.5">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <span className="text-sm text-amber-600 dark:text-amber-400 font-medium">
            Unsaved changes
          </span>
        </div>
      )}
      {hasIntegration && onTest && (
        <Tooltip content="Verify the connection to Easy!Appointments before saving">
          <Button variant="outline" size="sm" onClick={onTest} disabled={testing}>
            {testing && <Loader2 className="w-3 h-3 mr-1 animate-spin" />}
            Test Connection
          </Button>
        </Tooltip>
      )}
      <Tooltip content={isNewSetup ? 'Save settings and connect to Easy!Appointments' : 'Save all calendar settings'}>
        <Button onClick={onSave} disabled={saving || (!isDirty && !isNewSetup)}>
          {saving ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          {saving ? 'Saving...' : isNewSetup ? 'Save & Connect Calendar' : 'Save Changes'}
        </Button>
      </Tooltip>
    </div>
  );
}
