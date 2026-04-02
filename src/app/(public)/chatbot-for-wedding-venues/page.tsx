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
  CalendarX,
  MoonStar,
  HelpCircle,
  BookOpen,
  CalendarCheck,
  Headphones,
  ArrowUpRight,
  Clock,
  List,
  Home,
  Trees,
  Building,
  Sunset,
} from 'lucide-react';

// ─── Metadata ──────────────────────────────────────────────────────────────────

export function generateMetadata(): Metadata {
  return {
    title: 'AI Chatbot for Wedding Venues | Booking Enquiries & Package FAQ | VocUI',
    description:
      'Let an AI chatbot handle booking enquiries, package comparisons, and date availability checks for your wedding venue — 24/7, trained on your own content.',
    keywords: [
      'AI chatbot for wedding venues',
      'wedding venue chatbot',
      'booking enquiry chatbot',
      'wedding venue FAQ automation',
      'date availability chatbot',
    ],
    openGraph: {
      title: 'AI Chatbot for Wedding Venues | Booking Enquiries & Package FAQ | VocUI',
      description:
        'Let an AI chatbot handle booking enquiries, package comparisons, and date availability checks for your wedding venue — 24/7, trained on your own content.',
      url: 'https://vocui.com/chatbot-for-wedding-venues',
      siteName: 'VocUI',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'AI Chatbot for Wedding Venues | Booking Enquiries & Package FAQ | VocUI',
      description:
        'Let an AI chatbot handle booking enquiries, package comparisons, and date availability checks for your wedding venue — 24/7, trained on your own content.',
    },
    alternates: {
      canonical: 'https://vocui.com/chatbot-for-wedding-venues',
    },
    robots: { index: true, follow: true },
  };
}

// ─── Structured Data ───────────────────────────────────────────────────────────

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'VocUI — AI Chatbot for Wedding Venues',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  description:
    'AI chatbot that handles booking enquiries, package FAQs, and date availability checks for wedding venues — 24/7, trained on your content only.',
  url: 'https://vocui.com/chatbot-for-wedding-venues',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    description: 'Free plan available',
  },
  featureList: [
    'Booking enquiry capture with guest count and date',
    'Packages FAQ trained on your venue content',
    'Date availability check',
    '24/7 after-hours availability',
    'Coordinator escalation with conversation context',
    'Vendor list FAQ support',
  ],
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Can the chatbot answer questions about venue capacity, layouts, and exclusive use?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Upload your venue specifications — indoor and outdoor capacities, layout options, exclusive use terms — and the chatbot answers these initial questions automatically, before enquiries reach your events team."
      }
    },
    {
      "@type": "Question",
      "name": "Will VocUI handle wedding enquiry and show-round booking?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, via Easy!Appointments. Prospective couples can book show-round appointments directly from the chat — capturing interest at the moment it's highest, including evenings when couples are planning together."
      }
    },
    {
      "@type": "Question",
      "name": "Can the chatbot answer questions about preferred suppliers, catering, and packages?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Upload your packages, what's included, preferred supplier list, and catering FAQ — and the chatbot answers the questions that currently arrive by email and take days to respond to."
      }
    },
    {
      "@type": "Question",
      "name": "How does VocUI handle pricing and availability enquiries?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Upload your pricing guide and availability calendar process. The chatbot explains your pricing structure and routes date-specific availability queries to your team with the couple's key requirements already captured."
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
      "name": "AI Chatbot for Wedding Venues",
      "item": "https://vocui.com/chatbot-for-wedding-venues"
    }
  ]
};



// ─── Data ──────────────────────────────────────────────────────────────────────

const trustSignals = [
  'Captures booking enquiries 24/7',
  'Trained only on your venue content',
  'GDPR-compliant data handling',
];

const painPoints: Array<{ icon: ElementType; title: string; body: ReactNode }> = [
  {
    icon: CalendarX,
    title: 'Couples enquire on weekends when your team is at events',
    body: 'Your busiest days are Saturdays. So are your most important leads. Couples visit your website while you\'re managing a live event — and without an instant response, they move to the next venue on their shortlist.',
  },
  {
    icon: HelpCircle,
    title: 'Package comparison questions delay the tour booking',
    body: 'What\'s included in exclusive hire? Can we bring our own caterer? How many guests does the ceremony suite hold? Couples need these answers before they\'ll commit to a tour — and without instant replies, they lose momentum.',
  },
  {
    icon: MoonStar,
    title: 'Date availability requests with no follow-up system',
    body: <span>A couple checks your site at 11pm to see if their date is free. There&apos;s no one to respond. By morning their excitement has cooled, and they&apos;ve already booked a viewing elsewhere. <a href="https://www.salesloft.com/resources/guides/conversational-ai-marketing-trends-report" target="_blank" rel="noopener noreferrer" className="underline decoration-dotted hover:text-primary-500 transition-colors">41% of all meetings are booked outside standard business hours.</a></span>,
  },
];

const steps = [
  {
    step: '01',
    title: 'Train on your venue',
    description:
      'Upload your packages, capacity guides, catering policies, preferred supplier lists, and FAQs. Your chatbot answers accurately from your own content — nothing fabricated.',
  },
  {
    step: '02',
    title: 'Configure your enquiry flows',
    description:
      'Set up intake flows that capture date, guest count, and ceremony type. Configure escalation rules so complex questions go straight to your coordinator with full context.',
  },
  {
    step: '03',
    title: 'Deploy and book more tours',
    description:
      'Embed on your venue website. Couples get instant answers and tour bookings go straight into your calendar — even while you\'re hosting another wedding.',
  },
];

const features = [
  {
    icon: CalendarCheck,
    name: 'Booking enquiry capture',
    description:
      'Collect date, guest count, ceremony preferences, and budget from every couple before they bounce — so you have everything you need for a productive follow-up.',
  },
  {
    icon: BookOpen,
    name: 'Packages FAQ',
    description:
      'Answer exclusive hire vs. shared use, what\'s included, and ceremony suite capacity questions automatically — trained on your exact venue documentation.',
  },
  {
    icon: Clock,
    name: 'Date availability check',
    description:
      'Guide couples through a date enquiry flow that captures their requirements and flags their interest — so no availability request falls through the cracks.',
  },
  {
    icon: Headphones,
    name: '24/7 availability',
    description:
      'Wedding planning happens evenings and weekends — exactly when your team is busy on-site. Your chatbot captures every enquiry, every hour.',
  },
  {
    icon: ArrowUpRight,
    name: 'Coordinator escalation',
    description:
      'Enquiries that need a personal touch route directly to your venue coordinator with the full conversation already attached — no cold follow-ups.',
  },
  {
    icon: List,
    name: 'Vendor list FAQ',
    description:
      'Answer questions about preferred caterers, photographers, florists, and AV suppliers automatically — keeping couples engaged and informed throughout.',
  },
];

const verticals = [
  {
    icon: Home,
    title: 'Country House & Estate',
    description:
      'Handle exclusive hire enquiries, capacity questions, and accommodation FAQs around the clock.',
  },
  {
    icon: Trees,
    title: 'Barn & Rustic',
    description:
      'Capture seasonal availability, catering requirements, and outdoor ceremony questions before your coordinator picks up the phone.',
  },
  {
    icon: Building,
    title: 'City & Rooftop',
    description:
      'Answer guest limits, hire windows, and noise restrictions automatically for urban venue enquiries.',
  },
  {
    icon: Sunset,
    title: 'Garden & Outdoor',
    description:
      'Field weather contingency, marquee policy, and seasonal availability questions without tying up your events team.',
  },
];

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ChatbotForWeddingVenuesPage() {
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
            <li className="text-secondary-900 dark:text-secondary-100 font-medium">AI Chatbot for Wedding Venues</li>
          </ol>
        </nav>


        {/* ── Hero ────────────────────────────────────────────────────────────── */}
        <section className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center container mx-auto px-4 py-16 text-center">
          <Badge className="mb-6">AI Chatbot for Wedding Venues</Badge>

          <H1 className="max-w-4xl mb-6">
            Couples research your venue at 11pm on a Saturday.{' '}
            <span className="text-primary-500">Your chatbot should be there when you can&apos;t be.</span>
          </H1>

          <p className="mx-auto max-w-2xl text-lg text-secondary-600 dark:text-secondary-400 mb-10">
            VocUI trains on your packages, capacity guides, and venue FAQs — so every booking
            enquiry lands with the right context, even when your entire team is at a wedding.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="xl" asChild>
              <Link href="/signup">
                Build Your Wedding Venue Chatbot Free
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button size="xl" variant="outline" asChild>
              <Link href="/pricing">See Pricing</Link>
            </Button>
          </div>

          <p className="text-sm text-secondary-500 dark:text-secondary-400">
            Captures enquiries 24/7 &middot; Trained only on your venue content &middot; GDPR-compliant
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
            <Badge variant="outline" className="mb-4">The weekend enquiry problem</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              Your best leads arrive when your team is already fully booked
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              Weekend enquiries, late-night date checks, and package questions before a tour — they
              all arrive at the exact moment your coordinator is focused on another couple&apos;s big day.
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
                Live before your next venue enquiry. No developers needed.
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
              Everything a wedding venue chatbot actually needs
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              Built to convert weekend enquiries into booked viewings — not a generic widget that
              asks couples to call back during office hours.
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
                <Badge variant="outline" className="mb-4">How wedding venues use VocUI</Badge>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
                  A typical week, before and after VocUI
                </h2>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  { step: 'Before', text: 'Events team spending hours each week answering capacity, catering, and availability questions by email and phone' },
                  { step: 'Setup', text: 'Uploaded venue capacity details, catering packages, availability calendar info, and pricing guide' },
                  { step: 'After', text: 'Couples get answers at 10pm when they\u2019re actually planning. Show round bookings increased from warmer, better-informed enquiries.' },
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
              For wedding venues that can&apos;t afford to miss a Saturday enquiry
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              One missed enquiry on a popular date can cost a full booking. VocUI makes sure every
              couple who visits your site gets an instant response — regardless of what else is happening.
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
                { label: 'Chatbot for Event Planners', href: '/chatbot-for-event-planners', description: 'Availability FAQ and consultation booking for event planners.' },
                { label: 'Chatbot for Photography Studios', href: '/chatbot-for-photography-studios', description: 'Package FAQ and session booking for photography businesses.' },
                { label: 'Chatbot for Hotels', href: '/chatbot-for-hotels', description: 'Booking support and amenities FAQ for hotels and accommodation.' },
                { label: 'Chatbot for Restaurants', href: '/chatbot-for-restaurants', description: 'Reservations, menus, and hours FAQ for hospitality businesses.' },
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
                Every Saturday enquiry deserves an instant answer
              </h2>
              <p className="text-lg text-white/80 mb-2 max-w-xl mx-auto">
                Let your chatbot handle availability and packages. You handle the weddings.
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
                    Build Your Wedding Venue Chatbot Free
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
