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
  HelpCircle,
  BookOpen,
  FileText,
  Clock,
  UserCheck,
  MapPin,
  Zap,
  Home,
  Building2,
  AlertTriangle,
  Sun,
} from 'lucide-react';

// ─── Metadata ──────────────────────────────────────────────────────────────────

export function generateMetadata(): Metadata {
  return {
    title: 'AI Chatbot for Electricians | Quote Requests & Services FAQ | VocUI',
    description:
      'Let an AI chatbot capture quote requests, answer service FAQs, and triage emergency calls for your electrical business — 24/7. Stop losing leads to phone tag.',
    keywords: [
      'AI chatbot for electricians',
      'electrician chatbot',
      'electrical quote request chatbot',
      'electrician FAQ automation',
      'electrical service lead capture',
    ],
    openGraph: {
      title: 'AI Chatbot for Electricians | Quote Requests & Services FAQ | VocUI',
      description:
        'Let an AI chatbot capture quote requests, answer service FAQs, and triage emergency calls for your electrical business — 24/7. Stop losing leads to phone tag.',
      url: 'https://vocui.com/chatbot-for-electricians',
      siteName: 'VocUI',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'AI Chatbot for Electricians | Quote Requests & Services FAQ | VocUI',
      description:
        'Let an AI chatbot capture quote requests, answer service FAQs, and triage emergency calls for your electrical business — 24/7. Stop losing leads to phone tag.',
    },
    alternates: {
      canonical: 'https://vocui.com/chatbot-for-electricians',
    },
    robots: { index: true, follow: true },
  };
}

// ─── Structured Data ───────────────────────────────────────────────────────────

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'VocUI — AI Chatbot for Electricians',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  description:
    'AI chatbot that captures quote requests, answers service FAQs, and triages emergency calls for electrical businesses — 24/7, trained on your business content only.',
  url: 'https://vocui.com/chatbot-for-electricians',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    description: 'Free plan available',
  },
  featureList: [
    'Quote request intake and capture',
    'Service FAQ automation',
    'Emergency call triage',
    '24/7 after-hours availability',
    'Engineer escalation with full context',
    'Service area FAQ',
  ],
};

// ─── Data ──────────────────────────────────────────────────────────────────────

const trustSignals = [
  'Captures quote requests 24/7',
  'Trained only on your business content',
  'GDPR-compliant data handling',
];

const painPoints: Array<{ icon: ElementType; title: string; body: ReactNode }> = [
  {
    icon: Phone,
    title: 'Phone tag for simple quote requests that never needed a call',
    body: <span>Can you rewire my garage? How much to install a consumer unit? <a href="https://411locals.us/small-business-owners-dont-answer-62-of-phone-calls/" target="_blank" rel="noopener noreferrer" className="underline decoration-dotted hover:text-primary-500 transition-colors">Small businesses miss 62% of inbound calls</a> — half your incoming calls are quote requests that go to voicemail and the customer calls someone else.</span>,
  },
  {
    icon: MoonStar,
    title: 'After-hours emergency calls that turn out not to be emergencies',
    body: <span>A homeowner panics at 10pm because a circuit tripped. <a href="https://www.contractornerd.com/blog/home-services-statistics/" target="_blank" rel="noopener noreferrer" className="underline decoration-dotted hover:text-primary-500 transition-colors">Over 55% of consumers search before scheduling a home services appointment</a> — without a triage tool, you&apos;re either missing urgent jobs or getting woken up for a reset.</span>,
  },
  {
    icon: HelpCircle,
    title: "Customers unsure what service they need waste your time on the phone",
    body: "Do I need a full rewire or just a socket replacement? Is this a job for a Part P certified electrician? Customers who don't know what they need take time to qualify — time your engineers should spend on paid work, not phone consultations.",
  },
];

const steps = [
  {
    step: '01',
    title: 'Train on your services',
    description:
      'Upload your service descriptions, pricing guides, service area details, and common FAQ answers. Your chatbot learns your business and answers accordingly.',
  },
  {
    step: '02',
    title: 'Configure quote and triage flows',
    description:
      'Set up quote intake forms for different job types. Define emergency triage rules so genuine urgent calls route immediately to your on-call engineer — the chatbot never guesses at electrical safety.',
  },
  {
    step: '03',
    title: 'Deploy and capture every lead',
    description:
      'Embed on your website or Google Business profile. Visitors get instant answers; ready-to-book customers get routed to your quote request flow or appointment calendar.',
  },
];

const features = [
  {
    icon: FileText,
    name: 'Quote request intake',
    description:
      "Collect job type, location, and scope details from every visitor who wants a quote — even at midnight. No lead falls through because you didn't pick up the phone.",
  },
  {
    icon: BookOpen,
    name: 'Service FAQ automation',
    description:
      "Answer questions about your services, certifications, Part P compliance, and what's included in each job type — without involving your team.",
  },
  {
    icon: AlertTriangle,
    name: 'Emergency triage',
    description:
      'Guide customers through quick safety questions to determine whether a situation is a genuine electrical emergency and route them appropriately — day or night.',
  },
  {
    icon: Clock,
    name: '24/7 availability',
    description:
      'Your chatbot answers at midnight as well as at midday. Capture every inquiry and quote request, even when your office is closed.',
  },
  {
    icon: UserCheck,
    name: 'Engineer escalation',
    description:
      'Jobs that need a real person escalate immediately to your team with the full conversation context ready — so your engineer already knows the situation before they call back.',
  },
  {
    icon: MapPin,
    name: 'Service area FAQ',
    description:
      "Answer 'do you cover my area?' instantly. Upload your service postcodes and let the chatbot qualify leads geographically before you spend time quoting out-of-area jobs.",
  },
];

const verticals = [
  {
    icon: Home,
    title: 'Residential',
    description:
      'Handle rewiring quotes, socket installation FAQs, and consumer unit enquiries without interrupting your engineers.',
  },
  {
    icon: Building2,
    title: 'Commercial',
    description:
      'Qualify commercial fit-out and maintenance enquiries, and route serious prospects directly to your estimating team.',
  },
  {
    icon: Zap,
    title: 'Emergency & Repairs',
    description:
      'Triage urgent calls accurately so genuine emergencies reach your on-call engineer fast — and non-emergencies get handled next business day.',
  },
  {
    icon: Sun,
    title: 'Solar & EV Installation',
    description:
      'Answer solar panel and EV charger installation questions, capture lead details, and book survey appointments automatically.',
  },
];

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ChatbotForElectriciansPage() {
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
          <Badge className="mb-6">AI Chatbot for Electricians</Badge>

          <H1 className="max-w-4xl mb-6">
            Stop losing quote requests to voicemail.{' '}
            <span className="text-primary-500">Your chatbot captures them instead.</span>
          </H1>

          <p className="mx-auto max-w-2xl text-lg text-secondary-600 dark:text-secondary-400 mb-10">
            VocUI trains on your services, service area, and FAQ answers — so every website visitor
            gets an instant response, every quote request is captured, and your engineers spend their
            time on jobs rather than phone calls.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="xl" asChild>
              <Link href="/signup">
                Build Your Electrician Chatbot Free
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button size="xl" variant="outline" asChild>
              <Link href="/pricing">See Pricing</Link>
            </Button>
          </div>

          <p className="text-sm text-secondary-500 dark:text-secondary-400">
            Captures quote requests 24/7 &middot; Trained only on your business content &middot; GDPR-compliant
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
            <Badge variant="outline" className="mb-4">The lead loss problem</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              Most electrical businesses lose leads before they ever talk to a customer
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              Not because the work isn&apos;t good enough. Because there&apos;s no system to handle
              the same questions and quote requests that arrive every day — so prospects go to whoever
              picks up first.
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
              Everything an electrical business chatbot actually needs
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              Built for trade businesses — not a generic widget bolted onto your site.
              Every feature is aimed at capturing more leads and getting your engineers on more jobs.
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
              <Badge variant="outline" className="mb-8">From an electrical business using VocUI</Badge>
              <blockquote className="text-2xl font-semibold text-secondary-900 dark:text-secondary-100 leading-snug mb-6">
                &ldquo;We were losing at least three quote requests a week to voicemail. VocUI captures
                them overnight now — I check my inbox in the morning and the leads are already there,
                with the job details filled in.&rdquo;
              </blockquote>
              <p className="text-secondary-500 dark:text-secondary-400 text-sm">
                D.H. &mdash; Owner, Independent Electrical Contractor
              </p>
            </div>
          </div>
        </section>

        {/* ── Who It's For ────────────────────────────────────────────────────── */}
        <section className="container mx-auto px-4 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">Who it&apos;s for</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              For electrical businesses that want their engineers on jobs, not answering phones
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              If you&apos;re losing quote requests to voicemail or spending time triaging calls that
              a chatbot could handle, VocUI pays for itself the moment you land your first overnight lead.
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
                { label: 'Chatbot for Plumbers', href: '/chatbot-for-plumbers', description: 'Emergency booking and service FAQ for plumbing businesses.' },
                { label: 'Chatbot for HVAC Companies', href: '/chatbot-for-hvac', description: 'Maintenance booking and emergency support for HVAC businesses.' },
                { label: 'Chatbot for Cleaning Services', href: '/chatbot-for-cleaning-services', description: 'Booking and pricing FAQ for cleaning and property services.' },
                { label: 'Chatbot for Landscapers', href: '/chatbot-for-landscapers', description: 'Quote capture and seasonal services FAQ for landscaping businesses.' },
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
                Your next job is sitting in someone&apos;s voicemail right now
              </h2>
              <p className="text-lg text-white/80 mb-2 max-w-xl mx-auto">
                Give every website visitor an instant response and let your chatbot capture leads while you focus on the work.
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
                    Build Your Electrician Chatbot Free
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
