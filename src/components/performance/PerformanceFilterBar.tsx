'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { Calendar, ChevronDown, X, RefreshCw } from 'lucide-react';

export interface PerformanceFilters {
  days: number | null;
  from: string | null;
  to: string | null;
  models: string[];
  liveFetchTriggered: boolean | null;
  slowOnly: boolean;
}

export const DEFAULT_FILTERS: PerformanceFilters = {
  days: 1,
  from: null,
  to: null,
  models: [],
  liveFetchTriggered: null,
  slowOnly: false,
};

const TIME_PRESETS = [
  { label: '24h', days: 1 },
  { label: '7d', days: 7 },
  { label: '30d', days: 30 },
  { label: '90d', days: 90 },
] as const;

interface PerformanceFilterBarProps {
  filters: PerformanceFilters;
  onChange: (filters: PerformanceFilters) => void;
  availableModels: string[];
  loading?: boolean;
  onRefresh: () => void;
}

function ModelFilter({
  selected,
  available,
  onChange,
}: {
  selected: string[];
  available: string[];
  onChange: (models: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  if (available.length <= 1) return null;

  const label =
    selected.length === 0
      ? 'All models'
      : selected.length === 1
        ? selected[0]
        : `${selected.length} models`;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
          selected.length > 0
            ? 'bg-blue-600/20 text-blue-300 border-blue-600/40'
            : 'bg-secondary-800 text-secondary-300 border-secondary-700 hover:bg-secondary-700'
        }`}
      >
        {label}
        <ChevronDown className="w-3 h-3" />
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-2 z-50 bg-secondary-800 border border-secondary-700 rounded-lg py-1 shadow-xl min-w-[200px]">
          {available.map((model) => {
            const isSelected = selected.includes(model);
            return (
              <button
                key={model}
                onClick={() =>
                  onChange(isSelected ? selected.filter((m) => m !== model) : [...selected, model])
                }
                className={`w-full text-left px-3 py-1.5 text-xs transition-colors flex items-center gap-2 ${
                  isSelected ? 'bg-blue-600/20 text-blue-300' : 'text-secondary-300 hover:bg-secondary-700'
                }`}
              >
                <div
                  className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${
                    isSelected ? 'bg-blue-600 border-blue-600' : 'border-secondary-500'
                  }`}
                >
                  {isSelected && (
                    <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span className="font-mono truncate">{model}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ToggleChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
        active
          ? 'bg-blue-600/20 text-blue-300 border-blue-600/40'
          : 'bg-secondary-800 text-secondary-300 border-secondary-700 hover:bg-secondary-700'
      }`}
    >
      {label}
    </button>
  );
}

export function PerformanceFilterBar({ filters, onChange, availableModels, loading, onRefresh }: PerformanceFilterBarProps) {
  const [showCustom, setShowCustom] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showCustom) return;
    const handler = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) setShowCustom(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showCustom]);

  const hasActiveFilters = filters.models.length > 0 || filters.liveFetchTriggered !== null || filters.slowOnly;

  const patch = useCallback(
    (p: Partial<PerformanceFilters>) => onChange({ ...filters, ...p }),
    [filters, onChange],
  );

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Time presets */}
      <div className="flex rounded-lg border border-secondary-700 overflow-hidden">
        {TIME_PRESETS.map((preset) => (
          <button
            key={preset.days}
            onClick={() => patch({ days: preset.days, from: null, to: null })}
            className={`px-3 py-1.5 text-xs font-medium transition-colors ${
              filters.days === preset.days
                ? 'bg-blue-600 text-white'
                : 'bg-secondary-800 text-secondary-300 hover:bg-secondary-700 hover:text-secondary-100'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Custom date range */}
      <div className="relative" ref={popoverRef}>
        <button
          onClick={() => setShowCustom(!showCustom)}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
            filters.days === null
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-secondary-800 text-secondary-300 border-secondary-700 hover:bg-secondary-700 hover:text-secondary-100'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          Custom
        </button>
        {showCustom && (
          <div className="absolute right-0 top-full mt-2 z-50 bg-secondary-800 border border-secondary-700 rounded-lg p-4 shadow-xl min-w-[280px]">
            <p className="text-xs font-medium text-secondary-300 mb-3">Custom Date Range</p>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] text-secondary-400 uppercase tracking-wider">From</label>
                <input
                  type="datetime-local"
                  value={filters.from?.slice(0, 16) || ''}
                  onChange={(e) => patch({ days: null, from: e.target.value ? new Date(e.target.value).toISOString() : null })}
                  className="w-full mt-1 rounded-md border border-secondary-600 bg-secondary-900 text-secondary-100 text-xs px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-[10px] text-secondary-400 uppercase tracking-wider">To</label>
                <input
                  type="datetime-local"
                  value={filters.to?.slice(0, 16) || ''}
                  onChange={(e) => patch({ days: null, to: e.target.value ? new Date(e.target.value).toISOString() : null })}
                  className="w-full mt-1 rounded-md border border-secondary-600 bg-secondary-900 text-secondary-100 text-xs px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
            <button
              onClick={() => setShowCustom(false)}
              className="mt-3 w-full text-xs bg-blue-600 hover:bg-blue-500 text-white rounded-md py-1.5 transition-colors"
            >
              Apply
            </button>
          </div>
        )}
      </div>

      <div className="w-px h-6 bg-secondary-700" />

      {/* Model filter */}
      <ModelFilter selected={filters.models} available={availableModels} onChange={(models) => patch({ models })} />

      {/* Live fetch toggle */}
      <ToggleChip
        label="Live Fetch Only"
        active={filters.liveFetchTriggered === true}
        onClick={() => patch({ liveFetchTriggered: filters.liveFetchTriggered === true ? null : true })}
      />

      {/* Slow only toggle */}
      <ToggleChip
        label="Slow Only"
        active={filters.slowOnly}
        onClick={() => patch({ slowOnly: !filters.slowOnly })}
      />

      {/* Clear filters */}
      {hasActiveFilters && (
        <button
          onClick={() => onChange({ ...filters, models: [], liveFetchTriggered: null, slowOnly: false })}
          className="flex items-center gap-1 px-2 py-1.5 text-xs text-secondary-400 hover:text-secondary-200 transition-colors"
        >
          <X className="w-3 h-3" />
          Clear
        </button>
      )}

      {/* Refresh */}
      <button
        onClick={onRefresh}
        disabled={loading}
        className="ml-auto flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-secondary-700 bg-secondary-800 text-secondary-300 hover:bg-secondary-700 hover:text-secondary-100 transition-colors disabled:opacity-50"
      >
        <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        Refresh
      </button>
    </div>
  );
}
