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
  RefreshCw,
  MoonStar,
  Filter,
  BookOpen,
  CalendarCheck,
  Clock,
  UserCheck,
  ShieldCheck,
  DollarSign,
  Briefcase,
  BarChart,
  Users,
} from 'lucide-react';

// ─── Metadata ──────────────────────────────────────────────────────────────────

export function generateMetadata(): Metadata {
  return {
    title: 'AI Chatbot for Accountants | Tax FAQ & Client Intake | VocUI',
    description:
      'Let an AI chatbot handle tax season FAQs, client intake screening, and after-hours inquiries for your accounting firm — 24/7. Stop repeating yourself every April.',
    keywords: [
      'AI chatbot for accountants',
      'accounting chatbot',
      'tax FAQ chatbot',
      'client intake automation',
      'accountant lead capture',
    ],
    openGraph: {
      title: 'AI Chatbot for Accountants | Tax FAQ & Client Intake | VocUI',
      description:
        'Let an AI chatbot handle tax season FAQs, client intake screening, and after-hours inquiries for your accounting firm — 24/7. Stop repeating yourself every April.',
      url: 'https://vocui.com/chatbot-for-accountants',
      siteName: 'VocUI',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'AI Chatbot for Accountants | Tax FAQ & Client Intake | VocUI',
      description:
        'Let an AI chatbot handle tax season FAQs, client intake screening, and after-hours inquiries for your accounting firm — 24/7. Stop repeating yourself every April.',
    },
    alternates: {
      canonical: 'https://vocui.com/chatbot-for-accountants',
    },
    robots: { index: true, follow: true },
  };
}

// ─── Structured Data ───────────────────────────────────────────────────────────

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'VocUI — AI Chatbot for Accountants',
  applicationCategory: 'FinancialService',
  operatingSystem: 'Web',
  description:
    'AI chatbot that handles tax season FAQs, client intake screening, and after-hours inquiries for accounting firms — 24/7, trained on your firm content only.',
  url: 'https://vocui.com/chatbot-for-accountants',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    description: 'Free plan available',
  },
  featureList: [
    'Knowledge base trained on your firm content',
    'Automated client intake screening',
    'Tax season FAQ automation',
    '24/7 after-hours availability',
    'Consultation booking via Easy!Appointments',
    'GDPR-compliant data handling',
  ],
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What can VocUI's AI chatbot do for Accountants?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Let an AI chatbot handle tax season FAQs, client intake screening, and after-hours inquiries for your accounting firm \u2014 24/7. Stop repeating yourself every April."
      }
    },
    {
      "@type": "Question",
      "name": "How long does it take to set up VocUI for Accountants?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Most Accountants get set up in under an hour. Upload your existing content -- service descriptions, FAQs, pricing pages, or PDFs -- and VocUI trains the chatbot automatically. Embed it on your website with a single snippet."
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
      "name": "How is VocUI different from a generic chatbot for Accountants?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Unlike generic chatbots, VocUI is trained exclusively on your own content -- your service descriptions, policies, FAQs, and documents. It only answers questions relevant to your Accountants business and escalates to your team when it cannot help, with full conversation context included."
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
      "name": "AI Chatbot for Accountants",
      "item": "https://vocui.com/chatbot-for-accountants"
    }
  ]
};



// ─── Data ──────────────────────────────────────────────────────────────────────

const trustSignals = [
  'Answers client questions 24/7',
  'Trained only on your firm content',
  'GDPR-compliant data handling',
];

const painPoints: Array<{ icon: ElementType; title: string; body: ReactNode }> = [
  {
    icon: RefreshCw,
    title: 'The same tax season questions, year after year',
    body: 'What documents do I need to bring? What\'s the deadline for lodging? Do you do self-managed super funds? Your team answers these identically every year — before a single billable minute of actual work.',
  },
  {
    icon: MoonStar,
    title: 'After-hours client inquiries go unanswered until morning',
    body: <span>A business owner with a tax question at 8pm deserves a fast answer. <a href="https://livechatai.com/blog/customer-support-response-time-statistics" target="_blank" rel="noopener noreferrer" className="underline decoration-dotted hover:text-primary-500 transition-colors">Nearly 60% of people expect a response within 10 minutes</a> — without it, they Google alternatives and some book with a competitor before you open.</span>,
  },
  {
    icon: Filter,
    title: 'Unqualified leads waste expensive consultation time',
    body: 'Without automated intake, every prospect gets a meeting — including those outside your service scope or price range. Qualification questions in chat filter those out before any diary is touched.',
  },
];

const steps = [
  {
    step: '01',
    title: 'Train on your firm content',
    description:
      'Upload your service descriptions, tax checklists, deadlines, fee structures, and FAQs. Your chatbot learns your firm\'s scope and answers from that knowledge exclusively.',
  },
  {
    step: '02',
    title: 'Configure intake screening',
    description:
      'Set qualifying questions — business size, entity type, services needed. The chatbot gathers the right information before a consultation is ever booked.',
  },
  {
    step: '03',
    title: 'Deploy and capture qualified leads',
    description:
      'Embed on your website. Prospects get instant answers; qualified leads book consultations directly. Unqualified inquiries are handled gracefully without consuming staff time.',
  },
];

const features = [
  {
    icon: BookOpen,
    name: 'Knowledge base trained on your content',
    description:
      'Your chatbot answers from your approved firm content — never invented tax advice or unsupported claims about legislation.',
  },
  {
    icon: Filter,
    name: 'Automated client intake screening',
    description:
      'Qualify prospects by entity type, service need, and complexity before they reach your calendar. Only the right clients book consultations.',
  },
  {
    icon: CalendarCheck,
    name: 'Consultation booking',
    description:
      'Connect to your calendar via Easy!Appointments. Pre-qualified prospects book directly from the chat — no back-and-forth emails.',
  },
  {
    icon: Clock,
    name: 'Tax season FAQ on autopilot',
    description:
      'Deploy a chatbot loaded with this year\'s deadlines, document checklists, and process FAQs. Same questions, handled automatically.',
  },
  {
    icon: UserCheck,
    name: 'Seamless staff handoff',
    description:
      'Complex queries or high-value prospects escalate to the right accountant immediately with the full chat history attached.',
  },
  {
    icon: ShieldCheck,
    name: 'GDPR-compliant data handling',
    description:
      'Visitor data is handled per GDPR. Your clients\' information never leaves your approved systems without consent.',
  },
];

const verticals = [
  {
    icon: DollarSign,
    title: 'Personal Tax',
    description:
      'Handle deduction questions, document checklists, and lodgement deadline FAQs without tying up your accountants.',
  },
  {
    icon: Briefcase,
    title: 'Business Accounting',
    description:
      'Qualify business clients by size and entity type, answer BAS and GST FAQs, and route serious leads to a consultation.',
  },
  {
    icon: BarChart,
    title: 'Bookkeeping',
    description:
      'Answer software compatibility, service scope, and pricing FAQs — and capture leads ready to hand off to a bookkeeper.',
  },
  {
    icon: Users,
    title: 'Payroll Services',
    description:
      'Explain payroll compliance requirements, onboarding processes, and service tiers to prospects at any hour.',
  },
];

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ChatbotForAccountantsPage() {
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
            <li className="text-secondary-900 dark:text-secondary-100 font-medium">AI Chatbot for Accountants</li>
          </ol>
        </nav>


        {/* ── Hero ────────────────────────────────────────────────────────────── */}
        <section className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center container mx-auto px-4 py-16 text-center">
          <Badge className="mb-6">AI Chatbot for Accounting Firms</Badge>

          <H1 className="max-w-4xl mb-6">
            Your clients ask the same tax questions every year.{' '}
            <span className="text-primary-500">Your chatbot can answer them.</span>
          </H1>

          <p className="mx-auto max-w-2xl text-lg text-secondary-600 dark:text-secondary-400 mb-10">
            VocUI trains on your firm&apos;s service descriptions, tax checklists, and FAQs — so
            your accountants spend less time answering emails and more time on billable work.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="xl" asChild>
              <Link href="/signup">
                Build Your Accounting Chatbot Free
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button size="xl" variant="outline" asChild>
              <Link href="/pricing">See Pricing</Link>
            </Button>
          </div>

          <p className="text-sm text-secondary-500 dark:text-secondary-400">
            Answers client questions 24/7 &middot; Trained only on your firm content &middot; GDPR-compliant
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
            <Badge variant="outline" className="mb-4">The tax season problem</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              Your accountants are answering questions a FAQ page could handle
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              Not because your team is slow. Because there&apos;s no system to catch repetitive
              client inquiries before they land in your inbox — so every question reaches a
              qualified professional who could be doing higher-value work.
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
              Everything an accounting firm chatbot actually needs
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              Built for accountants — not a generic widget on your contact page.
              Every feature is aimed at filtering leads and reclaiming billable time.
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
              <Badge variant="outline" className="mb-8">From an accounting firm using VocUI</Badge>
              <blockquote className="text-2xl font-semibold text-secondary-900 dark:text-secondary-100 leading-snug mb-6">
                &ldquo;Tax season used to mean two weeks of answering the same client emails before
                we could do any real work. VocUI handles those questions now. We walked into July
                with our heads clear for the first time in years.&rdquo;
              </blockquote>
              <p className="text-secondary-500 dark:text-secondary-400 text-sm">
                R.T. &mdash; Principal, Thornton &amp; Associates Accounting
              </p>
            </div>
          </div>
        </section>

        {/* ── Who It's For ────────────────────────────────────────────────────── */}
        <section className="container mx-auto px-4 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">Who it&apos;s for</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              For accounting firms that want their CPAs focused on accounting
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              If your accountants are spending time on questions a chatbot could handle, VocUI
              pays for itself in the first week of tax season alone.
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
                { label: 'Chatbot for Accountancy Firms', href: '/chatbot-for-accountancy-firms', description: 'Services FAQ and new client intake for accounting practices.' },
                { label: 'Chatbot for Financial Advisors', href: '/chatbot-for-financial-advisors', description: 'Service FAQ and consultation booking for financial advisers.' },
                { label: 'Chatbot for Insurance Agents', href: '/chatbot-for-insurance-agents', description: 'Policy FAQ and quote lead capture for insurance professionals.' },
                { label: 'Chatbot for Law Firms', href: '/chatbot-for-lawyers', description: 'Client intake, practice area FAQ, and consultation booking.' },
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
                Your accountants&apos; time is too valuable for FAQ emails
              </h2>
              <p className="text-lg text-white/80 mb-2 max-w-xl mx-auto">
                Build a chatbot that handles the questions — so your team can handle the numbers.
              </p>
              <p className="text-sm text-white/60 mb-10">
                Free plan available &middot; No credit card required &middot; Live before tax season hits
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="xl"
                  variant="secondary"
                  className="bg-white text-primary-600 hover:bg-primary-50 font-semibold"
                  asChild
                >
                  <Link href="/signup">
                    Build Your Accounting Chatbot Free
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

      
          {/* Related Blog Post */}
          <div className="mt-6 mb-2 rounded-xl border border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-800/50 p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary-600 dark:text-primary-400 mb-2">Related reading</p>
            <Link href="/blog/chatbot-for-accounting-firms" className="font-semibold text-secondary-900 dark:text-secondary-100 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              AI Chatbots for Accounting Firms: Client Self-Service →
            </Link>
          </div>
      </main>

      <Footer />
    </PageBackground>
  );
}
