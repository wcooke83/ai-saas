'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Brain,
  Loader2,
  Check,
  Zap,
  Gauge,
  Sparkles,
  DollarSign,
} from 'lucide-react';
import type { UserAvailableModel } from '@/types/ai-models';

// Provider logo/icon mapping
const providerIcons: Record<string, string> = {
  anthropic: '🟠',
  openai: '🟢',
  xai: '⚫',
  google: '🔵',
  meta: '🔷',
  local: '💻',
};

// Tier configuration
const tierConfig = {
  fast: {
    label: 'Fast',
    icon: Zap,
    color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    description: 'Quick responses, lower cost',
  },
  balanced: {
    label: 'Balanced',
    icon: Gauge,
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    description: 'Best mix of speed and quality',
  },
  powerful: {
    label: 'Powerful',
    icon: Sparkles,
    color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    description: 'Highest quality output',
  },
};

// Cost indicator styling
const costColors = {
  $: 'text-green-600 dark:text-green-400',
  $$: 'text-yellow-600 dark:text-yellow-400',
  $$$: 'text-orange-600 dark:text-orange-400',
};

interface ModelSelectorProps {
  onModelChange?: (modelId: string) => void;
}

export function ModelSelector({ onModelChange }: ModelSelectorProps) {
  const [models, setModels] = useState<UserAvailableModel[]>([]);
  const [currentModelId, setCurrentModelId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Group models by provider
  const modelsByProvider = models.reduce(
    (acc, model) => {
      const key = model.provider_slug;
      if (!acc[key]) {
        acc[key] = {
          name: model.provider_name,
          slug: model.provider_slug,
          models: [],
        };
      }
      acc[key].models.push(model);
      return acc;
    },
    {} as Record<string, { name: string; slug: string; models: UserAvailableModel[] }>
  );

  useEffect(() => {
    async function fetchModels() {
      try {
        const response = await fetch('/api/user/models');
        const data = await response.json();

        if (data.success) {
          setModels(data.data.models);
          setCurrentModelId(data.data.current_model_id);
        } else {
          toast.error(data.error?.message || 'Failed to load models');
        }
      } catch (err) {
        toast.error('Failed to load AI models');
      } finally {
        setLoading(false);
      }
    }

    fetchModels();
  }, []);

  const selectModel = async (modelId: string) => {
    if (modelId === currentModelId) return;

    setSaving(true);

    try {
      const response = await fetch('/api/user/settings/model', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model_id: modelId }),
      });

      const data = await response.json();

      if (data.success) {
        setCurrentModelId(modelId);
        toast.success(`AI model updated to ${data.data.model_name}`);
        onModelChange?.(modelId);
      } else {
        toast.error(data.error?.message || 'Failed to update model');
      }
    } catch (err) {
      toast.error('Failed to update model');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary-500" />
            <CardTitle>AI Model</CardTitle>
          </div>
          <CardDescription>Choose your preferred AI model</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-24 bg-secondary-100 dark:bg-secondary-800 rounded-lg animate-pulse"
              />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary-500" />
            <CardTitle>AI Model</CardTitle>
          </div>
          {saving && <Loader2 className="w-4 h-4 animate-spin text-primary-500" />}
        </div>
        <CardDescription>
          Choose your preferred AI model. Higher-tier models produce better results but use more
          credits.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Models grouped by provider */}
        {Object.values(modelsByProvider).map((provider) => (
          <div key={provider.slug} className="space-y-2">
            <h4 className="text-sm font-medium text-secondary-700 dark:text-secondary-300 flex items-center gap-2">
              <span>{providerIcons[provider.slug] || '🤖'}</span>
              {provider.name}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {provider.models.map((model) => {
                const isSelected = model.id === currentModelId;
                const tier = model.tier ? tierConfig[model.tier] : null;
                const TierIcon = tier?.icon || Gauge;

                return (
                  <button
                    key={model.id}
                    onClick={() => selectModel(model.id)}
                    disabled={saving}
                    className={`
                      relative p-4 rounded-lg border-2 text-left transition-all
                      ${
                        isSelected
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-secondary-200 dark:border-secondary-700 hover:border-secondary-300 dark:hover:border-secondary-600 bg-white dark:bg-secondary-800'
                      }
                      ${saving ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    `}
                  >
                    {/* Selection indicator */}
                    {isSelected && (
                      <div className="absolute top-2 right-2">
                        <div className="w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      </div>
                    )}

                    {/* Default badge */}
                    {model.is_default && !isSelected && (
                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="text-xs">
                          Default
                        </Badge>
                      </div>
                    )}

                    {/* Model name */}
                    <h5 className="font-medium text-secondary-900 dark:text-secondary-100 pr-16">
                      {model.name}
                    </h5>

                    {/* Tier and cost */}
                    <div className="flex items-center gap-2 mt-2">
                      {tier && (
                        <Badge className={`${tier.color} gap-1`}>
                          <TierIcon className="w-3 h-3" />
                          {tier.label}
                        </Badge>
                      )}
                      <span className={`text-sm font-medium ${costColors[model.cost_indicator]}`}>
                        {model.cost_indicator}
                      </span>
                    </div>

                    {/* Pricing tooltip on hover */}
                    <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-2">
                      ${model.input_per_mtok.toFixed(2)} in / ${model.output_per_mtok.toFixed(2)}{' '}
                      out per MTok
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Help text */}
        <p className="text-xs text-secondary-500 dark:text-secondary-400 flex items-center gap-1">
          <DollarSign className="w-3 h-3" />
          Prices shown per million tokens. Actual usage varies by request.
        </p>
      </CardContent>
    </Card>
  );
}
