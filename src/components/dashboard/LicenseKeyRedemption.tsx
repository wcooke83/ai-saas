'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  KeyRound,
  Loader2,
  CheckCircle2,
  Gift,
  ArrowUpCircle,
} from 'lucide-react';

interface LicenseKeyRedemptionProps {
  purchaseSource?: string | null;
  currentPlanSlug?: string | null;
  onRedeemed?: () => void;
}

export default function LicenseKeyRedemption({
  purchaseSource,
  currentPlanSlug,
  onRedeemed,
}: LicenseKeyRedemptionProps) {
  const [key, setKey] = useState('');
  const [redeeming, setRedeeming] = useState(false);
  const [redeemResult, setRedeemResult] = useState<{
    planName: string;
    tier: number;
    message: string;
  } | null>(null);

  const isLifetimePlan = currentPlanSlug?.startsWith('lifetime_');

  const handleRedeem = async () => {
    if (!key.trim()) {
      toast.error('Please enter a license key');
      return;
    }

    setRedeeming(true);
    setRedeemResult(null);

    try {
      const res = await fetch('/api/billing/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: key.trim() }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(
          result.error?.message || result.error || 'Failed to redeem license key'
        );
      }

      const data = result.data || result;

      setRedeemResult({
        planName: data.planName,
        tier: data.tier,
        message: data.message,
      });

      setKey('');
      toast.success(data.message);
      onRedeemed?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to redeem license key');
    } finally {
      setRedeeming(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <KeyRound className="w-5 h-5 text-primary-500" aria-hidden="true" />
          Redeem License Key
        </CardTitle>
        <CardDescription>
          {isLifetimePlan
            ? 'Stack another code to upgrade your lifetime tier'
            : 'Enter a license key from AppSumo or another marketplace to activate your plan'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current lifetime plan info */}
        {isLifetimePlan && (
          <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" aria-hidden="true" />
            <div className="text-sm">
              <p className="font-medium text-green-800 dark:text-green-200">
                Lifetime Plan Active
              </p>
              <p className="text-green-700 dark:text-green-300">
                You can stack additional codes to upgrade your tier and get more credits.
              </p>
            </div>
          </div>
        )}

        {/* Success message */}
        {redeemResult && (
          <div className="flex items-start gap-3 p-4 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg">
            <Gift className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="font-medium text-primary-800 dark:text-primary-200">
                {redeemResult.message}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="success">{redeemResult.planName}</Badge>
                <span className="text-xs text-primary-600 dark:text-primary-400">
                  Tier {redeemResult.tier}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Input */}
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Enter your license key (e.g. APPSUMO-XXXX-XXXX)"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleRedeem()}
            disabled={redeeming}
            className="flex-1 font-mono"
          />
          <Button onClick={handleRedeem} disabled={redeeming || !key.trim()}>
            {redeeming ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Redeeming...
              </>
            ) : (
              'Redeem'
            )}
          </Button>
        </div>

        {/* Stacking info */}
        <div className="flex items-start gap-2 text-xs text-secondary-500 dark:text-secondary-400">
          <ArrowUpCircle className="w-4 h-4 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <p>
            {isLifetimePlan
              ? 'Redeeming a higher-tier code upgrades your plan automatically. Your credits increase immediately.'
              : 'License keys from AppSumo and other marketplaces activate a lifetime plan with monthly credits. You can stack multiple codes to upgrade your tier.'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
