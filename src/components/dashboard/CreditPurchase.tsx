'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Coins,
  Loader2,
  ShoppingCart,
  Sparkles,
  TrendingUp,
  Info,
} from 'lucide-react';
import type { CreditBalance } from '@/types/billing';

interface CreditPurchaseProps {
  purchaseSource?: string | null;
}

const CREDIT_PACKS = [
  { amount: 500, label: '500', popular: false },
  { amount: 1000, label: '1,000', popular: false },
  { amount: 5000, label: '5,000', popular: true },
  { amount: 10000, label: '10,000', popular: false },
  { amount: 25000, label: '25,000', popular: false },
  { amount: 50000, label: '50,000', popular: false },
];

export default function CreditPurchase({ purchaseSource }: CreditPurchaseProps) {
  const [balance, setBalance] = useState<CreditBalance | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');

  const isExternalPurchase = purchaseSource && purchaseSource !== 'stripe';

  const loadBalance = useCallback(async () => {
    try {
      const res = await fetch('/api/billing/credits');
      if (!res.ok) throw new Error('Failed to load balance');
      const result = await res.json();
      const data = result.data || result;
      setBalance(data.balance);
    } catch (err) {
      console.error('Failed to load credit balance:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBalance();
  }, [loadBalance]);

  const handlePurchase = async (amount: number) => {
    setSelectedAmount(amount);
    setShowDialog(true);
  };

  const confirmPurchase = async () => {
    if (!selectedAmount) return;

    setPurchasing(true);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'credits',
          creditAmount: selectedAmount,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error?.message || 'Failed to create checkout');
      }

      const result = await res.json();
      const url = result.data?.url || result.url;

      if (url) {
        window.location.href = url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to initiate purchase');
      setPurchasing(false);
    }
  };

  const handleCustomPurchase = () => {
    const amount = parseInt(customAmount);
    if (isNaN(amount) || amount < 100) {
      toast.error('Minimum purchase is 100 credits');
      return;
    }
    if (amount > 100000) {
      toast.error('Maximum purchase is 100,000 credits');
      return;
    }
    handlePurchase(amount);
  };

  const formatCredits = (n: number) => {
    if (n === -1) return 'Unlimited';
    return n.toLocaleString();
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="h-48 bg-secondary-100 dark:bg-secondary-800 rounded animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-primary-500" aria-hidden="true" />
            Purchase Credits
          </CardTitle>
          <CardDescription>
            Buy additional credits for AI generations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Balance */}
          {balance && (
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="p-3 bg-secondary-50 dark:bg-secondary-800 rounded-lg text-center">
                <p className="text-xs text-secondary-500 dark:text-secondary-400">Plan Credits</p>
                <p className="text-lg font-bold text-secondary-900 dark:text-secondary-100">
                  {balance.isUnlimited ? 'Unlimited' : formatCredits(balance.planRemaining)}
                </p>
                {!balance.isUnlimited && (
                  <p className="text-xs text-secondary-400">
                    of {formatCredits(balance.planAllocation)}
                  </p>
                )}
              </div>
              <div className="p-3 bg-secondary-50 dark:bg-secondary-800 rounded-lg text-center">
                <p className="text-xs text-secondary-500 dark:text-secondary-400">Purchased</p>
                <p className="text-lg font-bold text-primary-600 dark:text-primary-400">
                  {formatCredits(balance.purchasedCredits)}
                </p>
              </div>
              <div className="p-3 bg-secondary-50 dark:bg-secondary-800 rounded-lg text-center">
                <p className="text-xs text-secondary-500 dark:text-secondary-400">Bonus</p>
                <p className="text-lg font-bold text-green-600 dark:text-green-400">
                  {formatCredits(balance.bonusCredits)}
                </p>
              </div>
            </div>
          )}

          {/* AppSumo Info */}
          {isExternalPurchase && (
            <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Your {purchaseSource === 'appsumo' ? 'AppSumo' : 'lifetime'} plan includes monthly credits.
                Purchased credits are <strong>separate</strong> from your plan and never expire.
              </p>
            </div>
          )}

          {/* Credit Packs */}
          <div>
            <h3 className="text-sm font-medium text-secondary-900 dark:text-secondary-100 mb-3">
              Credit Packs
            </h3>
            <div className="grid gap-3 sm:grid-cols-3">
              {CREDIT_PACKS.map((pack) => (
                <button
                  key={pack.amount}
                  onClick={() => handlePurchase(pack.amount)}
                  className={`
                    relative p-4 rounded-lg border text-left transition-all
                    hover:border-primary-500 hover:shadow-md
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500
                    ${pack.popular
                      ? 'border-primary-300 dark:border-primary-700 bg-primary-50/50 dark:bg-primary-900/20'
                      : 'border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800/50'
                    }
                  `}
                >
                  {pack.popular && (
                    <Badge className="absolute -top-2 right-2 bg-primary-500 text-white text-[10px]">
                      Popular
                    </Badge>
                  )}
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-4 h-4 text-primary-500" aria-hidden="true" />
                    <span className="font-semibold text-secondary-900 dark:text-secondary-100">
                      {pack.label}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-primary-600 dark:text-primary-400">
                    ${(pack.amount / 100).toFixed(2)}
                  </p>
                  <p className="text-xs text-secondary-500 dark:text-secondary-400">
                    credits
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Amount */}
          <div>
            <h3 className="text-sm font-medium text-secondary-900 dark:text-secondary-100 mb-2">
              Custom Amount
            </h3>
            <div className="flex gap-2">
              <Input
                type="number"
                min={100}
                max={100000}
                step={100}
                placeholder="Enter credit amount (min 100)"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={handleCustomPurchase}
                disabled={!customAmount || parseInt(customAmount) < 100}
                variant="outline"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Buy
              </Button>
            </div>
            <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1">
              1 credit = $0.01 USD. Min 100, max 100,000 credits per purchase.
            </p>
          </div>

          {/* Purchased credits info */}
          <div className="flex items-start gap-2 text-xs text-secondary-500 dark:text-secondary-400">
            <TrendingUp className="w-4 h-4 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <p>
              Purchased credits are used after your plan credits are depleted. They never expire and carry over between billing periods.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Credit Purchase</DialogTitle>
            <DialogDescription>
              You are about to purchase additional credits for your account.
            </DialogDescription>
          </DialogHeader>

          {selectedAmount && (
            <div className="py-4 space-y-3">
              <div className="flex items-center justify-between p-4 bg-secondary-50 dark:bg-secondary-800 rounded-lg">
                <div>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">Credits</p>
                  <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
                    {selectedAmount.toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">Total</p>
                  <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                    ${(selectedAmount / 100).toFixed(2)}
                  </p>
                </div>
              </div>

              <ul className="text-sm text-secondary-600 dark:text-secondary-400 space-y-1">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  Credits are added instantly after payment
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  Purchased credits never expire
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  Used only after plan credits are depleted
                </li>
              </ul>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDialog(false)}
              disabled={purchasing}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmPurchase}
              disabled={purchasing}
            >
              {purchasing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Redirecting...
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Purchase for ${selectedAmount ? (selectedAmount / 100).toFixed(2) : '0.00'}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
