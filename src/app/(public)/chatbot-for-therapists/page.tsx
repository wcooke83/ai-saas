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
  DollarSign,
  BookOpen,
  CalendarCheck,
  ShieldCheck,
  UserCheck,
  MessageSquare,
  Heart,
  Brain,
  Users,
  Star,
  Smile,
} from 'lucide-react';

// ─── Metadata ──────────────────────────────────────────────────────────────────

export function generateMetadata(): Metadata {
  return {
    title: 'AI Chatbot for Therapists & Counsellors | FAQ & Appointment Scheduling | VocUI',
    description:
      'Give prospective clients immediate, compassionate answers about your therapy services — any hour of the day. Handle appointment scheduling and FAQs without adding admin load.',
    keywords: [
      'AI chatbot for therapists',
      'counselling chatbot',
      'therapy appointment scheduling chatbot',
      'mental health chatbot',
      'therapist FAQ automation',
    ],
    openGraph: {
      title: 'AI Chatbot for Therapists & Counsellors | FAQ & Appointment Scheduling | VocUI',
      description:
        'Give prospective clients immediate, compassionate answers about your therapy services — any hour of the day. Handle appointment scheduling and FAQs without adding admin load.',
      url: 'https://vocui.com/chatbot-for-therapists',
      siteName: 'VocUI',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'AI Chatbot for Therapists & Counsellors | FAQ & Appointment Scheduling | VocUI',
      description:
        'Give prospective clients immediate, compassionate answers about your therapy services — any hour of the day. Handle appointment scheduling and FAQs without adding admin load.',
    },
    alternates: {
      canonical: 'https://vocui.com/chatbot-for-therapists',
    },
    robots: { index: true, follow: true },
  };
}

// ─── Structured Data ───────────────────────────────────────────────────────────

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'VocUI — AI Chatbot for Therapists & Counsellors',
  applicationCategory: 'HealthApplication',
  operatingSystem: 'Web',
  description:
    'AI chatbot that handles client FAQ, appointment scheduling, and after-hours inquiries for therapy and counselling practices.',
  url: 'https://vocui.com/chatbot-for-therapists',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    description: 'Free plan available',
  },
  featureList: [
    'Practice-specific knowledge training',
    '24/7 appointment scheduling',
    'Sensitive inquiry handling',
    'Therapy modality FAQs',
    'Therapist handoff for clinical queries',
    'GDPR-compliant data handling',
  ],
};

// ─── Data ──────────────────────────────────────────────────────────────────────

const trustSignals = [
  'Handles sensitive initial inquiries with care',
  'Connects to your scheduling calendar',
  'GDPR-compliant data handling',
];

const painPoints: Array<{ icon: ElementType; title: string; body: ReactNode }> = [
  {
    icon: Phone,
    title: 'Sensitive first contact questions are arriving on your personal time',
    body: 'Prospective clients often reach out in distress — evenings, weekends, late at night. Every unanswered message is a missed opportunity to help someone who was ready to take the first step.',
  },
  {
    icon: Clock,
    title: 'People in distress do not wait for business hours to seek help',
    body: <span>A person researching therapy at midnight is making a real decision. <a href="https://www.zocdoc.com/resources/blog/article/2024-what-patients-want/" target="_blank" rel="noopener noreferrer" className="underline decoration-dotted hover:text-primary-500 transition-colors">Nearly half of all healthcare appointments are booked after hours</a> — if your practice cannot give them a path to book, they will find one that can.</span>,
  },
  {
    icon: DollarSign,
    title: 'Admin time is eating into your billable therapy hours',
    body: 'Every hour spent answering the same questions about session format, fees, and availability is an hour not spent doing the work you trained for.',
  },
];

const steps = [
  {
    step: '01',
    title: 'Train on your practice content',
    description:
      'Upload your service pages, modality descriptions, fee structure, availability policies, and FAQs. Your chatbot learns your practice — and communicates with the warmth you set.',
  },
  {
    step: '02',
    title: 'Set your tone and boundaries',
    description:
      'Define how your chatbot greets prospective clients, what it will and will not answer, and when it hands off to you. Clinical questions and crisis situations are always escalated.',
  },
  {
    step: '03',
    title: 'Go live on your website',
    description:
      'One embed snippet. Your chatbot handles initial inquiries, practice FAQs, and appointment scheduling — so you start your day focused on clients, not a full inbox.',
  },
];

const features = [
  {
    icon: BookOpen,
    name: 'Practice-specific knowledge',
    description:
      'Trained on your services, therapeutic modalities, fees, and policies — not generic mental health information.',
  },
  {
    icon: CalendarCheck,
    name: '24/7 appointment scheduling',
    description:
      'Let prospective clients book a discovery call or first session directly in chat, at any hour.',
  },
  {
    icon: Heart,
    name: 'Warm, sensitive tone',
    description:
      'Set a tone that reflects your practice values. Your chatbot responds with the same care and calm you would want your first contact to convey.',
  },
  {
    icon: UserCheck,
    name: 'Clinical handoff built in',
    description:
      'Any question touching clinical assessment, crisis support, or medication is immediately flagged for a human. Your chatbot handles admin; you handle care.',
  },
  {
    icon: MessageSquare,
    name: 'Therapy modality FAQs',
    description:
      'Explain CBT, DBT, EMDR, couples work, and any modality you offer — so clients arrive at their first session with informed expectations.',
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
    icon: Brain,
    title: 'CBT & Talk Therapy',
    description:
      'Answer questions about how CBT works, session frequency, and what to expect — so clients arrive prepared.',
  },
  {
    icon: Heart,
    title: 'Couples Counselling',
    description:
      'Handle sensitive couples inquiry questions with care and book joint sessions directly from chat.',
  },
  {
    icon: Smile,
    title: 'Child & Adolescent Therapy',
    description:
      'Answer parent questions about your approach, age suitability, and parental involvement — confidently and consistently.',
  },
  {
    icon: Users,
    title: 'Online Therapy Practices',
    description:
      'For fully remote practices, your chatbot becomes the first impression. Make it count with clear, responsive service information.',
  },
];

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ChatbotForTherapistsPage() {
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
          <Badge className="mb-6">AI Chatbot for Therapists &amp; Counsellors</Badge>

          <H1 className="max-w-4xl mb-6">
            Someone reaches out at midnight.{' '}
            <span className="text-primary-500">Your practice should be ready to respond.</span>
          </H1>

          <p className="mx-auto max-w-2xl text-lg text-secondary-600 dark:text-secondary-400 mb-10">
            VocUI trains on your practice content and handles initial inquiries, service FAQs, and
            appointment scheduling — so prospective clients always get a warm, informed response.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="xl" asChild>
              <Link href="/signup">
                Build Your Therapy Practice Chatbot Free
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button size="xl" variant="outline" asChild>
              <Link href="/pricing">See Pricing</Link>
            </Button>
          </div>

          <p className="text-sm text-secondary-500 dark:text-secondary-400">
            Handles sensitive inquiries with care &middot; Connects to your calendar &middot; GDPR-compliant
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
            <Badge variant="outline" className="mb-4">The availability problem</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              Prospective clients are reaching out when you cannot respond
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              The moment someone decides to seek help is rarely during business hours. If your
              practice cannot meet them at that moment, you lose them — and they lose momentum.
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
                From your practice content to a live client-facing chatbot in under an hour
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
              Everything a therapy practice chatbot actually needs
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              Designed for the sensitivity of mental health practice — not a generic support bot.
              Clinical boundaries are built in by design.
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
              <Badge variant="outline" className="mb-8">From a therapy practice using VocUI</Badge>
              <blockquote className="text-2xl font-semibold text-secondary-900 dark:text-secondary-100 leading-snug mb-6">
                &ldquo;I used to come back from sessions to three unread messages asking the same
                questions about my fees and availability. Now my chatbot handles all of that, and
                new clients arrive already knowing how I work.&rdquo;
              </blockquote>
              <p className="text-secondary-500 dark:text-secondary-400 text-sm">
                S.M. &mdash; Integrative Therapist, Private Practice
              </p>
            </div>
          </div>
        </section>

        {/* ── Who It's For ────────────────────────────────────────────────────── */}
        <section className="container mx-auto px-4 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">Who it&apos;s for</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              For every counselling practice that wants to help more people, with less admin
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              Whether you are a solo therapist or a multi-practitioner clinic, VocUI gives every
              prospective client a consistent, caring first response — any time of day.
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
                { label: 'Chatbot for Plastic Surgeons', href: '/chatbot-for-plastic-surgeons', description: 'Procedure FAQ and consultation booking for aesthetic practices.' },
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
                Your clients deserve a response the moment they reach out
              </h2>
              <p className="text-lg text-white/80 mb-2 max-w-xl mx-auto">
                Give every prospective client a warm, informed first contact — even when you are in
                session or off the clock.
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
                    Build Your Therapy Practice Chatbot Free
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
