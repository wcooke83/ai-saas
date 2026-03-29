import type { Metadata } from 'next';
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
  CalendarCheck,
  Clock,
  PhoneOff,
  MousePointerClick,
  CheckCircle2,
  Zap,
  Settings2,
  Globe,
  CalendarX,
  Palette,
  Stethoscope,
  Briefcase,
  Scissors,
  GraduationCap,
} from 'lucide-react';

// ─── Metadata ──────────────────────────────────────────────────────────────────

export function generateMetadata(): Metadata {
  return {
    title: 'AI Chatbot for Appointment Booking | VocUI',
    description:
      'Let your website chatbot check availability and book appointments 24/7. VocUI integrates AI chat with calendar scheduling — no phone tag, no missed bookings.',
    keywords: [
      'AI chatbot appointment booking',
      'chatbot scheduling',
      'AI booking chatbot',
      'automated appointment booking',
    ],
    openGraph: {
      title: 'AI Chatbot for Appointment Booking | VocUI',
      description:
        'Let website visitors book appointments directly in the chat window. 24/7 availability, instant confirmation, no phone tag.',
      url: 'https://vocui.com/chatbot-booking',
      siteName: 'VocUI',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'AI Chatbot for Appointment Booking | VocUI',
      description:
        'Let website visitors book appointments directly in the chat window. 24/7 availability, instant confirmation, no phone tag.',
    },
    alternates: {
      canonical: 'https://vocui.com/chatbot-booking',
    },
  };
}

// ─── Structured Data ───────────────────────────────────────────────────────────

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'VocUI',
  applicationCategory: 'BusinessApplication',
  description:
    'AI chatbot platform with built-in calendar booking. Let website visitors check availability and book appointments 24/7 without leaving the chat window.',
  url: 'https://vocui.com/chatbot-booking',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    description: 'Free trial available',
  },
  featureList: [
    'In-chat availability checking',
    'Instant booking confirmation',
    '24/7 self-service scheduling',
    'Multi-service and multi-provider support',
    'Blocked periods and holidays',
    'Full widget customization',
  ],
};

// ─── Data ──────────────────────────────────────────────────────────────────────

const trustSignals = [
  '24/7 booking — no phone tag',
  'Instant availability checks',
  'Auto-confirmation emails',
];

const painPoints = [
  {
    icon: Clock,
    title: 'After-hours inquiries go unanswered',
    body: 'A potential client visits your site at 9pm. Your booking form goes to email. By morning, they\'ve already booked someone else.',
  },
  {
    icon: PhoneOff,
    title: 'Booking by phone is a back-and-forth',
    body: 'Three calls to find a slot that works. One to confirm. One to reschedule. Every booking costs 15 minutes of staff time.',
  },
  {
    icon: MousePointerClick,
    title: 'Visitors leave before they schedule',
    body: 'Redirecting visitors to a separate booking page breaks momentum. Most drop off before completing the form.',
  },
];

const steps = [
  {
    step: '01',
    title: 'Train the chatbot on your services',
    description:
      'Paste your website URL to crawl, upload a PDF of your service menu, or write Q&A pairs directly. The chatbot learns your pricing, policies, and FAQs in minutes.',
  },
  {
    step: '02',
    title: 'Connect your calendar',
    description:
      'Link Easy!Appointments and configure your availability, services, providers, and business hours. The chatbot queries live availability — no manual updates.',
  },
  {
    step: '03',
    title: 'Embed and start taking bookings',
    description:
      'Drop one line of JavaScript onto your site. Visitors chat, check open slots, and book without ever leaving the page. Confirmation is sent automatically.',
  },
];

const features = [
  {
    icon: CalendarCheck,
    name: 'In-chat availability checking',
    description:
      'The chatbot queries your live calendar in real time. Visitors see accurate open slots mid-conversation — no stale data, no double bookings.',
  },
  {
    icon: Zap,
    name: 'Instant booking confirmation',
    description:
      'The appointment is created the moment the visitor confirms. Confirmation details are shown in chat and sent by email automatically.',
  },
  {
    icon: Globe,
    name: '24/7 self-service scheduling',
    description:
      'Your chatbot takes bookings around the clock — nights, weekends, holidays. You wake up to a full calendar instead of a voicemail inbox.',
  },
  {
    icon: Settings2,
    name: 'Multi-service support',
    description:
      'Different providers, service durations, and business hours per service type. One chatbot handles your entire service menu correctly.',
  },
  {
    icon: CalendarX,
    name: 'Blocked periods and holidays',
    description:
      'Mark off public holidays, staff leave, and custom unavailable dates. The chatbot will never offer a slot you can\'t actually honor.',
  },
  {
    icon: Palette,
    name: 'Full widget customization',
    description:
      'Colors, fonts, border radius, position, dark mode. The booking experience looks like it belongs on your site — not a third-party tool.',
  },
];

const verticals = [
  {
    icon: Stethoscope,
    title: 'Healthcare & Wellness',
    examples: 'Clinics, therapists, physiotherapists, nutritionists',
  },
  {
    icon: Briefcase,
    title: 'Legal & Professional Services',
    examples: 'Consultants, lawyers, accountants, financial advisors',
  },
  {
    icon: Scissors,
    title: 'Beauty & Personal Care',
    examples: 'Salons, barbers, spas, nail studios',
  },
  {
    icon: GraduationCap,
    title: 'Coaching & Education',
    examples: 'Business coaches, tutors, personal trainers, mentors',
  },
];

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ChatbotBookingPage() {
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
          <Badge className="mb-6">AI Chatbot + Calendar Booking</Badge>

          <H1 className="max-w-4xl mb-6">
            Stop losing bookings to{' '}
            <span className="text-primary-500">voicemail and business hours</span>
          </H1>

          <p className="mx-auto max-w-2xl text-lg text-secondary-600 dark:text-secondary-400 mb-10">
            VocUI lets visitors check availability and book appointments directly in the chat window
            — any time of day, without picking up the phone or filling out a form.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="xl" asChild>
              <Link href="/signup">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button size="xl" variant="outline" asChild>
              <Link href="#how-it-works">See How It Works</Link>
            </Button>
          </div>

          <p className="text-sm text-secondary-500 dark:text-secondary-400">
            No credit card required &middot; Live in under an hour &middot; Works with your existing calendar
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
            <Badge variant="outline" className="mb-4">The booking problem</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              Every service business loses bookings the same way
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              Not because they offer a bad service. Because the scheduling experience
              creates enough friction that potential clients give up.
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
                Set up in under an hour. Book 24/7 forever after.
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
            <Badge variant="outline" className="mb-4">Built for booking</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              Everything a booking chatbot actually needs
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              Not just a chat window on top of a Calendly link. VocUI closes the full booking loop
              inside the conversation.
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

        {/* ── Who It's For ────────────────────────────────────────────────────── */}
        <section className="bg-secondary-50 dark:bg-secondary-800/30 py-24">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <Badge variant="outline" className="mb-4">Who it&apos;s for</Badge>
              <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
                Built for businesses that live by the calendar
              </h2>
              <p className="text-secondary-600 dark:text-secondary-400">
                If a missed booking is a missed revenue opportunity, VocUI pays for itself quickly.
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
                        {v.examples}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Final CTA ───────────────────────────────────────────────────────── */}
        <section className="container mx-auto px-4 py-20">
          <div className="max-w-3xl mx-auto">
            <div className="rounded-3xl bg-gradient-to-br from-primary-600 to-primary-800 p-12 text-center text-white shadow-xl shadow-primary-500/20">
              <h2 className="text-3xl font-bold mb-4">
                Start taking bookings automatically
              </h2>
              <p className="text-lg text-white/80 mb-2 max-w-xl mx-auto">
                14-day free trial of Pro. No credit card required.
              </p>
              <p className="text-sm text-white/60 mb-10">
                Your calendar fills itself. Your staff handles the work, not the scheduling.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="xl"
                  variant="secondary"
                  className="bg-white text-primary-600 hover:bg-primary-50 font-semibold"
                  asChild
                >
                  <Link href="/signup">
                    Build Your Booking Chatbot Free
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
              <p className="text-xs text-white/50 mt-6">No credit card required &mdash; 14-day free trial of Pro</p>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </PageBackground>
  );
}
