'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  RefreshCw,
  Loader2,
  AlertTriangle,
  Info,
  Zap,
  Shield,
} from 'lucide-react';
import type { AutoTopupSettings as AutoTopupSettingsType } from '@/types/billing';

interface AutoTopupSettingsProps {
  purchaseSource?: string | null;
}

export default function AutoTopupSettings({ purchaseSource }: AutoTopupSettingsProps) {
  const [settings, setSettings] = useState<AutoTopupSettingsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state
  const [enabled, setEnabled] = useState(false);
  const [threshold, setThreshold] = useState(100);
  const [amount, setAmount] = useState(1000);
  const [maxMonthly, setMaxMonthly] = useState<number | null>(null);
  const [useMaxMonthly, setUseMaxMonthly] = useState(false);

  const isExternalPurchase = purchaseSource && purchaseSource !== 'stripe';

  const loadSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/billing/auto-topup');
      if (!res.ok) throw new Error('Failed to load settings');
      const result = await res.json();
      const data = result.data || result;

      setSettings(data);
      setEnabled(data.enabled);
      setThreshold(data.threshold);
      setAmount(data.amount);
      setMaxMonthly(data.maxMonthly);
      setUseMaxMonthly(data.maxMonthly !== null);
    } catch (err) {
      console.error('Failed to load auto-topup settings:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/billing/auto-topup', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enabled,
          threshold,
          amount,
          maxMonthly: useMaxMonthly ? maxMonthly : null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error?.message || 'Failed to save settings');
      }

      const result = await res.json();
      const data = result.data || result;
      setSettings(data);
      toast.success('Auto top-up settings saved');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const hasChanges =
    settings &&
    (enabled !== settings.enabled ||
      threshold !== settings.threshold ||
      amount !== settings.amount ||
      (useMaxMonthly ? maxMonthly : null) !== settings.maxMonthly);

  // Credit cost estimate (1 credit = $0.01)
  const estimatedCost = (amount / 100).toFixed(2);
  const estimatedMonthlyCap = maxMonthly ? (maxMonthly / 100).toFixed(2) : null;

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="h-32 bg-secondary-100 dark:bg-secondary-800 rounded animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="w-5 h-5 text-primary-500" aria-hidden="true" />
          Auto Top-up
        </CardTitle>
        <CardDescription>
          Automatically purchase credits when your balance runs low
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* AppSumo/Lifetime Info Banner */}
        {isExternalPurchase && (
          <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div className="text-sm">
              <p className="font-medium text-blue-800 dark:text-blue-200">
                {purchaseSource === 'appsumo' ? 'AppSumo' : 'Lifetime'} Plan
              </p>
              <p className="text-blue-700 dark:text-blue-300 mt-0.5">
                Your plan credits are included with your {purchaseSource === 'appsumo' ? 'AppSumo' : 'lifetime'} deal.
                Auto top-up only purchases <strong>additional</strong> credits beyond your plan allocation.
                A payment method is required.
              </p>
            </div>
          </div>
        )}

        {/* No payment method warning */}
        {!settings?.hasPaymentMethod && (
          <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div className="text-sm">
              <p className="font-medium text-yellow-800 dark:text-yellow-200">No payment method on file</p>
              <p className="text-yellow-700 dark:text-yellow-300 mt-0.5">
                Add a payment method from the Billing section above before enabling auto top-up.
              </p>
            </div>
          </div>
        )}

        {/* Enable/Disable Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
              Enable Auto Top-up
            </p>
            <p className="text-xs text-secondary-500 dark:text-secondary-400">
              Automatically purchase credits when balance drops below threshold
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={enabled}
            onClick={() => setEnabled(!enabled)}
            disabled={!settings?.hasPaymentMethod}
            className={`
              relative inline-flex h-6 w-11 items-center rounded-full transition-colors
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
              disabled:cursor-not-allowed disabled:opacity-50
              ${enabled ? 'bg-primary-500' : 'bg-secondary-300 dark:bg-secondary-600'}
            `}
          >
            <span
              className={`
                inline-block h-4 w-4 rounded-full bg-white transition-transform
                ${enabled ? 'translate-x-6' : 'translate-x-1'}
              `}
            />
          </button>
        </div>

        {/* Settings (shown when enabled or when user wants to configure before enabling) */}
        <div className={`space-y-4 ${!enabled ? 'opacity-50 pointer-events-none' : ''}`}>
          {/* Threshold */}
          <div>
            <Label htmlFor="threshold" className="text-sm font-medium">
              Trigger Threshold (credits)
            </Label>
            <p className="text-xs text-secondary-500 dark:text-secondary-400 mb-1.5">
              Auto top-up triggers when your total balance falls below this amount
            </p>
            <Input
              id="threshold"
              type="number"
              min={10}
              max={10000}
              value={threshold}
              onChange={(e) => setThreshold(parseInt(e.target.value) || 100)}
            />
          </div>

          {/* Amount */}
          <div>
            <Label htmlFor="amount" className="text-sm font-medium">
              Top-up Amount (credits)
            </Label>
            <p className="text-xs text-secondary-500 dark:text-secondary-400 mb-1.5">
              Number of credits to purchase each time ({estimatedCost} USD per top-up)
            </p>
            <Input
              id="amount"
              type="number"
              min={100}
              max={50000}
              step={100}
              value={amount}
              onChange={(e) => setAmount(parseInt(e.target.value) || 1000)}
            />
          </div>

          {/* Monthly Cap */}
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <input
                type="checkbox"
                id="use-monthly-cap"
                checked={useMaxMonthly}
                onChange={(e) => {
                  setUseMaxMonthly(e.target.checked);
                  if (e.target.checked && !maxMonthly) {
                    setMaxMonthly(5000);
                  }
                }}
                className="h-4 w-4 rounded border-secondary-300 text-primary-500 focus:ring-primary-500"
              />
              <Label htmlFor="use-monthly-cap" className="text-sm font-medium cursor-pointer">
                Set Monthly Spending Cap
              </Label>
            </div>
            {useMaxMonthly && (
              <>
                <p className="text-xs text-secondary-500 dark:text-secondary-400 mb-1.5">
                  Maximum credits auto-purchased per month
                  {estimatedMonthlyCap && ` ($${estimatedMonthlyCap} USD/month max)`}
                </p>
                <Input
                  id="max-monthly"
                  type="number"
                  min={100}
                  max={100000}
                  step={100}
                  value={maxMonthly || 5000}
                  onChange={(e) => setMaxMonthly(parseInt(e.target.value) || 5000)}
                />
              </>
            )}
          </div>

          {/* Summary */}
          {enabled && (
            <div className="flex items-start gap-3 p-3 bg-secondary-50 dark:bg-secondary-800 rounded-lg">
              <Shield className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <div className="text-sm text-secondary-700 dark:text-secondary-300">
                <p>
                  When your balance drops below <strong>{threshold.toLocaleString()} credits</strong>,
                  we&apos;ll automatically purchase <strong>{amount.toLocaleString()} credits</strong> (${estimatedCost})
                  using your saved payment method.
                </p>
                {useMaxMonthly && maxMonthly && (
                  <p className="mt-1">
                    Monthly cap: <strong>{maxMonthly.toLocaleString()} credits</strong> (${estimatedMonthlyCap}/month)
                  </p>
                )}
                {settings && settings.thisMonth > 0 && (
                  <p className="mt-1 text-xs text-secondary-500 dark:text-secondary-400">
                    This month: {settings.thisMonth.toLocaleString()} credits auto-purchased
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Current status badge */}
        <div className="flex items-center justify-between pt-2 border-t border-secondary-200 dark:border-secondary-700">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-secondary-400" aria-hidden="true" />
            <span className="text-sm text-secondary-600 dark:text-secondary-400">Status:</span>
            {settings?.enabled ? (
              <Badge variant="success">Active</Badge>
            ) : (
              <Badge variant="secondary">Disabled</Badge>
            )}
          </div>
          <Button
            onClick={handleSave}
            disabled={saving || !hasChanges}
            size="sm"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Settings'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
