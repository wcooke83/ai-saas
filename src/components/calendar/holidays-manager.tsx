'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Plus, Trash2, Loader2, AlertCircle, CalendarOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import type { EABlockedPeriod, EAConnectionState, HolidayEntry } from '@/lib/calendar/types';
import { holidayKey } from '@/lib/calendar/types';

interface HolidaysManagerProps {
  connectionState: EAConnectionState;
  services: { id: number; name: string }[];
  providers: { id: number; firstName: string; lastName: string; services: number[] }[];
  scopedHolidays: HolidayEntry[];
  onScopedHolidaysChange: (holidays: HolidayEntry[]) => void;
}

function scopeLabel(
  h: HolidayEntry,
  services: HolidaysManagerProps['services'],
  providers: HolidaysManagerProps['providers'],
): string {
  const svcNames = (h.serviceIds?.length)
    ? h.serviceIds.map(id => services.find(s => String(s.id) === id)?.name ?? 'Unknown').join(', ')
    : 'All services';
  const prvNames = (h.providerIds?.length)
    ? h.providerIds.map(id => { const p = providers.find(pr => String(pr.id) === id); return p ? `${p.firstName} ${p.lastName}` : 'Unknown'; }).join(', ')
    : 'All providers';
  return `${svcNames} \u2014 ${prvNames}`;
}

export function HolidaysManager({
  connectionState,
  services,
  providers,
  scopedHolidays,
  onScopedHolidaysChange,
}: HolidaysManagerProps) {
  // ── Global (EA blocked periods) state ──
  const [blockedPeriods, setBlockedPeriods] = useState<EABlockedPeriod[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  // ── Scoped holidays form state ──
  const [showScopedForm, setShowScopedForm] = useState(false);
  const [scopedDate, setScopedDate] = useState('');
  const [scopedLabel, setScopedLabel] = useState('');
  const [formServiceIds, setFormServiceIds] = useState<string[]>([]);
  const [formProviderIds, setFormProviderIds] = useState<string[]>([]);
  const [scopeError, setScopeError] = useState<string | null>(null);
  const [confirmDeleteScopedKey, setConfirmDeleteScopedKey] = useState<string | null>(null);

  const today = new Date().toISOString().split('T')[0];

  // Provider filtering — same logic as date-overrides-manager
  const filteredProviders = formServiceIds.length === 0
    ? providers
    : providers.filter(p => formServiceIds.some(sId => p.services.includes(Number(sId))));

  function handleServiceIdsChange(newServiceIds: string[]) {
    setFormServiceIds(newServiceIds);
    if (newServiceIds.length > 0) {
      const validProviderIds = providers
        .filter(p => newServiceIds.some(sId => p.services.includes(Number(sId))))
        .map(p => String(p.id));
      setFormProviderIds(prev => prev.filter(id => validProviderIds.includes(id)));
    }
  }

  // ── Global: fetch EA blocked periods ──
  const fetchBlockedPeriods = useCallback(async () => {
    if (connectionState !== 'connected') {
      setLoading(false);
      return;
    }
    try {
      setError(null);
      const res = await fetch('/api/calendar/blocked-periods');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setBlockedPeriods(data.data || []);
    } catch {
      setError('Failed to load blocked dates');
    } finally {
      setLoading(false);
    }
  }, [connectionState]);

  useEffect(() => {
    fetchBlockedPeriods();
  }, [fetchBlockedPeriods]);

  async function handleCreate() {
    if (!newDate) {
      toast.error('Please select a date');
      return;
    }

    const exists = blockedPeriods.some(bp => bp.start.startsWith(newDate));
    if (exists) {
      toast.error('This date is already blocked');
      return;
    }

    setCreating(true);
    try {
      const res = await fetch('/api/calendar/blocked-periods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newLabel || 'Blocked',
          start: `${newDate} 00:00:00`,
          end: `${newDate} 23:59:00`,
        }),
      });
      if (!res.ok) throw new Error('Failed to create');
      toast.success('Blocked date added');
      setNewDate('');
      setNewLabel('');
      setShowForm(false);
      fetchBlockedPeriods();
    } catch {
      toast.error('Failed to add blocked date');
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(id: number) {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/calendar/blocked-periods/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete');
      toast.success('Blocked date removed');
      setConfirmDeleteId(null);
      fetchBlockedPeriods();
    } catch {
      toast.error('Failed to remove blocked date');
    } finally {
      setDeletingId(null);
    }
  }

  // ── Scoped: add / delete ──
  function resetScopedForm() {
    setShowScopedForm(false);
    setScopedDate('');
    setScopedLabel('');
    setFormServiceIds([]);
    setFormProviderIds([]);
    setScopeError(null);
  }

  function handleAddScoped() {
    if (!scopedDate) {
      toast.error('Please select a date');
      return;
    }

    if (formServiceIds.length === 0 && formProviderIds.length === 0) {
      setScopeError('Select at least one service or provider. Use the Global section for blocked dates that apply to everything.');
      return;
    }
    setScopeError(null);

    const entry: HolidayEntry = {
      date: scopedDate,
      ...(scopedLabel.trim() ? { label: scopedLabel.trim() } : {}),
      ...(formServiceIds.length > 0 ? { serviceIds: formServiceIds } : {}),
      ...(formProviderIds.length > 0 ? { providerIds: formProviderIds } : {}),
    };

    const key = holidayKey(entry);
    if (scopedHolidays.some(h => holidayKey(h) === key)) {
      toast.error('A blocked date with this date and scope already exists');
      return;
    }

    onScopedHolidaysChange([...scopedHolidays, entry]);
    resetScopedForm();
  }

  function handleDeleteScoped(key: string) {
    onScopedHolidaysChange(scopedHolidays.filter(h => holidayKey(h) !== key));
    setConfirmDeleteScopedKey(null);
  }

  // ── Shared helpers ──
  function formatDate(dateStr: string): string {
    const d = new Date(dateStr.replace(' ', 'T'));
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  function isPast(dateStr: string): boolean {
    return dateStr.split(' ')[0] < today;
  }

  const sorted = [...blockedPeriods].sort((a, b) => a.start.localeCompare(b.start));
  const sortedScoped = [...scopedHolidays].sort((a, b) => a.date.localeCompare(b.date));

  const serviceOptions = services.map(s => ({ value: String(s.id), label: s.name }));
  const providerOptions = filteredProviders.map(p => ({ value: String(p.id), label: `${p.firstName} ${p.lastName}` }));

  if (connectionState === 'not_configured') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Blocked Dates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-2 text-amber-600 dark:text-amber-400">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p className="text-sm">Easy!Appointments is not configured. Blocked dates cannot be managed until the connection is established.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-1.5">
              Blocked Dates
              <InfoTooltip content="Block specific dates from accepting bookings. Global blocked dates apply to all services and providers. Scoped blocked dates apply only to selected services or providers." />
            </CardTitle>
            <CardDescription>Prevent bookings on specific dates.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* ────────── Section 1: Global ────────── */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-secondary-900 dark:text-secondary-100 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-secondary-400" />
                  Global Blocked Dates
                </h4>
                <p className="text-xs text-secondary-500 mt-0.5">Apply to all services and providers unless overridden.</p>
              </div>
              {connectionState === 'connected' && !showForm && (
                <Tooltip content="Add a blocked date for all services and providers">
                  <Button size="sm" variant="outline" onClick={() => setShowForm(true)}>
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    Add Blocked Date
                  </Button>
                </Tooltip>
              )}
            </div>

            {error ? (
              <div className="flex items-start gap-2 text-amber-600 dark:text-amber-400">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm">{error}</p>
                  <Button size="sm" variant="outline" className="mt-2" onClick={fetchBlockedPeriods}>
                    Retry
                  </Button>
                </div>
              </div>
            ) : loading ? (
              <div className="flex items-center gap-2 text-secondary-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Loading...</span>
              </div>
            ) : (
              <>
                {/* Global add form */}
                {showForm && (
                  <div className="flex flex-wrap items-end gap-3 p-3 rounded-lg border border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-800/50">
                    <div>
                      <Label htmlFor="blocked-date" className="text-xs">Date</Label>
                      <Input
                        id="blocked-date"
                        type="date"
                        min={today}
                        value={newDate}
                        onChange={(e) => setNewDate(e.target.value)}
                        className="mt-1 w-44"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <Label htmlFor="blocked-label" className="text-xs">Label (optional)</Label>
                        <InfoTooltip content="An optional label to identify this blocked date, e.g. 'Christmas Day' or 'Office closure'" />
                      </div>
                      <Input
                        id="blocked-label"
                        value={newLabel}
                        onChange={(e) => setNewLabel(e.target.value.slice(0, 100))}
                        placeholder="e.g. Christmas Day"
                        className="mt-1 w-48"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleCreate} disabled={creating || !newDate}>
                        {creating && <Loader2 className="w-3 h-3 mr-1 animate-spin" />}
                        Add
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => { setShowForm(false); setNewDate(''); setNewLabel(''); }}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {/* Global list */}
                {sorted.length === 0 ? (
                  <div className="flex items-start gap-2 py-4">
                    <CalendarOff className="w-4 h-4 text-secondary-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-secondary-500">
                      No global blocked dates. Add dates to prevent the chatbot from offering appointments on those days.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-secondary-100 dark:divide-secondary-800">
                    {sorted.map(bp => (
                      <div
                        key={bp.id}
                        className={`flex items-center justify-between py-2 ${isPast(bp.start) ? 'opacity-50' : ''}`}
                      >
                        <div>
                          <span className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
                            {formatDate(bp.start)}
                          </span>
                          {bp.name && bp.name !== 'Blocked' && (
                            <span className="ml-2 text-xs text-secondary-500">
                              {bp.name}
                            </span>
                          )}
                        </div>
                        <Tooltip content="Remove this blocked date">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-500 hover:text-red-700 h-7 w-7 p-0"
                            onClick={() => setConfirmDeleteId(bp.id)}
                            disabled={deletingId === bp.id}
                          >
                            {deletingId === bp.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="w-3.5 h-3.5" />
                            )}
                          </Button>
                        </Tooltip>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Divider between sections */}
          <div className="border-t border-secondary-200 dark:border-secondary-700" />

          {/* ────────── Section 2: Scoped ────────── */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-secondary-900 dark:text-secondary-100 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-primary-500" />
                  Scoped Blocked Dates
                </h4>
                <p className="text-xs text-secondary-500 mt-0.5">Apply only to selected services or providers.</p>
              </div>
              {!showScopedForm && (
                <Tooltip content="Add a blocked date for specific services or providers">
                  <Button size="sm" variant="outline" onClick={() => { resetScopedForm(); setShowScopedForm(true); }}>
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    Add Blocked Date
                  </Button>
                </Tooltip>
              )}
            </div>

            {/* Scoped add form */}
            {showScopedForm && (
              <div className="p-4 rounded-lg border border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-800/50 space-y-4">
                {/* Date + Label */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="scoped-date" className="text-xs font-medium">Date</Label>
                    <Input
                      id="scoped-date"
                      type="date"
                      min={today}
                      value={scopedDate}
                      onChange={(e) => setScopedDate(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <Label htmlFor="scoped-label" className="text-xs font-medium">Label (optional)</Label>
                      <InfoTooltip content="An optional label, e.g. 'Christmas Day' or 'Provider vacation'" />
                    </div>
                    <Input
                      id="scoped-label"
                      value={scopedLabel}
                      onChange={(e) => setScopedLabel(e.target.value.slice(0, 100))}
                      placeholder="e.g. Provider vacation"
                      className="mt-1"
                      maxLength={100}
                    />
                  </div>
                </div>

                {/* Scope selectors */}
                <div>
                  <div className="flex items-center gap-1 mb-1.5">
                    <Label className="text-xs font-medium">Scope</Label>
                    <InfoTooltip content="Select which services and/or providers this blocked date applies to. At least one must be selected." />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="scoped-services" className="text-xs text-secondary-500">Services</Label>
                      <div className="mt-1">
                        <MultiSelect
                          id="scoped-services"
                          options={serviceOptions}
                          selected={formServiceIds}
                          onChange={handleServiceIdsChange}
                          allLabel="All services"
                          placeholder="services"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="scoped-providers" className="text-xs text-secondary-500">Providers</Label>
                      <div className="mt-1">
                        <MultiSelect
                          id="scoped-providers"
                          options={providerOptions}
                          selected={formProviderIds}
                          onChange={setFormProviderIds}
                          allLabel="All providers"
                          placeholder="providers"
                        />
                      </div>
                    </div>
                  </div>
                  {scopeError && (
                    <div className="flex items-center gap-1.5 mt-2 text-red-600 dark:text-red-400">
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      <p className="text-xs">{scopeError}</p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-1">
                  <Button size="sm" onClick={handleAddScoped} disabled={!scopedDate}>
                    Add
                  </Button>
                  <Button size="sm" variant="ghost" onClick={resetScopedForm}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* Scoped list */}
            {sortedScoped.length === 0 ? (
              <div className="flex items-start gap-2 py-4">
                <CalendarOff className="w-4 h-4 text-secondary-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-secondary-500">
                  No scoped blocked dates. Add blocked dates for specific services or providers.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-secondary-100 dark:divide-secondary-800">
                {sortedScoped.map(h => {
                  const key = holidayKey(h);
                  return (
                    <div
                      key={key}
                      className={`py-2 ${isPast(h.date) ? 'opacity-50' : ''}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="min-w-0">
                          <span className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
                            {formatDate(h.date)}
                          </span>
                          {h.label && (
                            <span className="ml-2 text-xs text-secondary-500 italic">
                              {h.label}
                            </span>
                          )}
                        </div>
                        <Tooltip content="Remove this blocked date">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-500 hover:text-red-700 h-7 w-7 p-0 flex-shrink-0"
                            onClick={() => setConfirmDeleteScopedKey(key)}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </Tooltip>
                      </div>
                      <p className="text-xs text-primary-600 dark:text-primary-400 mt-0.5">
                        {scopeLabel(h, services, providers)}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </CardContent>

      {/* Global delete confirmation */}
      <Dialog open={confirmDeleteId !== null} onOpenChange={() => setConfirmDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Global Blocked Date?</DialogTitle>
            <DialogDescription>
              This will allow the chatbot to offer appointments on this date again.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setConfirmDeleteId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => confirmDeleteId && handleDelete(confirmDeleteId)}
              disabled={deletingId !== null}
            >
              {deletingId !== null && <Loader2 className="w-3 h-3 mr-1 animate-spin" />}
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Scoped delete confirmation */}
      <Dialog open={confirmDeleteScopedKey !== null} onOpenChange={() => setConfirmDeleteScopedKey(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Scoped Blocked Date?</DialogTitle>
            <DialogDescription>
              This will allow the chatbot to offer appointments on this date for the affected services and providers again.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setConfirmDeleteScopedKey(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => confirmDeleteScopedKey && handleDeleteScoped(confirmDeleteScopedKey)}
            >
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
