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
  FileX,
  AlertTriangle,
  RefreshCw,
  Globe,
  FileText,
  FileType,
  MessageSquarePlus,
  RotateCcw,
  ShieldCheck,
  Briefcase,
  Building2,
  HeartPulse,
  ShoppingBag,
} from 'lucide-react';

// ─── Metadata ──────────────────────────────────────────────────────────────────

export function generateMetadata(): Metadata {
  return {
    title: 'AI Knowledge Base Chatbot | Train on Your Own Docs | VocUI',
    description:
      'Turn your docs, PDFs, and URLs into a chatbot that answers questions instantly. Train on your own content — no hallucinations, no generic AI answers.',
    keywords: [
      'knowledge base chatbot',
      'train chatbot on documents',
      'PDF chatbot',
      'chatbot from website content',
      'AI knowledge base',
      'document chatbot',
    ],
    openGraph: {
      title: 'AI Knowledge Base Chatbot | Train on Your Own Docs | VocUI',
      description:
        'Turn your docs, PDFs, and URLs into a chatbot that answers questions instantly. Train on your own content — no hallucinations, no generic AI answers.',
      url: 'https://vocui.com/knowledge-base-chatbot',
      siteName: 'VocUI',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'AI Knowledge Base Chatbot | Train on Your Own Docs | VocUI',
      description:
        'Turn your docs, PDFs, and URLs into a chatbot that answers questions instantly. Train on your own content — no hallucinations, no generic AI answers.',
    },
    alternates: {
      canonical: 'https://vocui.com/knowledge-base-chatbot',
    },
  };
}

// ─── Structured Data ───────────────────────────────────────────────────────────

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'VocUI — Knowledge Base Chatbot',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  description:
    'Train an AI chatbot on your own documents, PDFs, and website content. No hallucinations — only answers grounded in your knowledge base.',
  url: 'https://vocui.com/knowledge-base-chatbot',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    description: 'Free plan available',
  },
  featureList: [
    'Website URL scraping',
    'PDF upload and extraction',
    'DOCX and text file import',
    'Manual Q&A pairs',
    'Always up-to-date knowledge base',
    'Grounded answers only — no hallucinations',
  ],
};

// ─── Data ──────────────────────────────────────────────────────────────────────

const trustSignals = [
  'Answers grounded in your content only',
  'Upload PDFs, URLs, DOCX, and more',
  'Live in under an hour',
];

const painPoints = [
  {
    icon: FileX,
    title: 'Your docs aren\'t helping anyone',
    body: 'You\'ve written detailed FAQs, help articles, and product guides. But customers still email support asking questions your docs already answer — because searching docs is tedious.',
  },
  {
    icon: AlertTriangle,
    title: 'Generic AI gives generic — and wrong — answers',
    body: 'ChatGPT doesn\'t know your return policy, your pricing tiers, or your service area. AI that doesn\'t know your business will confidently give your customers the wrong answer.',
  },
  {
    icon: RefreshCw,
    title: 'Your knowledge base is always changing',
    body: 'Prices change. Products update. Policies evolve. A chatbot trained on your content stays accurate when you update your sources — no manual retraining.',
  },
];

const steps = [
  {
    step: '01',
    title: 'Add your knowledge sources',
    description:
      'Paste URLs, upload PDFs, add DOCX files, or type Q&A pairs directly. VocUI processes and indexes everything automatically.',
  },
  {
    step: '02',
    title: 'Review and refine',
    description:
      'Preview what your chatbot knows. Add additional sources, fill gaps with manual Q&A pairs, and set fallback behaviour for unanswered questions.',
  },
  {
    step: '03',
    title: 'Deploy anywhere',
    description:
      'Embed on your website with one line of JavaScript, deploy to Slack, or connect via the REST API. Your knowledge is live everywhere your customers are.',
  },
];

const features = [
  {
    icon: Globe,
    name: 'Website URL scraping',
    description:
      'Paste any URL and VocUI scrapes the page content automatically. Add your entire help center in minutes.',
  },
  {
    icon: FileText,
    name: 'PDF upload',
    description:
      'Upload product manuals, policy documents, onboarding guides, or any PDF. VocUI extracts and indexes the text.',
  },
  {
    icon: FileType,
    name: 'DOCX & text files',
    description:
      'Import Word documents and plain text files directly. Ideal for internal wikis, SOPs, and process documentation.',
  },
  {
    icon: MessageSquarePlus,
    name: 'Manual Q&A pairs',
    description:
      'Write questions and answers directly for topics your docs don\'t cover. Full control over specific responses.',
  },
  {
    icon: RotateCcw,
    name: 'Always up to date',
    description:
      'Re-scrape URLs, re-upload updated PDFs, or edit Q&A pairs at any time. Your chatbot reflects your latest content.',
  },
  {
    icon: ShieldCheck,
    name: 'Grounded answers only',
    description:
      'When a question isn\'t covered by your knowledge base, your chatbot says so — it never fabricates an answer.',
  },
];

const testimonials = [
  {
    quote:
      'Clients ask us the same eligibility questions every week. VocUI handles that now.',
    author: 'S.C.',
    role: 'Partner, Law Firm',
  },
  {
    quote:
      'I uploaded our entire help center in one afternoon. By the next morning, customers were getting answers without waiting for our team.',
    author: 'Marcus T.',
    role: 'Head of Customer Success',
  },
];

const verticals = [
  {
    icon: Building2,
    title: 'SaaS & Software Companies',
    description:
      'Turn your help docs and onboarding guides into a support chatbot. Answer product questions without adding support headcount.',
  },
  {
    icon: Briefcase,
    title: 'Law Firms & Professional Services',
    description:
      'Let clients self-serve answers to intake FAQs, eligibility questions, and process questions — before they book a call.',
  },
  {
    icon: HeartPulse,
    title: 'Healthcare & Clinics',
    description:
      'Make appointment policies, service descriptions, and insurance FAQs available around the clock without staff involvement.',
  },
  {
    icon: ShoppingBag,
    title: 'E-commerce & Retail',
    description:
      'Train on your product catalogue, return policy, and shipping FAQs. Handle the questions that fill your inbox every day.',
  },
];

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function KnowledgeBaseChatbotPage() {
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
          <Badge className="mb-6">Train on Your Own Content</Badge>

          <H1 className="max-w-4xl mb-6">
            Your docs, FAQs, and PDFs —{' '}
            <span className="text-primary-500">turned into a chatbot that actually knows your business</span>
          </H1>

          <p className="mx-auto max-w-2xl text-lg text-secondary-600 dark:text-secondary-400 mb-10">
            VocUI reads your content and builds a chatbot that answers questions using only what
            you&apos;ve written. No generic AI guesses. No hallucinations. Just your knowledge,
            available instantly.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="xl" asChild>
              <Link href="/signup">
                Build Your Knowledge Base Chatbot Free
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button size="xl" variant="outline" asChild>
              <Link href="/pricing">See Pricing</Link>
            </Button>
          </div>

          <p className="text-sm text-secondary-500 dark:text-secondary-400">
            No credit card required &middot; Live in under an hour &middot; Free plan available
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
            <Badge variant="outline" className="mb-4">The knowledge problem</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              Your knowledge exists — your customers just can&apos;t find it
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              The problem isn&apos;t that you haven&apos;t documented things. It&apos;s that your docs
              aren&apos;t accessible enough to be useful.
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
                From your content to a live chatbot in under an hour
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
            <Badge variant="outline" className="mb-4">Knowledge sources</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              Every way your content can become a chatbot
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              Upload once, update anytime. VocUI indexes your content and keeps your chatbot
              accurate as your knowledge base grows.
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

        {/* ── Social Proof ────────────────────────────────────────────────────── */}
        <section className="bg-secondary-50 dark:bg-secondary-800/30 py-24">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <Badge variant="outline" className="mb-4">What customers say</Badge>
              <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100">
                Real businesses. Real knowledge bases.
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2 max-w-3xl mx-auto">
              {testimonials.map((t) => (
                <div
                  key={t.author}
                  className="bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-xl p-8 hover:border-primary-200 dark:hover:border-primary-700 transition-colors"
                >
                  <blockquote className="text-secondary-700 dark:text-secondary-300 leading-relaxed mb-6 text-base">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <div>
                    <p className="font-semibold text-secondary-900 dark:text-secondary-100 text-sm">{t.author}</p>
                    <p className="text-xs text-secondary-500 dark:text-secondary-400">{t.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Who It's For ────────────────────────────────────────────────────── */}
        <section className="container mx-auto px-4 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">Who it&apos;s for</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              For any business that already has the answers — just not the chatbot
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              If you have documentation that customers and staff should be able to search, VocUI
              makes it instantly accessible.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
            {verticals.map((v) => {
              const Icon = v.icon;
              return (
                <Card
                  key={v.title}
                  className="border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 hover:shadow-lg hover:border-primary-200 dark:hover:border-primary-700 transition-all duration-200"
                >
                  <CardHeader className="pb-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-900/50 mb-3">
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

        {/* ── Final CTA ───────────────────────────────────────────────────────── */}
        <section className="container mx-auto px-4 py-20">
          <div className="max-w-3xl mx-auto">
            <div className="rounded-3xl bg-gradient-to-br from-primary-600 to-primary-800 p-12 text-center text-white shadow-xl shadow-primary-500/20">
              <h2 className="text-3xl font-bold mb-4">
                Your knowledge base is sitting idle. Let it answer questions.
              </h2>
              <p className="text-lg text-white/80 mb-2 max-w-xl mx-auto">
                Upload your content and have a chatbot answering questions in under an hour —
                grounded in exactly what you&apos;ve written.
              </p>
              <p className="text-sm text-white/60 mb-10">
                Free plan available &middot; No credit card required &middot; No hallucinations
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="xl"
                  variant="secondary"
                  className="bg-white text-primary-600 hover:bg-primary-50 font-semibold"
                  asChild
                >
                  <Link href="/signup">
                    Build Your Knowledge Base Chatbot Free
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
