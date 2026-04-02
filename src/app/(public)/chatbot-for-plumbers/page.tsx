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
  PhoneOff,
  MoonStar,
  DollarSign,
  BookOpen,
  CalendarCheck,
  Clock,
  Zap,
  ShieldCheck,
  AlertTriangle,
  Home,
  Building2,
  Bath,
} from 'lucide-react';

// ─── Metadata ──────────────────────────────────────────────────────────────────

export function generateMetadata(): Metadata {
  return {
    title: 'AI Chatbot for Plumbers | Emergency Booking & Service FAQ | VocUI',
    description:
      'Capture emergency call-outs and answer pricing FAQ automatically. An AI chatbot for plumbers that works 24/7 — even when you\'re mid-job and can\'t pick up the phone.',
    keywords: [
      'AI chatbot for plumbers',
      'plumbing chatbot',
      'emergency plumbing booking chatbot',
      'plumber FAQ chatbot',
      'plumbing lead capture',
    ],
    openGraph: {
      title: 'AI Chatbot for Plumbers | Emergency Booking & Service FAQ | VocUI',
      description:
        'Capture emergency call-outs and answer pricing FAQ automatically. An AI chatbot for plumbers that works 24/7 — even when you\'re mid-job and can\'t pick up the phone.',
      url: 'https://vocui.com/chatbot-for-plumbers',
      siteName: 'VocUI',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'AI Chatbot for Plumbers | Emergency Booking & Service FAQ | VocUI',
      description:
        'Capture emergency call-outs and answer pricing FAQ automatically. An AI chatbot for plumbers that works 24/7 — even when you\'re mid-job and can\'t pick up the phone.',
    },
    alternates: {
      canonical: 'https://vocui.com/chatbot-for-plumbers',
    },
    robots: { index: true, follow: true },
  };
}

// ─── Structured Data ───────────────────────────────────────────────────────────

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'VocUI — AI Chatbot for Plumbers',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  description:
    'AI chatbot that captures emergency bookings and handles service FAQ for plumbers and plumbing companies — available 24/7.',
  url: 'https://vocui.com/chatbot-for-plumbers',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    description: 'Free plan available',
  },
  featureList: [
    'Emergency call-out capture 24/7',
    'Callout fee and pricing FAQ',
    'Appointment booking via Easy!Appointments',
    'After-hours lead capture',
    'Job type qualification',
    'GDPR-compliant data handling',
  ],
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Can the chatbot handle emergency plumbing enquiries after hours?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "You configure the escalation rules. For emergencies — burst pipes, no hot water, flooding — the chatbot surfaces your emergency call-out number immediately rather than asking customers to wait until morning."
      }
    },
    {
      "@type": "Question",
      "name": "What plumbing questions can VocUI answer automatically?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Opening hours, call-out fees, what's included in a standard visit, areas you cover, typical job pricing for common jobs like boiler services and tap replacements, and how to book."
      }
    },
    {
      "@type": "Question",
      "name": "Will VocUI book plumbing appointments?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, via Easy!Appointments. Customers can book routine jobs — boiler services, leak repairs, installation consultations — directly from the chat at any time."
      }
    },
    {
      "@type": "Question",
      "name": "Can the chatbot provide plumbing repair estimates?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "It can share your standard pricing for common jobs if you upload a pricing guide. For complex or bespoke work, it captures the job details and routes the enquiry to your team for a proper quote."
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
      "name": "AI Chatbot for Plumbers",
      "item": "https://vocui.com/chatbot-for-plumbers"
    }
  ]
};



// ─── Data ──────────────────────────────────────────────────────────────────────

const trustSignals = [
  'Captures emergency call-outs 24/7',
  'Answers callout fee and services questions instantly',
  'No coding required to get live',
];

const painPoints: Array<{ icon: ElementType; title: string; body: ReactNode }> = [
  {
    icon: PhoneOff,
    title: 'Emergency calls come in while you\'re under a sink',
    body: <span>You can&apos;t answer every call when you&apos;re on a job. <a href="https://411locals.us/small-business-owners-dont-answer-62-of-phone-calls/" target="_blank" rel="noopener noreferrer" className="underline decoration-dotted hover:text-primary-500 transition-colors">Small businesses miss 62% of inbound calls</a> — someone with a burst pipe won&apos;t wait and will call whoever picks up next.</span>,
  },
  {
    icon: DollarSign,
    title: 'The same callout fee and services questions every day',
    body: 'What\'s your callout charge? Do you work weekends? How quickly can you come out? These questions come in constantly — and someone has to answer them before you get paid anything.',
  },
  {
    icon: MoonStar,
    title: 'After-hours quote requests go straight to a competitor',
    body: <span>Homeowners search for plumbers when problems happen — often evenings or weekends. <a href="https://www.contractornerd.com/blog/home-services-statistics/" target="_blank" rel="noopener noreferrer" className="underline decoration-dotted hover:text-primary-500 transition-colors">Over 55% of consumers search before scheduling a home services appointment</a> — without a response, they book whoever responds first.</span>,
  },
];

const steps = [
  {
    step: '01',
    title: 'Upload your services and pricing',
    description:
      'Add your service list, callout charges, area coverage, and FAQ. Your chatbot learns exactly what you offer and what it costs.',
  },
  {
    step: '02',
    title: 'Set up emergency triage',
    description:
      'Configure priority questions for emergency jobs — leak type, property access, urgency level. Customers provide the details you need before you call back.',
  },
  {
    step: '03',
    title: 'Embed and capture every call-out',
    description:
      'Go live on your website. Emergency requests and booking enquiries are captured automatically — even when you\'re on a job.',
  },
];

const features = [
  {
    icon: BookOpen,
    name: 'Trained on your services and pricing',
    description:
      'Your chatbot answers from your own service list and pricing guide — callout fees, hourly rates, area coverage, and more.',
  },
  {
    icon: Zap,
    name: 'Emergency call-out capture',
    description:
      'Triage urgent jobs automatically. Collect the key details so you can assess and prioritise before returning the call.',
  },
  {
    icon: CalendarCheck,
    name: 'Appointment and callback booking',
    description:
      'Connect to your calendar via Easy!Appointments. Non-emergency jobs book a slot directly from the chat.',
  },
  {
    icon: Clock,
    name: '24/7 availability',
    description:
      'Plumbing problems don\'t keep office hours. Your chatbot captures every enquiry whether it\'s 2pm or 2am.',
  },
  {
    icon: DollarSign,
    name: 'Callout fee FAQ handled automatically',
    description:
      'Eliminate the pricing objection before you arrive. Customers know what to expect and confirm before booking.',
  },
  {
    icon: ShieldCheck,
    name: 'GDPR-compliant data handling',
    description:
      'Customer contact and job details handled per GDPR. Data processing agreements available for Enterprise.',
  },
];

const verticals = [
  {
    icon: AlertTriangle,
    title: 'Emergency Plumbing',
    description:
      'Capture burst pipes, boiler failures, and flood jobs immediately — with all the key details collected upfront.',
  },
  {
    icon: Home,
    title: 'Residential Plumbing',
    description:
      'Answer bathroom, kitchen, and central heating questions and book routine jobs automatically.',
  },
  {
    icon: Building2,
    title: 'Commercial Plumbing',
    description:
      'Qualify site access, scope, and urgency for commercial clients before the first site visit.',
  },
  {
    icon: Bath,
    title: 'Bathroom Renovation',
    description:
      'Handle design specification questions, quote request capture, and project timeline enquiries.',
  },
];

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ChatbotForPlumbersPage() {
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
            <li className="text-secondary-900 dark:text-secondary-100 font-medium">AI Chatbot for Plumbers</li>
          </ol>
        </nav>


        {/* ── Hero ────────────────────────────────────────────────────────────── */}
        <section className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center container mx-auto px-4 py-16 text-center">
          <Badge className="mb-6">AI Chatbot for Plumbers</Badge>

          <H1 className="max-w-4xl mb-6">
            You can&apos;t answer calls when you&apos;re under a sink.{' '}
            <span className="text-primary-500">Your chatbot can.</span>
          </H1>

          <p className="mx-auto max-w-2xl text-lg text-secondary-600 dark:text-secondary-400 mb-10">
            VocUI trains on your callout fees, service areas, and FAQs — so every emergency
            request and pricing enquiry is captured automatically, even when you&apos;re mid-job.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="xl" asChild>
              <Link href="/signup">
                Build Your Plumbing Chatbot Free
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button size="xl" variant="outline" asChild>
              <Link href="/pricing">See Pricing</Link>
            </Button>
          </div>

          <p className="text-sm text-secondary-500 dark:text-secondary-400">
            Captures emergency call-outs 24/7 &middot; Instant answers to callout fee questions &middot; No coding required
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
            <Badge variant="outline" className="mb-4">The missed job problem</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              Every unanswered call is a job going to someone else
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              When you&apos;re focused on the job in front of you, you can&apos;t be available for the next one.
              Without a system to capture those enquiries, they go straight to your competition.
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
                Live before your next emergency call-out. No developers needed.
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
              Everything a plumbing business chatbot actually needs
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              Built for trade businesses — not a generic widget. Every feature is aimed at
              capturing jobs and answering the questions that come before every booking.
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
                <Badge variant="outline" className="mb-4">How plumbing companies use VocUI</Badge>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
                  A typical week, before and after VocUI
                </h2>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  { step: 'Before', text: 'Jobs lost to missed calls while on site — prospective customers needing same-day help calling the next plumber on the list when nobody answered.' },
                  { step: 'Setup', text: 'Uploaded their services list, coverage area, callout policy, and typical pricing guide — configured without leaving a job to set up.' },
                  { step: 'After', text: 'Enquiry details captured while on site, including job type and urgency. Callbacks more informed and faster to book. Fewer lost jobs to missed calls.' },
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
              For plumbers and plumbing companies that can&apos;t afford to miss a job
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              Whether you&apos;re a sole trader or manage a team of engineers — VocUI ensures every
              enquiry is captured and qualified before you return the call.
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
                { label: 'Chatbot for Electricians', href: '/chatbot-for-electricians', description: 'Quote requests and services FAQ for electrical contractors.' },
                { label: 'Chatbot for HVAC Companies', href: '/chatbot-for-hvac', description: 'Maintenance booking and emergency support for HVAC businesses.' },
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
                Stop losing jobs to plumbers who answer faster
              </h2>
              <p className="text-lg text-white/80 mb-2 max-w-xl mx-auto">
                Build a chatbot that captures emergency call-outs and answers pricing questions — so no enquiry goes to a competitor while you&apos;re on a job.
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
                    Build Your Plumbing Chatbot Free
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
            <Link href="/blog/chatbot-for-plumbers" className="font-semibold text-secondary-900 dark:text-secondary-100 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              AI Chatbot for Plumbers: Handling Emergency Calls, Booking Jobs, and Quoting Common Work →
            </Link>
          </div>
      </main>

      <Footer />
    </PageBackground>
  );
}
