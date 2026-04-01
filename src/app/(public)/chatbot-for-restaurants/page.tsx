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
  Phone,
  MoonStar,
  MessageSquare,
  BookOpen,
  CalendarCheck,
  Clock,
  UserCheck,
  ShieldCheck,
  Star,
  Utensils,
  Coffee,
  ShoppingBag,
} from 'lucide-react';

// ─── Metadata ──────────────────────────────────────────────────────────────────

export function generateMetadata(): Metadata {
  return {
    title: 'AI Chatbot for Restaurants | Reservations & Menu FAQ | VocUI',
    description:
      'Let an AI chatbot handle reservations, menu questions, allergen info, and opening hours for your restaurant — 24/7. Stop answering the same calls during service.',
    keywords: [
      'AI chatbot for restaurants',
      'restaurant chatbot',
      'reservation chatbot',
      'menu FAQ chatbot',
      'restaurant booking automation',
    ],
    openGraph: {
      title: 'AI Chatbot for Restaurants | Reservations & Menu FAQ | VocUI',
      description:
        'Let an AI chatbot handle reservations, menu questions, allergen info, and opening hours for your restaurant — 24/7. Stop answering the same calls during service.',
      url: 'https://vocui.com/chatbot-for-restaurants',
      siteName: 'VocUI',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'AI Chatbot for Restaurants | Reservations & Menu FAQ | VocUI',
      description:
        'Let an AI chatbot handle reservations, menu questions, allergen info, and opening hours for your restaurant — 24/7. Stop answering the same calls during service.',
    },
    alternates: {
      canonical: 'https://vocui.com/chatbot-for-restaurants',
    },
    robots: { index: true, follow: true },
  };
}

// ─── Structured Data ───────────────────────────────────────────────────────────

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'VocUI — AI Chatbot for Restaurants',
  applicationCategory: 'FoodEstablishment',
  operatingSystem: 'Web',
  description:
    'AI chatbot that handles reservations, menu FAQs, allergen information, and opening hours for restaurants — 24/7, trained on your own content.',
  url: 'https://vocui.com/chatbot-for-restaurants',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    description: 'Free plan available',
  },
  featureList: [
    'Knowledge base trained on your menu and policies',
    'Reservation booking via Easy!Appointments',
    'Allergen and dietary FAQ automation',
    '24/7 after-hours availability',
    'Staff handoff for special requests',
    'GDPR-compliant data handling',
  ],
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What can VocUI's AI chatbot do for Restaurants?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Let an AI chatbot handle reservations, menu questions, allergen info, and opening hours for your restaurant \u2014 24/7. Stop answering the same calls during service."
      }
    },
    {
      "@type": "Question",
      "name": "How long does it take to set up VocUI for Restaurants?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Most Restaurants get set up in under an hour. Upload your existing content -- service descriptions, FAQs, pricing pages, or PDFs -- and VocUI trains the chatbot automatically. Embed it on your website with a single snippet."
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
      "name": "How is VocUI different from a generic chatbot for Restaurants?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Unlike generic chatbots, VocUI is trained exclusively on your own content -- your service descriptions, policies, FAQs, and documents. It only answers questions relevant to your Restaurants business and escalates to your team when it cannot help, with full conversation context included."
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
      "name": "AI Chatbot for Restaurants",
      "item": "https://vocui.com/chatbot-for-restaurants"
    }
  ]
};



// ─── Data ──────────────────────────────────────────────────────────────────────

const trustSignals = [
  'Handles reservations and menu questions 24/7',
  'Trained on your menu, allergens, and policies',
  'GDPR-compliant data handling',
];

const painPoints: Array<{ icon: ElementType; title: string; body: ReactNode }> = [
  {
    icon: Phone,
    title: 'Calls during service for hours, allergens, and bookings',
    body: 'Are you open on Mondays? Do you have gluten-free options? Can I book a table for six? Every call during dinner service pulls your team away from the guests already in the room.',
  },
  {
    icon: MoonStar,
    title: 'Missed bookings from unanswered late-night inquiries',
    body: <span>Guests plan their nights out late. <a href="https://www.ukhospitality.org.uk/revealing-insights-an-in-depth-analysis-of-restaurant-reservation-trends-in-q3-2023/" target="_blank" rel="noopener noreferrer" className="underline decoration-dotted hover:text-primary-500 transition-colors">5 in 10 diners now prefer to book online</a> — when your website can&apos;t take reservations at 10pm, that table goes to the restaurant that can.</span>,
  },
  {
    icon: MessageSquare,
    title: 'Unanswered social media and website inquiries',
    body: <span>DMs, contact forms, and Google messages pile up between service periods. <a href="https://411locals.us/small-business-owners-dont-answer-62-of-phone-calls/" target="_blank" rel="noopener noreferrer" className="underline decoration-dotted hover:text-primary-500 transition-colors">Small businesses miss 62% of inbound calls</a> — by the time you reply, the guest has already made other plans.</span>,
  },
];

const steps = [
  {
    step: '01',
    title: 'Train on your menu and policies',
    description:
      'Upload your menu, allergen information, opening hours, reservation policies, and event details. Your chatbot learns your restaurant and answers accurately every time.',
  },
  {
    step: '02',
    title: 'Set up reservation flows',
    description:
      'Configure booking flows for different party sizes, special occasions, and dietary requirements. Complex requests — like private dining — escalate straight to your team.',
  },
  {
    step: '03',
    title: 'Deploy and capture more covers',
    description:
      'Embed on your website or link from your Google Business profile. Guests get instant answers; those ready to book get taken straight to your reservations calendar.',
  },
];

const features = [
  {
    icon: BookOpen,
    name: 'Menu and allergen FAQ',
    description:
      'Answer ingredient, allergen, and dietary questions accurately from your own menu content — never guessed or fabricated.',
  },
  {
    icon: CalendarCheck,
    name: 'Reservation booking',
    description:
      'Connect to your bookings calendar via Easy!Appointments. Guests reserve a table directly from the chat, at any hour.',
  },
  {
    icon: Clock,
    name: 'Opening hours and location answers',
    description:
      'The most common restaurant questions — hours, address, parking — handled automatically so your team doesn\'t have to.',
  },
  {
    icon: Star,
    name: 'Special event and function inquiries',
    description:
      'Answer questions about private dining, functions, and special events. Capture leads and route them to the right person for follow-up.',
  },
  {
    icon: UserCheck,
    name: 'Staff handoff for complex requests',
    description:
      'Large groups, custom menus, or dietary edge cases escalate seamlessly to your team with the full conversation attached.',
  },
  {
    icon: ShieldCheck,
    name: 'GDPR-compliant data handling',
    description:
      'Guest data collected through the chatbot is handled per GDPR. No surprises, no third-party data sharing without consent.',
  },
];

const verticals = [
  {
    icon: Star,
    title: 'Fine Dining',
    description:
      'Handle reservation requests, tasting menu questions, and dress code FAQs with the polish your brand demands.',
  },
  {
    icon: Utensils,
    title: 'Casual Dining',
    description:
      'Answer walk-in policies, menu updates, and party booking questions without interrupting floor staff during service.',
  },
  {
    icon: ShoppingBag,
    title: 'Takeaway & Delivery',
    description:
      'Automate order FAQs, delivery radius questions, and estimated wait times to reduce inbound call volume.',
  },
  {
    icon: Coffee,
    title: 'Cafes & Brunch Spots',
    description:
      'Handle opening hours, dietary options, and peak-time queue FAQs so your baristas can focus on the coffee.',
  },
];

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ChatbotForRestaurantsPage() {
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
            <li className="text-secondary-900 dark:text-secondary-100 font-medium">AI Chatbot for Restaurants</li>
          </ol>
        </nav>


        {/* ── Hero ────────────────────────────────────────────────────────────── */}
        <section className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center container mx-auto px-4 py-16 text-center">
          <Badge className="mb-6">AI Chatbot for Restaurants</Badge>

          <H1 className="max-w-4xl mb-6">
            Your guests ask the same questions every night.{' '}
            <span className="text-primary-500">Your chatbot can answer them.</span>
          </H1>

          <p className="mx-auto max-w-2xl text-lg text-secondary-600 dark:text-secondary-400 mb-10">
            VocUI trains on your menu, hours, and reservation policies — so your team stays
            focused on the guests in front of them, not the questions coming in on the phone.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="xl" asChild>
              <Link href="/signup">
                Build Your Restaurant Chatbot Free
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button size="xl" variant="outline" asChild>
              <Link href="/pricing">See Pricing</Link>
            </Button>
          </div>

          <p className="text-sm text-secondary-500 dark:text-secondary-400">
            Handles reservations and menu questions 24/7 &middot; Trained on your menu and policies &middot; GDPR-compliant
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
            <Badge variant="outline" className="mb-4">The service interruption problem</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              Your team is being pulled off the floor to answer avoidable questions
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              Not because your guests are demanding. Because there&apos;s no system between your
              website and your staff — so every question, no matter how simple, reaches a person
              who should be doing something else.
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
              Everything a restaurant chatbot actually needs
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              Built for hospitality — not a generic widget pasted onto your site.
              Every feature is aimed at filling more covers and freeing your team during service.
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
              <Badge variant="outline" className="mb-8">From a restaurant using VocUI</Badge>
              <blockquote className="text-2xl font-semibold text-secondary-900 dark:text-secondary-100 leading-snug mb-6">
                &ldquo;We used to miss five or six reservation requests every weekend because we
                couldn&apos;t answer the phone during service. VocUI captures them now — guests
                book themselves and we just see the confirmed reservation.&rdquo;
              </blockquote>
              <p className="text-secondary-500 dark:text-secondary-400 text-sm">
                A.V. &mdash; Owner, Rosetta Kitchen & Bar
              </p>
            </div>
          </div>
        </section>

        {/* ── Who It's For ────────────────────────────────────────────────────── */}
        <section className="container mx-auto px-4 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">Who it&apos;s for</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              For restaurants that want their team focused on the guest experience
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              If your staff is fielding phone calls during service, you&apos;re paying hospitality
              wages for a FAQ service. VocUI handles that — so your team stays on the floor.
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
                Stop losing reservations to an unanswered phone
              </h2>
              <p className="text-lg text-white/80 mb-2 max-w-xl mx-auto">
                Give guests instant answers and let your team focus on the people already at the table.
              </p>
              <p className="text-sm text-white/60 mb-10">
                Free plan available &middot; No credit card required &middot; Live before your next service
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="xl"
                  variant="secondary"
                  className="bg-white text-primary-600 hover:bg-primary-50 font-semibold"
                  asChild
                >
                  <Link href="/signup">
                    Build Your Restaurant Chatbot Free
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
