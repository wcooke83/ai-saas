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
  MessageSquare,
  MoonStar,
  ClipboardList,
  BookOpen,
  CalendarCheck,
  Clock,
  UserCheck,
  ShieldCheck,
  Building2,
  Receipt,
  TrendingUp,
  FileSearch,
} from 'lucide-react';

// ─── Metadata ──────────────────────────────────────────────────────────────────

export function generateMetadata(): Metadata {
  return {
    title: 'AI Chatbot for Accountancy Firms | Services FAQ & New Client Intake | VocUI',
    description:
      'Automate services FAQ and new client intake with an AI chatbot trained on your firm. Answer pricing questions 24/7 and qualify prospects before the first call.',
    keywords: [
      'AI chatbot for accountancy firms',
      'accounting chatbot',
      'client intake automation',
      'accountant FAQ chatbot',
      'tax season chatbot',
      'tax FAQ chatbot',
      'tax FAQ automation',
    ],
    openGraph: {
      title: 'AI Chatbot for Accountancy Firms | Services FAQ & New Client Intake | VocUI',
      description:
        'Automate services FAQ and new client intake with an AI chatbot trained on your firm. Answer pricing questions 24/7 and qualify prospects before the first call.',
      url: 'https://vocui.com/chatbot-for-accountancy-firms',
      siteName: 'VocUI',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'AI Chatbot for Accountancy Firms | Services FAQ & New Client Intake | VocUI',
      description:
        'Automate services FAQ and new client intake with an AI chatbot trained on your firm. Answer pricing questions 24/7 and qualify prospects before the first call.',
    },
    alternates: {
      canonical: 'https://vocui.com/chatbot-for-accountancy-firms',
    },
    robots: { index: true, follow: true },
  };
}

// ─── Structured Data ───────────────────────────────────────────────────────────

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'VocUI — AI Chatbot for Accountancy Firms',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  description:
    'AI chatbot that handles services FAQ and new client intake for accountancy firms — trained on your approved content, available 24/7.',
  url: 'https://vocui.com/chatbot-for-accountancy-firms',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    description: 'Free plan available',
  },
  featureList: [
    'Knowledge base trained on your firm content',
    'Automated new client intake screening',
    'Tax season FAQ automation',
    'Appointment booking via Easy!Appointments',
    '24/7 after-hours availability',
    'Live accountant handoff',
    'GDPR-compliant data handling',
  ],
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Can the chatbot answer questions about tax deadlines and self-assessment?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Upload your tax calendar, key deadlines (January 31, July 31, corporation tax due dates), and self-assessment FAQ and the chatbot answers these questions automatically — especially useful during peak January enquiry volume."
      }
    },
    {
      "@type": "Question",
      "name": "Will VocUI handle new client intake for an accountancy firm?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. It answers questions about your services, which business sizes you work with, your fee structure, and what a new client onboarding looks like — qualifying enquiries before they reach your accountants."
      }
    },
    {
      "@type": "Question",
      "name": "Can the chatbot explain the difference between bookkeeping, management accounts, and year-end accounts?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, if you upload service descriptions for each. The chatbot explains what each service involves and who it's for, helping prospective clients understand what they need before they call."
      }
    },
    {
      "@type": "Question",
      "name": "Will VocUI book initial consultations with our accountants?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, via Easy!Appointments. Business owners can schedule a new client meeting directly from the chat — reducing the email back-and-forth that delays new client conversion."
      }
    }
  ]
};

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://vocui.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Industries",
      "item": "https://vocui.com/industries"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "AI Chatbot for Accountancy Firms",
      "item": "https://vocui.com/chatbot-for-accountancy-firms"
    }
  ]
};



// ─── Data ──────────────────────────────────────────────────────────────────────

const trustSignals = [
  'Answers services & pricing questions 24/7',
  'Trained only on your approved firm content',
  'GDPR-compliant data handling',
];

const painPoints: Array<{ icon: ElementType; title: string; body: ReactNode }> = [
  {
    icon: MessageSquare,
    title: 'The same services and pricing questions, every week',
    body: 'Do you handle self-assessment returns? What does bookkeeping cost? Do you work with limited companies? Your team fields these before a single engagement letter is signed.',
  },
  {
    icon: MoonStar,
    title: 'After-hours enquiries during tax season go unanswered',
    body: <span>Sole traders and business owners research accountants outside office hours. Without a live response, they move to the next firm on the search results page. <a href="https://www.salesloft.com/resources/guides/conversational-ai-marketing-trends-report" target="_blank" rel="noopener noreferrer" className="underline decoration-dotted hover:text-primary-500 transition-colors">41% of all meetings are booked outside standard business hours.</a></span>,
  },
  {
    icon: ClipboardList,
    title: 'Manual client onboarding Q&A slows down new business',
    body: 'Every new client needs onboarding. When that happens through back-and-forth emails, it delays engagement starts and ties up your senior staff unnecessarily.',
  },
];

const steps = [
  {
    step: '01',
    title: 'Upload your firm content',
    description:
      'Add your service pages, pricing guides, FAQ documents, and onboarding materials. Your chatbot learns your service offering and answers accordingly.',
  },
  {
    step: '02',
    title: 'Configure intake questions',
    description:
      'Set the qualifying questions new client prospects should answer — business type, turnover band, services needed. Your chatbot asks them before you speak.',
  },
  {
    step: '03',
    title: 'Embed and capture new clients',
    description:
      'Go live on your website. Prospects get instant answers; qualified leads book a discovery call directly from the chat window.',
  },
];

const features = [
  {
    icon: BookOpen,
    name: 'Trained on your services content',
    description:
      'Your chatbot answers from your own service descriptions, pricing tiers, and FAQ docs — never guessed or fabricated.',
  },
  {
    icon: ClipboardList,
    name: 'Automated new client intake',
    description:
      'Collect business type, turnover, and services needed before the first call. Arrive at discovery meetings already prepared.',
  },
  {
    icon: CalendarCheck,
    name: 'Discovery call booking',
    description:
      'Connect to your calendar via Easy!Appointments. Qualified prospects book their first meeting directly from the chat.',
  },
  {
    icon: Clock,
    name: 'Tax season FAQ on autopilot',
    description:
      'Load your deadline calendar, document checklists, and self-assessment FAQs once. Same questions every January and April — handled automatically, without extra headcount.',
  },
  {
    icon: UserCheck,
    name: 'Handoff to your accountants',
    description:
      'Complex queries escalate to the right team member with full conversation context, so nothing is repeated.',
  },
  {
    icon: ShieldCheck,
    name: 'GDPR-compliant data handling',
    description:
      'Visitor data is handled per GDPR. Data processing agreements available for Enterprise customers.',
  },
];

const verticals = [
  {
    icon: Building2,
    title: 'SME Accounting',
    description:
      'Handle company accounts, VAT registration, payroll, and bookkeeping enquiries before the first consultation.',
  },
  {
    icon: Receipt,
    title: 'Sole Trader & Freelancer Accounting',
    description:
      'Answer self-assessment, expenses, and IR35 questions that sole traders search for outside office hours.',
  },
  {
    icon: TrendingUp,
    title: 'Tax Advisory',
    description:
      'Qualify prospects on complexity and service scope before engaging a senior tax advisor.',
  },
  {
    icon: FileSearch,
    title: 'Audit & Compliance',
    description:
      'Answer statutory audit threshold questions, timelines, and document requirements automatically.',
  },
];

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ChatbotForAccountancyFirmsPage() {
  return (
    <PageBackground>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <Header />

      <main id="main-content">
        <nav aria-label="Breadcrumb" className="container mx-auto px-4 pt-6 pb-2">
          <ol className="flex items-center gap-2 text-sm text-secondary-500 dark:text-secondary-400">
            <li><Link href="/" className="hover:text-primary-500 transition-colors">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href="/industries" className="hover:text-primary-500 transition-colors">Industries</Link></li>
            <li aria-hidden="true">/</li>
            <li className="text-secondary-900 dark:text-secondary-100 font-medium">AI Chatbot for Accountancy Firms</li>
          </ol>
        </nav>


        {/* ── Hero ────────────────────────────────────────────────────────────── */}
        <section className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center container mx-auto px-4 py-16 text-center">
          <Badge className="mb-6">AI Chatbot for Accountancy Firms</Badge>

          <H1 className="max-w-4xl mb-6">
            Your prospects ask the same accounting questions every week.{' '}
            <span className="text-primary-500">Your chatbot can answer them.</span>
          </H1>

          <p className="mx-auto max-w-2xl text-lg text-secondary-600 dark:text-secondary-400 mb-10">
            VocUI trains on your firm&apos;s services, pricing, and onboarding content — so your
            team spends less time on repetitive enquiries and more time on client work that matters.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="xl" asChild>
              <Link href="/signup">
                Build Your Accounting Chatbot Free
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button size="xl" variant="outline" asChild>
              <Link href="/pricing">See Pricing</Link>
            </Button>
          </div>

          <p className="text-sm text-secondary-500 dark:text-secondary-400">
            Answers services &amp; pricing questions 24/7 &middot; Trained only on your approved firm content &middot; GDPR-compliant
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
            <Badge variant="outline" className="mb-4">The enquiry problem</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              Your accountants are fielding questions a FAQ page could handle
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              Not because your team is inefficient. Because there&apos;s no system to handle
              repetitive prospect enquiries — so every question lands in someone&apos;s inbox.
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
                Live before your next client meeting. No developers needed.
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
              Everything an accountancy intake chatbot actually needs
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              Built for accounting firm intake — not a generic chatbot bolted onto your website.
              Every feature is aimed at qualifying leads and freeing your team&apos;s time.
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

        {/* ── How Businesses Use VocUI ────────────────────────────────────────── */}
        <section className="bg-secondary-50 dark:bg-secondary-800/30 py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-10">
                <Badge variant="outline" className="mb-4">How accountancy firms use VocUI</Badge>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
                  A typical week, before and after VocUI
                </h2>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  { step: 'Before', text: 'During tax season, staff fielding the same questions about self-assessment deadlines, document checklists, and fees every day — interrupting client work to answer enquiries that could have been self-served.' },
                  { step: 'Setup', text: 'Uploaded their services brochure, fee guide, onboarding checklist, and a FAQ covering common tax questions — configured in under an hour.' },
                  { step: 'After', text: 'Prospective clients get fee and scope answers instantly. New client onboarding queries handled automatically. Accountants start client calls better prepared.' },
                ].map((item) => (
                  <div key={item.step} className="bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-xl p-5">
                    <p className="text-xs font-semibold uppercase tracking-widest text-primary-600 dark:text-primary-400 mb-2">{item.step}</p>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400 leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Who It's For ────────────────────────────────────────────────────── */}
        <section className="container mx-auto px-4 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">Who it&apos;s for</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              For accountancy firms that want their team focused on client work
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              If your team is spending time answering questions any chatbot could handle,
              VocUI pays for itself before the first client hour it frees up.
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
                { label: 'Chatbot for Law Firms', href: '/chatbot-for-lawyers', description: 'Client intake, practice area FAQ, and consultation booking.' },
                { label: 'Chatbot for Financial Advisors', href: '/chatbot-for-financial-advisors', description: 'Service FAQ and consultation booking for financial advisers.' },
                { label: 'Chatbot for Insurance Agents', href: '/chatbot-for-insurance-agents', description: 'Policy FAQ and quote lead capture for insurance professionals.' },
                { label: 'Chatbot for Mortgage Brokers', href: '/chatbot-for-mortgage-brokers', description: 'Rate FAQ and application lead capture for mortgage brokers.' },
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
                Stop answering the same questions every tax season
              </h2>
              <p className="text-lg text-white/80 mb-2 max-w-xl mx-auto">
                Build a chatbot that qualifies new clients and answers FAQ — so your firm can focus on the work that actually requires an accountant.
              </p>
              <p className="text-sm text-white/60 mb-10">
                Free plan available &middot; No credit card required &middot; Trained on your firm content only
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="xl"
                  variant="secondary"
                  className="bg-white text-primary-600 hover:bg-primary-50 font-semibold"
                  asChild
                >
                  <Link href="/signup">
                    Build Your Accounting Chatbot Free
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

      
          {/* Related Blog Post */}
          <div className="mt-6 mb-2 rounded-xl border border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-800/50 p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary-600 dark:text-primary-400 mb-2">Related reading</p>
            <Link href="/blog/chatbot-for-accounting-firms" className="font-semibold text-secondary-900 dark:text-secondary-100 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              AI Chatbots for Accounting Firms: Client Self-Service →
            </Link>
          </div>
      </main>

      <Footer />
    </PageBackground>
  );
}
