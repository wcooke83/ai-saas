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
  Star,
  Car,
  Zap,
  DollarSign,
  Filter,
  TrendingUp,
} from 'lucide-react';

// ─── Metadata ──────────────────────────────────────────────────────────────────

export function generateMetadata(): Metadata {
  return {
    title: 'AI Chatbot for Car Dealerships | Vehicle FAQ & Test Drive Booking | VocUI',
    description:
      'Let an AI chatbot answer vehicle spec and finance questions, book test drives, and capture after-hours leads for your dealership — 24/7, trained on your inventory.',
    keywords: [
      'AI chatbot for car dealerships',
      'car dealership chatbot',
      'test drive booking chatbot',
      'vehicle FAQ chatbot',
      'automotive lead capture',
    ],
    openGraph: {
      title: 'AI Chatbot for Car Dealerships | Vehicle FAQ & Test Drive Booking | VocUI',
      description:
        'Let an AI chatbot answer vehicle spec and finance questions, book test drives, and capture after-hours leads for your dealership — 24/7, trained on your inventory.',
      url: 'https://vocui.com/chatbot-for-car-dealerships',
      siteName: 'VocUI',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'AI Chatbot for Car Dealerships | Vehicle FAQ & Test Drive Booking | VocUI',
      description:
        'Let an AI chatbot answer vehicle spec and finance questions, book test drives, and capture after-hours leads for your dealership — 24/7, trained on your inventory.',
    },
    alternates: {
      canonical: 'https://vocui.com/chatbot-for-car-dealerships',
    },
    robots: { index: true, follow: true },
  };
}

// ─── Structured Data ───────────────────────────────────────────────────────────

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'VocUI — AI Chatbot for Car Dealerships',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  description:
    'AI chatbot that handles vehicle spec questions, finance FAQs, and test drive bookings for car dealerships — 24/7, trained on your inventory and pricing content.',
  url: 'https://vocui.com/chatbot-for-car-dealerships',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    description: 'Free plan available',
  },
  featureList: [
    'Knowledge base trained on your vehicle inventory',
    'Test drive appointment booking',
    'Finance and PCP FAQ automation',
    '24/7 after-hours lead capture',
    'Qualified lead handoff with full context',
    'GDPR-compliant data handling',
  ],
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What can VocUI's AI chatbot do for Car Dealerships?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Let an AI chatbot answer vehicle spec and finance questions, book test drives, and capture after-hours leads for your dealership \u2014 24/7, trained on your inventory."
      }
    },
    {
      "@type": "Question",
      "name": "How long does it take to set up VocUI for Car Dealerships?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Most Car Dealerships get set up in under an hour. Upload your existing content -- service descriptions, FAQs, pricing pages, or PDFs -- and VocUI trains the chatbot automatically. Embed it on your website with a single snippet."
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
      "name": "How is VocUI different from a generic chatbot for Car Dealerships?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Unlike generic chatbots, VocUI is trained exclusively on your own content -- your service descriptions, policies, FAQs, and documents. It only answers questions relevant to your Car Dealerships business and escalates to your team when it cannot help, with full conversation context included."
      }
    }
  ]
};


// ─── Data ──────────────────────────────────────────────────────────────────────

const trustSignals = [
  'Answers vehicle questions 24/7',
  'Trained only on your inventory and pricing',
  'GDPR-compliant data handling',
];

const painPoints: Array<{ icon: ElementType; title: string; body: ReactNode }> = [
  {
    icon: Clock,
    title: 'The same spec and finance questions before every visit',
    body: "What's the monthly payment on a PCP deal? Does the hybrid come with a tow bar option? How long is the waiting list? Your sales team answers these before a single test drive is booked — every single day.",
  },
  {
    icon: MoonStar,
    title: 'After-hours browsing loses leads to faster competitors',
    body: <span>Most vehicle research happens in evenings and weekends. <a href="https://www.salesloft.com/resources/guides/conversational-ai-marketing-trends-report" target="_blank" rel="noopener noreferrer" className="underline decoration-dotted hover:text-primary-500 transition-colors">41% of all meetings are booked outside standard business hours</a> — without instant responses, they fill in a form on the competitor who does reply.</span>,
  },
  {
    icon: Filter,
    title: 'Sales staff time wasted on unqualified walk-ins',
    body: 'Walk-ins who have not had basic questions answered take more floor time per conversion. Qualifying buyers before they arrive — with accurate spec, finance, and availability information — means your team spends time with the right people.',
  },
];

const steps = [
  {
    step: '01',
    title: 'Train on your inventory',
    description:
      'Upload your vehicle brochures, pricing sheets, finance options, and FAQs. Your chatbot learns your current stock, trim levels, and deals — and stays accurate as you update it.',
  },
  {
    step: '02',
    title: 'Configure test drive and lead flows',
    description:
      'Set up test drive booking, part-exchange enquiry forms, and finance pre-qualification flows. Complex queries about specific deals escalate straight to your sales desk.',
  },
  {
    step: '03',
    title: 'Deploy and capture every lead',
    description:
      'Embed on your dealership website or vehicle listing pages. Visitors get instant answers; interested buyers book test drives or submit enquiries without leaving your site.',
  },
];

const features = [
  {
    icon: BookOpen,
    name: 'Inventory-trained knowledge base',
    description:
      'Your chatbot answers from your own vehicle specs, trim comparisons, and finance FAQs — never fabricated details about models you do not stock.',
  },
  {
    icon: CalendarCheck,
    name: 'Test drive booking',
    description:
      'Connect to your appointment calendar. Buyers pick a date and time for a test drive directly from the chat, without needing to call the showroom.',
  },
  {
    icon: DollarSign,
    name: 'Finance FAQ automation',
    description:
      'Handle PCP, HP, and outright purchase questions automatically. Buyers get payment illustrations and eligibility guidance before talking to your finance team.',
  },
  {
    icon: MoonStar,
    name: '24/7 after-hours lead capture',
    description:
      'Your chatbot captures names, contact details, and vehicle interest at any hour. Your sales team arrives in the morning with qualified leads ready to follow up.',
  },
  {
    icon: UserCheck,
    name: 'Qualified lead handoff',
    description:
      'When a buyer is ready to talk, they are handed to your team with full conversation context — vehicle interest, budget range, and questions already asked.',
  },
  {
    icon: ShieldCheck,
    name: 'Part-exchange enquiry support',
    description:
      'Guide customers through part-exchange questions and collect vehicle details upfront, so your appraisers have the information they need before the visit.',
  },
];

const verticals = [
  {
    icon: Car,
    title: 'New Car Dealerships',
    description:
      'Handle model comparisons, trim questions, factory order timelines, and test drive bookings without tying up your sales team.',
  },
  {
    icon: Star,
    title: 'Used Car Dealers',
    description:
      'Answer stock availability, service history, and finance eligibility questions automatically — qualifying buyers before they arrive.',
  },
  {
    icon: Zap,
    title: 'EV & Hybrid Specialists',
    description:
      'Explain charging infrastructure, range anxiety, government grants, and running cost comparisons with instant, accurate answers.',
  },
  {
    icon: TrendingUp,
    title: 'Fleet & Commercial Vehicles',
    description:
      'Support fleet managers with payload specs, contract hire options, and bulk enquiry capture without manual follow-up delays.',
  },
];

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ChatbotForCarDealershipsPage() {
  return (
    <PageBackground>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <Header />

      <main id="main-content">

        {/* ── Hero ────────────────────────────────────────────────────────────── */}
        <section className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center container mx-auto px-4 py-16 text-center">
          <Badge className="mb-6">AI Chatbot for Car Dealerships</Badge>

          <H1 className="max-w-4xl mb-6">
            Your buyers research vehicles at 10pm.{' '}
            <span className="text-primary-500">Your chatbot should be there when they do.</span>
          </H1>

          <p className="mx-auto max-w-2xl text-lg text-secondary-600 dark:text-secondary-400 mb-10">
            VocUI trains on your inventory, finance options, and FAQs — so every visitor gets
            instant answers about specs, pricing, and availability, and your sales team gets
            qualified leads ready to close.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="xl" asChild>
              <Link href="/signup">
                Build Your Dealership Chatbot Free
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button size="xl" variant="outline" asChild>
              <Link href="/pricing">See Pricing</Link>
            </Button>
          </div>

          <p className="text-sm text-secondary-500 dark:text-secondary-400">
            Answers vehicle questions 24/7 &middot; Trained only on your inventory and pricing &middot; GDPR-compliant
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
            <Badge variant="outline" className="mb-4">The showroom problem</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              Your sales team is answering questions a chatbot could handle
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              Not because your team is slow. Because there&apos;s no system in place to handle the
              same vehicle, finance, and availability questions that arrive every single day.
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
              Everything a dealership chatbot actually needs
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              Built for car dealerships — not a generic widget bolted onto your listings.
              Every feature is aimed at qualifying buyers and filling your test drive diary.
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
              <Badge variant="outline" className="mb-8">From a dealership using VocUI</Badge>
              <blockquote className="text-2xl font-semibold text-secondary-900 dark:text-secondary-100 leading-snug mb-6">
                &ldquo;We were losing weekend leads because nobody was online to answer finance
                questions. VocUI handles that now — we come in Monday with booked test drives
                already in the diary from Saturday night.&rdquo;
              </blockquote>
              <p className="text-secondary-500 dark:text-secondary-400 text-sm">
                R.T. &mdash; Sales Manager, Regional Ford Dealership
              </p>
            </div>
          </div>
        </section>

        {/* ── Who It's For ────────────────────────────────────────────────────── */}
        <section className="container mx-auto px-4 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">Who it&apos;s for</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              For dealerships that want their sales team focused on selling
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              If your sales team is answering spec and finance questions a chatbot could handle,
              VocUI pays for itself the moment your first after-hours lead books a test drive.
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
                { label: 'Chatbot for Auto Repair', href: '/chatbot-for-auto-repair', description: 'Service booking and repair FAQ for auto repair shops.' },
                { label: 'Chatbot for Insurance Agents', href: '/chatbot-for-insurance-agents', description: 'Policy FAQ and quote lead capture for insurance professionals.' },
                { label: 'Chatbot for Financial Advisors', href: '/chatbot-for-financial-advisors', description: 'Service FAQ and consultation booking for financial advisers.' },
                { label: 'Chatbot for Real Estate', href: '/chatbot-for-real-estate', description: '24/7 lead capture and viewing bookings for estate agents.' },
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
                Stop losing weekend leads to competitors who reply faster
              </h2>
              <p className="text-lg text-white/80 mb-2 max-w-xl mx-auto">
                Give every visitor instant answers about your vehicles and let your sales team focus on closing, not answering the same questions twice.
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
                    Build Your Dealership Chatbot Free
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
