'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { H1 } from '@/components/ui/heading';
import {
  ShoppingBag,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Check,
  X,
  ArrowUp,
  ArrowDown,
  AlertTriangle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CreditPackage {
  id: string;
  name: string;
  description: string | null;
  credit_amount: number;
  price_cents: number;
  stripe_price_id: string;
  active: boolean;
  sort_order: number;
  created_at: string;
}

type FormState = {
  name: string;
  description: string;
  credit_amount: string;
  price_dollars: string;
  stripe_price_id: string;
  active: boolean;
};

const emptyForm: FormState = {
  name: '',
  description: '',
  credit_amount: '',
  price_dollars: '',
  stripe_price_id: '',
  active: true,
};

export default function AdminCreditPackagesPage() {
  const [packages, setPackages] = useState<CreditPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const supabase = createClient();

  const loadPackages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/credit-packages');
      const data = await res.json();
      if (data.data?.packages) {
        setPackages(data.data.packages);
      }
    } catch {
      setError('Failed to load packages');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPackages();
  }, [loadPackages]);

  // Clear messages after 4s
  useEffect(() => {
    if (success || error) {
      const t = setTimeout(() => { setSuccess(null); setError(null); }, 4000);
      return () => clearTimeout(t);
    }
  }, [success, error]);

  const startEdit = (pkg: CreditPackage) => {
    setEditingId(pkg.id);
    setShowCreateForm(false);
    setForm({
      name: pkg.name,
      description: pkg.description || '',
      credit_amount: String(pkg.credit_amount),
      price_dollars: (pkg.price_cents / 100).toFixed(2),
      stripe_price_id: pkg.stripe_price_id,
      active: pkg.active,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setShowCreateForm(false);
    setForm(emptyForm);
  };

  const handleCreate = async () => {
    const creditAmount = parseInt(form.credit_amount);
    const priceDollars = parseFloat(form.price_dollars);
    if (!form.name.trim()) { setError('Package name is required'); return; }
    if (isNaN(creditAmount) || creditAmount < 1) { setError('Credit amount must be at least 1'); return; }
    if (isNaN(priceDollars) || priceDollars <= 0) { setError('Price must be greater than 0'); return; }
    if (!form.stripe_price_id.startsWith('price_')) { setError('Stripe Price ID must start with "price_"'); return; }

    setSaving(true);
    try {
      const res = await fetch('/api/admin/credit-packages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          description: form.description.trim() || null,
          credit_amount: creditAmount,
          price_cents: Math.round(priceDollars * 100),
          stripe_price_id: form.stripe_price_id.trim(),
          active: form.active,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error?.message || 'Failed to create package');
      }

      setSuccess('Package created');
      setShowCreateForm(false);
      setForm(emptyForm);
      await loadPackages();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingId) return;
    const creditAmount = parseInt(form.credit_amount);
    const priceDollars = parseFloat(form.price_dollars);
    if (!form.name.trim()) { setError('Package name is required'); return; }
    if (isNaN(creditAmount) || creditAmount < 1) { setError('Credit amount must be at least 1'); return; }
    if (isNaN(priceDollars) || priceDollars <= 0) { setError('Price must be greater than 0'); return; }
    if (!form.stripe_price_id.startsWith('price_')) { setError('Stripe Price ID must start with "price_"'); return; }

    setSaving(true);
    try {
      const res = await fetch(`/api/admin/credit-packages/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          description: form.description.trim() || null,
          credit_amount: creditAmount,
          price_cents: Math.round(priceDollars * 100),
          stripe_price_id: form.stripe_price_id.trim(),
          active: form.active,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error?.message || 'Failed to update package');
      }

      setSuccess('Package updated');
      setEditingId(null);
      setForm(emptyForm);
      await loadPackages();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/credit-packages/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error?.message || 'Failed to delete package');
      }
      const data = await res.json();
      setSuccess(data.data?.deactivated ? 'Package deactivated (has purchase history)' : 'Package deleted');
      setDeleteConfirm(null);
      await loadPackages();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
    } finally {
      setSaving(false);
    }
  };

  const handleReorder = async (id: string, direction: 'up' | 'down') => {
    const idx = packages.findIndex(p => p.id === id);
    if (idx < 0) return;
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= packages.length) return;

    // Swap sort_order values
    const a = packages[idx];
    const b = packages[swapIdx];

    try {
      await Promise.all([
        fetch(`/api/admin/credit-packages/${a.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sort_order: b.sort_order }),
        }),
        fetch(`/api/admin/credit-packages/${b.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sort_order: a.sort_order }),
        }),
      ]);
      await loadPackages();
    } catch {
      setError('Failed to reorder');
    }
  };

  const renderForm = (isCreate: boolean) => (
    <Card className="border-primary-200 dark:border-primary-800">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">{isCreate ? 'New Package' : 'Edit Package'}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-secondary-700 dark:text-secondary-300 mb-1">Package Name</label>
            <input
              className="w-full rounded-md border border-secondary-300 dark:border-secondary-600 bg-white dark:bg-secondary-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="e.g. Starter Pack"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-secondary-700 dark:text-secondary-300 mb-1">Description (optional)</label>
            <input
              className="w-full rounded-md border border-secondary-300 dark:border-secondary-600 bg-white dark:bg-secondary-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Brief description for admin reference"
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-secondary-700 dark:text-secondary-300 mb-1">Credits</label>
            <input
              type="number"
              min={1}
              className="w-full rounded-md border border-secondary-300 dark:border-secondary-600 bg-white dark:bg-secondary-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="100"
              value={form.credit_amount}
              onChange={e => setForm(f => ({ ...f, credit_amount: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-secondary-700 dark:text-secondary-300 mb-1">Price ($)</label>
            <input
              type="number"
              min={0}
              step="0.01"
              className="w-full rounded-md border border-secondary-300 dark:border-secondary-600 bg-white dark:bg-secondary-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="9.99"
              value={form.price_dollars}
              onChange={e => setForm(f => ({ ...f, price_dollars: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-secondary-700 dark:text-secondary-300 mb-1">Stripe Price ID</label>
            <input
              className="w-full rounded-md border border-secondary-300 dark:border-secondary-600 bg-white dark:bg-secondary-800 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="price_1ABC..."
              value={form.stripe_price_id}
              onChange={e => setForm(f => ({ ...f, stripe_price_id: e.target.value }))}
            />
            {form.stripe_price_id && !form.stripe_price_id.startsWith('price_') && (
              <p className="text-xs text-amber-500 mt-1">Must start with &quot;price_&quot;</p>
            )}
          </div>
          <div className="flex items-end pb-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.active}
                onChange={e => setForm(f => ({ ...f, active: e.target.checked }))}
                className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-secondary-700 dark:text-secondary-300">Active</span>
            </label>
          </div>
        </div>
        <div className="flex items-center gap-2 pt-2">
          <Button
            size="sm"
            onClick={isCreate ? handleCreate : handleUpdate}
            disabled={saving}
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Check className="w-4 h-4 mr-1" />}
            {isCreate ? 'Create Package' : 'Save Changes'}
          </Button>
          <Button size="sm" variant="outline" onClick={cancelEdit} disabled={saving}>
            <X className="w-4 h-4 mr-1" />
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <H1 variant="dashboard">Credit Packages</H1>
          <p className="text-secondary-500 dark:text-secondary-400 mt-1">
            Manage global credit packages available to all chatbots. Chatbot owners can toggle which packages their visitors see.
          </p>
        </div>
        {!showCreateForm && !editingId && (
          <Button onClick={() => { setShowCreateForm(true); setForm(emptyForm); }}>
            <Plus className="w-4 h-4 mr-1" />
            New Package
          </Button>
        )}
      </div>

      {/* Status messages */}
      {error && (
        <div className="rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-3 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}
      {success && (
        <div className="rounded-lg border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 p-3 flex items-center gap-2">
          <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
          <p className="text-sm text-green-700 dark:text-green-300">{success}</p>
        </div>
      )}

      {/* Create form */}
      {showCreateForm && renderForm(true)}

      {/* Edit form */}
      {editingId && renderForm(false)}

      {/* Packages list */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-secondary-400" />
        </div>
      ) : packages.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <ShoppingBag className="w-12 h-12 text-secondary-300 dark:text-secondary-600 mx-auto mb-3" />
            <p className="text-secondary-500 dark:text-secondary-400">No credit packages configured yet.</p>
            <p className="text-sm text-secondary-400 dark:text-secondary-500 mt-1">
              Create packages that chatbot visitors can purchase when credits are exhausted.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {packages.map((pkg, idx) => (
            <Card
              key={pkg.id}
              className={cn(
                'transition-colors',
                !pkg.active && 'opacity-60',
                editingId === pkg.id && 'ring-2 ring-primary-500'
              )}
            >
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 min-w-0">
                    {/* Reorder buttons */}
                    <div className="flex flex-col gap-0.5">
                      <button
                        type="button"
                        onClick={() => handleReorder(pkg.id, 'up')}
                        disabled={idx === 0}
                        className="p-0.5 text-secondary-400 hover:text-secondary-600 disabled:opacity-30 disabled:cursor-not-allowed"
                        aria-label="Move up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleReorder(pkg.id, 'down')}
                        disabled={idx === packages.length - 1}
                        className="p-0.5 text-secondary-400 hover:text-secondary-600 disabled:opacity-30 disabled:cursor-not-allowed"
                        aria-label="Move down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{pkg.name}</span>
                        <Badge variant={pkg.active ? 'default' : 'secondary'}>
                          {pkg.active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-secondary-500 dark:text-secondary-400">
                        <span>{pkg.credit_amount} credits</span>
                        <span>${(pkg.price_cents / 100).toFixed(2)}</span>
                        <span className="font-mono">{pkg.stripe_price_id}</span>
                      </div>
                      {pkg.description && (
                        <p className="text-xs text-secondary-400 dark:text-secondary-500 mt-0.5">{pkg.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => startEdit(pkg)}
                      disabled={!!editingId || showCreateForm}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    {deleteConfirm === pkg.id ? (
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(pkg.id)}
                          disabled={saving}
                        >
                          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm'}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setDeleteConfirm(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setDeleteConfirm(pkg.id)}
                        disabled={!!editingId || showCreateForm}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Info box */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <p className="text-sm text-blue-700 dark:text-blue-300">
          Create prices in your{' '}
          <a href="https://dashboard.stripe.com/prices" target="_blank" rel="noopener noreferrer" className="underline font-medium">
            Stripe Dashboard
          </a>{' '}
          first, then paste the Price ID here. Chatbot owners can toggle which packages are shown to their visitors from their chatbot settings.
        </p>
      </div>
    </div>
  );
}
