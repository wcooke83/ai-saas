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
  CalendarCheck,
  Clock,
  UserCheck,
  FileText,
  Thermometer,
  Home,
  Building2,
  Wrench,
  ClipboardList,
} from 'lucide-react';

// ─── Metadata ──────────────────────────────────────────────────────────────────

export function generateMetadata(): Metadata {
  return {
    title: 'AI Chatbot for HVAC Companies | Maintenance Booking & Emergency Support | VocUI',
    description:
      'Let an AI chatbot handle maintenance booking, emergency triage, and service FAQs for your HVAC business — 24/7. Stop missing calls during peak season.',
    keywords: [
      'AI chatbot for HVAC',
      'HVAC chatbot',
      'HVAC maintenance booking chatbot',
      'heating cooling FAQ chatbot',
      'HVAC lead capture automation',
    ],
    openGraph: {
      title: 'AI Chatbot for HVAC Companies | Maintenance Booking & Emergency Support | VocUI',
      description:
        'Let an AI chatbot handle maintenance booking, emergency triage, and service FAQs for your HVAC business — 24/7. Stop missing calls during peak season.',
      url: 'https://vocui.com/chatbot-for-hvac',
      siteName: 'VocUI',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'AI Chatbot for HVAC Companies | Maintenance Booking & Emergency Support | VocUI',
      description:
        'Let an AI chatbot handle maintenance booking, emergency triage, and service FAQs for your HVAC business — 24/7. Stop missing calls during peak season.',
    },
    alternates: {
      canonical: 'https://vocui.com/chatbot-for-hvac',
    },
    robots: { index: true, follow: true },
  };
}

// ─── Structured Data ───────────────────────────────────────────────────────────

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'VocUI — AI Chatbot for HVAC Companies',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  description:
    'AI chatbot that handles maintenance booking, emergency triage, and service FAQs for HVAC businesses — 24/7, trained on your company content only.',
  url: 'https://vocui.com/chatbot-for-hvac',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    description: 'Free plan available',
  },
  featureList: [
    'Maintenance appointment booking',
    'Emergency call triage',
    'Seasonal FAQ automation',
    '24/7 after-hours availability',
    'Technician escalation with full context',
    'Service plan FAQ',
  ],
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What can VocUI's AI chatbot do for HVAC Companies?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Let an AI chatbot handle maintenance booking, emergency triage, and service FAQs for your HVAC business \u2014 24/7. Stop missing calls during peak season."
      }
    },
    {
      "@type": "Question",
      "name": "How long does it take to set up VocUI for HVAC Companies?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Most HVAC Companies get set up in under an hour. Upload your existing content -- service descriptions, FAQs, pricing pages, or PDFs -- and VocUI trains the chatbot automatically. Embed it on your website with a single snippet."
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
      "name": "How is VocUI different from a generic chatbot for HVAC Companies?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Unlike generic chatbots, VocUI is trained exclusively on your own content -- your service descriptions, policies, FAQs, and documents. It only answers questions relevant to your HVAC Companies business and escalates to your team when it cannot help, with full conversation context included."
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
      "name": "AI Chatbot for HVAC Companies",
      "item": "https://vocui.com/chatbot-for-hvac"
    }
  ]
};



// ─── Data ──────────────────────────────────────────────────────────────────────

const trustSignals = [
  'Handles inquiries 24/7 including peak season',
  'Trained only on your company content',
  'GDPR-compliant data handling',
];

const painPoints: Array<{ icon: ElementType; title: string; body: ReactNode }> = [
  {
    icon: Phone,
    title: 'Emergency calls during peak season overwhelm your phone line',
    body: "In the first heatwave of summer or the first freeze of winter, your phone rings non-stop. Half the callers need urgent help. The other half are asking if you do maintenance contracts. Without triage, your team can't tell the difference fast enough.",
  },
  {
    icon: MoonStar,
    title: 'Maintenance appointment reminders fall through the cracks',
    body: "Annual maintenance is your most reliable revenue — but chasing customers to book it takes time your office staff don't have. Customers who don't get a timely reminder book with whoever follows up first.",
  },
  {
    icon: AlertCircle,
    title: 'Quote requests go cold after hours because no one responds',
    body: <span>A homeowner whose AC just failed searches for HVAC companies at 8pm. <a href="https://blog.gorizen.com/hvac-market-statistics" target="_blank" rel="noopener noreferrer" className="underline decoration-dotted hover:text-primary-500 transition-colors">84% of HVAC customers had no specific company in mind when they searched</a> — they fill out your contact form and book with whoever replies first.</span>,
  },
];

const steps = [
  {
    step: '01',
    title: 'Train on your services',
    description:
      'Upload your service descriptions, maintenance plan details, seasonal guides, and FAQ answers. Your chatbot learns your business and responds accurately to customer questions.',
  },
  {
    step: '02',
    title: 'Configure booking and triage flows',
    description:
      'Set up maintenance booking flows and seasonal scheduling. Define emergency triage rules so genuine urgent calls route straight to your on-call technician — the chatbot never guesses at safety.',
  },
  {
    step: '03',
    title: 'Deploy and stay ahead of peak season',
    description:
      'Embed on your website or Google Business profile. Every visitor gets an instant response — and maintenance customers get routed directly to your booking calendar.',
  },
];

const features = [
  {
    icon: CalendarCheck,
    name: 'Maintenance booking',
    description:
      "Connect to your calendar and let customers schedule annual maintenance checks directly from the chat — any time, any day. No back-and-forth required.",
  },
  {
    icon: Thermometer,
    name: 'Emergency triage',
    description:
      'Guide customers through key diagnostic questions to determine whether a heating or cooling issue is urgent. Route genuine emergencies to your on-call team immediately.',
  },
  {
    icon: BookOpen,
    name: 'Seasonal FAQ automation',
    description:
      'Answer pre-season questions automatically — when to service your boiler, how to prepare your AC for summer, what a maintenance contract covers — before the rush hits.',
  },
  {
    icon: Clock,
    name: '24/7 availability',
    description:
      'Your chatbot answers at midnight as well as at midday, through peak season and off-season alike. Capture every inquiry, even when your office is closed.',
  },
  {
    icon: UserCheck,
    name: 'Technician escalation',
    description:
      'Complex or urgent jobs escalate to your team immediately with the full conversation context — so your technician knows the situation before they call the customer back.',
  },
  {
    icon: FileText,
    name: 'Service plan FAQ',
    description:
      'Explain what your maintenance contracts cover, how much they cost, and how to sign up — converting one-off service calls into recurring contract customers.',
  },
];

const verticals = [
  {
    icon: Home,
    title: 'Residential HVAC',
    description:
      'Handle boiler service bookings, AC installation enquiries, and maintenance contract questions without interrupting your technicians.',
  },
  {
    icon: Building2,
    title: 'Commercial HVAC',
    description:
      'Qualify commercial maintenance and installation enquiries and route them to your commercial sales team with full details captured.',
  },
  {
    icon: Wrench,
    title: 'Emergency Repair',
    description:
      'Triage urgent calls fast so genuine breakdowns reach your on-call technician quickly — and non-urgent issues are handled next business day.',
  },
  {
    icon: ClipboardList,
    title: 'Maintenance Contracts',
    description:
      'Convert one-off service enquiries into maintenance contract sign-ups by answering plan details, pricing, and coverage questions instantly.',
  },
];

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ChatbotForHvacPage() {
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
          <Badge className="mb-6">AI Chatbot for HVAC Companies</Badge>

          <H1 className="max-w-4xl mb-6">
            Peak season doesn&apos;t have to mean a jammed phone line.{' '}
            <span className="text-primary-500">Your chatbot handles the volume.</span>
          </H1>

          <p className="mx-auto max-w-2xl text-lg text-secondary-600 dark:text-secondary-400 mb-10">
            VocUI trains on your services, maintenance plans, and FAQ answers — so every customer
            gets an instant response, maintenance bookings fill automatically, and your technicians
            spend their time on jobs rather than answering the same seasonal questions.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="xl" asChild>
              <Link href="/signup">
                Build Your HVAC Chatbot Free
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button size="xl" variant="outline" asChild>
              <Link href="/pricing">See Pricing</Link>
            </Button>
          </div>

          <p className="text-sm text-secondary-500 dark:text-secondary-400">
            Handles enquiries 24/7 &middot; Trained only on your company content &middot; GDPR-compliant
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
            <Badge variant="outline" className="mb-4">The peak season problem</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              HVAC businesses lose revenue when the phone line can&apos;t keep up
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              Not because your team isn&apos;t fast enough. Because the volume of calls during
              peak season is impossible to handle manually — and the customers who can&apos;t
              get through book someone else.
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
              Everything an HVAC business chatbot actually needs
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              Built for HVAC companies — not a generic widget bolted onto your site.
              Every feature is aimed at handling peak season volume and filling your maintenance schedule.
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
              <Badge variant="outline" className="mb-8">From an HVAC company using VocUI</Badge>
              <blockquote className="text-2xl font-semibold text-secondary-900 dark:text-secondary-100 leading-snug mb-6">
                &ldquo;Last summer we were losing calls during the heatwave because we simply couldn&apos;t
                keep up. VocUI now handles the triage and books maintenance visits automatically —
                my office manager actually has time to breathe.&rdquo;
              </blockquote>
              <p className="text-secondary-500 dark:text-secondary-400 text-sm">
                R.T. &mdash; Owner, Regional HVAC Company
              </p>
            </div>
          </div>
        </section>

        {/* ── Who It's For ────────────────────────────────────────────────────── */}
        <section className="container mx-auto px-4 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">Who it&apos;s for</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              For HVAC companies that want their technicians on jobs, not phones
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              If peak season means a jammed phone line and missed leads, VocUI pays for itself
              the first week you deploy — when every customer inquiry gets an instant answer.
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
                { label: 'Chatbot for Electricians', href: '/chatbot-for-electricians', description: 'Quote requests and services FAQ for electrical contractors.' },
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
                Peak season is coming. Be ready for it this time.
              </h2>
              <p className="text-lg text-white/80 mb-2 max-w-xl mx-auto">
                Give every customer an instant answer and let your chatbot fill your maintenance schedule while your technicians work.
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
                    Build Your HVAC Chatbot Free
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
