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
  UserX,
  Clock,
  Filter,
  Megaphone,
  ListChecks,
  Mail,
  Webhook,
  BarChart2,
  Globe,
  Home,
  Briefcase,
  MonitorSmartphone,
  Store,
} from 'lucide-react';

// ─── Metadata ──────────────────────────────────────────────────────────────────

export function generateMetadata(): Metadata {
  return {
    title: 'AI Lead Capture Chatbot | Turn Visitors Into Leads | VocUI',
    description:
      'Capture and qualify leads automatically with an AI chatbot. Engage visitors 24/7, collect contact info, and route hot leads to your sales team instantly.',
    keywords: [
      'AI lead capture chatbot',
      'lead generation chatbot',
      'website lead capture',
      'AI chatbot for leads',
      'automated lead qualification',
    ],
    openGraph: {
      title: 'AI Lead Capture Chatbot | Turn Visitors Into Leads | VocUI',
      description:
        'Capture and qualify leads automatically with an AI chatbot. Engage visitors 24/7, collect contact info, and route hot leads to your sales team instantly.',
      url: 'https://vocui.com/chatbot-for-lead-capture',
      siteName: 'VocUI',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'AI Lead Capture Chatbot | Turn Visitors Into Leads | VocUI',
      description:
        'Capture and qualify leads automatically with an AI chatbot. Engage visitors 24/7, collect contact info, and route hot leads to your sales team instantly.',
    },
    alternates: {
      canonical: 'https://vocui.com/chatbot-for-lead-capture',
    },
  };
}

// ─── Structured Data ───────────────────────────────────────────────────────────

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'VocUI — AI Lead Capture Chatbot',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  description:
    'AI chatbot that captures and qualifies leads from your website automatically.',
  url: 'https://vocui.com/chatbot-for-lead-capture',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

// ─── Data ──────────────────────────────────────────────────────────────────────

const trustSignals = [
  'Engages visitors before they bounce',
  'Qualifies leads automatically',
  'Routes hot leads to your team instantly',
];

const painPoints: Array<{ icon: ElementType; title: string; body: ReactNode }> = [
  {
    icon: UserX,
    title: 'Visitors browse and bounce',
    body: '98% of website visitors leave without converting. A contact form buried on your "Contact" page captures almost none of them.',
  },
  {
    icon: Clock,
    title: 'Slow follow-up kills deals',
    body: <span><a href="https://livechatai.com/blog/customer-support-response-time-statistics" target="_blank" rel="noopener noreferrer" className="underline decoration-dotted hover:text-primary-500 transition-colors">Responding to a lead within 5 minutes makes you 9x more likely to close.</a> Most businesses respond in hours — or not at all.</span>,
  },
  {
    icon: Filter,
    title: 'Your sales team wastes time on unqualified leads',
    body: 'Without qualification, your team chases every inquiry equally — spending hours on leads that were never a fit.',
  },
];

const steps = [
  {
    step: '01',
    title: 'Train on your offer',
    description:
      'Add your service pages, pricing FAQs, and case studies. Your chatbot learns what you do and who you help — and can answer questions instantly.',
  },
  {
    step: '02',
    title: 'Set up your capture flow',
    description:
      'Configure proactive triggers (time on page, scroll depth, exit intent) and define what information to collect: name, email, company, budget, timeline.',
  },
  {
    step: '03',
    title: 'Connect to your workflow',
    description:
      'Captured leads show up in your VocUI dashboard. Hot leads can trigger webhooks to your CRM or notify your team via Slack.',
  },
];

const features = [
  {
    icon: Megaphone,
    name: 'Proactive messaging',
    description:
      'Trigger messages based on scroll depth, time on page, URL, or exit intent. Reach visitors at the right moment — before they leave.',
  },
  {
    icon: ListChecks,
    name: 'Lead qualification',
    description:
      'Ask qualifying questions in natural conversation. Capture budget, timeline, company size, or any custom field you need.',
  },
  {
    icon: Mail,
    name: 'Contact capture',
    description:
      'Collect name, email, and phone naturally in conversation — no cold forms, no friction.',
  },
  {
    icon: Webhook,
    name: 'Webhook integrations',
    description:
      'Push lead data to your CRM, Slack, or any webhook endpoint the moment a lead qualifies.',
  },
  {
    icon: BarChart2,
    name: 'Conversation surveys',
    description:
      'Run NPS surveys, gather product feedback, or score intent — all inside the same chat window.',
  },
  {
    icon: Globe,
    name: 'Multi-channel deployment',
    description:
      'Deploy the same lead capture chatbot on your website, Slack workspace, or Telegram channel.',
  },
];

const testimonials = [
  {
    quote:
      "We used to miss after-hours inquiries entirely. Now the chatbot handles them automatically — patients get answers and we get the lead captured before the next morning.",
    name: 'J.D.',
    role: 'Owner, Dental Clinic',
  },
  {
    quote:
      "VocUI handles all the eligibility questions we used to answer manually on every intake call. By the time a prospect books with us, they're already pre-qualified.",
    name: 'S.C.',
    role: 'Managing Partner, Law Firm',
  },
];

const verticals = [
  {
    icon: Home,
    title: 'Real Estate',
    description:
      'Qualify buyers and sellers 24/7. Capture property preferences, budget range, and timeline before your first call.',
  },
  {
    icon: Briefcase,
    title: 'Professional Services',
    description:
      'Lawyers, consultants, and advisors: qualify prospects on your intake criteria before they book a discovery call.',
  },
  {
    icon: MonitorSmartphone,
    title: 'B2B SaaS',
    description:
      'Engage trial users, capture upgrade intent, and qualify enterprise leads — without adding sales headcount.',
  },
  {
    icon: Store,
    title: 'Local Businesses',
    description:
      'Capture quote requests, service inquiries, and appointment interest — even when your office is closed.',
  },
];

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ChatbotForLeadCapturePage() {
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
          <Badge className="mb-6">AI Lead Generation</Badge>

          <H1 className="max-w-4xl mb-6">
            Your website has visitors. Your chatbot should be{' '}
            <span className="text-primary-500">turning them into leads.</span>
          </H1>

          <p className="mx-auto max-w-2xl text-lg text-secondary-600 dark:text-secondary-400 mb-10">
            VocUI proactively engages visitors, qualifies their intent, and captures contact
            details — 24/7, without a salesperson on standby.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="xl" asChild>
              <Link href="/signup">
                Build Your Lead Capture Chatbot Free
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button size="xl" variant="outline" asChild>
              <Link href="/pricing">See Pricing</Link>
            </Button>
          </div>

          <p className="text-sm text-secondary-500 dark:text-secondary-400">
            Free plan available &middot; No credit card required &middot; Live in under an hour
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
            <Badge variant="outline" className="mb-4">The lead capture problem</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              Most of your website visitors leave without ever telling you who they are
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              Not because they aren&apos;t interested. Because nothing on your site gave them
              a reason to identify themselves at the right moment.
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
                Start capturing leads in under an hour
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
                  Start Capturing Leads Free
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* ── Features ────────────────────────────────────────────────────────── */}
        <section className="container mx-auto px-4 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">Built for pipeline</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              Everything you need to convert visitors into pipeline
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              Not just a chat widget. A full lead engine — from first message to qualified
              contact in your CRM.
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
                Teams that stopped letting leads slip away
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
              {testimonials.map((t) => (
                <div
                  key={t.name}
                  className="bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-xl p-8 hover:border-primary-200 dark:hover:border-primary-700 transition-colors"
                >
                  <p className="text-secondary-700 dark:text-secondary-300 leading-relaxed mb-6 italic">
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
                Turn browsers into buyers, across every industry
              </h2>
              <p className="text-secondary-600 dark:text-secondary-400">
                If your website gets traffic, VocUI gives every visitor a reason to identify themselves.
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

        <section className="container mx-auto px-4 py-16">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-6">Related industries</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: 'Chatbot for SaaS Companies', href: '/chatbot-for-saas', description: 'Product FAQ and trial lead capture for SaaS businesses.' },
                { label: 'Chatbot for E-commerce', href: '/chatbot-for-ecommerce', description: 'Product Q&A and support deflection for online retailers.' },
                { label: 'Chatbot for Real Estate', href: '/chatbot-for-real-estate', description: '24/7 lead capture and viewing bookings for estate agents.' },
                { label: 'Chatbot for Marketing Agencies', href: '/chatbot-for-marketing-agencies', description: 'Service FAQ and proposal lead capture for marketing agencies.' },
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
                Stop letting warm leads walk out the door
              </h2>
              <p className="text-lg text-white/80 mb-2 max-w-xl mx-auto">
                Build a chatbot that engages every visitor and captures the ones worth following up with.
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
                    Build Your Lead Capture Chatbot Free
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
