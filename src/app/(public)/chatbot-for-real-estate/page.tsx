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
  Zap,
  Inbox,
  Filter,
  BookOpen,
  UserCheck,
  CalendarCheck,
  MessageSquare,
  Bell,
  Home,
  Building2,
  Landmark,
  Briefcase,
} from 'lucide-react';

// ─── Metadata ──────────────────────────────────────────────────────────────────

export function generateMetadata(): Metadata {
  return {
    title: 'AI Chatbot for Real Estate | 24/7 Lead Capture & Property FAQs | VocUI',
    description:
      'Capture and qualify buyer and seller leads 24/7 with an AI chatbot. Answer property questions, book viewings, and route hot leads to your agents automatically.',
    keywords: [
      'AI chatbot for real estate',
      'real estate lead capture chatbot',
      'property chatbot',
      'automated viewing booking',
      'real estate AI assistant',
    ],
    openGraph: {
      title: 'AI Chatbot for Real Estate | 24/7 Lead Capture & Property FAQs | VocUI',
      description:
        'Capture and qualify buyer and seller leads 24/7 with an AI chatbot. Answer property questions, book viewings, and route hot leads to your agents automatically.',
      url: 'https://vocui.com/chatbot-for-real-estate',
      siteName: 'VocUI',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'AI Chatbot for Real Estate | 24/7 Lead Capture & Property FAQs | VocUI',
      description:
        'Capture and qualify buyer and seller leads 24/7 with an AI chatbot. Answer property questions, book viewings, and route hot leads to your agents automatically.',
    },
    alternates: {
      canonical: 'https://vocui.com/chatbot-for-real-estate',
    },
    robots: { index: true, follow: true },
  };
}

// ─── Structured Data ───────────────────────────────────────────────────────────

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'VocUI — AI Chatbot for Real Estate',
  applicationCategory: 'RealEstateAgent',
  operatingSystem: 'Web',
  description:
    'AI chatbot platform for real estate. Capture and qualify buyer and seller leads 24/7, answer property questions, and book viewings automatically.',
  url: 'https://vocui.com/chatbot-for-real-estate',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Can the chatbot answer questions about specific properties for sale or rent?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, if you upload property details, area guides, and listing FAQs. It answers questions about specific properties, the neighbourhoods you cover, and your agency's process — 24/7."
      }
    },
    {
      "@type": "Question",
      "name": "Will VocUI book property viewings?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, via Easy!Appointments. Prospective buyers and tenants can schedule viewings directly from the chat, including evenings and weekends when motivation is highest."
      }
    },
    {
      "@type": "Question",
      "name": "Can the chatbot help qualify buyer and tenant enquiries before they reach an agent?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. It captures key information — budget, timeline, requirements — and routes qualified leads to the right agent with context, so your team focuses on prospects who can actually proceed."
      }
    },
    {
      "@type": "Question",
      "name": "How does VocUI handle valuation enquiries?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "It can explain your valuation process, what's involved in a market appraisal, and book a valuation appointment via Easy!Appointments — turning inbound vendor interest into booked valuations."
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
      "name": "AI Chatbot for Real Estate",
      "item": "https://vocui.com/chatbot-for-real-estate"
    }
  ]
};



// ─── Data ──────────────────────────────────────────────────────────────────────

const trustSignals = [
  'Captures leads 24/7 — including weekends',
  'Qualifies buyers and sellers automatically',
  'Books viewings without agent involvement',
];

const painPoints: Array<{ icon: ElementType; stat: string; title: string; body: ReactNode }> = [
  {
    icon: Zap,
    stat: '72% of buyers work with the first agent who responds',
    title: 'Timing',
    body: "A buyer finds your listing at 9pm on Sunday. They fill out a contact form. By Monday morning, they've already called three other agents who had a chatbot answering instantly.",
  },
  {
    icon: Inbox,
    stat: 'Portals generate inquiries faster than agents can respond',
    title: 'Volume',
    body: <span>Property portals send leads at all hours. <a href="https://livechatai.com/blog/customer-support-response-time-statistics" target="_blank" rel="noopener noreferrer" className="underline decoration-dotted hover:text-primary-500 transition-colors">Nearly 60% of people expect a response within 10 minutes</a> — without automation, you&apos;re paying for leads your response time is losing.</span>,
  },
  {
    icon: Filter,
    stat: 'Unqualified inquiries drain your showing schedule',
    title: 'Qualification',
    body: 'Without a qualification step, every inquiry gets a viewing slot — including window shoppers and buyers two years from purchasing.',
  },
];

const steps = [
  {
    step: '01',
    title: 'Train on your listings and services',
    description:
      'Add your current listings, service area, buying/selling process, and FAQ content. Your chatbot answers property questions from your actual inventory and policies.',
  },
  {
    step: '02',
    title: 'Qualify automatically',
    description:
      'Configure qualifying questions: budget range, timeline, property type, location preference. Your chatbot collects this in natural conversation — no forms, no friction.',
  },
  {
    step: '03',
    title: 'Book viewings and notify agents',
    description:
      'Connect your calendar for direct booking. Hot leads notify your agents instantly via webhook or Slack.',
  },
];

const features = [
  {
    icon: CheckCircle2,
    name: '24/7 lead capture',
    description:
      'Never miss an inquiry from a portal, website, or social ad — your chatbot captures and qualifies every lead, day or night.',
  },
  {
    icon: UserCheck,
    name: 'Automated buyer qualification',
    description:
      'Collect budget, timeline, property type, and location preferences in natural conversation before your agent picks up the phone.',
  },
  {
    icon: CalendarCheck,
    name: 'Viewing bookings',
    description:
      'Let qualified buyers book viewings directly in the chat using your calendar availability.',
  },
  {
    icon: BookOpen,
    name: 'Property FAQ answers',
    description:
      'Answer questions about specific listings, neighbourhoods, pricing, and your agency\'s services from your own content.',
  },
  {
    icon: Bell,
    name: 'Hot lead notifications',
    description:
      'When a high-intent buyer qualifies, your agent is notified immediately — via Slack, email, or webhook to your CRM.',
  },
  {
    icon: MessageSquare,
    name: 'Seller lead capture',
    description:
      'Capture seller inquiries, answer valuation questions, and book appraisal appointments automatically.',
  },
];

const testimonials = [
  {
    quote:
      "We used to miss after-hours inquiries entirely. Now the chatbot handles them automatically — we get the lead captured and the viewing booked before the next morning.",
    name: 'J.D.',
    role: 'Principal Agent, Residential Sales',
  },
  {
    quote:
      "Response time dropped from 4 hours to 11 seconds. That alone moved our conversion rate on portal leads significantly — buyers don't wait.",
    name: 'Marcus T.',
    role: 'Director, Property Group',
  },
];

const verticals = [
  {
    icon: Home,
    title: 'Residential Sales Agents',
    description:
      'Capture buyer inquiries from your website and property portals 24/7. Qualify before the first call.',
  },
  {
    icon: Building2,
    title: 'Rental & Property Management',
    description:
      'Handle tenancy FAQ questions, rental criteria, and viewing requests without staff involvement.',
  },
  {
    icon: Landmark,
    title: 'Property Developers',
    description:
      'Answer off-plan project FAQs, capture buyer interest, and book site visits automatically.',
  },
  {
    icon: Briefcase,
    title: 'Commercial Real Estate',
    description:
      'Qualify commercial tenant inquiries, answer lease terms and availability questions, and route leads to the right agent.',
  },
];

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ChatbotForRealEstatePage() {
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
            <li className="text-secondary-900 dark:text-secondary-100 font-medium">AI Chatbot for Real Estate</li>
          </ol>
        </nav>


        {/* ── Hero ────────────────────────────────────────────────────────────── */}
        <section className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center container mx-auto px-4 py-16 text-center">
          <Badge className="mb-6">AI Chatbot for Real Estate</Badge>

          <H1 className="max-w-4xl mb-6">
            Property buyers don&apos;t wait until Monday.{' '}
            <span className="text-primary-500">Your chatbot shouldn&apos;t either.</span>
          </H1>

          <p className="mx-auto max-w-2xl text-lg text-secondary-600 dark:text-secondary-400 mb-10">
            VocUI captures and qualifies leads around the clock — answering property questions,
            collecting buyer preferences, and booking viewings automatically.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="xl" asChild>
              <Link href="/signup">
                Build Your Real Estate Chatbot Free
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button size="xl" variant="outline" asChild>
              <Link href="/pricing">See Pricing</Link>
            </Button>
          </div>

          <p className="text-sm text-secondary-500 dark:text-secondary-400">
            Free plan available &middot; No credit card required &middot; Live in under an hour
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
            <Badge variant="outline" className="mb-4">The real estate lead problem</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              Real estate leads go cold fast — and most agents aren&apos;t available when interest peaks
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              The window between inquiry and decision is measured in hours, not days.
              The agent who responds first wins the client.
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
                  <p className="text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wide mb-2">
                    {p.stat}
                  </p>
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
                From property inquiry to qualified lead — automatically
              </h2>
            </div>

            <div className="grid gap-10 md:grid-cols-3 max-w-5xl mx-auto relative">
              {/* Connector line — desktop only */}
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
                  Build Your Real Estate Chatbot Free
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* ── Features ────────────────────────────────────────────────────────── */}
        <section className="container mx-auto px-4 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">Built for real estate</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              Everything a real estate chatbot actually needs
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              Not just a contact form replacement. A full lead engine — from first inquiry
              to qualified, booked prospect.
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

        {/* ── Testimonials ────────────────────────────────────────────────────── */}
        <section className="bg-secondary-50 dark:bg-secondary-800/30 py-24">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <Badge variant="outline" className="mb-4">What customers say</Badge>
              <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100">
                Agents who stopped losing leads to slow response times
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
              {testimonials.map((t) => (
                <div
                  key={t.name}
                  className="bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-xl p-8 hover:border-primary-200 dark:hover:border-primary-700 transition-colors"
                >
                  <p className="text-secondary-700 dark:text-secondary-300 leading-relaxed mb-6 italic">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div>
                    <p className="font-semibold text-secondary-900 dark:text-secondary-100">{t.name}</p>
                    <p className="text-sm text-secondary-500 dark:text-secondary-400">{t.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Who It's For ────────────────────────────────────────────────────── */}
        <section className="container mx-auto px-4 py-24">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <Badge variant="outline" className="mb-4">Who it&apos;s for</Badge>
              <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
                For every real estate business that competes on response speed
              </h2>
              <p className="text-secondary-600 dark:text-secondary-400">
                If a missed inquiry is a missed commission, VocUI pays for itself on the first lead it captures.
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
          </div>
        </section>

        <section className="container mx-auto px-4 py-16">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-6">Related industries</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: 'Chatbot for Property Managers', href: '/chatbot-for-property-managers', description: 'Tenant FAQ and maintenance request intake for property managers.' },
                { label: 'Chatbot for Mortgage Brokers', href: '/chatbot-for-mortgage-brokers', description: 'Rate FAQ and application lead capture for mortgage brokers.' },
                { label: 'Chatbot for Mortgage Lenders', href: '/chatbot-for-mortgage-lenders', description: 'Loan FAQ and pre-qualification lead capture for lenders.' },
                { label: 'Chatbot for Law Firms', href: '/chatbot-for-lawyers', description: 'Client intake, practice area FAQ, and consultation booking.' },
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
                The fastest response wins the client. Your chatbot is always first.
              </h2>
              <p className="text-lg text-white/80 mb-2 max-w-xl mx-auto">
                Build a lead capture chatbot that qualifies buyers and sellers while you sleep.
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
                    Build Your Real Estate Chatbot Free
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button
                  size="xl"
                  variant="outline-light"
                  asChild
                >
                  <Link href="/pricing">View Pricing</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>


          {/* Related Blog Post */}
          <div className="mt-6 mb-2 rounded-xl border border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-800/50 p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary-600 dark:text-primary-400 mb-2">Related reading</p>
            <Link href="/blog/chatbot-for-real-estate" className="font-semibold text-secondary-900 dark:text-secondary-100 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              AI Chatbot for Real Estate: Qualifying Buyers, Booking Viewings, and Capturing Vendor Leads →
            </Link>
          </div>
      </main>

      <Footer />
    </PageBackground>
  );
}
