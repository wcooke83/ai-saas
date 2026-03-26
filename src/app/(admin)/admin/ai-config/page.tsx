'use client';

import { useState, useEffect, Fragment, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, InfoTooltip } from '@/components/ui/tooltip';
import { H1 } from '@/components/ui/heading';
import {
  Cpu,
  Server,
  Loader2,
  Check,
  AlertCircle,
  Shield,
  Plus,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronRight,
  X,
  Zap,
  Brain,
  Sparkles,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
} from 'lucide-react';

// Provider types
interface Provider {
  id: string;
  name: string;
  slug: string;
  description: string;
  enabled: boolean;
  model_count: number;
}

// Model types
interface ModelPricing {
  cost_in: number;
  cost_out: number;
  wholesale_in: number;
  wholesale_out: number;
  retail_in: number;
  retail_out: number;
}

interface Model {
  id: string;
  provider_id: string;
  provider_name: string;
  slug: string;
  name: string;
  api_model_id: string;
  tier: 'fast' | 'balanced' | 'powerful';
  grade: string;
  max_tokens: number;
  enabled: boolean;
  is_default: boolean;
  supports_streaming: boolean;
  pricing: ModelPricing;
}

// Form state for create/edit modal
interface ModelFormData {
  provider_id: string;
  slug: string;
  name: string;
  api_model_id: string;
  tier: 'fast' | 'balanced' | 'powerful';
  grade: string;
  max_tokens: number;
  enabled: boolean;
  is_default: boolean;
  supports_streaming: boolean;
  cost_in: string;
  cost_out: string;
  wholesale_in: string;
  wholesale_out: string;
  retail_in: string;
  retail_out: string;
}

// Grade options grouped by category
const gradeOptions = [
  {
    group: 'Simple / Clear',
    options: ['Lite', 'Standard', 'Pro', 'Elite', 'Ultra'],
  },
  {
    group: 'Tech / AI-style',
    options: ['Core', 'Prime', 'Apex', 'Zenith', 'Omega'],
  },
  {
    group: 'Power / Compute',
    options: ['Nano', 'Micro', 'Macro', 'Mega', 'Titan'],
  },
  {
    group: 'Numeric-inspired',
    options: ['Alpha', 'Beta', 'Gamma', 'Delta', 'Sigma'],
  },
  {
    group: 'Luxury / Premium',
    options: ['Base', 'Plus', 'Max', 'Signature', 'Sovereign'],
  },
];

const initialFormData: ModelFormData = {
  provider_id: '',
  slug: '',
  name: '',
  api_model_id: '',
  tier: 'balanced',
  grade: '',
  max_tokens: 4096,
  enabled: true,
  is_default: false,
  supports_streaming: true,
  cost_in: '0',
  cost_out: '0',
  wholesale_in: '0',
  wholesale_out: '0',
  retail_in: '0',
  retail_out: '0',
};

// Provider icon mapping
const providerIcons: Record<string, React.ReactNode> = {
  anthropic: <Brain className="w-6 h-6" />,
  openai: <Sparkles className="w-6 h-6" />,
  xai: <Zap className="w-6 h-6" />,
  google: <Cpu className="w-6 h-6" />,
  meta: <Server className="w-6 h-6" />,
  local: <Server className="w-6 h-6" />,
};

// Tier badge colors
const tierColors: Record<string, 'default' | 'secondary' | 'success' | 'warning'> = {
  fast: 'success',
  balanced: 'default',
  powerful: 'warning',
};

// Sorting types
type SortColumn = 'name' | 'provider' | 'tier' | 'default' | 'enabled';
type SortDirection = 'asc' | 'desc';

// Tier order for sorting
const tierOrder: Record<string, number> = {
  fast: 0,
  balanced: 1,
  powerful: 2,
};

export default function AIConfigPage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Data state
  const [providers, setProviders] = useState<Provider[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [embeddingModelId, setEmbeddingModelId] = useState<string | null>(null);
  const [sentimentModelId, setSentimentModelId] = useState<string | null>(null);
  const [savingEmbeddingModel, setSavingEmbeddingModel] = useState(false);
  const [savingSentimentModel, setSavingSentimentModel] = useState(false);

  // Loading states for individual operations
  const [togglingProvider, setTogglingProvider] = useState<string | null>(null);
  const [togglingModel, setTogglingModel] = useState<string | null>(null);
  const [settingDefault, setSettingDefault] = useState<string | null>(null);
  const [deletingModel, setDeletingModel] = useState<string | null>(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingModel, setEditingModel] = useState<Model | null>(null);
  const [formData, setFormData] = useState<ModelFormData>(initialFormData);

  // Sorting state
  const [sortColumn, setSortColumn] = useState<SortColumn | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Original order tracking (to preserve order on updates)
  const [originalModelOrder, setOriginalModelOrder] = useState<string[]>([]);

  // Check admin access and load data
  useEffect(() => {
    async function checkAdminAndLoadData() {
      try {
        const checkResponse = await fetch('/api/admin/check');
        const checkData = await checkResponse.json();

        if (!checkData.data?.isAdmin) {
          router.push('/dashboard');
          return;
        }

        setIsAdmin(true);
        await Promise.all([loadProviders(), loadModels(), loadSettings()]);
      } catch (err) {
        console.error('Failed to load admin data:', err);
        toast.error('Failed to load configuration');
      } finally {
        setLoading(false);
      }
    }

    checkAdminAndLoadData();
  }, [router]);

  const loadProviders = async () => {
    const response = await fetch('/api/admin/providers');
    const data = await response.json();
    if (data.success && Array.isArray(data.data?.providers)) {
      // Transform API data to match client interface
      const transformed = data.data.providers.map((p: any) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description || '',
        enabled: p.is_enabled ?? true,
        model_count: p.models_count || 0,
      }));
      setProviders(transformed);
    }
  };

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings');
      const data = await response.json();
      if (data.success && data.data) {
        setEmbeddingModelId(data.data.embedding_model_id || null);
        setSentimentModelId(data.data.sentiment_model_id || null);
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
    }
  };

  const loadModels = async (preserveOrder = false) => {
    const response = await fetch('/api/admin/models?include_disabled=true');
    const data = await response.json();
    if (data.success && Array.isArray(data.data?.models)) {
      // Transform API data to match client interface
      const transformed = data.data.models.map((m: any) => ({
        id: m.id,
        provider_id: m.provider_id,
        provider_name: m.provider?.name || '',
        slug: m.slug,
        name: m.name,
        api_model_id: m.api_model_id,
        tier: m.tier || 'balanced',
        grade: m.grade || '',
        max_tokens: m.max_tokens,
        enabled: m.is_enabled ?? true,
        is_default: m.is_default ?? false,
        supports_streaming: m.supports_streaming ?? true,
        pricing: {
          cost_in: m.cost_input_per_mtok ?? 0,
          cost_out: m.cost_output_per_mtok ?? 0,
          wholesale_in: m.wholesale_input_per_mtok ?? 0,
          wholesale_out: m.wholesale_output_per_mtok ?? 0,
          retail_in: m.retail_input_per_mtok ?? 0,
          retail_out: m.retail_output_per_mtok ?? 0,
        },
      }));

      // If preserveOrder is true and we have an original order, sort by that order
      if (preserveOrder && originalModelOrder.length > 0) {
        const orderMap = new Map(originalModelOrder.map((id, index) => [id, index]));
        transformed.sort((a: Model, b: Model) => {
          const aIndex = orderMap.get(a.id) ?? Infinity;
          const bIndex = orderMap.get(b.id) ?? Infinity;
          return aIndex - bIndex;
        });
      } else {
        // Store original order on first load
        setOriginalModelOrder(transformed.map((m: Model) => m.id));
      }

      setModels(transformed);
    }
  };

  const toggleProvider = async (providerId: string, enabled: boolean) => {
    const provider = providers.find((p) => p.id === providerId);

    // Set loading state
    setTogglingProvider(providerId);

    try {
      const response = await fetch(`/api/admin/providers/${providerId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_enabled: enabled }),
      });
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error?.message || 'Failed to update provider');
      }

      // Update provider state after successful DB update
      setProviders((prev) =>
        prev.map((p) => (p.id === providerId ? { ...p, enabled } : p))
      );

      // Also update related models (they were cascaded in the API)
      setModels((prev) =>
        prev.map((m) => (m.provider_id === providerId ? { ...m, enabled } : m))
      );

      toast.success(`${provider?.name || 'Provider'} ${enabled ? 'enabled' : 'disabled'}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update provider');
    } finally {
      setTogglingProvider(null);
    }
  };

  const toggleRowExpand = (modelId: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(modelId)) {
        next.delete(modelId);
      } else {
        next.add(modelId);
      }
      return next;
    });
  };

  const openCreateModal = () => {
    setEditingModel(null);
    setFormData(initialFormData);
    setModalOpen(true);
  };

  const openEditModal = (model: Model) => {
    setEditingModel(model);
    setFormData({
      provider_id: model.provider_id,
      slug: model.slug,
      name: model.name,
      api_model_id: model.api_model_id,
      tier: model.tier,
      grade: model.grade,
      max_tokens: model.max_tokens,
      enabled: model.enabled,
      is_default: model.is_default,
      supports_streaming: model.supports_streaming,
      cost_in: model.pricing.cost_in.toString(),
      cost_out: model.pricing.cost_out.toString(),
      wholesale_in: model.pricing.wholesale_in.toString(),
      wholesale_out: model.pricing.wholesale_out.toString(),
      retail_in: model.pricing.retail_in.toString(),
      retail_out: model.pricing.retail_out.toString(),
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingModel(null);
    setFormData(initialFormData);
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSaveModel = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      provider_id: formData.provider_id,
      slug: formData.slug,
      name: formData.name,
      api_model_id: formData.api_model_id,
      tier: formData.tier,
      grade: formData.grade,
      max_tokens: formData.max_tokens,
      is_enabled: formData.enabled,
      is_default: formData.is_default,
      supports_streaming: formData.supports_streaming,
      cost_input_per_mtok: parseFloat(formData.cost_in) || 0,
      cost_output_per_mtok: parseFloat(formData.cost_out) || 0,
      wholesale_input_per_mtok: parseFloat(formData.wholesale_in) || 0,
      wholesale_output_per_mtok: parseFloat(formData.wholesale_out) || 0,
      retail_input_per_mtok: parseFloat(formData.retail_in) || 0,
      retail_output_per_mtok: parseFloat(formData.retail_out) || 0,
    };

    // Optimistic update for editing
    const previousModels = [...models];
    const previousProviders = [...providers];

    if (editingModel) {
      // Optimistically update the model
      const provider = providers.find((p) => p.id === formData.provider_id);
      const updatedModel: Model = {
        ...editingModel,
        provider_id: formData.provider_id,
        provider_name: provider?.name || editingModel.provider_name,
        slug: formData.slug,
        name: formData.name,
        api_model_id: formData.api_model_id,
        tier: formData.tier,
        grade: formData.grade,
        max_tokens: formData.max_tokens,
        enabled: formData.enabled,
        is_default: formData.is_default,
        supports_streaming: formData.supports_streaming,
        pricing: {
          cost_in: parseFloat(formData.cost_in) || 0,
          cost_out: parseFloat(formData.cost_out) || 0,
          wholesale_in: parseFloat(formData.wholesale_in) || 0,
          wholesale_out: parseFloat(formData.wholesale_out) || 0,
          retail_in: parseFloat(formData.retail_in) || 0,
          retail_out: parseFloat(formData.retail_out) || 0,
        },
      };

      setModels((prev) =>
        prev.map((m) => {
          if (m.id === editingModel.id) {
            return updatedModel;
          }
          // If this model is being set as default, remove default from others
          if (formData.is_default && m.is_default) {
            return { ...m, is_default: false };
          }
          return m;
        })
      );

      closeModal();
      toast.success('Model updated successfully');
    }

    try {
      const url = editingModel
        ? `/api/admin/models/${editingModel.id}`
        : '/api/admin/models';
      const method = editingModel ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error?.message || 'Failed to save model');
      }

      if (!editingModel) {
        // For new models, we need to reload to get the server-generated ID
        await loadModels(true);
        await loadProviders();
        closeModal();
        toast.success('Model created successfully');
      }
    } catch (err) {
      // Revert on failure
      setModels(previousModels);
      setProviders(previousProviders);
      toast.error(err instanceof Error ? err.message : 'Failed to save model');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteModel = async (modelId: string) => {
    const model = models.find((m) => m.id === modelId);
    if (!confirm(`Are you sure you want to delete "${model?.name || 'this model'}"?`)) {
      return;
    }

    // Set loading state
    setDeletingModel(modelId);

    try {
      const response = await fetch(`/api/admin/models/${modelId}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error?.message || 'Failed to delete model');
      }

      await loadModels();
      await loadProviders();
      toast.success(`${model?.name || 'Model'} deleted`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete model');
    } finally {
      setDeletingModel(null);
    }
  };

  const handleSetDefault = async (modelId: string) => {
    const model = models.find((m) => m.id === modelId);

    // Set loading state
    setSettingDefault(modelId);

    // Optimistic update
    const previousModels = [...models];

    setModels((prev) =>
      prev.map((m) => ({
        ...m,
        is_default: m.id === modelId,
      }))
    );

    try {
      const response = await fetch(`/api/admin/models/${modelId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_default: true }),
      });
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error?.message || 'Failed to set default model');
      }

      toast.success(`${model?.name || 'Model'} set as default`);
    } catch (err) {
      // Revert on failure
      setModels(previousModels);
      toast.error(err instanceof Error ? err.message : 'Failed to set default model');
    } finally {
      setSettingDefault(null);
    }
  };

  const handleToggleModelEnabled = async (modelId: string, enabled: boolean) => {
    const model = models.find((m) => m.id === modelId);

    // Set loading state
    setTogglingModel(modelId);

    try {
      const response = await fetch(`/api/admin/models/${modelId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_enabled: enabled }),
      });
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error?.message || 'Failed to update model');
      }

      // Update state after successful DB update
      setModels((prev) =>
        prev.map((m) => (m.id === modelId ? { ...m, enabled } : m))
      );

      toast.success(`${model?.name || 'Model'} ${enabled ? 'enabled' : 'disabled'}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update model');
    } finally {
      setTogglingModel(null);
    }
  };

  const handleSetEmbeddingModel = async (modelId: string | null) => {
    setSavingEmbeddingModel(true);
    const previousValue = embeddingModelId;

    // Optimistic update
    setEmbeddingModelId(modelId);

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ embedding_model_id: modelId }),
      });
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error?.message || 'Failed to update embedding model');
      }

      const modelName = modelId 
        ? models.find((m) => m.id === modelId)?.name || 'Model'
        : 'Auto-select';
      toast.success(`Embedding model set to ${modelName}`);
    } catch (err) {
      // Revert on failure
      setEmbeddingModelId(previousValue);
      toast.error(err instanceof Error ? err.message : 'Failed to update embedding model');
    } finally {
      setSavingEmbeddingModel(false);
    }
  };

  const handleSetSentimentModel = async (modelId: string | null) => {
    setSavingSentimentModel(true);
    const previousValue = sentimentModelId;
    setSentimentModelId(modelId);

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sentiment_model_id: modelId }),
      });
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error?.message || 'Failed to update sentiment model');
      }

      const modelName = modelId
        ? models.find((m) => m.id === modelId)?.name || 'Model'
        : 'Chat default';
      toast.success(`Sentiment model set to ${modelName}`);
    } catch (err) {
      setSentimentModelId(previousValue);
      toast.error(err instanceof Error ? err.message : 'Failed to update sentiment model');
    } finally {
      setSavingSentimentModel(false);
    }
  };

  // Get non-embedding models (for chat default and sentiment dropdowns)
  const chatCapableModels = useMemo(() => {
    return models.filter((m) => {
      const modelId = m.api_model_id?.toLowerCase() || '';
      return !modelId.includes('embedding') && m.enabled;
    });
  }, [models]);

  // Handle column sort
  const handleSort = useCallback((column: SortColumn) => {
    if (sortColumn === column) {
      // Toggle direction if same column
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      // New column, start with ascending
      setSortColumn(column);
      setSortDirection('asc');
    }
  }, [sortColumn]);

  // Get sort icon for a column
  const getSortIcon = useCallback((column: SortColumn) => {
    if (sortColumn !== column) {
      return <ArrowUpDown className="w-4 h-4 ml-1 opacity-50" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="w-4 h-4 ml-1" />
    ) : (
      <ArrowDown className="w-4 h-4 ml-1" />
    );
  }, [sortColumn, sortDirection]);

  // Get embedding-capable models (models whose api_model_id contains "embedding")
  const embeddingCapableModels = useMemo(() => {
    return models.filter((m) => {
      const modelId = m.api_model_id?.toLowerCase() || '';
      return modelId.includes('embedding');
    });
  }, [models]);

  // Filter and sort models
  const filteredModels = useMemo(() => {
    let result = selectedProvider
      ? models.filter((m) => m.provider_id === selectedProvider)
      : [...models];

    // Apply sorting
    if (sortColumn) {
      result.sort((a, b) => {
        let comparison = 0;

        switch (sortColumn) {
          case 'name':
            comparison = a.name.localeCompare(b.name);
            break;
          case 'provider':
            comparison = a.provider_name.localeCompare(b.provider_name);
            break;
          case 'tier':
            comparison = tierOrder[a.tier] - tierOrder[b.tier];
            break;
          case 'default':
            comparison = (a.is_default ? 1 : 0) - (b.is_default ? 1 : 0);
            break;
          case 'enabled':
            comparison = (a.enabled ? 1 : 0) - (b.enabled ? 1 : 0);
            break;
        }

        return sortDirection === 'desc' ? -comparison : comparison;
      });
    }

    return result;
  }, [models, selectedProvider, sortColumn, sortDirection]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-secondary-200 dark:bg-secondary-700 rounded animate-pulse" />
        <Card>
          <CardHeader>
            <div className="h-6 w-32 bg-secondary-200 dark:bg-secondary-700 rounded animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="h-10 bg-secondary-100 dark:bg-secondary-800 rounded animate-pulse" />
              <div className="h-10 bg-secondary-100 dark:bg-secondary-800 rounded animate-pulse" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary-100 dark:bg-primary-900/50 rounded-lg">
          <Shield className="w-6 h-6 text-primary-600 dark:text-primary-400" aria-hidden="true" />
        </div>
        <div>
          <H1 variant="dashboard">
            AI Configuration
          </H1>
          <p className="text-secondary-600 dark:text-secondary-400">
            Manage AI providers and models
          </p>
        </div>
      </div>

      {/* Providers Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-primary-500" aria-hidden="true" />
            AI Providers
          </CardTitle>
          <CardDescription>
            Enable or disable AI providers. Click a provider to filter models.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {providers.map((provider) => (
              <div
                key={provider.id}
                onClick={() =>
                  setSelectedProvider(
                    selectedProvider === provider.id ? null : provider.id
                  )
                }
                className={`relative flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  selectedProvider === provider.id
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-secondary-200 dark:border-secondary-700 hover:border-secondary-300 dark:hover:border-secondary-600'
                }`}
              >
                <div
                  className={`p-2 rounded-lg ${
                    selectedProvider === provider.id
                      ? 'bg-primary-100 dark:bg-primary-800'
                      : 'bg-secondary-100 dark:bg-secondary-800'
                  }`}
                >
                  <span
                    className={
                      selectedProvider === provider.id
                        ? 'text-primary-600 dark:text-primary-400'
                        : 'text-secondary-600 dark:text-secondary-400'
                    }
                  >
                    {providerIcons[provider.slug] || (
                      <Server className="w-6 h-6" />
                    )}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-secondary-900 dark:text-secondary-100 truncate">
                      {provider.name}
                    </p>
                    <Badge variant="secondary">{provider.model_count}</Badge>
                  </div>
                  <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-1 line-clamp-2">
                    {provider.description}
                  </p>
                </div>
                {/* Toggle Switch */}
                <Tooltip
                  content={provider.enabled ? 'Disable provider and all its models' : 'Enable provider'}
                  side="left"
                >
                  <button
                    type="button"
                    role="switch"
                    aria-checked={provider.enabled}
                    disabled={togglingProvider === provider.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleProvider(provider.id, !provider.enabled);
                    }}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:ring-offset-secondary-900 ${
                      togglingProvider === provider.id
                        ? 'cursor-wait opacity-70'
                        : 'cursor-pointer'
                    } ${
                      provider.enabled
                        ? 'bg-primary-500'
                        : 'bg-secondary-300 dark:bg-secondary-600'
                    }`}
                  >
                    <span className="sr-only">
                      {provider.enabled ? 'Disable' : 'Enable'} {provider.name}
                    </span>
                    <span
                      className={`pointer-events-none inline-flex items-center justify-center h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        provider.enabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    >
                      {togglingProvider === provider.id && (
                        <Loader2 className="w-3 h-3 animate-spin text-secondary-400" />
                      )}
                    </span>
                  </button>
                </Tooltip>
                {selectedProvider === provider.id && (
                  <Check
                    className="absolute top-4 right-16 w-5 h-5 text-primary-500"
                    aria-hidden="true"
                  />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Model Assignments */}
      <Card className="sticky top-16 z-10 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary-500" aria-hidden="true" />
            Active Model Assignments
          </CardTitle>
          <CardDescription>
            Which AI model is used for each task. Changes take effect immediately.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Chat Default */}
            <div className="flex items-center gap-4">
              <Label className="text-sm font-medium w-40 shrink-0">Chat (default)</Label>
              <div className="flex-1">
                <select
                  value={models.find((m) => m.is_default)?.id || ''}
                  onChange={(e) => e.target.value && handleSetDefault(e.target.value)}
                  disabled={settingDefault !== null}
                  className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-800 text-secondary-900 dark:text-secondary-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {chatCapableModels.map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.provider_name} - {model.name}
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-xs text-secondary-500 dark:text-secondary-400 w-36 shrink-0">
                Users can override
              </p>
            </div>

            {/* Embeddings */}
            <div className="flex items-center gap-4">
              <Label htmlFor="embedding-model" className="text-sm font-medium w-40 shrink-0">Embeddings</Label>
              <div className="flex-1 flex items-center gap-2">
                <select
                  id="embedding-model"
                  value={embeddingModelId || ''}
                  onChange={(e) => handleSetEmbeddingModel(e.target.value || null)}
                  disabled={savingEmbeddingModel}
                  className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-800 text-secondary-900 dark:text-secondary-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">Auto-select (Gemini → OpenAI)</option>
                  {embeddingCapableModels.length > 0 &&
                    embeddingCapableModels.map((model) => (
                      <option key={model.id} value={model.id}>
                        {model.provider_name} - {model.name}
                        {model.pricing.cost_in === 0 && model.pricing.cost_out === 0 ? ' (FREE)' : ''}
                      </option>
                    ))
                  }
                </select>
                {savingEmbeddingModel && (
                  <Loader2 className="w-5 h-5 animate-spin text-primary-500 shrink-0" />
                )}
              </div>
              <p className="text-xs text-secondary-500 dark:text-secondary-400 w-36 shrink-0">
                Knowledge base vectors
              </p>
            </div>

            {/* Sentiment Analysis */}
            <div className="flex items-center gap-4">
              <Label htmlFor="sentiment-model" className="text-sm font-medium w-40 shrink-0">
                Sentiment Analysis
              </Label>
              <div className="flex-1 flex items-center gap-2">
                <select
                  id="sentiment-model"
                  value={sentimentModelId || ''}
                  onChange={(e) => handleSetSentimentModel(e.target.value || null)}
                  disabled={savingSentimentModel}
                  className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-800 text-secondary-900 dark:text-secondary-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {chatCapableModels.map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.provider_name} - {model.name}
                    </option>
                  ))}
                </select>
                {savingSentimentModel && (
                  <Loader2 className="w-5 h-5 animate-spin text-primary-500 shrink-0" />
                )}
              </div>
              <p className="text-xs text-secondary-500 dark:text-secondary-400 w-36 shrink-0">
                Conversation scoring
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Models Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary-500" aria-hidden="true" />
              AI Models
              {selectedProvider && (
                <Badge variant="outline" className="ml-2">
                  Filtered by{' '}
                  {providers.find((p) => p.id === selectedProvider)?.name}
                  <button
                    onClick={() => setSelectedProvider(null)}
                    className="ml-1 hover:text-primary-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Configure model settings and pricing per million tokens
            </CardDescription>
          </div>
          <Button onClick={openCreateModal} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Model
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-secondary-200 dark:border-secondary-700">
                  <th className="text-left py-3 px-4 text-sm font-medium text-secondary-600 dark:text-secondary-400">
                    <button
                      onClick={() => handleSort('name')}
                      className="flex items-center hover:text-secondary-900 dark:hover:text-secondary-200 transition-colors"
                    >
                      Model Name
                      {getSortIcon('name')}
                    </button>
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-secondary-600 dark:text-secondary-400">
                    <button
                      onClick={() => handleSort('provider')}
                      className="flex items-center hover:text-secondary-900 dark:hover:text-secondary-200 transition-colors"
                    >
                      Provider
                      {getSortIcon('provider')}
                    </button>
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-secondary-600 dark:text-secondary-400">
                    <Tooltip content="Speed vs capability tradeoff" side="bottom">
                      <button
                        onClick={() => handleSort('tier')}
                        className="flex items-center hover:text-secondary-900 dark:hover:text-secondary-200 transition-colors"
                      >
                        Tier
                        {getSortIcon('tier')}
                      </button>
                    </Tooltip>
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-secondary-600 dark:text-secondary-400">
                    <Tooltip content="Default chat model — users can override in their settings" side="bottom">
                      <button
                        onClick={() => handleSort('default')}
                        className="flex items-center justify-center w-full hover:text-secondary-900 dark:hover:text-secondary-200 transition-colors"
                      >
                        Chat Default
                        {getSortIcon('default')}
                      </button>
                    </Tooltip>
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-secondary-600 dark:text-secondary-400">
                    <Tooltip content="Available for users to select" side="bottom">
                      <button
                        onClick={() => handleSort('enabled')}
                        className="flex items-center justify-center w-full hover:text-secondary-900 dark:hover:text-secondary-200 transition-colors"
                      >
                        Enabled
                        {getSortIcon('enabled')}
                      </button>
                    </Tooltip>
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-secondary-600 dark:text-secondary-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredModels.map((model) => (
                  <Fragment key={model.id}>
                    <tr
                      className="border-b border-secondary-100 dark:border-secondary-800 hover:bg-secondary-50 dark:hover:bg-secondary-800/50"
                    >
                      <td className="py-3 px-4">
                        <button
                          onClick={() => toggleRowExpand(model.id)}
                          className="flex items-center gap-2 text-left"
                        >
                          {expandedRows.has(model.id) ? (
                            <ChevronDown className="w-4 h-4 text-secondary-400" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-secondary-400" />
                          )}
                          <div>
                            <p className="font-medium text-secondary-900 dark:text-secondary-100">
                              {model.name}
                            </p>
                            <p className="text-xs text-secondary-500 dark:text-secondary-400">
                              {model.api_model_id}
                            </p>
                          </div>
                        </button>
                      </td>
                      <td className="py-3 px-4 text-secondary-700 dark:text-secondary-300">
                        {model.provider_name}
                      </td>
                      <td className="py-3 px-4">
                        <Tooltip
                          content={
                            model.tier === 'fast'
                              ? 'Fastest response, lower cost'
                              : model.tier === 'balanced'
                              ? 'Good balance of speed and quality'
                              : 'Highest quality, slower response'
                          }
                          side="top"
                        >
                          <Badge variant={tierColors[model.tier]}>
                            {model.tier}
                          </Badge>
                        </Tooltip>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Tooltip
                          content={model.is_default ? 'Current chat default' : 'Set as chat default'}
                          side="top"
                        >
                          <div className="relative inline-flex items-center justify-center">
                            {settingDefault === model.id ? (
                              <Loader2 className="w-4 h-4 animate-spin text-primary-500" />
                            ) : (
                              <input
                                type="radio"
                                name="default_model"
                                checked={model.is_default}
                                disabled={settingDefault !== null}
                                onChange={() => handleSetDefault(model.id)}
                                className={`h-4 w-4 text-primary-500 focus:ring-primary-500 border-secondary-300 dark:border-secondary-600 ${
                                  settingDefault !== null ? 'opacity-50 cursor-wait' : ''
                                }`}
                              />
                            )}
                          </div>
                        </Tooltip>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Tooltip
                          content={model.enabled ? 'Disable this model' : 'Enable this model'}
                          side="top"
                        >
                          <button
                            type="button"
                            role="switch"
                            aria-checked={model.enabled}
                            disabled={togglingModel === model.id || togglingProvider !== null}
                            onClick={() =>
                              handleToggleModelEnabled(model.id, !model.enabled)
                            }
                            className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:ring-offset-secondary-900 ${
                              togglingModel === model.id || togglingProvider !== null
                                ? 'cursor-wait opacity-70'
                                : 'cursor-pointer'
                            } ${
                              model.enabled
                                ? 'bg-primary-500'
                                : 'bg-secondary-300 dark:bg-secondary-600'
                            }`}
                          >
                            <span className="sr-only">
                              {model.enabled ? 'Disable' : 'Enable'} {model.name}
                            </span>
                            <span
                              className={`pointer-events-none inline-flex items-center justify-center h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                model.enabled ? 'translate-x-5' : 'translate-x-0'
                              }`}
                            >
                              {togglingModel === model.id && (
                                <Loader2 className="w-3 h-3 animate-spin text-secondary-400" />
                              )}
                            </span>
                          </button>
                        </Tooltip>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Tooltip content="Edit model settings" side="top">
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={deletingModel === model.id}
                              onClick={() => openEditModal(model)}
                            >
                              <Pencil className="w-4 h-4" />
                              <span className="sr-only">Edit {model.name}</span>
                            </Button>
                          </Tooltip>
                          <Tooltip content="Delete model" side="top">
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={deletingModel !== null}
                              onClick={() => handleDeleteModel(model.id)}
                              className={`text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 ${
                                deletingModel === model.id ? 'opacity-70' : ''
                              }`}
                            >
                              {deletingModel === model.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                              <span className="sr-only">Delete {model.name}</span>
                            </Button>
                          </Tooltip>
                        </div>
                      </td>
                    </tr>
                    {/* Expanded pricing row */}
                    {expandedRows.has(model.id) && (
                      <tr className="bg-secondary-50 dark:bg-secondary-800/30">
                        <td colSpan={6} className="py-4 px-4">
                          <div className="pl-10 grid gap-4 sm:grid-cols-3">
                            <div className="p-3 bg-white dark:bg-secondary-800 rounded-lg border border-secondary-200 dark:border-secondary-700">
                              <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wide mb-2">
                                Cost (per 1M tokens)
                              </p>
                              <div className="flex gap-4">
                                <div>
                                  <span className="text-xs text-secondary-400">
                                    In:
                                  </span>
                                  <span className="ml-1 font-mono text-secondary-900 dark:text-secondary-100">
                                    ${model.pricing.cost_in.toFixed(2)}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-xs text-secondary-400">
                                    Out:
                                  </span>
                                  <span className="ml-1 font-mono text-secondary-900 dark:text-secondary-100">
                                    ${model.pricing.cost_out.toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="p-3 bg-white dark:bg-secondary-800 rounded-lg border border-secondary-200 dark:border-secondary-700">
                              <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wide mb-2">
                                Wholesale (per 1M tokens)
                              </p>
                              <div className="flex gap-4">
                                <div>
                                  <span className="text-xs text-secondary-400">
                                    In:
                                  </span>
                                  <span className="ml-1 font-mono text-secondary-900 dark:text-secondary-100">
                                    ${model.pricing.wholesale_in.toFixed(2)}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-xs text-secondary-400">
                                    Out:
                                  </span>
                                  <span className="ml-1 font-mono text-secondary-900 dark:text-secondary-100">
                                    ${model.pricing.wholesale_out.toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="p-3 bg-white dark:bg-secondary-800 rounded-lg border border-secondary-200 dark:border-secondary-700">
                              <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wide mb-2">
                                Retail (per 1M tokens)
                              </p>
                              <div className="flex gap-4">
                                <div>
                                  <span className="text-xs text-secondary-400">
                                    In:
                                  </span>
                                  <span className="ml-1 font-mono text-secondary-900 dark:text-secondary-100">
                                    ${model.pricing.retail_in.toFixed(2)}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-xs text-secondary-400">
                                    Out:
                                  </span>
                                  <span className="ml-1 font-mono text-secondary-900 dark:text-secondary-100">
                                    ${model.pricing.retail_out.toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="pl-10 mt-3 flex gap-4 text-sm text-secondary-600 dark:text-secondary-400">
                            <span>
                              Max tokens:{' '}
                              <span className="font-mono">
                                {model.max_tokens.toLocaleString()}
                              </span>
                            </span>
                            <span>
                              Streaming:{' '}
                              {model.supports_streaming ? (
                                <Check className="inline w-4 h-4 text-green-500" />
                              ) : (
                                <X className="inline w-4 h-4 text-red-500" />
                              )}
                            </span>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
                {filteredModels.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-8 text-center text-secondary-500 dark:text-secondary-400"
                    >
                      No models found.{' '}
                      {selectedProvider && (
                        <button
                          onClick={() => setSelectedProvider(null)}
                          className="text-primary-500 hover:underline"
                        >
                          Clear filter
                        </button>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Create/Edit Modal - Inline Scroll Pattern */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50">
          {/* Modal Container - click outside to close, scrolls entire area */}
          <div
            className="min-h-screen py-8 flex items-start justify-center px-4"
            onClick={closeModal}
          >
            <div
              className="relative rounded-lg shadow-xl w-full max-w-2xl border"
              style={{ backgroundColor: 'rgb(var(--modal-bg))', borderColor: 'rgb(var(--modal-border))' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div
                className="sticky top-0 z-10 flex items-center justify-between p-6 rounded-t-lg"
                style={{ backgroundColor: 'rgb(var(--modal-bg))', borderBottom: '1px solid rgb(var(--modal-border))' }}
              >
                <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100">
                  {editingModel ? 'Edit Model' : 'Add Model'}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-secondary-100 dark:hover:bg-secondary-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-secondary-500" />
                  <span className="sr-only">Close</span>
                </button>
              </div>
              <form onSubmit={handleSaveModel} className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5">
                    <Label htmlFor="provider_id">Provider</Label>
                    <InfoTooltip content="The AI company that provides this model" />
                  </div>
                  <select
                    id="provider_id"
                    name="provider_id"
                    value={formData.provider_id}
                    onChange={handleFormChange}
                    required
                    className="flex h-10 w-full appearance-none rounded-md border border-secondary-300 dark:border-secondary-700 px-3 py-2 text-sm text-secondary-900 dark:text-secondary-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                    style={{ backgroundColor: 'rgb(var(--form-element-bg))' }}
                  >
                    <option value="">Select provider</option>
                    {providers.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5">
                    <Label htmlFor="slug">Slug</Label>
                    <InfoTooltip content="URL-friendly identifier used in API calls" />
                  </div>
                  <Input
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleFormChange}
                    placeholder="claude-3-opus"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5">
                    <Label htmlFor="name">Display Name</Label>
                    <InfoTooltip content="Human-readable name shown to users" />
                  </div>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    placeholder="Claude 3 Opus"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5">
                    <Label htmlFor="api_model_id">API Model ID</Label>
                    <InfoTooltip content="Exact model ID used when calling the provider's API" />
                  </div>
                  <Input
                    id="api_model_id"
                    name="api_model_id"
                    value={formData.api_model_id}
                    onChange={handleFormChange}
                    placeholder="claude-3-opus-20240229"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5">
                    <Label htmlFor="tier">Tier</Label>
                    <InfoTooltip content="Fast: quick responses, Balanced: general use, Powerful: complex tasks" />
                  </div>
                  <select
                    id="tier"
                    name="tier"
                    value={formData.tier}
                    onChange={handleFormChange}
                    className="flex h-10 w-full appearance-none rounded-md border border-secondary-300 dark:border-secondary-700 px-3 py-2 text-sm text-secondary-900 dark:text-secondary-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                    style={{ backgroundColor: 'rgb(var(--form-element-bg))' }}
                  >
                    <option value="fast">Fast</option>
                    <option value="balanced">Balanced</option>
                    <option value="powerful">Powerful</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5">
                    <Label htmlFor="grade">Grade</Label>
                    <InfoTooltip content="Marketing tier name for the model" />
                  </div>
                  <select
                    id="grade"
                    name="grade"
                    value={formData.grade}
                    onChange={handleFormChange}
                    required
                    className="flex h-10 w-full appearance-none rounded-md border border-secondary-300 dark:border-secondary-700 px-3 py-2 text-sm text-secondary-900 dark:text-secondary-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                    style={{ backgroundColor: 'rgb(var(--form-element-bg))' }}
                  >
                    <option value="">Select grade</option>
                    {gradeOptions.map((group) => (
                      <optgroup key={group.group} label={group.group}>
                        {group.options.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5">
                    <Label htmlFor="max_tokens">Max Tokens</Label>
                    <InfoTooltip content="Maximum output tokens per request" />
                  </div>
                  <Input
                    id="max_tokens"
                    name="max_tokens"
                    type="number"
                    value={formData.max_tokens}
                    onChange={handleFormChange}
                    min={1}
                    required
                  />
                </div>
              </div>

              {/* Pricing */}
              <div className="space-y-4">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
                    Pricing (per million tokens)
                  </h3>
                  <InfoTooltip content="All pricing is per 1M tokens. Input = prompts, Output = responses" />
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  {/* Cost */}
                  <div className="p-4 bg-secondary-50 dark:bg-secondary-800 rounded-lg space-y-3">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wide">
                        Cost
                      </p>
                      <InfoTooltip content="What you pay the AI provider" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cost_in" className="text-xs">
                        Input ($)
                      </Label>
                      <Input
                        id="cost_in"
                        name="cost_in"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.cost_in}
                        onChange={handleFormChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cost_out" className="text-xs">
                        Output ($)
                      </Label>
                      <Input
                        id="cost_out"
                        name="cost_out"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.cost_out}
                        onChange={handleFormChange}
                      />
                    </div>
                  </div>
                  {/* Wholesale */}
                  <div className="p-4 bg-secondary-50 dark:bg-secondary-800 rounded-lg space-y-3">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wide">
                        Wholesale
                      </p>
                      <InfoTooltip content="Price for API/enterprise customers" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="wholesale_in" className="text-xs">
                        Input ($)
                      </Label>
                      <Input
                        id="wholesale_in"
                        name="wholesale_in"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.wholesale_in}
                        onChange={handleFormChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="wholesale_out" className="text-xs">
                        Output ($)
                      </Label>
                      <Input
                        id="wholesale_out"
                        name="wholesale_out"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.wholesale_out}
                        onChange={handleFormChange}
                      />
                    </div>
                  </div>
                  {/* Retail */}
                  <div className="p-4 bg-secondary-50 dark:bg-secondary-800 rounded-lg space-y-3">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wide">
                        Retail
                      </p>
                      <InfoTooltip content="Price charged to end users" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="retail_in" className="text-xs">
                        Input ($)
                      </Label>
                      <Input
                        id="retail_in"
                        name="retail_in"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.retail_in}
                        onChange={handleFormChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="retail_out" className="text-xs">
                        Output ($)
                      </Label>
                      <Input
                        id="retail_out"
                        name="retail_out"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.retail_out}
                        onChange={handleFormChange}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Checkboxes */}
              <div className="flex flex-wrap gap-6">
                <Tooltip content="Make model available for users to select" side="top">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="enabled"
                      checked={formData.enabled}
                      onChange={handleFormChange}
                      className="h-4 w-4 rounded border-secondary-300 dark:border-secondary-600 text-primary-500 focus:ring-primary-500"
                    />
                    <span className="text-sm text-secondary-700 dark:text-secondary-300">
                      Enabled
                    </span>
                  </label>
                </Tooltip>
                <Tooltip content="Automatically selected for new users" side="top">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="is_default"
                      checked={formData.is_default}
                      onChange={handleFormChange}
                      className="h-4 w-4 rounded border-secondary-300 dark:border-secondary-600 text-primary-500 focus:ring-primary-500"
                    />
                    <span className="text-sm text-secondary-700 dark:text-secondary-300">
                      Default for new users
                    </span>
                  </label>
                </Tooltip>
                <Tooltip content="Enable real-time response streaming" side="top">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="supports_streaming"
                      checked={formData.supports_streaming}
                      onChange={handleFormChange}
                      className="h-4 w-4 rounded border-secondary-300 dark:border-secondary-600 text-primary-500 focus:ring-primary-500"
                    />
                    <span className="text-sm text-secondary-700 dark:text-secondary-300">
                      Supports streaming
                    </span>
                  </label>
                </Tooltip>
              </div>

              {/* Actions */}
              <div
                className="flex items-center justify-end gap-3 pt-4"
                style={{ borderTop: '1px solid rgb(var(--modal-border))' }}
              >
                <Button type="button" variant="outline" onClick={closeModal}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2
                        className="w-4 h-4 mr-2 animate-spin"
                        aria-hidden="true"
                      />
                      Saving...
                    </>
                  ) : editingModel ? (
                    'Update Model'
                  ) : (
                    'Create Model'
                  )}
                </Button>
              </div>
            </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
