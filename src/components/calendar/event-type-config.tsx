'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { EventTypeConfig } from '@/lib/calendar/types';

const DURATION_OPTIONS = [15, 30, 45, 60, 90, 120];

const selectClasses = 'w-full border border-secondary-200 dark:border-secondary-700 rounded-md px-3 py-2 bg-white dark:bg-secondary-900 text-sm text-secondary-900 dark:text-secondary-100 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 outline-none';

interface EventTypeConfigFormProps {
  value: EventTypeConfig;
  onChange: (config: EventTypeConfig) => void;
}

export function EventTypeConfigForm({ value, onChange }: EventTypeConfigFormProps) {
  const [tzSearch, setTzSearch] = useState('');

  const allTimezones = useMemo(() => Intl.supportedValuesOf('timeZone'), []);
  const filteredTimezones = useMemo(() => {
    if (!tzSearch) return allTimezones;
    const q = tzSearch.toLowerCase();
    return allTimezones.filter(tz => tz.toLowerCase().includes(q));
  }, [allTimezones, tzSearch]);

  const update = (updates: Partial<EventTypeConfig>) => {
    onChange({ ...value, ...updates });
  };

  const safeNumber = (val: string, min: number, max: number, fallback: number): number => {
    const n = Number(val);
    if (isNaN(n)) return fallback;
    return Math.min(max, Math.max(min, n));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            className={`mt-1 ${selectClasses}`}
          >
            {DURATION_OPTIONS.map(d => (
              <option key={d} value={d}>{d} min</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <Label htmlFor="et-desc">Description (optional)</Label>
        <textarea
          id="et-desc"
          value={value.description || ''}
          onChange={(e) => update({ description: e.target.value || undefined })}
          placeholder="Brief description shown to attendees"
          rows={2}
          className="mt-1 w-full border border-secondary-200 dark:border-secondary-700 rounded-md px-3 py-2 bg-white dark:bg-secondary-900 text-sm text-secondary-900 dark:text-secondary-100 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 outline-none resize-none"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="et-buffer-before">Buffer Before (min)</Label>
          <Input
            id="et-buffer-before"
            type="number"
            min={0}
            max={120}
            value={value.bufferBeforeMinutes}
            onChange={(e) => update({ bufferBeforeMinutes: safeNumber(e.target.value, 0, 120, 0) })}
            onBlur={(e) => update({ bufferBeforeMinutes: safeNumber(e.target.value, 0, 120, 0) })}
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
            onChange={(e) => update({ bufferAfterMinutes: safeNumber(e.target.value, 0, 120, 0) })}
            onBlur={(e) => update({ bufferAfterMinutes: safeNumber(e.target.value, 0, 120, 0) })}
            className="mt-1"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="et-notice">Minimum Notice (hours)</Label>
          <Input
            id="et-notice"
            type="number"
            min={0}
            max={168}
            value={value.minNoticeHours}
            onChange={(e) => update({ minNoticeHours: safeNumber(e.target.value, 0, 168, 1) })}
            onBlur={(e) => update({ minNoticeHours: safeNumber(e.target.value, 0, 168, 1) })}
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
            onChange={(e) => update({ maxDaysAhead: safeNumber(e.target.value, 1, 365, 30) })}
            onBlur={(e) => update({ maxDaysAhead: safeNumber(e.target.value, 1, 365, 30) })}
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="et-tz">Timezone</Label>
        <div className="relative mt-1">
          <Input
            id="et-tz-search"
            value={tzSearch}
            onChange={(e) => setTzSearch(e.target.value)}
            placeholder="Search timezone..."
            className="mb-1"
          />
          <select
            id="et-tz"
            value={value.timezone}
            onChange={(e) => { update({ timezone: e.target.value }); setTzSearch(''); }}
            size={6}
            className={selectClasses}
          >
            {filteredTimezones.map(tz => (
              <option key={tz} value={tz}>{tz.replace(/_/g, ' ')}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
