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
  MoonStar,
  Clock,
  UserCheck,
  ShieldCheck,
  CalendarCheck,
  BookOpen,
  Wrench,
  DollarSign,
  MessageSquare,
  Star,
  Settings,
} from 'lucide-react';

// ─── Metadata ──────────────────────────────────────────────────────────────────

export function generateMetadata(): Metadata {
  return {
    title: 'AI Chatbot for Auto Repair Shops | Service Booking & Repair FAQ | VocUI',
    description:
      'Let an AI chatbot handle service booking, repair cost questions, and job status updates for your auto repair shop — 24/7, so your mechanics can stay under the bonnet.',
    keywords: [
      'AI chatbot for auto repair shops',
      'mechanic chatbot',
      'service booking chatbot',
      'repair FAQ chatbot',
      'auto shop lead capture',
    ],
    openGraph: {
      title: 'AI Chatbot for Auto Repair Shops | Service Booking & Repair FAQ | VocUI',
      description:
        'Let an AI chatbot handle service booking, repair cost questions, and job status updates for your auto repair shop — 24/7, so your mechanics can stay under the bonnet.',
      url: 'https://vocui.com/chatbot-for-auto-repair',
      siteName: 'VocUI',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'AI Chatbot for Auto Repair Shops | Service Booking & Repair FAQ | VocUI',
      description:
        'Let an AI chatbot handle service booking, repair cost questions, and job status updates for your auto repair shop — 24/7, so your mechanics can stay under the bonnet.',
    },
    alternates: {
      canonical: 'https://vocui.com/chatbot-for-auto-repair',
    },
    robots: { index: true, follow: true },
  };
}

// ─── Structured Data ───────────────────────────────────────────────────────────

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'VocUI — AI Chatbot for Auto Repair Shops',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  description:
    'AI chatbot that handles service booking, repair cost FAQs, and quote requests for auto repair shops — 24/7, trained on your service menu and pricing.',
  url: 'https://vocui.com/chatbot-for-auto-repair',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    description: 'Free plan available',
  },
  featureList: [
    'Knowledge base trained on your service menu and pricing',
    'Service appointment booking',
    'Repair cost FAQ automation',
    '24/7 after-hours quote capture',
    'Job status update support',
    'GDPR-compliant data handling',
  ],
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What can VocUI's AI chatbot do for Auto Repair Shops?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Let an AI chatbot handle service booking, repair cost questions, and job status updates for your auto repair shop \u2014 24/7, so your mechanics can stay under the bonnet."
      }
    },
    {
      "@type": "Question",
      "name": "How long does it take to set up VocUI for Auto Repair Shops?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Most Auto Repair Shops get set up in under an hour. Upload your existing content -- service descriptions, FAQs, pricing pages, or PDFs -- and VocUI trains the chatbot automatically. Embed it on your website with a single snippet."
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
      "name": "How is VocUI different from a generic chatbot for Auto Repair Shops?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Unlike generic chatbots, VocUI is trained exclusively on your own content -- your service descriptions, policies, FAQs, and documents. It only answers questions relevant to your Auto Repair Shops business and escalates to your team when it cannot help, with full conversation context included."
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
      "name": "AI Chatbot for Auto Repair Shops",
      "item": "https://vocui.com/chatbot-for-auto-repair"
    }
  ]
};



// ─── Data ──────────────────────────────────────────────────────────────────────

const trustSignals = [
  'Answers repair questions 24/7',
  'Trained only on your services and pricing',
  'GDPR-compliant data handling',
];

const painPoints: Array<{ icon: ElementType; title: string; body: ReactNode }> = [
  {
    icon: Clock,
    title: 'Mechanics interrupted for the same pricing questions all day',
    body: <span>How much is a full service? Do you do timing belts? How long will an MOT take? <a href="https://411locals.us/small-business-owners-dont-answer-62-of-phone-calls/" target="_blank" rel="noopener noreferrer" className="underline decoration-dotted hover:text-primary-500 transition-colors">Small businesses miss 62% of inbound calls</a> — your team is pulled away from jobs to answer questions a chatbot could handle.</span>,
  },
  {
    icon: MoonStar,
    title: 'After-hours booking requests go unanswered until morning',
    body: <span>A driver with a warning light on searches for a local garage at 8pm. <a href="https://www.contractornerd.com/blog/home-services-statistics/" target="_blank" rel="noopener noreferrer" className="underline decoration-dotted hover:text-primary-500 transition-colors">Over 55% of consumers search before scheduling a home services appointment</a> — without instant answers, they call whoever picks up first in the morning.</span>,
  },
  {
    icon: DollarSign,
    title: 'Quote requests pile up with no-one to respond quickly',
    body: 'Customers who cannot get a rough price quickly move on. Capturing quote requests automatically — with vehicle details and job type — means your team can respond faster and convert more enquiries.',
  },
];

const steps = [
  {
    step: '01',
    title: 'Train on your service menu',
    description:
      'Upload your service descriptions, typical pricing ranges, warranty information, and FAQs. Your chatbot learns your workshop inside-out and answers accordingly.',
  },
  {
    step: '02',
    title: 'Configure booking and quote flows',
    description:
      'Set up service appointment booking and quote request capture. Define escalation rules so complex diagnostic questions route straight to your service desk.',
  },
  {
    step: '03',
    title: 'Deploy and fill your workshop diary',
    description:
      'Embed on your website. Visitors get instant answers about services and pricing; ready-to-book customers get routed directly to your appointment calendar.',
  },
];

const features = [
  {
    icon: BookOpen,
    name: 'Service menu knowledge base',
    description:
      'Your chatbot answers from your own service descriptions and pricing — never fabricated costs or unsupported repair advice.',
  },
  {
    icon: CalendarCheck,
    name: 'Service appointment booking',
    description:
      'Connect to your workshop diary. Customers book a drop-off slot directly from the chat, any time of day or night.',
  },
  {
    icon: DollarSign,
    name: 'Repair cost FAQ automation',
    description:
      'Handle common pricing questions automatically — service intervals, typical parts costs, and what is included in each job type.',
  },
  {
    icon: MoonStar,
    name: '24/7 after-hours quote capture',
    description:
      'Collect vehicle details, fault descriptions, and contact information after hours. Your team arrives with qualified leads ready to price and book.',
  },
  {
    icon: UserCheck,
    name: 'Seamless staff handoff',
    description:
      'When a customer needs a specialist diagnosis or bespoke quote, they are handed to your team with the full conversation context already captured.',
  },
  {
    icon: ShieldCheck,
    name: 'Warranty and guarantee FAQs',
    description:
      'Answer questions about your parts warranty, labour guarantees, and approved parts policies automatically — building trust before the first visit.',
  },
];

const verticals = [
  {
    icon: Wrench,
    title: 'General Auto Repair',
    description:
      'Handle service bookings, MOT reminders, and repair cost questions without pulling mechanics off jobs.',
  },
  {
    icon: Settings,
    title: 'Tyre & Exhaust Centres',
    description:
      'Answer tyre size compatibility, pricing, and fitting slot availability — and book appointments automatically.',
  },
  {
    icon: ShieldCheck,
    title: 'MOT & Safety Inspections',
    description:
      'Explain what is checked, what a fail means, and how to book a retest — reducing phone calls before and after every inspection.',
  },
  {
    icon: Star,
    title: 'Specialist & Prestige Car Servicing',
    description:
      'Support marque-specific FAQs, approved parts questions, and service interval queries for prestige vehicle owners.',
  },
];

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ChatbotForAutoRepairPage() {
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

        {/* ── Hero ────────────────────────────────────────────────────────────── */}
        <section className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center container mx-auto px-4 py-16 text-center">
          <Badge className="mb-6">AI Chatbot for Auto Repair Shops</Badge>

          <H1 className="max-w-4xl mb-6">
            Your mechanics should be fixing cars,{' '}
            <span className="text-primary-500">not answering the same pricing questions all day.</span>
          </H1>

          <p className="mx-auto max-w-2xl text-lg text-secondary-600 dark:text-secondary-400 mb-10">
            VocUI trains on your service menu, pricing, and FAQs — so customers get instant answers
            about costs and availability, and your workshop diary fills up without the phone tag.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="xl" asChild>
              <Link href="/signup">
                Build Your Workshop Chatbot Free
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button size="xl" variant="outline" asChild>
              <Link href="/pricing">See Pricing</Link>
            </Button>
          </div>

          <p className="text-sm text-secondary-500 dark:text-secondary-400">
            Answers repair questions 24/7 &middot; Trained only on your services and pricing &middot; GDPR-compliant
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
            <Badge variant="outline" className="mb-4">The workshop problem</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              Your team is answering questions a chatbot could handle
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              Not because your team is slow. Because there&apos;s no system to handle the same
              service, pricing, and availability questions that arrive every single day.
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
              Everything an auto repair chatbot actually needs
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              Built for repair workshops — not a generic widget bolted onto your site.
              Every feature is aimed at filling your diary and reducing front-desk interruptions.
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
              <Badge variant="outline" className="mb-8">From a repair shop using VocUI</Badge>
              <blockquote className="text-2xl font-semibold text-secondary-900 dark:text-secondary-100 leading-snug mb-6">
                &ldquo;Our front desk was spending half the day on the phone answering &lsquo;how
                much is an MOT&rsquo;. VocUI handles all of that now — my team actually gets
                time to focus on the cars, and we&apos;re booking more jobs than ever.&rdquo;
              </blockquote>
              <p className="text-secondary-500 dark:text-secondary-400 text-sm">
                D.P. &mdash; Owner, Independent Auto Repair Centre
              </p>
            </div>
          </div>
        </section>

        {/* ── Who It's For ────────────────────────────────────────────────────── */}
        <section className="container mx-auto px-4 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">Who it&apos;s for</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              For repair shops that want their team focused on fixing vehicles
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              If your mechanics and front desk are fielding questions a chatbot could handle,
              VocUI pays for itself the moment your first after-hours booking lands in the diary.
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
                { label: 'Chatbot for Car Dealerships', href: '/chatbot-for-car-dealerships', description: 'Vehicle FAQ and test drive booking for car dealerships.' },
                { label: 'Chatbot for Plumbers', href: '/chatbot-for-plumbers', description: 'Emergency booking and service FAQ for plumbing businesses.' },
                { label: 'Chatbot for Electricians', href: '/chatbot-for-electricians', description: 'Quote requests and services FAQ for electrical contractors.' },
                { label: 'Chatbot for HVAC Companies', href: '/chatbot-for-hvac', description: 'Maintenance booking and emergency support for HVAC businesses.' },
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
                Your workshop diary should fill itself
              </h2>
              <p className="text-lg text-white/80 mb-2 max-w-xl mx-auto">
                Give every customer instant answers about your services and let your mechanics focus on the work, not the phone.
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
                    Build Your Workshop Chatbot Free
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
