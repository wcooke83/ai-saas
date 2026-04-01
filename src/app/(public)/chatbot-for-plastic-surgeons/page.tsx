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
  Clock,
  UserCheck,
  Filter,
  BookOpen,
  CalendarCheck,
  ShieldCheck,
  Star,
  MessageSquare,
  Award,
  Target,
  Smile,
  Activity,
} from 'lucide-react';

// ─── Metadata ──────────────────────────────────────────────────────────────────

export function generateMetadata(): Metadata {
  return {
    title: 'AI Chatbot for Plastic Surgeons & Cosmetic Clinics | Procedure FAQ & Booking | VocUI',
    description:
      'Stop answering the same pre-consultation questions. VocUI trains on your procedures, recovery guides, and pricing FAQs — so qualified prospects book consultations, not just ask questions.',
    keywords: [
      'AI chatbot for plastic surgeons',
      'cosmetic clinic chatbot',
      'procedure FAQ chatbot',
      'cosmetic surgery consultation booking',
      'plastic surgery chatbot',
    ],
    openGraph: {
      title: 'AI Chatbot for Plastic Surgeons & Cosmetic Clinics | Procedure FAQ & Booking | VocUI',
      description:
        'Stop answering the same pre-consultation questions. VocUI trains on your procedures, recovery guides, and pricing FAQs — so qualified prospects book consultations, not just ask questions.',
      url: 'https://vocui.com/chatbot-for-plastic-surgeons',
      siteName: 'VocUI',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'AI Chatbot for Plastic Surgeons & Cosmetic Clinics | Procedure FAQ & Booking | VocUI',
      description:
        'Stop answering the same pre-consultation questions. VocUI trains on your procedures, recovery guides, and pricing FAQs — so qualified prospects book consultations, not just ask questions.',
    },
    alternates: {
      canonical: 'https://vocui.com/chatbot-for-plastic-surgeons',
    },
    robots: { index: true, follow: true },
  };
}

// ─── Structured Data ───────────────────────────────────────────────────────────

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'VocUI — AI Chatbot for Plastic Surgeons & Cosmetic Clinics',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  description:
    'AI chatbot that handles procedure FAQs, recovery questions, and consultation booking for plastic surgery and cosmetic clinics.',
  url: 'https://vocui.com/chatbot-for-plastic-surgeons',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    description: 'Free plan available',
  },
  featureList: [
    'Procedure-specific knowledge training',
    '24/7 consultation booking',
    'Recovery timeline FAQs',
    'Pricing and finance options',
    'Lead qualification before consultation',
    'GDPR-compliant data handling',
  ],
};

// ─── Data ──────────────────────────────────────────────────────────────────────

const trustSignals = [
  'Handles procedure and recovery FAQs 24/7',
  'Books consultations directly from chat',
  'Qualifies leads before they reach your team',
];

const painPoints: Array<{ icon: ElementType; title: string; body: ReactNode }> = [
  {
    icon: BookOpen,
    title: 'Your staff fields the same procedure questions before every consultation',
    body: 'What is the recovery time for a rhinoplasty? Is the procedure painful? How long do results last? These questions have answers — answers your chatbot can give instantly, without staff involvement.',
  },
  {
    icon: Clock,
    title: 'Prospects research cosmetic procedures late at night',
    body: <span>Cosmetic surgery is a considered, personal decision. The research happens outside business hours. <a href="https://www.salesloft.com/resources/guides/conversational-ai-marketing-trends-report" target="_blank" rel="noopener noreferrer" className="underline decoration-dotted hover:text-primary-500 transition-colors">41% of all meetings are booked outside standard business hours</a> — a prospect who cannot get answers at 10pm moves on to a clinic that can provide them.</span>,
  },
  {
    icon: Filter,
    title: 'Unqualified leads are consuming surgeon and coordinator time',
    body: 'Not every inquiry leads to a viable consultation. A chatbot that asks the right screening questions ensures the leads that reach your team are worth their time.',
  },
];

const steps = [
  {
    step: '01',
    title: 'Train on your procedures and content',
    description:
      'Upload your procedure pages, recovery guides, before-and-after FAQ content, and pricing information. Your chatbot answers from your clinic\'s own materials — not generic medical content.',
  },
  {
    step: '02',
    title: 'Set lead qualification questions',
    description:
      'Define the screening questions your chatbot asks before encouraging a consultation booking — so your coordinators only speak with serious, informed prospects.',
  },
  {
    step: '03',
    title: 'Go live on your website',
    description:
      'Embed with one line of code. Your chatbot handles pre-consultation FAQs and books discovery appointments around the clock, freeing your team for high-value client interactions.',
  },
];

const features = [
  {
    icon: BookOpen,
    name: 'Procedure-specific knowledge',
    description:
      'Trained on your exact procedures, recovery timelines, and clinical approach — not generic cosmetic surgery information.',
  },
  {
    icon: CalendarCheck,
    name: '24/7 consultation booking',
    description:
      'Prospects can book an initial consultation directly from the chat window at any time of day.',
  },
  {
    icon: Filter,
    name: 'Built-in lead qualification',
    description:
      'Screen prospects with your preferred questions before they reach your coordinators — so every consultation starts with a qualified, informed lead.',
  },
  {
    icon: Star,
    name: 'Pricing and finance FAQs',
    description:
      'Answer questions about procedure costs, payment plans, and financing options from your approved content.',
  },
  {
    icon: UserCheck,
    name: 'Clinical handoff for medical queries',
    description:
      'Questions requiring clinical assessment are immediately escalated. Your chatbot handles pre-sales admin; your surgeons handle consultations.',
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
    icon: Smile,
    title: 'Cosmetic Surgery',
    description:
      'Handle rhinoplasty, breast augmentation, and facelift FAQs — and book consultations for serious prospects.',
  },
  {
    icon: Award,
    title: 'Non-Surgical Aesthetics',
    description:
      'Answer questions about fillers, Botox, and skin treatments — and convert interest into booked appointments.',
  },
  {
    icon: Activity,
    title: 'Hair Restoration',
    description:
      'Explain FUE, FUT, and PRP procedures, handle candidacy FAQs, and book hair restoration consultations.',
  },
  {
    icon: Target,
    title: 'Body Contouring',
    description:
      'Qualify and educate prospects on liposuction, tummy tucks, and non-surgical body contouring options.',
  },
];

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ChatbotForPlasticSurgeonsPage() {
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
          <Badge className="mb-6">AI Chatbot for Plastic Surgeons &amp; Cosmetic Clinics</Badge>

          <H1 className="max-w-4xl mb-6">
            Turn late-night procedure research into{' '}
            <span className="text-primary-500">booked consultations by morning.</span>
          </H1>

          <p className="mx-auto max-w-2xl text-lg text-secondary-600 dark:text-secondary-400 mb-10">
            VocUI trains on your procedures, recovery guides, and clinic FAQs — so prospects get
            accurate answers around the clock and your coordinators only speak with qualified leads.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="xl" asChild>
              <Link href="/signup">
                Build Your Cosmetic Clinic Chatbot Free
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button size="xl" variant="outline" asChild>
              <Link href="/pricing">See Pricing</Link>
            </Button>
          </div>

          <p className="text-sm text-secondary-500 dark:text-secondary-400">
            Procedure FAQs answered 24/7 &middot; Books consultations direct &middot; Qualifies leads before they reach your team
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
            <Badge variant="outline" className="mb-4">The pre-consultation problem</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              Your coordinators are answering the same questions before every consultation
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              Pre-consultation enquiries are predictable and repeatable. They have no business
              consuming your team&apos;s time when a chatbot can handle them at scale.
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
                From your procedure content to a live chatbot in under an hour
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
              Everything a cosmetic clinic chatbot actually needs
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              Built for high-consideration purchase environments. Every feature is designed to
              convert curious visitors into booked consultations.
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
              <Badge variant="outline" className="mb-8">From a cosmetic clinic using VocUI</Badge>
              <blockquote className="text-2xl font-semibold text-secondary-900 dark:text-secondary-100 leading-snug mb-6">
                &ldquo;Our coordinators used to spend the first 20 minutes of every consultation
                re-explaining things the patient could have read on our site. Now they arrive
                informed and ready to make a decision.&rdquo;
              </blockquote>
              <p className="text-secondary-500 dark:text-secondary-400 text-sm">
                L.V. &mdash; Patient Coordinator, Boutique Cosmetic Surgery Clinic
              </p>
            </div>
          </div>
        </section>

        {/* ── Who It's For ────────────────────────────────────────────────────── */}
        <section className="container mx-auto px-4 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">Who it&apos;s for</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              For every cosmetic practice that wants better-qualified consultations
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              Whether you perform surgical or non-surgical procedures, VocUI ensures prospects
              arrive at consultations educated, serious, and ready to move forward.
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
                { label: 'Chatbot for Dentists', href: '/chatbot-for-dentists', description: 'Appointment booking, insurance FAQ, and patient preparation guides.' },
                { label: 'Chatbot for Therapists', href: '/chatbot-for-therapists', description: 'Service FAQ and appointment scheduling for therapy practices.' },
                { label: 'Chatbot for Spas', href: '/chatbot-for-spas', description: 'Treatment booking and pricing FAQ for day spas and wellness centres.' },
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
                Your surgeon&apos;s time is your most valuable asset — stop spending it on pre-sales FAQ
              </h2>
              <p className="text-lg text-white/80 mb-2 max-w-xl mx-auto">
                Build a chatbot that educates, qualifies, and books — so your team focuses on
                consultations that convert.
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
                    Build Your Cosmetic Clinic Chatbot Free
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
