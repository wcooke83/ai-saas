'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Loader2, Sparkles, Zap, Crown, Building2, MessageSquare } from 'lucide-react';
import type { SubscriptionPlan } from '@/types/billing';
import { isCustomPricingPlan } from '@/lib/billing/utils';

// Default features to display for each plan
const defaultFeatures: Record<string, string[]> = {
  base: [
    '2 API keys',
    'Chatbot builder',
    '3 knowledge sources per chatbot',
    'Web widget embed',
    'Community support',
  ],
  pro: [
    'Unlimited API keys',
    'Chatbot builder',
    '50 knowledge sources per chatbot',
    'Slack & Telegram integration',
    'Priority email support',
    'Custom branding',
  ],
  enterprise: [
    'Unlimited API keys',
    'Chatbot builder',
    'Unlimited knowledge sources',
    'Custom integrations',
    'Dedicated account manager',
    'SSO & advanced security',
    'SLA guarantee',
    'Custom training',
  ],
  lifetime_tier1: [
    '5 API keys',
    'Chatbot builder',
    'Web widget embed',
    'Lifetime access — no recurring fees',
  ],
  lifetime_tier2: [
    '10 API keys',
    'Chatbot builder',
    'Slack & Telegram integration',
    'Priority email support',
    'Custom branding',
    'Lifetime access — no recurring fees',
  ],
  lifetime_tier3: [
    'Unlimited API keys',
    'Chatbot builder',
    'Slack & Telegram integration',
    'Priority email support',
    'Custom branding + white label',
    'Lifetime access — no recurring fees',
  ],
};

// Plan styling configurations
const planStyles: Record<
  string,
  {
    icon: typeof Sparkles;
    iconBg: string;
    iconColor: string;
    cardClass: string;
    buttonClass: string;
  }
> = {
  base: {
    icon: Sparkles,
    iconBg: 'bg-secondary-100 dark:bg-secondary-700',
    iconColor: 'text-secondary-600 dark:text-secondary-200',
    cardClass: 'border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800',
    buttonClass: '',
  },
  pro: {
    icon: Zap,
    iconBg: 'bg-primary-100 dark:bg-primary-900/50',
    iconColor: 'text-primary-600 dark:text-primary-400',
    cardClass: 'border-primary-300 dark:border-primary-600 bg-white dark:bg-secondary-800',
    buttonClass: 'bg-primary-600 hover:bg-primary-700 dark:bg-primary-600 dark:hover:bg-primary-700 text-white',
  },
  enterprise: {
    icon: Crown,
    iconBg: 'bg-amber-100 dark:bg-amber-900/50',
    iconColor: 'text-amber-600 dark:text-amber-400',
    cardClass: 'border-amber-300 dark:border-amber-600 bg-white dark:bg-secondary-800',
    buttonClass: 'border-amber-500 dark:border-amber-500 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/30',
  },
  lifetime_tier1: {
    icon: Crown,
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/50',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    cardClass: 'border-emerald-300 dark:border-emerald-600 bg-white dark:bg-secondary-800',
    buttonClass: '',
  },
  lifetime_tier2: {
    icon: Crown,
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/50',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    cardClass: 'border-emerald-300 dark:border-emerald-600 bg-white dark:bg-secondary-800',
    buttonClass: 'bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white',
  },
  lifetime_tier3: {
    icon: Crown,
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/50',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    cardClass: 'border-emerald-300 dark:border-emerald-600 bg-white dark:bg-secondary-800',
    buttonClass: 'bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white',
  },
};

interface PlanCardProps {
  plan: SubscriptionPlan;
  isCurrentPlan: boolean;
  isYearly: boolean;
  onSelect: (planId: string, interval: 'monthly' | 'yearly') => void;
  isLoading?: boolean;
  currentPlanSlug?: string;
  hasActiveTrial?: boolean;
  onContactSales?: () => void;
}

export function PlanCard({
  plan,
  isCurrentPlan,
  isYearly,
  onSelect,
  isLoading = false,
  currentPlanSlug,
  hasActiveTrial = false,
  onContactSales,
}: PlanCardProps) {
  const isCustom = isCustomPricingPlan(plan);
  const isLifetime = plan.slug.startsWith('lifetime_');
  const style = isCustom
    ? {
        icon: Building2,
        iconBg: 'bg-amber-100 dark:bg-amber-900/50',
        iconColor: 'text-amber-600 dark:text-amber-400',
        cardClass: 'border-amber-300 dark:border-amber-600 bg-gradient-to-br from-white to-amber-50/30 dark:from-secondary-800 dark:to-amber-900/20',
        buttonClass: 'border-amber-500 dark:border-amber-500 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/30',
      }
    : (planStyles[plan.slug] || planStyles.base);
  const Icon = style.icon;

  const monthlyPrice = plan.price_monthly_cents / 100;
  const yearlyPrice = plan.price_yearly_cents ? plan.price_yearly_cents / 100 : null;

  const displayPrice = isCustom || isLifetime
    ? isLifetime ? 'Lifetime' : 'Custom'
    : isYearly && yearlyPrice
      ? Math.round(yearlyPrice / 12)
      : monthlyPrice;

  const periodText = isCustom
    ? 'tailored to your needs'
    : isLifetime
      ? 'one-time purchase'
      : monthlyPrice === 0
        ? 'forever'
        : isYearly && yearlyPrice
          ? '/mo (billed yearly)'
          : '/month';

  const yearlySavings =
    !isCustom && yearlyPrice ? monthlyPrice * 12 - yearlyPrice : null;

  const features = defaultFeatures[plan.slug] || [];

  // Use usage_description from database with fallback to defaults
  const defaultCreditContext =
    plan.slug === 'base'
      ? '~50 chatbot conversations'
      : plan.slug === 'pro'
        ? '~500 chatbot conversations'
        : 'No limits on usage';
  const creditContext = plan.usage_description || defaultCreditContext;

  // Determine button state
  const isUpgrade =
    currentPlanSlug === 'base' ||
    (currentPlanSlug === 'pro' && plan.slug === 'enterprise');
  const isDowngrade =
    (currentPlanSlug === 'pro' && plan.slug === 'base') ||
    (currentPlanSlug === 'enterprise' && plan.slug !== 'enterprise');

  const getButtonText = () => {
    if (isCurrentPlan) return 'Current Plan';
    if (plan.slug === 'enterprise') return 'Contact Sales';
    if (isLifetime) return 'Current Plan';
    if (isDowngrade) return 'Downgrade';
    return `Upgrade to ${plan.name}`;
  };

  const handleClick = () => {
    if (isCurrentPlan) return;
    if (plan.slug === 'enterprise') {
      onContactSales?.();
      return;
    }
    onSelect(plan.id, isYearly ? 'yearly' : 'monthly');
  };

  return (
    <Card
      className={`relative flex flex-col transition-colors duration-200 ${style.cardClass} hover:border-secondary-400 dark:hover:border-secondary-500`}
    >
      {plan.is_featured && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="bg-primary-600 dark:bg-primary-500 text-white px-3 py-0.5 text-xs font-medium">
            Most Popular
          </Badge>
        </div>
      )}
      {isCustom && (
        <div className="absolute -top-3 right-4">
          <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-white border-0 shadow-md shadow-amber-500/20 px-3 py-0.5 text-xs font-medium">
            Custom
          </Badge>
        </div>
      )}

      <CardHeader className="text-center pb-2">
        <div className={`mx-auto p-3 rounded-lg ${style.iconBg} w-fit mb-4`}>
          <Icon className={`w-6 h-6 ${style.iconColor}`} aria-hidden="true" />
        </div>
        <CardTitle className="text-xl">{plan.name}</CardTitle>
        <CardDescription>{plan.description}</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">
        {/* Price */}
        <div className="text-center">
          <span className="sr-only">Price: </span>
          <data
            value={displayPrice ?? 'custom'}
            className="text-5xl font-bold text-secondary-900 dark:text-secondary-100"
          >
            {isCustom ? 'Custom' : `$${displayPrice}`}
          </data>
          <span className="text-secondary-500 dark:text-secondary-300 block text-sm mt-1">
            {periodText}
          </span>
          {!isCustom && isYearly && yearlySavings && yearlySavings > 0 && (
            <span className="text-green-600 dark:text-green-400 text-sm font-medium">
              ${yearlyPrice}/year (save ${yearlySavings})
            </span>
          )}
        </div>

        {/* Credit context */}
        {isCustom ? (
          <div className="mt-6 text-center py-3 bg-gradient-to-r from-amber-50 to-amber-100/50 dark:from-amber-900/20 dark:to-amber-800/20 rounded-lg border border-amber-200/50 dark:border-amber-700/30">
            <div className="font-semibold text-amber-700 dark:text-amber-300">
              Custom Allocation
            </div>
            <div className="text-xs text-amber-600/80 dark:text-amber-400/80">
              Tailored to your organization&apos;s needs
            </div>
          </div>
        ) : (
          <div className="mt-6 text-center py-3 bg-secondary-50 dark:bg-secondary-700/30 rounded-lg">
            <div className="font-semibold text-secondary-900 dark:text-secondary-100">
              {plan.credits_monthly === -1
                ? 'Unlimited'
                : plan.credits_monthly.toLocaleString()}{' '}
              credits/month
            </div>
            <div className="text-xs text-secondary-500 dark:text-secondary-400">
              {creditContext}
            </div>
          </div>
        )}

        {/* Features list */}
        <ul className="mt-6 space-y-3 flex-1" aria-label={`${plan.name} plan features`}>
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-3">
              <Check
                className="w-5 h-5 text-green-500 dark:text-green-400 flex-shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <span className="text-sm text-secondary-700 dark:text-secondary-300">
                {feature}
              </span>
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <div className="mt-auto pt-6">
          <Button
            variant={isCustom ? 'outline' : isCurrentPlan ? 'secondary' : 'default'}
            className={`w-full focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-secondary-800 ${
              !isCurrentPlan ? style.buttonClass : ''
            } ${isCustom && !isCurrentPlan ? 'group' : ''}`}
            size="lg"
            onClick={handleClick}
            disabled={isCurrentPlan || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : isCustom && !isCurrentPlan ? (
              <>
                <MessageSquare className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                {getButtonText()}
              </>
            ) : (
              getButtonText()
            )}
          </Button>
          <div className="min-h-[1.5rem] mt-2">
            {isCustom && !isCurrentPlan && (
              <p className="text-center text-xs text-secondary-500 dark:text-secondary-400">
                Get a custom quote in 24 hours
              </p>
            )}
            {!isCustom && !isCurrentPlan && (
              <p className="text-center text-xs text-secondary-500 dark:text-secondary-400">
                Cancel anytime
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
