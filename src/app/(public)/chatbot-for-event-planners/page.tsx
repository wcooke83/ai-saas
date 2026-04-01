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
  MessageCircleQuestion,
  MoonStar,
  Clock,
  BookOpen,
  CalendarCheck,
  Headphones,
  Users,
  ArrowUpRight,
  Star,
  Building2,
  Heart,
  Mic2,
  PartyPopper,
} from 'lucide-react';

// ─── Metadata ──────────────────────────────────────────────────────────────────

export function generateMetadata(): Metadata {
  return {
    title: 'AI Chatbot for Event Planners | Availability FAQ & Consultation Booking | VocUI',
    description:
      'Let an AI chatbot handle availability enquiries, package FAQs, and consultation booking for your event planning business — 24/7, trained on your own content.',
    keywords: [
      'AI chatbot for event planners',
      'event planning chatbot',
      'consultation booking chatbot',
      'event planner FAQ automation',
      'availability enquiry chatbot',
    ],
    openGraph: {
      title: 'AI Chatbot for Event Planners | Availability FAQ & Consultation Booking | VocUI',
      description:
        'Let an AI chatbot handle availability enquiries, package FAQs, and consultation booking for your event planning business — 24/7, trained on your own content.',
      url: 'https://vocui.com/chatbot-for-event-planners',
      siteName: 'VocUI',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'AI Chatbot for Event Planners | Availability FAQ & Consultation Booking | VocUI',
      description:
        'Let an AI chatbot handle availability enquiries, package FAQs, and consultation booking for your event planning business — 24/7, trained on your own content.',
    },
    alternates: {
      canonical: 'https://vocui.com/chatbot-for-event-planners',
    },
    robots: { index: true, follow: true },
  };
}

// ─── Structured Data ───────────────────────────────────────────────────────────

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'VocUI — AI Chatbot for Event Planners',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  description:
    'AI chatbot that handles availability enquiries, package FAQs, and consultation booking for event planning businesses — 24/7, trained on your content only.',
  url: 'https://vocui.com/chatbot-for-event-planners',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    description: 'Free plan available',
  },
  featureList: [
    'Availability check intake with budget context',
    'Consultation booking automation',
    'Package FAQ trained on your services',
    '24/7 after-hours availability',
    'Planner escalation with conversation context',
    'Vendor FAQ support',
  ],
};

// ─── Data ──────────────────────────────────────────────────────────────────────

const trustSignals = [
  'Captures availability enquiries 24/7',
  'Trained only on your packages and services',
  'GDPR-compliant data handling',
];

const painPoints: Array<{ icon: ElementType; title: string; body: ReactNode }> = [
  {
    icon: MessageCircleQuestion,
    title: 'Availability enquiries arrive without any budget context',
    body: 'Is June available? What are your rates? Clients ask without sharing guest count, venue preference, or budget — leaving you to play twenty questions before you can even quote. A chatbot gathers that context upfront, so every enquiry lands qualified.',
  },
  {
    icon: MoonStar,
    title: 'After-hours venue and date requests go cold',
    body: <span>Event planning decisions happen at 10pm over a laptop and a glass of wine. Without an instant response on your site, potential clients fill out another planner&apos;s form — and forget they ever found you. <a href="https://www.salesloft.com/resources/guides/conversational-ai-marketing-trends-report" target="_blank" rel="noopener noreferrer" className="underline decoration-dotted hover:text-primary-500 transition-colors">41% of all meetings are booked outside standard business hours.</a></span>,
  },
  {
    icon: Clock,
    title: 'Package questions eat your planning time',
    body: 'What\'s included in full planning vs. day coordination? Do you work with our venue? How many meetings are included? You answer these on every discovery call. Your chatbot can answer them before the call even happens.',
  },
];

const steps = [
  {
    step: '01',
    title: 'Train on your services',
    description:
      'Upload your packages, pricing guides, availability notes, and FAQs. Your chatbot learns your business inside-out and answers using your actual content — not generic responses.',
  },
  {
    step: '02',
    title: 'Configure your enquiry flows',
    description:
      'Set up intake flows that capture event type, date, guest count, and budget before a consultation is booked. Complex or sensitive enquiries escalate directly to you with context attached.',
  },
  {
    step: '03',
    title: 'Deploy and fill your consultation calendar',
    description:
      'Embed on your website or portfolio. Visitors get instant answers and pre-qualified enquiries land in your inbox — ready for a productive first conversation.',
  },
];

const features = [
  {
    icon: CalendarCheck,
    name: 'Availability check intake',
    description:
      'Capture event date, type, guest count, and budget from every enquiry before it reaches you — so your first conversation is a qualified one.',
  },
  {
    icon: BookOpen,
    name: 'Consultation booking',
    description:
      'Route ready-to-book prospects directly to your calendar. Discovery calls get filled with clients who already know your packages and are serious about moving forward.',
  },
  {
    icon: Star,
    name: 'Package FAQ automation',
    description:
      'Answer the difference between full planning, partial planning, and day coordination automatically — trained entirely on your own service descriptions.',
  },
  {
    icon: Headphones,
    name: '24/7 availability',
    description:
      'Couples and corporates plan events outside business hours. Your chatbot captures every enquiry at midnight as reliably as at noon.',
  },
  {
    icon: ArrowUpRight,
    name: 'Planner escalation',
    description:
      'Enquiries that need a personal touch escalate to you immediately with the full conversation transcript — so you never start from scratch.',
  },
  {
    icon: Users,
    name: 'Vendor FAQ support',
    description:
      'Answer common questions about your preferred vendor list, venue relationships, and supplier policies — keeping prospective clients engaged longer.',
  },
];

const verticals = [
  {
    icon: Building2,
    title: 'Corporate Events',
    description:
      'Handle brief intake, supplier FAQs, and consultation booking for conferences, away days, and product launches.',
  },
  {
    icon: Heart,
    title: 'Wedding Planning',
    description:
      'Qualify couples by budget and date, answer package questions, and book discovery calls — all before you pick up the phone.',
  },
  {
    icon: PartyPopper,
    title: 'Private Parties',
    description:
      'Capture event details and answer theme, catering, and venue FAQs for milestone birthday and celebration enquiries.',
  },
  {
    icon: Mic2,
    title: 'Conference & Expo',
    description:
      'Pre-qualify large-scale event briefs and answer logistics FAQs so your proposals start with the right information.',
  },
];

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ChatbotForEventPlannersPage() {
  return (
    <PageBackground>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Header />

      <main id="main-content">

        {/* ── Hero ────────────────────────────────────────────────────────────── */}
        <section className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center container mx-auto px-4 py-16 text-center">
          <Badge className="mb-6">AI Chatbot for Event Planners</Badge>

          <H1 className="max-w-4xl mb-6">
            Every enquiry asks the same questions before you even quote.{' '}
            <span className="text-primary-500">Your chatbot can answer them — and qualify them.</span>
          </H1>

          <p className="mx-auto max-w-2xl text-lg text-secondary-600 dark:text-secondary-400 mb-10">
            VocUI trains on your packages, availability, and FAQs — so every enquiry arrives with
            the context you need, and your planning time stays where it belongs: on your clients.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="xl" asChild>
              <Link href="/signup">
                Build Your Event Planner Chatbot Free
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button size="xl" variant="outline" asChild>
              <Link href="/pricing">See Pricing</Link>
            </Button>
          </div>

          <p className="text-sm text-secondary-500 dark:text-secondary-400">
            Captures enquiries 24/7 &middot; Trained only on your packages and services &middot; GDPR-compliant
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
            <Badge variant="outline" className="mb-4">The enquiry problem</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              You&apos;re spending planning time on questions a chatbot could answer
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              It&apos;s not that clients are demanding — it&apos;s that there&apos;s no system
              between &ldquo;I found your website&rdquo; and &ldquo;let&apos;s talk.&rdquo; So every
              unqualified enquiry lands directly in your inbox.
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
              Everything an event planner chatbot actually needs
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              Built to qualify leads, answer package questions, and book consultations — not just
              sit on your site looking pretty.
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
              <Badge variant="outline" className="mb-8">From an event planning company using VocUI</Badge>
              <blockquote className="text-2xl font-semibold text-secondary-900 dark:text-secondary-100 leading-snug mb-6">
                &ldquo;I used to spend an hour every morning responding to enquiries that had no budget
                or date attached. VocUI captures all of that upfront now — my consultations are
                shorter, more focused, and actually convert.&rdquo;
              </blockquote>
              <p className="text-secondary-500 dark:text-secondary-400 text-sm">
                S.R. &mdash; Owner, Boutique Event Planning Company
              </p>
            </div>
          </div>
        </section>

        {/* ── Who It's For ────────────────────────────────────────────────────── */}
        <section className="container mx-auto px-4 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">Who it&apos;s for</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              For event planners who want to spend time planning, not fielding enquiries
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              If unqualified enquiries are eating your days, VocUI filters and qualifies them
              automatically — so your consultations start with the right information already in place.
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
                { label: 'Chatbot for Wedding Venues', href: '/chatbot-for-wedding-venues', description: 'Booking inquiry and packages FAQ for wedding venues.' },
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
                Your time is too valuable to spend on unqualified enquiries
              </h2>
              <p className="text-lg text-white/80 mb-2 max-w-xl mx-auto">
                Let your chatbot handle the questions. You handle the events.
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
                    Build Your Event Planner Chatbot Free
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
