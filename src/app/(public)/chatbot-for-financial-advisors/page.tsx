import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { H1 } from '@/components/ui/heading';
import { Header } from '@/components/layout';
import { Footer } from '@/components/ui/footer';
import { PageBackground } from '@/components/ui/page-background';
import type { ReactNode, ElementType } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Phone,
  MoonStar,
  AlertCircle,
  BookOpen,
  CalendarCheck,
  Clock,
  UserCheck,
  TrendingUp,
  PiggyBank,
  BarChart2,
  FileText,
  Briefcase,
} from 'lucide-react';

// ─── Metadata ──────────────────────────────────────────────────────────────────

export function generateMetadata(): Metadata {
  return {
    title: 'AI Chatbot for Financial Advisors | Service FAQ & Consultation Booking | VocUI',
    description:
      'Let an AI chatbot handle service FAQs, consultation booking, and initial inquiries for your financial advisory practice — 24/7. Convert more prospects without more admin.',
    keywords: [
      'AI chatbot for financial advisors',
      'financial advisor chatbot',
      'consultation booking chatbot',
      'wealth management chatbot',
      'financial services automation',
    ],
    openGraph: {
      title: 'AI Chatbot for Financial Advisors | Service FAQ & Consultation Booking | VocUI',
      description:
        'Let an AI chatbot handle service FAQs, consultation booking, and initial inquiries for your financial advisory practice — 24/7. Convert more prospects without more admin.',
      url: 'https://vocui.com/chatbot-for-financial-advisors',
      siteName: 'VocUI',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'AI Chatbot for Financial Advisors | Service FAQ & Consultation Booking | VocUI',
      description:
        'Let an AI chatbot handle service FAQs, consultation booking, and initial inquiries for your financial advisory practice — 24/7. Convert more prospects without more admin.',
    },
    alternates: {
      canonical: 'https://vocui.com/chatbot-for-financial-advisors',
    },
    robots: { index: true, follow: true },
  };
}

// ─── Structured Data ───────────────────────────────────────────────────────────

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'VocUI — AI Chatbot for Financial Advisors',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  description:
    'AI chatbot that handles service FAQ, consultation booking, and initial prospect inquiries for financial advisors — 24/7, trained on your firm content only.',
  url: 'https://vocui.com/chatbot-for-financial-advisors',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    description: 'Free plan available',
  },
  featureList: [
    'Knowledge base trained on your firm content',
    'Consultation booking integration',
    'Service and process FAQ automation',
    '24/7 after-hours availability',
    'Advisor escalation with full conversation context',
    'GDPR-compliant data handling',
  ],
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Will VocUI give financial advice or make investment recommendations?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. VocUI answers only from your approved content. It explains your services, the types of clients you work with, and your process — but never gives regulated financial advice, recommends products, or makes projections. Those conversations happen with your advisors."
      }
    },
    {
      "@type": "Question",
      "name": "Can the chatbot explain the difference between your service offerings?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Upload your service descriptions — retirement planning, wealth management, protection planning, mortgage advice — and the chatbot explains each to prospective clients, helping them self-identify the right conversation to have with you."
      }
    },
    {
      "@type": "Question",
      "name": "Will VocUI help with new client enquiries and fact-find preparation?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. It can answer initial process questions, explain what information clients need to bring to a first meeting, and book the meeting directly via Easy!Appointments."
      }
    },
    {
      "@type": "Question",
      "name": "Is VocUI suitable for FCA-regulated financial services businesses?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, with the important caveat that you control all content the chatbot uses. It never provides regulated advice — it handles information and intake only. All data is handled GDPR-compliantly."
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
      "name": "AI Chatbot for Financial Advisors",
      "item": "https://vocui.com/chatbot-for-financial-advisors"
    }
  ]
};



// ─── Data ──────────────────────────────────────────────────────────────────────

const trustSignals = [
  'Answers service questions 24/7',
  'Trained only on your firm content',
  'GDPR-compliant data handling',
];

const painPoints: Array<{ icon: ElementType; title: string; body: ReactNode }> = [
  {
    icon: Phone,
    title: 'Initial inquiry calls eating into billable advisor time',
    body: 'What services do you offer? How do your fees work? What\'s the minimum investment? Every advisor fields these questions from prospects who aren\'t yet clients — consuming time that should be spent on existing relationships.',
  },
  {
    icon: MoonStar,
    title: 'Prospects fall off between first contact and booking a consultation',
    body: <span>Someone visits your website after a referral, has questions, and can&apos;t get an answer until Monday. <a href="https://livechatai.com/blog/customer-support-response-time-statistics" target="_blank" rel="noopener noreferrer" className="underline decoration-dotted hover:text-primary-500 transition-colors">Nearly 60% of consumers expect a response within 10 minutes</a> — by then they&apos;ve moved on.</span>,
  },
  {
    icon: AlertCircle,
    title: 'After-hours leads are lost before the morning',
    body: <span>High-net-worth individuals often research advisors in the evening — <a href="https://wealthtender.com/insights/how-americans-find-and-hire-financial-advisors/" target="_blank" rel="noopener noreferrer" className="underline decoration-dotted hover:text-primary-500 transition-colors">83% want to read reviews and check trust signals</a> before making contact. A contact form with a two-day response time is not a competitive advantage.</span>,
  },
];

const steps = [
  {
    step: '01',
    title: 'Train on your practice',
    description:
      'Upload your service descriptions, fee structures, process explanations, and prospect FAQs. Your chatbot learns how your practice works and answers from your approved content only.',
  },
  {
    step: '02',
    title: 'Configure booking and qualification flows',
    description:
      'Set up consultation booking links and lead qualification questions. The chatbot gathers enough context that your first call with a prospect is already productive — not introductory.',
  },
  {
    step: '03',
    title: 'Deploy and convert more inquiries',
    description:
      'Embed on your firm website. Prospects get instant answers; qualified leads get routed directly to your calendar — no missed opportunities, no weekend catch-up.',
  },
];

const features = [
  {
    icon: BookOpen,
    name: 'Service FAQ automation',
    description:
      'Answer how-we-work, fee structure, and minimum investment questions automatically from your approved content — so advisors start every prospect call in discovery, not explanation.',
  },
  {
    icon: CalendarCheck,
    name: 'Consultation booking',
    description:
      'Connect to your calendar and let qualified prospects book a first meeting directly from chat — reducing the back-and-forth that kills conversion momentum.',
  },
  {
    icon: TrendingUp,
    name: 'Investment FAQ (non-advice)',
    description:
      'Answer general investment process questions, portfolio construction philosophy, and service scope from your published content — without crossing into regulated advice territory.',
  },
  {
    icon: Clock,
    name: 'After-hours availability',
    description:
      'Your chatbot answers at 9pm as confidently as at 9am. Capture every prospect who researches financial advisors outside business hours.',
  },
  {
    icon: UserCheck,
    name: 'Advisor handoff',
    description:
      'When a conversation requires a personal touch, it escalates to the right advisor with full context — no prospect ever has to repeat themselves.',
  },
  {
    icon: FileText,
    name: 'Onboarding intake',
    description:
      'Collect preliminary information from new clients through chat — goals, timelines, current assets — so your first meeting skips the admin and gets straight to planning.',
  },
];

const verticals = [
  {
    icon: PiggyBank,
    title: 'Retirement Planning',
    description:
      'Handle retirement timeline questions, pension FAQs, and initial consultation booking without consuming advisor time on first-touch inquiries.',
  },
  {
    icon: TrendingUp,
    title: 'Wealth Management',
    description:
      'Answer service scope, investment philosophy, and minimum threshold questions automatically before a prospect ever speaks to an advisor.',
  },
  {
    icon: BarChart2,
    title: 'Tax Advisory',
    description:
      'Field general tax planning questions and service scope FAQs so your tax advisors spend time on strategy, not phone screening.',
  },
  {
    icon: Briefcase,
    title: 'Independent RIA',
    description:
      'Differentiate your firm with 24/7 responsiveness — explain your independence, fee-only structure, and fiduciary commitment to prospects at any hour.',
  },
];

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ChatbotForFinancialAdvisorsPage() {
  return (
    <PageBackground>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <Header />

      <main id="main-content">
        <nav aria-label="Breadcrumb" className="container mx-auto px-4 pt-6 pb-2">
          <ol className="flex items-center gap-2 text-sm text-secondary-500 dark:text-secondary-400">
            <li><Link href="/" className="hover:text-primary-500 transition-colors">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href="/industries" className="hover:text-primary-500 transition-colors">Industries</Link></li>
            <li aria-hidden="true">/</li>
            <li className="text-secondary-900 dark:text-secondary-100 font-medium">AI Chatbot for Financial Advisors</li>
          </ol>
        </nav>


        {/* ── Hero ────────────────────────────────────────────────────────────── */}
        <section className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center container mx-auto px-4 py-16 text-center">
          <Badge className="mb-6">AI Chatbot for Financial Advisors</Badge>

          <H1 className="max-w-4xl mb-6">
            Prospects want answers before they book a consultation.{' '}
            <span className="text-primary-500">Give them answers, not a contact form.</span>
          </H1>

          <p className="mx-auto max-w-2xl text-lg text-secondary-600 dark:text-secondary-400 mb-10">
            VocUI trains on your services, fee structure, and process documentation — so your advisors
            spend less time on initial inquiries and more time with clients who are ready to engage.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="xl" asChild>
              <Link href="/signup">
                Build Your Advisor Chatbot Free
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button size="xl" variant="outline" asChild>
              <Link href="/pricing">See Pricing</Link>
            </Button>
          </div>

          <p className="text-sm text-secondary-500 dark:text-secondary-400">
            Answers service questions 24/7 &middot; Trained only on your firm content &middot; GDPR-compliant
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
            <Badge variant="outline" className="mb-4">The advisor time problem</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              Your advisors are answering questions a chatbot could handle
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              Not because your team doesn&apos;t value every prospect. Because there&apos;s no
              system to handle the first layer of questions before a real conversation is warranted.
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
                Live before your next client consultation. No developers needed.
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
              Everything a financial advisor chatbot actually needs
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              Built for advisory practices — not a generic Q&A widget.
              Every feature is aimed at protecting advisor time and converting more qualified prospects.
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
                <Badge variant="outline" className="mb-4">How financial advisors use VocUI</Badge>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
                  A typical week, before and after VocUI
                </h2>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  { step: 'Before', text: 'Multiple intro calls each week with prospects who were not a good fit — time spent explaining services and minimum investment levels that should have been self-served online.' },
                  { step: 'Setup', text: 'Uploaded their services overview, client profile guide, fee structure FAQ, and onboarding process document — live in under an hour.' },
                  { step: 'After', text: 'Prospects self-qualify before booking a consultation. Discovery calls shorter and better informed. Advisors spend their time on clients, not pre-screening.' },
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
              For advisory practices that want their advisors in client meetings, not screening calls
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              If your advisors are fielding first-touch questions a chatbot could handle, VocUI pays
              for itself the first time a qualified prospect books a consultation without a single phone call.
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
                { label: 'Chatbot for Accountancy Firms', href: '/chatbot-for-accountancy-firms', description: 'Tax season FAQ, client intake, and 24/7 availability for accounting practices.' },
                { label: 'Chatbot for Law Firms', href: '/chatbot-for-lawyers', description: 'Client intake, practice area FAQ, and consultation booking.' },
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
                Your advisors&apos; time is too valuable for first-touch screening calls
              </h2>
              <p className="text-lg text-white/80 mb-2 max-w-xl mx-auto">
                Give prospects instant answers and let your team focus on the clients who are ready to commit.
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
                    Build Your Advisor Chatbot Free
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
            <Link href="/blog/chatbot-for-financial-services" className="font-semibold text-secondary-900 dark:text-secondary-100 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              AI Chatbots for Financial Services and Advisors →
            </Link>
          </div>

        {/* ── Author Attribution ──────────────────────────────────────────── */}
        <div className="container mx-auto px-4 pb-8">
          <p className="text-xs text-secondary-400 dark:text-secondary-500 text-center">
            Written by the VocUI team &middot; Last reviewed April 2026 &middot;{' '}
            <Link href="/about" className="underline decoration-dotted hover:text-primary-500 transition-colors">
              About VocUI
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </PageBackground>
  );
}
