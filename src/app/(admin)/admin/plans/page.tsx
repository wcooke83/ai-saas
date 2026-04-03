'use client';

import { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Package, Plus, Edit2, Trash2, X, Loader2, GripVertical, Building2,
  Bot, EyeOff
} from 'lucide-react';
import { Tooltip } from '@/components/ui/tooltip';
import { Textarea } from '@/components/ui/textarea';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { H1 } from '@/components/ui/heading';
import { toast } from 'sonner';
import type { SubscriptionPlan } from '@/types/billing';
import { isCustomPricingPlan, formatPrice, formatCredits } from '@/lib/billing/utils';

// Tool definitions with icons
const AVAILABLE_TOOLS = [
  { id: 'custom_chatbots', name: 'Custom Chatbots', icon: Bot },
] as const;

type ToolId = typeof AVAILABLE_TOOLS[number]['id'];

interface PlanFormData {
  sequence: number;
  slug: string;
  name: string;
  description: string;
  usageDescription: string;
  isCustomPricing: boolean;
  priceMonthly: number;
  priceYearly: number;
  priceLifetime: number;
  stripePriceIdMonthly: string;
  stripePriceIdYearly: string;
  creditsMonthly: number;
  apiKeysLimit: number;
  rateLimitTokens: number | null;
  rateLimitPeriodSeconds: number | null;
  rateLimitIsHardCap: boolean;
  trialDays: number;
  isFeatured: boolean;
  isHidden: boolean;
  includedTools: Record<ToolId, boolean>;
}

const defaultFormData: PlanFormData = {
  sequence: 0,
  slug: '',
  name: '',
  description: '',
  usageDescription: '',
  isCustomPricing: false,
  priceMonthly: 0,
  priceYearly: 0,
  priceLifetime: 0,
  stripePriceIdMonthly: '',
  stripePriceIdYearly: '',
  creditsMonthly: 100,
  apiKeysLimit: 3,
  rateLimitTokens: null,
  rateLimitPeriodSeconds: null,
  rateLimitIsHardCap: true,
  trialDays: 0,
  isFeatured: false,
  isHidden: false,
  includedTools: {
    custom_chatbots: false,
  },
};

type TabId = 'general' | 'pricing' | 'tools';

// Sortable Plan Card Component
function SortablePlanCard({
  plan,
  onEdit,
  onDelete,
  onToggleActive,
}: {
  plan: SubscriptionPlan;
  onEdit: (plan: SubscriptionPlan) => void;
  onDelete: (plan: SubscriptionPlan) => void;
  onToggleActive: (plan: SubscriptionPlan) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: plan.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 'auto',
  };

  const isCustom = isCustomPricingPlan(plan);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative p-6 rounded-xl border transition-all flex flex-col group ${
        plan.is_active
          ? plan.is_hidden
            ? 'bg-white dark:bg-secondary-800 border-secondary-300 dark:border-secondary-600 border-dashed'
            : 'bg-white dark:bg-secondary-800 border-secondary-200 dark:border-secondary-700'
          : 'bg-secondary-50 dark:bg-secondary-900 border-secondary-200 dark:border-secondary-800 opacity-60'
      } ${plan.is_featured ? 'ring-2 ring-primary-500' : ''} ${
        isDragging ? 'shadow-xl scale-[1.02] ring-2 ring-primary-500/30' : ''
      }`}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute left-2 top-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing
          text-secondary-300 dark:text-secondary-600 hover:text-secondary-500 dark:hover:text-secondary-400
          opacity-0 group-hover:opacity-100 transition-opacity p-1"
        aria-label="Drag to reorder plan"
      >
        <GripVertical className="w-5 h-5" />
      </div>

      {plan.is_featured && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary-500 text-white text-xs font-medium rounded-full">
          Featured
        </div>
      )}

      {plan.is_hidden && (
        <div className="absolute -top-3 left-4 px-3 py-1 bg-secondary-500 dark:bg-secondary-600 text-white text-xs font-medium rounded-full flex items-center gap-1.5 shadow-sm">
          <EyeOff className="w-3 h-3" />
          Hidden
        </div>
      )}

      {isCustom && (
        <div className="absolute -top-3 right-4 px-3 py-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-medium rounded-full shadow-sm">
          Custom Pricing
        </div>
      )}

      <div className="flex items-start justify-between mb-4 pl-6">
        <div>
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
            {plan.name}
          </h3>
          <p className="text-sm text-secondary-500 dark:text-secondary-400">
            {plan.slug}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(plan)}
            className="p-1.5 text-secondary-400 hover:text-primary-500 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded"
            title="Edit"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          {!['free', 'pro', 'enterprise'].includes(plan.slug) && (
            <button
              onClick={() => onDelete(plan)}
              className="p-1.5 text-secondary-400 hover:text-red-500 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Price / Custom Pricing */}
      <div className="mb-4 pl-6">
        {isCustom ? (
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <span className="text-2xl font-bold text-amber-700 dark:text-amber-300">
              Custom
            </span>
          </div>
        ) : plan.price_lifetime_cents ? (
          <>
            <div className="text-3xl font-bold text-secondary-900 dark:text-secondary-100">
              {formatPrice(plan.price_lifetime_cents)}
              <span className="text-sm font-normal text-secondary-500"> lifetime</span>
            </div>
            <div className="text-sm text-secondary-500">
              One-time payment
            </div>
          </>
        ) : (
          <>
            <div className="text-3xl font-bold text-secondary-900 dark:text-secondary-100">
              {formatPrice(plan.price_monthly_cents)}
              <span className="text-sm font-normal text-secondary-500">/mo</span>
            </div>
            {plan.price_yearly_cents && (
              <div className="text-sm text-secondary-500">
                or {formatPrice(plan.price_yearly_cents)}/year
              </div>
            )}
          </>
        )}
      </div>

      {/* Plan Details - Only show for non-custom pricing */}
      {isCustom ? (
        <div className="space-y-2 mb-4 text-sm flex-grow pl-6">
          <p className="text-secondary-500 dark:text-secondary-400">
            Pricing and limits negotiated per customer
          </p>
          <ul className="space-y-1 text-secondary-600 dark:text-secondary-400">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Dedicated account manager
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Custom integrations
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              SLA guarantee
            </li>
          </ul>
        </div>
      ) : (
        <div className="space-y-2 mb-4 text-sm flex-grow pl-6">
          <div className="flex justify-between">
            <span className="text-secondary-600 dark:text-secondary-400">Credits/month</span>
            <span className="font-medium text-secondary-900 dark:text-secondary-100">
              {formatCredits(plan.credits_monthly)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary-600 dark:text-secondary-400">API Keys</span>
            <span className="font-medium text-secondary-900 dark:text-secondary-100">
              {plan.api_keys_limit === -1 ? 'Unlimited' : plan.api_keys_limit}
            </span>
          </div>
          {plan.rate_limit_tokens && (
            <div className="flex justify-between">
              <span className="text-secondary-600 dark:text-secondary-400">Rate Limit</span>
              <span className="font-medium text-secondary-900 dark:text-secondary-100">
                {plan.rate_limit_tokens.toLocaleString()} tokens/
                {Math.floor((plan.rate_limit_period_seconds || 3600) / 3600)}h
              </span>
            </div>
          )}
          {plan.trial_days > 0 && (
            <div className="flex justify-between">
              <span className="text-secondary-600 dark:text-secondary-400">Trial</span>
              <span className="font-medium text-secondary-900 dark:text-secondary-100">
                {plan.trial_days} days
              </span>
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-secondary-200 dark:border-secondary-700 pl-6">
        <div className="flex items-center gap-2">
          <span className="text-sm text-secondary-500">
            {plan.is_active ? 'Active' : 'Inactive'}
          </span>
          <span className="text-xs text-secondary-400">
            (Order: {plan.display_order ?? 0})
          </span>
        </div>
        <button
          onClick={() => onToggleActive(plan)}
          className={`relative w-10 h-6 rounded-full transition-colors ${
            plan.is_active ? 'bg-primary-500' : 'bg-secondary-300 dark:bg-secondary-600'
          }`}
        >
          <span
            className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
              plan.is_active ? 'left-5' : 'left-1'
            }`}
          />
        </button>
      </div>
    </div>
  );
}

export default function PlansAdminPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState<PlanFormData>(defaultFormData);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>('general');
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; plan: SubscriptionPlan | null }>({
    open: false,
    plan: null,
  });
  const [deleting, setDeleting] = useState(false);
  const [reordering, setReordering] = useState(false);

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchPlans();
  }, []);

  async function fetchPlans() {
    try {
      const res = await fetch('/api/admin/plans?includeInactive=true');
      const data = await res.json();
      if (data.error) throw new Error(data.error?.message || data.error);
      // Sort by display_order
      const sortedPlans = (data.data || []).sort(
        (a: SubscriptionPlan, b: SubscriptionPlan) => (a.display_order ?? 0) - (b.display_order ?? 0)
      );
      setPlans(sortedPlans);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to fetch plans');
    } finally {
      setLoading(false);
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = plans.findIndex((p) => p.id === active.id);
      const newIndex = plans.findIndex((p) => p.id === over.id);

      const newPlans = arrayMove(plans, oldIndex, newIndex);
      setPlans(newPlans);

      // Save the new order
      setReordering(true);
      try {
        const res = await fetch('/api/admin/plans/reorder', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            planIds: newPlans.map((p) => p.id),
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error?.message || 'Failed to reorder');
        toast.success('Plan order saved');
        // Refresh to get updated display_order values
        fetchPlans();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Failed to save order');
        // Revert on error
        fetchPlans();
      } finally {
        setReordering(false);
      }
    }
  }

  async function handleToggleActive(plan: SubscriptionPlan) {
    try {
      const res = await fetch(`/api/admin/plans/${plan.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !plan.is_active }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error?.message || data.error);
      toast.success(`Plan ${!plan.is_active ? 'activated' : 'deactivated'}`);
      fetchPlans();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update plan');
    }
  }

  function openDeleteConfirm(plan: SubscriptionPlan) {
    setDeleteConfirm({ open: true, plan });
  }

  async function handleDelete() {
    if (!deleteConfirm.plan) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/plans/${deleteConfirm.plan.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.error) throw new Error(data.error?.message || data.error);
      toast.success('Plan deleted successfully');
      setDeleteConfirm({ open: false, plan: null });
      fetchPlans();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete plan');
    } finally {
      setDeleting(false);
    }
  }

  function openEditForm(plan: SubscriptionPlan) {
    const isCustom = isCustomPricingPlan(plan);

    // Extract tool settings from features
    const includedTools: Record<ToolId, boolean> = {
      custom_chatbots: plan.features?.custom_chatbots === true,
    };

    setFormData({
      sequence: plan.display_order ?? 0,
      slug: plan.slug,
      name: plan.name,
      description: plan.description || '',
      usageDescription: plan.usage_description || '',
      isCustomPricing: isCustom,
      priceMonthly: plan.price_monthly_cents / 100,
      priceYearly: (plan.price_yearly_cents || 0) / 100,
      priceLifetime: (plan.price_lifetime_cents || 0) / 100,
      stripePriceIdMonthly: plan.stripe_price_id_monthly || '',
      stripePriceIdYearly: plan.stripe_price_id_yearly || '',
      creditsMonthly: plan.credits_monthly,
      apiKeysLimit: plan.api_keys_limit,
      rateLimitTokens: plan.rate_limit_tokens,
      rateLimitPeriodSeconds: plan.rate_limit_period_seconds,
      rateLimitIsHardCap: plan.rate_limit_is_hard_cap,
      trialDays: plan.trial_days,
      isFeatured: plan.is_featured,
      isHidden: plan.is_hidden ?? false,
      includedTools,
    });
    setActiveTab('general');
    setEditingId(plan.id);
  }

  function closeForm() {
    setShowCreateForm(false);
    setEditingId(null);
    setFormData(defaultFormData);
    setActiveTab('general');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      // Build features object from tool checkboxes
      const features: Record<string, boolean> = {};
      for (const tool of AVAILABLE_TOOLS) {
        features[tool.id] = formData.includedTools[tool.id];
      }

      // If custom pricing, set enterprise-like values
      const payload = {
        displayOrder: formData.sequence,
        slug: formData.slug,
        name: formData.name,
        description: formData.description || null,
        usageDescription: formData.usageDescription || null,
        priceMonthly: formData.isCustomPricing ? 0 : Math.round(formData.priceMonthly * 100),
        priceYearly: formData.isCustomPricing ? null : (formData.priceYearly ? Math.round(formData.priceYearly * 100) : null),
        priceLifetime: formData.isCustomPricing ? null : (formData.priceLifetime ? Math.round(formData.priceLifetime * 100) : null),
        stripePriceIdMonthly: formData.stripePriceIdMonthly || null,
        stripePriceIdYearly: formData.stripePriceIdYearly || null,
        creditsMonthly: formData.isCustomPricing ? -1 : formData.creditsMonthly,
        apiKeysLimit: formData.isCustomPricing ? -1 : formData.apiKeysLimit,
        rateLimitTokens: formData.isCustomPricing ? null : formData.rateLimitTokens,
        rateLimitPeriodSeconds: formData.isCustomPricing ? null : formData.rateLimitPeriodSeconds,
        rateLimitIsHardCap: formData.rateLimitIsHardCap,
        trialDays: formData.isCustomPricing ? 0 : formData.trialDays,
        isFeatured: formData.isFeatured,
        isHidden: formData.isHidden,
        features,
      };

      const url = editingId ? `/api/admin/plans/${editingId}` : '/api/admin/plans';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error?.message || data.error);

      toast.success(editingId ? 'Plan updated successfully' : 'Plan created successfully');
      closeForm();
      fetchPlans();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save plan');
    } finally {
      setSaving(false);
    }
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
            <Package className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <H1 variant="dashboard">
              Subscription Plans
            </H1>
            <p className="text-secondary-600 dark:text-secondary-400">
              Manage your subscription plans and pricing. Drag to reorder.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {reordering && (
            <span className="text-sm text-secondary-500 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving order...
            </span>
          )}
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Plan
          </button>
        </div>
      </div>

      {/* Plans Grid with DnD */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={plans.map((p) => p.id)} strategy={rectSortingStrategy}>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => (
              <SortablePlanCard
                key={plan.id}
                plan={plan}
                onEdit={openEditForm}
                onDelete={openDeleteConfirm}
                onToggleActive={handleToggleActive}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {plans.length === 0 && (
        <div className="text-center py-12 text-secondary-500">
          No subscription plans found. Create one to get started.
        </div>
      )}

      {/* Create/Edit Modal - Tabbed Interface */}
      {(showCreateForm || editingId) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeForm}
          />
          <div className="relative bg-white dark:bg-secondary-800 rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden m-4 flex flex-col">
            {/* Modal Header */}
            <div className="flex-shrink-0 bg-white dark:bg-secondary-800 border-b border-secondary-200 dark:border-secondary-700 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
                {editingId ? 'Edit Plan' : 'Create New Plan'}
              </h2>
              <button
                onClick={closeForm}
                className="p-1 text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex-shrink-0 bg-secondary-50 dark:bg-secondary-900 border-b border-secondary-200 dark:border-secondary-700 px-6">
              <nav className="flex gap-1 -mb-px" aria-label="Tabs">
                {[
                  { id: 'general' as const, label: 'General' },
                  { id: 'pricing' as const, label: 'Pricing & Limits' },
                  { id: 'tools' as const, label: 'Tools' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                        : 'border-transparent text-secondary-500 hover:text-secondary-700 dark:hover:text-secondary-300 hover:border-secondary-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
              <div className="p-6 space-y-5">
                {/* General Tab */}
                {activeTab === 'general' && (
                  <div className="space-y-6">
                    {/* Display Order */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1.5 flex items-center gap-1">
                          Display Order
                          <Tooltip content="Controls the order plans appear on the pricing page. Lower numbers appear first." side="right">
                            <span className="text-secondary-400 cursor-help">ⓘ</span>
                          </Tooltip>
                        </label>
                        <input
                          type="number"
                          value={formData.sequence}
                          onChange={(e) => setFormData({ ...formData, sequence: parseInt(e.target.value) || 0 })}
                          className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg text-secondary-900 dark:text-secondary-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow"
                          style={{ backgroundColor: 'rgb(var(--form-element-bg))' }}
                          placeholder="0"
                          min="0"
                        />
                        <p className="text-xs text-secondary-500 mt-1">Lower numbers appear first (or drag to reorder)</p>
                      </div>
                    </div>

                    {/* Identity Section */}
                    <div className="pt-4 border-t border-secondary-200 dark:border-secondary-700">
                      <h3 className="text-sm font-semibold text-secondary-900 dark:text-secondary-100 mb-3">Plan Identity</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1.5 flex items-center gap-1">
                            Slug
                            <Tooltip content="Unique identifier for the plan (lowercase, alphanumeric, and hyphens only)" side="right">
                              <span className="text-secondary-400 cursor-help">ⓘ</span>
                            </Tooltip>
                          </label>
                          <input
                            type="text"
                            value={formData.slug}
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                            className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg text-secondary-900 dark:text-secondary-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow"
                            style={{ backgroundColor: 'rgb(var(--form-element-bg))' }}
                            placeholder="pro-plan"
                            required
                          />
                          <p className="text-xs text-secondary-500 mt-1">Used in URLs and API</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1.5 flex items-center gap-1">
                            Display Name
                            <Tooltip content="Display name shown to users" side="right">
                              <span className="text-secondary-400 cursor-help">ⓘ</span>
                            </Tooltip>
                          </label>
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg text-secondary-900 dark:text-secondary-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow"
                            style={{ backgroundColor: 'rgb(var(--form-element-bg))' }}
                            placeholder="Pro Plan"
                            required
                          />
                          <p className="text-xs text-secondary-500 mt-1">Shown on pricing page</p>
                        </div>
                      </div>
                    </div>

                    {/* Description Section */}
                    <div className="pt-4 border-t border-secondary-200 dark:border-secondary-700">
                      <h3 className="text-sm font-semibold text-secondary-900 dark:text-secondary-100 mb-3">Description</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1.5 flex items-center gap-1">
                            Plan Description
                            <Tooltip content="Brief description of the plan features" side="right">
                              <span className="text-secondary-400 cursor-help">ⓘ</span>
                            </Tooltip>
                          </label>
                          <Textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="resize-none"
                            rows={2}
                            placeholder="Perfect for growing businesses that need more power"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1.5 flex items-center gap-1">
                            Usage Description
                            <Tooltip content="Text shown below credits (e.g., '~50 chatbot conversations')" side="right">
                              <span className="text-secondary-400 cursor-help">ⓘ</span>
                            </Tooltip>
                          </label>
                          <input
                            type="text"
                            value={formData.usageDescription}
                            onChange={(e) => setFormData({ ...formData, usageDescription: e.target.value })}
                            className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg text-secondary-900 dark:text-secondary-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow"
                            style={{ backgroundColor: 'rgb(var(--form-element-bg))' }}
                            placeholder="~50 chatbot conversations"
                          />
                          <p className="text-xs text-secondary-500 mt-1">Helps users understand credit value</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Pricing & Limits Tab */}
                {activeTab === 'pricing' && (
                  <div className="space-y-6">
                    {/* Custom Pricing Toggle */}
                    <div className="p-4 bg-secondary-50 dark:bg-secondary-900 rounded-lg border border-secondary-200 dark:border-secondary-700">
                      <Tooltip content="For enterprise plans where pricing is negotiated. Disables price fields and shows 'Contact Sales' to users." side="right">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.isCustomPricing}
                            onChange={(e) => setFormData({ ...formData, isCustomPricing: e.target.checked })}
                            className="w-5 h-5 rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                          />
                          <div>
                            <span className="text-sm font-medium text-secondary-900 dark:text-secondary-100">Custom Pricing</span>
                            <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-0.5">Users will need to contact sales for pricing</p>
                          </div>
                        </label>
                      </Tooltip>
                    </div>

                    {/* Pricing Section */}
                    <div>
                      <h3 className="text-sm font-semibold text-secondary-900 dark:text-secondary-100 mb-3">Pricing</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className={`block text-sm font-medium mb-1.5 flex items-center gap-1 transition-colors ${formData.isCustomPricing ? 'text-secondary-400 dark:text-secondary-500' : 'text-secondary-700 dark:text-secondary-300'}`}>
                            Monthly Price ($)
                            <Tooltip content="Price charged per month in USD" side="right">
                              <span className="text-secondary-400 cursor-help">ⓘ</span>
                            </Tooltip>
                          </label>
                          <input
                            type="number"
                            value={formData.priceMonthly}
                            onChange={(e) => setFormData({ ...formData, priceMonthly: parseFloat(e.target.value) || 0 })}
                            className={`w-full px-3 py-2 border rounded-lg text-secondary-900 dark:text-secondary-100 transition-all ${formData.isCustomPricing ? 'border-secondary-200 dark:border-secondary-700 bg-secondary-100 dark:bg-secondary-800 opacity-50 cursor-not-allowed' : 'border-secondary-300 dark:border-secondary-600 focus:ring-2 focus:ring-primary-500 focus:border-transparent'}`}
                            style={!formData.isCustomPricing ? { backgroundColor: 'rgb(var(--form-element-bg))' } : undefined}
                            min="0"
                            step="0.01"
                            placeholder="29.00"
                            disabled={formData.isCustomPricing}
                          />
                        </div>
                        <div>
                          <label className={`block text-sm font-medium mb-1.5 flex items-center gap-1 transition-colors ${formData.isCustomPricing ? 'text-secondary-400 dark:text-secondary-500' : 'text-secondary-700 dark:text-secondary-300'}`}>
                            Yearly Price ($)
                            <Tooltip content="Annual price in USD (usually discounted)" side="right">
                              <span className="text-secondary-400 cursor-help">ⓘ</span>
                            </Tooltip>
                          </label>
                          <input
                            type="number"
                            value={formData.priceYearly}
                            onChange={(e) => setFormData({ ...formData, priceYearly: parseFloat(e.target.value) || 0 })}
                            className={`w-full px-3 py-2 border rounded-lg text-secondary-900 dark:text-secondary-100 transition-all ${formData.isCustomPricing ? 'border-secondary-200 dark:border-secondary-700 bg-secondary-100 dark:bg-secondary-800 opacity-50 cursor-not-allowed' : 'border-secondary-300 dark:border-secondary-600 focus:ring-2 focus:ring-primary-500 focus:border-transparent'}`}
                            style={!formData.isCustomPricing ? { backgroundColor: 'rgb(var(--form-element-bg))' } : undefined}
                            min="0"
                            step="0.01"
                            placeholder="290.00"
                            disabled={formData.isCustomPricing}
                          />
                        </div>
                        <div>
                          <label className={`block text-sm font-medium mb-1.5 flex items-center gap-1 transition-colors ${formData.isCustomPricing ? 'text-secondary-400 dark:text-secondary-500' : 'text-secondary-700 dark:text-secondary-300'}`}>
                            Lifetime Price ($)
                            <Tooltip content="One-time price for lifetime access (e.g., AppSumo deals). Leave at 0 for subscription plans." side="right">
                              <span className="text-secondary-400 cursor-help">ⓘ</span>
                            </Tooltip>
                          </label>
                          <input
                            type="number"
                            value={formData.priceLifetime}
                            onChange={(e) => setFormData({ ...formData, priceLifetime: parseFloat(e.target.value) || 0 })}
                            className={`w-full px-3 py-2 border rounded-lg text-secondary-900 dark:text-secondary-100 transition-all ${formData.isCustomPricing ? 'border-secondary-200 dark:border-secondary-700 bg-secondary-100 dark:bg-secondary-800 opacity-50 cursor-not-allowed' : 'border-secondary-300 dark:border-secondary-600 focus:ring-2 focus:ring-primary-500 focus:border-transparent'}`}
                            style={!formData.isCustomPricing ? { backgroundColor: 'rgb(var(--form-element-bg))' } : undefined}
                            min="0"
                            step="0.01"
                            placeholder="99.00"
                            disabled={formData.isCustomPricing}
                          />
                          <p className="text-xs text-secondary-500 mt-1">For marketplace/AppSumo plans</p>
                        </div>
                        <div>
                          <label className={`block text-sm font-medium mb-1.5 flex items-center gap-1 transition-colors ${formData.isCustomPricing ? 'text-secondary-400 dark:text-secondary-500' : 'text-secondary-700 dark:text-secondary-300'}`}>
                            Trial Days
                            <Tooltip content="Number of free trial days before charging" side="right">
                              <span className="text-secondary-400 cursor-help">ⓘ</span>
                            </Tooltip>
                          </label>
                          <input
                            type="number"
                            value={formData.isCustomPricing ? 0 : formData.trialDays}
                            onChange={(e) => setFormData({ ...formData, trialDays: parseInt(e.target.value) || 0 })}
                            className={`w-full px-3 py-2 border rounded-lg text-secondary-900 dark:text-secondary-100 transition-all ${formData.isCustomPricing ? 'border-secondary-200 dark:border-secondary-700 bg-secondary-100 dark:bg-secondary-800 opacity-50 cursor-not-allowed' : 'border-secondary-300 dark:border-secondary-600 focus:ring-2 focus:ring-primary-500 focus:border-transparent'}`}
                            style={!formData.isCustomPricing ? { backgroundColor: 'rgb(var(--form-element-bg))' } : undefined}
                            min="0"
                            placeholder="14"
                            disabled={formData.isCustomPricing}
                          />
                          <p className="text-xs text-secondary-500 mt-1">Set to 0 for no trial</p>
                        </div>
                      </div>
                    </div>

                    {/* Stripe Price IDs */}
                    <div className="pt-5 border-t border-secondary-200 dark:border-secondary-700">
                      <h3 className="text-sm font-semibold text-secondary-900 dark:text-secondary-100 mb-1">Stripe Configuration</h3>
                      <p className="text-xs text-secondary-500 dark:text-secondary-400 mb-3">Required for checkout to work. Get these from your Stripe Dashboard.</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className={`block text-sm font-medium mb-1.5 flex items-center gap-1 transition-colors ${formData.isCustomPricing ? 'text-secondary-400 dark:text-secondary-500' : 'text-secondary-700 dark:text-secondary-300'}`}>
                            Monthly Price ID
                            <Tooltip content="Stripe Price ID for monthly subscription (starts with price_...)" side="right">
                              <span className="text-secondary-400 cursor-help">ⓘ</span>
                            </Tooltip>
                          </label>
                          <input
                            type="text"
                            value={formData.isCustomPricing ? '' : formData.stripePriceIdMonthly}
                            onChange={(e) => setFormData({ ...formData, stripePriceIdMonthly: e.target.value })}
                            className={`w-full px-3 py-2 border rounded-lg text-secondary-900 dark:text-secondary-100 transition-all font-mono text-sm ${formData.isCustomPricing ? 'border-secondary-200 dark:border-secondary-700 bg-secondary-100 dark:bg-secondary-800 opacity-50 cursor-not-allowed' : 'border-secondary-300 dark:border-secondary-600 focus:ring-2 focus:ring-primary-500 focus:border-transparent'}`}
                            style={!formData.isCustomPricing ? { backgroundColor: 'rgb(var(--form-element-bg))' } : undefined}
                            placeholder="price_1ABC..."
                            disabled={formData.isCustomPricing}
                          />
                          <p className="text-xs text-secondary-500 mt-1">Required for monthly billing</p>
                        </div>
                        <div>
                          <label className={`block text-sm font-medium mb-1.5 flex items-center gap-1 transition-colors ${formData.isCustomPricing ? 'text-secondary-400 dark:text-secondary-500' : 'text-secondary-700 dark:text-secondary-300'}`}>
                            Yearly Price ID
                            <Tooltip content="Stripe Price ID for yearly subscription (starts with price_...)" side="right">
                              <span className="text-secondary-400 cursor-help">ⓘ</span>
                            </Tooltip>
                          </label>
                          <input
                            type="text"
                            value={formData.isCustomPricing ? '' : formData.stripePriceIdYearly}
                            onChange={(e) => setFormData({ ...formData, stripePriceIdYearly: e.target.value })}
                            className={`w-full px-3 py-2 border rounded-lg text-secondary-900 dark:text-secondary-100 transition-all font-mono text-sm ${formData.isCustomPricing ? 'border-secondary-200 dark:border-secondary-700 bg-secondary-100 dark:bg-secondary-800 opacity-50 cursor-not-allowed' : 'border-secondary-300 dark:border-secondary-600 focus:ring-2 focus:ring-primary-500 focus:border-transparent'}`}
                            style={!formData.isCustomPricing ? { backgroundColor: 'rgb(var(--form-element-bg))' } : undefined}
                            placeholder="price_1XYZ..."
                            disabled={formData.isCustomPricing}
                          />
                          <p className="text-xs text-secondary-500 mt-1">Required for yearly billing</p>
                        </div>
                      </div>
                    </div>

                    {/* Resource Limits */}
                    <div className="pt-5 border-t border-secondary-200 dark:border-secondary-700">
                      <h3 className="text-sm font-semibold text-secondary-900 dark:text-secondary-100 mb-3">Resource Limits</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className={`block text-sm font-medium mb-1.5 flex items-center gap-1 transition-colors ${formData.isCustomPricing ? 'text-secondary-400 dark:text-secondary-500' : 'text-secondary-700 dark:text-secondary-300'}`}>
                            Credits per Month
                            <Tooltip content="Monthly credit allocation. Use -1 for unlimited credits" side="right">
                              <span className="text-secondary-400 cursor-help">ⓘ</span>
                            </Tooltip>
                          </label>
                          <input
                            type="number"
                            value={formData.isCustomPricing ? -1 : formData.creditsMonthly}
                            onChange={(e) => setFormData({ ...formData, creditsMonthly: parseInt(e.target.value) || 0 })}
                            className={`w-full px-3 py-2 border rounded-lg text-secondary-900 dark:text-secondary-100 transition-all ${formData.isCustomPricing ? 'border-secondary-200 dark:border-secondary-700 bg-secondary-100 dark:bg-secondary-800 opacity-50 cursor-not-allowed' : 'border-secondary-300 dark:border-secondary-600 focus:ring-2 focus:ring-primary-500 focus:border-transparent'}`}
                            style={!formData.isCustomPricing ? { backgroundColor: 'rgb(var(--form-element-bg))' } : undefined}
                            min="-1"
                            placeholder="500"
                            disabled={formData.isCustomPricing}
                          />
                          <p className="text-xs text-secondary-500 mt-1">Use -1 for unlimited</p>
                        </div>
                        <div>
                          <label className={`block text-sm font-medium mb-1.5 flex items-center gap-1 transition-colors ${formData.isCustomPricing ? 'text-secondary-400 dark:text-secondary-500' : 'text-secondary-700 dark:text-secondary-300'}`}>
                            Max API Keys
                            <Tooltip content="Maximum number of API keys allowed. Use -1 for unlimited" side="right">
                              <span className="text-secondary-400 cursor-help">ⓘ</span>
                            </Tooltip>
                          </label>
                          <input
                            type="number"
                            value={formData.isCustomPricing ? -1 : formData.apiKeysLimit}
                            onChange={(e) => setFormData({ ...formData, apiKeysLimit: parseInt(e.target.value) || 0 })}
                            className={`w-full px-3 py-2 border rounded-lg text-secondary-900 dark:text-secondary-100 transition-all ${formData.isCustomPricing ? 'border-secondary-200 dark:border-secondary-700 bg-secondary-100 dark:bg-secondary-800 opacity-50 cursor-not-allowed' : 'border-secondary-300 dark:border-secondary-600 focus:ring-2 focus:ring-primary-500 focus:border-transparent'}`}
                            style={!formData.isCustomPricing ? { backgroundColor: 'rgb(var(--form-element-bg))' } : undefined}
                            min="-1"
                            placeholder="5"
                            disabled={formData.isCustomPricing}
                          />
                          <p className="text-xs text-secondary-500 mt-1">Use -1 for unlimited</p>
                        </div>
                      </div>
                    </div>

                    {/* Rate Limiting */}
                    <div className="pt-5 border-t border-secondary-200 dark:border-secondary-700">
                      <h3 className="text-sm font-semibold text-secondary-900 dark:text-secondary-100 mb-1">Rate Limiting</h3>
                      <p className="text-xs text-secondary-500 dark:text-secondary-400 mb-3">Optional. Leave empty to disable rate limiting for this plan</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className={`block text-sm font-medium mb-1.5 flex items-center gap-1 transition-colors ${formData.isCustomPricing ? 'text-secondary-400 dark:text-secondary-500' : 'text-secondary-700 dark:text-secondary-300'}`}>
                            Token Limit
                            <Tooltip content="Maximum tokens allowed per time window" side="right">
                              <span className="text-secondary-400 cursor-help">ⓘ</span>
                            </Tooltip>
                          </label>
                          <input
                            type="number"
                            value={formData.isCustomPricing ? '' : (formData.rateLimitTokens ?? '')}
                            onChange={(e) => setFormData({ ...formData, rateLimitTokens: e.target.value === '' ? null : parseInt(e.target.value) })}
                            className={`w-full px-3 py-2 border rounded-lg text-secondary-900 dark:text-secondary-100 transition-all ${formData.isCustomPricing ? 'border-secondary-200 dark:border-secondary-700 bg-secondary-100 dark:bg-secondary-800 opacity-50 cursor-not-allowed' : 'border-secondary-300 dark:border-secondary-600 focus:ring-2 focus:ring-primary-500 focus:border-transparent'}`}
                            style={!formData.isCustomPricing ? { backgroundColor: 'rgb(var(--form-element-bg))' } : undefined}
                            min="0"
                            placeholder="100000"
                            disabled={formData.isCustomPricing}
                          />
                        </div>
                        <div>
                          <label className={`block text-sm font-medium mb-1.5 flex items-center gap-1 transition-colors ${formData.isCustomPricing ? 'text-secondary-400 dark:text-secondary-500' : 'text-secondary-700 dark:text-secondary-300'}`}>
                            Time Window (seconds)
                            <Tooltip content="Time period for rate limiting (e.g., 3600 = 1 hour)" side="right">
                              <span className="text-secondary-400 cursor-help">ⓘ</span>
                            </Tooltip>
                          </label>
                          <input
                            type="number"
                            value={formData.isCustomPricing ? '' : (formData.rateLimitPeriodSeconds ?? '')}
                            onChange={(e) => setFormData({ ...formData, rateLimitPeriodSeconds: e.target.value ? parseInt(e.target.value) : null })}
                            className={`w-full px-3 py-2 border rounded-lg text-secondary-900 dark:text-secondary-100 transition-all ${formData.isCustomPricing ? 'border-secondary-200 dark:border-secondary-700 bg-secondary-100 dark:bg-secondary-800 opacity-50 cursor-not-allowed' : 'border-secondary-300 dark:border-secondary-600 focus:ring-2 focus:ring-primary-500 focus:border-transparent'}`}
                            style={!formData.isCustomPricing ? { backgroundColor: 'rgb(var(--form-element-bg))' } : undefined}
                            min="0"
                            placeholder="3600"
                            disabled={formData.isCustomPricing}
                          />
                          <p className="text-xs text-secondary-500 mt-1">3600 = 1 hour</p>
                        </div>
                      </div>

                      {/* Hard Cap Checkbox */}
                      <div className="mt-3">
                        <Tooltip content="If enabled, requests are blocked when limit is reached. Otherwise, they're queued" side="right">
                          <label className={`inline-flex items-center gap-2 ${formData.isCustomPricing ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
                            <input
                              type="checkbox"
                              checked={formData.rateLimitIsHardCap}
                              onChange={(e) => setFormData({ ...formData, rateLimitIsHardCap: e.target.checked })}
                              className="w-4 h-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                              disabled={formData.isCustomPricing}
                            />
                            <span className={`text-sm ${formData.isCustomPricing ? 'text-secondary-400 dark:text-secondary-500' : 'text-secondary-700 dark:text-secondary-300'}`}>
                              Hard cap (block requests when limit reached)
                            </span>
                          </label>
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tools Tab */}
                {activeTab === 'tools' && (
                  <div className="space-y-6">
                    {/* Included Tools */}
                    <div>
                      <h3 className="text-sm font-semibold text-secondary-900 dark:text-secondary-100 mb-1">Included Tools</h3>
                      <p className="text-xs text-secondary-500 dark:text-secondary-400 mb-3">Select which tools are available to users on this plan</p>

                      <div className="grid grid-cols-2 gap-3">
                        {AVAILABLE_TOOLS.map((tool) => {
                          const Icon = tool.icon;
                          const isChecked = formData.includedTools[tool.id];
                          return (
                            <label
                              key={tool.id}
                              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                                isChecked
                                  ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-300 dark:border-primary-700'
                                  : 'bg-white dark:bg-secondary-700 border-secondary-200 dark:border-secondary-600 hover:border-secondary-300 dark:hover:border-secondary-500'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => setFormData({
                                  ...formData,
                                  includedTools: {
                                    ...formData.includedTools,
                                    [tool.id]: e.target.checked,
                                  },
                                })}
                                className="sr-only"
                              />
                              <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                                isChecked
                                  ? 'bg-primary-100 dark:bg-primary-800 text-primary-600 dark:text-primary-400'
                                  : 'bg-secondary-100 dark:bg-secondary-600 text-secondary-500 dark:text-secondary-400'
                              }`}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <span className={`text-sm font-medium transition-colors ${
                                isChecked
                                  ? 'text-primary-900 dark:text-primary-100'
                                  : 'text-secondary-700 dark:text-secondary-300'
                              }`}>
                                {tool.name}
                              </span>
                              {isChecked && (
                                <div className="ml-auto flex-shrink-0 w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center">
                                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                              )}
                            </label>
                          );
                        })}
                      </div>

                      {/* Quick Actions */}
                      <div className="flex gap-2 mt-4">
                        <button
                          type="button"
                          onClick={() => setFormData({
                            ...formData,
                            includedTools: Object.fromEntries(
                              AVAILABLE_TOOLS.map((t) => [t.id, true])
                            ) as Record<ToolId, boolean>,
                          })}
                          className="text-xs text-primary-600 dark:text-primary-400 hover:underline"
                        >
                          Select All
                        </button>
                        <span className="text-secondary-300 dark:text-secondary-600">|</span>
                        <button
                          type="button"
                          onClick={() => setFormData({
                            ...formData,
                            includedTools: Object.fromEntries(
                              AVAILABLE_TOOLS.map((t) => [t.id, false])
                            ) as Record<ToolId, boolean>,
                          })}
                          className="text-xs text-secondary-500 dark:text-secondary-400 hover:underline"
                        >
                          Deselect All
                        </button>
                      </div>
                    </div>

                    {/* Display Options */}
                    <div className="pt-4 border-t border-secondary-200 dark:border-secondary-700">
                      <h3 className="text-sm font-semibold text-secondary-900 dark:text-secondary-100 mb-3">Display Options</h3>
                      <div className="flex gap-3">
                        {/* Featured Plan */}
                        <Tooltip content="Featured plans are highlighted on the pricing page" side="right">
                          <label className="flex-1 flex items-center gap-3 cursor-pointer p-3 rounded-lg border border-secondary-200 dark:border-secondary-600 hover:border-secondary-300 dark:hover:border-secondary-500 transition-colors">
                            <input
                              type="checkbox"
                              checked={formData.isFeatured}
                              onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                              className="w-5 h-5 rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                            />
                            <div>
                              <span className="text-sm font-medium text-secondary-900 dark:text-secondary-100">Featured Plan</span>
                              <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-0.5">Highlight on pricing page</p>
                            </div>
                          </label>
                        </Tooltip>

                        {/* Hidden Plan */}
                        <Tooltip
                          content="Hidden plans are not shown on public pages. Dashboard users only see them if currently subscribed. Always visible in admin."
                          side="right"
                        >
                          <label className="flex-1 flex items-center gap-3 cursor-pointer p-3 rounded-lg border border-amber-200 dark:border-amber-700/50 bg-amber-50/50 dark:bg-amber-900/10 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors">
                            <input
                              type="checkbox"
                              checked={formData.isHidden}
                              onChange={(e) => setFormData({ ...formData, isHidden: e.target.checked })}
                              className="w-5 h-5 rounded border-amber-400 dark:border-amber-600 text-amber-600 focus:ring-amber-500"
                            />
                            <EyeOff className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                            <div>
                              <span className="text-sm font-medium text-amber-900 dark:text-amber-100">Hidden Plan</span>
                              <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">Not visible unless subscribed</p>
                            </div>
                          </label>
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex-shrink-0 border-t border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-900 px-6 py-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeForm}
                  className="px-4 py-2 text-secondary-700 dark:text-secondary-300 hover:bg-secondary-200 dark:hover:bg-secondary-700 rounded-lg transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white rounded-lg transition-colors font-medium"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingId ? 'Save Changes' : 'Create Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteConfirm.open}
        onOpenChange={(open) => setDeleteConfirm({ open, plan: open ? deleteConfirm.plan : null })}
        title={`Delete "${deleteConfirm.plan?.name}"?`}
        description="This action cannot be undone. The plan will be permanently removed and any associated data will be deleted."
        confirmText="Delete Plan"
        cancelText="Cancel"
        variant="danger"
        onConfirm={handleDelete}
        isLoading={deleting}
      />
    </div>
  );
}
