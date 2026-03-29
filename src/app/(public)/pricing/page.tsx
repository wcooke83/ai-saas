'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/layout';
import { ToolsHero } from '@/components/ui/tools-hero';
import { Footer } from '@/components/ui/footer';
import { PageBackground } from '@/components/ui/page-background';
import {
  Check,
  X,
  Sparkles,
  Zap,
  Crown,
  HelpCircle,
  ChevronDown,
  Shield,
  Star,
  Building2,
  Rocket,
  Loader2,
  Bot,
} from 'lucide-react';
import type { SubscriptionPlan } from '@/types/billing';
import { isCustomPricingPlan, sortPlansByDisplayOrder } from '@/lib/billing/utils';

// Tool display configuration
const toolConfig: Record<string, { name: string; icon: typeof Bot }> = {
  custom_chatbots: { name: 'Custom Chatbots', icon: Bot },
};

// Plan styling configuration based on slug
const planStyles: Record<string, {
  icon: typeof Sparkles | typeof Zap | typeof Crown;
  iconBg: string;
  iconColor: string;
  cardClass: string;
  cta: string;
  ctaSubtext?: string;
  ctaVariant: 'ghost' | 'default' | 'outline';
  popular: boolean;
}> = {
  free: {
    icon: Sparkles,
    iconBg: 'bg-secondary-100 dark:bg-secondary-700',
    iconColor: 'text-secondary-600 dark:text-secondary-200',
    cardClass: 'border-secondary-200 dark:border-secondary-600 bg-white dark:bg-secondary-800',
    cta: 'Get Started',
    ctaVariant: 'ghost',
    popular: false,
  },
  base: {
    icon: Sparkles,
    iconBg: 'bg-emerald-100 dark:bg-emerald-800/60',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    cardClass: 'border-emerald-200 dark:border-emerald-600 bg-white dark:bg-secondary-800',
    cta: 'Get Started',
    ctaVariant: 'default',
    popular: false,
  },
  pro: {
    icon: Zap,
    iconBg: 'bg-primary-100 dark:bg-primary-800/60',
    iconColor: 'text-primary-600 dark:text-primary-400',
    cardClass: 'border-2 border-primary-400 dark:border-primary-400 shadow-xl shadow-primary-500/20 dark:shadow-primary-400/40 bg-gradient-to-b from-primary-50/50 to-white dark:from-primary-900/40 dark:to-secondary-800 ring-1 ring-primary-500/20 dark:ring-primary-400/50',
    cta: 'Start Free Trial',
    ctaSubtext: 'No credit card required',
    ctaVariant: 'default',
    popular: true,
  },
  enterprise: {
    icon: Crown,
    iconBg: 'bg-amber-100 dark:bg-amber-800/50',
    iconColor: 'text-amber-600 dark:text-amber-400',
    cardClass: 'border-amber-300 dark:border-amber-500/70 bg-gradient-to-br from-white to-amber-50/30 dark:from-secondary-800 dark:to-amber-900/20 ring-1 ring-amber-200/50 dark:ring-amber-500/30',
    cta: 'Talk to Sales',
    ctaVariant: 'outline',
    popular: false,
  },
};

// Default styling for plans not in the map
const defaultPlanStyle = {
  icon: Zap,
  iconBg: 'bg-primary-100 dark:bg-primary-800/60',
  iconColor: 'text-primary-600 dark:text-primary-400',
  cardClass: 'border-secondary-200 dark:border-secondary-600 bg-white dark:bg-secondary-800',
  cta: 'Get Started',
  ctaVariant: 'default' as const,
  popular: false,
};

const testimonials = [
  {
    quote: "We deployed a chatbot trained on our knowledge base in under an hour. It now handles about 70% of support inquiries on its own — without us touching it.",
    author: "J.D.",
    role: "Marketing Director",
    company: "E-commerce brand",
    initials: "JD",
    gradient: "from-primary-400 to-primary-600",
  },
  {
    quote: "Response times went from hours to seconds after we embedded VocUI on our site. Our support team finally has time for the issues that actually need a human.",
    author: "S.C.",
    role: "VP of Customer Success",
    company: "B2B SaaS company",
    initials: "SC",
    gradient: "from-emerald-400 to-emerald-600",
  },
  {
    quote: "I trained it on our docs and FAQs in about 20 minutes. It answers questions more consistently than I did. The Slack integration alone is worth it.",
    author: "M.T.",
    role: "Founder",
    company: "Digital agency",
    initials: "MT",
    gradient: "from-violet-400 to-violet-600",
  },
];

// Feature display names for non-tool features
const featureDisplayNames: Record<string, string> = {
  priority_support: 'Priority Support',
  dedicated_support: 'Dedicated Account Manager',
  pdf_export: 'PDF Export',
  docx_export: 'DOCX Export',
  sso: 'SSO & Security',
  sla: 'SLA Guarantee',
  custom_integrations: 'Custom Integrations',
  custom_branding: 'Custom Branding',
};

// Helper to build comparison features from plans
function buildComparisonFeatures(plans: SubscriptionPlan[]) {
  if (!plans.length) return [];

  const sortedPlans = sortPlansByDisplayOrder(plans);

  // Start with credits and API keys
  const features: { name: string; values: Record<string, boolean | string> }[] = [
    {
      name: 'Monthly Credits',
      values: Object.fromEntries(
        sortedPlans.map(p => [
          p.slug,
          p.credits_monthly === -1 ? 'Unlimited' : p.credits_monthly.toLocaleString()
        ])
      ),
    },
    {
      name: 'API Keys',
      values: Object.fromEntries(
        sortedPlans.map(p => [
          p.slug,
          p.api_keys_limit === -1 ? 'Unlimited' : p.api_keys_limit.toString()
        ])
      ),
    },
  ];

  // Collect all unique feature keys across all plans
  const allFeatureKeys = new Set<string>();
  sortedPlans.forEach(plan => {
    if (plan.features && typeof plan.features === 'object') {
      Object.keys(plan.features).forEach(key => allFeatureKeys.add(key));
    }
  });

  // Add tool features first
  const toolKeys = Array.from(allFeatureKeys).filter(key => toolConfig[key]);
  toolKeys.forEach(key => {
    features.push({
      name: toolConfig[key].name,
      values: Object.fromEntries(
        sortedPlans.map(plan => {
          const featureValue = (plan.features as Record<string, any>)?.[key];
          if (featureValue === true) return [plan.slug, true];
          if (typeof featureValue === 'string') return [plan.slug, featureValue];
          return [plan.slug, false];
        })
      ),
    });
  });

  // Add non-tool features
  const nonToolKeys = Array.from(allFeatureKeys).filter(key => !toolConfig[key]);
  nonToolKeys.forEach(key => {
    features.push({
      name: featureDisplayNames[key] || key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      values: Object.fromEntries(
        sortedPlans.map(plan => {
          const featureValue = (plan.features as Record<string, any>)?.[key];
          if (featureValue === true) return [plan.slug, true];
          if (typeof featureValue === 'string') return [plan.slug, featureValue];
          return [plan.slug, false];
        })
      ),
    });
  });

  return features;
}

const faqs = [
  {
    question: 'What are credits?',
    answer: 'Credits are consumed each time your chatbot answers a question or processes a knowledge source. A simple one-line answer uses ~1 credit. A detailed multi-paragraph response uses 2–3 credits. A back-and-forth conversation of 10 messages typically uses 5–15 credits total.',
  },
  {
    question: 'Can I change plans anytime?',
    answer: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we\'ll prorate any differences.',
  },
  {
    question: 'What happens if I run out of credits?',
    answer: 'You can purchase additional credits anytime, enable auto-topup to never run out, or upgrade for a higher monthly allocation.',
  },
  {
    question: 'Is there a free trial for Pro?',
    answer: 'Yes! Start a 14-day free trial of Pro with no credit card required. You\'ll have full access to all Pro features.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, Mastercard, American Express) and PayPal. Enterprise customers can also pay by invoice.',
  },
  {
    question: 'Can I get a refund?',
    answer: 'Yes! We offer a 14-day money-back guarantee. If you\'re not satisfied, contact support within 14 days of your initial purchase for a full refund.',
  },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-secondary-200 dark:border-secondary-600 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 text-left bg-white dark:bg-secondary-800 hover:bg-secondary-50 dark:hover:bg-secondary-700/50 transition-colors flex items-center justify-between gap-4"
        aria-expanded={isOpen}
      >
        <h3 className="font-semibold text-secondary-900 dark:text-secondary-100">{question}</h3>
        <ChevronDown
          className={`w-5 h-5 text-secondary-500 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>
      <div
        className={`grid transition-all duration-200 ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
        aria-hidden={!isOpen}
      >
        <div className="overflow-hidden">
          <p className="px-6 pb-6 text-secondary-600 dark:text-secondary-300">{answer}</p>
        </div>
      </div>
    </div>
  );
}

function FeatureValue({ value }: { value: boolean | string }) {
  if (value === true) {
    return <Check className="w-5 h-5 text-green-500 mx-auto" aria-label="Included" />;
  }
  if (value === false) {
    return <X className="w-5 h-5 text-secondary-300 dark:text-secondary-600 mx-auto" aria-label="Not included" />;
  }
  return <span className="text-sm text-secondary-700 dark:text-secondary-300">{value}</span>;
}

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPlans() {
      try {
        // Use public API that filters out hidden plans
        const response = await fetch('/api/plans');
        if (!response.ok) {
          throw new Error('Failed to fetch plans');
        }
        const data = await response.json();
        setPlans(data.plans || []);
      } catch (err) {
        console.error('Error fetching plans:', err);
        setError('Failed to load pricing plans');
      } finally {
        setLoading(false);
      }
    }
    fetchPlans();
  }, []);

  return (
    <PageBackground>
      <Header secondaryCta={{ label: 'Sign In', href: '/login' }} />

      <main id="main-content">
        {/* Hero */}
        <ToolsHero
          badge="Pricing"
          title="Simple, transparent pricing"
          description="Choose the plan that fits your needs. All plans include chatbot building and deployment. Upgrade or downgrade anytime."
          breadcrumbs={[
            { label: 'Pricing' },
          ]}
        />

        {/* Billing Toggle */}
        <section className="container mx-auto px-4 pb-8">
          <div className="flex items-center justify-center gap-4">
            <span className={`text-sm font-medium ${!isYearly ? 'text-secondary-900 dark:text-secondary-100' : 'text-secondary-500 dark:text-secondary-400'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className={`relative w-16 h-11 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                isYearly ? 'bg-primary-600' : 'bg-secondary-300 dark:bg-secondary-600'
              }`}
              role="switch"
              aria-checked={isYearly}
              aria-label="Toggle annual billing"
            >
              <span
                className={`absolute top-2 left-2 w-7 h-7 bg-white rounded-full shadow transition-transform ${
                  isYearly ? 'translate-x-5' : ''
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${isYearly ? 'text-secondary-900 dark:text-secondary-100' : 'text-secondary-500 dark:text-secondary-400'}`}>
              Annual
            </span>
            <Badge variant="outline" className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-700">
              Save 20%
            </Badge>
          </div>
        </section>

        {/* Trust Bar */}
        <section className="container mx-auto px-4 pb-12">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-secondary-600 dark:text-secondary-400">
            <div className="flex items-center gap-2">
              <Rocket className="w-4 h-4" aria-hidden="true" />
              <span>Get started in minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" aria-hidden="true" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-600 dark:text-green-400" aria-hidden="true" />
              <span>14-day money-back guarantee</span>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section id="pricing" className="container mx-auto px-4 pb-24">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
              <span className="ml-3 text-secondary-600 dark:text-secondary-400">Loading plans...</span>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()} variant="outline">
                Try Again
              </Button>
            </div>
          ) : (
            <>
              <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
                {sortPlansByDisplayOrder(plans).map((plan) => {
                  const isCustom = isCustomPricingPlan(plan);
                  const style = planStyles[plan.slug] || defaultPlanStyle;
                  const Icon = style.icon;
                  const monthlyPrice = plan.price_monthly_cents / 100;
                  const yearlyPrice = plan.price_yearly_cents ? plan.price_yearly_cents / 100 : null;
                  const price = isCustom
                    ? null
                    : isYearly && yearlyPrice && yearlyPrice > 0
                      ? Math.round(yearlyPrice / 12)
                      : monthlyPrice;
                  const displayPrice = isCustom ? 'Custom' : price === 0 ? '$0' : `$${price}`;
                  const periodText = isCustom
                    ? 'tailored to your needs'
                    : monthlyPrice === 0
                      ? 'forever'
                      : isYearly
                        ? '/mo (billed yearly)'
                        : '/month';
                  const apiKeysText = plan.api_keys_limit === -1 ? 'Unlimited' : plan.api_keys_limit.toString();
                  const creditsText = plan.credits_monthly === -1 ? 'Unlimited' : plan.credits_monthly.toLocaleString();
                  
                  // Separate tools and other features from plan data
                  const planFeatures = plan.features && typeof plan.features === 'object'
                    ? Object.entries(plan.features).filter(([_, value]) => value === true || (typeof value === 'string' && value))
                    : [];

                  const includedTools = planFeatures
                    .filter(([key]) => toolConfig[key])
                    .map(([key, value]) => ({
                      key,
                      name: typeof value === 'string' ? `${toolConfig[key].name} (${value})` : toolConfig[key].name,
                      icon: toolConfig[key].icon,
                    }));

                  const otherFeatures = planFeatures
                    .filter(([key]) => !toolConfig[key])
                    .map(([key]) => key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()));

                  return (
                    <Card
                      key={plan.name}
                      className={`relative flex flex-col transition-all duration-200 ${style.cardClass} ${
                        (plan.is_featured || style.popular)
                          ? 'md:scale-105 order-first md:order-none'
                          : 'hover:border-secondary-300 dark:hover:border-secondary-600'
                      }`}
                    >
                      {(plan.is_featured || style.popular) && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                          <Badge className="bg-gradient-to-r from-primary-600 to-primary-500 dark:from-primary-500 dark:to-primary-400 text-white shadow-md shadow-primary-500/30 px-4 py-1 font-semibold">
                            Most Popular
                          </Badge>
                        </div>
                      )}
                      {isCustom && (
                        <div className="absolute -top-4 right-4">
                          <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-white border-0 shadow-md shadow-amber-500/20 px-4 py-1 font-semibold">
                            Custom
                          </Badge>
                        </div>
                      )}
                      <CardHeader className="text-center pb-2">
                        <div className={`mx-auto p-3 rounded-lg ${style.iconBg} w-fit mb-4`}>
                          <Icon className={`w-6 h-6 ${style.iconColor}`} aria-hidden="true" />
                        </div>
                        <CardTitle className="text-xl">{plan.name}</CardTitle>
                        <CardDescription>{plan.description || ''}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex-1 flex flex-col space-y-6">
                        {/* Price with semantic markup */}
                        <div className="text-center">
                          <span className="sr-only">Price: </span>
                          <data value={price ?? 'custom'} className="text-5xl font-bold text-secondary-900 dark:text-secondary-100">
                            {displayPrice}
                          </data>
                          <span className="text-secondary-500 dark:text-secondary-300 block text-sm mt-1">
                            {periodText}
                          </span>
                          {!isCustom && isYearly && yearlyPrice && yearlyPrice > 0 && (
                            <span className="text-green-600 dark:text-green-400 text-sm font-medium">
                              ${yearlyPrice}/year (save ${(monthlyPrice ?? 0) * 12 - yearlyPrice})
                            </span>
                          )}
                        </div>

                        {/* Credit context */}
                        {isCustom ? (
                          <div className="text-center py-3 bg-gradient-to-r from-amber-50 to-amber-100/50 dark:from-amber-900/20 dark:to-amber-800/20 rounded-lg border border-amber-200/50 dark:border-amber-700/30">
                            <div className="font-semibold text-amber-700 dark:text-amber-300">
                              Custom Allocation
                            </div>
                            <div className="text-xs text-amber-600/80 dark:text-amber-400/80">
                              Tailored to your organization&apos;s needs
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-3 bg-secondary-50 dark:bg-secondary-700/30 rounded-lg">
                            <div className="font-semibold text-secondary-900 dark:text-secondary-100">
                              {creditsText} credits/month
                            </div>
                            <div className="text-xs text-secondary-500 dark:text-secondary-400">
                              ~{Math.round(plan.credits_monthly / 2).toLocaleString()} chatbot conversations/month
                            </div>
                          </div>
                        )}

                        <div className="space-y-4 flex-1" aria-label={`${plan.name} plan features`}>
                          {isCustom ? (
                            <>
                              {/* Enterprise features for custom pricing */}
                              <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Everything in Pro, plus:</p>
                              <ul className="space-y-2">
                                {[
                                  'Custom credit allocation',
                                  'Dedicated account manager',
                                  'Priority support (SLA)',
                                  'Custom integrations',
                                  'SSO & advanced security',
                                  'Onboarding & training',
                                ].map((feature) => (
                                  <li key={feature} className="flex items-start gap-3">
                                    <Check className="w-5 h-5 text-amber-500 dark:text-amber-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                                    <span className="text-sm text-secondary-700 dark:text-secondary-300">{feature}</span>
                                  </li>
                                ))}
                              </ul>
                            </>
                          ) : (
                            <>
                              {/* Credits and API keys */}
                              <ul className="space-y-2">
                                <li className="flex items-start gap-3">
                                  <Check className="w-5 h-5 text-green-500 dark:text-green-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                                  <span className="text-sm text-secondary-700 dark:text-secondary-300">{creditsText} credits/month</span>
                                </li>
                                <li className="flex items-start gap-3">
                                  <Check className="w-5 h-5 text-green-500 dark:text-green-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                                  <span className="text-sm text-secondary-700 dark:text-secondary-300">{apiKeysText} API keys</span>
                                </li>
                              </ul>

                              {/* Included Tools */}
                              {includedTools.length > 0 && (
                                <div>
                                  <p className="text-xs font-semibold text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-2">Included Tools</p>
                                  <ul className="space-y-2">
                                    {includedTools.map((tool) => {
                                      const ToolIcon = tool.icon;
                                      return (
                                        <li key={tool.key} className="flex items-start gap-3">
                                          <ToolIcon className="w-4 h-4 text-primary-500 dark:text-primary-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                                          <span className="text-sm text-secondary-700 dark:text-secondary-300">{tool.name}</span>
                                        </li>
                                      );
                                    })}
                                  </ul>
                                </div>
                              )}

                              {/* Other features */}
                              {otherFeatures.length > 0 && (
                                <ul className="space-y-2">
                                  {otherFeatures.map((feature) => (
                                    <li key={feature} className="flex items-start gap-3">
                                      <Check className="w-5 h-5 text-green-500 dark:text-green-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                                      <span className="text-sm text-secondary-700 dark:text-secondary-300">{feature}</span>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </>
                          )}
                        </div>

                        <div className="mt-auto space-y-2">
                          <Button
                            variant={style.ctaVariant}
                            className={`w-full focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-secondary-800 ${
                              (plan.is_featured || style.popular)
                                ? 'bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 dark:from-primary-500 dark:to-primary-400 dark:hover:from-primary-600 dark:hover:to-primary-500 shadow-lg shadow-primary-500/25 dark:shadow-primary-400/40 text-white font-semibold'
                                : plan.slug === 'enterprise'
                                  ? 'border-amber-400 dark:border-amber-500 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/30 font-medium'
                                  : plan.slug === 'base'
                                    ? 'bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-medium'
                                    : 'text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-secondary-100'
                            }`}
                            size="lg"
                            asChild
                          >
                            <Link href={plan.slug === 'enterprise' ? '/help?subject=enterprise' : `/signup?plan=${plan.slug}`}>{style.cta}</Link>
                          </Button>
                          {style.ctaSubtext && (
                            <p className="text-center text-xs text-secondary-500 dark:text-secondary-400">
                              {style.ctaSubtext}
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Compare All Features */}
              <div className="max-w-6xl mx-auto mt-12">
                <button
                  onClick={() => setShowComparison(!showComparison)}
                  className="flex items-center gap-2 mx-auto text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors"
                >
                  <span>{showComparison ? 'Hide' : 'Compare all'} features</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showComparison ? 'rotate-180' : ''}`} />
                </button>

                {showComparison && (
                  <div className="mt-8 overflow-x-auto">
                    {(() => {
                      const sortedPlans = sortPlansByDisplayOrder(plans);
                      const comparisonFeatures = buildComparisonFeatures(plans);

                      return (
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="border-b border-secondary-200 dark:border-secondary-700">
                              <th className="text-left py-4 px-4 font-semibold text-secondary-900 dark:text-secondary-100">Feature</th>
                              {sortedPlans.map(plan => {
                                const style = planStyles[plan.slug] || defaultPlanStyle;
                                const isFeatured = plan.is_featured || style.popular;
                                return (
                                  <th
                                    key={plan.slug}
                                    className={`text-center py-4 px-4 font-semibold ${
                                      isFeatured
                                        ? 'text-primary-600 dark:text-primary-400 bg-primary-50/50 dark:bg-primary-900/20'
                                        : plan.slug === 'enterprise'
                                          ? 'text-amber-600 dark:text-amber-400'
                                          : 'text-secondary-900 dark:text-secondary-100'
                                    }`}
                                  >
                                    {plan.name}
                                  </th>
                                );
                              })}
                            </tr>
                          </thead>
                          <tbody>
                            {comparisonFeatures.map((feature, i) => (
                              <tr
                                key={feature.name}
                                className={`border-b border-secondary-100 dark:border-secondary-800 ${i % 2 === 0 ? 'bg-secondary-50/50 dark:bg-secondary-800/30' : ''}`}
                              >
                                <td className="py-3 px-4 text-sm text-secondary-700 dark:text-secondary-300">{feature.name}</td>
                                {sortedPlans.map(plan => {
                                  const style = planStyles[plan.slug] || defaultPlanStyle;
                                  const isFeatured = plan.is_featured || style.popular;
                                  return (
                                    <td
                                      key={plan.slug}
                                      className={`py-3 px-4 text-center ${isFeatured ? 'bg-primary-50/30 dark:bg-primary-900/10' : ''}`}
                                    >
                                      <FeatureValue value={feature.values[plan.slug] ?? false} />
                                    </td>
                                  );
                                })}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      );
                    })()}
                  </div>
                )}
              </div>
            </>
          )}
        </section>

        {/* Testimonials */}
        <section className="container mx-auto px-4 pb-24">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">Loved by professionals worldwide</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.author}
                className="bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-600 rounded-xl p-6"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" aria-hidden="true" />
                  ))}
                </div>
                <blockquote className="text-secondary-700 dark:text-secondary-300 mb-4 text-sm">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className={`flex-shrink-0 w-10 h-10 bg-gradient-to-br ${testimonial.gradient} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                    {testimonial.initials}
                  </div>
                  <div>
                    <cite className="not-italic">
                      <strong className="text-sm text-secondary-900 dark:text-secondary-100 block">{testimonial.author}</strong>
                      <span className="text-xs text-secondary-500 dark:text-secondary-400">{testimonial.role}</span>
                    </cite>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Building2 className="w-3 h-3 text-secondary-400" aria-hidden="true" />
                      <span className="text-xs text-secondary-500 dark:text-secondary-400">{testimonial.company}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="container mx-auto px-4 pb-24">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4">
                <HelpCircle className="w-3 h-3 mr-1" aria-hidden="true" />
                FAQ
              </Badge>
              <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">Frequently Asked Questions</h2>
            </div>

            <div className="space-y-4" role="region" aria-label="Frequently Asked Questions">
              {faqs.map((faq) => (
                <FAQItem key={faq.question} question={faq.question} answer={faq.answer} />
              ))}
            </div>

            <div className="text-center mt-12">
              <p className="text-secondary-600 dark:text-secondary-300 mb-4">Still have questions?</p>
              <Button variant="outline" asChild>
                <Link href="/help">Contact Support</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 pb-16">
          <div className="max-w-3xl mx-auto text-center">
            <div className="rounded-3xl bg-gradient-to-br from-primary-700 to-primary-800 p-12 text-white shadow-xl">
              <h2 className="text-3xl font-bold mb-4">Build your first chatbot today</h2>
              <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
                Train it on your content and deploy it in minutes. Free plan available — no credit card required.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  variant="secondary"
                  className="bg-white text-primary-600 hover:bg-primary-50 px-8"
                  asChild
                >
                  <Link href="/signup">
                    Get Started Free
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                  asChild
                >
                  <Link href="/faq">See How It Works</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </PageBackground>
  );
}