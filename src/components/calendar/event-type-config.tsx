'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { InfoTooltip } from '@/components/ui/tooltip';
import type { EventTypeConfig } from '@/lib/calendar/types';

const DURATION_OPTIONS = [5, 10, 15, 30, 45, 60, 90, 120, 180, 240];

const durationSelectOptions = DURATION_OPTIONS.map((d) => ({
  value: String(d),
  label: `${d} min`,
}));

interface EventTypeConfigFormProps {
  value: EventTypeConfig;
  onChange: (config: EventTypeConfig) => void;
}

export function EventTypeConfigForm({ value, onChange }: EventTypeConfigFormProps) {
  const [tzSearch, setTzSearch] = useState('');
  const [tzOpen, setTzOpen] = useState(false);
  const [tzHighlight, setTzHighlight] = useState(-1);
  const tzContainerRef = useRef<HTMLDivElement>(null);
  const tzInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

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

  // Click outside to close timezone dropdown
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (tzContainerRef.current && !tzContainerRef.current.contains(e.target as Node)) {
        setTzOpen(false);
      }
    }
    if (tzOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [tzOpen]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (tzHighlight >= 0 && listRef.current) {
      const item = listRef.current.children[tzHighlight] as HTMLElement;
      item?.scrollIntoView({ block: 'nearest' });
    }
  }, [tzHighlight]);

  function handleTzKeyDown(e: React.KeyboardEvent) {
    if (!tzOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setTzOpen(true);
        setTzHighlight(0);
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setTzHighlight(prev => Math.min(prev + 1, filteredTimezones.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setTzHighlight(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (tzHighlight >= 0 && filteredTimezones[tzHighlight]) {
          update({ timezone: filteredTimezones[tzHighlight] });
          setTzSearch('');
          setTzOpen(false);
        }
        break;
      case 'Escape':
        setTzOpen(false);
        setTzSearch('');
        break;
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center gap-1.5">
            <Label htmlFor="et-title">Appointment Name</Label>
            <InfoTooltip content="The name shown to customers when booking. Choose something descriptive like 'Consultation' or 'Discovery Call'." />
          </div>
          <Input
            id="et-title"
            value={value.title}
            onChange={(e) => update({ title: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
            placeholder="e.g. Consultation"
            className="mt-1"
          />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <Label htmlFor="et-duration">Duration</Label>
            <InfoTooltip content="How long each appointment lasts. This should match the duration set on your Easy!Appointments service." />
          </div>
          <Select
            id="et-duration"
            value={String(value.durationMinutes)}
            onChange={(e) => update({ durationMinutes: Number(e.target.value) })}
            options={durationSelectOptions}
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center gap-1.5">
          <Label htmlFor="et-desc">Description</Label>
          <InfoTooltip content="An optional description shown to customers. Use this to set expectations about what the appointment covers." />
        </div>
        <Textarea
          id="et-desc"
          value={value.description || ''}
          onChange={(e) => update({ description: e.target.value || undefined })}
          placeholder="Brief description shown to attendees"
          rows={2}
          className="mt-1 resize-none"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center gap-1.5">
            <Label htmlFor="et-buffer-before">Buffer Before (min)</Label>
            <InfoTooltip content="Free time blocked before each appointment. Useful for preparation. For example, 10 minutes means a 9:00 appointment blocks from 8:50." />
          </div>
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
          <div className="flex items-center gap-1.5">
            <Label htmlFor="et-buffer-after">Buffer After (min)</Label>
            <InfoTooltip content="Free time blocked after each appointment. Useful for follow-up notes or breaks between appointments." />
          </div>
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
          <div className="flex items-center gap-1.5">
            <Label htmlFor="et-notice">Minimum Notice (hours)</Label>
            <InfoTooltip content="How far in advance an appointment must be booked. Set to 1 hour to prevent last-minute bookings, or 24 for next-day minimum." />
          </div>
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
          <div className="flex items-center gap-1.5">
            <Label htmlFor="et-max-days">Max Days Ahead</Label>
            <InfoTooltip content="How far into the future customers can book. Set to 30 for one month ahead, or 90 for three months." />
          </div>
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

      <div ref={tzContainerRef}>
        <div className="flex items-center gap-1.5 mb-1">
          <Label htmlFor="et-tz-search">Timezone</Label>
          <InfoTooltip content="The timezone used for displaying and calculating available appointment slots. Should match your business location." />
        </div>
        <Badge variant="outline" className="mb-2 text-xs">
          {value.timezone.replace(/_/g, ' ')}
        </Badge>
        <div className="relative">
          <Input
            ref={tzInputRef}
            id="et-tz-search"
            value={tzSearch}
            onChange={(e) => {
              setTzSearch(e.target.value);
              setTzOpen(true);
              setTzHighlight(0);
            }}
            onFocus={() => setTzOpen(true)}
            onKeyDown={handleTzKeyDown}
            placeholder="Search timezone..."
            autoComplete="off"
          />
          {tzOpen && filteredTimezones.length > 0 && (
            <ul
              ref={listRef}
              role="listbox"
              className="absolute z-50 w-full mt-1 max-h-48 overflow-y-auto rounded-md border border-secondary-200 dark:border-secondary-700 shadow-lg"
              style={{ backgroundColor: 'rgb(var(--form-element-bg))' }}
            >
              {filteredTimezones.map((tz, i) => (
                <li
                  key={tz}
                  role="option"
                  aria-selected={tz === value.timezone}
                  className={`px-3 py-1.5 text-sm cursor-pointer ${
                    i === tzHighlight
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-900 dark:text-primary-100'
                      : tz === value.timezone
                        ? 'bg-secondary-100 dark:bg-secondary-800 font-medium'
                        : 'text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-800'
                  }`}
                  onClick={() => {
                    update({ timezone: tz });
                    setTzSearch('');
                    setTzOpen(false);
                  }}
                  onMouseEnter={() => setTzHighlight(i)}
                >
                  {tz.replace(/_/g, ' ')}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
