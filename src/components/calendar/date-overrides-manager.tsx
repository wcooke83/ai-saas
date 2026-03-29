'use client';

import { useState } from 'react';
import { Pencil, Plus, Trash2, CalendarClock } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
import type { DateOverrideEntry, BusinessHoursEntry } from '@/lib/calendar/types';

const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
  const h = String(Math.floor(i / 2)).padStart(2, '0');
  const m = i % 2 === 0 ? '00' : '30';
  return `${h}:${m}`;
});


interface DateOverridesManagerProps {
  services: { id: number; name: string; duration: number }[];
  providers: { id: number; firstName: string; lastName: string; services: number[] }[];
  businessHours: BusinessHoursEntry[];
  value: DateOverrideEntry[];
  onChange: (overrides: DateOverrideEntry[]) => void;
}

/** Build a unique key for duplicate detection: date + sorted serviceIds + sorted providerIds */
function overrideKey(o: { date: string; serviceIds?: string[]; providerIds?: string[] }): string {
  const sIds = (o.serviceIds || []).sort().join(',');
  const pIds = (o.providerIds || []).sort().join(',');
  return `${o.date}|${sIds}|${pIds}`;
}

/* ─── Main component ─── */

export function DateOverridesManager({
  services,
  providers,
  businessHours,
  value,
  onChange,
}: DateOverridesManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [formDate, setFormDate] = useState('');
  const [formStart, setFormStart] = useState('09:00');
  const [formEnd, setFormEnd] = useState('17:00');
  const [formClosed, setFormClosed] = useState(false);
  const [formLabel, setFormLabel] = useState('');
  const [formServiceIds, setFormServiceIds] = useState<string[]>([]);
  const [formProviderIds, setFormProviderIds] = useState<string[]>([]);
  const [confirmDeleteKey, setConfirmDeleteKey] = useState<string | null>(null);

  const today = new Date().toISOString().split('T')[0];

  // Filter providers by selected services: only show providers that handle at least one selected service
  const filteredProviders = formServiceIds.length === 0
    ? providers
    : providers.filter(p =>
        formServiceIds.some(sId => p.services.includes(Number(sId)))
      );

  // When selected services change, remove any provider selections that are no longer valid
  function handleServiceIdsChange(newServiceIds: string[]) {
    setFormServiceIds(newServiceIds);
    if (newServiceIds.length > 0) {
      const validProviderIds = providers
        .filter(p => newServiceIds.some(sId => p.services.includes(Number(sId))))
        .map(p => String(p.id));
      setFormProviderIds(prev => prev.filter(id => validProviderIds.includes(id)));
    }
  }

  function getNormalHours(dateStr: string): string {
    const d = new Date(dateStr + 'T12:00:00');
    const dayOfWeek = d.getDay();
    const entry = businessHours.find(h => h.dayOfWeek === dayOfWeek);
    if (!entry || !entry.isEnabled) return 'Normally closed';
    return `Normally available ${entry.startTime} \u2013 ${entry.endTime}`;
  }

  function resetForm() {
    setShowForm(false);
    setEditingKey(null);
    setFormDate('');
    setFormStart('09:00');
    setFormEnd('17:00');
    setFormClosed(false);
    setFormLabel('');
    setFormServiceIds([]);
    setFormProviderIds([]);
  }

  function openEditForm(override: DateOverrideEntry) {
    setEditingKey(overrideKey(override));
    setFormDate(override.date);
    setFormStart(override.isClosed ? '09:00' : override.startTime);
    setFormEnd(override.isClosed ? '17:00' : override.endTime);
    setFormClosed(override.isClosed);
    setFormLabel(override.label || '');
    setFormServiceIds(override.serviceIds ?? []);
    setFormProviderIds(override.providerIds ?? []);
    setShowForm(true);
  }

  function handleSubmit() {
    if (!formDate) {
      toast.error('Please select a date');
      return;
    }

    const newKey = overrideKey({
      date: formDate,
      serviceIds: formServiceIds.length > 0 ? formServiceIds : undefined,
      providerIds: formProviderIds.length > 0 ? formProviderIds : undefined,
    });

    if (!editingKey && value.some(o => overrideKey(o) === newKey)) {
      toast.error('An override already exists for this date and scope');
      return;
    }
    if (editingKey && newKey !== editingKey && value.some(o => overrideKey(o) === newKey)) {
      toast.error('An override already exists for this date and scope');
      return;
    }
    if (!formClosed && formEnd <= formStart) {
      toast.error('End time must be after start time');
      return;
    }

    const entry: DateOverrideEntry = {
      date: formDate,
      startTime: formClosed ? '00:00' : formStart,
      endTime: formClosed ? '00:00' : formEnd,
      isClosed: formClosed,
      ...(formLabel.trim() ? { label: formLabel.trim() } : {}),
      ...(formServiceIds.length > 0 ? { serviceIds: formServiceIds } : {}),
      ...(formProviderIds.length > 0 ? { providerIds: formProviderIds } : {}),
    };

    if (editingKey) {
      onChange(value.map(o => overrideKey(o) === editingKey ? entry : o));
    } else {
      onChange([...value, entry]);
    }
    resetForm();
  }

  function handleDelete(key: string) {
    onChange(value.filter(o => overrideKey(o) !== key));
    setConfirmDeleteKey(null);
  }

  function formatDate(dateStr: string): string {
    const d = new Date(dateStr + 'T12:00:00');
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  function isPast(dateStr: string): boolean {
    return dateStr < today;
  }

  function scopeLabel(override: DateOverrideEntry): string {
    const svcNames = (override.serviceIds && override.serviceIds.length > 0)
      ? override.serviceIds
          .map(id => services.find(s => String(s.id) === id)?.name ?? 'Unknown service')
          .join(', ')
      : 'All services';
    const provNames = (override.providerIds && override.providerIds.length > 0)
      ? override.providerIds
          .map(id => {
            const p = providers.find(p => String(p.id) === id);
            return p ? `${p.firstName} ${p.lastName}` : 'Unknown provider';
          })
          .join(', ')
      : 'All providers';
    return `${svcNames} \u2014 ${provNames}`;
  }

  const sortedOverrides = [...value].sort((a, b) => a.date.localeCompare(b.date));
  const isDefaultScope = formServiceIds.length === 0 && formProviderIds.length === 0;

  const serviceOptions = services.map(s => ({ value: String(s.id), label: `${s.name} (${s.duration}m)` }));
  const providerOptions = filteredProviders.map(p => ({ value: String(p.id), label: `${p.firstName} ${p.lastName}` }));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-1.5">
              Date Overrides
              <InfoTooltip content="Override the regular weekly schedule for specific dates. Each override can target all services and providers, or be scoped to specific ones." />
            </CardTitle>
            <CardDescription className="mt-1">
              Change availability for specific dates, such as holidays or special events.
            </CardDescription>
          </div>
          {!showForm && (
            <Tooltip content="Set custom hours for a specific date, overriding regular business hours.">
              <Button size="sm" variant="outline" onClick={() => { resetForm(); setShowForm(true); }}>
                <Plus className="w-3.5 h-3.5 mr-1" />
                Add Date Override
              </Button>
            </Tooltip>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Add/Edit form */}
          {showForm && (
            <div className="p-4 rounded-lg border border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-800/50 space-y-4">

              {/* Row 1: Date + Closed checkbox */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                <div>
                  <div className="flex items-center gap-1">
                    <Label htmlFor="override-date" className="text-xs font-medium">Date</Label>
                    <InfoTooltip content="The specific date you want to override the regular schedule for." />
                  </div>
                  <Input
                    id="override-date"
                    type="date"
                    min={today}
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="mt-1"
                  />
                  {formDate && (
                    <p className="text-xs text-secondary-400 mt-1">{getNormalHours(formDate)}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 sm:mt-6">
                  <input
                    id="override-closed"
                    type="checkbox"
                    checked={formClosed}
                    onChange={(e) => setFormClosed(e.target.checked)}
                    className="h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                  />
                  <div className="flex items-center gap-1">
                    <Label htmlFor="override-closed" className="text-xs cursor-pointer">
                      Closed all day
                    </Label>
                    <InfoTooltip content="Check this to mark the entire day as unavailable. No booking slots will be offered." />
                  </div>
                </div>
              </div>

              {/* Row 2: Time pickers side by side */}
              {!formClosed && (
                <div>
                  <div className="flex items-center gap-1 mb-1.5">
                    <Label className="text-xs font-medium">Available hours</Label>
                    <InfoTooltip content="Bookings can only be made during this window. Times outside this range are unavailable." />
                  </div>
                  <div className="grid grid-cols-2 gap-3 max-w-xs">
                    <div>
                      <Label className="text-xs text-secondary-500">Open at</Label>
                      <Select
                        value={formStart}
                        onChange={(e) => setFormStart(e.target.value)}
                        options={TIME_OPTIONS.map(t => ({ value: t, label: t }))}
                        className="mt-1 px-2 py-1.5 text-sm h-auto"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-secondary-500">Close at</Label>
                      <Select
                        value={formEnd}
                        onChange={(e) => setFormEnd(e.target.value)}
                        options={TIME_OPTIONS.filter(t => t > formStart).map(t => ({ value: t, label: t }))}
                        className="mt-1 px-2 py-1.5 text-sm h-auto"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Row 3: Scope selectors - Services and Providers side by side */}
              <div>
                <div className="flex items-center gap-1 mb-1.5">
                  <Label className="text-xs font-medium">Scope</Label>
                  <InfoTooltip content="Narrow this override to specific services and/or providers instead of applying it to everything." />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="override-services" className="text-xs text-secondary-500">Services</Label>
                    <div className="mt-1">
                      <MultiSelect
                        id="override-services"
                        options={serviceOptions}
                        selected={formServiceIds}
                        onChange={handleServiceIdsChange}
                        allLabel="All services"
                        placeholder="services"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="override-providers" className="text-xs text-secondary-500">Providers</Label>
                    <div className="mt-1">
                      <MultiSelect
                        id="override-providers"
                        options={providerOptions}
                        selected={formProviderIds}
                        onChange={setFormProviderIds}
                        allLabel="All providers"
                        placeholder="providers"
                      />
                    </div>
                  </div>
                </div>
                {!isDefaultScope && (
                  <p className="text-xs text-secondary-400 mt-2">
                    Applies to: <span className="font-medium text-secondary-600 dark:text-secondary-300">
                      {formServiceIds.length === 0 ? 'All services' : formServiceIds.map(id => services.find(s => String(s.id) === id)?.name ?? id).join(', ')}
                      {' \u2014 '}
                      {formProviderIds.length === 0 ? 'All providers' : formProviderIds.map(id => { const p = providers.find(p => String(p.id) === id); return p ? `${p.firstName} ${p.lastName}` : id; }).join(', ')}
                    </span>
                  </p>
                )}
              </div>

              {/* Row 4: Label */}
              <div>
                <div className="flex items-center gap-1">
                  <Label htmlFor="override-label" className="text-xs font-medium">Label (optional)</Label>
                  <InfoTooltip content="An optional label to help you remember why this override exists, e.g. 'Easter Monday' or 'Early close'" />
                </div>
                <Input
                  id="override-label"
                  type="text"
                  placeholder="e.g. Easter Monday, Early close"
                  value={formLabel}
                  onChange={(e) => setFormLabel(e.target.value)}
                  className="mt-1 max-w-sm"
                  maxLength={100}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-1">
                <Button size="sm" onClick={handleSubmit} disabled={!formDate}>
                  {editingKey ? 'Update Date Override' : 'Add Date Override'}
                </Button>
                <Button size="sm" variant="ghost" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Override list */}
          {sortedOverrides.length === 0 ? (
            <div className="flex items-start gap-2 py-4">
              <CalendarClock className="w-4 h-4 text-secondary-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-secondary-500">
                No date overrides. The regular weekly business hours apply to every date. Add a date override to change availability for a specific date.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-secondary-100 dark:divide-secondary-800">
              {sortedOverrides.map(override => {
                const key = overrideKey(override);
                const hasScope = (override.serviceIds && override.serviceIds.length > 0) || (override.providerIds && override.providerIds.length > 0);
                return (
                  <div
                    key={key}
                    className={`py-2 ${isPast(override.date) ? 'opacity-50' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="min-w-0">
                        <span className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
                          {formatDate(override.date)}
                        </span>
                        <span className="ml-2 text-xs text-secondary-500">
                          {override.isClosed ? 'Closed all day' : `Available ${override.startTime} \u2013 ${override.endTime}`}
                        </span>
                        {override.label && (
                          <span className="ml-2 text-xs text-secondary-400 italic">
                            {override.label}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Button
                            size="sm"
                            variant="ghost"
                            className="text-secondary-500 hover:text-secondary-700 h-7 w-7 p-0"
                            onClick={() => openEditForm(override)}
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                        <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-500 hover:text-red-700 h-7 w-7 p-0"
                            onClick={() => setConfirmDeleteKey(key)}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-xs text-secondary-400">
                        {getNormalHours(override.date)}
                      </p>
                      {hasScope ? (
                        <span className="text-xs text-primary-600 dark:text-primary-400">
                          {scopeLabel(override)}
                        </span>
                      ) : (
                        <span className="text-xs text-secondary-400">
                          All services &mdash; All providers
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>

      {/* Delete confirmation */}
      <Dialog open={confirmDeleteKey !== null} onOpenChange={() => setConfirmDeleteKey(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Date Override?</DialogTitle>
            <DialogDescription>
              The regular weekly business hours will apply for this date and scope instead.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setConfirmDeleteKey(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => confirmDeleteKey && handleDelete(confirmDeleteKey)}
            >
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
