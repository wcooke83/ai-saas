import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { H1 } from '@/components/ui/heading';
import { Header } from '@/components/layout';
import { Footer } from '@/components/ui/footer';
import { PageBackground } from '@/components/ui/page-background';
import type { ReactNode, ElementType } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  MoonStar,
  TrendingUp,
  BookOpen,
  CalendarCheck,
  Clock,
  UserCheck,
  ShieldCheck,
  Home,
  Briefcase,
  Globe,
  Star,
} from 'lucide-react';

// ─── Metadata ──────────────────────────────────────────────────────────────────

export function generateMetadata(): Metadata {
  return {
    title: 'AI Chatbot for Hotels | Booking Support & Amenities FAQ | VocUI',
    description:
      'Let an AI chatbot handle pre-arrival questions, amenity FAQs, and booking support for your hotel — 24/7. Convert late-night researchers into confirmed guests.',
    keywords: [
      'AI chatbot for hotels',
      'hotel chatbot',
      'booking support chatbot',
      'hotel amenities FAQ',
      'hospitality chatbot',
    ],
    openGraph: {
      title: 'AI Chatbot for Hotels | Booking Support & Amenities FAQ | VocUI',
      description:
        'Let an AI chatbot handle pre-arrival questions, amenity FAQs, and booking support for your hotel — 24/7. Convert late-night researchers into confirmed guests.',
      url: 'https://vocui.com/chatbot-for-hotels',
      siteName: 'VocUI',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'AI Chatbot for Hotels | Booking Support & Amenities FAQ | VocUI',
      description:
        'Let an AI chatbot handle pre-arrival questions, amenity FAQs, and booking support for your hotel — 24/7. Convert late-night researchers into confirmed guests.',
    },
    alternates: {
      canonical: 'https://vocui.com/chatbot-for-hotels',
    },
    robots: { index: true, follow: true },
  };
}

// ─── Structured Data ───────────────────────────────────────────────────────────

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'VocUI — AI Chatbot for Hotels',
  applicationCategory: 'TravelApplication',
  operatingSystem: 'Web',
  description:
    'AI chatbot that handles pre-arrival questions, amenity FAQs, and booking support for hotels — 24/7, trained on your own property content.',
  url: 'https://vocui.com/chatbot-for-hotels',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    description: 'Free plan available',
  },
  featureList: [
    'Knowledge base trained on your property content',
    'Booking support and pre-arrival FAQ automation',
    'Amenity and room type questions handled instantly',
    '24/7 after-hours availability',
    'Upsell prompts for upgrades and add-ons',
    'GDPR-compliant data handling',
  ],
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What can VocUI's AI chatbot do for Hotels?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Let an AI chatbot handle pre-arrival questions, amenity FAQs, and booking support for your hotel \u2014 24/7. Convert late-night researchers into confirmed guests."
      }
    },
    {
      "@type": "Question",
      "name": "How long does it take to set up VocUI for Hotels?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Most Hotels get set up in under an hour. Upload your existing content -- service descriptions, FAQs, pricing pages, or PDFs -- and VocUI trains the chatbot automatically. Embed it on your website with a single snippet."
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
      "name": "How is VocUI different from a generic chatbot for Hotels?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Unlike generic chatbots, VocUI is trained exclusively on your own content -- your service descriptions, policies, FAQs, and documents. It only answers questions relevant to your Hotels business and escalates to your team when it cannot help, with full conversation context included."
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
      "name": "AI Chatbot for Hotels",
      "item": "https://vocui.com/chatbot-for-hotels"
    }
  ]
};



// ─── Data ──────────────────────────────────────────────────────────────────────

const trustSignals = [
  'Answers guest questions 24/7',
  'Trained on your property content',
  'GDPR-compliant data handling',
];

const painPoints: Array<{ icon: ElementType; title: string; body: ReactNode }> = [
  {
    icon: HelpCircle,
    title: 'The same pre-arrival questions on every booking',
    body: 'Is parking included? What time is check-in? Do you have a pool? Is breakfast included? Your front desk fields these for every single arrival — before the guest even walks through the door.',
  },
  {
    icon: MoonStar,
    title: 'After-hours inquiries convert to bookings elsewhere',
    body: <span>Travellers research accommodation at night. <a href="https://www.travelagewest.com/Industry-Insight/Business-Features/online-travel-bookings-2024" target="_blank" rel="noopener noreferrer" className="underline decoration-dotted hover:text-primary-500 transition-colors">Around 60% of hotel bookings are now made online</a> — a guest comparing your property at 11pm will book with whoever answers their questions first.</span>,
  },
  {
    icon: TrendingUp,
    title: 'Lost upsell opportunities during booking research',
    body: <span>Guests researching room upgrades, spa packages, or early check-in have already shown intent to spend more. <a href="https://www.reviewtrackers.com/reports/customer-reviews-stats/" target="_blank" rel="noopener noreferrer" className="underline decoration-dotted hover:text-primary-500 transition-colors">Nearly 80% of travellers are more likely to book a higher-rated property</a> — your chatbot keeps that conversation going.</span>,
  },
];

const steps = [
  {
    step: '01',
    title: 'Train on your property',
    description:
      'Upload your room descriptions, amenity guides, check-in/check-out policies, local area tips, and FAQs. Your chatbot knows your property inside out.',
  },
  {
    step: '02',
    title: 'Configure guest flows',
    description:
      'Set up flows for pre-arrival questions, room upgrade inquiries, and special requests. Complex concierge needs escalate straight to your team with full context.',
  },
  {
    step: '03',
    title: 'Deploy and convert more guests',
    description:
      'Embed on your booking page or property website. Researchers get instant answers, and those ready to book are guided to your reservations system without friction.',
  },
];

const features = [
  {
    icon: BookOpen,
    name: 'Property knowledge base',
    description:
      'Your chatbot answers from your approved property content — room types, amenities, policies, and local tips — never invented or fabricated.',
  },
  {
    icon: CalendarCheck,
    name: 'Booking support',
    description:
      'Answer questions that arise during the booking process — availability, room differences, cancellation policies — and reduce booking abandonment.',
  },
  {
    icon: TrendingUp,
    name: 'Upsell and upgrade prompts',
    description:
      'Surface room upgrades, spa packages, and dining options to guests who are actively researching — turning browsers into higher-value bookings.',
  },
  {
    icon: Clock,
    name: '24/7 pre-arrival support',
    description:
      'Answer check-in time, parking, pet policies, and accessibility questions at any hour — reducing front desk call volume on arrival day.',
  },
  {
    icon: UserCheck,
    name: 'Concierge handoff',
    description:
      'Special requests, complex itineraries, or VIP guests escalate immediately to your team with the full conversation context ready.',
  },
  {
    icon: ShieldCheck,
    name: 'GDPR-compliant data handling',
    description:
      'Guest data collected via the chatbot is handled per GDPR. Clear consent flows and data processing agreements available for Enterprise.',
  },
];

const verticals = [
  {
    icon: Home,
    title: 'Boutique Hotels',
    description:
      'Deliver the personal touch guests expect — instant, knowledgeable answers that reflect your property\'s unique character.',
  },
  {
    icon: Briefcase,
    title: 'Business Hotels',
    description:
      'Answer corporate amenity, meeting room, and transport questions without pulling your concierge team away from in-house guests.',
  },
  {
    icon: Star,
    title: 'B&Bs',
    description:
      'Handle booking inquiries, breakfast questions, and local recommendations 24/7 — even when you\'re away from the property.',
  },
  {
    icon: Globe,
    title: 'Holiday Resorts',
    description:
      'Answer activity schedules, dining options, and facilities questions for multiple guest touchpoints across your resort.',
  },
];

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ChatbotForHotelsPage() {
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
          <Badge className="mb-6">AI Chatbot for Hotels</Badge>

          <H1 className="max-w-4xl mb-6">
            Your guests ask the same pre-arrival questions before every stay.{' '}
            <span className="text-primary-500">Your chatbot can answer them.</span>
          </H1>

          <p className="mx-auto max-w-2xl text-lg text-secondary-600 dark:text-secondary-400 mb-10">
            VocUI trains on your property details, amenities, and policies — so your front desk
            spends less time on the phone and more time delivering the experience guests actually came for.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="xl" asChild>
              <Link href="/signup">
                Build Your Hotel Chatbot Free
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button size="xl" variant="outline" asChild>
              <Link href="/pricing">See Pricing</Link>
            </Button>
          </div>

          <p className="text-sm text-secondary-500 dark:text-secondary-400">
            Answers guest questions 24/7 &middot; Trained on your property content &middot; GDPR-compliant
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
            <Badge variant="outline" className="mb-4">The pre-arrival problem</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              Your front desk is answering questions before guests even arrive
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              Not because your guests are unreasonable. Because there&apos;s no system between your
              website and your team — so every question about parking or check-in time hits a person
              who should be focused on the guests already there.
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
              Everything a hotel chatbot actually needs
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              Built for hospitality — not a generic live chat widget. Every feature is aimed at
              converting more bookings and reducing inbound noise for your front desk.
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
              <Badge variant="outline" className="mb-8">From a hotel using VocUI</Badge>
              <blockquote className="text-2xl font-semibold text-secondary-900 dark:text-secondary-100 leading-snug mb-6">
                &ldquo;We were losing direct bookings to OTAs because guests couldn&apos;t get
                quick answers on our site. VocUI changed that. Direct bookings are up and our
                front desk finally has breathing room on check-in mornings.&rdquo;
              </blockquote>
              <p className="text-secondary-500 dark:text-secondary-400 text-sm">
                L.H. &mdash; General Manager, The Harwood Boutique Hotel
              </p>
            </div>
          </div>
        </section>

        {/* ── Who It's For ────────────────────────────────────────────────────── */}
        <section className="container mx-auto px-4 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">Who it&apos;s for</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              For hotels that want their team focused on the guest experience
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              If your front desk is answering check-in time questions while guests are waiting at
              reception, VocUI pays for itself on the first morning it frees them up.
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
                { label: 'Chatbot for Restaurants', href: '/chatbot-for-restaurants', description: 'Reservations, menus, and hours FAQ for hospitality businesses.' },
                { label: 'Chatbot for Travel Agencies', href: '/chatbot-for-travel-agencies', description: 'Destination FAQ and booking lead capture for travel professionals.' },
                { label: 'Chatbot for Event Planners', href: '/chatbot-for-event-planners', description: 'Availability FAQ and consultation booking for event planners.' },
                { label: 'Chatbot for Wedding Venues', href: '/chatbot-for-wedding-venues', description: 'Booking inquiry and packages FAQ for wedding venues.' },
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
                Your guests deserve instant answers — not a callback tomorrow
              </h2>
              <p className="text-lg text-white/80 mb-2 max-w-xl mx-auto">
                Build a chatbot that converts late-night researchers into confirmed bookings while your team sleeps.
              </p>
              <p className="text-sm text-white/60 mb-10">
                Free plan available &middot; No credit card required &middot; Live before your next peak season
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="xl"
                  variant="secondary"
                  className="bg-white text-primary-600 hover:bg-primary-50 font-semibold"
                  asChild
                >
                  <Link href="/signup">
                    Build Your Hotel Chatbot Free
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
