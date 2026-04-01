import type { Metadata } from 'next';
import type { ReactNode, ElementType } from 'react';
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
  Phone,
  MoonStar,
  AlertCircle,
  BookOpen,
  FileText,
  Clock,
  UserCheck,
  ShieldCheck,
  BarChart2,
  Heart,
  Home,
  Briefcase,
} from 'lucide-react';

// ─── Metadata ──────────────────────────────────────────────────────────────────

export function generateMetadata(): Metadata {
  return {
    title: 'AI Chatbot for Insurance Agents | Policy FAQ & Quote Lead Capture | VocUI',
    description:
      'Let an AI chatbot handle policy questions, quote lead capture, and coverage FAQs for your insurance agency — 24/7. Stop losing after-hours prospects to competitors.',
    keywords: [
      'AI chatbot for insurance agents',
      'insurance chatbot',
      'policy FAQ chatbot',
      'quote lead capture chatbot',
      'insurance agency automation',
    ],
    openGraph: {
      title: 'AI Chatbot for Insurance Agents | Policy FAQ & Quote Lead Capture | VocUI',
      description:
        'Let an AI chatbot handle policy questions, quote lead capture, and coverage FAQs for your insurance agency — 24/7. Stop losing after-hours prospects to competitors.',
      url: 'https://vocui.com/chatbot-for-insurance-agents',
      siteName: 'VocUI',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'AI Chatbot for Insurance Agents | Policy FAQ & Quote Lead Capture | VocUI',
      description:
        'Let an AI chatbot handle policy questions, quote lead capture, and coverage FAQs for your insurance agency — 24/7. Stop losing after-hours prospects to competitors.',
    },
    alternates: {
      canonical: 'https://vocui.com/chatbot-for-insurance-agents',
    },
    robots: { index: true, follow: true },
  };
}

// ─── Structured Data ───────────────────────────────────────────────────────────

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'VocUI — AI Chatbot for Insurance Agents',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  description:
    'AI chatbot that handles policy FAQ, quote lead capture, and coverage comparisons for insurance agents and agencies — 24/7, trained on your products only.',
  url: 'https://vocui.com/chatbot-for-insurance-agents',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    description: 'Free plan available',
  },
  featureList: [
    'Knowledge base trained on your policy content',
    'Quote lead capture and intake forms',
    'Coverage comparison support',
    '24/7 after-hours availability',
    'Agent escalation with full conversation context',
    'GDPR-compliant data handling',
  ],
};

// ─── Data ──────────────────────────────────────────────────────────────────────

const trustSignals = [
  'Answers policy questions 24/7',
  'Trained only on your product content',
  'GDPR-compliant data handling',
];

const painPoints: Array<{ icon: ElementType; title: string; body: ReactNode }> = [
  {
    icon: Phone,
    title: 'Agents buried in repetitive policy questions',
    body: 'What does this policy cover? What\'s the excess? Can I add a named driver? Your agents field these questions dozens of times a week — time that could be spent closing new business, not explaining existing terms.',
  },
  {
    icon: MoonStar,
    title: 'After-hours quote requests disappear into a contact form',
    body: <span>A prospect compares policies at 8pm and wants a quote. <a href="https://411locals.us/small-business-owners-dont-answer-62-of-phone-calls/" target="_blank" rel="noopener noreferrer" className="underline decoration-dotted hover:text-primary-500 transition-colors">Small businesses miss 62% of inbound calls</a> — they fill in a generic contact form and buy from whoever calls first.</span>,
  },
  {
    icon: AlertCircle,
    title: 'Complex coverage questions bottleneck your best agents',
    body: <span>Every minute a senior agent spends explaining deductible differences is a minute not spent on high-value relationships. <a href="https://www.reviewtrackers.com/reports/customer-reviews-stats/" target="_blank" rel="noopener noreferrer" className="underline decoration-dotted hover:text-primary-500 transition-colors">61% of consumers say reviews matter when choosing an insurance agent</a> — let the chatbot handle tier-1 questions so your team focuses on the relationships that win renewals.</span>,
  },
];

const steps = [
  {
    step: '01',
    title: 'Train on your products',
    description:
      'Upload your policy documents, product brochures, coverage summaries, and FAQ content. Your chatbot learns your full product range and answers from your approved materials only.',
  },
  {
    step: '02',
    title: 'Configure lead and escalation flows',
    description:
      'Set up quote lead capture forms and define escalation rules. Complex coverage discussions route to your agents with full context — the chatbot qualifies, your agents close.',
  },
  {
    step: '03',
    title: 'Deploy and capture more leads',
    description:
      'Embed on your agency website. Prospects get instant policy answers; warm leads get captured automatically and routed to the right agent.',
  },
];

const features = [
  {
    icon: BookOpen,
    name: 'Policy FAQ automation',
    description:
      'Answer coverage scope, exclusion, and term questions automatically from your policy documents — so agents field fewer interruptions and focus on selling.',
  },
  {
    icon: FileText,
    name: 'Quote lead capture',
    description:
      'Collect prospect name, contact details, and coverage needs directly in chat — warm leads delivered to your CRM with all the context your agents need to follow up.',
  },
  {
    icon: BarChart2,
    name: 'Coverage comparison support',
    description:
      'Guide prospects through the differences between your plans and coverage tiers using your own materials — reducing the time agents spend on basic comparisons.',
  },
  {
    icon: Clock,
    name: 'After-hours availability',
    description:
      'Your chatbot answers at 9pm as confidently as at 9am. Capture every prospect who researches insurance outside business hours.',
  },
  {
    icon: UserCheck,
    name: 'Agent escalation',
    description:
      'Underwriting questions or sensitive claims discussions escalate immediately to the right agent, with the full conversation handed over cleanly.',
  },
  {
    icon: ShieldCheck,
    name: 'Document request intake',
    description:
      'Let clients request certificates, policy documents, and proof of cover through chat — reducing admin calls without removing the human touch for complex requests.',
  },
];

const verticals = [
  {
    icon: Heart,
    title: 'Life Insurance',
    description:
      'Handle term vs. whole life questions, benefit FAQs, and application lead capture without tying up your advisors.',
  },
  {
    icon: Home,
    title: 'Home & Auto',
    description:
      'Answer excess, cover limits, and add-on questions automatically so agents spend time on quotes, not explanations.',
  },
  {
    icon: Briefcase,
    title: 'Commercial Insurance',
    description:
      'Field coverage scope questions from business owners and route serious prospects to your commercial specialists.',
  },
  {
    icon: ShieldCheck,
    title: 'Health Insurance',
    description:
      'Guide individuals through plan comparisons, network questions, and eligibility FAQs before the agent conversation begins.',
  },
];

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ChatbotForInsuranceAgentsPage() {
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
          <Badge className="mb-6">AI Chatbot for Insurance Agencies</Badge>

          <H1 className="max-w-4xl mb-6">
            Prospects ask the same policy questions before every quote.{' '}
            <span className="text-primary-500">Your chatbot can answer them instantly.</span>
          </H1>

          <p className="mx-auto max-w-2xl text-lg text-secondary-600 dark:text-secondary-400 mb-10">
            VocUI trains on your policy documents, product FAQs, and coverage details — so your
            agents spend less time explaining basics and more time closing business.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="xl" asChild>
              <Link href="/signup">
                Build Your Insurance Chatbot Free
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button size="xl" variant="outline" asChild>
              <Link href="/pricing">See Pricing</Link>
            </Button>
          </div>

          <p className="text-sm text-secondary-500 dark:text-secondary-400">
            Answers policy questions 24/7 &middot; Trained only on your product content &middot; GDPR-compliant
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
            <Badge variant="outline" className="mb-4">The agency bottleneck</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              Your agents are answering questions a chatbot could handle
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              Not because your agents aren&apos;t good at their job. Because there&apos;s no system
              to handle the same first-layer policy questions that arrive every single day.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
            {painPoints.map((p) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.title}
                  className="bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-xl p-6 hover:border-primary-200 dark:hover:border-primary-700 transition-colors"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 dark:bg-red-900/20 mb-4">
                    <Icon className="h-5 w-5 text-red-500" aria-hidden="true" />
                  </div>
                  <h3 className="font-semibold text-secondary-900 dark:text-secondary-100 mb-2">{p.title}</h3>
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
                Set up in under an hour. No developers needed.
              </h2>
            </div>

            <div className="grid gap-10 md:grid-cols-3 max-w-5xl mx-auto relative">
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
                  Start Building Free
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* ── Features ────────────────────────────────────────────────────────── */}
        <section className="container mx-auto px-4 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">Features</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              Everything an insurance agency chatbot actually needs
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              Built for insurance professionals — not a generic FAQ widget.
              Every feature is aimed at reducing agent interruptions and capturing more qualified leads.
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

        {/* ── Testimonial ─────────────────────────────────────────────────────── */}
        <section className="bg-secondary-50 dark:bg-secondary-800/30 py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <Badge variant="outline" className="mb-8">From an insurance agency using VocUI</Badge>
              <blockquote className="text-2xl font-semibold text-secondary-900 dark:text-secondary-100 leading-snug mb-6">
                &ldquo;My agents were spending two hours a day on calls that were really just policy
                explainers. VocUI handles that first layer now — the calls we do take are from
                people who are genuinely ready to buy.&rdquo;
              </blockquote>
              <p className="text-secondary-500 dark:text-secondary-400 text-sm">
                P.H. &mdash; Principal, Harbour Insurance Group
              </p>
            </div>
          </div>
        </section>

        {/* ── Who It's For ────────────────────────────────────────────────────── */}
        <section className="container mx-auto px-4 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">Who it&apos;s for</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              For insurance agencies that want their agents selling, not explaining
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              If your agents are fielding questions a chatbot could handle, VocUI pays for itself
              the first week your team gets uninterrupted time to work their pipeline.
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
        </section>

        <section className="container mx-auto px-4 py-16">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-6">Related industries</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: 'Chatbot for Financial Advisors', href: '/chatbot-for-financial-advisors', description: 'Service FAQ and consultation booking for financial advisers.' },
                { label: 'Chatbot for Accountants', href: '/chatbot-for-accountants', description: 'Tax FAQ and client intake automation.' },
                { label: 'Chatbot for Mortgage Brokers', href: '/chatbot-for-mortgage-brokers', description: 'Rate FAQ and application lead capture for mortgage brokers.' },
                { label: 'Chatbot for Law Firms', href: '/chatbot-for-lawyers', description: 'Client intake, practice area FAQ, and consultation booking.' },
              ].map((item) => (
                <Link key={item.href} href={item.href} className="group flex flex-col gap-1 rounded-xl border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 p-4 hover:border-primary-200 dark:hover:border-primary-700 hover:shadow-sm transition-all">
                  <span className="text-sm font-medium text-secondary-900 dark:text-secondary-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{item.label}</span>
                  <span className="text-xs text-secondary-500 dark:text-secondary-400">{item.description}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Final CTA ───────────────────────────────────────────────────────── */}
        <section className="container mx-auto px-4 py-20">
          <div className="max-w-3xl mx-auto">
            <div className="rounded-3xl bg-gradient-to-br from-primary-600 to-primary-800 p-12 text-center text-white shadow-xl shadow-primary-500/20">
              <h2 className="text-3xl font-bold mb-4">
                Your agents&apos; time is too valuable to spend on policy explainers
              </h2>
              <p className="text-lg text-white/80 mb-2 max-w-xl mx-auto">
                Give prospects instant answers and let your team focus on the conversations that actually close.
              </p>
              <p className="text-sm text-white/60 mb-10">
                Free plan available &middot; No credit card required &middot; Live in under an hour
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="xl"
                  variant="secondary"
                  className="bg-white text-primary-600 hover:bg-primary-50 font-semibold"
                  asChild
                >
                  <Link href="/signup">
                    Build Your Insurance Chatbot Free
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button
                  size="xl"
                  variant="outline-light"
                  asChild
                >
                  <Link href="/pricing">See Pricing</Link>
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
