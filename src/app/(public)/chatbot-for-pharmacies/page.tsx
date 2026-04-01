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
  Clock,
  Globe,
  BookOpen,
  CalendarCheck,
  ShieldCheck,
  UserCheck,
  MessageSquare,
  Layers,
  Database,
  Star,
  Activity,
} from 'lucide-react';

// ─── Metadata ──────────────────────────────────────────────────────────────────

export function generateMetadata(): Metadata {
  return {
    title: 'AI Chatbot for Pharmacies | Prescription FAQ & Service Support | VocUI',
    description:
      'Handle opening hours, prescription queries, and service questions automatically. VocUI trains on your pharmacy content so customers get instant answers — even during your busiest dispensing periods.',
    keywords: [
      'AI chatbot for pharmacies',
      'pharmacy chatbot',
      'prescription FAQ chatbot',
      'pharmacy service support chatbot',
      'dispensary chatbot',
    ],
    openGraph: {
      title: 'AI Chatbot for Pharmacies | Prescription FAQ & Service Support | VocUI',
      description:
        'Handle opening hours, prescription queries, and service questions automatically. VocUI trains on your pharmacy content so customers get instant answers — even during your busiest dispensing periods.',
      url: 'https://vocui.com/chatbot-for-pharmacies',
      siteName: 'VocUI',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'AI Chatbot for Pharmacies | Prescription FAQ & Service Support | VocUI',
      description:
        'Handle opening hours, prescription queries, and service questions automatically. VocUI trains on your pharmacy content so customers get instant answers — even during your busiest dispensing periods.',
    },
    alternates: {
      canonical: 'https://vocui.com/chatbot-for-pharmacies',
    },
    robots: { index: true, follow: true },
  };
}

// ─── Structured Data ───────────────────────────────────────────────────────────

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'VocUI — AI Chatbot for Pharmacies',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  description:
    'AI chatbot that handles prescription FAQs, opening hours queries, and pharmacy service questions — so dispensing staff can focus on patient care.',
  url: 'https://vocui.com/chatbot-for-pharmacies',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    description: 'Free plan available',
  },
  featureList: [
    'Pharmacy-specific knowledge training',
    'Prescription and dispensing FAQs',
    'Opening hours and service information',
    'After-hours customer support',
    'Staff handoff for clinical queries',
    'GDPR-compliant data handling',
  ],
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What can VocUI's AI chatbot do for Pharmacies?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Handle opening hours, prescription queries, and service questions automatically. VocUI trains on your pharmacy content so customers get instant answers \u2014 even during your busiest dispensing periods."
      }
    },
    {
      "@type": "Question",
      "name": "How long does it take to set up VocUI for Pharmacies?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Most Pharmacies get set up in under an hour. Upload your existing content -- service descriptions, FAQs, pricing pages, or PDFs -- and VocUI trains the chatbot automatically. Embed it on your website with a single snippet."
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
      "name": "How is VocUI different from a generic chatbot for Pharmacies?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Unlike generic chatbots, VocUI is trained exclusively on your own content -- your service descriptions, policies, FAQs, and documents. It only answers questions relevant to your Pharmacies business and escalates to your team when it cannot help, with full conversation context included."
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
      "name": "AI Chatbot for Pharmacies",
      "item": "https://vocui.com/chatbot-for-pharmacies"
    }
  ]
};



// ─── Data ──────────────────────────────────────────────────────────────────────

const trustSignals = [
  'Answers customer questions 24/7',
  'Handles prescription and service FAQs instantly',
  'GDPR-compliant data handling',
];

const painPoints: Array<{ icon: ElementType; title: string; body: ReactNode }> = [
  {
    icon: Phone,
    title: 'Your phone rings constantly with questions your website already answers',
    body: 'What are your opening hours? Do you dispense this medication? Is the pharmacist available for a consultation? These questions arrive every hour of every day — and each one pulls a staff member away from dispensing.',
  },
  {
    icon: Clock,
    title: 'Customers call during your busiest dispensing periods',
    body: 'The peak hours for phone enquiries are the same hours your team is processing the highest prescription volume. Every interruption slows down every patient waiting at the counter.',
  },
  {
    icon: Globe,
    title: 'Customers compare pharmacies online after hours',
    body: <span>Someone looks for a pharmacy that does Webster packs at 8pm. If your website cannot answer their question, they call or visit the competitor that can. <a href="https://www.salesloft.com/resources/guides/conversational-ai-marketing-trends-report" target="_blank" rel="noopener noreferrer" className="underline decoration-dotted hover:text-primary-500 transition-colors">41% of all enquiries arrive outside standard business hours.</a></span>,
  },
];

const steps = [
  {
    step: '01',
    title: 'Train on your pharmacy content',
    description:
      'Upload your services list, opening hours, prescription policies, vaccination offerings, and product FAQs. Your chatbot learns your specific pharmacy — not generic dispensing information.',
  },
  {
    step: '02',
    title: 'Define what your chatbot handles and what it escalates',
    description:
      'Clinical advice and medication interactions always go to a pharmacist. Everything else — hours, services, stock questions, scripts — your chatbot handles automatically.',
  },
  {
    step: '03',
    title: 'Go live on your website',
    description:
      'One embed snippet. Your pharmacy chatbot handles routine enquiries around the clock, reducing phone interruptions and freeing your team for patient-facing dispensing work.',
  },
];

const features = [
  {
    icon: BookOpen,
    name: 'Pharmacy-specific knowledge',
    description:
      'Trained on your services, opening hours, prescription policies, and product range — not generic pharmacy information.',
  },
  {
    icon: CalendarCheck,
    name: 'Service booking and enquiries',
    description:
      'Let customers ask about vaccination bookings, consultation availability, and compounding services — and direct them to the right action.',
  },
  {
    icon: MessageSquare,
    name: 'Prescription and dispensing FAQs',
    description:
      'Answer questions about script repeats, electronic prescriptions, dosage administration aids, and dispensing timelines automatically.',
  },
  {
    icon: Clock,
    name: 'After-hours customer support',
    description:
      'When your pharmacy is closed, your chatbot keeps answering. Opening hours, on-call pharmacist details, and nearest 24-hour options — all handled.',
  },
  {
    icon: UserCheck,
    name: 'Clinical handoff for medical queries',
    description:
      'Questions about drug interactions, side effects, or clinical advice are immediately flagged for a pharmacist. Safety is built into the escalation logic.',
  },
  {
    icon: ShieldCheck,
    name: 'GDPR-compliant',
    description:
      'Visitor data is handled per GDPR. Conversation data is never used to train AI models.',
  },
];

const verticals = [
  {
    icon: Star,
    title: 'Independent Pharmacies',
    description:
      'Give your community pharmacy the same always-on digital presence as the chains — without the enterprise budget.',
  },
  {
    icon: Database,
    title: 'Compounding Pharmacies',
    description:
      'Explain compounding services, turnaround times, and referral requirements automatically to every enquiring patient.',
  },
  {
    icon: Globe,
    title: 'Online Pharmacies',
    description:
      'Handle order status questions, prescription upload queries, and delivery FAQs around the clock without increasing support headcount.',
  },
  {
    icon: Activity,
    title: 'Health Food & Supplement Stores',
    description:
      'Answer product comparison questions, ingredient queries, and dosage FAQs from your own product catalogue content.',
  },
];

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ChatbotForPharmaciesPage() {
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
            <li className="text-secondary-900 dark:text-secondary-100 font-medium">AI Chatbot for Pharmacies</li>
          </ol>
        </nav>


        {/* ── Hero ────────────────────────────────────────────────────────────── */}
        <section className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center container mx-auto px-4 py-16 text-center">
          <Badge className="mb-6">AI Chatbot for Pharmacies</Badge>

          <H1 className="max-w-4xl mb-6">
            Let your dispensing team focus on patients,{' '}
            <span className="text-primary-500">not the same phone questions on repeat.</span>
          </H1>

          <p className="mx-auto max-w-2xl text-lg text-secondary-600 dark:text-secondary-400 mb-10">
            VocUI trains on your pharmacy&apos;s services, hours, and prescription policies — so
            customers get instant answers any time of day, without interrupting your dispensing team.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="xl" asChild>
              <Link href="/signup">
                Build Your Pharmacy Chatbot Free
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button size="xl" variant="outline" asChild>
              <Link href="/pricing">See Pricing</Link>
            </Button>
          </div>

          <p className="text-sm text-secondary-500 dark:text-secondary-400">
            Answers customer questions 24/7 &middot; Reduces phone interruptions &middot; GDPR-compliant
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
            <Badge variant="outline" className="mb-4">The dispensing interruption problem</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              Routine enquiries are interrupting your most skilled work at the worst moments
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              Your dispensing team is among the most highly trained in retail healthcare. Answering
              the phone about opening hours is not the best use of that expertise.
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
                From your pharmacy content to a live customer chatbot in under an hour
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
              Everything a pharmacy customer chatbot actually needs
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              Built for the specific demands of pharmacy retail — with clinical safety guardrails
              built into the escalation logic from day one.
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
              <Badge variant="outline" className="mb-8">From a pharmacy using VocUI</Badge>
              <blockquote className="text-2xl font-semibold text-secondary-900 dark:text-secondary-100 leading-snug mb-6">
                &ldquo;We cut our inbound phone volume by about a third in the first two weeks.
                Opening hours, script queries, vaccination availability — the chatbot handles all of it
                now. My team noticed the difference immediately.&rdquo;
              </blockquote>
              <p className="text-secondary-500 dark:text-secondary-400 text-sm">
                T.O. &mdash; Pharmacy Manager, Community Pharmacy Group
              </p>
            </div>
          </div>
        </section>

        {/* ── Who It's For ────────────────────────────────────────────────────── */}
        <section className="container mx-auto px-4 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">Who it&apos;s for</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              For every pharmacy that wants to reduce interruptions and serve more customers
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              Whether you run a single dispensary or a multi-location group, VocUI gives every
              customer instant answers — without adding to your team&apos;s workload.
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
                { label: 'Chatbot for Healthcare', href: '/chatbot-for-healthcare', description: 'Patient FAQ, insurance questions, and appointment booking — 24/7.' },
                { label: 'Chatbot for Dentists', href: '/chatbot-for-dentists', description: 'Appointment booking, insurance FAQ, and patient preparation guides.' },
                { label: 'Chatbot for Chiropractors', href: '/chatbot-for-chiropractors', description: 'New patient intake, treatment FAQ, and appointment booking.' },
                { label: 'Chatbot for Optometrists', href: '/chatbot-for-optometrists', description: 'Eye exam booking and product FAQ automation.' },
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
                Your pharmacists trained to help patients — not to answer phone FAQs
              </h2>
              <p className="text-lg text-white/80 mb-2 max-w-xl mx-auto">
                Give your team back the time they spend on routine enquiries. Your chatbot handles
                the questions; your pharmacists handle the care.
              </p>
              <p className="text-sm text-white/60 mb-10">
                Free plan available &middot; No credit card required &middot; GDPR-compliant
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="xl"
                  variant="secondary"
                  className="bg-white text-primary-600 hover:bg-primary-50 font-semibold"
                  asChild
                >
                  <Link href="/signup">
                    Build Your Pharmacy Chatbot Free
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
