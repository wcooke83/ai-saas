import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { H1 } from '@/components/ui/heading';
import { Header } from '@/components/layout';
import { Footer } from '@/components/ui/footer';
import { PageBackground } from '@/components/ui/page-background';
import {
  ArrowRight,
  CheckCircle2,
  ShoppingCart,
  Inbox,
  Clock,
  MessageSquare,
  Package,
  RotateCcw,
  Megaphone,
  Globe,
  AlertTriangle,
  Shirt,
  Cpu,
  Sparkles,
  Box,
} from 'lucide-react';

// ─── Metadata ──────────────────────────────────────────────────────────────────

export function generateMetadata(): Metadata {
  return {
    title: 'AI Chatbot for E-commerce | Automate Support & Boost Conversions | VocUI',
    description:
      'Handle order FAQs, returns, product questions, and shipping inquiries automatically. Reduce support volume and increase conversions with an AI chatbot trained on your store.',
    keywords: [
      'AI chatbot for ecommerce',
      'ecommerce support chatbot',
      'product FAQ chatbot',
      'automated customer support',
      'reduce support tickets',
    ],
    openGraph: {
      title: 'AI Chatbot for E-commerce | Automate Support & Boost Conversions | VocUI',
      description:
        'Handle order FAQs, returns, product questions, and shipping inquiries automatically. Reduce support volume and increase conversions with an AI chatbot trained on your store.',
      url: 'https://vocui.com/chatbot-for-ecommerce',
      siteName: 'VocUI',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'AI Chatbot for E-commerce | Automate Support & Boost Conversions | VocUI',
      description:
        'Handle order FAQs, returns, product questions, and shipping inquiries automatically. Reduce support volume and increase conversions with an AI chatbot trained on your store.',
    },
    alternates: {
      canonical: 'https://vocui.com/chatbot-for-ecommerce',
    },
    robots: { index: true, follow: true },
  };
}

// ─── Structured Data ───────────────────────────────────────────────────────────

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'VocUI — AI Chatbot for E-commerce',
  applicationCategory: 'ShoppingApplication',
  operatingSystem: 'Web',
  description:
    'AI chatbot platform for e-commerce. Handle pre-purchase questions, order FAQs, returns, and shipping inquiries automatically — converting more visitors and cutting support volume.',
  url: 'https://vocui.com/chatbot-for-ecommerce',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

// ─── Data ──────────────────────────────────────────────────────────────────────

const trustSignals = [
  'Handles pre-purchase questions 24/7',
  'Reduces support ticket volume',
  'Keeps buyers moving toward checkout',
];

const painPoints = [
  {
    icon: ShoppingCart,
    title: 'A question before checkout is a sale waiting to happen',
    heading: 'Pre-purchase hesitation',
    body: "Sizing questions, shipping timelines, return policies, material specs — customers who can't get instant answers don't wait. They abandon and go to a competitor who answers faster.",
  },
  {
    icon: Inbox,
    title: 'Order status and returns FAQs fill your inbox every day',
    heading: 'Support overload',
    body: '"Where is my order?" "How do I return this?" "Do you ship to X?" — your support team answers these hundreds of times a week. It\'s repetitive, it\'s expensive, and it doesn\'t have to be manual.',
  },
  {
    icon: Clock,
    title: 'Most online shopping happens outside business hours',
    heading: 'After-hours gaps',
    body: "Your store is open 24/7. Your support team isn't. Customers who can't get answers at 10pm don't always come back in the morning.",
  },
];

const steps = [
  {
    step: '01',
    title: 'Train on your store content',
    description:
      'Upload your product descriptions, sizing guides, shipping policies, return FAQs, and any support documentation. Your chatbot learns your catalogue, not generic e-commerce answers.',
  },
  {
    step: '02',
    title: 'Customize for your brand',
    description:
      "Set your chatbot's tone to match your brand voice. Configure product recommendation prompts, upsell triggers, and escalation rules for complex issues.",
  },
  {
    step: '03',
    title: 'Deploy on your storefront',
    description:
      'Embed with one line of code — works with any website or e-commerce platform. Your chatbot is live on every product page and checkout flow.',
  },
];

const features = [
  {
    icon: MessageSquare,
    name: 'Pre-purchase Q&A',
    description:
      'Answer sizing, materials, compatibility, and product questions instantly — keeping buyers on the path to purchase.',
  },
  {
    icon: Package,
    name: 'Order & shipping FAQs',
    description:
      'Handle "where is my order?", delivery timelines, and tracking questions from your policies — without touching your inbox.',
  },
  {
    icon: RotateCcw,
    name: 'Returns & refunds',
    description:
      'Explain your return policy, initiate return requests, and route complex cases to your support team automatically.',
  },
  {
    icon: Megaphone,
    name: 'Proactive engagement',
    description:
      'Trigger messages on high-exit pages: cart abandonment, checkout hesitation, or long time-on-product-page.',
  },
  {
    icon: Globe,
    name: 'Multi-language support',
    description:
      'Your chatbot responds in the language your customer is writing in — serve international customers without extra setup.',
  },
  {
    icon: AlertTriangle,
    name: 'Sentiment-aware escalation',
    description:
      'Detect frustrated customers automatically. Escalate high-risk conversations to a human agent before they become chargebacks or bad reviews.',
  },
];

const testimonials = [
  {
    quote:
      'Response time dropped from 4 hours to 11 seconds. That alone moved our CSAT score by 9 points.',
    name: 'Marcus T.',
    role: 'Head of Customer Experience, DTC Brand',
  },
];

const verticals = [
  {
    icon: Shirt,
    title: 'Fashion & Apparel',
    description:
      'Handle sizing guides, material questions, and return FAQs — reducing pre-purchase friction and post-purchase support.',
  },
  {
    icon: Cpu,
    title: 'Electronics & Tech',
    description:
      'Answer compatibility questions, spec comparisons, and warranty FAQs before a customer abandons for a competitor.',
  },
  {
    icon: Sparkles,
    title: 'Health & Beauty',
    description:
      'Answer ingredient questions, usage guides, and subscription FAQs automatically — 24/7.',
  },
  {
    icon: Box,
    title: 'Subscription Boxes & DTC Brands',
    description:
      'Handle billing questions, subscription changes, and product FAQs without growing your support team.',
  },
];

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ChatbotForEcommercePage() {
  return (
    <PageBackground>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Header />

      <main id="main-content">

        {/* ── Hero ────────────────────────────────────────────────────────────── */}
        <section className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center container mx-auto px-4 py-16 text-center">
          <Badge className="mb-6">AI Chatbot for E-commerce</Badge>

          <H1 className="max-w-4xl mb-6">
            Your customers have questions before they buy.{' '}
            <span className="text-primary-500">Answer them — before they leave.</span>
          </H1>

          <p className="mx-auto max-w-2xl text-lg text-secondary-600 dark:text-secondary-400 mb-10">
            VocUI trains on your product catalogue, policies, and FAQs to handle pre-purchase
            questions, order inquiries, and returns automatically — converting more visitors
            and cutting support volume.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="xl" asChild>
              <Link href="/signup">
                Build Your E-commerce Chatbot Free
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button size="xl" variant="outline" asChild>
              <Link href="/pricing">See Pricing</Link>
            </Button>
          </div>

          <p className="text-sm text-secondary-500 dark:text-secondary-400">
            Free plan available &middot; No credit card required &middot; Works with any website
          </p>
        </section>

        {/* ── Trust Bar ───────────────────────────────────────────────────────── */}
        <section className="border-y border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-800/50 py-6">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
              {trustSignals.map((signal) => (
                <div key={signal} className="flex items-center gap-2 text-sm text-secondary-600 dark:text-secondary-400">
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" aria-hidden="true" />
                  <span>{signal}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Problem Section ─────────────────────────────────────────────────── */}
        <section className="container mx-auto px-4 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">The e-commerce support problem</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              Unanswered questions are abandoned carts
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              Every question your store can&apos;t answer instantly is a sale that doesn&apos;t happen.
              The good news: most of these questions are predictable.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
            {painPoints.map((p) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.heading}
                  className="bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-xl p-6 hover:border-primary-200 dark:hover:border-primary-700 transition-colors"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 dark:bg-red-900/20 mb-4">
                    <Icon className="h-5 w-5 text-red-500" aria-hidden="true" />
                  </div>
                  <p className="text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wide mb-2">
                    {p.title}
                  </p>
                  <h3 className="font-semibold text-secondary-900 dark:text-secondary-100 mb-2">{p.heading}</h3>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400 leading-relaxed">{p.body}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── How It Works ────────────────────────────────────────────────────── */}
        <section id="how-it-works" className="bg-secondary-50 dark:bg-secondary-800/30 py-24">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <Badge variant="outline" className="mb-4">How it works</Badge>
              <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100">
                From your product catalogue to a live support chatbot in under an hour
              </h2>
            </div>

            <div className="grid gap-10 md:grid-cols-3 max-w-5xl mx-auto relative">
              {/* Connector line — desktop only */}
              <div
                className="hidden md:block absolute top-8 left-[calc(16.67%+1.5rem)] right-[calc(16.67%+1.5rem)] h-px bg-secondary-200 dark:bg-secondary-700"
                aria-hidden="true"
              />

              {steps.map((s) => (
                <div key={s.step} className="relative text-center flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-primary-500 text-white font-bold text-lg flex items-center justify-center mb-6 z-10 shadow-lg shadow-primary-500/25">
                    {s.step}
                  </div>
                  <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-3">
                    {s.title}
                  </h3>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400 leading-relaxed max-w-xs">
                    {s.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="text-center mt-14">
              <Button size="xl" asChild>
                <Link href="/signup">
                  Build Your E-commerce Chatbot Free
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* ── Features ────────────────────────────────────────────────────────── */}
        <section className="container mx-auto px-4 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">Built for e-commerce</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              Everything your store needs to support customers automatically
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              Not just a FAQ widget. A full support layer that converts browsers and deflects
              tickets — without hiring more agents.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.name}
                  className="bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-xl p-6 hover:border-primary-200 dark:hover:border-primary-700 transition-colors"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-900/50 mb-4">
                    <Icon className="h-4 w-4 text-primary-500" aria-hidden="true" />
                  </div>
                  <h3 className="font-semibold text-secondary-900 dark:text-secondary-100 mb-1">{f.name}</h3>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400 leading-relaxed">{f.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Testimonials ────────────────────────────────────────────────────── */}
        <section className="bg-secondary-50 dark:bg-secondary-800/30 py-24">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <Badge variant="outline" className="mb-4">What customers say</Badge>
              <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100">
                Stores that cut support volume and kept more customers
              </h2>
            </div>

            <div className="max-w-2xl mx-auto">
              {testimonials.map((t) => (
                <div
                  key={t.name}
                  className="bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-xl p-10 hover:border-primary-200 dark:hover:border-primary-700 transition-colors text-center"
                >
                  <p className="text-xl text-secondary-700 dark:text-secondary-300 leading-relaxed mb-6 italic font-medium">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div>
                    <p className="font-semibold text-secondary-900 dark:text-secondary-100">{t.name}</p>
                    <p className="text-sm text-secondary-500 dark:text-secondary-400">{t.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Who It's For ────────────────────────────────────────────────────── */}
        <section className="container mx-auto px-4 py-24">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <Badge variant="outline" className="mb-4">Who it&apos;s for</Badge>
              <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
                For every online store that wants fewer tickets and more conversions
              </h2>
              <p className="text-secondary-600 dark:text-secondary-400">
                If your customers ask questions before they buy, VocUI answers them — automatically.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
              {verticals.map((v) => {
                const Icon = v.icon;
                return (
                  <Card
                    key={v.title}
                    className="border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 hover:shadow-lg hover:border-primary-200 dark:hover:border-primary-700 transition-all duration-200 text-center"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-900/50 mx-auto mb-3">
                        <Icon className="h-6 w-6 text-primary-500" aria-hidden="true" />
                      </div>
                      <CardTitle className="text-base leading-snug">{v.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-secondary-500 dark:text-secondary-400 leading-relaxed">
                        {v.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Final CTA ───────────────────────────────────────────────────────── */}
        <section className="container mx-auto px-4 py-20">
          <div className="max-w-3xl mx-auto">
            <div className="rounded-3xl bg-gradient-to-br from-primary-600 to-primary-800 p-12 text-center text-white shadow-xl shadow-primary-500/20">
              <h2 className="text-3xl font-bold mb-4">
                Every unanswered question is a sale you didn&apos;t make
              </h2>
              <p className="text-lg text-white/80 mb-2 max-w-xl mx-auto">
                Build a chatbot that converts browsers into buyers — and keeps customers coming back.
              </p>
              <p className="text-sm text-white/60 mb-10">
                Free plan available &middot; No credit card required &middot; Works with any website
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="xl"
                  variant="secondary"
                  className="bg-white text-primary-600 hover:bg-primary-50 font-semibold"
                  asChild
                >
                  <Link href="/signup">
                    Build Your E-commerce Chatbot Free
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button
                  size="xl"
                  variant="outline-light"
                  asChild
                >
                  <Link href="/pricing">View Pricing</Link>
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
