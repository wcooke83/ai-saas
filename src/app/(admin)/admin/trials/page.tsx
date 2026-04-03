'use client';

import { useState, useEffect } from 'react';
import { Gift, Plus, Copy, Trash2, ExternalLink, Loader2, Check, Calendar, Users } from 'lucide-react';
import { toast } from 'sonner';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { H1 } from '@/components/ui/heading';
import type { TrialLinkWithPlan, SubscriptionPlan } from '@/types/billing';

export default function TrialsAdminPage() {
  const [trials, setTrials] = useState<TrialLinkWithPlan[]>([]);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [includeInactive, setIncludeInactive] = useState(false);

  // Create form state
  const [formData, setFormData] = useState({
    code: '',
    planId: '',
    durationDays: 14,
    creditsLimit: '',
    maxRedemptions: '',
    expiresAt: '',
    name: '',
    description: '',
  });
  const [creating, setCreating] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; code: string | null }>({
    open: false,
    code: null,
  });
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchData();
  }, [includeInactive]);

  async function fetchData() {
    try {
      const [trialsRes, plansRes] = await Promise.all([
        fetch(`/api/admin/trials?includeInactive=${includeInactive}`),
        fetch('/api/admin/plans'),
      ]);
      const [trialsData, plansData] = await Promise.all([trialsRes.json(), plansRes.json()]);

      if (trialsData.error) throw new Error(trialsData.error?.message || trialsData.error);
      if (plansData.error) throw new Error(plansData.error?.message || plansData.error);

      setTrials(trialsData.data || []);
      setPlans(plansData.data || []);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);

    try {
      const res = await fetch('/api/admin/trials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: formData.code.toUpperCase(),
          planId: formData.planId,
          durationDays: formData.durationDays,
          creditsLimit: formData.creditsLimit ? parseInt(formData.creditsLimit) : undefined,
          maxRedemptions: formData.maxRedemptions ? parseInt(formData.maxRedemptions) : undefined,
          expiresAt: formData.expiresAt || undefined,
          name: formData.name || undefined,
          description: formData.description || undefined,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error?.message || data.error);

      toast.success('Trial link created successfully');
      setShowCreateForm(false);
      setFormData({
        code: '',
        planId: '',
        durationDays: 14,
        creditsLimit: '',
        maxRedemptions: '',
        expiresAt: '',
        name: '',
        description: '',
      });
      fetchData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to create trial link');
    } finally {
      setCreating(false);
    }
  }

  async function handleToggleActive(trial: TrialLinkWithPlan) {
    try {
      const res = await fetch(`/api/admin/trials/${trial.code}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !trial.is_active }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error?.message || data.error);
      toast.success(`Trial link ${!trial.is_active ? 'activated' : 'deactivated'}`);
      fetchData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update trial');
    }
  }

  function openDeleteConfirm(code: string) {
    setDeleteConfirm({ open: true, code });
  }

  async function handleDelete() {
    if (!deleteConfirm.code) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/trials/${deleteConfirm.code}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.error) throw new Error(data.error?.message || data.error);
      toast.success('Trial link deleted successfully');
      setDeleteConfirm({ open: false, code: null });
      fetchData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete trial link');
    } finally {
      setDeleting(false);
    }
  }

  function copyTrialUrl(code: string) {
    const url = `${window.location.origin}/signup?trial=${code}`;
    navigator.clipboard.writeText(url);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  }

  function generateRandomCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({ ...formData, code });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-100 dark:bg-primary-900/50 rounded-lg">
            <Gift className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <H1 variant="dashboard">
              Trial Links
            </H1>
            <p className="text-secondary-600 dark:text-secondary-400">
              Create and manage shareable trial links
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Trial Link
        </button>
      </div>

      {/* Create Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-lg mx-4 p-6 bg-white dark:bg-secondary-800 rounded-xl shadow-xl">
            <h2 className="text-xl font-semibold mb-4 text-secondary-900 dark:text-secondary-100">
              Create Trial Link
            </h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                  Code *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="flex-1 px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg text-secondary-900 dark:text-secondary-100"
                                    style={{ backgroundColor: 'rgb(var(--form-element-bg))' }}
                    placeholder="e.g., SUMMER2024"
                    required
                    pattern="^[A-Z0-9-]+$"
                  />
                  <button
                    type="button"
                    onClick={generateRandomCode}
                    className="px-3 py-2 text-sm bg-secondary-100 dark:bg-secondary-700 hover:bg-secondary-200 dark:hover:bg-secondary-600 text-secondary-700 dark:text-secondary-300 rounded-lg"
                  >
                    Generate
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                  Plan *
                </label>
                <select
                  value={formData.planId}
                  onChange={(e) => setFormData({ ...formData, planId: e.target.value })}
                  className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg text-secondary-900 dark:text-secondary-100"
                    style={{ backgroundColor: 'rgb(var(--form-element-bg))' }}
                  required
                >
                  <option value="">Select a plan...</option>
                  {plans.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.name} ({plan.credits_monthly === -1 ? 'Unlimited' : plan.credits_monthly} credits/mo)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                    Duration (days) *
                  </label>
                  <input
                    type="number"
                    value={formData.durationDays}
                    onChange={(e) => setFormData({ ...formData, durationDays: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg text-secondary-900 dark:text-secondary-100"
                    style={{ backgroundColor: 'rgb(var(--form-element-bg))' }}
                    min="1"
                    max="365"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                    Credits Limit
                  </label>
                  <input
                    type="number"
                    value={formData.creditsLimit}
                    onChange={(e) => setFormData({ ...formData, creditsLimit: e.target.value })}
                    className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg text-secondary-900 dark:text-secondary-100"
                    style={{ backgroundColor: 'rgb(var(--form-element-bg))' }}
                    placeholder="Plan default"
                    min="1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                    Max Redemptions
                  </label>
                  <input
                    type="number"
                    value={formData.maxRedemptions}
                    onChange={(e) => setFormData({ ...formData, maxRedemptions: e.target.value })}
                    className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg text-secondary-900 dark:text-secondary-100"
                    style={{ backgroundColor: 'rgb(var(--form-element-bg))' }}
                    placeholder="Unlimited"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                    Expires At
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.expiresAt}
                    onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                    className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg text-secondary-900 dark:text-secondary-100"
                    style={{ backgroundColor: 'rgb(var(--form-element-bg))' }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                  Name (optional)
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg text-secondary-900 dark:text-secondary-100"
                    style={{ backgroundColor: 'rgb(var(--form-element-bg))' }}
                  placeholder="e.g., Summer Promo 2024"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 px-4 py-2 border border-secondary-300 dark:border-secondary-600 text-secondary-700 dark:text-secondary-300 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-sm text-secondary-600 dark:text-secondary-400">
          <input
            type="checkbox"
            checked={includeInactive}
            onChange={(e) => setIncludeInactive(e.target.checked)}
            className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
          />
          Show inactive trials
        </label>
      </div>

      {/* Trials Table */}
      <div className="overflow-x-auto rounded-xl border border-secondary-200 dark:border-secondary-700">
        <table className="w-full">
          <thead className="bg-secondary-50 dark:bg-secondary-800">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600 dark:text-secondary-400">Code</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600 dark:text-secondary-400">Plan</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600 dark:text-secondary-400">Duration</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600 dark:text-secondary-400">Redemptions</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600 dark:text-secondary-400">Expires</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600 dark:text-secondary-400">Status</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-secondary-600 dark:text-secondary-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-secondary-200 dark:divide-secondary-700 bg-white dark:bg-secondary-800">
            {trials.map((trial) => (
              <tr key={trial.id} className={!trial.is_active ? 'opacity-50' : ''}>
                <td className="px-4 py-3">
                  <div>
                    <div className="font-mono font-medium text-secondary-900 dark:text-secondary-100">
                      {trial.code}
                    </div>
                    {trial.name && (
                      <div className="text-xs text-secondary-500">{trial.name}</div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-secondary-700 dark:text-secondary-300">
                  {trial.plan?.name || 'Unknown'}
                </td>
                <td className="px-4 py-3 text-secondary-700 dark:text-secondary-300">
                  {trial.duration_days} days
                  {trial.credits_limit && (
                    <div className="text-xs text-secondary-500">
                      {trial.credits_limit} credits
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 text-secondary-700 dark:text-secondary-300">
                    <Users className="w-4 h-4" />
                    {trial.redemptions_count}
                    {trial.max_redemptions && (
                      <span className="text-secondary-400">/ {trial.max_redemptions}</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-secondary-700 dark:text-secondary-300">
                  {trial.expires_at ? (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(trial.expires_at).toLocaleDateString()}
                    </div>
                  ) : (
                    <span className="text-secondary-400">Never</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleToggleActive(trial)}
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      trial.is_active
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-secondary-100 text-secondary-600 dark:bg-secondary-700 dark:text-secondary-400'
                    }`}
                  >
                    {trial.is_active ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => copyTrialUrl(trial.code)}
                      className="p-1.5 text-secondary-400 hover:text-primary-500 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded"
                      title="Copy trial URL"
                    >
                      {copiedCode === trial.code ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    <a
                      href={`/signup?trial=${trial.code}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-secondary-400 hover:text-primary-500 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded"
                      title="Open trial page"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => openDeleteConfirm(trial.code)}
                      className="p-1.5 text-secondary-400 hover:text-red-500 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {trials.length === 0 && (
        <div className="text-center py-12 text-secondary-500">
          No trial links found. Create one to start offering trials.
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteConfirm.open}
        onOpenChange={(open) => setDeleteConfirm({ open, code: open ? deleteConfirm.code : null })}
        title="Delete trial link?"
        description="This action cannot be undone. The trial link will be permanently removed."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        onConfirm={handleDelete}
        isLoading={deleting}
      />
    </div>
  );
}
