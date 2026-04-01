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
  PhoneCall,
  MoonStar,
  MessageSquare,
  BookOpen,
  CalendarCheck,
  Clock,
  DollarSign,
  ShieldCheck,
  Home,
  Building2,
  KeyRound,
  HardHat,
} from 'lucide-react';

// ─── Metadata ──────────────────────────────────────────────────────────────────

export function generateMetadata(): Metadata {
  return {
    title: 'AI Chatbot for Cleaning Companies | Instant Booking & Pricing FAQ | VocUI',
    description:
      'Stop losing bookings to slow responses. An AI chatbot for your cleaning business answers pricing questions instantly and captures quote requests 24/7.',
    keywords: [
      'AI chatbot for cleaning companies',
      'cleaning service chatbot',
      'cleaning booking chatbot',
      'cleaning pricing FAQ chatbot',
      'cleaning business automation',
    ],
    openGraph: {
      title: 'AI Chatbot for Cleaning Companies | Instant Booking & Pricing FAQ | VocUI',
      description:
        'Stop losing bookings to slow responses. An AI chatbot for your cleaning business answers pricing questions instantly and captures quote requests 24/7.',
      url: 'https://vocui.com/chatbot-for-cleaning-services',
      siteName: 'VocUI',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'AI Chatbot for Cleaning Companies | Instant Booking & Pricing FAQ | VocUI',
      description:
        'Stop losing bookings to slow responses. An AI chatbot for your cleaning business answers pricing questions instantly and captures quote requests 24/7.',
    },
    alternates: {
      canonical: 'https://vocui.com/chatbot-for-cleaning-services',
    },
    robots: { index: true, follow: true },
  };
}

// ─── Structured Data ───────────────────────────────────────────────────────────

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'VocUI — AI Chatbot for Cleaning Services',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  description:
    'AI chatbot that handles booking requests and pricing FAQ for cleaning companies — trained on your services, available 24/7.',
  url: 'https://vocui.com/chatbot-for-cleaning-services',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    description: 'Free plan available',
  },
  featureList: [
    'Instant pricing FAQ responses',
    'Quote request capture 24/7',
    'Appointment booking via Easy!Appointments',
    'After-hours lead capture',
    'Service scope qualification',
    'GDPR-compliant data handling',
  ],
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What can VocUI's AI chatbot do for Cleaning Services?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Stop losing bookings to slow responses. An AI chatbot for your cleaning business answers pricing questions instantly and captures quote requests 24/7."
      }
    },
    {
      "@type": "Question",
      "name": "How long does it take to set up VocUI for Cleaning Services?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Most Cleaning Services get set up in under an hour. Upload your existing content -- service descriptions, FAQs, pricing pages, or PDFs -- and VocUI trains the chatbot automatically. Embed it on your website with a single snippet."
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
      "name": "How is VocUI different from a generic chatbot for Cleaning Services?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Unlike generic chatbots, VocUI is trained exclusively on your own content -- your service descriptions, policies, FAQs, and documents. It only answers questions relevant to your Cleaning Services business and escalates to your team when it cannot help, with full conversation context included."
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
      "name": "AI Chatbot for Cleaning Services",
      "item": "https://vocui.com/chatbot-for-cleaning-services"
    }
  ]
};



// ─── Data ──────────────────────────────────────────────────────────────────────

const trustSignals = [
  'Captures quote requests 24/7 — including evenings and weekends',
  'Instant answers to pricing and services questions',
  'No coding required to set up',
];

const painPoints: Array<{ icon: ElementType; title: string; body: ReactNode }> = [
  {
    icon: PhoneCall,
    title: 'Quote requests sit unanswered until the next morning',
    body: <span>A homeowner fills in your contact form at 8pm. <a href="https://livechatai.com/blog/customer-support-response-time-statistics" target="_blank" rel="noopener noreferrer" className="underline decoration-dotted hover:text-primary-500 transition-colors">Nearly 60% of people expect a response within 10 minutes</a> — by the time you reply at 9am, they&apos;ve already booked with a competitor.</span>,
  },
  {
    icon: MoonStar,
    title: 'After-hours pricing questions lose bookings to competitors',
    body: 'Potential customers research cleaning companies outside working hours. Without an instant response to basic pricing questions, you lose those enquiries before they ever reach you.',
  },
  {
    icon: MessageSquare,
    title: 'The same scope and pricing questions on repeat',
    body: 'How much for a 3-bed house? Do you bring your own products? How long does it take? Your team answers these every day — time that could be spent on the actual cleaning.',
  },
];

const steps = [
  {
    step: '01',
    title: 'Add your services and pricing',
    description:
      'Upload your service list, pricing guide, and FAQs. Your chatbot learns what you offer, what areas you cover, and how your pricing works.',
  },
  {
    step: '02',
    title: 'Collect quote details automatically',
    description:
      'Configure the chatbot to ask the right questions — property type, number of bedrooms, frequency, any add-ons. Qualified quote requests arrive ready to price.',
  },
  {
    step: '03',
    title: 'Embed and start capturing bookings',
    description:
      'Go live on your website in minutes. Visitors get instant answers; serious enquiries book a slot or request a quote without waiting for a callback.',
  },
];

const features = [
  {
    icon: BookOpen,
    name: 'Trained on your services and pricing',
    description:
      'Your chatbot answers from your own service pages and price guides — not generic information that confuses customers.',
  },
  {
    icon: DollarSign,
    name: 'Instant pricing FAQ responses',
    description:
      'Handle per-room, per-hour, and package pricing questions in real time. Customers get clarity; you get warmer leads.',
  },
  {
    icon: CalendarCheck,
    name: 'Booking and quote scheduling',
    description:
      'Connect to your calendar via Easy!Appointments. Customers book assessments or first cleans directly from the chat.',
  },
  {
    icon: Clock,
    name: '24/7 availability — evenings and weekends',
    description:
      'Cleaning enquiries peak outside office hours. Your chatbot captures every one of them while you focus on the job.',
  },
  {
    icon: MessageSquare,
    name: 'Scope qualification before you call back',
    description:
      'Know property size, service type, and frequency before making the first call. No time wasted on unqualified enquiries.',
  },
  {
    icon: ShieldCheck,
    name: 'GDPR-compliant data handling',
    description:
      'Customer contact details and conversation data handled per GDPR. Data processing agreements available for Enterprise.',
  },
];

const verticals = [
  {
    icon: Home,
    title: 'Domestic Cleaning',
    description:
      'Answer frequency, products, and pricing questions from homeowners browsing after work or at weekends.',
  },
  {
    icon: Building2,
    title: 'Commercial Office Cleaning',
    description:
      'Qualify office size, frequency, and contract requirements before sending a commercial proposal.',
  },
  {
    icon: KeyRound,
    title: 'End-of-Tenancy Cleaning',
    description:
      'Handle move-out checklist questions, pricing by property size, and booking requests from tenants on tight deadlines.',
  },
  {
    icon: HardHat,
    title: 'Post-Construction Cleaning',
    description:
      'Capture project scope details and timelines from developers and site managers automatically.',
  },
];

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ChatbotForCleaningServicesPage() {
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
          <Badge className="mb-6">AI Chatbot for Cleaning Companies</Badge>

          <H1 className="max-w-4xl mb-6">
            Stop losing cleaning bookings to competitors who respond faster.{' '}
            <span className="text-primary-500">Answer instantly, 24/7.</span>
          </H1>

          <p className="mx-auto max-w-2xl text-lg text-secondary-600 dark:text-secondary-400 mb-10">
            VocUI trains on your services, pricing, and service areas — so every pricing question
            gets answered and every quote request gets captured, even while you&apos;re on the job.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="xl" asChild>
              <Link href="/signup">
                Build Your Cleaning Chatbot Free
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button size="xl" variant="outline" asChild>
              <Link href="/pricing">See Pricing</Link>
            </Button>
          </div>

          <p className="text-sm text-secondary-500 dark:text-secondary-400">
            Captures quote requests 24/7 &middot; Instant answers to pricing questions &middot; No coding required
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
            <Badge variant="outline" className="mb-4">The response problem</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              In cleaning, the fastest response wins the booking
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              Customers searching for cleaning services compare multiple companies at once. Slow responses —
              even by a few hours — hand the booking to whoever responds first.
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
              Everything a cleaning business chatbot actually needs
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              Built for cleaning company lead capture — not a generic support widget.
              Every feature is aimed at turning website visitors into booked jobs.
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
              <Badge variant="outline" className="mb-8">From a cleaning company using VocUI</Badge>
              <blockquote className="text-2xl font-semibold text-secondary-900 dark:text-secondary-100 leading-snug mb-6">
                &ldquo;We were missing enquiries every evening. VocUI now captures them all and
                tells people our pricing before we even call them back. Bookings have picked up noticeably.&rdquo;
              </blockquote>
              <p className="text-secondary-500 dark:text-secondary-400 text-sm">
                T.H. &mdash; Owner, Domestic &amp; Commercial Cleaning Company
              </p>
            </div>
          </div>
        </section>

        {/* ── Who It's For ────────────────────────────────────────────────────── */}
        <section className="container mx-auto px-4 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">Who it&apos;s for</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              For cleaning companies that want every enquiry captured
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              Whether you run domestic rounds, commercial contracts, or specialist cleans —
              VocUI ensures no enquiry goes unanswered because you were on a job.
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
                { label: 'Chatbot for HVAC Companies', href: '/chatbot-for-hvac', description: 'Maintenance booking and emergency support for HVAC businesses.' },
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
                Never miss another cleaning enquiry
              </h2>
              <p className="text-lg text-white/80 mb-2 max-w-xl mx-auto">
                Build a chatbot that answers pricing questions and captures bookings while you&apos;re on the job — day or night.
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
                    Build Your Cleaning Chatbot Free
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
