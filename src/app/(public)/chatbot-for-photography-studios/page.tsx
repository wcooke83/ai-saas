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
  DollarSign,
  MoonStar,
  RotateCcw,
  BookOpen,
  CalendarCheck,
  Headphones,
  ArrowUpRight,
  Camera,
  Image,
  Heart,
  Baby,
  Briefcase,
} from 'lucide-react';

// ─── Metadata ──────────────────────────────────────────────────────────────────

export function generateMetadata(): Metadata {
  return {
    title: 'AI Chatbot for Photography Studios | Package FAQ & Session Booking | VocUI',
    description:
      'Let an AI chatbot handle package FAQs, session booking, and shoot preparation questions for your photography studio — 24/7, trained on your own content.',
    keywords: [
      'AI chatbot for photography studios',
      'photography chatbot',
      'session booking chatbot',
      'photography studio FAQ automation',
      'package enquiry chatbot',
    ],
    openGraph: {
      title: 'AI Chatbot for Photography Studios | Package FAQ & Session Booking | VocUI',
      description:
        'Let an AI chatbot handle package FAQs, session booking, and shoot preparation questions for your photography studio — 24/7, trained on your own content.',
      url: 'https://vocui.com/chatbot-for-photography-studios',
      siteName: 'VocUI',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'AI Chatbot for Photography Studios | Package FAQ & Session Booking | VocUI',
      description:
        'Let an AI chatbot handle package FAQs, session booking, and shoot preparation questions for your photography studio — 24/7, trained on your own content.',
    },
    alternates: {
      canonical: 'https://vocui.com/chatbot-for-photography-studios',
    },
    robots: { index: true, follow: true },
  };
}

// ─── Structured Data ───────────────────────────────────────────────────────────

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'VocUI — AI Chatbot for Photography Studios',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  description:
    'AI chatbot that handles package FAQs, session booking, and shoot preparation for photography studios — 24/7, trained on your content only.',
  url: 'https://vocui.com/chatbot-for-photography-studios',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    description: 'Free plan available',
  },
  featureList: [
    'Session booking automation',
    'Package FAQ trained on your studio content',
    'Shoot preparation guides',
    '24/7 after-hours availability',
    'Photographer escalation with conversation context',
    'Style and portfolio FAQ support',
  ],
};

// ─── Data ──────────────────────────────────────────────────────────────────────

const trustSignals = [
  'Answers package questions 24/7',
  'Trained only on your studio content',
  'GDPR-compliant data handling',
];

const painPoints: Array<{ icon: ElementType; title: string; body: ReactNode }> = [
  {
    icon: DollarSign,
    title: 'Pricing enquiries from unqualified leads waste consultation time',
    body: 'How much do you charge for a wedding? Do you do passport photos? Pricing questions from leads who aren\'t your ideal clients consume the same time as serious bookings. Your chatbot filters and qualifies them before they reach your inbox.',
  },
  {
    icon: MoonStar,
    title: 'After-hours booking requests from newly engaged couples',
    body: <span>Couples get engaged on a Friday evening and spend the weekend researching photographers. Without an instant response on your site, they&apos;ve shortlisted three others before Monday morning — and you never knew they were looking. <a href="https://www.salesloft.com/resources/guides/conversational-ai-marketing-trends-report" target="_blank" rel="noopener noreferrer" className="underline decoration-dotted hover:text-primary-500 transition-colors">41% of all meetings are booked outside standard business hours.</a></span>,
  },
  {
    icon: RotateCcw,
    title: 'The same preparation questions before every shoot',
    body: 'What should I wear? Where do we meet? Can I bring props? How long does the session last? You send the same prep email every booking. Your chatbot answers these automatically — before they even ask.',
  },
];

const steps = [
  {
    step: '01',
    title: 'Train on your studio',
    description:
      'Upload your packages, pricing, style guides, shoot preparation notes, and FAQs. Your chatbot learns your studio entirely from your own content — nothing generic.',
  },
  {
    step: '02',
    title: 'Configure your booking flows',
    description:
      'Set up session booking and intake flows that qualify shoot type, date, and location upfront. Define escalation so complex enquiries go to you with context already attached.',
  },
  {
    step: '03',
    title: 'Deploy and book more sessions',
    description:
      'Embed on your portfolio site. Visitors get instant answers to pricing and preparation questions — and ready-to-book clients go straight into your calendar.',
  },
];

const features = [
  {
    icon: CalendarCheck,
    name: 'Session booking',
    description:
      'Let clients book wedding, portrait, or commercial sessions directly from the chat — capturing shoot type, date, location, and any special requirements upfront.',
  },
  {
    icon: BookOpen,
    name: 'Package FAQ',
    description:
      'Answer what\'s included, how many edited images are delivered, and how turnaround works — all trained on your actual package documentation.',
  },
  {
    icon: Camera,
    name: 'Shoot preparation guides',
    description:
      'Share outfit guidance, location directions, timing advice, and what to expect automatically before every shoot — reducing cancellations and last-minute questions.',
  },
  {
    icon: Headphones,
    name: '24/7 availability',
    description:
      'Newly engaged couples plan after hours. Families book around school schedules. Your chatbot captures every enquiry, any time of day or night.',
  },
  {
    icon: ArrowUpRight,
    name: 'Photographer escalation',
    description:
      'Enquiries that need your personal input escalate to you immediately with the full conversation already captured — no playing phone tag.',
  },
  {
    icon: Image,
    name: 'Style and portfolio FAQ',
    description:
      'Answer questions about your shooting style, editing approach, and gallery delivery process — keeping serious prospects engaged from first browse to booking.',
  },
];

const verticals = [
  {
    icon: Heart,
    title: 'Wedding Photography',
    description:
      'Handle package comparison, date availability, and wedding day timeline questions — so couples arrive at your consultation already informed.',
  },
  {
    icon: Camera,
    title: 'Portrait & Family',
    description:
      'Answer outfit guides, session length, and gallery turnaround questions for portrait enquiries arriving at all hours.',
  },
  {
    icon: Briefcase,
    title: 'Commercial',
    description:
      'Pre-qualify commercial brief enquiries, answer licensing FAQs, and capture project details before the first call.',
  },
  {
    icon: Baby,
    title: 'Newborn & Maternity',
    description:
      'Reassure parents with safety protocols, timing guidance, and studio preparation answers — 24/7, in the exact moment they\'re searching.',
  },
];

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ChatbotForPhotographyStudiosPage() {
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
          <Badge className="mb-6">AI Chatbot for Photography Studios</Badge>

          <H1 className="max-w-4xl mb-6">
            Clients ask the same questions before every shoot.{' '}
            <span className="text-primary-500">Stop answering them manually.</span>
          </H1>

          <p className="mx-auto max-w-2xl text-lg text-secondary-600 dark:text-secondary-400 mb-10">
            VocUI trains on your packages, preparation guides, and studio FAQs — so pricing
            questions get answered instantly, sessions get booked overnight, and your camera stays
            where it belongs: pointed at your clients.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="xl" asChild>
              <Link href="/signup">
                Build Your Photography Studio Chatbot Free
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button size="xl" variant="outline" asChild>
              <Link href="/pricing">See Pricing</Link>
            </Button>
          </div>

          <p className="text-sm text-secondary-500 dark:text-secondary-400">
            Answers package questions 24/7 &middot; Trained only on your studio content &middot; GDPR-compliant
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
            <Badge variant="outline" className="mb-4">The studio admin problem</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              Admin is eating the time you should be spending behind the lens
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              Pricing queries, late-night booking requests, and pre-shoot preparation emails are
              all automatable. They don&apos;t need your personal attention — they need a system.
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
              Everything a photography studio chatbot actually needs
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              Built to convert portfolio browsers into booked sessions — and send every client to
              their shoot well-prepared.
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
              <Badge variant="outline" className="mb-8">From a photography studio using VocUI</Badge>
              <blockquote className="text-2xl font-semibold text-secondary-900 dark:text-secondary-100 leading-snug mb-6">
                &ldquo;I was spending two hours a day answering the same pricing and prep questions.
                VocUI handles all of that now. Serious clients book directly, and they arrive at their
                session already knowing what to expect — which makes the shoot so much smoother.&rdquo;
              </blockquote>
              <p className="text-secondary-500 dark:text-secondary-400 text-sm">
                L.K. &mdash; Owner, Portrait & Wedding Photography Studio
              </p>
            </div>
          </div>
        </section>

        {/* ── Who It's For ────────────────────────────────────────────────────── */}
        <section className="container mx-auto px-4 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">Who it&apos;s for</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              For photographers who want to spend time behind the lens, not behind the keyboard
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              If admin is eating into your shooting and editing time, VocUI automates the
              questions so you can focus on the work that actually builds your reputation.
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
                { label: 'Chatbot for Wedding Venues', href: '/chatbot-for-wedding-venues', description: 'Booking inquiry and packages FAQ for wedding venues.' },
                { label: 'Chatbot for Hotels', href: '/chatbot-for-hotels', description: 'Booking support and amenities FAQ for hotels and accommodation.' },
                { label: 'Chatbot for Travel Agencies', href: '/chatbot-for-travel-agencies', description: 'Destination FAQ and booking lead capture for travel professionals.' },
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
                Your studio admin doesn&apos;t need to run through you
              </h2>
              <p className="text-lg text-white/80 mb-2 max-w-xl mx-auto">
                Let your chatbot handle pricing and prep questions. You handle the art.
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
                    Build Your Photography Studio Chatbot Free
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
