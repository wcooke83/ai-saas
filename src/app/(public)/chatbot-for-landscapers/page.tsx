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
  TrendingUp,
  HelpCircle,
  FileText,
  BookOpen,
  Clock,
  UserCheck,
  CalendarCheck,
  Leaf,
  Building2,
  Snowflake,
  Flower2,
} from 'lucide-react';

// ─── Metadata ──────────────────────────────────────────────────────────────────

export function generateMetadata(): Metadata {
  return {
    title: 'AI Chatbot for Landscapers | Quote Capture & Seasonal Services FAQ | VocUI',
    description:
      'Let an AI chatbot capture quote requests, answer service FAQs, and guide seasonal planning for your landscaping business — 24/7. Stop losing leads during the seasonal rush.',
    keywords: [
      'AI chatbot for landscapers',
      'landscaping chatbot',
      'landscaping quote capture chatbot',
      'lawn care FAQ chatbot',
      'landscaping lead automation',
    ],
    openGraph: {
      title: 'AI Chatbot for Landscapers | Quote Capture & Seasonal Services FAQ | VocUI',
      description:
        'Let an AI chatbot capture quote requests, answer service FAQs, and guide seasonal planning for your landscaping business — 24/7. Stop losing leads during the seasonal rush.',
      url: 'https://vocui.com/chatbot-for-landscapers',
      siteName: 'VocUI',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'AI Chatbot for Landscapers | Quote Capture & Seasonal Services FAQ | VocUI',
      description:
        'Let an AI chatbot capture quote requests, answer service FAQs, and guide seasonal planning for your landscaping business — 24/7. Stop losing leads during the seasonal rush.',
    },
    alternates: {
      canonical: 'https://vocui.com/chatbot-for-landscapers',
    },
    robots: { index: true, follow: true },
  };
}

// ─── Structured Data ───────────────────────────────────────────────────────────

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'VocUI — AI Chatbot for Landscapers',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  description:
    'AI chatbot that captures quote requests, answers service FAQs, and guides seasonal planning for landscaping businesses — 24/7, trained on your company content only.',
  url: 'https://vocui.com/chatbot-for-landscapers',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    description: 'Free plan available',
  },
  featureList: [
    'Quote request capture and intake',
    'Services FAQ automation',
    'Seasonal planning guidance',
    '24/7 after-hours availability',
    'Team escalation with full context',
    'Maintenance plan FAQ',
  ],
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What can VocUI's AI chatbot do for Landscapers?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Let an AI chatbot capture quote requests, answer service FAQs, and guide seasonal planning for your landscaping business \u2014 24/7. Stop losing leads during the seasonal rush."
      }
    },
    {
      "@type": "Question",
      "name": "How long does it take to set up VocUI for Landscapers?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Most Landscapers get set up in under an hour. Upload your existing content -- service descriptions, FAQs, pricing pages, or PDFs -- and VocUI trains the chatbot automatically. Embed it on your website with a single snippet."
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
      "name": "How is VocUI different from a generic chatbot for Landscapers?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Unlike generic chatbots, VocUI is trained exclusively on your own content -- your service descriptions, policies, FAQs, and documents. It only answers questions relevant to your Landscapers business and escalates to your team when it cannot help, with full conversation context included."
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
      "name": "AI Chatbot for Landscapers",
      "item": "https://vocui.com/chatbot-for-landscapers"
    }
  ]
};



// ─── Data ──────────────────────────────────────────────────────────────────────

const trustSignals = [
  'Captures quote requests 24/7',
  'Trained only on your business content',
  'GDPR-compliant data handling',
];

const painPoints: Array<{ icon: ElementType; title: string; body: ReactNode }> = [
  {
    icon: Phone,
    title: 'Quote requests come in faster than you can follow up',
    body: <span>During spring and early summer, quote requests pile up. You&apos;re on the road or on a job, so they go to voicemail or sit in your inbox. By the time you call back, the customer has already booked someone who responded faster. <a href="https://411locals.us/small-business-owners-dont-answer-62-of-phone-calls/" target="_blank" rel="noopener noreferrer" className="underline decoration-dotted hover:text-primary-500 transition-colors">Small businesses miss 62% of inbound calls.</a></span>,
  },
  {
    icon: HelpCircle,
    title: "Customers unsure what services they need waste your quoting time",
    body: "Do I need a full garden redesign or just regular maintenance? Can you do both lawn care and hedging? Customers who don't know what they want take time to qualify before you can even estimate the job — time you could spend on site.",
  },
  {
    icon: TrendingUp,
    title: 'Seasonal rush means missed leads at the worst possible time',
    body: "Spring is when everyone wants a quote at once. Your busiest season is exactly when you have the least time to respond to new enquiries — so the leads you miss are the highest-value ones, from customers ready to spend now.",
  },
];

const steps = [
  {
    step: '01',
    title: 'Train on your services',
    description:
      'Upload your service list, seasonal guides, maintenance plan details, and FAQ answers. Your chatbot learns your business and gives accurate answers to every visitor.',
  },
  {
    step: '02',
    title: 'Configure quote and planning flows',
    description:
      'Set up quote intake forms for different job types — lawn maintenance, garden design, commercial grounds. Define escalation rules so jobs that need a site visit route directly to your team.',
  },
  {
    step: '03',
    title: 'Deploy and capture the seasonal rush',
    description:
      'Embed on your website or Google Business profile. Every spring visitor gets an instant response and a quote request form — even while you\'re on a job.',
  },
];

const features = [
  {
    icon: FileText,
    name: 'Quote capture',
    description:
      "Collect job type, property size, and scope details from every visitor who wants a quote — even during peak season when you can't be near the phone.",
  },
  {
    icon: BookOpen,
    name: 'Services FAQ',
    description:
      "Answer questions about what services you offer, what's included in each package, and how your pricing works — before a customer needs to call.",
  },
  {
    icon: Leaf,
    name: 'Seasonal planning guidance',
    description:
      "Guide customers through what work makes sense at each time of year — spring prep, summer maintenance, autumn tidy-ups — so they arrive as better-qualified leads.",
  },
  {
    icon: Clock,
    name: '24/7 availability',
    description:
      'Your chatbot answers at midnight as well as at midday, through spring rush and winter quiet alike. Capture every enquiry, even when you\'re on a job.',
  },
  {
    icon: UserCheck,
    name: 'Team escalation',
    description:
      'Jobs that need a site visit or a detailed quote escalate to your team with the full conversation context already captured — so you know what you\'re quoting before you arrive.',
  },
  {
    icon: CalendarCheck,
    name: 'Maintenance plan FAQ',
    description:
      'Explain your regular maintenance contracts, what they cover, and how to sign up — converting one-off quote requests into long-term recurring customers.',
  },
];

const verticals = [
  {
    icon: Leaf,
    title: 'Lawn Maintenance',
    description:
      'Handle regular mowing, fertilisation, and lawn care quote requests without interrupting your crews on the road.',
  },
  {
    icon: Flower2,
    title: 'Garden Design',
    description:
      'Qualify garden redesign and planting scheme enquiries and route serious prospects to your design consultation booking.',
  },
  {
    icon: Building2,
    title: 'Commercial Grounds',
    description:
      'Capture commercial grounds maintenance and seasonal contract enquiries with full property details already collected.',
  },
  {
    icon: Snowflake,
    title: 'Snow Removal',
    description:
      'Prepare winter contract enquiries in advance and let your chatbot capture snow clearance leads before the first snowfall.',
  },
];

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ChatbotForLandscapersPage() {
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
          <Badge className="mb-6">AI Chatbot for Landscapers</Badge>

          <H1 className="max-w-4xl mb-6">
            The spring rush is coming.{' '}
            <span className="text-primary-500">Your chatbot captures every quote request.</span>
          </H1>

          <p className="mx-auto max-w-2xl text-lg text-secondary-600 dark:text-secondary-400 mb-10">
            VocUI trains on your services, pricing, and seasonal guides — so every website visitor
            gets an instant response, quote requests are captured automatically, and your crews stay
            focused on the jobs rather than the phones.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="xl" asChild>
              <Link href="/signup">
                Build Your Landscaping Chatbot Free
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button size="xl" variant="outline" asChild>
              <Link href="/pricing">See Pricing</Link>
            </Button>
          </div>

          <p className="text-sm text-secondary-500 dark:text-secondary-400">
            Captures quote requests 24/7 &middot; Trained only on your business content &middot; GDPR-compliant
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
            <Badge variant="outline" className="mb-4">The seasonal lead problem</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              Landscaping businesses lose their best leads when they&apos;re busiest
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              Not because the work isn&apos;t good enough. Because peak season is exactly when you
              have the least time to respond — and customers who can&apos;t get an answer quickly
              book someone else.
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
              Everything a landscaping business chatbot actually needs
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              Built for landscaping and grounds businesses — not a generic widget bolted onto your site.
              Every feature is aimed at capturing more quote requests and converting them into booked jobs.
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
              <Badge variant="outline" className="mb-8">From a landscaping business using VocUI</Badge>
              <blockquote className="text-2xl font-semibold text-secondary-900 dark:text-secondary-100 leading-snug mb-6">
                &ldquo;Spring used to mean a backlog of callbacks I couldn&apos;t get through. Now
                VocUI captures every quote request while I&apos;m on site, and I come home to a
                tidy list of leads with all the details already filled in.&rdquo;
              </blockquote>
              <p className="text-secondary-500 dark:text-secondary-400 text-sm">
                S.B. &mdash; Owner, Independent Landscaping Business
              </p>
            </div>
          </div>
        </section>

        {/* ── Who It's For ────────────────────────────────────────────────────── */}
        <section className="container mx-auto px-4 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">Who it&apos;s for</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              For landscaping businesses that want their crews on jobs, not answering phones
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              If you&apos;re missing quote requests during the seasonal rush because you can&apos;t
              respond fast enough, VocUI pays for itself the moment you land your first captured lead.
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
                Don&apos;t let another seasonal rush pass with missed leads
              </h2>
              <p className="text-lg text-white/80 mb-2 max-w-xl mx-auto">
                Give every website visitor an instant response and let your chatbot fill your quote pipeline while your crews are on the road.
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
                    Build Your Landscaping Chatbot Free
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
