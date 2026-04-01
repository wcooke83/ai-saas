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
  FileText,
  UserCheck,
  ShieldCheck,
  Building,
  Heart,
  Scale,
  Globe,
} from 'lucide-react';

// ─── Metadata ──────────────────────────────────────────────────────────────────

export function generateMetadata(): Metadata {
  return {
    title: 'AI Chatbot for Government & Public Services | Services FAQ & Guidance | VocUI',
    description:
      'Let an AI chatbot handle eligibility questions, document guidance, and services FAQs for government and public sector organisations — 24/7. Reduce call centre volume.',
    keywords: [
      'AI chatbot for government',
      'public services chatbot',
      'government FAQ chatbot',
      'citizen services automation',
      'document request guidance chatbot',
    ],
    openGraph: {
      title: 'AI Chatbot for Government & Public Services | Services FAQ & Guidance | VocUI',
      description:
        'Let an AI chatbot handle eligibility questions, document guidance, and services FAQs for government and public sector organisations — 24/7. Reduce call centre volume.',
      url: 'https://vocui.com/chatbot-for-government',
      siteName: 'VocUI',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'AI Chatbot for Government & Public Services | Services FAQ & Guidance | VocUI',
      description:
        'Let an AI chatbot handle eligibility questions, document guidance, and services FAQs for government and public sector organisations — 24/7. Reduce call centre volume.',
    },
    alternates: {
      canonical: 'https://vocui.com/chatbot-for-government',
    },
    robots: { index: true, follow: true },
  };
}

// ─── Structured Data ───────────────────────────────────────────────────────────

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'VocUI — AI Chatbot for Government & Public Services',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  description:
    'AI chatbot that handles eligibility questions, document request guidance, and services FAQs for government and public sector organisations — 24/7, trained on your approved content.',
  url: 'https://vocui.com/chatbot-for-government',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    description: 'Free plan available',
  },
  featureList: [
    'Knowledge base trained on your approved service content',
    'Eligibility and process FAQ automation',
    'Document requirements guidance',
    '24/7 out-of-hours availability',
    'Staff escalation with full conversation context',
    'GDPR-compliant data handling',
  ],
};

// ─── Data ──────────────────────────────────────────────────────────────────────

const trustSignals = [
  'Answers citizen questions 24/7',
  'Trained only on your approved content',
  'GDPR-compliant data handling',
];

const painPoints: Array<{ icon: ElementType; title: string; body: ReactNode }> = [
  {
    icon: Phone,
    title: 'Same eligibility and process questions overwhelming call centres',
    body: 'Am I eligible for this service? What documents do I need? How long will it take? Call centre staff answer the same questions thousands of times a month — diverting capacity from the complex cases that genuinely need human expertise.',
  },
  {
    icon: MoonStar,
    title: 'Citizens researching services outside office hours with no guidance available',
    body: <span>People often discover they need a public service in the evening or at weekends — when offices are closed and websites don&apos;t answer follow-up questions. Without instant guidance, they wait, call back, and the queue grows. <a href="https://www.salesloft.com/resources/guides/conversational-ai-marketing-trends-report" target="_blank" rel="noopener noreferrer" className="underline decoration-dotted hover:text-primary-500 transition-colors">41% of all enquiries arrive outside standard business hours.</a></span>,
  },
  {
    icon: Clock,
    title: 'Incomplete document submissions causing repeated contact cycles',
    body: "When citizens don't know exactly which documents to submit, applications come back incomplete. Each rejection triggers another round of calls, letters, and staff time — a cycle an AI chatbot can break before it starts.",
  },
];

const steps = [
  {
    step: '01',
    title: 'Upload your service documentation',
    description:
      'Add eligibility criteria, process guides, document checklists, and service FAQs. Your chatbot learns the details of each service and answers citizens accurately from your approved content.',
  },
  {
    step: '02',
    title: 'Configure citizen guidance flows',
    description:
      'Set up step-by-step guidance for common journeys — benefit applications, planning enquiries, or licence renewals. Define when questions should escalate to a staff member or specialist team.',
  },
  {
    step: '03',
    title: 'Deploy on your public-facing channels',
    description:
      'Embed on your website or citizen portal in minutes. Residents get instant, accurate answers at any hour; complex cases are routed to the right team with full context already captured.',
  },
];

const features = [
  {
    icon: BookOpen,
    name: 'Knowledge base trained on your content',
    description:
      'Your chatbot answers only from your approved service documentation — never invented or inaccurate information that could mislead citizens.',
  },
  {
    icon: FileText,
    name: 'Document requirements guidance',
    description:
      'Walk citizens through exactly which documents they need for each application — reducing incomplete submissions and the follow-up contact they generate.',
  },
  {
    icon: Clock,
    name: '24/7 out-of-hours availability',
    description:
      'Residents need answers when offices are closed. Your chatbot provides accurate service information at any time, reducing the backlog that builds overnight.',
  },
  {
    icon: UserCheck,
    name: 'Seamless staff escalation',
    description:
      'Complex or sensitive queries escalate immediately to the right team, with the full citizen conversation already captured so staff can pick up without asking them to repeat themselves.',
  },
  {
    icon: ShieldCheck,
    name: 'GDPR-compliant and security-conscious',
    description:
      'Built for public sector data standards. No third-party data sharing, full audit trail, and configurable data retention to meet your compliance requirements.',
  },
  {
    icon: Globe,
    name: 'Consistent, accessible information delivery',
    description:
      'Every citizen gets the same accurate, consistent answer regardless of which channel they use or what time they ask — removing variability from frontline service delivery.',
  },
];

const verticals = [
  {
    icon: Building,
    title: 'Local Council Services',
    description:
      'Answer bin collection schedules, planning enquiries, council tax, and housing queries without tying up your contact centre.',
  },
  {
    icon: Heart,
    title: 'Public Health Information',
    description:
      'Share vaccination schedules, screening programme information, and health service signposting accurately and at scale.',
  },
  {
    icon: Scale,
    title: 'Planning & Licensing',
    description:
      'Guide residents through planning application requirements, licensing processes, and consultation periods before they submit.',
  },
  {
    icon: FileText,
    title: 'Benefits & Social Services',
    description:
      'Answer eligibility, application process, and document requirement questions for benefits programmes — reducing call volume and incomplete claims.',
  },
];

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ChatbotForGovernmentPage() {
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
          <Badge className="mb-6">AI Chatbot for Government & Public Services</Badge>

          <H1 className="max-w-4xl mb-6">
            Citizens ask the same eligibility and process questions every day.{' '}
            <span className="text-primary-500">Your chatbot can answer them at scale.</span>
          </H1>

          <p className="mx-auto max-w-2xl text-lg text-secondary-600 dark:text-secondary-400 mb-10">
            VocUI trains on your service documentation, eligibility criteria, and document checklists
            — so your contact centre handles fewer routine calls and your citizens get answers at any hour.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="xl" asChild>
              <Link href="/signup">
                Build Your Public Services Chatbot Free
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button size="xl" variant="outline" asChild>
              <Link href="/pricing">See Pricing</Link>
            </Button>
          </div>

          <p className="text-sm text-secondary-500 dark:text-secondary-400">
            Answers citizen questions 24/7 &middot; Trained only on your approved content &middot; GDPR-compliant
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
            <Badge variant="outline" className="mb-4">The contact centre problem</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              Your staff are answering questions a chatbot could handle
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              Not because your team isn&apos;t capable — because routine eligibility and process
              questions consume the same hours that could be spent on the cases that genuinely
              need human judgement.
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
              Everything a public services chatbot actually needs
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              Built for public sector accuracy standards — not a generic widget. Every feature
              is designed to reduce contact volume while improving the citizen experience.
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
              <Badge variant="outline" className="mb-8">From a public sector organisation using VocUI</Badge>
              <blockquote className="text-2xl font-semibold text-secondary-900 dark:text-secondary-100 leading-snug mb-6">
                &ldquo;Our contact centre was spending a third of its call volume on basic eligibility questions. VocUI handles those instantly now — our advisers are free for the cases that actually need them.&rdquo;
              </blockquote>
              <p className="text-secondary-500 dark:text-secondary-400 text-sm">
                R.T. &mdash; Digital Services Lead, Local Authority
              </p>
            </div>
          </div>
        </section>

        {/* ── Who It's For ────────────────────────────────────────────────────── */}
        <section className="container mx-auto px-4 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">Who it&apos;s for</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              For public sector teams that want staff focused on complex casework
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              If your contact centre is answering the same eligibility and process questions every
              day, VocUI frees your team to focus on the cases that genuinely need human expertise.
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
                { label: 'Chatbot for Churches', href: '/chatbot-for-churches', description: 'Service times FAQ and event registration for faith communities.' },
                { label: 'Chatbot for Universities', href: '/chatbot-for-universities', description: 'Admissions FAQ and course inquiry support for higher education.' },
                { label: 'Chatbot for Healthcare', href: '/chatbot-for-healthcare', description: 'Patient FAQ, insurance questions, and appointment booking — 24/7.' },
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
                Your contact centre staff are too skilled for repeat FAQs
              </h2>
              <p className="text-lg text-white/80 mb-2 max-w-xl mx-auto">
                Automate routine eligibility and process questions so your team can focus on the complex casework only they can handle.
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
                    Build Your Public Services Chatbot Free
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
