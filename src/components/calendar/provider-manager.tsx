'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2, Loader2, AlertCircle, Check, Users } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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
import { BusinessHoursEditor } from '@/components/calendar/business-hours-editor';
import type {
  EAProvider,
  EAService,
  EAWorkingPlan,
  EAWorkingPlanDay,
  EAConnectionState,
  BusinessHoursEntry,
  ProviderServicePriceOverrides,
} from '@/lib/calendar/types';

// ── Working plan <-> BusinessHoursEntry[] conversion ──

const WORKING_PLAN_KEYS: { key: keyof EAWorkingPlan; dayOfWeek: number }[] = [
  { key: 'sunday', dayOfWeek: 0 },
  { key: 'monday', dayOfWeek: 1 },
  { key: 'tuesday', dayOfWeek: 2 },
  { key: 'wednesday', dayOfWeek: 3 },
  { key: 'thursday', dayOfWeek: 4 },
  { key: 'friday', dayOfWeek: 5 },
  { key: 'saturday', dayOfWeek: 6 },
];

function workingPlanToEntries(wp: EAWorkingPlan): BusinessHoursEntry[] {
  return WORKING_PLAN_KEYS.map(({ key, dayOfWeek }) => {
    const day = wp[key];
    if (day === null) {
      return { dayOfWeek, startTime: '09:00', endTime: '17:00', isEnabled: false };
    }
    return { dayOfWeek, startTime: day.start, endTime: day.end, isEnabled: true };
  });
}

function entryToDay(entries: BusinessHoursEntry[], dayOfWeek: number): EAWorkingPlanDay | null {
  const entry = entries.find((e) => e.dayOfWeek === dayOfWeek);
  if (!entry || !entry.isEnabled) return null;
  return { start: entry.startTime, end: entry.endTime, breaks: [] };
}

function entriesToWorkingPlan(entries: BusinessHoursEntry[]): EAWorkingPlan {
  return {
    sunday: entryToDay(entries, 0),
    monday: entryToDay(entries, 1),
    tuesday: entryToDay(entries, 2),
    wednesday: entryToDay(entries, 3),
    thursday: entryToDay(entries, 4),
    friday: entryToDay(entries, 5),
    saturday: entryToDay(entries, 6),
  };
}

const DEFAULT_ENTRIES: BusinessHoursEntry[] = WORKING_PLAN_KEYS.map(({ dayOfWeek }) => ({
  dayOfWeek,
  startTime: '09:00',
  endTime: '17:00',
  isEnabled: dayOfWeek >= 1 && dayOfWeek <= 5,
}));

// ── Form state ──

interface ProviderFormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  serviceIds: number[];
  /** Per-service price overrides: service ID string -> price (or empty string for no override) */
  servicePrices: Record<string, string>;
  businessHours: BusinessHoursEntry[];
}

const emptyForm: ProviderFormState = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  serviceIds: [],
  servicePrices: {},
  businessHours: DEFAULT_ENTRIES,
};

function formFromProvider(
  p: EAProvider,
  allPriceOverrides?: ProviderServicePriceOverrides,
): ProviderFormState {
  const providerPrices = allPriceOverrides?.[String(p.id)] ?? {};
  const servicePrices: Record<string, string> = {};
  for (const [svcId, price] of Object.entries(providerPrices)) {
    servicePrices[svcId] = String(price);
  }
  return {
    firstName: p.firstName,
    lastName: p.lastName,
    email: p.email,
    phone: p.phone ?? '',
    serviceIds: [...p.services],
    servicePrices,
    businessHours: workingPlanToEntries(p.settings.workingPlan),
  };
}

// ── Component ──

interface ProviderManagerProps {
  providers: EAProvider[];
  services: EAService[];
  selectedProviderId: string;
  onSelectProvider: (id: string) => void;
  onProvidersChange: () => void;
  connectionState: EAConnectionState;
  providerServicePrices: ProviderServicePriceOverrides;
  onProviderServicePricesChange: (prices: ProviderServicePriceOverrides) => void;
}

export function ProviderManager({
  providers,
  services,
  selectedProviderId,
  onSelectProvider,
  onProvidersChange,
  connectionState,
  providerServicePrices,
  onProviderServicePricesChange,
}: ProviderManagerProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [addForm, setAddForm] = useState<ProviderFormState>(emptyForm);
  const [creating, setCreating] = useState(false);

  const [editProvider, setEditProvider] = useState<EAProvider | null>(null);
  const [editForm, setEditForm] = useState<ProviderFormState>(emptyForm);
  const [saving, setSaving] = useState(false);

  const [deleteProvider, setDeleteProvider] = useState<EAProvider | null>(null);
  const [deleting, setDeleting] = useState(false);

  // ── Validation ──

  function validateForm(form: ProviderFormState): string | null {
    if (!form.firstName.trim()) return 'First name is required';
    if (!form.lastName.trim()) return 'Last name is required';
    if (!form.email.trim()) return 'Email is required';
    if (form.serviceIds.length === 0) return 'Select at least one service';
    return null;
  }

  // ── Create ──

  async function handleCreate() {
    const err = validateForm(addForm);
    if (err) {
      toast.error(err);
      return;
    }
    setCreating(true);
    try {
      const body = {
        firstName: addForm.firstName.trim(),
        lastName: addForm.lastName.trim(),
        email: addForm.email.trim(),
        phone: addForm.phone.trim() || undefined,
        services: addForm.serviceIds,
        settings: {
          workingPlan: entriesToWorkingPlan(addForm.businessHours),
          notifications: true,
        },
      };
      const res = await fetch('/api/calendar/providers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const created = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(created?.error ?? 'Failed to create provider');
      }
      const newProviderId = String(created?.data?.id ?? '');

      // Persist any price overrides set in the form
      if (newProviderId) {
        const priceMap: Record<string, number> = {};
        for (const [svcId, val] of Object.entries(addForm.servicePrices)) {
          const num = parseFloat(val);
          if (!isNaN(num) && num >= 0 && addForm.serviceIds.includes(Number(svcId))) {
            priceMap[svcId] = num;
          }
        }
        if (Object.keys(priceMap).length > 0) {
          onProviderServicePricesChange({
            ...providerServicePrices,
            [newProviderId]: priceMap,
          });
        }
      }

      toast.success('Provider created');
      setShowAddDialog(false);
      setAddForm(emptyForm);
      onProvidersChange();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to create provider');
    } finally {
      setCreating(false);
    }
  }

  // ── Update ──

  function openEdit(p: EAProvider) {
    setEditProvider(p);
    setEditForm(formFromProvider(p, providerServicePrices));
  }

  async function handleUpdate() {
    if (!editProvider) return;
    const err = validateForm(editForm);
    if (err) {
      toast.error(err);
      return;
    }
    setSaving(true);
    try {
      const settings: Record<string, unknown> = {
        workingPlan: entriesToWorkingPlan(editForm.businessHours),
        notifications: true,
      };

      const body = {
        firstName: editForm.firstName.trim(),
        lastName: editForm.lastName.trim(),
        email: editForm.email.trim(),
        phone: editForm.phone.trim() || undefined,
        services: editForm.serviceIds,
        settings,
      };
      const res = await fetch(`/api/calendar/providers/${editProvider.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? 'Failed to update provider');
      }
      // Persist price overrides
      const providerId = String(editProvider.id);
      const priceMap: Record<string, number> = {};
      for (const [svcId, val] of Object.entries(editForm.servicePrices)) {
        const num = parseFloat(val);
        if (!isNaN(num) && num >= 0 && editForm.serviceIds.includes(Number(svcId))) {
          priceMap[svcId] = num;
        }
      }
      const updated = { ...providerServicePrices };
      if (Object.keys(priceMap).length > 0) {
        updated[providerId] = priceMap;
      } else {
        delete updated[providerId];
      }
      onProviderServicePricesChange(updated);

      toast.success('Provider updated');
      setEditProvider(null);
      onProvidersChange();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to update provider');
    } finally {
      setSaving(false);
    }
  }

  // ── Delete ──

  async function handleDelete() {
    if (!deleteProvider) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/calendar/providers/${deleteProvider.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? 'Failed to delete provider');
      }
      // Clean up price overrides for deleted provider
      const cleaned = { ...providerServicePrices };
      delete cleaned[String(deleteProvider.id)];
      onProviderServicePricesChange(cleaned);

      toast.success('Provider deleted');
      if (String(deleteProvider.id) === selectedProviderId) {
        onSelectProvider('');
      }
      setDeleteProvider(null);
      onProvidersChange();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to delete provider');
    } finally {
      setDeleting(false);
    }
  }

  // ── Not configured ──

  if (connectionState === 'not_configured') {
    return (
      <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg text-sm">
        <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
        <p className="text-amber-800 dark:text-amber-200">
          Easy!Appointments is not configured. Contact your administrator to set up the connection
          before managing providers.
        </p>
      </div>
    );
  }

  // ── Service checkbox toggle helper ──

  function toggleService(
    form: ProviderFormState,
    setForm: (f: ProviderFormState) => void,
    serviceId: number,
  ) {
    const isRemoving = form.serviceIds.includes(serviceId);
    const ids = isRemoving
      ? form.serviceIds.filter((id) => id !== serviceId)
      : [...form.serviceIds, serviceId];
    const prices = { ...form.servicePrices };
    if (isRemoving) {
      delete prices[String(serviceId)];
    }
    setForm({ ...form, serviceIds: ids, servicePrices: prices });
  }

  function formatPrice(price: number, currency: string): string {
    try {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(price);
    } catch {
      return `${price} ${currency}`;
    }
  }

  // ── Shared form fields ──

  function renderFormFields(
    form: ProviderFormState,
    setForm: (f: ProviderFormState) => void,
  ) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="prov-first">First Name</Label>
            <Input
              id="prov-first"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              className="mt-1"
              required
            />
          </div>
          <div>
            <Label htmlFor="prov-last">Last Name</Label>
            <Input
              id="prov-last"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              className="mt-1"
              required
            />
          </div>
        </div>
        <div>
          <Label htmlFor="prov-email">Email</Label>
          <Input
            id="prov-email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="mt-1"
            required
          />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <Label htmlFor="prov-phone">Phone</Label>
            <InfoTooltip content="Optional contact number. Visible to administrators only, not shown to customers." />
          </div>
          <Input
            id="prov-phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="mt-1"
          />
        </div>

        {/* Services checkboxes with optional price overrides */}
        <div>
          <div className="flex items-center gap-1.5">
            <Label>Services</Label>
            <InfoTooltip
              content="Select services this provider can handle. Optionally set a custom price per service that overrides the default service price."
              side="right"
            />
          </div>
          {services.length === 0 ? (
            <p className="mt-1 text-sm text-secondary-500">
              No services available. Create a service first.
            </p>
          ) : (
            <div className="mt-1 space-y-1 max-h-64 overflow-y-auto border border-secondary-200 dark:border-secondary-700 rounded-md p-3">
              {services.map((s) => {
                const isChecked = form.serviceIds.includes(s.id);
                const svcIdStr = String(s.id);
                const priceValue = form.servicePrices[svcIdStr] ?? '';
                return (
                  <div
                    key={s.id}
                    className={cn(
                      'rounded-md border p-2.5 transition-colors',
                      isChecked
                        ? 'border-primary-200 dark:border-primary-800 bg-primary-50/50 dark:bg-primary-900/10'
                        : 'border-transparent'
                    )}
                  >
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleService(form, setForm, s.id)}
                        className="h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
                        {s.name}
                      </span>
                      <Badge variant="secondary" className="text-xs ml-auto">
                        {s.duration} min
                      </Badge>
                      {s.price > 0 && (
                        <Badge variant="outline" className="text-xs">
                          {formatPrice(s.price, s.currency)}
                        </Badge>
                      )}
                    </label>
                    {isChecked && (
                      <div className="mt-2 ml-6 flex items-center gap-2">
                        <div className="flex items-center gap-1 whitespace-nowrap">
                          <label
                            htmlFor={`price-override-${s.id}`}
                            className="text-xs text-secondary-500 dark:text-secondary-400"
                          >
                            Provider price:
                          </label>
                          <InfoTooltip content="Set a custom price for this provider. Overrides the default service price when this provider is selected." />
                        </div>
                        <div className="relative w-32">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-secondary-400">
                            {s.currency === 'USD' ? '$' : s.currency === 'EUR' ? '\u20AC' : s.currency === 'GBP' ? '\u00A3' : ''}
                          </span>
                          <Input
                            id={`price-override-${s.id}`}
                            type="number"
                            min={0}
                            step="0.01"
                            value={priceValue}
                            onChange={(e) => {
                              const prices = { ...form.servicePrices };
                              if (e.target.value === '') {
                                delete prices[svcIdStr];
                              } else {
                                prices[svcIdStr] = e.target.value;
                              }
                              setForm({ ...form, servicePrices: prices });
                            }}
                            placeholder={s.price > 0 ? String(s.price) : '0'}
                            className="h-7 text-xs pl-6"
                          />
                        </div>
                        <span className="text-xs text-secondary-400">
                          {priceValue === ''
                            ? s.price > 0
                              ? `Uses ${formatPrice(s.price, s.currency)}`
                              : 'No price set'
                            : `Overrides to ${formatPrice(parseFloat(priceValue) || 0, s.currency)}`}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Working Plan */}
        <BusinessHoursEditor
          globalHours={form.businessHours}
          onGlobalChange={(hours) => setForm({ ...form, businessHours: hours })}
          scopedSets={[]}
          onScopedSetsChange={() => {}}
          services={[]}
          providers={[]}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Active Provider selector */}
      <div className="p-4 rounded-lg border-2 border-primary-200 dark:border-primary-800 bg-primary-50/50 dark:bg-primary-900/10">
        <div className="flex items-center gap-1.5 mb-2">
          <Label htmlFor="active-provider" className="font-semibold">Active Provider</Label>
          <InfoTooltip
            content="The staff member who will handle bookings. Leave empty to auto-assign to any available provider."
            side="right"
          />
        </div>
        <Select
          id="active-provider"
          value={selectedProviderId}
          onChange={(e) => onSelectProvider(e.target.value)}
          options={[
            { value: '', label: 'Any available provider' },
            ...providers.map((p) => ({
              value: String(p.id),
              label: `${p.firstName} ${p.lastName}`,
            })),
          ]}
        />
      </div>

      {/* Provider list */}
      {providers.length === 0 && connectionState === 'connected' ? (
        <div className="text-center py-8 text-secondary-500">
          <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No providers yet</p>
          <p className="text-xs mt-1 text-secondary-400">Create your first provider to assign staff to bookings.</p>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-secondary-500 uppercase tracking-wider">All Providers</p>
            <Badge variant="secondary" className="text-xs">{providers.length}</Badge>
          </div>
          {providers.map((p) => (
            <div
              key={p.id}
              className={cn(
                "flex items-center justify-between p-3 rounded-lg border",
                String(p.id) === selectedProviderId
                  ? "border-primary-300 dark:border-primary-700 bg-primary-50 dark:bg-primary-900/20 ring-1 ring-primary-200 dark:ring-primary-800"
                  : "border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-800/50"
              )}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="min-w-0">
                  <span className="text-sm font-medium text-secondary-900 dark:text-secondary-100 truncate block">
                    {p.firstName} {p.lastName}
                  </span>
                  <span className="text-xs text-secondary-500 truncate block">
                    {p.email}{p.phone ? ` \u00B7 ${p.phone}` : ''}
                  </span>
                </div>
                {String(p.id) === selectedProviderId && (
                  <Badge className="flex items-center gap-1 flex-shrink-0 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    <Check className="w-3 h-3" />
                    Active
                  </Badge>
                )}
                {p.services.length > 0 ? (
                  <div className="flex flex-wrap gap-1 flex-shrink-0">
                    {p.services.map((svcId) => {
                      const svc = services.find((s) => s.id === svcId);
                      const providerPrice = providerServicePrices[String(p.id)]?.[String(svcId)];
                      const displayPrice = providerPrice ?? (svc && svc.price > 0 ? svc.price : undefined);
                      const currency = svc?.currency ?? 'USD';
                      const isOverride = providerPrice !== undefined;
                      return (
                        <Tooltip
                          key={svcId}
                          content={
                            isOverride
                              ? `Provider price override (service default: ${svc && svc.price > 0 ? formatPrice(svc.price, currency) : 'none'})`
                              : displayPrice !== undefined
                                ? 'Using service price'
                                : svc ? svc.name : `Service #${svcId}`
                          }
                        >
                          <Badge
                            variant="secondary"
                            className={cn('text-xs', isOverride && 'border border-primary-300 dark:border-primary-700')}
                          >
                            {svc ? svc.name : `#${svcId}`}
                            {displayPrice !== undefined && (
                              <span className={cn('ml-1', isOverride && 'font-semibold')}>
                                {formatPrice(displayPrice, currency)}
                              </span>
                            )}
                          </Badge>
                        </Tooltip>
                      );
                    })}
                  </div>
                ) : (
                  <Badge variant="outline" className="flex-shrink-0 text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-700">
                    No services
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <Tooltip content="Edit provider">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={() => openEdit(p)}
                    aria-label={`Edit ${p.firstName} ${p.lastName}`}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                </Tooltip>
                <Tooltip content="Delete provider">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    onClick={() => setDeleteProvider(p)}
                    aria-label={`Delete ${p.firstName} ${p.lastName}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </Tooltip>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Provider button */}
      <Tooltip content="Add a new staff member who can accept bookings">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setAddForm(emptyForm);
            setShowAddDialog(true);
          }}
          className="w-full border-dashed"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Provider
        </Button>
      </Tooltip>

      {/* Add Provider dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog} pageScroll>
        <DialogContent className="max-w-2xl" pageScroll>
          <DialogHeader>
            <DialogTitle>Add Provider</DialogTitle>
            <DialogDescription>
              Create a new staff member who can accept bookings.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            {renderFormFields(addForm, setAddForm)}
          </div>
          <DialogFooter className="mt-6">
            <Button
              variant="outline"
              onClick={() => setShowAddDialog(false)}
              disabled={creating}
            >
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={creating}>
              {creating && <Loader2 className="w-4 h-4 mr-1 animate-spin" />}
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Provider dialog */}
      <Dialog open={editProvider !== null} onOpenChange={(open) => !open && setEditProvider(null)} pageScroll>
        <DialogContent className="max-w-2xl" pageScroll>
          <DialogHeader>
            <DialogTitle>Edit Provider</DialogTitle>
            <DialogDescription>Update provider details and working hours.</DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            {renderFormFields(editForm, setEditForm)}
          </div>
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setEditProvider(null)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 mr-1 animate-spin" />}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteProvider !== null}
        onOpenChange={(open) => !open && setDeleteProvider(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Provider?</DialogTitle>
            <DialogDescription>
              This will remove the provider from Easy!Appointments. Existing bookings assigned to
              this provider will not be affected.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteProvider(null)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting && <Loader2 className="w-4 h-4 mr-1 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
