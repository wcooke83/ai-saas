import type { Metadata } from 'next';
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
  MessageSquare,
  Zap,
  FileText,
  Phone,
  ShieldCheck,
  Headphones,
  Calendar,
  Wrench,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';

// ─── Metadata ──────────────────────────────────────────────────────────────────

export function generateMetadata(): Metadata {
  return {
    title: 'SMS Chatbot via Twilio | VocUI',
    description:
      'Add AI-powered SMS support to your Twilio number. VocUI answers inbound texts instantly from your knowledge base — no code required.',
    keywords: [
      'SMS chatbot Twilio',
      'AI SMS chatbot',
      'Twilio SMS bot',
      'SMS support automation',
      'text message chatbot',
      'AI reply to SMS',
    ],
    openGraph: {
      title: 'SMS Chatbot via Twilio | VocUI',
      description:
        'Add AI-powered SMS support to your Twilio number. VocUI answers inbound texts instantly from your knowledge base — no code required.',
      url: 'https://vocui.com/chatbot-for-sms',
      siteName: 'VocUI',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'SMS Chatbot via Twilio | VocUI',
      description:
        'Add AI-powered SMS support to your Twilio number. VocUI answers inbound texts instantly from your knowledge base — no code required.',
    },
    alternates: {
      canonical: 'https://vocui.com/chatbot-for-sms',
    },
    robots: { index: true, follow: true },
  };
}

// ─── Structured Data ───────────────────────────────────────────────────────────

const faqItems = [
  {
    question: 'Do I need a Twilio account to use this?',
    answer:
      'Yes. VocUI connects to your existing Twilio account and phone number. You bring the Twilio number — VocUI provides the AI that answers inbound texts from your knowledge base.',
  },
  {
    question: 'What is A2P 10DLC and do I need to register?',
    answer:
      'A2P 10DLC (Application-to-Person 10-Digit Long Code) is the US carrier registration standard for business SMS. If you\'re sending texts to US numbers from a 10-digit long code, you are required to register your brand and campaign with The Campaign Registry (TCR) before sending. Twilio handles this registration process. VocUI\'s replies are considered A2P traffic, so US-based businesses must complete 10DLC registration to avoid message filtering.',
  },
  {
    question: 'Can I use a toll-free number instead of a 10DLC number?',
    answer:
      'Yes. Toll-free numbers (TFNs) have a separate verification process and are a common alternative to 10DLC for many SMS use cases. Short codes are also supported. VocUI works with any Twilio number type — long code, toll-free, or short code.',
  },
  {
    question: 'Will the bot reply to every inbound text automatically?',
    answer:
      'Yes. Once configured, VocUI intercepts every inbound SMS on your Twilio number and sends an AI-generated reply sourced from your knowledge base. You can configure keywords that trigger human handoff.',
  },
  {
    question: 'Can the same knowledge base power my website chatbot too?',
    answer:
      'Yes. One VocUI knowledge base powers all your channels — SMS, your website widget, Facebook Messenger, Instagram DMs, and Slack. Update your content once and every channel reflects the change.',
  },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      name: 'VocUI SMS Chatbot via Twilio',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      description:
        'Add AI-powered SMS support to your Twilio number. VocUI answers inbound texts instantly from your knowledge base — no code required.',
      url: 'https://vocui.com/chatbot-for-sms',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
        description: 'Free plan available',
      },
      featureList: [
        'Twilio SMS integration',
        'Knowledge base powered replies',
        '24/7 automated text responses',
        'A2P 10DLC compatible',
        'Supports long code, toll-free, and short code numbers',
        'Human handoff triggers',
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: faqItems.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    },
  ],
};

// ─── Data ──────────────────────────────────────────────────────────────────────

const trustSignals = [
  'Bring your own Twilio number',
  'No code required to connect',
  'Instant replies from your knowledge base',
  'A2P 10DLC compatible for US businesses',
];

const painPoints = [
  {
    icon: Clock,
    title: 'Customers text you. You reply hours later.',
    body: 'Text has a 98% open rate and a sub-3-minute average response expectation. When your team can\'t keep up, customers don\'t wait — they text a competitor who does reply.',
  },
  {
    icon: MessageSquare,
    title: 'Support texts and sales texts get the same slow treatment',
    body: 'Whether it\'s "What are your hours?" or "Is my appointment confirmed?", every inbound text lands in the same queue. The answers are simple. The delay is not.',
  },
  {
    icon: Phone,
    title: 'Your Twilio number sits idle between outbound campaigns',
    body: 'You use Twilio to send appointment reminders and confirmations. But when customers text back with questions, there\'s no automation in place — just a number that rings into silence.',
  },
];

const steps = [
  {
    step: '01',
    title: 'Connect your Twilio number',
    description:
      'Enter your Twilio account credentials and select the phone number you want to power with AI. VocUI configures the webhook automatically.',
  },
  {
    step: '02',
    title: 'Train on your content',
    description:
      'Upload FAQs, service descriptions, pricing, and policies. VocUI builds a knowledge base the bot pulls answers from directly.',
  },
  {
    step: '03',
    title: 'Reply to every inbound text instantly',
    description:
      'Every text your number receives gets an immediate AI reply sourced from your knowledge base. Human handoff triggers available.',
  },
];

const features = [
  {
    icon: Zap,
    name: 'Instant replies to inbound texts',
    description:
      'Every SMS your Twilio number receives gets an immediate, knowledge-base-powered reply. No delays, no queues, no missed messages.',
  },
  {
    icon: Phone,
    name: 'Bring your own Twilio number',
    description:
      'Connect the Twilio long code, toll-free, or short code number you already use. VocUI plugs in via webhook — no number migration needed.',
  },
  {
    icon: FileText,
    name: 'Answers from your knowledge base',
    description:
      'Replies come from the content you upload — FAQs, service pages, policies, pricing docs. Accurate, grounded, never made up.',
  },
  {
    icon: ShieldCheck,
    name: 'A2P 10DLC compatible',
    description:
      'VocUI\'s SMS replies comply with A2P messaging standards. US businesses completing Twilio\'s 10DLC registration can use VocUI without carrier filtering risk.',
  },
  {
    icon: MessageSquare,
    name: 'Human handoff triggers',
    description:
      'Configure keywords or fallback conditions that pause the bot and alert your team to take the conversation over manually.',
  },
  {
    icon: TrendingUp,
    name: 'Multi-channel, one knowledge base',
    description:
      'The same trained content powers SMS, your website chatbot, Instagram DMs, and more. Train once, stay consistent everywhere.',
  },
];

const useCases = [
  {
    icon: Calendar,
    title: 'Appointment-based businesses',
    description:
      'Reply to booking confirmations, reschedule requests, and availability questions automatically via the same number you use for reminders.',
  },
  {
    icon: Wrench,
    title: 'Field service & trades',
    description:
      'When customers text you about quotes, job status, or emergency call-outs, get them an immediate answer — even when you\'re out on a job.',
  },
  {
    icon: Headphones,
    title: 'Customer support lines',
    description:
      'Add AI to your SMS support number. Handle FAQs, order queries, and status updates automatically before escalating to a human.',
  },
  {
    icon: TrendingUp,
    title: 'Sales & lead follow-up',
    description:
      'When leads text back from an SMS campaign, qualify them instantly with AI rather than letting them go cold waiting for a human reply.',
  },
];

const testimonials = [
  {
    quote:
      'We text appointment reminders to 200+ clients a week. Half of them text back with questions. VocUI handles all of it automatically now.',
    author: 'D.H.',
    role: 'Operations Manager, Medical Clinic',
  },
  {
    quote:
      'Our Twilio number was one-directional — we sent, customers replied and got silence. VocUI turned it into a real two-way support channel.',
    author: 'T.R.',
    role: 'Head of Customer Success, Home Services Company',
  },
];

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function SmsChatbotPage() {
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
          <Badge className="mb-6">AI SMS Chatbot via Twilio</Badge>

          <H1 className="max-w-4xl mb-6">
            AI-Powered SMS Support via Twilio.{' '}
            <span className="text-primary-500">Every inbound text answered instantly — from your knowledge base.</span>
          </H1>

          <p className="mx-auto max-w-2xl text-lg text-secondary-600 dark:text-secondary-400 mb-10">
            Connect your Twilio number to VocUI and train it on your FAQs, services, and policies.
            Every text your customers send gets an immediate, accurate reply — no human required.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="xl" asChild>
              <Link href="/signup">
                Build Your SMS Chatbot Free
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button size="xl" variant="outline" asChild>
              <Link href="/pricing">See Pricing</Link>
            </Button>
          </div>

          <p className="text-sm text-secondary-500 dark:text-secondary-400">
            No credit card required &middot; Requires a Twilio account &middot; US businesses must complete A2P 10DLC registration
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

        {/* ── A2P Notice ──────────────────────────────────────────────────────── */}
        <section className="container mx-auto px-4 pt-12 pb-0">
          <div className="max-w-3xl mx-auto flex gap-4 items-start rounded-xl border border-amber-200 dark:border-amber-800/50 bg-amber-50 dark:bg-amber-900/20 p-5">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-1">
                US businesses: A2P 10DLC registration required
              </p>
              <p className="text-sm text-amber-700 dark:text-amber-400 leading-relaxed">
                If you send texts to US numbers from a 10-digit long code, US carriers require brand and
                campaign registration through The Campaign Registry (TCR) via Twilio. Without registration,
                messages may be filtered. Toll-free number verification is a separate process.{' '}
                <a
                  href="https://help.twilio.com/articles/1260801864489590-What-is-A2P-10DLC"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-amber-700 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-200"
                >
                  Learn more at Twilio
                </a>.
              </p>
            </div>
          </div>
        </section>

        {/* ── Problem Section ─────────────────────────────────────────────────── */}
        <section className="container mx-auto px-4 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">The SMS gap</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              You send texts. Customers text back. Nobody answers.
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              Most businesses use SMS for outbound — reminders, confirmations, campaigns. The return
              traffic goes unanswered because there&apos;s no automation on inbound. VocUI closes that gap.
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
                Your SMS chatbot live in three steps
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
                  Build Your SMS Chatbot Free
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* ── Features ────────────────────────────────────────────────────────── */}
        <section className="container mx-auto px-4 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">Built for SMS</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              Everything your SMS bot needs to handle inbound texts
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              Accurate, instant, grounded in your content. VocUI turns your Twilio number into a
              two-way support channel — without adding to your team&apos;s workload.
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

        {/* ── Use Cases ───────────────────────────────────────────────────────── */}
        <section className="bg-secondary-50 dark:bg-secondary-800/30 py-24">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <Badge variant="outline" className="mb-4">Use cases</Badge>
              <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
                Who uses VocUI for SMS
              </h2>
              <p className="text-secondary-600 dark:text-secondary-400">
                Any business that already texts customers — or wants to — can add AI to their
                inbound SMS with VocUI and a Twilio number.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
              {useCases.map((u) => {
                const Icon = u.icon;
                return (
                  <Card
                    key={u.title}
                    className="border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 hover:shadow-lg hover:border-primary-200 dark:hover:border-primary-700 transition-all duration-200"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-900/50 mb-3">
                        <Icon className="h-6 w-6 text-primary-500" aria-hidden="true" />
                      </div>
                      <CardTitle className="text-base leading-snug">{u.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-secondary-500 dark:text-secondary-400 leading-relaxed">
                        {u.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Social Proof ────────────────────────────────────────────────────── */}
        <section className="container mx-auto px-4 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">What customers say</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100">
              Businesses that turned their Twilio number into a support channel
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 max-w-3xl mx-auto">
            {testimonials.map((t) => (
              <div
                key={t.author}
                className="bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-xl p-8 hover:border-primary-200 dark:hover:border-primary-700 transition-colors"
              >
                <blockquote className="text-secondary-700 dark:text-secondary-300 leading-relaxed mb-6 text-base">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <div>
                  <p className="font-semibold text-secondary-900 dark:text-secondary-100 text-sm">{t.author}</p>
                  <p className="text-xs text-secondary-500 dark:text-secondary-400">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────────────── */}
        <section className="container mx-auto px-4 py-24">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="outline" className="mb-4">Frequently asked questions</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100">
              Common questions about VocUI for SMS
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqItems.map((item) => (
              <div
                key={item.question}
                className="bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-xl p-6"
              >
                <h3 className="font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
                  {item.question}
                </h3>
                <p className="text-sm text-secondary-600 dark:text-secondary-400 leading-relaxed">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Final CTA ───────────────────────────────────────────────────────── */}
        <section className="container mx-auto px-4 py-20">
          <div className="max-w-3xl mx-auto">
            <div className="rounded-3xl bg-gradient-to-br from-primary-600 to-primary-800 p-12 text-center text-white shadow-xl shadow-primary-500/20">
              <h2 className="text-3xl font-bold mb-4">
                Make your Twilio number a two-way support channel.
              </h2>
              <p className="text-lg text-white/80 mb-2 max-w-xl mx-auto">
                Build an AI chatbot that answers inbound texts from your knowledge base.
                Every SMS handled. No manual replies. No missed messages.
              </p>
              <p className="text-sm text-white/60 mb-4">
                Free plan available &middot; Bring your own Twilio number &middot; US businesses must complete A2P 10DLC registration
              </p>
              <p className="text-xs text-white/40 mb-6">
                <Link href="/chatbot-for-email" className="text-white/60 hover:text-white/80 underline">Email chatbot</Link>
                {' '}&middot;{' '}
                <Link href="/chatbot-for-facebook-messenger" className="text-white/60 hover:text-white/80 underline">Messenger chatbot</Link>
                {' '}&middot;{' '}
                <Link href="/integrations" className="text-white/60 hover:text-white/80 underline">All integrations</Link>
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="xl"
                  variant="secondary"
                  className="bg-white text-primary-600 hover:bg-primary-50 font-semibold"
                  asChild
                >
                  <Link href="/signup">
                    Build Your SMS Chatbot Free
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button size="xl" variant="outline-light" asChild>
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
