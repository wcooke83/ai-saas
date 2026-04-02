'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/layout';
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
  Building2,
  ArrowRight,
  MessageSquareQuote,
} from 'lucide-react';
import type { SubscriptionPlan } from '@/types/billing';
import { isCustomPricingPlan, sortPlansByDisplayOrder } from '@/lib/billing/utils';

// ────────────────────────────────────────────────────────────────────────────
// Animation variants
// ────────────────────────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const fadeUpDramatic = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const staggerCards = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

// ────────────────────────────────────────────────────────────────────────────
// Plan styling configuration
// ────────────────────────────────────────────────────────────────────────────

const planStyles: Record<string, {
  icon: typeof Sparkles | typeof Zap | typeof Crown;
  accentColor: string;
  accentBg: string;
  accentBorder: string;
  checkColor: string;
  cta: string;
  ctaSubtext?: string;
  featured: boolean;
}> = {
  free: {
    icon: Sparkles,
    accentColor: 'text-secondary-500 dark:text-secondary-400',
    accentBg: 'bg-secondary-100 dark:bg-secondary-700',
    accentBorder: 'border-secondary-200 dark:border-secondary-700',
    checkColor: 'text-secondary-400 dark:text-secondary-500',
    cta: 'Create Free Chatbot',
    featured: false,
  },
  base: {
    icon: Sparkles,
    accentColor: 'text-emerald-600 dark:text-emerald-400',
    accentBg: 'bg-emerald-100 dark:bg-emerald-800/60',
    accentBorder: 'border-emerald-200 dark:border-emerald-600',
    checkColor: 'text-emerald-500 dark:text-emerald-400',
    cta: 'Get Base Plan',
    featured: false,
  },
  pro: {
    icon: Zap,
    accentColor: 'text-primary-600 dark:text-primary-400',
    accentBg: 'bg-primary-100 dark:bg-primary-800/60',
    accentBorder: 'border-primary-400 dark:border-primary-400',
    checkColor: 'text-primary-500 dark:text-primary-400',
    cta: 'Start Free Trial',
    ctaSubtext: 'No credit card required',
    featured: true,
  },
  enterprise: {
    icon: Crown,
    accentColor: 'text-amber-600 dark:text-amber-400',
    accentBg: 'bg-amber-100 dark:bg-amber-800/50',
    accentBorder: 'border-amber-300 dark:border-amber-500/70',
    checkColor: 'text-amber-500 dark:text-amber-400',
    cta: 'Talk to Sales',
    featured: false,
  },
};

const defaultPlanStyle = {
  icon: Zap,
  accentColor: 'text-primary-600 dark:text-primary-400',
  accentBg: 'bg-primary-100 dark:bg-primary-800/60',
  accentBorder: 'border-secondary-200 dark:border-secondary-600',
  checkColor: 'text-secondary-400 dark:text-secondary-500',
  cta: 'Get Started',
  featured: false,
};

// ────────────────────────────────────────────────────────────────────────────
// Data
// ────────────────────────────────────────────────────────────────────────────

const toolConfig: Record<string, { name: string }> = {
  custom_chatbots: { name: 'Custom Chatbots' },
};

const testimonials = [
  {
    quote: "We deployed a chatbot trained on our knowledge base in under an hour. It now handles about 70% of support inquiries on its own \u2014 without us touching it.",
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

const faqs = [
  {
    question: 'What are credits?',
    answer: 'Credits are used each time your chatbot answers a question. A short answer uses about 1 credit. A detailed, multi-paragraph response uses 2\u20133. A 10-message conversation typically uses 5\u201315 credits total. Adding knowledge sources does not consume credits.',
  },
  {
    question: 'Can I change plans anytime?',
    answer: 'Yes. Upgrade or downgrade anytime \u2014 changes take effect immediately, and we prorate the difference.',
  },
  {
    question: 'What happens if I run out of credits?',
    answer: 'Your chatbot pauses until credits are available. You can buy more credits instantly, turn on auto-topup so you never run out, or upgrade to a plan with a higher monthly allocation.',
  },
  {
    question: 'Does Pro have a free trial?',
    answer: 'Yes \u2014 14 days, full access, no credit card required.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'All major credit cards (Visa, Mastercard, Amex) and PayPal. Enterprise customers can also pay by invoice.',
  },
  {
    question: 'Can I get a refund?',
    answer: 'Yes. If you\u2019re not satisfied within 14 days of your purchase, contact support for a full refund.',
  },
  {
    question: 'What counts as a knowledge source?',
    answer: 'Anything your chatbot learns from: web pages, PDFs, Word documents, or plain text. You add the source, and VocUI reads and organizes the content so your chatbot can answer questions about it.',
  },
];

// ────────────────────────────────────────────────────────────────────────────
// Helper: build comparison features from plans
// ────────────────────────────────────────────────────────────────────────────

function buildComparisonFeatures(plans: SubscriptionPlan[]) {
  if (!plans.length) return [];

  const sortedPlans = sortPlansByDisplayOrder(plans);

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

  const allFeatureKeys = new Set<string>();
  sortedPlans.forEach(plan => {
    if (plan.features && typeof plan.features === 'object') {
      Object.keys(plan.features).forEach(key => allFeatureKeys.add(key));
    }
  });

  const toolKeys = Array.from(allFeatureKeys).filter(key => toolConfig[key]);
  toolKeys.forEach(key => {
    features.push({
      name: toolConfig[key].name,
      values: Object.fromEntries(
        sortedPlans.map(plan => {
          const featureValue = (plan.features as Record<string, unknown>)?.[key];
          if (featureValue === true) return [plan.slug, true];
          if (typeof featureValue === 'string') return [plan.slug, featureValue];
          return [plan.slug, false];
        })
      ),
    });
  });

  const nonToolKeys = Array.from(allFeatureKeys).filter(key => !toolConfig[key]);
  nonToolKeys.forEach(key => {
    features.push({
      name: featureDisplayNames[key] || key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      values: Object.fromEntries(
        sortedPlans.map(plan => {
          const featureValue = (plan.features as Record<string, unknown>)?.[key];
          if (featureValue === true) return [plan.slug, true];
          if (typeof featureValue === 'string') return [plan.slug, featureValue];
          return [plan.slug, false];
        })
      ),
    });
  });

  return features;
}

// ────────────────────────────────────────────────────────────────────────────
// Sub-components
// ────────────────────────────────────────────────────────────────────────────

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const id = `faq-${question.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <div className="border-b border-secondary-200 dark:border-secondary-700">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-5 text-left flex items-start justify-between gap-4 group"
        aria-expanded={isOpen}
        aria-controls={id}
      >
        <h3 className="font-semibold text-secondary-900 dark:text-secondary-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {question}
        </h3>
        <ChevronDown
          className={`w-5 h-5 text-secondary-400 flex-shrink-0 mt-0.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>
      <div
        id={id}
        className={`grid transition-all duration-200 ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
        aria-hidden={!isOpen}
        role="region"
      >
        <div className="overflow-hidden">
          <p className="pb-5 text-secondary-600 dark:text-secondary-300 leading-relaxed">
            {answer}
          </p>
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
  return <span className="text-sm font-medium text-secondary-700 dark:text-secondary-300">{value}</span>;
}

// ────────────────────────────────────────────────────────────────────────────
// Pricing card component — compact variant for hero integration
// ────────────────────────────────────────────────────────────────────────────

const MAX_HERO_BULLETS = 4;

function PricingCard({
  plan,
  isYearly,
}: {
  plan: SubscriptionPlan;
  isYearly: boolean;
}) {
  const style = planStyles[plan.slug] || defaultPlanStyle;
  const Icon = style.icon;
  const isFeatured = plan.is_featured || style.featured;
  const isCustom = isCustomPricingPlan(plan);

  const monthlyPrice = plan.price_monthly_cents / 100;
  const yearlyPrice = plan.price_yearly_cents ? plan.price_yearly_cents / 100 : null;
  const price = isCustom
    ? null
    : isYearly && yearlyPrice && yearlyPrice > 0
      ? Math.round(yearlyPrice / 12)
      : monthlyPrice;
  const displayPrice = isCustom ? 'Custom' : price === 0 ? '$0' : `$${price}`;
  const periodText = isCustom
    ? 'tailored to you'
    : monthlyPrice === 0
      ? 'free forever'
      : isYearly
        ? '/mo, billed yearly'
        : '/month';

  const creditsText = plan.credits_monthly === -1 ? 'Unlimited' : plan.credits_monthly.toLocaleString();
  const apiKeysText = plan.api_keys_limit === -1 ? 'Unlimited' : plan.api_keys_limit.toString();

  // Build feature list
  const planFeatures = plan.features && typeof plan.features === 'object'
    ? Object.entries(plan.features).filter(([, value]) => value === true || (typeof value === 'string' && value))
    : [];

  const includedTools = planFeatures
    .filter(([key]) => toolConfig[key])
    .map(([key, value]) => ({
      key,
      name: typeof value === 'string' ? `${toolConfig[key].name} (${value})` : toolConfig[key].name,
    }));

  const otherFeatures = planFeatures
    .filter(([key]) => !toolConfig[key])
    .map(([key]) => featureDisplayNames[key] || key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()));

  // Enterprise gets a curated feature list; others get the data-driven bullets
  const bullets: string[] = [];
  if (isCustom) {
    bullets.push('Custom credit allocation');
    bullets.push('Dedicated account manager');
    bullets.push('Priority support (SLA)');
    bullets.push('Custom integrations');
  } else {
    bullets.push(`${creditsText} credits/mo`);
    bullets.push(`${apiKeysText} API key${plan.api_keys_limit === 1 ? '' : 's'}`);
    includedTools.forEach(t => bullets.push(t.name));
    otherFeatures.forEach(f => bullets.push(f));
  }

  // Cap bullets for compact hero display
  const displayBullets = bullets.slice(0, MAX_HERO_BULLETS);

  const cardHref = isCustom
    ? '/help?subject=enterprise'
    : `/signup?plan=${plan.slug}${isYearly ? '&interval=yearly' : ''}`;

  return (
    <motion.div
      variants={fadeUp}
      className={`relative flex flex-col rounded-xl border transition-shadow duration-200 ${
        isFeatured
          ? `border-2 ${style.accentBorder} shadow-xl shadow-primary-500/10 dark:shadow-primary-400/20 bg-gradient-to-b from-primary-50/60 to-white dark:from-primary-900/30 dark:to-secondary-800 z-10 p-5`
          : `${style.accentBorder} bg-white dark:bg-secondary-800 hover:shadow-lg p-5`
      }`}
    >
      {/* Featured badge */}
      {isFeatured && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="bg-gradient-to-r from-primary-600 to-primary-500 dark:from-primary-500 dark:to-primary-400 text-white shadow-md shadow-primary-500/30 px-3 py-0.5 text-[10px] font-semibold">
            Most Popular
          </Badge>
        </div>
      )}

      {/* Plan name + icon */}
      <div className="flex items-center gap-2 mb-3">
        <div className={`p-1.5 rounded-md ${style.accentBg}`}>
          <Icon className={`w-3.5 h-3.5 ${style.accentColor}`} aria-hidden="true" />
        </div>
        <h3 className="text-sm font-semibold text-secondary-900 dark:text-secondary-100">
          {plan.name}
        </h3>
      </div>

      {/* Price display */}
      <div className="mb-3">
        <div className="flex items-baseline gap-1">
          <data
            value={price ?? 0}
            className="text-3xl font-bold tracking-tight text-secondary-900 dark:text-secondary-100"
          >
            {displayPrice}
          </data>
          <span className="text-secondary-500 dark:text-secondary-400 text-xs">
            {periodText}
          </span>
        </div>
        {!isCustom && isYearly && yearlyPrice && yearlyPrice > 0 && (
          <p className="mt-0.5 text-xs text-green-600 dark:text-green-400 font-medium">
            Save ${(monthlyPrice ?? 0) * 12 - yearlyPrice}/yr
          </p>
        )}
      </div>

      {/* Features list */}
      <div className="flex-1 mb-4" aria-label={`${plan.name} plan features`}>
        {isCustom && (
          <p className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-2">
            Everything in Pro, plus:
          </p>
        )}
        <ul className="space-y-1.5" role="list">
          {displayBullets.map(bullet => (
            <li key={bullet} className="flex items-start gap-2">
              <Check className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${style.checkColor}`} aria-hidden="true" />
              <span className="text-xs text-secondary-600 dark:text-secondary-400 leading-snug">{bullet}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA — pinned to bottom */}
      <div className="mt-auto">
        <Button
          variant={isFeatured ? 'default' : 'outline'}
          className={`w-full ${
            isFeatured
              ? 'bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 dark:from-primary-500 dark:to-primary-400 dark:hover:from-primary-600 dark:hover:to-primary-500 shadow-lg shadow-primary-500/25 dark:shadow-primary-400/40 text-white font-semibold'
              : plan.slug === 'enterprise'
                ? 'border-amber-400 dark:border-amber-500 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/30 font-medium'
                : plan.slug === 'base'
                  ? 'bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-medium border-0'
                  : ''
          }`}
          size="default"
          asChild
        >
          <Link href={cardHref}>
            {style.cta}
            {isFeatured && <ArrowRight className="w-3.5 h-3.5 ml-1.5" aria-hidden="true" />}
          </Link>
        </Button>
        {style.ctaSubtext && (
          <p className="text-center text-[10px] text-secondary-500 dark:text-secondary-400 mt-1.5">
            {style.ctaSubtext}
          </p>
        )}
      </div>
    </motion.div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Enterprise card — separate component, horizontal layout at lg
// ────────────────────────────────────────────────────────────────────────────


// ────────────────────────────────────────────────────────────────────────────
// Main component
// ────────────────────────────────────────────────────────────────────────────

export default function PricingClient({ plans }: { plans: SubscriptionPlan[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();

  const [isYearly, setIsYearly] = useState(() => {
    const billing = searchParams.get('billing');
    return billing ? billing === 'annual' : true;
  });

  function toggleBilling() {
    const next = !isYearly;
    setIsYearly(next);
    const params = new URLSearchParams(searchParams.toString());
    params.set('billing', next ? 'annual' : 'monthly');
    router.replace(`?${params.toString()}`, { scroll: false });
  }

  const sortedPlans = sortPlansByDisplayOrder(plans);
  const allPlans = sortedPlans;

  // Average savings for annual billing
  const paidPlans = plans.filter(p => p.price_monthly_cents > 0 && p.price_yearly_cents && p.price_yearly_cents > 0);
  const avgSavings = paidPlans.length > 0
    ? Math.round(
        paidPlans.reduce((sum, p) => {
          const monthlyTotal = p.price_monthly_cents * 12;
          const yearly = p.price_yearly_cents!;
          return sum + ((monthlyTotal - yearly) / monthlyTotal) * 100;
        }, 0) / paidPlans.length
      )
    : 0;

  const comparisonFeatures = buildComparisonFeatures(plans);

  return (
    <PageBackground>
      <Header secondaryCta={{ label: 'Sign In', href: '/login' }} />

      <main id="main-content">

        {/* ──────────────────────────────────────────────────────────────── */}
        {/* SECTION 1: Hero with integrated pricing cards                  */}
        {/* Full-viewport height. Left col: copy + billing toggle + trust. */}
        {/* Right col: 3 compact pricing cards in a tight grid.            */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <section
          id="pricing"
          className="relative min-h-[calc(100dvh-4rem)] flex items-center overflow-hidden"
        >
          <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid lg:grid-cols-12 gap-10 xl:gap-16 items-center w-full">

              {/* Left column — copy, toggle, trust */}
              <motion.div
                className="lg:col-span-5 flex flex-col items-start text-left"
                initial={prefersReducedMotion ? false : 'hidden'}
                animate="visible"
                variants={stagger}
              >
                {/* Eyebrow */}
                <motion.p
                  variants={fadeUp}
                  className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-500 dark:text-primary-400 mb-5"
                >
                  Pricing
                </motion.p>

                {/* H1 */}
                <motion.h1
                  variants={fadeUp}
                  className="text-5xl md:text-6xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-secondary-900 dark:text-secondary-100 leading-[1.08] mb-5"
                >
                  One chatbot.{' '}
                  <span className="text-primary-500">Your entire knowledge base.</span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                  variants={fadeUp}
                  className="text-lg text-secondary-600 dark:text-secondary-400 leading-relaxed mb-8 max-w-md"
                >
                  Pick a plan that fits how many questions your chatbot handles.
                </motion.p>

                {/* Billing toggle */}
                <motion.div variants={fadeUp} className="mb-8">
                  <div className="inline-flex items-center gap-3 bg-secondary-100 dark:bg-secondary-800 rounded-full px-1.5 py-1.5">
                    <button
                      onClick={() => { if (isYearly) toggleBilling(); }}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                        !isYearly
                          ? 'bg-white dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100 shadow-sm'
                          : 'text-secondary-500 dark:text-secondary-400 hover:text-secondary-700 dark:hover:text-secondary-300'
                      }`}
                      aria-pressed={!isYearly}
                    >
                      Monthly
                    </button>
                    <button
                      onClick={() => { if (!isYearly) toggleBilling(); }}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                        isYearly
                          ? 'bg-white dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100 shadow-sm'
                          : 'text-secondary-500 dark:text-secondary-400 hover:text-secondary-700 dark:hover:text-secondary-300'
                      }`}
                      aria-pressed={isYearly}
                    >
                      Annual
                      {avgSavings > 0 && (
                        <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                          -{avgSavings}%
                        </span>
                      )}
                    </button>
                  </div>
                </motion.div>

                {/* Trust signals */}
                <motion.div
                  variants={fadeUp}
                  className="flex flex-col gap-2 text-sm text-secondary-500 dark:text-secondary-400"
                >
                  <span>Free plan, no credit card required</span>
                  <span>Switch or cancel anytime</span>
                  <span>14-day money-back guarantee</span>
                </motion.div>
              </motion.div>

              {/* Right column — 3 pricing cards */}
              <motion.div
                className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4 items-start"
                variants={staggerCards}
                initial={prefersReducedMotion ? false : 'hidden'}
                animate="visible"
              >
                {allPlans.map(plan => (
                  <PricingCard
                    key={plan.id}
                    plan={plan}
                    isYearly={isYearly}
                  />
                ))}
              </motion.div>

            </div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2 text-secondary-400 dark:text-secondary-600"
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            aria-hidden="true"
          >
            <div className="w-px h-12 bg-gradient-to-b from-transparent to-secondary-300 dark:to-secondary-700" />
          </motion.div>
        </section>

        {/* ──────────────────────────────────────────────────────────────── */}
        {/* SECTION 3: Social proof / testimonials                         */}
        {/* Full-bleed dark section. Featured pull quote on left,          */}
        {/* two supporting quotes on right with border-left accent.        */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <section className="w-full bg-primary-950 py-24 lg:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={stagger}
              initial={prefersReducedMotion ? false : 'hidden'}
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
            >
              <motion.p
                variants={fadeUp}
                className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-400 mb-10 lg:mb-14"
              >
                Teams using VocUI
              </motion.p>

              <div className="grid lg:grid-cols-12 gap-10 lg:gap-12">
                {/* Featured testimonial */}
                <motion.div variants={fadeUpDramatic} className="lg:col-span-7">
                  <blockquote>
                    <MessageSquareQuote
                      className="w-10 h-10 text-primary-500/40 mb-4"
                      aria-hidden="true"
                    />
                    <p className="text-2xl lg:text-3xl font-medium text-white leading-snug mb-8">
                      {testimonials[0].quote}
                    </p>
                    <footer className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonials[0].gradient} flex items-center justify-center text-white font-bold text-sm`}
                        aria-hidden="true"
                      >
                        {testimonials[0].initials}
                      </div>
                      <cite className="not-italic">
                        <strong className="text-white block text-sm">{testimonials[0].author}</strong>
                        <span className="text-primary-200/70 text-sm">
                          {testimonials[0].role}, {testimonials[0].company}
                        </span>
                      </cite>
                    </footer>
                  </blockquote>
                </motion.div>

                {/* Supporting testimonials */}
                <div className="lg:col-span-5 flex flex-col gap-8 lg:gap-10 lg:justify-center">
                  {testimonials.slice(1).map((t) => (
                    <motion.blockquote
                      key={t.author}
                      variants={fadeUp}
                      className="border-l-2 border-primary-700 pl-6"
                    >
                      <p className="text-primary-100/80 leading-relaxed mb-4">
                        &ldquo;{t.quote}&rdquo;
                      </p>
                      <footer className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white font-bold text-xs`}
                          aria-hidden="true"
                        >
                          {t.initials}
                        </div>
                        <cite className="not-italic">
                          <strong className="text-white text-sm block">{t.author}</strong>
                          <span className="text-primary-200/60 text-xs flex items-center gap-1">
                            <Building2 className="w-3 h-3" aria-hidden="true" />
                            {t.role}, {t.company}
                          </span>
                        </cite>
                      </footer>
                    </motion.blockquote>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────────── */}
        {/* SECTION 4: Feature comparison table                            */}
        {/* Left-aligned header. All 4 plans as columns. Pro highlighted.  */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <motion.div
            variants={stagger}
            initial={prefersReducedMotion ? false : 'hidden'}
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            <motion.div variants={fadeUp} className="mb-12 max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-500 dark:text-primary-400 mb-4">
                Compare plans
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-secondary-900 dark:text-secondary-100">
                See exactly what each plan includes
              </h2>
            </motion.div>

            <motion.div variants={fadeUp} className="max-w-5xl overflow-x-auto">
              <table className="w-full text-left" role="table">
                <thead>
                  <tr className="border-b-2 border-secondary-200 dark:border-secondary-700">
                    <th
                      className="py-4 pr-4 text-sm font-semibold text-secondary-900 dark:text-secondary-100 w-1/5"
                      scope="col"
                    >
                      Feature
                    </th>
                    {sortedPlans.map(plan => {
                      const pStyle = planStyles[plan.slug] || defaultPlanStyle;
                      const isFeatured = plan.is_featured || pStyle.featured;
                      return (
                        <th
                          key={plan.slug}
                          scope="col"
                          className={`py-4 px-4 text-center text-sm font-semibold ${
                            isFeatured
                              ? 'text-primary-600 dark:text-primary-400 bg-primary-50/60 dark:bg-primary-900/20 rounded-t-lg'
                              : plan.slug === 'enterprise'
                                ? 'text-amber-600 dark:text-amber-400'
                                : 'text-secondary-900 dark:text-secondary-100'
                          }`}
                        >
                          {plan.name}
                          {isFeatured && (
                            <Badge className="ml-2 text-[10px] bg-primary-500 text-white py-0 px-1.5">
                              Popular
                            </Badge>
                          )}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((feature, i) => (
                    <tr
                      key={feature.name}
                      className={`border-b border-secondary-100 dark:border-secondary-800 ${
                        i % 2 === 0 ? 'bg-secondary-50/40 dark:bg-secondary-800/20' : ''
                      }`}
                    >
                      <td className="py-3.5 pr-4 text-sm text-secondary-700 dark:text-secondary-300">
                        {feature.name}
                      </td>
                      {sortedPlans.map(plan => {
                        const pStyle = planStyles[plan.slug] || defaultPlanStyle;
                        const isFeatured = plan.is_featured || pStyle.featured;
                        return (
                          <td
                            key={plan.slug}
                            className={`py-3.5 px-4 text-center ${
                              isFeatured ? 'bg-primary-50/30 dark:bg-primary-900/10' : ''
                            }`}
                          >
                            <FeatureValue value={feature.values[plan.slug] ?? false} />
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </motion.div>
        </section>

        {/* ──────────────────────────────────────────────────────────────── */}
        {/* SECTION 5: FAQ                                                 */}
        {/* Asymmetric 4/8 split. Sticky heading + CTA left, accordion    */}
        {/* right. Updated copy.                                           */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <section className="w-full bg-secondary-50 dark:bg-secondary-900 py-20 lg:py-28">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="grid lg:grid-cols-12 gap-10 lg:gap-16 max-w-5xl mx-auto"
              variants={stagger}
              initial={prefersReducedMotion ? false : 'hidden'}
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
            >
              {/* Left column: heading + support CTA */}
              <motion.div variants={fadeUp} className="lg:col-span-4 lg:sticky lg:top-28 lg:self-start">
                <div className="flex items-center gap-2 mb-4">
                  <HelpCircle className="w-5 h-5 text-primary-500 dark:text-primary-400" aria-hidden="true" />
                  <span className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-500 dark:text-primary-400">
                    FAQ
                  </span>
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-secondary-900 dark:text-secondary-100 mb-4">
                  Frequently asked questions
                </h2>
                <p className="text-secondary-600 dark:text-secondary-400 leading-relaxed mb-6">
                  Can&apos;t find what you&apos;re looking for? Reach out and we&apos;ll help.
                </p>
                <Button variant="outline" asChild>
                  <Link href="/help">Contact Support</Link>
                </Button>
              </motion.div>

              {/* Right column: accordion */}
              <motion.div
                variants={fadeUp}
                className="lg:col-span-8"
                role="region"
                aria-label="Frequently Asked Questions"
              >
                {faqs.map(faq => (
                  <FAQItem key={faq.question} question={faq.question} answer={faq.answer} />
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────────── */}
        {/* SECTION 6: Bottom CTA                                          */}
        {/* Full-bleed gradient. Acknowledges the user's journey.          */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <section
          className="w-full py-24 lg:py-32"
          style={{
            background: 'linear-gradient(135deg, rgb(2,132,199) 0%, rgb(8,47,73) 100%)',
          }}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="max-w-2xl mx-auto text-center"
              variants={stagger}
              initial={prefersReducedMotion ? false : 'hidden'}
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
            >
              <motion.h2
                variants={fadeUpDramatic}
                className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-6"
              >
                You&apos;ve seen the plans. Pick one and build.
              </motion.h2>
              <motion.p
                variants={fadeUp}
                className="text-lg text-primary-200/80 mb-10 leading-relaxed max-w-lg mx-auto"
              >
                Your first chatbot takes about 5 minutes. Start free &mdash; upgrade when your chatbot outgrows it.
              </motion.p>
              <motion.div
                variants={fadeUp}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Button
                  size="xl"
                  className="bg-white text-primary-700 hover:bg-primary-50 font-semibold shadow-lg shadow-black/10"
                  asChild
                >
                  <Link href="/signup">
                    Create Free Chatbot
                    <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
                  </Link>
                </Button>
                <Button
                  size="xl"
                  variant="outline-light"
                  className="font-medium"
                  asChild
                >
                  <Link href="#pricing">Compare Plans</Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>

      </main>

      <Footer />
    </PageBackground>
  );
}
