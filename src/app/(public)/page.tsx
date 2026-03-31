import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { H1 } from '@/components/ui/heading';
import { Header } from '@/components/layout';
import { Footer } from '@/components/ui/footer';
import { PageBackground } from '@/components/ui/page-background';
import {
  ArrowRight,
  Bot,
  MessageSquare,
  Globe,
  Zap,
  Shield,
  BarChart3,
  CalendarCheck,
  Users,
  Activity,
  Star,
  Building2,
  CheckCircle2,
  FileText,
  Code2,
  Megaphone,
  Languages,
  FormInput,
  Ticket,
  Layers,
} from 'lucide-react';

// ─── Data ──────────────────────────────────────────────────────────────────────

const differentiators = [
  {
    icon: CalendarCheck,
    headline: 'Book appointments without leaving the chat',
    body: 'Your chatbot checks real availability and confirms calendar bookings mid-conversation — no redirects, no friction, no follow-up email needed. Connects to Easy!Appointments out of the box.',
    badge: 'In-chat booking',
  },
  {
    icon: Users,
    headline: 'Live agent handoff that fits how your team already works',
    body: 'When a conversation needs a human, agents take over instantly. The agent console embeds in any internal tool via SDK — your team never has to log into a separate platform.',
    badge: 'Embeddable agent console',
  },
  {
    icon: Activity,
    headline: 'See exactly where every millisecond goes',
    body: 'A Firefox-style waterfall chart breaks your RAG pipeline into 10+ labeled stages — retrieval, rerank, generation, fallback. Find bottlenecks instead of guessing.',
    badge: 'Performance telemetry',
  },
];

const supportingFeatures = [
  {
    icon: Megaphone,
    name: 'Proactive Messaging',
    description: '8 trigger types — exit intent, scroll depth, idle, time on page, and custom events. Reach visitors before they leave.',
  },
  {
    icon: BarChart3,
    name: 'Sentiment & Loyalty Scoring',
    description: 'Per-visitor sentiment tracking with loyalty scores. Know which conversations are high-risk before they escalate.',
  },
  {
    icon: Globe,
    name: 'Multi-Channel Deploy',
    description: 'JS widget, iFrame, Slack, Telegram, or REST API. One chatbot, every channel where your customers are.',
  },
  {
    icon: FileText,
    name: 'Train on Anything',
    description: 'URLs (with crawl), PDFs, DOCX, raw text, and Q&A pairs. Live fetch fallback keeps answers current even after training.',
  },
  {
    icon: Code2,
    name: 'Authenticated Context',
    description: 'Pass user account data into the chatbot at session start. It already knows who it\'s talking to.',
  },
  {
    icon: FormInput,
    name: 'Lead Capture & Surveys',
    description: 'Pre-chat forms, post-chat surveys, lead export. Capture and qualify visitors without a separate tool.',
  },
  {
    icon: Ticket,
    name: 'Support Ticketing',
    description: 'Built-in contact form, ticket creation, and escalation workflows — the full support loop without a third-party helpdesk.',
  },
  {
    icon: Languages,
    name: '20+ Languages',
    description: 'Full multi-language support with translation validation. Serve international customers without duplicating your knowledge base.',
  },
  {
    icon: Layers,
    name: 'Full Widget Customization',
    description: 'Colors, fonts, border radius, position, auto-open behavior, and dark mode — styled to match your brand exactly.',
  },
];

const steps = [
  {
    step: '01',
    title: 'Train on your knowledge base',
    description: 'Paste URLs to crawl, upload PDFs and DOCX files, or write Q&A pairs directly. Your chatbot is ready to answer questions in minutes, not days.',
  },
  {
    step: '02',
    title: 'Customize the experience',
    description: 'Match your brand exactly — colors, fonts, position, dark mode. Add a pre-chat form to capture leads, or configure proactive triggers to start conversations.',
  },
  {
    step: '03',
    title: 'Deploy wherever your customers are',
    description: 'One line of JS for your website, or connect to Slack and Telegram. The REST API and embeddable agent console let you wire it into any existing stack.',
  },
];

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

const trustSignals = [
  'No credit card required',
  '14-day money-back guarantee',
  'Deploy in under an hour',
  'SOC 2-grade infrastructure',
];

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <PageBackground>
      <Header />

      <main id="main-content">

        {/* ── Hero ──────────────────────────────────────────────────────────── */}
        <section className="min-h-[calc(100vh-4rem)] flex items-center container mx-auto px-4 py-16">
          <div className="grid lg:grid-cols-2 gap-12 xl:gap-20 items-center w-full">

            {/* Left column */}
            <div className="flex flex-col items-start text-left">
              <Badge className="mb-6">AI Customer Support, Done Right</Badge>

              <H1 className="mb-6">
                Stop answering the same questions twice.{' '}
                <span className="text-primary-500">Your knowledge base</span>{' '}
                becomes a chatbot that handles it.
              </H1>

              <p className="text-lg text-secondary-600 dark:text-secondary-400 mb-10 max-w-xl">
                VocUI turns your docs, URLs, and FAQs into an AI chatbot that deflects support tickets,
                captures leads, and books appointments — deployed on your site in under an hour.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button size="xl" asChild>
                  <Link href="/signup">
                    Build Your Chatbot Free
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button size="xl" variant="outline" asChild>
                  <Link href="/pricing">See Pricing</Link>
                </Button>
              </div>

              <p className="text-sm text-secondary-500 dark:text-secondary-400">
                No credit card required &mdash; free plan available
              </p>
            </div>

            {/* Right column — chat widget mockup */}
            <div className="hidden lg:flex items-center justify-center">
              <div className="relative w-full max-w-sm rotate-1 hover:rotate-0 transition-transform duration-500">
                {/* Drop shadow layer */}
                <div className="absolute inset-0 rounded-2xl bg-primary-500/10 blur-2xl scale-105" aria-hidden="true" />

                {/* Card */}
                <div className="relative rounded-2xl border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-900 shadow-2xl overflow-hidden">

                  {/* Browser chrome */}
                  <div className="flex items-center gap-1.5 px-4 py-3 bg-secondary-50 dark:bg-secondary-800 border-b border-secondary-200 dark:border-secondary-700">
                    <span className="w-3 h-3 rounded-full bg-red-400" aria-hidden="true" />
                    <span className="w-3 h-3 rounded-full bg-amber-400" aria-hidden="true" />
                    <span className="w-3 h-3 rounded-full bg-green-400" aria-hidden="true" />
                    <div className="ml-3 flex-1 h-5 rounded bg-secondary-200 dark:bg-secondary-700 flex items-center px-2">
                      <span className="text-xs text-secondary-400 dark:text-secondary-500 truncate">yoursite.com</span>
                    </div>
                  </div>

                  {/* Chat widget header */}
                  <div className="flex items-center gap-3 px-4 py-3 bg-primary-600">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white leading-none">VocUI Assistant</p>
                      <p className="text-xs text-white/70 mt-0.5">Online &bull; Typically replies instantly</p>
                    </div>
                  </div>

                  {/* Chat messages */}
                  <div className="px-4 py-4 space-y-3 bg-secondary-50 dark:bg-secondary-900/50 min-h-[200px]" role="log" aria-label="Sample chat conversation">
                    {/* Bot message */}
                    <div className="flex gap-2 items-end">
                      <div className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                        <Bot className="w-3 h-3 text-primary-500" />
                      </div>
                      <div className="bg-primary-500 text-white text-sm rounded-2xl rounded-bl-sm px-3 py-2 max-w-[80%] leading-relaxed shadow-sm">
                        Hi! I&apos;m trained on your knowledge base. How can I help you today?
                      </div>
                    </div>

                    {/* User message */}
                    <div className="flex justify-end">
                      <div className="bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 text-secondary-800 dark:text-secondary-200 text-sm rounded-2xl rounded-br-sm px-3 py-2 max-w-[80%] leading-relaxed shadow-sm">
                        What&apos;s your refund policy?
                      </div>
                    </div>

                    {/* Bot message */}
                    <div className="flex gap-2 items-end">
                      <div className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                        <Bot className="w-3 h-3 text-primary-500" />
                      </div>
                      <div className="bg-primary-500 text-white text-sm rounded-2xl rounded-bl-sm px-3 py-2 max-w-[80%] leading-relaxed shadow-sm">
                        We offer a 30-day money-back guarantee on all plans, no questions asked. Want me to start a refund for your account?
                      </div>
                    </div>

                    {/* User message */}
                    <div className="flex justify-end">
                      <div className="bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 text-secondary-800 dark:text-secondary-200 text-sm rounded-2xl rounded-br-sm px-3 py-2 max-w-[80%] leading-relaxed shadow-sm">
                        Yes please!
                      </div>
                    </div>
                  </div>

                  {/* Input bar */}
                  <div className="flex items-center gap-2 px-3 py-3 border-t border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-900">
                    <div className="flex-1 h-8 rounded-full bg-secondary-100 dark:bg-secondary-800 px-3 flex items-center">
                      <span className="text-xs text-secondary-400 dark:text-secondary-500">Type a message…</span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                      <ArrowRight className="w-4 h-4 text-white" />
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ── Trust Bar ─────────────────────────────────────────────────────── */}
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

        {/* ── Differentiators ───────────────────────────────────────────────── */}
        <section id="features" className="bg-secondary-50 dark:bg-secondary-800/30 py-24">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <Badge variant="outline" className="mb-4">Built different</Badge>
              <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
                Features that make VocUI earn its place on your stack
              </h2>
              <p className="text-secondary-600 dark:text-secondary-400">
                Most chatbot tools stop at Q&A. VocUI handles the full customer interaction loop.
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-3 max-w-6xl mx-auto">
              {differentiators.map((d) => {
                const Icon = d.icon;
                return (
                  <Card
                    key={d.headline}
                    className="border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 hover:shadow-lg hover:border-primary-200 dark:hover:border-primary-700 transition-all duration-200"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-900/50 flex-shrink-0">
                          <Icon className="h-5 w-5 text-primary-500" aria-hidden="true" />
                        </div>
                        <Badge variant="outline" className="text-xs whitespace-nowrap">
                          {d.badge}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg leading-snug">{d.headline}</CardTitle>
                      <CardDescription className="text-sm leading-relaxed mt-2">
                        {d.body}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Testimonials ──────────────────────────────────────────────────── */}
        <section className="container mx-auto px-4 py-24">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-2">
              Hear what users love
            </h2>
            <p className="text-secondary-500 dark:text-secondary-400">
              From solo founders to support teams at scale
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
            {testimonials.map((t) => (
              <div
                key={t.author}
                className="bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-600 rounded-xl p-6"
              >
                <div className="flex items-center gap-1 mb-4" aria-label="5 out of 5 stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" aria-hidden="true" />
                  ))}
                </div>
                <blockquote className="text-secondary-700 dark:text-secondary-300 mb-4 text-sm leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <div className="flex items-center gap-3">
                  <div
                    className={`flex-shrink-0 w-10 h-10 bg-gradient-to-br ${t.gradient} rounded-full flex items-center justify-center text-white font-bold text-sm`}
                    aria-hidden="true"
                  >
                    {t.initials}
                  </div>
                  <div>
                    <cite className="not-italic">
                      <strong className="text-sm text-secondary-900 dark:text-secondary-100 block">{t.author}</strong>
                      <span className="text-xs text-secondary-500 dark:text-secondary-400">{t.role}</span>
                    </cite>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Building2 className="w-3 h-3 text-secondary-400" aria-hidden="true" />
                      <span className="text-xs text-secondary-500 dark:text-secondary-400">{t.company}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── How It Works ──────────────────────────────────────────────────── */}
        <section className="container mx-auto px-4 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">How it works</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100">
              From zero to deployed in one afternoon
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
        </section>

        {/* ── Supporting Features Grid ──────────────────────────────────────── */}
        <section className="bg-secondary-50 dark:bg-secondary-800/30 py-24">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
                Everything the platform behind it needs
              </h2>
              <p className="text-secondary-600 dark:text-secondary-400">
                The capabilities your team will actually reach for — without stitching together five separate tools.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
              {supportingFeatures.map((f) => {
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
          </div>
        </section>

        {/* ── Final CTA ─────────────────────────────────────────────────────── */}
        <section className="container mx-auto px-4 py-20">
          <div className="max-w-3xl mx-auto">
            <div className="rounded-3xl bg-gradient-to-br from-primary-600 to-primary-800 p-12 text-center text-white shadow-xl shadow-primary-500/20">
              <h2 className="text-3xl font-bold mb-4">
                Your support team is answering questions a chatbot could handle.
              </h2>
              <p className="text-lg text-white/80 mb-2 max-w-xl mx-auto">
                Build a chatbot trained on your actual knowledge base — free, today, no credit card needed.
              </p>
              <p className="text-sm text-white/60 mb-10">
                Deflect tickets. Capture leads. Book appointments. All from one platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="xl"
                  variant="secondary"
                  className="bg-white text-primary-600 hover:bg-primary-50 font-semibold"
                  asChild
                >
                  <Link href="/signup">
                    Build Your Chatbot Free
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
              <p className="text-xs text-white/50 mt-6">No credit card required &mdash; 14-day money-back guarantee</p>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </PageBackground>
  );
}
