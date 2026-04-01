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
  TrendingDown,
  MessageCircleQuestion,
  UserX,
  BookOpen,
  UserPlus,
  Clock,
  UserCheck,
  Zap,
  Target,
  BarChart3,
  Code2,
  Building,
} from 'lucide-react';

// ─── Metadata ──────────────────────────────────────────────────────────────────

export function generateMetadata(): Metadata {
  return {
    title: 'AI Chatbot for SaaS Companies | Product FAQ & Trial Lead Capture | VocUI',
    description:
      'Stop losing trial users to unanswered questions. VocUI gives SaaS products an AI chatbot that answers product FAQs, guides onboarding, and captures sales-ready leads 24/7.',
    keywords: [
      'AI chatbot for SaaS',
      'SaaS product chatbot',
      'trial user onboarding chatbot',
      'SaaS lead capture chatbot',
      'product FAQ automation',
    ],
    openGraph: {
      title: 'AI Chatbot for SaaS Companies | Product FAQ & Trial Lead Capture | VocUI',
      description:
        'Stop losing trial users to unanswered questions. VocUI gives SaaS products an AI chatbot that answers product FAQs, guides onboarding, and captures sales-ready leads 24/7.',
      url: 'https://vocui.com/chatbot-for-saas',
      siteName: 'VocUI',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'AI Chatbot for SaaS Companies | Product FAQ & Trial Lead Capture | VocUI',
      description:
        'Stop losing trial users to unanswered questions. VocUI gives SaaS products an AI chatbot that answers product FAQs, guides onboarding, and captures sales-ready leads 24/7.',
    },
    alternates: {
      canonical: 'https://vocui.com/chatbot-for-saas',
    },
    robots: { index: true, follow: true },
  };
}

// ─── Structured Data ───────────────────────────────────────────────────────────

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'VocUI — AI Chatbot for SaaS Companies',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  description:
    'AI chatbot that answers product FAQs, guides trial users through onboarding, and captures sales-qualified leads for SaaS companies — 24/7, trained on your product docs.',
  url: 'https://vocui.com/chatbot-for-saas',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    description: 'Free plan available',
  },
  featureList: [
    'Product FAQ automation from your docs',
    'Trial user onboarding guidance',
    'Lead capture and qualification',
    '24/7 availability',
    'Sales team escalation',
    'Feature discovery flows',
  ],
};

// ─── Data ──────────────────────────────────────────────────────────────────────

const trustSignals = [
  'Answers product questions 24/7',
  'Trained only on your product documentation',
  'GDPR-compliant data handling',
];

const painPoints: Array<{ icon: ElementType; title: string; body: ReactNode }> = [
  {
    icon: TrendingDown,
    title: 'Trial users churn because they cannot find the answers they need',
    body: <span>A trial user hits a wall at 7pm — a feature they cannot figure out, an integration question they cannot find in the docs. <a href="https://livechatai.com/blog/customer-support-response-time-statistics" target="_blank" rel="noopener noreferrer" className="underline decoration-dotted hover:text-primary-500 transition-colors">Nearly 60% of customers expect a response within 10 minutes</a> — no one replies until morning, and by then they&apos;ve signed up for your competitor.</span>,
  },
  {
    icon: MessageCircleQuestion,
    title: 'Your support team fields the same onboarding questions from every new user',
    body: <span>&ldquo;How do I connect my CRM?&rdquo; &ldquo;Where do I find my API key?&rdquo; &ldquo;Does this work with Zapier?&rdquo; <a href="https://www.zendesk.com/blog/ticket-deflection-currency-self-service/" target="_blank" rel="noopener noreferrer" className="underline decoration-dotted hover:text-primary-500 transition-colors">Self-service deflects 40–60% of incoming queries</a> — but users don&apos;t search docs, they send a message, and someone has to reply.</span>,
  },
  {
    icon: UserX,
    title: 'Sales reps waste demo time on prospects who are not close to buying',
    body: 'When your only option is "book a demo," every curious visitor becomes a calendar entry. Reps spend half their week on calls with people at the top of the funnel who just had a few product questions.',
  },
];

const steps = [
  {
    step: '01',
    title: 'Train on your product documentation',
    description:
      'Upload your docs, help centre articles, integration guides, and feature explanations. Your chatbot answers accurately from your own content — not hallucinated guesses.',
  },
  {
    step: '02',
    title: 'Configure your lead capture flow',
    description:
      'Define when the chatbot asks for contact details and what qualifies a lead for sales handoff. Set escalation rules so sales-ready conversations reach your team with context already attached.',
  },
  {
    step: '03',
    title: 'Deploy on your product and marketing site',
    description:
      'Embed in your trial UI, docs site, or marketing page. Trial users self-serve. Serious prospects get routed to sales. Your team focuses on closeable deals.',
  },
];

const features = [
  {
    icon: BookOpen,
    name: 'Product FAQ automation',
    description:
      'Answer integration, pricing, feature capability, and limits questions automatically — drawn from your approved product documentation.',
  },
  {
    icon: UserPlus,
    name: 'Trial onboarding guidance',
    description:
      'Walk new trial users through setup steps, first-value moments, and common gotchas — reducing the time-to-value that determines whether they convert.',
  },
  {
    icon: Target,
    name: 'Lead capture and qualification',
    description:
      'Capture contact details from engaged visitors and qualify their intent before passing to sales — so your team works with warm, context-rich leads.',
  },
  {
    icon: Clock,
    name: '24/7 availability',
    description:
      'Trial users and prospects get answers at any hour. Stop losing evaluation momentum because your team was offline when the question landed.',
  },
  {
    icon: UserCheck,
    name: 'Sales team escalation',
    description:
      'When a conversation signals buying intent, the chatbot hands off to your sales team with the full context — no re-introduction, no lost signal.',
  },
  {
    icon: Zap,
    name: 'Feature discovery',
    description:
      'Surface features users did not know existed. Proactively guide trial users toward the capabilities most likely to drive conversion and retention.',
  },
];

const verticals = [
  {
    icon: BarChart3,
    title: 'B2B SaaS',
    description:
      'Answer complex product questions, qualify enterprise prospects, and reduce the sales cycle by surfacing the right information at the right moment.',
  },
  {
    icon: Code2,
    title: 'Developer Tools',
    description:
      'Handle API questions, integration docs, and SDK FAQs automatically — giving developers the instant answers they expect.',
  },
  {
    icon: Building,
    title: 'SMB Software',
    description:
      'Guide smaller customers through setup without requiring support team involvement on every new account.',
  },
  {
    icon: Target,
    title: 'Enterprise Software',
    description:
      'Qualify inbound enterprise inquiries, capture RFP-level context, and route sales-ready conversations to the right account executive.',
  },
];

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ChatbotForSaaSPage() {
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
          <Badge className="mb-6">AI Chatbot for SaaS Companies</Badge>

          <H1 className="max-w-4xl mb-6">
            Trial users leave when they can&apos;t get answers fast enough.{' '}
            <span className="text-primary-500">Give them instant ones.</span>
          </H1>

          <p className="mx-auto max-w-2xl text-lg text-secondary-600 dark:text-secondary-400 mb-10">
            VocUI trains on your product docs, help centre, and feature guides — so trial users
            get answers the moment they need them, and your support and sales teams focus only
            on conversations that need a human.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="xl" asChild>
              <Link href="/signup">
                Build Your SaaS Chatbot Free
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button size="xl" variant="outline" asChild>
              <Link href="/pricing">See Pricing</Link>
            </Button>
          </div>

          <p className="text-sm text-secondary-500 dark:text-secondary-400">
            Answers product questions 24/7 &middot; Trained only on your product documentation &middot; GDPR-compliant
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
            <Badge variant="outline" className="mb-4">The trial conversion problem</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              Most SaaS churn happens before the customer ever becomes a customer
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              Trial users do not churn because your product is bad. They churn because they hit a
              question, did not get an answer fast enough, and moved on. Fixing that is not a product
              problem — it is a response time problem.
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
              Everything a SaaS chatbot actually needs
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              Built for SaaS products — not a generic widget. Every feature is designed to reduce
              trial churn, capture more leads, and protect your support team&apos;s capacity.
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
              <Badge variant="outline" className="mb-8">From a SaaS team using VocUI</Badge>
              <blockquote className="text-2xl font-semibold text-secondary-900 dark:text-secondary-100 leading-snug mb-6">
                &ldquo;We were losing trial users at the integration step because no one was around
                to answer questions in the evening. VocUI fixed that overnight. Our trial-to-paid
                rate improved within the first month.&rdquo;
              </blockquote>
              <p className="text-secondary-500 dark:text-secondary-400 text-sm">
                A.P. &mdash; Head of Growth, B2B SaaS Company
              </p>
            </div>
          </div>
        </section>

        {/* ── Who It's For ────────────────────────────────────────────────────── */}
        <section className="container mx-auto px-4 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">Who it&apos;s for</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              For SaaS teams that want more trial conversions without more headcount
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              If your trial users are going dark because they could not get a quick answer,
              VocUI closes the gap between their question and their decision to convert.
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
                { label: 'Chatbot for IT Support Teams', href: '/chatbot-for-it-support', description: 'Ticket deflection and troubleshooting FAQ for IT teams.' },
                { label: 'Chatbot for Marketing Agencies', href: '/chatbot-for-marketing-agencies', description: 'Service FAQ and proposal lead capture for marketing agencies.' },
                { label: 'Chatbot for Web Design Agencies', href: '/chatbot-for-web-design-agencies', description: 'Project scoping and quote lead capture for web agencies.' },
                { label: 'Chatbot for E-commerce', href: '/chatbot-for-ecommerce', description: 'Product Q&A and support deflection for online retailers.' },
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
                Stop losing trial users to unanswered questions
              </h2>
              <p className="text-lg text-white/80 mb-2 max-w-xl mx-auto">
                Give trial users instant answers and capture more sales-ready leads — without adding to your support headcount.
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
                    Build Your SaaS Chatbot Free
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
