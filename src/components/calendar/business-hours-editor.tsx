'use client';

import { useState } from 'react';
import { Copy, Plus, Trash2, Pencil, CalendarOff } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Tooltip, InfoTooltip } from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { MultiSelect } from '@/components/ui/multi-select';
import {
  DEFAULT_BUSINESS_HOURS,
  businessHoursSetKey,
} from '@/lib/calendar/types';
import type { BusinessHoursEntry, BusinessHoursSet } from '@/lib/calendar/types';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
  const h = String(Math.floor(i / 2)).padStart(2, '0');
  const m = i % 2 === 0 ? '00' : '30';
  return `${h}:${m}`;
});

const timeSelectOptions = TIME_OPTIONS.map((t) => ({ value: t, label: t }));

/* ─── Internal DayGrid sub-component ─── */

function DayGrid({
  value,
  onChange,
}: {
  value: BusinessHoursEntry[];
  onChange: (hours: BusinessHoursEntry[]) => void;
}) {
  const updateDay = (dayOfWeek: number, updates: Partial<BusinessHoursEntry>) => {
    const current = value.find(h => h.dayOfWeek === dayOfWeek);
    if (!current) return;

    const merged = { ...current, ...updates };

    if (merged.isEnabled && merged.endTime <= merged.startTime) {
      toast.error('End time must be after start time');
      return;
    }

    onChange(value.map(h => h.dayOfWeek === dayOfWeek ? merged : h));
  };

  const copyWeekdayHours = () => {
    const source = value.find(h => h.dayOfWeek >= 1 && h.dayOfWeek <= 5 && h.isEnabled);
    if (!source) {
      toast.error('Enable at least one weekday first');
      return;
    }
    onChange(
      value.map(h =>
        h.dayOfWeek >= 1 && h.dayOfWeek <= 5
          ? { ...h, startTime: source.startTime, endTime: source.endTime, isEnabled: source.isEnabled }
          : h
      )
    );
    toast.success(`${DAY_NAMES[source.dayOfWeek]} hours copied to all weekdays`);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-end">
        <Tooltip content="Apply this day's hours to Monday through Friday">
          <button
            type="button"
            onClick={copyWeekdayHours}
            className="inline-flex items-center gap-1 text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 outline-none rounded px-1.5 py-0.5"
          >
            <Copy className="w-3 h-3" />
            Copy to all weekdays
          </button>
        </Tooltip>
      </div>

      <div className="space-y-2">
        {value.map(entry => (
          <div
            key={entry.dayOfWeek}
            className="flex items-center gap-3 py-1"
          >
            <div className="w-24 flex items-center gap-2">
              <Tooltip content="Toggle whether bookings are available on this day">
                <input
                  type="checkbox"
                  checked={entry.isEnabled}
                  onChange={(e) => updateDay(entry.dayOfWeek, { isEnabled: e.target.checked })}
                  className="h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500 focus-visible:ring-2 focus-visible:ring-primary-500"
                  aria-label={`Enable ${DAY_NAMES[entry.dayOfWeek]}`}
                />
              </Tooltip>
              <span className={`text-sm ${entry.isEnabled ? 'text-secondary-900 dark:text-secondary-100' : 'text-secondary-400 dark:text-secondary-600'}`}>
                {DAY_NAMES[entry.dayOfWeek].slice(0, 3)}
              </span>
            </div>

            {entry.isEnabled ? (
              <div className="flex items-center gap-2">
                <Select
                  value={entry.startTime}
                  onChange={(e) => updateDay(entry.dayOfWeek, { startTime: e.target.value })}
                  options={timeSelectOptions}
                  aria-label={`${DAY_NAMES[entry.dayOfWeek]} start time`}
                  className="px-2 py-1.5 text-sm h-auto"
                />
                <span className="text-secondary-400">–</span>
                <Select
                  value={entry.endTime}
                  onChange={(e) => updateDay(entry.dayOfWeek, { endTime: e.target.value })}
                  options={TIME_OPTIONS.filter(t => t > entry.startTime).map(t => ({ value: t, label: t }))}
                  aria-label={`${DAY_NAMES[entry.dayOfWeek]} end time`}
                  className="px-2 py-1.5 text-sm h-auto"
                />
                {entry.endTime <= entry.startTime && (
                  <span className="text-xs text-red-500">Invalid</span>
                )}
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

/* ─── Scope label helper ─── */

function scopeLabel(
  set: BusinessHoursSet,
  services: { id: number; name: string }[],
  providers: { id: number; firstName: string; lastName: string; services: number[] }[],
): string {
  const svcNames = set.serviceIds?.length
    ? set.serviceIds.map(id => services.find(s => String(s.id) === id)?.name ?? 'Unknown').join(', ')
    : 'All services';
  const prvNames = set.providerIds?.length
    ? set.providerIds
        .map(id => {
          const p = providers.find(pr => String(pr.id) === id);
          return p ? `${p.firstName} ${p.lastName}` : 'Unknown';
        })
        .join(', ')
    : 'All providers';
  return `${svcNames} \u2014 ${prvNames}`;
}

/* ─── Props ─── */

interface BusinessHoursEditorProps {
  globalHours: BusinessHoursEntry[];
  onGlobalChange: (hours: BusinessHoursEntry[]) => void;
  scopedSets: BusinessHoursSet[];
  onScopedSetsChange: (sets: BusinessHoursSet[]) => void;
  services: { id: number; name: string }[];
  providers: { id: number; firstName: string; lastName: string; services: number[] }[];
}

/* ─── Main component ─── */

export function BusinessHoursEditor({
  globalHours,
  onGlobalChange,
  scopedSets,
  onScopedSetsChange,
  services,
  providers,
}: BusinessHoursEditorProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingGlobal, setEditingGlobal] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [formLabel, setFormLabel] = useState('');
  const [formServiceIds, setFormServiceIds] = useState<string[]>([]);
  const [formProviderIds, setFormProviderIds] = useState<string[]>([]);
  const [formHours, setFormHours] = useState<BusinessHoursEntry[]>(DEFAULT_BUSINESS_HOURS.map(h => ({ ...h })));

  function resetForm() {
    setShowForm(false);
    setEditingId(null);
    setFormLabel('');
    setFormServiceIds([]);
    setFormProviderIds([]);
    setFormHours(DEFAULT_BUSINESS_HOURS.map(h => ({ ...h })));
  }

  function openAddForm() {
    resetForm();
    setShowForm(true);
  }

  function openEditForm(set: BusinessHoursSet) {
    setEditingId(set.id);
    setFormLabel(set.label ?? '');
    setFormServiceIds(set.serviceIds ?? []);
    setFormProviderIds(set.providerIds ?? []);
    setFormHours(set.hours.map(h => ({ ...h })));
    setShowForm(true);
  }

  function handleSubmit() {
    const candidateServiceIds = formServiceIds.length > 0 ? formServiceIds : undefined;
    const candidateProviderIds = formProviderIds.length > 0 ? formProviderIds : undefined;

    // Duplicate scope detection
    const candidateKey = businessHoursSetKey({ serviceIds: candidateServiceIds, providerIds: candidateProviderIds });
    const duplicate = scopedSets.find(s => s.id !== editingId && businessHoursSetKey(s) === candidateKey);
    if (duplicate) {
      toast.error('Scoped business hours for this scope already exist');
      return;
    }

    const entry: BusinessHoursSet = {
      id: editingId ?? crypto.randomUUID(),
      hours: formHours,
      ...(formLabel.trim() ? { label: formLabel.trim() } : {}),
      ...(candidateServiceIds ? { serviceIds: candidateServiceIds } : {}),
      ...(candidateProviderIds ? { providerIds: candidateProviderIds } : {}),
    };

    if (editingId) {
      onScopedSetsChange(scopedSets.map(s => s.id === editingId ? entry : s));
    } else {
      onScopedSetsChange([...scopedSets, entry]);
    }
    resetForm();
  }

  function handleFormServiceIdsChange(newServiceIds: string[]) {
    setFormServiceIds(newServiceIds);
    if (newServiceIds.length > 0) {
      const validProviderIds = providers
        .filter(p => newServiceIds.some(sId => p.services.includes(Number(sId))))
        .map(p => String(p.id));
      setFormProviderIds(prev => prev.filter(id => validProviderIds.includes(id)));
    }
  }

  const deleteScopedSet = (id: string) => {
    onScopedSetsChange(scopedSets.filter(s => s.id !== id));
    if (editingId === id) resetForm();
  };

  const serviceOptions = services.map(s => ({ value: String(s.id), label: s.name }));

  const filteredFormProviders = formServiceIds.length === 0
    ? providers
    : providers.filter(p => formServiceIds.some(sId => p.services.includes(Number(sId))));
  const filteredFormProviderOptions = filteredFormProviders.map(p => ({
    value: String(p.id),
    label: `${p.firstName} ${p.lastName}`,
  }));

  return (
    <div className="space-y-6">
      {/* ── Global Hours ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-secondary-900 dark:text-secondary-100 flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-secondary-400" />
              Global Business Hours
            </h4>
            <p className="text-xs text-secondary-500 mt-0.5">Applies to all services and providers unless overridden below.</p>
          </div>
          {!editingGlobal && (
            <Button
              size="sm"
              variant="ghost"
              className="text-secondary-500 hover:text-secondary-700 h-7 w-7 p-0"
              onClick={() => setEditingGlobal(true)}
            >
              <Pencil className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>

        {editingGlobal ? (
          <div className="p-4 rounded-lg border border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-800/50 space-y-4">
            <DayGrid value={globalHours} onChange={onGlobalChange} />
            <div className="flex gap-2 pt-1">
              <Button size="sm" onClick={() => setEditingGlobal(false)}>
                Done
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-xs text-secondary-500 flex flex-wrap gap-x-3 gap-y-1">
            {globalHours.map(entry => (
              <span key={entry.dayOfWeek}>
                <span className={entry.isEnabled ? 'font-medium text-secondary-700 dark:text-secondary-300' : 'text-secondary-400 italic'}>
                  {DAY_NAMES[entry.dayOfWeek].slice(0, 3)}
                </span>
                {entry.isEnabled ? (
                  <span className="ml-1">{entry.startTime}–{entry.endTime}</span>
                ) : (
                  <span className="ml-1">Off</span>
                )}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-secondary-200 dark:border-secondary-700" />

      {/* ── Scoped Hours ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-secondary-900 dark:text-secondary-100 flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-primary-500" />
              Scoped Business Hours
            </h4>
            <p className="text-xs text-secondary-500 mt-0.5">Apply only to selected services or providers</p>
          </div>
          {!showForm && (
            <Tooltip content="Add business hours for specific services or providers">
              <Button size="sm" variant="outline" onClick={openAddForm}>
                <Plus className="w-3.5 h-3.5 mr-1" />
                Add Business Hours
              </Button>
            </Tooltip>
          )}
        </div>

        {/* Inline form */}
        {showForm && (
          <div className="p-4 rounded-lg border border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-800/50 space-y-4">
            {/* Label */}
            <div>
              <div className="flex items-center gap-1">
                <Label className="text-xs font-medium">Label (optional)</Label>
                <InfoTooltip content="A label to identify this set, e.g. 'Massage Therapy Hours'" />
              </div>
              <Input
                type="text"
                placeholder="e.g. Massage Therapy Hours"
                value={formLabel}
                onChange={(e) => setFormLabel(e.target.value)}
                className="mt-1 max-w-sm"
                maxLength={100}
              />
            </div>

            {/* Scope selectors */}
            <div>
              <div className="flex items-center gap-1 mb-1.5">
                <Label className="text-xs font-medium">Scope</Label>
                <InfoTooltip content="Narrow these hours to specific services and/or providers." />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-secondary-500">Services</Label>
                  <div className="mt-1">
                    <MultiSelect
                      options={serviceOptions}
                      selected={formServiceIds}
                      onChange={handleFormServiceIdsChange}
                      allLabel="All services"
                      placeholder="services"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-secondary-500">Providers</Label>
                  <div className="mt-1">
                    <MultiSelect
                      options={filteredFormProviderOptions}
                      selected={formProviderIds}
                      onChange={setFormProviderIds}
                      allLabel="All providers"
                      placeholder="providers"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Hours grid */}
            <DayGrid value={formHours} onChange={setFormHours} />

            {/* Action buttons */}
            <div className="flex gap-2 pt-1">
              <Button size="sm" onClick={handleSubmit}>
                {editingId ? 'Update' : 'Add'}
              </Button>
              <Button size="sm" variant="ghost" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* List or empty state */}
        {scopedSets.length === 0 ? (
          <div className="flex items-start gap-2 py-4">
            <CalendarOff className="w-4 h-4 text-secondary-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-secondary-500">
              No scoped business hours. Add business hours for specific services or providers.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-secondary-100 dark:divide-secondary-800">
            {scopedSets.map(set => (
              <div key={set.id} className="flex items-center justify-between py-2">
                <div className="min-w-0">
                  <span className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
                    {set.label || 'Business Hours'}
                  </span>
                  <p className="text-xs text-primary-600 dark:text-primary-400 mt-0.5 truncate">
                    {scopeLabel(set, services, providers)}
                  </p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Button
                      size="sm"
                      variant="ghost"
                      className="text-secondary-500 hover:text-secondary-700 h-7 w-7 p-0"
                      onClick={() => openEditForm(set)}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                  <Tooltip content="Remove this business hours rule. The global schedule applies instead.">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-500 hover:text-red-700 h-7 w-7 p-0"
                      onClick={() => setConfirmDeleteId(set.id)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </Tooltip>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={confirmDeleteId !== null} onOpenChange={() => setConfirmDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Scoped Business Hours?</DialogTitle>
            <DialogDescription>
              The global business hours will apply for the affected services and providers instead.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setConfirmDeleteId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (confirmDeleteId) deleteScopedSet(confirmDeleteId);
                setConfirmDeleteId(null);
              }}
            >
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
