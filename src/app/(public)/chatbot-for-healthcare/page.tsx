import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { H1 } from '@/components/ui/heading';
import { Header } from '@/components/layout';
import { Footer } from '@/components/ui/footer';
import { PageBackground } from '@/components/ui/page-background';
import type { ReactNode, ElementType } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Phone,
  Clock,
  CalendarX,
  BookOpen,
  CalendarCheck,
  ClipboardList,
  CreditCard,
  UserCheck,
  ShieldCheck,
  Stethoscope,
  Smile,
  Activity,
  Brain,
} from 'lucide-react';

// ─── Metadata ──────────────────────────────────────────────────────────────────

export function generateMetadata(): Metadata {
  return {
    title: 'AI Chatbot for Healthcare & Clinics | Patient FAQ & Booking | VocUI',
    description:
      "Automate patient FAQ responses, appointment booking, and after-hours inquiries with an AI chatbot trained on your clinic's own content. GDPR-compliant.",
    keywords: [
      'AI chatbot for healthcare',
      'clinic chatbot',
      'patient FAQ chatbot',
      'medical appointment booking chatbot',
      'healthcare AI chatbot',
    ],
    openGraph: {
      title: 'AI Chatbot for Healthcare & Clinics | Patient FAQ & Booking | VocUI',
      description:
        "Automate patient FAQ responses, appointment booking, and after-hours inquiries with an AI chatbot trained on your clinic's own content. GDPR-compliant.",
      url: 'https://vocui.com/chatbot-for-healthcare',
      siteName: 'VocUI',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'AI Chatbot for Healthcare & Clinics | Patient FAQ & Booking | VocUI',
      description:
        "Automate patient FAQ responses, appointment booking, and after-hours inquiries with an AI chatbot trained on your clinic's own content. GDPR-compliant.",
    },
    alternates: {
      canonical: 'https://vocui.com/chatbot-for-healthcare',
    },
    robots: { index: true, follow: true },
  };
}

// ─── Structured Data ───────────────────────────────────────────────────────────

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'VocUI — AI Chatbot for Healthcare',
  applicationCategory: 'HealthApplication',
  operatingSystem: 'Web',
  description:
    "AI chatbot that automates patient FAQ responses, appointment booking, and after-hours inquiries — trained on your clinic's own content.",
  url: 'https://vocui.com/chatbot-for-healthcare',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    description: 'Free plan available',
  },
  featureList: [
    'Clinic-specific knowledge training',
    '24/7 appointment booking',
    'Pre-visit preparation answers',
    'Insurance and billing FAQs',
    'Staff handoff for clinical queries',
    'GDPR-compliant data handling',
  ],
};

// ─── Data ──────────────────────────────────────────────────────────────────────

const trustSignals = [
  'Answers patient questions 24/7',
  'Connects to your booking calendar',
  'GDPR-compliant data handling',
];

const painPoints: Array<{ icon: ElementType; title: string; body: ReactNode }> = [
  {
    icon: Phone,
    title: '30% of your calls are questions your website already answers',
    body: <span>Insurance accepted, parking, hours, services offered — your staff answers these dozens of times a day. <a href="https://411locals.us/small-business-owners-dont-answer-62-of-phone-calls/" target="_blank" rel="noopener noreferrer" className="underline decoration-dotted hover:text-primary-500 transition-colors">Small businesses miss 62% of inbound calls on average</a> — it&apos;s not a staffing problem, it&apos;s an automation problem.</span>,
  },
  {
    icon: Clock,
    title: 'Patients research healthcare options outside business hours',
    body: <span>A patient looks for a new GP at 8pm. They find your clinic, can&apos;t get their question answered, and book elsewhere in the morning. <a href="https://livechatai.com/blog/customer-support-response-time-statistics" target="_blank" rel="noopener noreferrer" className="underline decoration-dotted hover:text-primary-500 transition-colors">Nearly 60% of people expect a reply within 10 minutes</a> — a response the next day is too late.</span>,
  },
  {
    icon: CalendarX,
    title: 'Missed bookings and no-shows are costly',
    body: 'Patients who can\'t get quick answers about what to bring, how to prepare, or what to expect are more likely to cancel or not show up.',
  },
];

const steps = [
  {
    step: '01',
    title: 'Train on your clinic\'s content',
    description:
      'Add your services page, accepted insurance, FAQs, preparation guides, and appointment policies. Your chatbot learns your clinic, not generic healthcare information.',
  },
  {
    step: '02',
    title: 'Connect your booking calendar',
    description:
      'Integrate with Easy!Appointments to let patients check availability and book directly from the chat window — at any hour.',
  },
  {
    step: '03',
    title: 'Go live on your website',
    description:
      'Embed with one line of code. Your patient chatbot handles FAQs, pre-visit preparation, and booking — freeing your front desk for in-person care.',
  },
];

const features = [
  {
    icon: BookOpen,
    name: 'Clinic-specific knowledge',
    description:
      'Trained on your services, pricing, insurance, and policies — not generic medical information.',
  },
  {
    icon: CalendarCheck,
    name: '24/7 appointment booking',
    description:
      'Let patients check availability and book appointments directly in chat, any time of day.',
  },
  {
    icon: ClipboardList,
    name: 'Pre-visit preparation answers',
    description:
      'Answer \'what should I bring?\', \'how do I prepare?\', and \'what happens at my appointment?\' automatically.',
  },
  {
    icon: CreditCard,
    name: 'Insurance and billing FAQs',
    description:
      'Handle insurance coverage questions, payment options, and billing inquiries from your approved content.',
  },
  {
    icon: UserCheck,
    name: 'Staff handoff for clinical queries',
    description:
      'Clinical questions that require a professional are immediately escalated. Your chatbot handles admin; your staff handles care.',
  },
  {
    icon: ShieldCheck,
    name: 'GDPR-compliant',
    description:
      'Visitor data is handled per GDPR. We do not use patient conversation data for AI model training.',
  },
];

const verticals = [
  {
    icon: Stethoscope,
    title: 'General Practice & GP Clinics',
    description:
      'Handle new patient registration questions, service FAQs, and appointment booking automatically.',
  },
  {
    icon: Smile,
    title: 'Dental Practices',
    description:
      'Answer treatment FAQs, insurance questions, and pricing — and book appointments at any hour.',
  },
  {
    icon: Activity,
    title: 'Allied Health & Physiotherapy',
    description:
      'Explain your services, answer referral questions, and let patients self-book their first session.',
  },
  {
    icon: Brain,
    title: 'Mental Health & Counselling',
    description:
      'Handle sensitive initial inquiries with warmth. Provide service information and book discovery calls — without staff involvement.',
  },
];

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ChatbotForHealthcarePage() {
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
          <Badge className="mb-6">AI Chatbot for Healthcare</Badge>

          <H1 className="max-w-4xl mb-6">
            Your patients have questions at 10pm.{' '}
            <span className="text-primary-500">Your chatbot should be there to answer them.</span>
          </H1>

          <p className="mx-auto max-w-2xl text-lg text-secondary-600 dark:text-secondary-400 mb-10">
            VocUI trains on your clinic&apos;s services, policies, and FAQs — so patients get accurate
            answers around the clock without staff involvement.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="xl" asChild>
              <Link href="/signup">
                Build Your Healthcare Chatbot Free
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button size="xl" variant="outline" asChild>
              <Link href="/pricing">See Pricing</Link>
            </Button>
          </div>

          <p className="text-sm text-secondary-500 dark:text-secondary-400">
            Answers patient questions 24/7 &middot; Connects to your booking calendar &middot; GDPR-compliant
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
            <Badge variant="outline" className="mb-4">The front desk problem</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              Your front desk is answering the same patient questions on repeat
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              Not because your staff is inefficient. Because routine patient questions have no
              automated home — so every one of them lands on the people you need focused on care.
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
                From your clinic&apos;s content to a live patient chatbot in under an hour
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
              Everything a patient-facing chatbot actually needs
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              Built for clinical environments — not a generic chatbot. Every feature is designed to
              reduce front desk load while keeping clinical oversight intact.
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
              <Badge variant="outline" className="mb-8">From a clinic using VocUI</Badge>
              <blockquote className="text-2xl font-semibold text-secondary-900 dark:text-secondary-100 leading-snug mb-6">
                &ldquo;The booking feature alone paid for the subscription. We went from 12 missed
                after-hours calls per week to zero.&rdquo;
              </blockquote>
              <p className="text-secondary-500 dark:text-secondary-400 text-sm">
                J.D. &mdash; Practice Manager, Dental Clinic
              </p>
            </div>
          </div>
        </section>

        {/* ── Who It's For ────────────────────────────────────────────────────── */}
        <section className="container mx-auto px-4 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">Who it&apos;s for</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              For every clinic that wants to do more with the same team
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              If your front desk is spending time on questions a chatbot can handle, VocUI pays for
              itself in the first month — often in the first week.
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
                { label: 'Chatbot for Chiropractors', href: '/chatbot-for-chiropractors', description: 'New patient intake, treatment FAQ, and appointment booking.' },
                { label: 'Chatbot for Optometrists', href: '/chatbot-for-optometrists', description: 'Eye exam booking and product FAQ automation.' },
                { label: 'Chatbot for Pharmacies', href: '/chatbot-for-pharmacies', description: 'Prescription FAQ and refill support for pharmacy customers.' },
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
                Your front desk team should be focused on patients, not the phone
              </h2>
              <p className="text-lg text-white/80 mb-2 max-w-xl mx-auto">
                Build a chatbot that handles the questions so your staff can focus on the care.
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
                    Build Your Healthcare Chatbot Free
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
