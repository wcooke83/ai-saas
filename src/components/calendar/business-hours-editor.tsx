'use client';

import { Label } from '@/components/ui/label';
import type { BusinessHoursEntry } from '@/lib/calendar/types';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
  const h = String(Math.floor(i / 2)).padStart(2, '0');
  const m = i % 2 === 0 ? '00' : '30';
  return `${h}:${m}`;
});

interface BusinessHoursEditorProps {
  value: BusinessHoursEntry[];
  onChange: (hours: BusinessHoursEntry[]) => void;
}

export function BusinessHoursEditor({ value, onChange }: BusinessHoursEditorProps) {
  const updateDay = (dayOfWeek: number, updates: Partial<BusinessHoursEntry>) => {
    onChange(
      value.map(h => h.dayOfWeek === dayOfWeek ? { ...h, ...updates } : h)
    );
  };

  const copyWeekdayHours = () => {
    const monday = value.find(h => h.dayOfWeek === 1);
    if (!monday) return;
    onChange(
      value.map(h =>
        h.dayOfWeek >= 1 && h.dayOfWeek <= 5
          ? { ...h, startTime: monday.startTime, endTime: monday.endTime, isEnabled: monday.isEnabled }
          : h
      )
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Business Hours</Label>
        <button
          type="button"
          onClick={copyWeekdayHours}
          className="text-xs text-primary-600 dark:text-primary-400 hover:underline"
        >
          Copy Monday to all weekdays
        </button>
      </div>

      <div className="space-y-2">
        {value.map(entry => (
          <div
            key={entry.dayOfWeek}
            className="flex items-center gap-3 py-1.5"
          >
            <div className="w-24 flex items-center gap-2">
              <input
                type="checkbox"
                checked={entry.isEnabled}
                onChange={(e) => updateDay(entry.dayOfWeek, { isEnabled: e.target.checked })}
                className="h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
              />
              <span className={`text-sm ${entry.isEnabled ? 'text-secondary-900 dark:text-secondary-100' : 'text-secondary-400 dark:text-secondary-600'}`}>
                {DAY_NAMES[entry.dayOfWeek].slice(0, 3)}
              </span>
            </div>

            {entry.isEnabled ? (
              <div className="flex items-center gap-2">
                <select
                  value={entry.startTime}
                  onChange={(e) => updateDay(entry.dayOfWeek, { startTime: e.target.value })}
                  className="text-sm border border-secondary-200 dark:border-secondary-700 rounded-md px-2 py-1.5 bg-white dark:bg-secondary-900 text-secondary-900 dark:text-secondary-100"
                >
                  {TIME_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <span className="text-secondary-400">–</span>
                <select
                  value={entry.endTime}
                  onChange={(e) => updateDay(entry.dayOfWeek, { endTime: e.target.value })}
                  className="text-sm border border-secondary-200 dark:border-secondary-700 rounded-md px-2 py-1.5 bg-white dark:bg-secondary-900 text-secondary-900 dark:text-secondary-100"
                >
                  {TIME_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            ) : (
              <span className="text-sm text-secondary-400 dark:text-secondary-600">Closed</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
