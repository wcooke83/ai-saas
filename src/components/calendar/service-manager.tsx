'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2, Loader2, AlertCircle, Clock, Check, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, InfoTooltip } from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import type { EAService, EAServiceCreateInput, EAConnectionState } from '@/lib/calendar/types';

const DURATION_OPTIONS = [5, 10, 15, 30, 45, 60, 90, 120, 180, 240];

const durationSelectOptions = DURATION_OPTIONS.map((d) => ({
  value: String(d),
  label: `${d} min`,
}));

interface ServiceManagerProps {
  services: EAService[];
  selectedServiceId: string;
  onSelectService: (id: string) => void;
  onServicesChange: () => void;
  connectionState: EAConnectionState;
  eventTypeDuration?: number;
}

interface ServiceFormState {
  name: string;
  duration: number;
  price: number;
  currency: string;
  description: string;
  attendantsNumber: number;
  availabilitiesType: string;
}

const emptyForm: ServiceFormState = {
  name: '',
  duration: 30,
  price: 0,
  currency: 'USD',
  description: '',
  attendantsNumber: 1,
  availabilitiesType: 'flexible',
};

function formFromService(s: EAService): ServiceFormState {
  return {
    name: s.name,
    duration: s.duration,
    price: s.price,
    currency: s.currency,
    description: s.description ?? '',
    attendantsNumber: s.attendantsNumber ?? 1,
    availabilitiesType: s.availabilitiesType ?? 'flexible',
  };
}

export function ServiceManager({
  services,
  selectedServiceId,
  onSelectService,
  onServicesChange,
  connectionState,
  eventTypeDuration,
}: ServiceManagerProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [addForm, setAddForm] = useState<ServiceFormState>(emptyForm);
  const [creating, setCreating] = useState(false);

  const [editingService, setEditingService] = useState<EAService | null>(null);
  const [editForm, setEditForm] = useState<ServiceFormState>(emptyForm);
  const [saving, setSaving] = useState(false);

  const [deleteService, setDeleteService] = useState<EAService | null>(null);
  const [deleting, setDeleting] = useState(false);

  const selectedService = services.find((s) => String(s.id) === selectedServiceId);
  const durationMismatch =
    selectedService &&
    eventTypeDuration !== undefined &&
    selectedService.duration !== eventTypeDuration;

  // ── Create ──

  async function handleCreate() {
    if (!addForm.name.trim()) {
      toast.error('Service name is required');
      return;
    }
    setCreating(true);
    try {
      const body: EAServiceCreateInput = {
        name: addForm.name.trim(),
        duration: addForm.duration,
        price: addForm.price,
        currency: addForm.currency,
        description: addForm.description.trim() || undefined,
        attendantsNumber: addForm.attendantsNumber,
        availabilitiesType: addForm.availabilitiesType,
      };
      const res = await fetch('/api/calendar/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.error ?? 'Failed to create service');
      }
      toast.success('Service created');
      setShowAddDialog(false);
      setAddForm(emptyForm);
      onServicesChange();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to create service');
    } finally {
      setCreating(false);
    }
  }

  // ── Update ──

  function openEdit(s: EAService) {
    setShowAddDialog(false);
    setEditingService(s);
    setEditForm(formFromService(s));
    // Auto-expand advanced if service has non-default values
    if (s.attendantsNumber > 1 || s.availabilitiesType !== 'flexible') {
      setShowAdvanced(true);
    }
  }

  function cancelEdit() {
    setEditingService(null);
  }

  async function handleUpdate() {
    if (!editingService) return;
    if (!editForm.name.trim()) {
      toast.error('Service name is required');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/calendar/services/${editingService.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editForm.name.trim(),
          duration: editForm.duration,
          price: editForm.price,
          currency: editForm.currency,
          description: editForm.description.trim() || undefined,
          attendantsNumber: editForm.attendantsNumber,
          availabilitiesType: editForm.availabilitiesType,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.error ?? 'Failed to update service');
      }
      toast.success('Service updated');
      setEditingService(null);
      onServicesChange();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to update service');
    } finally {
      setSaving(false);
    }
  }

  // ── Delete ──

  async function handleDelete() {
    if (!deleteService) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/calendar/services/${deleteService.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.error ?? 'Failed to delete service');
      }
      toast.success('Service deleted');
      if (String(deleteService.id) === selectedServiceId) {
        onSelectService('');
      }
      setDeleteService(null);
      onServicesChange();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to delete service');
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
          Easy!Appointments is not configured. Contact your administrator to set up the connection before managing services.
        </p>
      </div>
    );
  }

  // ── Render form fields (shared between add and edit) ──

  const [showAdvanced, setShowAdvanced] = useState(false);

  function renderFormFields(
    form: ServiceFormState,
    setForm: (f: ServiceFormState) => void,
  ) {
    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor="svc-name">Name</Label>
          <Input
            id="svc-name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Consultation"
            className="mt-1"
            required
          />
        </div>
        <div>
          <Label htmlFor="svc-duration">Duration</Label>
          <Select
            id="svc-duration"
            value={String(form.duration)}
            onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })}
            options={durationSelectOptions}
            className="mt-1"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="svc-price">Price</Label>
            <Input
              id="svc-price"
              type="number"
              min={0}
              step="0.01"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: Number(e.target.value) || 0 })}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="svc-currency">Currency</Label>
            <Input
              id="svc-currency"
              value={form.currency}
              onChange={(e) => setForm({ ...form, currency: e.target.value })}
              className="mt-1"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="svc-desc">Description</Label>
          <Textarea
            id="svc-desc"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            placeholder="Optional description"
            className="mt-1"
          />
        </div>

        {/* Advanced options - collapsed by default */}
        <div className="border-t border-secondary-200 dark:border-secondary-700 pt-3">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-1.5 text-sm text-secondary-500 hover:text-secondary-700 dark:hover:text-secondary-300 transition-colors"
          >
            <ChevronDown
              className={cn(
                "w-4 h-4 transition-transform",
                !showAdvanced && "-rotate-90"
              )}
            />
            Advanced options
          </button>
          {showAdvanced && (
            <div className="mt-3 space-y-4">
              <div>
                <div className="flex items-center gap-1.5">
                  <Label htmlFor="svc-attendants">Max attendees per slot</Label>
                  <InfoTooltip
                    content="How many people can book the same time slot. Use 1 for one-on-one appointments, or higher for group sessions."
                    side="right"
                  />
                </div>
                <Input
                  id="svc-attendants"
                  type="number"
                  min={1}
                  value={form.attendantsNumber}
                  onChange={(e) => setForm({ ...form, attendantsNumber: Math.max(1, Number(e.target.value) || 1) })}
                  className="mt-1"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <Label htmlFor="svc-avail-type">Availability type</Label>
                  <InfoTooltip
                    content="'Flexible' allows any available slot. 'Fixed' restricts bookings to predefined time slots only."
                    side="right"
                  />
                </div>
                <Select
                  id="svc-avail-type"
                  value={form.availabilitiesType}
                  onChange={(e) => setForm({ ...form, availabilitiesType: e.target.value })}
                  options={[
                    { value: 'flexible', label: 'Flexible' },
                    { value: 'fixed', label: 'Fixed' },
                  ]}
                  className="mt-1"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Build active service select options ──

  const activeServiceOptions = [
    { value: '', label: 'Chatbot will ask customer' },
    ...services.map((s) => ({
      value: String(s.id),
      label: `${s.name} (${s.duration} min)`,
    })),
  ];

  return (
    <div className="space-y-6">
      {/* Active Service selector */}
      <div className="p-4 rounded-lg border-2 border-primary-200 dark:border-primary-800 bg-primary-50/50 dark:bg-primary-900/10">
        <div className="flex items-center gap-1.5 mb-2">
          <Label htmlFor="active-service" className="font-semibold">Active Service</Label>
          <InfoTooltip
            content="The service this chatbot will book appointments for. If no service is selected, the chatbot will ask the customer to choose from the available services during the conversation."
            side="right"
          />
        </div>
        <Select
          id="active-service"
          value={selectedServiceId}
          onChange={(e) => onSelectService(e.target.value)}
          options={activeServiceOptions}
          disabled={services.length === 0}
        />
        {durationMismatch && (
          <div className="mt-2 flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg text-sm">
            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-amber-800 dark:text-amber-200">
              The selected service duration ({selectedService!.duration} min) differs from your
              appointment duration ({eventTypeDuration} min). Consider updating your appointment
              settings to match.
            </p>
            <InfoTooltip
              content="The duration configured in Appointment Settings doesn't match this service's duration in Easy!Appointments. Update either to match for accurate availability."
              side="right"
            />
          </div>
        )}
      </div>

      {/* Service list */}
      {services.length === 0 && connectionState === 'connected' ? (
        <div className="text-center py-8 text-secondary-500">
          <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No services yet</p>
          <p className="text-xs mt-1 text-secondary-400">Create your first service to allow your chatbot to accept bookings.</p>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-secondary-500 uppercase tracking-wider">All Services</p>
            <Badge variant="secondary" className="text-xs">{services.length}</Badge>
          </div>
          {services.map((s) => (
            <div
              key={s.id}
              className={cn(
                "flex items-center justify-between p-3 rounded-lg border",
                String(s.id) === selectedServiceId
                  ? "border-primary-300 dark:border-primary-700 bg-primary-50 dark:bg-primary-900/20 ring-1 ring-primary-200 dark:ring-primary-800"
                  : "border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-800/50"
              )}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-sm font-medium text-secondary-900 dark:text-secondary-100 truncate">
                  {s.name}
                </span>
                {String(s.id) === selectedServiceId && (
                  <Badge className="flex items-center gap-1 flex-shrink-0 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    <Check className="w-3 h-3" />
                    Active
                  </Badge>
                )}
                <Tooltip content="Appointment duration">
                  <Badge variant="secondary" className="flex items-center gap-1 flex-shrink-0">
                    <Clock className="w-3 h-3" />
                    {s.duration} min
                  </Badge>
                </Tooltip>
                {s.price > 0 && (
                  <Tooltip content="Default price for this service">
                    <Badge variant="outline" className="flex-shrink-0">
                      {s.price} {s.currency}
                    </Badge>
                  </Tooltip>
                )}
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <Tooltip content="Edit service">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={() => openEdit(s)}
                    aria-label={`Edit ${s.name}`}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                </Tooltip>
                <Tooltip content="Delete service">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    onClick={() => setDeleteService(s)}
                    aria-label={`Delete ${s.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </Tooltip>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Service button */}
      <Tooltip content="Add a new bookable service">
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
          Add Service
        </Button>
      </Tooltip>

      {/* Add Service dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Service</DialogTitle>
            <DialogDescription>
              Create a new service for customers to book.
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

      {/* Edit Service dialog */}
      <Dialog open={editingService !== null} onOpenChange={(open) => !open && cancelEdit()}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Service</DialogTitle>
            <DialogDescription>
              Update the service details.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            {renderFormFields(editForm, setEditForm)}
          </div>
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={cancelEdit} disabled={saving}>
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
      <Dialog open={deleteService !== null} onOpenChange={(open) => !open && setDeleteService(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Service?</DialogTitle>
            <DialogDescription>
              This will remove the service from Easy!Appointments. Existing bookings will not be
              affected.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setDeleteService(null)} disabled={deleting}>
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
