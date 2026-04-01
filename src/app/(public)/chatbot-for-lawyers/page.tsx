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
  Users,
  MoonStar,
  Filter,
  BookOpen,
  CalendarCheck,
  Clock,
  UserCheck,
  ShieldCheck,
  Scale,
  Globe,
  Plane,
  Heart,
  Briefcase,
} from 'lucide-react';

// ─── Metadata ──────────────────────────────────────────────────────────────────

export function generateMetadata(): Metadata {
  return {
    title: 'AI Chatbot for Law Firms | Automate Client Intake & FAQs | VocUI',
    description:
      'Let an AI chatbot handle client intake questions, eligibility FAQs, and appointment booking — 24/7. Free your attorneys to focus on casework, not admin.',
    keywords: [
      'AI chatbot for law firms',
      'legal chatbot',
      'client intake automation',
      'law firm FAQ chatbot',
      'legal AI chatbot',
    ],
    openGraph: {
      title: 'AI Chatbot for Law Firms | Automate Client Intake & FAQs | VocUI',
      description:
        'Let an AI chatbot handle client intake questions, eligibility FAQs, and appointment booking — 24/7. Free your attorneys to focus on casework, not admin.',
      url: 'https://vocui.com/chatbot-for-lawyers',
      siteName: 'VocUI',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'AI Chatbot for Law Firms | Automate Client Intake & FAQs | VocUI',
      description:
        'Let an AI chatbot handle client intake questions, eligibility FAQs, and appointment booking — 24/7. Free your attorneys to focus on casework, not admin.',
    },
    alternates: {
      canonical: 'https://vocui.com/chatbot-for-lawyers',
    },
    robots: { index: true, follow: true },
  };
}

// ─── Structured Data ───────────────────────────────────────────────────────────

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'VocUI — AI Chatbot for Law Firms',
  applicationCategory: 'LegalService',
  operatingSystem: 'Web',
  description:
    'AI chatbot that handles client intake questions, eligibility FAQs, and appointment booking for law firms — 24/7, trained on your approved content only.',
  url: 'https://vocui.com/chatbot-for-lawyers',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    description: 'Free plan available',
  },
  featureList: [
    'Knowledge base trained on your practice content',
    'Automated intake screening',
    'Appointment booking via Easy!Appointments',
    '24/7 after-hours availability',
    'Live attorney handoff',
    'GDPR-compliant data handling',
  ],
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What can VocUI's AI chatbot do for Law Firms?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Let an AI chatbot handle client intake questions, eligibility FAQs, and appointment booking \u2014 24/7. Free your attorneys to focus on casework, not admin."
      }
    },
    {
      "@type": "Question",
      "name": "How long does it take to set up VocUI for Law Firms?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Most Law Firms get set up in under an hour. Upload your existing content -- service descriptions, FAQs, pricing pages, or PDFs -- and VocUI trains the chatbot automatically. Embed it on your website with a single snippet."
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
      "name": "How is VocUI different from a generic chatbot for Law Firms?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Unlike generic chatbots, VocUI is trained exclusively on your own content -- your service descriptions, policies, FAQs, and documents. It only answers questions relevant to your Law Firms business and escalates to your team when it cannot help, with full conversation context included."
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
      "name": "AI Chatbot for Law Firms",
      "item": "https://vocui.com/chatbot-for-lawyers"
    }
  ]
};



// ─── Data ──────────────────────────────────────────────────────────────────────

const trustSignals = [
  'Handles intake questions 24/7',
  'Never gives legal advice — only your approved content',
  'GDPR-compliant data handling',
];

const painPoints: Array<{ icon: ElementType; title: string; body: ReactNode }> = [
  {
    icon: Users,
    title: 'The same 10 intake questions, 40 times a week',
    body: 'Do you handle immigration cases? What\'s your fee structure? Do you offer free consultations? Your team answers these manually, every time — before a single billable hour is earned.',
  },
  {
    icon: MoonStar,
    title: 'After-hours inquiries go cold by morning',
    body: <span>A potential client researches their options at 10pm and finds your website. <a href="https://livechatai.com/blog/customer-support-response-time-statistics" target="_blank" rel="noopener noreferrer" className="underline decoration-dotted hover:text-primary-500 transition-colors">Nearly 60% of people expect a reply within 10 minutes</a> — with no one available, they move on to the next firm that responds first.</span>,
  },
  {
    icon: Filter,
    title: 'Unqualified leads consume qualified-lead time',
    body: 'Without automated intake screening, every inquiry gets equal attention — including the ones that were never a fit for your practice.',
  },
];

const steps = [
  {
    step: '01',
    title: 'Train on your practice',
    description:
      'Upload your FAQs, service descriptions, intake criteria, and any public-facing documentation. Your chatbot learns your practice areas and answers accordingly.',
  },
  {
    step: '02',
    title: 'Set boundaries clearly',
    description:
      'Configure your chatbot to answer only from approved content and display a clear disclaimer that it does not provide legal advice. Escalation rules route complex queries directly to your team.',
  },
  {
    step: '03',
    title: 'Deploy and capture leads',
    description:
      'Embed on your website. Visitors get instant answers; qualified leads get routed to your intake form or booking calendar automatically.',
  },
];

const features = [
  {
    icon: BookOpen,
    name: 'Knowledge base trained on your content',
    description:
      'Your chatbot answers from your approved practice area docs only — never fabricated legal information.',
  },
  {
    icon: Filter,
    name: 'Automated intake screening',
    description:
      'Ask qualifying questions in natural conversation. Filter by case type, jurisdiction, or any criteria you define.',
  },
  {
    icon: CalendarCheck,
    name: 'Appointment booking',
    description:
      'Connect to your calendar via Easy!Appointments. Qualified prospects book consultations directly from the chat.',
  },
  {
    icon: Clock,
    name: 'After-hours availability',
    description:
      'Your chatbot answers inquiries at 11pm as well as it does at 11am. No missed leads, no delayed responses.',
  },
  {
    icon: UserCheck,
    name: 'Live attorney handoff',
    description:
      'Complex or sensitive queries escalate immediately to the right person with full conversation context.',
  },
  {
    icon: ShieldCheck,
    name: 'GDPR-compliant data handling',
    description:
      'Visitor data is handled per GDPR. Data processing agreements available for Enterprise customers.',
  },
];

const verticals = [
  {
    icon: Globe,
    title: 'Immigration Law',
    description:
      'Answer visa eligibility questions, process timelines, and document requirements — before the consultation.',
  },
  {
    icon: Scale,
    title: 'Personal Injury',
    description:
      'Qualify case eligibility, explain the claims process, and book free consultations automatically.',
  },
  {
    icon: Heart,
    title: 'Family Law',
    description:
      'Handle sensitive initial inquiries with empathy. Route to the right attorney based on case type.',
  },
  {
    icon: Briefcase,
    title: 'Business & Corporate Law',
    description:
      'Answer service scope questions, fee structure FAQs, and entity formation queries around the clock.',
  },
];

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ChatbotForLawyersPage() {
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
          <Badge className="mb-6">AI Chatbot for Legal Practices</Badge>

          <H1 className="max-w-4xl mb-6">
            Your clients ask the same intake questions every week.{' '}
            <span className="text-primary-500">Your chatbot can answer them.</span>
          </H1>

          <p className="mx-auto max-w-2xl text-lg text-secondary-600 dark:text-secondary-400 mb-10">
            VocUI trains on your practice area FAQs, intake criteria, and service descriptions — so
            your team spends less time on admin and more time practicing law.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="xl" asChild>
              <Link href="/signup">
                Build Your Legal Chatbot Free
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button size="xl" variant="outline" asChild>
              <Link href="/pricing">See Pricing</Link>
            </Button>
          </div>

          <p className="text-sm text-secondary-500 dark:text-secondary-400">
            Handles intake questions 24/7 &middot; Never gives legal advice — only your approved content &middot; GDPR-compliant
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
            <Badge variant="outline" className="mb-4">The intake problem</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              Your attorneys are answering questions a FAQ page could handle
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              Not because your team is inefficient. Because there&apos;s no system in place to
              handle repetitive intake — so it all lands on the people whose time is billed by the hour.
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
            <Badge variant="outline" className="mb-4">Features</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              Everything a legal intake chatbot actually needs
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              Built specifically for legal intake — not a generic chatbot dropped onto your site.
              Every feature is aimed at filtering leads and freeing attorney time.
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
              <Badge variant="outline" className="mb-8">From a law firm using VocUI</Badge>
              <blockquote className="text-2xl font-semibold text-secondary-900 dark:text-secondary-100 leading-snug mb-6">
                &ldquo;Clients ask us the same eligibility questions every week. VocUI handles that
                now. My team spends more time actually practicing law.&rdquo;
              </blockquote>
              <p className="text-secondary-500 dark:text-secondary-400 text-sm">
                S.C. &mdash; Managing Partner, Immigration Law Practice
              </p>
            </div>
          </div>
        </section>

        {/* ── Who It's For ────────────────────────────────────────────────────── */}
        <section className="container mx-auto px-4 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">Who it&apos;s for</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              For law firms that want their attorneys focused on law
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              If your attorneys are spending time on questions any trained chatbot could handle,
              VocUI pays for itself before the first billable hour it frees up.
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
                { label: 'Chatbot for Immigration Lawyers', href: '/chatbot-for-immigration-lawyers', description: 'Visa category FAQ and consultation booking — no legal advice given.' },
                { label: 'Chatbot for Accountants', href: '/chatbot-for-accountants', description: 'Tax FAQ and client intake automation.' },
                { label: 'Chatbot for Financial Advisors', href: '/chatbot-for-financial-advisors', description: 'Service FAQ and consultation booking for financial advisers.' },
                { label: 'Chatbot for Insurance Agents', href: '/chatbot-for-insurance-agents', description: 'Policy FAQ and quote lead capture for insurance professionals.' },
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
                Your attorneys&apos; time is too valuable for intake admin
              </h2>
              <p className="text-lg text-white/80 mb-2 max-w-xl mx-auto">
                Build a chatbot that handles the questions — so your team can handle the cases.
              </p>
              <p className="text-sm text-white/60 mb-10">
                Free plan available &middot; No credit card required &middot; No legal advice — only your approved content
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="xl"
                  variant="secondary"
                  className="bg-white text-primary-600 hover:bg-primary-50 font-semibold"
                  asChild
                >
                  <Link href="/signup">
                    Build Your Legal Chatbot Free
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
