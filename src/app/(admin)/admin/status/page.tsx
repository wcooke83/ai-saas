'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Edit2, Trash2, AlertCircle, CheckCircle2, Wrench, TrendingDown, Loader2, RefreshCw, Activity } from 'lucide-react';
import { toast } from 'sonner';
import { H1 } from '@/components/ui/heading';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type {
  StatusComponentRow,
  StatusIncidentRow,
  ComponentStatus,
  UpdateStatus,
} from '@/types/status';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function statusColor(status: ComponentStatus): string {
  switch (status) {
    case 'operational': return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800';
    case 'degraded':    return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800';
    case 'outage':      return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800';
    case 'maintenance': return 'text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-900/30 border-sky-200 dark:border-sky-800';
  }
}

function incidentStatusColor(status: string): string {
  switch (status) {
    case 'investigating': return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800';
    case 'identified':   return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800';
    case 'monitoring':   return 'text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-900/30 border-sky-200 dark:border-sky-800';
    case 'resolved':     return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800';
    default:             return 'text-secondary-600 dark:text-secondary-400 bg-secondary-50 dark:bg-secondary-800 border-secondary-200 dark:border-secondary-700';
  }
}

const STATUS_OPTIONS: { label: string; value: ComponentStatus }[] = [
  { label: 'Operational',        value: 'operational' },
  { label: 'Degraded Performance', value: 'degraded' },
  { label: 'Outage',             value: 'outage' },
  { label: 'Under Maintenance',  value: 'maintenance' },
];

const UPDATE_STATUS_OPTIONS: UpdateStatus[] = ['Investigating', 'Identified', 'Monitoring', 'Resolved'];

// ─── ComponentsTab ────────────────────────────────────────────────────────────

function ComponentsTab({
  components,
  onStatusChange,
}: {
  components: StatusComponentRow[];
  onStatusChange: (id: string, status: ComponentStatus) => Promise<void>;
}) {
  const [updating, setUpdating] = useState<string | null>(null);

  async function handleStatusChange(id: string, status: ComponentStatus) {
    setUpdating(id);
    try {
      await onStatusChange(id, status);
    } finally {
      setUpdating(null);
    }
  }

  if (components.length === 0) {
    return (
      <div className="mt-6 text-center py-16 text-secondary-500 dark:text-secondary-400">
        No components configured.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
      {components.map((comp) => {
        const isPulsing = comp.status === 'degraded' || comp.status === 'outage';
        return (
          <div
            key={comp.id}
            className="rounded-lg border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 p-4"
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="min-w-0">
                <p className="font-medium text-secondary-900 dark:text-secondary-100 truncate">
                  {comp.name}
                </p>
                <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-0.5">
                  {comp.category}
                </p>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {isPulsing && (
                  <span className="relative flex h-2 w-2">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${comp.status === 'outage' ? 'bg-red-500' : 'bg-amber-500'}`} />
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${comp.status === 'outage' ? 'bg-red-500' : 'bg-amber-500'}`} />
                  </span>
                )}
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${statusColor(comp.status)}`}>
                  {STATUS_OPTIONS.find((o) => o.value === comp.status)?.label ?? comp.status}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {updating === comp.id ? (
                <Loader2 className="w-4 h-4 animate-spin text-secondary-400" />
              ) : null}
              <select
                className="flex-1 text-sm rounded-md border border-secondary-300 dark:border-secondary-600 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100 px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
                value={comp.status}
                disabled={updating === comp.id}
                onChange={(e) => handleStatusChange(comp.id, e.target.value as ComponentStatus)}
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <p className="text-xs text-secondary-400 dark:text-secondary-500 mt-2">
              Updated {formatDate(comp.updated_at)}
            </p>
          </div>
        );
      })}
    </div>
  );
}

// ─── IncidentRow ──────────────────────────────────────────────────────────────

function IncidentRow({
  incident,
  components,
  onAddUpdate,
  onDelete,
  showActions,
}: {
  incident: StatusIncidentRow;
  components: StatusComponentRow[];
  onAddUpdate: (incident: StatusIncidentRow, prefillResolved?: boolean) => void;
  onDelete: (incident: StatusIncidentRow) => void;
  showActions: boolean;
}) {
  const affectedNames = incident.affected_components.map(
    (slug) => components.find((c) => c.slug === slug || c.id === slug)?.name ?? slug
  );

  return (
    <div className="rounded-lg border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-medium text-secondary-900 dark:text-secondary-100">{incident.title}</p>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${incidentStatusColor(incident.status)}`}>
              {incident.status.charAt(0).toUpperCase() + incident.status.slice(1)}
            </span>
          </div>
          <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1">
            Started {formatDate(incident.started_at)}
            {incident.resolved_at ? ` · Resolved ${formatDate(incident.resolved_at)}` : ''}
          </p>
          {affectedNames.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {affectedNames.map((name) => (
                <span
                  key={name}
                  className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-secondary-100 dark:bg-secondary-700 text-secondary-600 dark:text-secondary-300"
                >
                  {name}
                </span>
              ))}
            </div>
          )}
        </div>
        {showActions && (
          <div className="flex items-center gap-2 flex-shrink-0">
            {incident.status !== 'resolved' && (
              <button
                type="button"
                onClick={() => onAddUpdate(incident, true)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Resolve
              </button>
            )}
            <button
              type="button"
              onClick={() => onAddUpdate(incident, false)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md border border-secondary-300 dark:border-secondary-600 text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              Add Update
            </button>
            <button
              type="button"
              onClick={() => onDelete(incident)}
              className="inline-flex items-center p-1.5 rounded-md text-secondary-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
              aria-label="Delete incident"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── IncidentsTab ─────────────────────────────────────────────────────────────

function IncidentsTab({
  incidents,
  resolvedIncidents,
  components,
  onNewIncident,
  onAddUpdate,
  onDelete,
}: {
  incidents: StatusIncidentRow[];
  resolvedIncidents: StatusIncidentRow[];
  components: StatusComponentRow[];
  onNewIncident: () => void;
  onAddUpdate: (incident: StatusIncidentRow, prefillResolved?: boolean) => void;
  onDelete: (incident: StatusIncidentRow) => void;
}) {
  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-secondary-900 dark:text-secondary-100">Active Incidents</h2>
        <button
          type="button"
          onClick={onNewIncident}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md bg-primary-600 text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Incident
        </button>
      </div>

      {incidents.length === 0 ? (
        <div className="rounded-lg border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 p-8 text-center">
          <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
          <p className="text-secondary-500 dark:text-secondary-400 text-sm">No active incidents</p>
        </div>
      ) : (
        <div className="space-y-3">
          {incidents.map((inc) => (
            <IncidentRow
              key={inc.id}
              incident={inc}
              components={components}
              onAddUpdate={onAddUpdate}
              onDelete={onDelete}
              showActions
            />
          ))}
        </div>
      )}

      {resolvedIncidents.length > 0 && (
        <div className="mt-8">
          <h2 className="text-base font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
            Recent Resolved Incidents
          </h2>
          <div className="space-y-3">
            {resolvedIncidents.map((inc) => (
              <IncidentRow
                key={inc.id}
                incident={inc}
                components={components}
                onAddUpdate={onAddUpdate}
                onDelete={onDelete}
                showActions={false}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── MaintenanceRow ───────────────────────────────────────────────────────────

function MaintenanceRow({
  item,
  components,
  onEdit,
  onDelete,
}: {
  item: StatusIncidentRow;
  components: StatusComponentRow[];
  onEdit: (item: StatusIncidentRow) => void;
  onDelete: (item: StatusIncidentRow) => void;
}) {
  const affectedNames = item.affected_components.map(
    (slug) => components.find((c) => c.slug === slug || c.id === slug)?.name ?? slug
  );

  return (
    <div className="rounded-lg border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-medium text-secondary-900 dark:text-secondary-100">{item.title}</p>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-900/30 border-sky-200 dark:border-sky-800">
              Maintenance
            </span>
          </div>
          <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1">
            {item.scheduled_start ? formatDate(item.scheduled_start) : '—'}
            {' '}→{' '}
            {item.scheduled_end ? formatDate(item.scheduled_end) : '—'}
          </p>
          {affectedNames.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {affectedNames.map((name) => (
                <span
                  key={name}
                  className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-secondary-100 dark:bg-secondary-700 text-secondary-600 dark:text-secondary-300"
                >
                  {name}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={() => onEdit(item)}
            className="inline-flex items-center gap-1.5 p-1.5 rounded-md text-secondary-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Edit maintenance window"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(item)}
            className="inline-flex items-center p-1.5 rounded-md text-secondary-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
            aria-label="Delete maintenance window"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MaintenanceTab ───────────────────────────────────────────────────────────

function MaintenanceTab({
  maintenance,
  pastMaintenance,
  components,
  onSchedule,
  onEdit,
  onDelete,
}: {
  maintenance: StatusIncidentRow[];
  pastMaintenance: StatusIncidentRow[];
  components: StatusComponentRow[];
  onSchedule: () => void;
  onEdit: (item: StatusIncidentRow) => void;
  onDelete: (item: StatusIncidentRow) => void;
}) {
  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-secondary-900 dark:text-secondary-100">Upcoming Maintenance</h2>
        <button
          type="button"
          onClick={onSchedule}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md bg-primary-600 text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Schedule Maintenance
        </button>
      </div>

      {maintenance.length === 0 ? (
        <div className="rounded-lg border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 p-8 text-center">
          <Wrench className="w-8 h-8 text-sky-500 mx-auto mb-2" />
          <p className="text-secondary-500 dark:text-secondary-400 text-sm">No upcoming maintenance windows</p>
        </div>
      ) : (
        <div className="space-y-3">
          {maintenance.map((item) => (
            <MaintenanceRow
              key={item.id}
              item={item}
              components={components}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}

      {pastMaintenance.length > 0 && (
        <div className="mt-8">
          <h2 className="text-base font-semibold text-secondary-500 dark:text-secondary-400 mb-4">
            Past Maintenance
          </h2>
          <div className="space-y-3 opacity-70">
            {pastMaintenance.map((item) => (
              <MaintenanceRow
                key={item.id}
                item={item}
                components={components}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── CreateIncidentModal ──────────────────────────────────────────────────────

function CreateIncidentModal({
  open,
  onClose,
  components,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  components: StatusComponentRow[];
  onCreated: () => void;
}) {
  const [title, setTitle] = useState('');
  const [affectedComponents, setAffectedComponents] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [initialStatus, setInitialStatus] = useState<UpdateStatus>('Investigating');
  const [submitting, setSubmitting] = useState(false);

  function reset() {
    setTitle('');
    setAffectedComponents([]);
    setMessage('');
    setInitialStatus('Investigating');
  }

  function handleClose() {
    reset();
    onClose();
  }

  function toggleComponent(id: string) {
    setAffectedComponents((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) { toast.error('Title is required'); return; }
    if (!message.trim()) { toast.error('Initial message is required'); return; }

    setSubmitting(true);
    try {
      const res = await fetch('/api/status/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          affected_components: affectedComponents,
          initial_message: message,
          initial_status: initialStatus,
          is_maintenance: false,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message ?? 'Failed to create incident');
      toast.success('Incident created');
      reset();
      onClose();
      onCreated();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to create incident');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Incident</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Brief description of the incident"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
              Affected Components
            </label>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {components.map((comp) => (
                <label
                  key={comp.id}
                  className="flex items-center gap-2 text-sm cursor-pointer select-none"
                >
                  <input
                    type="checkbox"
                    checked={affectedComponents.includes(comp.slug)}
                    onChange={() => toggleComponent(comp.slug)}
                    className="rounded border-secondary-300 dark:border-secondary-600 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-secondary-700 dark:text-secondary-300 truncate">{comp.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
              Initial Update Message <span className="text-red-500">*</span>
            </label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe what is happening..."
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
              Initial Status
            </label>
            <select
              value={initialStatus}
              onChange={(e) => setInitialStatus(e.target.value as UpdateStatus)}
              className="w-full text-sm rounded-md border border-secondary-300 dark:border-secondary-600 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {['Investigating', 'Identified'].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <DialogFooter>
            <button
              type="button"
              onClick={handleClose}
              disabled={submitting}
              className="px-4 py-2 text-sm font-medium text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-secondary-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md bg-primary-600 text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 transition-colors"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Create Incident
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── AddUpdateModal ───────────────────────────────────────────────────────────

function AddUpdateModal({
  open,
  incident,
  prefillResolved,
  onClose,
  onUpdated,
}: {
  open: boolean;
  incident: StatusIncidentRow | null;
  prefillResolved: boolean;
  onClose: () => void;
  onUpdated: () => void;
}) {
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<UpdateStatus>('Investigating');
  const [submitting, setSubmitting] = useState(false);

  // Sync status when prefillResolved changes
  useEffect(() => {
    if (open) {
      setStatus(prefillResolved ? 'Resolved' : 'Investigating');
      setMessage('');
    }
  }, [open, prefillResolved]);

  function handleClose() {
    setMessage('');
    setStatus('Investigating');
    onClose();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!incident) return;
    if (!message.trim()) { toast.error('Message is required'); return; }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/status/incidents/${incident.id}/updates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message ?? 'Failed to add update');
      toast.success('Update added');
      handleClose();
      onUpdated();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to add update');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Update</DialogTitle>
        </DialogHeader>
        {incident && (
          <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-2 mb-3">
            {incident.title}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
              Update Message <span className="text-red-500">*</span>
            </label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe the current status..."
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
              New Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as UpdateStatus)}
              className="w-full text-sm rounded-md border border-secondary-300 dark:border-secondary-600 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {UPDATE_STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <DialogFooter>
            <button
              type="button"
              onClick={handleClose}
              disabled={submitting}
              className="px-4 py-2 text-sm font-medium text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-secondary-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md bg-primary-600 text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 transition-colors"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Post Update
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── CreateMaintenanceModal ───────────────────────────────────────────────────

function CreateMaintenanceModal({
  open,
  editItem,
  onClose,
  components,
  onSaved,
}: {
  open: boolean;
  editItem: StatusIncidentRow | null;
  onClose: () => void;
  components: StatusComponentRow[];
  onSaved: () => void;
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [affectedComponents, setAffectedComponents] = useState<string[]>([]);
  const [scheduledStart, setScheduledStart] = useState('');
  const [scheduledEnd, setScheduledEnd] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Populate form when editing
  useEffect(() => {
    if (open && editItem) {
      setTitle(editItem.title);
      setDescription('');
      setAffectedComponents(editItem.affected_components ?? []);
      setScheduledStart(editItem.scheduled_start ? toLocalDatetimeValue(editItem.scheduled_start) : '');
      setScheduledEnd(editItem.scheduled_end ? toLocalDatetimeValue(editItem.scheduled_end) : '');
    } else if (open && !editItem) {
      setTitle('');
      setDescription('');
      setAffectedComponents([]);
      setScheduledStart('');
      setScheduledEnd('');
    }
  }, [open, editItem]);

  function toLocalDatetimeValue(iso: string) {
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  function handleClose() {
    onClose();
  }

  function toggleComponent(slug: string) {
    setAffectedComponents((prev) =>
      prev.includes(slug) ? prev.filter((c) => c !== slug) : [...prev, slug]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) { toast.error('Title is required'); return; }
    if (!scheduledStart) { toast.error('Scheduled start is required'); return; }
    if (!scheduledEnd) { toast.error('Scheduled end is required'); return; }
    if (new Date(scheduledEnd) <= new Date(scheduledStart)) {
      toast.error('Scheduled end must be after scheduled start');
      return;
    }

    setSubmitting(true);
    try {
      if (editItem) {
        const res = await fetch(`/api/status/incidents/${editItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title,
            affected_components: affectedComponents,
            scheduled_start: new Date(scheduledStart).toISOString(),
            scheduled_end: new Date(scheduledEnd).toISOString(),
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error?.message ?? 'Failed to update maintenance window');
        toast.success('Maintenance window updated');
      } else {
        if (!description.trim()) { toast.error('Description is required'); setSubmitting(false); return; }
        const res = await fetch('/api/status/incidents', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title,
            affected_components: affectedComponents,
            initial_message: description,
            is_maintenance: true,
            scheduled_start: new Date(scheduledStart).toISOString(),
            scheduled_end: new Date(scheduledEnd).toISOString(),
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error?.message ?? 'Failed to create maintenance window');
        toast.success('Maintenance window scheduled');
      }
      handleClose();
      onSaved();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save maintenance window');
    } finally {
      setSubmitting(false);
    }
  }

  const isEdit = !!editItem;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Maintenance Window' : 'Schedule Maintenance'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Database maintenance"
              required
            />
          </div>

          {!isEdit && (
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the maintenance work..."
                rows={3}
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
              Affected Components
            </label>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {components.map((comp) => (
                <label
                  key={comp.id}
                  className="flex items-center gap-2 text-sm cursor-pointer select-none"
                >
                  <input
                    type="checkbox"
                    checked={affectedComponents.includes(comp.slug)}
                    onChange={() => toggleComponent(comp.slug)}
                    className="rounded border-secondary-300 dark:border-secondary-600 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-secondary-700 dark:text-secondary-300 truncate">{comp.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                Start <span className="text-red-500">*</span>
              </label>
              <Input
                type="datetime-local"
                value={scheduledStart}
                onChange={(e) => setScheduledStart(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                End <span className="text-red-500">*</span>
              </label>
              <Input
                type="datetime-local"
                value={scheduledEnd}
                onChange={(e) => setScheduledEnd(e.target.value)}
                required
              />
            </div>
          </div>

          <DialogFooter>
            <button
              type="button"
              onClick={handleClose}
              disabled={submitting}
              className="px-4 py-2 text-sm font-medium text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-secondary-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md bg-primary-600 text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 transition-colors"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {isEdit ? 'Save Changes' : 'Schedule'}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminStatusPage() {
  const [components, setComponents] = useState<StatusComponentRow[]>([]);
  const [incidents, setIncidents] = useState<StatusIncidentRow[]>([]);
  const [resolvedIncidents, setResolvedIncidents] = useState<StatusIncidentRow[]>([]);
  const [maintenance, setMaintenance] = useState<StatusIncidentRow[]>([]);
  const [pastMaintenance, setPastMaintenance] = useState<StatusIncidentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Modal states
  const [createIncidentOpen, setCreateIncidentOpen] = useState(false);
  const [createMaintenanceOpen, setCreateMaintenanceOpen] = useState(false);
  const [editMaintenanceItem, setEditMaintenanceItem] = useState<StatusIncidentRow | null>(null);
  const [selectedIncident, setSelectedIncident] = useState<StatusIncidentRow | null>(null);
  const [prefillResolved, setPrefillResolved] = useState(false);
  const [addUpdateOpen, setAddUpdateOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; item: StatusIncidentRow | null }>({
    open: false,
    item: null,
  });
  const [deleting, setDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState('components');

  const fetchAll = useCallback(async (quiet = false) => {
    if (!quiet) setLoading(true);
    else setRefreshing(true);

    try {
      const [compRes, activeRes, resolvedRes, maintRes] = await Promise.all([
        fetch('/api/status/components'),
        fetch('/api/status/incidents?active=true'),
        fetch('/api/status/incidents?resolved=true'),
        fetch('/api/status/incidents?maintenance=true'),
      ]);

      const [compData, activeData, resolvedData, maintData] = await Promise.all([
        compRes.json(),
        activeRes.json(),
        resolvedRes.json(),
        maintRes.json(),
      ]);

      if (compData.error) throw new Error(compData.error);
      if (activeData.error) throw new Error(activeData.error);
      if (resolvedData.error) throw new Error(resolvedData.error);
      if (maintData.error) throw new Error(maintData.error);

      setComponents(compData.components ?? []);
      setIncidents(activeData.incidents ?? []);
      setResolvedIncidents(resolvedData.incidents ?? []);

      // Split maintenance into upcoming vs past
      const now = new Date().toISOString();
      const allMaint: StatusIncidentRow[] = maintData.incidents ?? [];
      setMaintenance(allMaint.filter((m) => (m.scheduled_end ?? '') > now));
      setPastMaintenance(allMaint.filter((m) => (m.scheduled_end ?? '') <= now));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to load status data', { id: 'status-fetch-error' });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  async function handleComponentStatusChange(id: string, status: ComponentStatus) {
    // Optimistic update
    setComponents((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status, updated_at: new Date().toISOString() } : c))
    );

    try {
      const res = await fetch(`/api/status/components/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) {
        // Revert
        await fetchAll(true);
        throw new Error(data.error?.message ?? 'Failed to update status');
      }
      toast.success('Component status updated');
      // Sync server value
      if (data.component) {
        setComponents((prev) =>
          prev.map((c) => (c.id === id ? data.component : c))
        );
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update component status');
    }
  }

  function openAddUpdate(incident: StatusIncidentRow, prefill = false) {
    setSelectedIncident(incident);
    setPrefillResolved(prefill);
    setAddUpdateOpen(true);
  }

  function openEditMaintenance(item: StatusIncidentRow) {
    setEditMaintenanceItem(item);
    setCreateMaintenanceOpen(true);
  }

  function openDeleteConfirm(item: StatusIncidentRow) {
    setDeleteConfirm({ open: true, item });
  }

  async function handleDelete() {
    const item = deleteConfirm.item;
    if (!item) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/status/incidents/${item.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message ?? 'Failed to delete');
      toast.success('Deleted successfully');
      setDeleteConfirm({ open: false, item: null });
      await fetchAll(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-100 dark:bg-primary-900/50 rounded-lg">
            <Activity className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <H1 variant="dashboard">Status Page</H1>
            <p className="text-secondary-600 dark:text-secondary-400">
              Manage the public status page. Changes appear within 60 seconds.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => fetchAll(true)}
          disabled={refreshing || loading}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-secondary-100 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24 mt-6">
          <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList>
            <TabsTrigger value="components">Components</TabsTrigger>
            <TabsTrigger value="incidents">
              Incidents
              {incidents.length > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 text-xs font-bold rounded-full bg-red-500 text-white">
                  {incidents.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          </TabsList>

          <TabsContent value="components">
            <ComponentsTab
              components={components}
              onStatusChange={handleComponentStatusChange}
            />
          </TabsContent>

          <TabsContent value="incidents">
            <IncidentsTab
              incidents={incidents}
              resolvedIncidents={resolvedIncidents}
              components={components}
              onNewIncident={() => setCreateIncidentOpen(true)}
              onAddUpdate={openAddUpdate}
              onDelete={openDeleteConfirm}
            />
          </TabsContent>

          <TabsContent value="maintenance">
            <MaintenanceTab
              maintenance={maintenance}
              pastMaintenance={pastMaintenance}
              components={components}
              onSchedule={() => {
                setEditMaintenanceItem(null);
                setCreateMaintenanceOpen(true);
              }}
              onEdit={openEditMaintenance}
              onDelete={openDeleteConfirm}
            />
          </TabsContent>
        </Tabs>
      )}

      <CreateIncidentModal
        open={createIncidentOpen}
        onClose={() => setCreateIncidentOpen(false)}
        components={components}
        onCreated={() => fetchAll(true)}
      />

      <AddUpdateModal
        open={addUpdateOpen}
        incident={selectedIncident}
        prefillResolved={prefillResolved}
        onClose={() => {
          setAddUpdateOpen(false);
          setSelectedIncident(null);
        }}
        onUpdated={() => fetchAll(true)}
      />

      <CreateMaintenanceModal
        open={createMaintenanceOpen}
        editItem={editMaintenanceItem}
        onClose={() => {
          setCreateMaintenanceOpen(false);
          setEditMaintenanceItem(null);
        }}
        components={components}
        onSaved={() => fetchAll(true)}
      />

      <ConfirmDialog
        open={deleteConfirm.open}
        onOpenChange={(v) => !v && setDeleteConfirm({ open: false, item: null })}
        title="Delete?"
        description={`Are you sure you want to delete "${deleteConfirm.item?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        isLoading={deleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
