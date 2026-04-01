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
  Wrench,
  Home,
  Building,
  Building2,
  KeyRound,
} from 'lucide-react';

// ─── Metadata ──────────────────────────────────────────────────────────────────

export function generateMetadata(): Metadata {
  return {
    title: 'AI Chatbot for Property Managers | Tenant FAQ & Maintenance Intake | VocUI',
    description:
      'Let an AI chatbot handle tenant FAQs, maintenance request intake, and viewing bookings for your property portfolio — 24/7. Reduce call volume and capture every enquiry.',
    keywords: [
      'AI chatbot for property managers',
      'property management chatbot',
      'tenant FAQ chatbot',
      'maintenance request intake',
      'letting agent chatbot',
    ],
    openGraph: {
      title: 'AI Chatbot for Property Managers | Tenant FAQ & Maintenance Intake | VocUI',
      description:
        'Let an AI chatbot handle tenant FAQs, maintenance request intake, and viewing bookings for your property portfolio — 24/7. Reduce call volume and capture every enquiry.',
      url: 'https://vocui.com/chatbot-for-property-managers',
      siteName: 'VocUI',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'AI Chatbot for Property Managers | Tenant FAQ & Maintenance Intake | VocUI',
      description:
        'Let an AI chatbot handle tenant FAQs, maintenance request intake, and viewing bookings for your property portfolio — 24/7. Reduce call volume and capture every enquiry.',
    },
    alternates: {
      canonical: 'https://vocui.com/chatbot-for-property-managers',
    },
    robots: { index: true, follow: true },
  };
}

// ─── Structured Data ───────────────────────────────────────────────────────────

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'VocUI — AI Chatbot for Property Managers',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  description:
    'AI chatbot that handles tenant FAQs, maintenance request intake, and viewing bookings for property management companies — 24/7, trained on your policies only.',
  url: 'https://vocui.com/chatbot-for-property-managers',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    description: 'Free plan available',
  },
  featureList: [
    'Tenant FAQ automation',
    'Maintenance request intake',
    'Viewing booking capture',
    '24/7 after-hours availability',
    'Manager escalation with full conversation context',
    'GDPR-compliant data handling',
  ],
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What can VocUI's AI chatbot do for Property Managers?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Let an AI chatbot handle tenant FAQs, maintenance request intake, and viewing bookings for your property portfolio \u2014 24/7. Reduce call volume and capture every enquiry."
      }
    },
    {
      "@type": "Question",
      "name": "How long does it take to set up VocUI for Property Managers?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Most Property Managers get set up in under an hour. Upload your existing content -- service descriptions, FAQs, pricing pages, or PDFs -- and VocUI trains the chatbot automatically. Embed it on your website with a single snippet."
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
      "name": "How is VocUI different from a generic chatbot for Property Managers?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Unlike generic chatbots, VocUI is trained exclusively on your own content -- your service descriptions, policies, FAQs, and documents. It only answers questions relevant to your Property Managers business and escalates to your team when it cannot help, with full conversation context included."
      }
    }
  ]
};


// ─── Data ──────────────────────────────────────────────────────────────────────

const trustSignals = [
  'Answers tenant questions 24/7',
  'Trained only on your property policies',
  'GDPR-compliant data handling',
];

const painPoints: Array<{ icon: ElementType; title: string; body: ReactNode }> = [
  {
    icon: Phone,
    title: 'Tenants calling about the same lease and policy questions all week',
    body: 'When does my tenancy renew? Can I sublet? What are the rules on pets? Your property managers field the same questions from every new tenant — answers that are already in your tenancy agreement and welcome pack.',
  },
  {
    icon: MoonStar,
    title: 'After-hours maintenance requests misrouted or missed entirely',
    body: <span>A tenant&apos;s boiler breaks at 7pm on a Friday. Without a clear intake process, they call your emergency line, leave a voicemail, and wait — or they escalate unnecessarily. <a href="https://livechatai.com/blog/customer-support-response-time-statistics" target="_blank" rel="noopener noreferrer" className="underline decoration-dotted hover:text-primary-500 transition-colors">Nearly 60% of customers expect a response within 10 minutes</a> — structured intake at any hour prevents both.</span>,
  },
  {
    icon: AlertCircle,
    title: 'Prospective tenant viewing requests not captured out of hours',
    body: "Someone browses your listings at 10pm and wants to book a viewing. Without instant capture, that enquiry sits in your inbox overnight and they've booked with a competitor by the time you respond.",
  },
];

const steps = [
  {
    step: '01',
    title: 'Train on your portfolio',
    description:
      'Upload your tenancy FAQs, maintenance procedures, property descriptions, and letting policies. Your chatbot learns your portfolio inside-out and answers consistently.',
  },
  {
    step: '02',
    title: 'Configure tenant and prospect flows',
    description:
      'Set up maintenance intake for current tenants and viewing request capture for prospects. Define escalation rules so urgent issues reach your team immediately.',
  },
  {
    step: '03',
    title: 'Deploy and reduce your call volume',
    description:
      "Embed on your website or tenant portal. Tenants get instant answers; prospects book viewings; your managers handle the issues that actually need a human.",
  },
];

const features = [
  {
    icon: BookOpen,
    name: 'Tenant FAQ automation',
    description:
      'Answer lease renewal dates, pet policies, subletting rules, and deposit return questions automatically — reducing repetitive calls to your office.',
  },
  {
    icon: Wrench,
    name: 'Maintenance request intake',
    description:
      'Capture structured maintenance requests 24/7 — issue type, urgency, and property details collected before it reaches your team, so nothing falls through the cracks.',
  },
  {
    icon: CalendarCheck,
    name: 'Viewing booking capture',
    description:
      'Prospects browsing after hours can request viewings directly through the chat. Every enquiry is captured and routed to your lettings team with full context.',
  },
  {
    icon: Clock,
    name: '24/7 availability',
    description:
      'Tenant issues and prospect enquiries do not keep office hours. Your chatbot handles both around the clock, so nothing waits until Monday morning.',
  },
  {
    icon: UserCheck,
    name: 'Manager escalation',
    description:
      'Urgent maintenance or complex tenancy questions escalate immediately to your team with the full conversation ready — no tenant has to explain themselves twice.',
  },
  {
    icon: KeyRound,
    name: 'Lease FAQ',
    description:
      'Walk tenants through notice periods, break clauses, rent review processes, and renewal options — answering policy questions consistently every time.',
  },
];

const verticals = [
  {
    icon: Home,
    title: 'Residential Lettings',
    description:
      'Handle tenant FAQ, maintenance intake, and viewing requests across your residential portfolio without tying up your lettings team.',
  },
  {
    icon: Building,
    title: 'Commercial Property',
    description:
      'Answer lease terms, service charge queries, and facilities management questions for commercial tenants at any hour.',
  },
  {
    icon: Building2,
    title: 'HMOs & Student Housing',
    description:
      'Manage high volumes of tenant queries from shared houses and student properties without scaling your admin headcount.',
  },
  {
    icon: KeyRound,
    title: 'Build-to-Rent',
    description:
      'Provide residents with instant answers on amenities, community policies, and maintenance — matching the experience your brand promises.',
  },
];

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ChatbotForPropertyManagersPage() {
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
          <Badge className="mb-6">AI Chatbot for Property Managers</Badge>

          <H1 className="max-w-4xl mb-6">
            Your tenants ask the same questions every month.{' '}
            <span className="text-primary-500">Your chatbot can answer them.</span>
          </H1>

          <p className="mx-auto max-w-2xl text-lg text-secondary-600 dark:text-secondary-400 mb-10">
            VocUI trains on your tenancy policies, maintenance procedures, and property FAQs — so
            your managers spend less time on the phone and more time managing properties that need attention.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="xl" asChild>
              <Link href="/signup">
                Build Your Property Management Chatbot Free
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button size="xl" variant="outline" asChild>
              <Link href="/pricing">See Pricing</Link>
            </Button>
          </div>

          <p className="text-sm text-secondary-500 dark:text-secondary-400">
            Answers tenant questions 24/7 &middot; Trained only on your property policies &middot; GDPR-compliant
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
            <Badge variant="outline" className="mb-4">The property management problem</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              Your team is answering questions a chatbot could handle
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              Not because your managers are slow. Because there&apos;s no system to handle the same
              tenant and prospect questions that arrive every single week — so it all falls on your team.
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
              Everything a property management chatbot actually needs
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              Built for property managers — not a generic widget bolted onto your site.
              Every feature is aimed at reducing call volume and capturing every tenant and prospect enquiry.
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
              <Badge variant="outline" className="mb-8">From a property management company using VocUI</Badge>
              <blockquote className="text-2xl font-semibold text-secondary-900 dark:text-secondary-100 leading-snug mb-6">
                &ldquo;Our managers were spending the first hour of every morning returning calls about
                lease renewals and pet policies. VocUI handles all of that now — tenants get answers
                instantly, and my team focuses on properties that genuinely need their attention.&rdquo;
              </blockquote>
              <p className="text-secondary-500 dark:text-secondary-400 text-sm">
                R.P. &mdash; Owner, Residential Property Management Company
              </p>
            </div>
          </div>
        </section>

        {/* ── Who It's For ────────────────────────────────────────────────────── */}
        <section className="container mx-auto px-4 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">Who it&apos;s for</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              For property managers who want their team focused on managing, not fielding calls
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              If your managers are fielding questions a chatbot could handle, VocUI pays for itself
              the moment your team gets their first uninterrupted property visit.
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
                { label: 'Chatbot for Real Estate', href: '/chatbot-for-real-estate', description: '24/7 lead capture and viewing bookings for estate agents.' },
                { label: 'Chatbot for Plumbers', href: '/chatbot-for-plumbers', description: 'Emergency booking and service FAQ for plumbing businesses.' },
                { label: 'Chatbot for Electricians', href: '/chatbot-for-electricians', description: 'Quote requests and services FAQ for electrical contractors.' },
                { label: 'Chatbot for Cleaning Services', href: '/chatbot-for-cleaning-services', description: 'Booking and pricing FAQ for cleaning and property services.' },
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
                Your managers&apos; time is too valuable for repeat tenant calls
              </h2>
              <p className="text-lg text-white/80 mb-2 max-w-xl mx-auto">
                Give tenants instant answers and let your team focus on properties and issues that actually need them.
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
                    Build Your Property Management Chatbot Free
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
