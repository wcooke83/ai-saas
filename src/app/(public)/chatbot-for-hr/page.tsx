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
  Inbox,
  MoonStar,
  AlertCircle,
  BookOpen,
  UserPlus,
  Clock,
  UserCheck,
  ShieldCheck,
  FileText,
  Users,
  HeartHandshake,
  ClipboardList,
} from 'lucide-react';

// ─── Metadata ──────────────────────────────────────────────────────────────────

export function generateMetadata(): Metadata {
  return {
    title: 'AI Chatbot for HR Departments | Policy FAQ & Onboarding Support | VocUI',
    description:
      'Give employees instant answers to policy and benefits questions — without pinging HR. VocUI trains on your HR docs and handles repeat queries 24/7.',
    keywords: [
      'AI chatbot for HR',
      'HR chatbot',
      'employee FAQ chatbot',
      'onboarding chatbot',
      'HR policy automation',
    ],
    openGraph: {
      title: 'AI Chatbot for HR Departments | Policy FAQ & Onboarding Support | VocUI',
      description:
        'Give employees instant answers to policy and benefits questions — without pinging HR. VocUI trains on your HR docs and handles repeat queries 24/7.',
      url: 'https://vocui.com/chatbot-for-hr',
      siteName: 'VocUI',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'AI Chatbot for HR Departments | Policy FAQ & Onboarding Support | VocUI',
      description:
        'Give employees instant answers to policy and benefits questions — without pinging HR. VocUI trains on your HR docs and handles repeat queries 24/7.',
    },
    alternates: {
      canonical: 'https://vocui.com/chatbot-for-hr',
    },
    robots: { index: true, follow: true },
  };
}

// ─── Structured Data ───────────────────────────────────────────────────────────

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'VocUI — AI Chatbot for HR Departments',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  description:
    'AI chatbot that handles employee policy FAQs, onboarding questions, and benefits queries for HR teams — 24/7, trained on your internal HR content only.',
  url: 'https://vocui.com/chatbot-for-hr',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    description: 'Free plan available',
  },
  featureList: [
    'Policy FAQ automation trained on your HR documents',
    'New hire onboarding support',
    'Benefits and compensation FAQ',
    '24/7 employee self-service',
    'Escalation to HR team with full context',
    'Document request handling',
  ],
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What can VocUI's AI chatbot do for HR Departments?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Give employees instant answers to policy and benefits questions \u2014 without pinging HR. VocUI trains on your HR docs and handles repeat queries 24/7."
      }
    },
    {
      "@type": "Question",
      "name": "How long does it take to set up VocUI for HR Departments?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Most HR Departments get set up in under an hour. Upload your existing content -- service descriptions, FAQs, pricing pages, or PDFs -- and VocUI trains the chatbot automatically. Embed it on your website with a single snippet."
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
      "name": "How is VocUI different from a generic chatbot for HR Departments?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Unlike generic chatbots, VocUI is trained exclusively on your own content -- your service descriptions, policies, FAQs, and documents. It only answers questions relevant to your HR Departments business and escalates to your team when it cannot help, with full conversation context included."
      }
    }
  ]
};


// ─── Data ──────────────────────────────────────────────────────────────────────

const trustSignals = [
  'Answers employee questions 24/7',
  'Trained only on your HR content',
  'GDPR-compliant data handling',
];

const painPoints: Array<{ icon: ElementType; title: string; body: ReactNode }> = [
  {
    icon: Inbox,
    title: 'Your HR team is buried in the same policy questions every week',
    body: <span>How many days of PTO do I have? What is the remote work policy? When does open enrollment close? <a href="https://www.ibm.com/think/topics/chatbots-for-hr" target="_blank" rel="noopener noreferrer" className="underline decoration-dotted hover:text-primary-500 transition-colors">HR teams spend up to 50% of their time answering repetitive employee questions</a> — time that should go toward strategic work.</span>,
  },
  {
    icon: UserPlus,
    title: 'New hire onboarding creates a bottleneck every time',
    body: 'Every new cohort generates the same flood of questions about systems access, benefits enrollment deadlines, expense policies, and first-week logistics. HR answers them individually — while everything else waits.',
  },
  {
    icon: MoonStar,
    title: 'After-hours employee requests go unanswered until morning',
    body: 'An employee needs to know their parental leave entitlement before a Friday evening call with family. HR is offline. The question festers — and trust erodes when people feel they cannot get straightforward answers quickly.',
  },
];

const steps = [
  {
    step: '01',
    title: 'Train on your HR documentation',
    description:
      'Upload your employee handbook, benefits guides, onboarding materials, and policy documents. Your chatbot learns your policies and answers accurately from your approved content only.',
  },
  {
    step: '02',
    title: 'Configure escalation rules',
    description:
      'Define which questions the chatbot handles autonomously and which route to a human — grievances, sensitive personal matters, and anything requiring HR judgement escalate immediately with full context.',
  },
  {
    step: '03',
    title: 'Deploy to your team',
    description:
      'Embed on your intranet, HR portal, or internal tools. Employees get instant, accurate answers. Your HR team gets their time back.',
  },
];

const features = [
  {
    icon: BookOpen,
    name: 'Policy FAQ automation',
    description:
      'Answer leave policies, remote work rules, expense limits, and code of conduct questions automatically — drawn from your approved HR documents.',
  },
  {
    icon: UserPlus,
    name: 'New hire onboarding support',
    description:
      'Walk new employees through first-week checklists, systems setup, benefits enrollment windows, and probation period details without any HR involvement.',
  },
  {
    icon: HeartHandshake,
    name: 'Benefits and compensation FAQ',
    description:
      'Answer health insurance, pension contributions, bonus structure, and open enrollment questions instantly — reducing inbound queries at the busiest times of year.',
  },
  {
    icon: Clock,
    name: '24/7 employee self-service',
    description:
      'Employees get answers at 10pm the same as at 10am. Reduce the queue that builds up overnight and over weekends.',
  },
  {
    icon: UserCheck,
    name: 'Smart HR escalation',
    description:
      'Sensitive topics — disciplinary matters, mental health queries, personal grievances — route straight to your HR team with the full conversation context already attached.',
  },
  {
    icon: FileText,
    name: 'Document request handling',
    description:
      'Guide employees to the right form, template, or policy document without HR needing to locate and forward it manually every time.',
  },
];

const verticals = [
  {
    icon: UserPlus,
    title: 'Onboarding',
    description:
      'Give every new hire a consistent, instant source of truth for first-week questions — without burdening your HR team.',
  },
  {
    icon: HeartHandshake,
    title: 'Benefits Administration',
    description:
      'Handle open enrollment queries, plan comparisons, and deadline reminders automatically during your busiest HR periods.',
  },
  {
    icon: ShieldCheck,
    title: 'Policy Compliance',
    description:
      'Ensure employees can find the right policy instantly, reducing compliance risk from people making uninformed decisions.',
  },
  {
    icon: Users,
    title: 'Employee Relations',
    description:
      'Free up your HR business partners to focus on complex people issues while the chatbot handles routine informational queries.',
  },
];

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ChatbotForHRPage() {
  return (
    <PageBackground>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <Header />

      <main id="main-content">

        {/* ── Hero ────────────────────────────────────────────────────────────── */}
        <section className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center container mx-auto px-4 py-16 text-center">
          <Badge className="mb-6">AI Chatbot for HR Departments</Badge>

          <H1 className="max-w-4xl mb-6">
            Your employees ask the same HR questions on repeat.{' '}
            <span className="text-primary-500">Stop answering them manually.</span>
          </H1>

          <p className="mx-auto max-w-2xl text-lg text-secondary-600 dark:text-secondary-400 mb-10">
            VocUI trains on your employee handbook, benefits guides, and onboarding docs — so your
            HR team stops fielding repeat policy questions and starts doing the work that actually
            requires a human.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="xl" asChild>
              <Link href="/signup">
                Build Your HR Chatbot Free
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button size="xl" variant="outline" asChild>
              <Link href="/pricing">See Pricing</Link>
            </Button>
          </div>

          <p className="text-sm text-secondary-500 dark:text-secondary-400">
            Answers employee questions 24/7 &middot; Trained only on your HR content &middot; GDPR-compliant
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
            <Badge variant="outline" className="mb-4">The HR bandwidth problem</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              HR teams are too stretched to spend their day on informational queries
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              It is not that employees ask bad questions. It is that answering the same questions
              individually — every day, for every new hire, across every team — consumes time that
              HR cannot afford to lose.
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
              Everything an HR chatbot actually needs
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              Built for HR teams — not a generic FAQ widget. Every feature is designed to reduce
              the volume of repeat queries landing in your inbox.
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
              <Badge variant="outline" className="mb-8">From an HR team using VocUI</Badge>
              <blockquote className="text-2xl font-semibold text-secondary-900 dark:text-secondary-100 leading-snug mb-6">
                &ldquo;We were spending the first two hours of every Monday clearing a weekend backlog
                of policy questions. VocUI handles those now. Our HR team finally has the headspace
                to work on things that actually need human judgement.&rdquo;
              </blockquote>
              <p className="text-secondary-500 dark:text-secondary-400 text-sm">
                S.K. &mdash; HR Manager, Mid-Size Technology Company
              </p>
            </div>
          </div>
        </section>

        {/* ── Who It's For ────────────────────────────────────────────────────── */}
        <section className="container mx-auto px-4 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">Who it&apos;s for</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              For HR teams that want to focus on people, not paperwork
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              If your HR team spends more time answering informational questions than solving real
              people problems, VocUI frees up the bandwidth that matters.
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
                { label: 'Chatbot for Recruiters', href: '/chatbot-for-recruiters', description: 'Job FAQ and candidate intake automation for recruitment firms.' },
                { label: 'Chatbot for IT Support Teams', href: '/chatbot-for-it-support', description: 'Ticket deflection and troubleshooting FAQ for IT teams.' },
                { label: 'Chatbot for SaaS Companies', href: '/chatbot-for-saas', description: 'Product FAQ and trial lead capture for SaaS businesses.' },
                { label: 'Chatbot for Marketing Agencies', href: '/chatbot-for-marketing-agencies', description: 'Service FAQ and proposal lead capture for marketing agencies.' },
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
                Your HR team&apos;s time is too valuable for repeat policy questions
              </h2>
              <p className="text-lg text-white/80 mb-2 max-w-xl mx-auto">
                Give employees instant answers and let your HR team focus on the work that genuinely requires their expertise.
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
                    Build Your HR Chatbot Free
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
