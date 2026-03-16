'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Loader2,
  ChevronDown,
  Check,
  X,
} from 'lucide-react';
import { BillingToggle } from '@/components/dashboard/upgrade/BillingToggle';
import { PlanCard } from '@/components/dashboard/upgrade/PlanCard';
import { CurrentPlanBanner } from '@/components/dashboard/upgrade/CurrentPlanBanner';
import type { SubscriptionPlan, SubscriptionDetails, EffectivePlan } from '@/types/billing';
import type { PlansResponse } from '@/app/api/billing/plans/route';

// Feature comparison data
const comparisonFeatures = [
  { name: 'Monthly credits', base: '100', pro: '1,000', enterprise: 'Unlimited' },
  { name: 'API keys', base: '2', pro: 'Unlimited', enterprise: 'Unlimited' },
  { name: 'Chatbot builder', base: true, pro: true, enterprise: true },
  { name: 'Knowledge sources per chatbot', base: '3', pro: '50', enterprise: 'Unlimited' },
  { name: 'Email Writer', base: true, pro: true, enterprise: true },
  { name: 'Proposal Generator', base: 'Basic', pro: 'Advanced', enterprise: 'Advanced + Custom' },
  { name: 'Social Post Generator', base: false, pro: true, enterprise: true },
  { name: 'Email Sequence Builder', base: false, pro: true, enterprise: true },
  { name: 'PDF/DOCX Export', base: false, pro: true, enterprise: true },
  { name: 'Custom branding', base: false, pro: true, enterprise: true },
  { name: 'Priority support', base: false, pro: true, enterprise: true },
  { name: 'Dedicated account manager', base: false, pro: false, enterprise: true },
  { name: 'SSO & security', base: false, pro: false, enterprise: true },
  { name: 'Custom integrations', base: false, pro: false, enterprise: true },
  { name: 'SLA guarantee', base: false, pro: false, enterprise: true },
];

function FeatureValue({ value }: { value: boolean | string }) {
  if (value === true) {
    return <Check className="w-5 h-5 text-green-500 mx-auto" aria-label="Included" />;
  }
  if (value === false) {
    return <X className="w-5 h-5 text-secondary-300 dark:text-secondary-600 mx-auto" aria-label="Not included" />;
  }
  return <span className="text-sm text-secondary-700 dark:text-secondary-300">{value}</span>;
}

export default function UpgradePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [currentPlanSlug, setCurrentPlanSlug] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionDetails | null>(null);
  const [effectivePlan, setEffectivePlan] = useState<EffectivePlan | null>(null);
  const [isYearly, setIsYearly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [showContactDialog, setShowContactDialog] = useState(false);

  // Load plans and subscription data
  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch('/api/billing/plans');
        if (!response.ok) {
          throw new Error('Failed to load plans');
        }

        const data: PlansResponse = await response.json();
        setPlans(data.plans);
        setCurrentPlanSlug(data.currentPlanSlug);
        setSubscription(data.subscription);
        setEffectivePlan(data.effectivePlan);
      } catch (err) {
        toast.error('Failed to load subscription plans. Please try again.');
        console.error('Error loading plans:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Handle checkout success/canceled from URL params
  useEffect(() => {
    const checkout = searchParams.get('checkout');
    if (checkout === 'success') {
      // Could show a success toast here
      router.replace('/dashboard/upgrade');
    } else if (checkout === 'canceled') {
      // Could show a canceled message
      router.replace('/dashboard/upgrade');
    }
  }, [searchParams, router]);

  const handlePlanSelect = async (planId: string, interval: 'monthly' | 'yearly') => {
    setCheckoutLoading(planId);

    try {
      // First, calculate upgrade details if user has active subscription
      const calcResponse = await fetch('/api/billing/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetPlanId: planId,
          billingInterval: interval,
        }),
      });

      if (!calcResponse.ok) {
        throw new Error('Failed to calculate upgrade details');
      }

      const calcData = await calcResponse.json();
      const isUpgrade = calcData.calculation?.isUpgrade && calcData.calculation?.creditAppliedCents > 0;

      // If there's a credit, show confirmation with breakdown
      if (isUpgrade && calcData.calculation?.creditAppliedCents > 0) {
        const creditDollars = (calcData.calculation.creditAppliedCents / 100).toFixed(2);
        const amountDueDollars = (calcData.calculation.amountDueCents / 100).toFixed(2);
        const confirmed = confirm(
          `Upgrade Summary:\n\n` +
          `Credit for unused time: $${creditDollars}\n` +
          `Amount due today: $${amountDueDollars}\n\n` +
          `Continue to checkout?`
        );
        if (!confirmed) {
          setCheckoutLoading(null);
          return;
        }
      }

      // Proceed to checkout with credit info
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'subscription',
          planId,
          billingInterval: interval,
          isUpgrade: calcData.calculation?.isUpgrade,
          creditAmountCents: calcData.calculation?.creditAppliedCents,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout
      const checkoutUrl = data.data?.url || data.url;
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to start checkout');
      setCheckoutLoading(null);
    }
  };

  const handleContactSales = () => {
    setShowContactDialog(true);
  };

  const getCurrentPlan = () => {
    if (!currentPlanSlug) return null;
    return plans.find((p) => p.slug === currentPlanSlug) || null;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-secondary-200 dark:bg-secondary-700 rounded animate-pulse" />
        <div className="h-12 w-64 mx-auto bg-secondary-200 dark:bg-secondary-700 rounded animate-pulse" />
        <div className="grid gap-8 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="h-96 bg-secondary-100 dark:bg-secondary-800 rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Sort plans by display_order (trust the admin-configured order)
  const sortedPlans = [...plans].sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Button variant="ghost" size="sm" className="mb-4" asChild>
          <Link href="/dashboard/billing">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Billing
          </Link>
        </Button>
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
          Upgrade Your Plan
        </h1>
        <p className="text-secondary-600 dark:text-secondary-400">
          Choose the plan that&apos;s right for you. Upgrade or downgrade anytime.
        </p>
      </div>

      {/* Current plan banner */}
      <CurrentPlanBanner
        currentPlan={getCurrentPlan()}
        subscription={subscription}
        effectivePlan={effectivePlan}
      />

      {/* Billing toggle */}
      <BillingToggle isYearly={isYearly} onToggle={setIsYearly} />

      {/* Plan cards */}
      <div className="grid gap-8 md:grid-cols-3">
        {sortedPlans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            isCurrentPlan={currentPlanSlug === plan.slug}
            isYearly={isYearly}
            onSelect={handlePlanSelect}
            isLoading={checkoutLoading === plan.id}
            currentPlanSlug={currentPlanSlug || undefined}
            hasActiveTrial={effectivePlan?.isTrial || false}
            onContactSales={handleContactSales}
          />
        ))}
      </div>

      {/* Feature comparison toggle */}
      <div className="text-center">
        <button
          onClick={() => setShowComparison(!showComparison)}
          className="flex items-center gap-2 mx-auto text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors"
        >
          <span>{showComparison ? 'Hide' : 'Compare all'} features</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${showComparison ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {/* Feature comparison table */}
      {showComparison && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-secondary-200 dark:border-secondary-700">
                <th className="text-left py-4 px-4 font-semibold text-secondary-900 dark:text-secondary-100">
                  Feature
                </th>
                <th className="text-center py-4 px-4 font-semibold text-secondary-900 dark:text-secondary-100">
                  Base
                </th>
                <th className="text-center py-4 px-4 font-semibold text-primary-600 dark:text-primary-400 bg-primary-50/50 dark:bg-primary-900/20">
                  Pro
                </th>
                <th className="text-center py-4 px-4 font-semibold text-amber-600 dark:text-amber-400">
                  Enterprise
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisonFeatures.map((feature, i) => (
                <tr
                  key={feature.name}
                  className={`border-b border-secondary-100 dark:border-secondary-800 ${
                    i % 2 === 0 ? 'bg-secondary-50/50 dark:bg-secondary-800/30' : ''
                  }`}
                >
                  <td className="py-3 px-4 text-sm text-secondary-700 dark:text-secondary-300">
                    {feature.name}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <FeatureValue value={feature.base} />
                  </td>
                  <td className="py-3 px-4 text-center bg-primary-50/30 dark:bg-primary-900/10">
                    <FeatureValue value={feature.pro} />
                  </td>
                  <td className="py-3 px-4 text-center">
                    <FeatureValue value={feature.enterprise} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Contact Sales Dialog (simple version) */}
      {showContactDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              Contact Sales
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400 mb-6">
              Our Enterprise plan is tailored to your organization&apos;s needs.
              Contact our sales team to discuss custom pricing, integrations, and support.
            </p>
            <div className="space-y-3">
              <Button className="w-full" asChild>
                <Link href="/help?subject=enterprise">
                  Get in Touch
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowContactDialog(false)}
              >
                Maybe Later
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
