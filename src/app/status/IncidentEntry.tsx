'use client';

import { useRef, useState } from 'react';
import type { StatusIncidentWithUpdates, UpdateStatus } from '@/types/status';
import { formatIncidentDate, formatUpdateTime, formatDuration } from './formatters';

interface IncidentHistoryListProps {
  incidents: StatusIncidentWithUpdates[];
}

function groupByMonth(incidents: StatusIncidentWithUpdates[]): Map<string, StatusIncidentWithUpdates[]> {
  const map = new Map<string, StatusIncidentWithUpdates[]>();
  for (const inc of incidents) {
    const key = new Date(inc.resolved_at ?? inc.created_at).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    });
    const existing = map.get(key);
    if (existing) {
      existing.push(inc);
    } else {
      map.set(key, [inc]);
    }
  }
  return map;
}

const updateStatusColors: Record<UpdateStatus, string> = {
  Investigating: 'text-red-600 dark:text-red-400',
  Identified:    'text-amber-600 dark:text-amber-400',
  Monitoring:    'text-sky-600 dark:text-sky-400',
  Resolved:      'text-emerald-600 dark:text-emerald-400',
};

function ChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg
      aria-hidden="true"
      width={14}
      height={14}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function IncidentItem({ incident }: { incident: StatusIncidentWithUpdates }) {
  const [expanded, setExpanded] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const bodyId = `incident-body-${incident.id}`;

  const duration =
    incident.resolved_at
      ? formatDuration(incident.started_at, incident.resolved_at)
      : null;

  return (
    <li className="relative pl-10 pb-8 last:pb-0">
      {/* Timeline node */}
      <span
        aria-hidden="true"
        className="absolute left-0 top-0.5 h-4 w-4 rounded-full ring-4 ring-white dark:ring-secondary-950 bg-secondary-300 dark:bg-secondary-600"
      />

      <button
        type="button"
        aria-expanded={expanded}
        aria-controls={bodyId}
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-start justify-between gap-3 text-left"
      >
        <div className="min-w-0">
          <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
            {incident.title}
          </p>
          <p className="mt-0.5 text-xs text-secondary-400">
            {formatIncidentDate(incident.resolved_at ?? incident.created_at)}
            {duration && (
              <>
                <span className="mx-1.5" aria-hidden="true">·</span>
                {duration}
              </>
            )}
          </p>
        </div>
        <span className="mt-0.5 flex-shrink-0 text-secondary-400">
          <ChevronIcon expanded={expanded} />
        </span>
      </button>

      <div
        id={bodyId}
        ref={bodyRef}
        style={{ maxHeight: expanded ? (bodyRef.current?.scrollHeight ?? 9999) : 0 }}
        className="overflow-hidden transition-[max-height] duration-300 ease-in-out"
      >
        {incident.updates.length > 0 ? (
          <ul className="mt-3 space-y-3 border-l border-secondary-100 dark:border-secondary-800 pl-4 pb-2">
            {incident.updates.map((update) => (
              <li key={update.id} className="text-sm text-secondary-600 dark:text-secondary-300">
                <span className="mr-2 font-mono text-xs text-secondary-400">
                  {formatUpdateTime(update.created_at)}
                </span>
                <span
                  className={`mr-2 text-xs font-medium uppercase tracking-wide ${updateStatusColors[update.status]}`}
                >
                  {update.status}
                </span>
                {update.message}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 pl-4 text-xs text-secondary-400 italic">No updates recorded.</p>
        )}
      </div>
    </li>
  );
}

export function IncidentHistoryList({ incidents }: IncidentHistoryListProps) {
  const grouped = groupByMonth(incidents);

  return (
    <div className="space-y-10">
      {Array.from(grouped.entries()).map(([month, items]) => (
        <div key={month}>
          <p className="mb-4 text-sm font-medium text-secondary-600 dark:text-secondary-400">
            {month}
          </p>
          <div className="relative">
            {/* Vertical track */}
            <span
              aria-hidden="true"
              className="absolute left-[7px] top-0 h-full w-0.5 bg-secondary-100 dark:bg-secondary-800"
            />
            <ol className="space-y-0">
              {items.map((inc) => (
                <IncidentItem key={inc.id} incident={inc} />
              ))}
            </ol>
          </div>
        </div>
      ))}
    </div>
  );
}
