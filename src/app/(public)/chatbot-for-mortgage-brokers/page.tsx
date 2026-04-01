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
  Home,
  Key,
  Building2,
  Briefcase,
  ClipboardList,
} from 'lucide-react';

// ─── Metadata ──────────────────────────────────────────────────────────────────

export function generateMetadata(): Metadata {
  return {
    title: 'AI Chatbot for Mortgage Brokers | Rate FAQ & Application Lead Capture | VocUI',
    description:
      'Let an AI chatbot handle rate questions, pre-qualification intake, and product FAQs for your mortgage brokerage — 24/7. Capture more leads without more admin.',
    keywords: [
      'AI chatbot for mortgage brokers',
      'mortgage chatbot',
      'rate FAQ chatbot',
      'mortgage lead capture',
      'mortgage broker automation',
    ],
    openGraph: {
      title: 'AI Chatbot for Mortgage Brokers | Rate FAQ & Application Lead Capture | VocUI',
      description:
        'Let an AI chatbot handle rate questions, pre-qualification intake, and product FAQs for your mortgage brokerage — 24/7. Capture more leads without more admin.',
      url: 'https://vocui.com/chatbot-for-mortgage-brokers',
      siteName: 'VocUI',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'AI Chatbot for Mortgage Brokers | Rate FAQ & Application Lead Capture | VocUI',
      description:
        'Let an AI chatbot handle rate questions, pre-qualification intake, and product FAQs for your mortgage brokerage — 24/7. Capture more leads without more admin.',
    },
    alternates: {
      canonical: 'https://vocui.com/chatbot-for-mortgage-brokers',
    },
    robots: { index: true, follow: true },
  };
}

// ─── Structured Data ───────────────────────────────────────────────────────────

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'VocUI — AI Chatbot for Mortgage Brokers',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  description:
    'AI chatbot that handles rate FAQ, application lead capture, and pre-qualification intake for mortgage brokers — 24/7, trained on your product range only.',
  url: 'https://vocui.com/chatbot-for-mortgage-brokers',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    description: 'Free plan available',
  },
  featureList: [
    'Knowledge base trained on your mortgage products',
    'Application lead capture and intake',
    'Pre-qualification question handling',
    '24/7 after-hours availability',
    'Broker escalation with full conversation context',
    'GDPR-compliant data handling',
  ],
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What can VocUI's AI chatbot do for Mortgage Brokers?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Let an AI chatbot handle rate questions, pre-qualification intake, and product FAQs for your mortgage brokerage \u2014 24/7. Capture more leads without more admin."
      }
    },
    {
      "@type": "Question",
      "name": "How long does it take to set up VocUI for Mortgage Brokers?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Most Mortgage Brokers get set up in under an hour. Upload your existing content -- service descriptions, FAQs, pricing pages, or PDFs -- and VocUI trains the chatbot automatically. Embed it on your website with a single snippet."
      }
    },
    {
      "@type": "Question",
      "name": "Does VocUI work outside business hours?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. VocUI runs 24/7 with no human involvement. Visitors who arrive at night, on weekends, or during holidays get instant, accurate answers and can book, enquire, or leave their contact details without waiting until you open."
      }
    },
    {
      "@type": "Question",
      "name": "Is VocUI GDPR compliant?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. VocUI is GDPR compliant. Conversation data is stored securely, you control what the chatbot knows, and visitor data is never used to train third-party AI models. You can delete data at any time."
      }
    },
    {
      "@type": "Question",
      "name": "How is VocUI different from a generic chatbot for Mortgage Brokers?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Unlike generic chatbots, VocUI is trained exclusively on your own content -- your service descriptions, policies, FAQs, and documents. It only answers questions relevant to your Mortgage Brokers business and escalates to your team when it cannot help, with full conversation context included."
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
      "name": "AI Chatbot for Mortgage Brokers",
      "item": "https://vocui.com/chatbot-for-mortgage-brokers"
    }
  ]
};



// ─── Data ──────────────────────────────────────────────────────────────────────

const trustSignals = [
  'Answers rate questions 24/7',
  'Trained only on your product range',
  'GDPR-compliant data handling',
];

const painPoints: Array<{ icon: ElementType; title: string; body: ReactNode }> = [
  {
    icon: Phone,
    title: 'Rate FAQ calls overwhelming your brokers',
    body: 'What\'s your best fixed rate right now? How does a tracker mortgage work? What LTV do I need for a 5-year fix? Your brokers field these questions all day — pulling them off the complex cases that actually need their expertise.',
  },
  {
    icon: MoonStar,
    title: 'Pre-qualification questions lost after hours',
    body: <span>A first-time buyer gets excited on a Sunday evening and visits your site with questions about affordability. <a href="https://www.salesloft.com/resources/guides/conversational-ai-marketing-trends-report" target="_blank" rel="noopener noreferrer" className="underline decoration-dotted hover:text-primary-500 transition-colors">41% of all meetings are booked outside standard business hours</a> — without instant answers, that energy dissipates and they call someone else on Monday morning.</span>,
  },
  {
    icon: AlertCircle,
    title: 'Complex product lineup creates confusion that costs you deals',
    body: 'When borrowers don\'t understand the difference between your products — fixed vs. tracker, offset, buy-to-let — they either make poor choices or walk away. A chatbot explains the options clearly before a broker ever picks up the phone.',
  },
];

const steps = [
  {
    step: '01',
    title: 'Train on your products',
    description:
      'Upload your mortgage product sheets, rate guides, eligibility criteria, and lender FAQ content. Your chatbot learns your full range and answers from your approved materials only.',
  },
  {
    step: '02',
    title: 'Configure intake and escalation flows',
    description:
      'Set up pre-qualification intake forms and define escalation rules. Complex affordability assessments route to your brokers with context — the chatbot qualifies, your brokers advise.',
  },
  {
    step: '03',
    title: 'Deploy and capture more applications',
    description:
      'Embed on your website. Borrowers get instant product answers; motivated leads get captured with their details and routed to the right broker for follow-up.',
  },
];

const features = [
  {
    icon: BookOpen,
    name: 'Rate and product FAQ',
    description:
      'Answer fixed vs. tracker, rate comparisons, LTV tier questions, and product eligibility from your own materials — so brokers spend time on applications, not education.',
  },
  {
    icon: FileText,
    name: 'Application lead capture',
    description:
      'Collect borrower name, contact details, purchase price, deposit amount, and employment status directly in chat — warm, structured leads delivered for broker follow-up.',
  },
  {
    icon: ClipboardList,
    name: 'Pre-qualification intake',
    description:
      'Walk borrowers through basic eligibility questions and set expectations before a broker call — reducing the time spent on applications that aren\'t viable.',
  },
  {
    icon: Clock,
    name: 'After-hours availability',
    description:
      'Your chatbot answers on Sunday evenings as confidently as on Tuesday mornings. Capture every borrower who researches mortgages outside business hours.',
  },
  {
    icon: UserCheck,
    name: 'Broker escalation',
    description:
      'Regulated advice questions escalate immediately to the right broker, with the borrower\'s full conversation context handed over cleanly.',
  },
  {
    icon: Key,
    name: 'Document checklist delivery',
    description:
      'Share the exact documents a borrower needs to gather — payslips, bank statements, ID — automatically in chat, so applications arrive complete and ready to process.',
  },
];

const verticals = [
  {
    icon: Home,
    title: 'First-Time Buyers',
    description:
      'Answer deposit, Help to Buy, and first-step affordability questions instantly — turning anxious first-timers into confident, qualified leads.',
  },
  {
    icon: Key,
    title: 'Refinancing',
    description:
      'Handle product transfer vs. remortgage questions and rate comparison FAQs so your brokers focus on securing the best deal, not explaining the basics.',
  },
  {
    icon: Building2,
    title: 'Buy-to-Let',
    description:
      'Guide landlord enquiries through rental yield calculations, LTV requirements, and portfolio financing rules before the broker conversation begins.',
  },
  {
    icon: Briefcase,
    title: 'Self-Employed Mortgages',
    description:
      'Explain the documentation required, typical lender criteria, and product options for self-employed borrowers — a niche with high FAQ volume and high value.',
  },
];

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ChatbotForMortgageBrokersPage() {
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
            <li className="text-secondary-900 dark:text-secondary-100 font-medium">AI Chatbot for Mortgage Brokers</li>
          </ol>
        </nav>


        {/* ── Hero ────────────────────────────────────────────────────────────── */}
        <section className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center container mx-auto px-4 py-16 text-center">
          <Badge className="mb-6">AI Chatbot for Mortgage Brokers</Badge>

          <H1 className="max-w-4xl mb-6">
            Every borrower asks the same rate questions before they apply.{' '}
            <span className="text-primary-500">Your chatbot can answer them instantly.</span>
          </H1>

          <p className="mx-auto max-w-2xl text-lg text-secondary-600 dark:text-secondary-400 mb-10">
            VocUI trains on your mortgage products, eligibility criteria, and process documentation —
            so your brokers spend less time on education calls and more time processing applications.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="xl" asChild>
              <Link href="/signup">
                Build Your Mortgage Chatbot Free
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button size="xl" variant="outline" asChild>
              <Link href="/pricing">See Pricing</Link>
            </Button>
          </div>

          <p className="text-sm text-secondary-500 dark:text-secondary-400">
            Answers rate questions 24/7 &middot; Trained only on your product range &middot; GDPR-compliant
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
            <Badge variant="outline" className="mb-4">The broker bottleneck</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              Your brokers are answering questions a chatbot could handle
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              Not because your team isn&apos;t efficient. Because there&apos;s no system to handle
              the same first-layer borrower questions that arrive every single day.
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
              Everything a mortgage brokerage chatbot actually needs
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              Built for mortgage professionals — not a generic chat widget.
              Every feature is aimed at reducing broker interruptions and capturing more qualified applications.
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
              <Badge variant="outline" className="mb-8">From a mortgage brokerage using VocUI</Badge>
              <blockquote className="text-2xl font-semibold text-secondary-900 dark:text-secondary-100 leading-snug mb-6">
                &ldquo;We used to lose weekend leads completely — nobody was there to answer rate
                questions on Saturday afternoons. VocUI captures those conversations now, and our
                Monday pipeline looks completely different as a result.&rdquo;
              </blockquote>
              <p className="text-secondary-500 dark:text-secondary-400 text-sm">
                D.K. &mdash; Director, Keystone Mortgage Solutions
              </p>
            </div>
          </div>
        </section>

        {/* ── Who It's For ────────────────────────────────────────────────────── */}
        <section className="container mx-auto px-4 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">Who it&apos;s for</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              For mortgage brokerages that want their advisors on applications, not FAQ calls
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              If your brokers are fielding questions a chatbot could handle, VocUI pays for itself
              the moment your first qualified lead arrives with all their details already captured.
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
                { label: 'Chatbot for Mortgage Lenders', href: '/chatbot-for-mortgage-lenders', description: 'Loan FAQ and pre-qualification lead capture for lenders.' },
                { label: 'Chatbot for Real Estate', href: '/chatbot-for-real-estate', description: '24/7 lead capture and viewing bookings for estate agents.' },
                { label: 'Chatbot for Financial Advisors', href: '/chatbot-for-financial-advisors', description: 'Service FAQ and consultation booking for financial advisers.' },
                { label: 'Chatbot for Insurance Agents', href: '/chatbot-for-insurance-agents', description: 'Policy FAQ and quote lead capture for insurance professionals.' },
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
                Your brokers&apos; time is too valuable for rate FAQ calls
              </h2>
              <p className="text-lg text-white/80 mb-2 max-w-xl mx-auto">
                Give borrowers instant answers and let your team focus on the applications that actually complete.
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
                    Build Your Mortgage Chatbot Free
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
