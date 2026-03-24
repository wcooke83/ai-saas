'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { EventTypeConfig } from '@/lib/calendar/types';

const DURATION_OPTIONS = [15, 30, 45, 60, 90, 120];

interface EventTypeConfigFormProps {
  value: EventTypeConfig;
  onChange: (config: EventTypeConfig) => void;
}

export function EventTypeConfigForm({ value, onChange }: EventTypeConfigFormProps) {
  const update = (updates: Partial<EventTypeConfig>) => {
    onChange({ ...value, ...updates });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="et-title">Appointment Name</Label>
          <Input
            id="et-title"
            value={value.title}
            onChange={(e) => update({ title: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
            placeholder="e.g. Consultation"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="et-duration">Duration</Label>
          <select
            id="et-duration"
            value={value.durationMinutes}
            onChange={(e) => update({ durationMinutes: Number(e.target.value) })}
            className="mt-1 w-full border border-secondary-200 dark:border-secondary-700 rounded-md px-3 py-2 bg-white dark:bg-secondary-900 text-sm text-secondary-900 dark:text-secondary-100"
          >
            {DURATION_OPTIONS.map(d => (
              <option key={d} value={d}>{d} min</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <Label htmlFor="et-desc">Description (optional)</Label>
        <Input
          id="et-desc"
          value={value.description || ''}
          onChange={(e) => update({ description: e.target.value || undefined })}
          placeholder="Brief description shown to attendees"
          className="mt-1"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="et-buffer-before">Buffer Before (min)</Label>
          <Input
            id="et-buffer-before"
            type="number"
            min={0}
            max={120}
            value={value.bufferBeforeMinutes}
            onChange={(e) => update({ bufferBeforeMinutes: Number(e.target.value) })}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="et-buffer-after">Buffer After (min)</Label>
          <Input
            id="et-buffer-after"
            type="number"
            min={0}
            max={120}
            value={value.bufferAfterMinutes}
            onChange={(e) => update({ bufferAfterMinutes: Number(e.target.value) })}
            className="mt-1"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="et-notice">Minimum Notice (hours)</Label>
          <Input
            id="et-notice"
            type="number"
            min={0}
            max={168}
            value={value.minNoticeHours}
            onChange={(e) => update({ minNoticeHours: Number(e.target.value) })}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="et-max-days">Max Days Ahead</Label>
          <Input
            id="et-max-days"
            type="number"
            min={1}
            max={365}
            value={value.maxDaysAhead}
            onChange={(e) => update({ maxDaysAhead: Number(e.target.value) })}
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="et-tz">Timezone</Label>
        <select
          id="et-tz"
          value={value.timezone}
          onChange={(e) => update({ timezone: e.target.value })}
          className="mt-1 w-full border border-secondary-200 dark:border-secondary-700 rounded-md px-3 py-2 bg-white dark:bg-secondary-900 text-sm text-secondary-900 dark:text-secondary-100"
        >
          {Intl.supportedValuesOf('timeZone').map(tz => (
            <option key={tz} value={tz}>{tz}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
