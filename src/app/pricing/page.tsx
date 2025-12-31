'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ThemeToggleSimple } from '@/components/ui/theme-toggle';
import {
  Check,
  Sparkles,
  Zap,
  Crown,
  ArrowLeft,
  HelpCircle,
  ChevronDown,
  Shield,
  Users,
  Star,
} from 'lucide-react';

const plans = [
  {
    name: 'Free',
    description: 'Perfect for trying out our tools',
    monthlyPrice: 0,
    yearlyPrice: 0,
    period: 'forever',
    icon: Sparkles,
    iconBg: 'bg-secondary-100 dark:bg-secondary-700',
    iconColor: 'text-secondary-600 dark:text-secondary-200',
    cardClass: 'border-secondary-200 dark:border-secondary-600 bg-white dark:bg-secondary-800',
    credits: '100',
    creditContext: '~50 emails or ~20 proposals',
    features: [
      '100 credits/month',
      '2 API keys',
      'Email Writer tool',
      'Basic proposal templates',
      'Community support',
    ],
    cta: 'Try Free',
    ctaVariant: 'ghost' as const,
    href: '/signup',
    popular: false,
  },
  {
    name: 'Pro',
    description: 'For professionals and small teams',
    monthlyPrice: 29,
    yearlyPrice: 278,
    period: '/month',
    icon: Zap,
    iconBg: 'bg-primary-100 dark:bg-primary-800/60',
    iconColor: 'text-primary-600 dark:text-primary-400',
    cardClass: 'border-2 border-primary-400 dark:border-primary-400 shadow-xl shadow-primary-500/20 dark:shadow-primary-400/40 bg-gradient-to-b from-primary-50/50 to-white dark:from-primary-900/40 dark:to-secondary-800 ring-1 ring-primary-500/20 dark:ring-primary-400/50',
    credits: '1,000',
    creditContext: '~500 emails or ~200 proposals',
    features: [
      '1,000 credits/month',
      'Unlimited API keys',
      'All tools access',
      'Advanced proposal templates',
      'Priority email support',
      'Export to PDF/DOCX',
      'Custom branding',
    ],
    cta: 'Start 14-Day Free Trial',
    ctaSubtext: 'No credit card required',
    ctaVariant: 'default' as const,
    href: '/signup?plan=pro',
    popular: true,
  },
  {
    name: 'Enterprise',
    description: 'For large teams with custom needs',
    monthlyPrice: 99,
    yearlyPrice: 950,
    period: '/month',
    icon: Crown,
    iconBg: 'bg-amber-100 dark:bg-amber-800/50',
    iconColor: 'text-amber-600 dark:text-amber-400',
    cardClass: 'border-amber-300 dark:border-amber-500/70 bg-gradient-to-br from-white to-amber-50/30 dark:from-secondary-800 dark:to-amber-900/20 ring-1 ring-amber-200/50 dark:ring-amber-500/30',
    credits: 'Unlimited',
    creditContext: 'No limits on usage',
    features: [
      'Unlimited credits',
      'Unlimited API keys',
      'All tools + early access',
      'Custom integrations',
      'Dedicated account manager',
      'SSO & advanced security',
      'SLA guarantee',
      'Custom training',
    ],
    cta: 'Talk to Sales',
    ctaVariant: 'outline' as const,
    href: '/help?subject=enterprise',
    popular: false,
  },
];

const faqs = [
  {
    question: 'What are credits?',
    answer: 'Credits are used each time you generate content with our AI tools. One email generation uses 1 credit, and one proposal generation uses 2-5 credits depending on length.',
  },
  {
    question: 'Can I change plans anytime?',
    answer: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we\'ll prorate any differences.',
  },
  {
    question: 'What happens if I run out of credits?',
    answer: 'You\'ll need to wait until your credits reset at the start of your billing period, or upgrade to a higher plan for more credits.',
  },
  {
    question: 'Is there a free trial for Pro?',
    answer: 'Yes! Start a 14-day free trial of Pro with no credit card required. You\'ll have full access to all Pro features.',
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
          className={`w-5 h-5 text-secondary-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ${isOpen ? 'max-h-96' : 'max-h-0'}`}
        aria-hidden={!isOpen}
      >
        <p className="px-6 pb-6 text-secondary-600 dark:text-secondary-300">{answer}</p>
      </div>
    </div>
  );
}

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary-50 to-white dark:from-secondary-950 dark:to-secondary-900">
      {/* Skip Link */}
      <a
        href="#pricing"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary-600 focus:text-white focus:rounded"
      >
        Skip to pricing
      </a>

      {/* Header */}
      <header className="border-b border-secondary-200 dark:border-secondary-700 bg-white/80 dark:bg-secondary-900/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-secondary-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Back to Home
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggleSimple />
            <Link
              href="/login"
              className="text-sm text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-secondary-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded px-2 py-1"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      <main id="main">
        {/* Hero */}
        <section className="container mx-auto px-4 py-16 text-center">
          <Badge className="mb-4">Pricing</Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4 text-secondary-900 dark:text-secondary-100">
            Simple, transparent pricing
          </h1>
          <p className="text-lg text-secondary-600 dark:text-secondary-300 max-w-2xl mx-auto mb-8">
            Choose the plan that&apos;s right for you. All plans include access to our core AI tools.
            Upgrade or downgrade anytime.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className={`text-sm font-medium ${!isYearly ? 'text-secondary-900 dark:text-secondary-100' : 'text-secondary-500 dark:text-secondary-400'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className={`relative w-14 h-7 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                isYearly ? 'bg-primary-600' : 'bg-secondary-300 dark:bg-secondary-600'
              }`}
              role="switch"
              aria-checked={isYearly}
              aria-label="Toggle annual billing"
            >
              <span
                className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  isYearly ? 'translate-x-7' : ''
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
        <section className="container mx-auto px-4 pb-8">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-secondary-600 dark:text-secondary-400">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" aria-hidden="true" />
              <span>Join 10,000+ professionals</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500" aria-hidden="true" />
              <span>4.9/5 average rating</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-600 dark:text-green-400" aria-hidden="true" />
              <span>30-day money-back guarantee</span>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section id="pricing" className="container mx-auto px-4 pb-16">
          <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
            {plans.map((plan) => {
              const Icon = plan.icon;
              const price = isYearly && plan.yearlyPrice > 0
                ? Math.round(plan.yearlyPrice / 12)
                : plan.monthlyPrice;
              const displayPrice = price === 0 ? '$0' : `$${price}`;
              const periodText = plan.monthlyPrice === 0 ? 'forever' : isYearly ? '/mo (billed yearly)' : '/month';

              return (
                <Card
                  key={plan.name}
                  className={`relative flex flex-col transition-all duration-200 ${plan.cardClass} ${plan.popular ? 'md:scale-105' : 'hover:border-secondary-300 dark:hover:border-secondary-600'}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-primary-600 to-primary-500 dark:from-primary-500 dark:to-primary-400 text-white shadow-md shadow-primary-500/30 px-4 py-1 font-semibold">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pb-2">
                    <div className={`mx-auto p-3 rounded-lg ${plan.iconBg} w-fit mb-4`}>
                      <Icon className={`w-6 h-6 ${plan.iconColor}`} aria-hidden="true" />
                    </div>
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col space-y-6">
                    {/* Price with semantic markup */}
                    <div className="text-center">
                      <span className="sr-only">Price: </span>
                      <data value={price} className="text-5xl font-bold text-secondary-900 dark:text-secondary-100">
                        {displayPrice}
                      </data>
                      <span className="text-secondary-500 dark:text-secondary-300 block text-sm mt-1">
                        {periodText}
                      </span>
                      {isYearly && plan.yearlyPrice > 0 && (
                        <span className="text-green-600 dark:text-green-400 text-sm font-medium">
                          ${plan.yearlyPrice}/year (save ${plan.monthlyPrice * 12 - plan.yearlyPrice})
                        </span>
                      )}
                    </div>

                    {/* Credit context */}
                    <div className="text-center py-3 bg-secondary-50 dark:bg-secondary-700/30 rounded-lg">
                      <div className="font-semibold text-secondary-900 dark:text-secondary-100">
                        {plan.credits} credits/month
                      </div>
                      <div className="text-xs text-secondary-500 dark:text-secondary-400">
                        {plan.creditContext}
                      </div>
                    </div>

                    <ul className="space-y-3 flex-1" aria-label={`${plan.name} plan features`}>
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-green-500 dark:text-green-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                          <span className="text-sm text-secondary-700 dark:text-secondary-300">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-auto space-y-2">
                      <Button
                        variant={plan.ctaVariant}
                        className={`w-full focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-secondary-800 ${
                          plan.popular
                            ? 'bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 dark:from-primary-500 dark:to-primary-400 dark:hover:from-primary-600 dark:hover:to-primary-500 shadow-lg shadow-primary-500/25 dark:shadow-primary-400/40 text-white font-semibold'
                            : plan.name === 'Enterprise'
                              ? 'border-amber-400 dark:border-amber-500 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/30 font-medium'
                              : 'text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-secondary-100'
                        }`}
                        size="lg"
                        asChild
                      >
                        <Link href={plan.href}>{plan.cta}</Link>
                      </Button>
                      {plan.ctaSubtext && (
                        <p className="text-center text-xs text-secondary-500 dark:text-secondary-400">
                          {plan.ctaSubtext}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Social Proof / Testimonial */}
        <section className="container mx-auto px-4 pb-16">
          <div className="max-w-3xl mx-auto bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-600 rounded-xl p-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                JD
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" aria-hidden="true" />
                  ))}
                </div>
                <blockquote className="text-secondary-700 dark:text-secondary-300 mb-3">
                  &ldquo;AI SaaS Tools has transformed how I write proposals. What used to take me 2-3 hours now takes 15 minutes. The Pro plan paid for itself in the first week.&rdquo;
                </blockquote>
                <cite className="text-sm text-secondary-500 dark:text-secondary-400 not-italic">
                  <strong className="text-secondary-900 dark:text-secondary-100">James Davidson</strong>
                  <span className="mx-2">&middot;</span>
                  <span>Marketing Consultant</span>
                </cite>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="container mx-auto px-4 py-16 border-t border-secondary-200 dark:border-secondary-700 bg-secondary-50/50 dark:bg-secondary-900/50">
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
      </main>

      {/* Footer */}
      <footer className="border-t border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-900 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-secondary-500 dark:text-secondary-300">
            &copy; {new Date().getFullYear()} AI SaaS Tools. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
