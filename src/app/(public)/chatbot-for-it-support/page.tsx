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
  Ticket,
  MoonStar,
  AlertCircle,
  BookOpen,
  Search,
  Clock,
  UserCheck,
  ShieldCheck,
  ListChecks,
  LifeBuoy,
  Server,
  Building2,
} from 'lucide-react';

// ─── Metadata ──────────────────────────────────────────────────────────────────

export function generateMetadata(): Metadata {
  return {
    title: 'AI Chatbot for IT Support Teams | Ticket Deflection & Troubleshooting FAQ | VocUI',
    description:
      'Deflect tier-1 IT tickets before they reach your engineers. VocUI trains on your knowledge base and resolves password resets, VPN issues, and printer FAQs 24/7.',
    keywords: [
      'AI chatbot for IT support',
      'IT helpdesk chatbot',
      'ticket deflection chatbot',
      'IT troubleshooting FAQ',
      'help desk automation',
    ],
    openGraph: {
      title: 'AI Chatbot for IT Support Teams | Ticket Deflection & Troubleshooting FAQ | VocUI',
      description:
        'Deflect tier-1 IT tickets before they reach your engineers. VocUI trains on your knowledge base and resolves password resets, VPN issues, and printer FAQs 24/7.',
      url: 'https://vocui.com/chatbot-for-it-support',
      siteName: 'VocUI',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'AI Chatbot for IT Support Teams | Ticket Deflection & Troubleshooting FAQ | VocUI',
      description:
        'Deflect tier-1 IT tickets before they reach your engineers. VocUI trains on your knowledge base and resolves password resets, VPN issues, and printer FAQs 24/7.',
    },
    alternates: {
      canonical: 'https://vocui.com/chatbot-for-it-support',
    },
    robots: { index: true, follow: true },
  };
}

// ─── Structured Data ───────────────────────────────────────────────────────────

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'VocUI — AI Chatbot for IT Support Teams',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  description:
    'AI chatbot that deflects tier-1 IT support tickets, guides users through troubleshooting steps, and escalates complex issues to engineers — 24/7, trained on your internal knowledge base.',
  url: 'https://vocui.com/chatbot-for-it-support',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    description: 'Free plan available',
  },
  featureList: [
    'Tier-1 ticket deflection',
    'Step-by-step troubleshooting guides',
    'Knowledge base search',
    '24/7 self-service support',
    'Escalation to tech team with full context',
    'Common issue FAQ automation',
  ],
};

// ─── Data ──────────────────────────────────────────────────────────────────────

const trustSignals = [
  'Deflects tier-1 tickets before they reach engineers',
  'Trained only on your internal knowledge base',
  'GDPR-compliant data handling',
];

const painPoints: Array<{ icon: ElementType; title: string; body: ReactNode }> = [
  {
    icon: Ticket,
    title: 'Tier-1 tickets are eating your senior engineers\u2019 time',
    body: <span>Password resets, software installation requests, and VPN troubleshooting do not need a senior engineer. <a href="https://www.zendesk.com/blog/ticket-deflection-currency-self-service/" target="_blank" rel="noopener noreferrer" className="underline decoration-dotted hover:text-primary-500 transition-colors">Well-designed self-service deflects 40–60% of incoming tickets</a> — without it, every trivial request lands in the same queue as your actual incidents.</span>,
  },
  {
    icon: AlertCircle,
    title: 'The same five issues appear in your ticket queue every single week',
    body: 'VPN won\'t connect. Printer offline. Outlook not syncing. Your team knows the fix by heart — and yet they type it out again and again. There is no reason a human should be doing this.',
  },
  {
    icon: MoonStar,
    title: 'After-hours outages have no self-service path',
    body: <span>An employee working late hits a blocker. IT is offline. <a href="https://www.gartner.com/en/newsroom/press-releases/2025-03-05-gartner-predicts-agentic-ai-will-autonomously-resolve-80-percent-of-common-customer-service-issues-without-human-intervention-by-20290" target="_blank" rel="noopener noreferrer" className="underline decoration-dotted hover:text-primary-500 transition-colors">Gartner predicts AI will autonomously resolve 80% of common support issues by 2029</a> — without a self-service path, every documented fix still pulls someone out of sleep.</span>,
  },
];

const steps = [
  {
    step: '01',
    title: 'Train on your knowledge base',
    description:
      'Upload your internal IT runbooks, troubleshooting guides, FAQs, and support documentation. Your chatbot learns your systems and gives step-by-step answers from your own verified content.',
  },
  {
    step: '02',
    title: 'Define escalation thresholds',
    description:
      'Set clear rules for when the chatbot resolves the issue itself and when it escalates to a human engineer — with the full conversation and attempted steps already attached to the ticket.',
  },
  {
    step: '03',
    title: 'Deploy to your help desk',
    description:
      'Embed on your internal portal, intranet, or Slack workspace. Employees self-serve instantly. Engineers only see tickets that actually need them.',
  },
];

const features = [
  {
    icon: Ticket,
    name: 'Tier-1 ticket deflection',
    description:
      'Resolve password resets, software FAQs, access requests, and common connectivity issues before they ever reach your queue.',
  },
  {
    icon: ListChecks,
    name: 'Step-by-step troubleshooting',
    description:
      'Walk users through guided fix sequences — not just "have you tried turning it off?" but the actual documented resolution path your engineers would follow.',
  },
  {
    icon: Search,
    name: 'Knowledge base search',
    description:
      'Surface the right runbook, guide, or FAQ article from your internal documentation in seconds — no more hunting through Confluence.',
  },
  {
    icon: Clock,
    name: '24/7 self-service support',
    description:
      'Employees and end users get help at any hour. Reduce after-hours escalations and the overnight ticket backlog your team wakes up to.',
  },
  {
    icon: UserCheck,
    name: 'Smart escalation to engineers',
    description:
      'Complex or unresolved issues route to your tech team with the full troubleshooting history attached — no re-explaining from the user, no context lost.',
  },
  {
    icon: BookOpen,
    name: 'Common issue FAQ',
    description:
      'Build a living FAQ from your most frequent support requests. Update it once and every employee gets the current answer immediately.',
  },
];

const verticals = [
  {
    icon: LifeBuoy,
    title: 'Help Desk',
    description:
      'Cut first-response time to zero for common issues and let your agents focus on tickets that need human problem-solving.',
  },
  {
    icon: Server,
    title: 'Internal IT',
    description:
      'Give employees a self-service first stop before they ping the IT team directly, preserving engineer focus for real incidents.',
  },
  {
    icon: ShieldCheck,
    title: 'MSP / Outsourced Support',
    description:
      'Scale tier-1 support across multiple client environments without proportionally scaling headcount.',
  },
  {
    icon: Building2,
    title: 'SaaS Support Teams',
    description:
      'Deflect product how-to questions and common setup issues before they reach your support agents.',
  },
];

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ChatbotForITSupportPage() {
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
          <Badge className="mb-6">AI Chatbot for IT Support Teams</Badge>

          <H1 className="max-w-4xl mb-6">
            Your engineers are solving the same IT issues every week.{' '}
            <span className="text-primary-500">Let a chatbot handle them.</span>
          </H1>

          <p className="mx-auto max-w-2xl text-lg text-secondary-600 dark:text-secondary-400 mb-10">
            VocUI trains on your internal IT knowledge base — runbooks, FAQs, troubleshooting
            guides — so tier-1 tickets resolve themselves before they ever reach your team.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="xl" asChild>
              <Link href="/signup">
                Build Your IT Support Chatbot Free
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button size="xl" variant="outline" asChild>
              <Link href="/pricing">See Pricing</Link>
            </Button>
          </div>

          <p className="text-sm text-secondary-500 dark:text-secondary-400">
            Deflects tier-1 tickets 24/7 &middot; Trained only on your internal knowledge base &middot; GDPR-compliant
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
            <Badge variant="outline" className="mb-4">The ticket volume problem</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              Skilled engineers should not be spending their day on password resets
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              The problem is not that your team is slow. It is that there is no self-service layer
              between the user and the engineer — so everything, from genuine incidents to trivial
              FAQs, lands in the same queue.
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
              Everything an IT support chatbot actually needs
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              Built for IT teams — not a generic widget with canned responses. Every feature is
              designed to reduce ticket volume and protect engineer focus time.
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
              <Badge variant="outline" className="mb-8">From an IT team using VocUI</Badge>
              <blockquote className="text-2xl font-semibold text-secondary-900 dark:text-secondary-100 leading-snug mb-6">
                &ldquo;We were closing 40% of our weekly tickets before lunch on Monday — all the same
                password and VPN questions from the weekend. VocUI handles those now. Our engineers
                actually get to focus on real problems.&rdquo;
              </blockquote>
              <p className="text-secondary-500 dark:text-secondary-400 text-sm">
                R.T. &mdash; IT Manager, 200-Person Technology Company
              </p>
            </div>
          </div>
        </section>

        {/* ── Who It's For ────────────────────────────────────────────────────── */}
        <section className="container mx-auto px-4 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">Who it&apos;s for</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              For IT teams that want to protect engineer time
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              If your best engineers are answering questions a self-service chatbot could resolve,
              VocUI recovers the focus time your team needs for actual engineering work.
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
                { label: 'Chatbot for SaaS Companies', href: '/chatbot-for-saas', description: 'Product FAQ and trial lead capture for SaaS businesses.' },
                { label: 'Chatbot for HR Departments', href: '/chatbot-for-hr', description: 'Employee policy FAQ and onboarding support for HR teams.' },
                { label: 'Chatbot for Recruiters', href: '/chatbot-for-recruiters', description: 'Job FAQ and candidate intake automation for recruitment firms.' },
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
                Your engineers&apos; time is too valuable for tier-1 tickets
              </h2>
              <p className="text-lg text-white/80 mb-2 max-w-xl mx-auto">
                Give users a self-service first stop and let your IT team focus on the issues that genuinely need their expertise.
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
                    Build Your IT Support Chatbot Free
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
