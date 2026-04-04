'use client';

import * as React from 'react';
import Link from 'next/link';
import { Loader2, Sparkles, Zap } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface CreditPack {
  id: string;
  slug: string;
  name: string;
  credits: number;
  bonusCredits: number;
  priceCents: number;
}

export interface CreditDepletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  needed: number;
  available: number;
  packs: CreditPack[];
}

export function CreditDepletionModal({
  isOpen,
  onClose,
  needed,
  available,
  packs,
}: CreditDepletionModalProps) {
  const [purchasing, setPurchasing] = React.useState<string | null>(null);

  const handleBuy = async (pack: CreditPack) => {
    setPurchasing(pack.id);
    try {
      const res = await fetch('/api/billing/credits/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packId: pack.id }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error?.message || 'Failed to initiate checkout');
      }

      const result = await res.json().catch(() => ({}));
      const url = result?.data?.url || result?.url;

      if (url) {
        window.location.href = url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to start checkout');
      setPurchasing(null);
    }
  };

  const midIndex = Math.floor(packs.length / 2);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>You&apos;ve run out of credits</DialogTitle>
          <DialogDescription>
            {needed > 0 && available <= 0
              ? `This action needs ${needed.toLocaleString()} credits but you have ${available.toLocaleString()} available.`
              : 'Add credits to continue. Your plan credits will reset at the end of your billing period.'}
          </DialogDescription>
        </DialogHeader>

        {packs.length > 0 && (
          <div className={cn(
            'grid gap-3 py-2',
            packs.length === 3 ? 'sm:grid-cols-3' : packs.length === 2 ? 'sm:grid-cols-2' : 'grid-cols-1'
          )}>
            {packs.map((pack, idx) => {
              const isFeatured = packs.length >= 3 && idx === midIndex;
              const totalCredits = pack.credits + pack.bonusCredits;
              const isLoading = purchasing === pack.id;

              return (
                <div
                  key={pack.id}
                  className={cn(
                    'relative flex flex-col rounded-lg border p-4 transition-colors',
                    isFeatured
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-md'
                      : 'border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800/50'
                  )}
                >
                  {isFeatured && (
                    <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-primary-500 text-white">
                        <Sparkles className="w-3 h-3" aria-hidden="true" />
                        Popular
                      </span>
                    </div>
                  )}

                  <p className="text-sm font-semibold text-secondary-900 dark:text-secondary-100">
                    {pack.name}
                  </p>

                  <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-1">
                    {pack.credits.toLocaleString()}
                    <span className="text-sm font-normal text-secondary-500 dark:text-secondary-400"> credits</span>
                  </p>

                  {pack.bonusCredits > 0 && (
                    <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                      +{pack.bonusCredits.toLocaleString()} bonus = {totalCredits.toLocaleString()} total
                    </p>
                  )}

                  <p className="text-sm font-bold text-primary-600 dark:text-primary-400 mt-1">
                    ${(pack.priceCents / 100).toFixed(2)}
                  </p>

                  <Button
                    size="sm"
                    variant={isFeatured ? 'default' : 'outline'}
                    className="mt-3 w-full"
                    onClick={() => handleBuy(pack)}
                    disabled={purchasing !== null}
                    aria-label={`Buy ${pack.name} for $${(pack.priceCents / 100).toFixed(2)}`}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" />
                        Redirecting...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-2" aria-hidden="true" />
                        Buy {pack.name}
                      </>
                    )}
                  </Button>
                </div>
              );
            })}
          </div>
        )}

        <DialogFooter className="flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/dashboard/billing"
            className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
            onClick={onClose}
          >
            Upgrade plan instead
          </Link>
          <Button variant="ghost" size="sm" onClick={onClose} disabled={purchasing !== null}>
            Dismiss
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
