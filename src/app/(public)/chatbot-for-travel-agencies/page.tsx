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
  Plane,
  Globe,
  Star,
  Briefcase,
  MapPin,
  Heart,
} from 'lucide-react';

// ─── Metadata ──────────────────────────────────────────────────────────────────

export function generateMetadata(): Metadata {
  return {
    title: 'AI Chatbot for Travel Agencies | Destination FAQ & Lead Capture | VocUI',
    description:
      'Let an AI chatbot answer destination, visa, and package questions for your travel agency 24/7 — capture after-hours leads and free consultants for high-value bookings.',
    keywords: [
      'AI chatbot for travel agencies',
      'travel agency chatbot',
      'destination FAQ chatbot',
      'travel lead capture chatbot',
      'holiday booking chatbot',
    ],
    openGraph: {
      title: 'AI Chatbot for Travel Agencies | Destination FAQ & Lead Capture | VocUI',
      description:
        'Let an AI chatbot answer destination, visa, and package questions for your travel agency 24/7 — capture after-hours leads and free consultants for high-value bookings.',
      url: 'https://vocui.com/chatbot-for-travel-agencies',
      siteName: 'VocUI',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'AI Chatbot for Travel Agencies | Destination FAQ & Lead Capture | VocUI',
      description:
        'Let an AI chatbot answer destination, visa, and package questions for your travel agency 24/7 — capture after-hours leads and free consultants for high-value bookings.',
    },
    alternates: {
      canonical: 'https://vocui.com/chatbot-for-travel-agencies',
    },
    robots: { index: true, follow: true },
  };
}

// ─── Structured Data ───────────────────────────────────────────────────────────

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'VocUI — AI Chatbot for Travel Agencies',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  description:
    'AI chatbot that handles destination FAQs, visa queries, and package questions for travel agencies — 24/7, capturing leads while your consultants sleep.',
  url: 'https://vocui.com/chatbot-for-travel-agencies',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    description: 'Free plan available',
  },
  featureList: [
    'Knowledge base trained on your destinations and packages',
    'Consultation booking automation',
    'Visa and documentation FAQ',
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
      "name": "What can VocUI's AI chatbot do for Travel Agencies?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Let an AI chatbot answer destination, visa, and package questions for your travel agency 24/7 \u2014 capture after-hours leads and free consultants for high-value bookings."
      }
    },
    {
      "@type": "Question",
      "name": "How long does it take to set up VocUI for Travel Agencies?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Most Travel Agencies get set up in under an hour. Upload your existing content -- service descriptions, FAQs, pricing pages, or PDFs -- and VocUI trains the chatbot automatically. Embed it on your website with a single snippet."
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
      "name": "How is VocUI different from a generic chatbot for Travel Agencies?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Unlike generic chatbots, VocUI is trained exclusively on your own content -- your service descriptions, policies, FAQs, and documents. It only answers questions relevant to your Travel Agencies business and escalates to your team when it cannot help, with full conversation context included."
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
      "name": "AI Chatbot for Travel Agencies",
      "item": "https://vocui.com/chatbot-for-travel-agencies"
    }
  ]
};



// ─── Data ──────────────────────────────────────────────────────────────────────

const trustSignals = [
  'Answers travel questions 24/7',
  'Trained only on your destinations and packages',
  'GDPR-compliant data handling',
];

const painPoints: Array<{ icon: ElementType; title: string; body: ReactNode }> = [
  {
    icon: Clock,
    title: 'The same destination and visa questions before every consultation',
    body: "Do I need a visa for Thailand? What's included in your Maldives package? Is travel insurance included? Your consultants spend the first half of every call on questions that could be answered before the booking even starts.",
  },
  {
    icon: MoonStar,
    title: 'After-hours inspiration browsing loses leads overnight',
    body: <span>Holiday planning happens on Sunday evenings and late nights. <a href="https://www.travelagewest.com/Industry-Insight/Business-Features/online-travel-bookings-2024" target="_blank" rel="noopener noreferrer" className="underline decoration-dotted hover:text-primary-500 transition-colors">Online bookings are projected to reach 65% of all travel by 2026</a> — without instant answers at 11pm, that honeymoon goes to the agency that responded.</span>,
  },
  {
    icon: Briefcase,
    title: 'Consultant time wasted on early-funnel questions',
    body: 'Your travel consultants are experts at crafting itineraries and closing bookings. Having them spend time on basic destination and package FAQ is an expensive way to answer questions a chatbot can handle in seconds.',
  },
];

const steps = [
  {
    step: '01',
    title: 'Train on your destinations and packages',
    description:
      'Upload your destination guides, package descriptions, visa information, and FAQs. Your chatbot learns your specialist knowledge and answers prospective travellers accordingly.',
  },
  {
    step: '02',
    title: 'Configure consultation booking flows',
    description:
      'Set up consultation scheduling and lead capture forms. Complex itinerary or bespoke requests escalate automatically to your consultant team with full context captured.',
  },
  {
    step: '03',
    title: 'Deploy and capture every enquiry',
    description:
      'Embed on your website or destination pages. Visitors get instant answers about packages and visas; ready-to-book travellers book a consultation without leaving your site.',
  },
];

const features = [
  {
    icon: BookOpen,
    name: 'Destination knowledge base',
    description:
      'Your chatbot answers from your own destination guides, package inclusions, and visa requirements — never invented travel advice.',
  },
  {
    icon: CalendarCheck,
    name: 'Consultation booking',
    description:
      'Connect to your calendar. Prospective travellers book a consultation directly from the chat, ready for your consultant to close the booking.',
  },
  {
    icon: Globe,
    name: 'Visa and documentation FAQ',
    description:
      'Handle passport validity, visa requirements, and travel documentation questions automatically — reducing early-funnel queries to consultants.',
  },
  {
    icon: MoonStar,
    name: '24/7 after-hours lead capture',
    description:
      'Capture destination interest, travel dates, and contact details at any hour. Your consultants arrive in the morning with warm leads ready to convert.',
  },
  {
    icon: UserCheck,
    name: 'Qualified lead handoff',
    description:
      'When a traveller is ready to talk, they are passed to your consultant with their destination preference, travel dates, and group size already captured.',
  },
  {
    icon: ShieldCheck,
    name: 'Travel insurance and safety FAQ',
    description:
      'Answer travel insurance, FCDO advice, and health requirement questions automatically — reassuring travellers before they book.',
  },
];

const verticals = [
  {
    icon: Heart,
    title: 'Luxury & Honeymoon Travel',
    description:
      'Handle package comparisons, upgrade options, and romantic destination questions with instant, accurate answers that inspire confidence.',
  },
  {
    icon: Briefcase,
    title: 'Group & Corporate Travel',
    description:
      'Capture group size, travel dates, and budget ranges automatically — qualifying corporate enquiries before your team follows up.',
  },
  {
    icon: MapPin,
    title: 'Adventure & Eco Travel',
    description:
      'Answer activity inclusions, fitness requirements, and environmental certification questions for discerning adventure travellers.',
  },
  {
    icon: Plane,
    title: 'Cruise Specialists',
    description:
      'Handle cabin category comparisons, port itinerary questions, and embarkation FAQs without tying up your cruise experts.',
  },
];

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ChatbotForTravelAgenciesPage() {
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
          <Badge className="mb-6">AI Chatbot for Travel Agencies</Badge>

          <H1 className="max-w-4xl mb-6">
            Your travellers dream about holidays at 11pm.{' '}
            <span className="text-primary-500">Your chatbot should be there to capture them.</span>
          </H1>

          <p className="mx-auto max-w-2xl text-lg text-secondary-600 dark:text-secondary-400 mb-10">
            VocUI trains on your destinations, packages, and visa FAQs — so every visitor gets
            instant answers, your consultants handle fewer early-funnel questions, and after-hours
            leads land in your inbox ready to book.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="xl" asChild>
              <Link href="/signup">
                Build Your Travel Chatbot Free
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button size="xl" variant="outline" asChild>
              <Link href="/pricing">See Pricing</Link>
            </Button>
          </div>

          <p className="text-sm text-secondary-500 dark:text-secondary-400">
            Answers travel questions 24/7 &middot; Trained only on your destinations and packages &middot; GDPR-compliant
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
            <Badge variant="outline" className="mb-4">The travel agency problem</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              Your consultants are answering questions a chatbot could handle
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              Not because your consultants are slow. Because there&apos;s no system to handle the
              same destination, visa, and package questions that arrive before every booking conversation.
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
              Everything a travel agency chatbot actually needs
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              Built for travel agencies — not a generic widget bolted onto your site.
              Every feature is aimed at capturing leads and freeing your consultants for high-value bookings.
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
              <Badge variant="outline" className="mb-8">From a travel agency using VocUI</Badge>
              <blockquote className="text-2xl font-semibold text-secondary-900 dark:text-secondary-100 leading-snug mb-6">
                &ldquo;We were losing Sunday evening leads because no-one was available to answer
                visa questions. VocUI captures those now — we come in Monday with qualified
                consultation bookings already in the calendar.&rdquo;
              </blockquote>
              <p className="text-secondary-500 dark:text-secondary-400 text-sm">
                S.K. &mdash; Director, Boutique Travel Agency
              </p>
            </div>
          </div>
        </section>

        {/* ── Who It's For ────────────────────────────────────────────────────── */}
        <section className="container mx-auto px-4 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">Who it&apos;s for</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              For travel agencies that want their consultants focused on closing bookings
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              If your consultants are fielding destination and visa questions a chatbot could handle,
              VocUI pays for itself the moment your first after-hours lead books a consultation.
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
                { label: 'Chatbot for Hotels', href: '/chatbot-for-hotels', description: 'Booking support and amenities FAQ for hotels and accommodation.' },
                { label: 'Chatbot for Restaurants', href: '/chatbot-for-restaurants', description: 'Reservations, menus, and hours FAQ for hospitality businesses.' },
                { label: 'Chatbot for Event Planners', href: '/chatbot-for-event-planners', description: 'Availability FAQ and consultation booking for event planners.' },
                { label: 'Chatbot for Photography Studios', href: '/chatbot-for-photography-studios', description: 'Package FAQ and session booking for photography businesses.' },
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
                Stop losing evening leads to agencies that reply first
              </h2>
              <p className="text-lg text-white/80 mb-2 max-w-xl mx-auto">
                Give every visitor instant answers about your destinations and let your consultants focus on the bookings that matter.
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
                    Build Your Travel Chatbot Free
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
