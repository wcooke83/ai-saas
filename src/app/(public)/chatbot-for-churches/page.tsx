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
  MoonStar,
  Clock,
  BookOpen,
  CalendarCheck,
  UserCheck,
  ShieldCheck,
  Heart,
  Star,
  Users,
  Church,
} from 'lucide-react';

// ─── Metadata ──────────────────────────────────────────────────────────────────

export function generateMetadata(): Metadata {
  return {
    title: 'AI Chatbot for Churches | Service Times FAQ & Event Registration | VocUI',
    description:
      'Let an AI chatbot handle service times, event registration, and congregation FAQs for your church — 24/7. Free up volunteers and welcome visitors any hour.',
    keywords: [
      'AI chatbot for churches',
      'church chatbot',
      'service times FAQ chatbot',
      'event registration chatbot',
      'church visitor automation',
    ],
    openGraph: {
      title: 'AI Chatbot for Churches | Service Times FAQ & Event Registration | VocUI',
      description:
        'Let an AI chatbot handle service times, event registration, and congregation FAQs for your church — 24/7. Free up volunteers and welcome visitors any hour.',
      url: 'https://vocui.com/chatbot-for-churches',
      siteName: 'VocUI',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'AI Chatbot for Churches | Service Times FAQ & Event Registration | VocUI',
      description:
        'Let an AI chatbot handle service times, event registration, and congregation FAQs for your church — 24/7. Free up volunteers and welcome visitors any hour.',
    },
    alternates: {
      canonical: 'https://vocui.com/chatbot-for-churches',
    },
    robots: { index: true, follow: true },
  };
}

// ─── Structured Data ───────────────────────────────────────────────────────────

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'VocUI — AI Chatbot for Churches',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  description:
    'AI chatbot that handles service times, event registration, and congregation FAQs for churches and places of worship — 24/7, trained on your church content only.',
  url: 'https://vocui.com/chatbot-for-churches',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    description: 'Free plan available',
  },
  featureList: [
    'Knowledge base trained on your church content',
    'Service times and location FAQ automation',
    'Event registration guidance',
    '24/7 after-hours availability',
    'Volunteer handoff with full conversation context',
    'GDPR-compliant data handling',
  ],
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Can the chatbot answer questions about service times, location, and what to expect at a first visit?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Upload your service schedule, address, parking information, and first-time visitor guide — and the chatbot answers these questions 24/7 for people exploring faith communities in your area."
      }
    },
    {
      "@type": "Question",
      "name": "Will VocUI handle enquiries about community groups, events, and volunteering?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Upload your groups and events calendar, volunteer opportunities, and how to get involved — and the chatbot answers questions from people looking to connect with the wider church community."
      }
    },
    {
      "@type": "Question",
      "name": "Can the chatbot answer questions about pastoral support and care?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "It can explain what pastoral care your church offers and how to get in touch with your pastoral team. Sensitive personal matters are always directed to a pastor or church leader rather than handled by the chatbot."
      }
    },
    {
      "@type": "Question",
      "name": "How does VocUI handle enquiries about weddings, baptisms, and funerals at the church?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Upload your ceremonies FAQ — who is eligible, what the process involves, fees, how to book a meeting with a minister — and the chatbot answers initial enquiries and routes booking requests appropriately."
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
      "name": "AI Chatbot for Churches",
      "item": "https://vocui.com/chatbot-for-churches"
    }
  ]
};



// ─── Data ──────────────────────────────────────────────────────────────────────

const trustSignals = [
  'Answers congregation questions 24/7',
  'Trained only on your church content',
  'GDPR-compliant data handling',
];

const painPoints: Array<{ icon: ElementType; title: string; body: ReactNode }> = [
  {
    icon: Phone,
    title: 'Volunteers fielding the same newcomer questions before every service',
    body: 'What time is the Sunday service? Is there parking? What should I expect on my first visit? Your volunteers answer the same questions week after week — time that could go toward genuine pastoral care and community building.',
  },
  {
    icon: MoonStar,
    title: 'People exploring faith going unanswered after hours',
    body: <span>Someone considering attending for the first time opens your website at 10pm. Without instant, welcoming answers, they move on. A chatbot can greet every curious visitor with warmth and accurate information at any hour — making sure no newcomer goes unanswered.</span>,
  },
  {
    icon: Clock,
    title: 'Event and community group enquiries lost in the inbox',
    body: 'Each event brings a wave of emails asking about registration, capacity, and logistics. Community group enquiries sit unanswered until the right volunteer checks their inbox — and people lose interest in the meantime.',
  },
];

const steps = [
  {
    step: '01',
    title: 'Upload your church content',
    description:
      'Add your service schedules, event listings, ministry descriptions, parking info, and FAQs. Your chatbot learns everything about your community and answers with the right information every time.',
  },
  {
    step: '02',
    title: 'Configure welcoming visitor flows',
    description:
      'Set up warm, on-brand response flows for first-time visitors, returning members, and event enquiries. Define when questions should escalate to a pastor or staff member.',
  },
  {
    step: '03',
    title: 'Embed on your website and go live',
    description:
      'Add the widget to your church website in minutes. Visitors and congregation members get instant answers; those wanting deeper connection are routed to your team.',
  },
];

const features = [
  {
    icon: BookOpen,
    name: 'Knowledge base trained on your content',
    description:
      'Your chatbot draws only from your approved church content — service times, ministries, values, and events — never generic or invented information.',
  },
  {
    icon: CalendarCheck,
    name: 'Event registration guidance',
    description:
      'Walk visitors through upcoming events, registration steps, and logistics — reducing the admin burden on your volunteers before every gathering.',
  },
  {
    icon: Clock,
    name: '24/7 availability for visitors',
    description:
      'People explore faith communities outside office hours. Your chatbot welcomes every curious visitor with warmth and accurate information at any time of day.',
  },
  {
    icon: UserCheck,
    name: 'Seamless volunteer handoff',
    description:
      'Sensitive pastoral questions escalate immediately to your team with the full conversation context — so no one falls through the cracks.',
  },
  {
    icon: ShieldCheck,
    name: 'GDPR-compliant and privacy-respecting',
    description:
      'Your congregation&apos;s data is handled with the care your community deserves. No third-party data sharing, full compliance with data protection regulations.',
  },
  {
    icon: Star,
    name: 'New visitor welcome flows',
    description:
      'Create first-time-visitor journeys that answer the questions newcomers are too nervous to ask — building belonging from the very first interaction.',
  },
];

const verticals = [
  {
    icon: Church,
    title: 'Sunday Services & Worship',
    description:
      'Answer service time, location, parking, and order-of-service questions automatically — so more people arrive prepared and on time.',
  },
  {
    icon: Users,
    title: 'Small Groups & Community Events',
    description:
      'Handle small group sign-ups, event registration, and logistics questions without burdening your volunteer coordinators.',
  },
  {
    icon: Heart,
    title: "Youth & Children's Ministry",
    description:
      "Answer parent questions about children's programmes, safeguarding policies, and registration without tying up your children's ministry team.",
  },
  {
    icon: Star,
    title: 'Outreach & Charity Programmes',
    description:
      'Share volunteer opportunities, donation FAQs, and charity programme details with anyone who wants to get involved — any time they ask.',
  },
];

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ChatbotForChurchesPage() {
  return (
    <PageBackground>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <Header />

      <main id="main-content">
        <nav aria-label="Breadcrumb" className="container mx-auto px-4 pt-6 pb-2">
          <ol className="flex items-center gap-2 text-sm text-secondary-500 dark:text-secondary-400">
            <li><Link href="/" className="hover:text-primary-500 transition-colors">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href="/industries" className="hover:text-primary-500 transition-colors">Industries</Link></li>
            <li aria-hidden="true">/</li>
            <li className="text-secondary-900 dark:text-secondary-100 font-medium">AI Chatbot for Churches</li>
          </ol>
        </nav>


        {/* ── Hero ────────────────────────────────────────────────────────────── */}
        <section className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center container mx-auto px-4 py-16 text-center">
          <Badge className="mb-6">AI Chatbot for Churches & Places of Worship</Badge>

          <H1 className="max-w-4xl mb-6">
            Your congregation has questions.{' '}
            <span className="text-primary-500">Your volunteers shouldn&apos;t have to answer the same ones every week.</span>
          </H1>

          <p className="mx-auto max-w-2xl text-lg text-secondary-600 dark:text-secondary-400 mb-10">
            VocUI trains on your service schedule, event listings, and community guides — so newcomers
            can find service times, connect with groups, and feel welcomed any time they visit your website.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="xl" asChild>
              <Link href="/signup">
                Set Up Your Church Chatbot Free
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button size="xl" variant="outline" asChild>
              <Link href="/pricing">See Pricing</Link>
            </Button>
          </div>

          <p className="text-sm text-secondary-500 dark:text-secondary-400">
            Answers congregation questions 24/7 &middot; Trained only on your church content &middot; GDPR-compliant
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
            <Badge variant="outline" className="mb-4">The volunteer time problem</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              Your team is answering questions a chatbot could handle
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              Not because your volunteers aren&apos;t dedicated — because there&apos;s no system for
              the routine questions that arrive before every service and every event.
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
                Live before your next service. No developers needed.
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
              Everything a church chatbot actually needs
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              Built for communities of faith — not a generic widget bolted onto your website.
              Every feature is designed to welcome newcomers, serve your congregation, and free
              your volunteers for the pastoral and community work that matters most.
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
                <Badge variant="outline" className="mb-4">How churches and faith communities use VocUI</Badge>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
                  A typical week, before and after VocUI
                </h2>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  { step: 'Before', text: 'Volunteers and office staff fielding the same questions about service times, parking, children\'s programmes, and how to get involved — especially around holidays and special events.' },
                  { step: 'Setup', text: 'Uploaded their weekly bulletin, event calendar, ministries guide, and visitor FAQ — configured in an afternoon without technical help.' },
                  { step: 'After', text: 'First-time visitors get location and schedule answers any time. Staff focused on in-person welcome. Event enquiries handled automatically before they reach the office inbox.' },
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
              For churches that want their volunteers focused on people, not admin
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              If your volunteers are spending Sunday mornings answering the same questions by email and
              phone, VocUI gives them that time back — and makes sure no newcomer goes unanswered.
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
                { label: 'Chatbot for Non-Profits', href: '/chatbot-for-nonprofits', description: 'Donation FAQ and volunteer intake for charities and non-profits.' },
                { label: 'Chatbot for Government Agencies', href: '/chatbot-for-government', description: 'Services FAQ and document request guidance for public bodies.' },
                { label: 'Chatbot for Tutoring Centers', href: '/chatbot-for-tutoring-centers', description: 'Subject FAQ and enrollment booking for tutoring businesses.' },
                { label: 'Chatbot for Universities', href: '/chatbot-for-universities', description: 'Admissions FAQ and course inquiry support for higher education.' },
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
                Your volunteers&apos; time is too valuable for repeat FAQs
              </h2>
              <p className="text-lg text-white/80 mb-2 max-w-xl mx-auto">
                Let your chatbot handle service times and event questions while your team focuses on building community.
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
                    Set Up Your Church Chatbot Free
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
