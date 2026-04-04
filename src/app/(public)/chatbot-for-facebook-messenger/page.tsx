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
  RefreshCw,
  Users,
  ShoppingBag,
  Headphones,
  Star,
  ThumbsUp,
} from 'lucide-react';

// ─── Metadata ──────────────────────────────────────────────────────────────────

export function generateMetadata(): Metadata {
  return {
    title: 'Facebook Messenger Chatbot | VocUI',
    description:
      'Add an AI chatbot to your Facebook Page Messenger. Respond to every DM instantly, 24/7 — trained on your own FAQs, products, and policies.',
    keywords: [
      'Facebook Messenger chatbot',
      'AI chatbot for Facebook Page',
      'automate Facebook DMs',
      'Messenger bot for business',
      'Facebook Page auto-reply AI',
    ],
    openGraph: {
      title: 'Facebook Messenger Chatbot | VocUI',
      description:
        'Add an AI chatbot to your Facebook Page Messenger. Respond to every DM instantly, 24/7 — trained on your own FAQs, products, and policies.',
      url: 'https://vocui.com/chatbot-for-facebook-messenger',
      siteName: 'VocUI',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Facebook Messenger Chatbot | VocUI',
      description:
        'Add an AI chatbot to your Facebook Page Messenger. Respond to every DM instantly, 24/7 — trained on your own FAQs, products, and policies.',
    },
    alternates: {
      canonical: 'https://vocui.com/chatbot-for-facebook-messenger',
    },
    robots: { index: true, follow: true },
  };
}

// ─── Structured Data ───────────────────────────────────────────────────────────

const faqItems = [
  {
    question: 'Does the chatbot reply to all Messenger messages automatically?',
    answer:
      'Yes. Once connected, VocUI responds to every incoming Messenger DM on your Facebook Page — 24/7, including outside business hours. You can configure a human handoff trigger for complex queries.',
  },
  {
    question: 'What knowledge can I train the bot on?',
    answer:
      'You can upload PDFs, paste URLs, add plain text FAQs, or import DOCX files. The bot answers from that content — your product pages, pricing, policies, opening hours, and anything else you add.',
  },
  {
    question: 'Can a human take over a conversation mid-chat?',
    answer:
      'Yes. VocUI supports human handoff. You can configure keywords or triggers that pause the bot and alert your team to take over in the Facebook Page inbox.',
  },
  {
    question: 'Does this work with the free Facebook Business Page?',
    answer:
      'Yes. VocUI connects to any Facebook Page via the Messenger Platform API. You do not need Facebook\'s paid tools or a Meta Business Suite subscription.',
  },
  {
    question: 'Can the same knowledge base also power my website chatbot?',
    answer:
      'Yes. One VocUI knowledge base can power your Messenger bot, your website widget, Slack, and other channels simultaneously. Train once, deploy everywhere.',
  },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      name: 'VocUI Facebook Messenger Chatbot',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      description:
        'Add an AI chatbot to your Facebook Page Messenger. Respond to every DM instantly, 24/7 — trained on your own FAQs, products, and policies.',
      url: 'https://vocui.com/chatbot-for-facebook-messenger',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
        description: 'Free plan available',
      },
      featureList: [
        'Facebook Messenger API integration',
        'Knowledge base trained on your content',
        '24/7 automated replies',
        'Human handoff support',
        'Multi-channel: Messenger + website + Slack',
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
  'Responds to every DM — no message left on read',
  'Trained on your content, not generic AI',
  'Human handoff when you need it',
  'Same knowledge base powers your website too',
];

const painPoints = [
  {
    icon: Clock,
    title: 'Customers message at midnight. You reply at 9am.',
    body: 'Your Facebook Page gets DMs around the clock — from prospects asking about pricing, customers chasing orders, and leads who found you through an ad. Every hour without a reply is a conversion you lost.',
  },
  {
    icon: MessageSquare,
    title: 'The same five questions, every single day',
    body: 'Opening hours. Pricing. Delivery times. Return policies. Your team answers these manually, dozens of times a week — in Messenger, in comments, in emails. The answers never change, but you keep typing them.',
  },
  {
    icon: Users,
    title: 'Your team is a bottleneck for basic information',
    body: 'Every DM that needs a human to respond is a task in someone\'s queue. When volume spikes — a sale, a viral post, an ad — that queue backs up fast and response times crater.',
  },
];

const steps = [
  {
    step: '01',
    title: 'Connect your Facebook Page',
    description:
      'Authorize VocUI to connect to your Facebook Page via the Messenger Platform API. Takes under two minutes — no developer required.',
  },
  {
    step: '02',
    title: 'Train on your content',
    description:
      'Upload your FAQs, product pages, pricing guides, and policies. VocUI builds a knowledge base the bot answers from directly.',
  },
  {
    step: '03',
    title: 'Go live and respond automatically',
    description:
      'Every incoming Messenger DM gets an instant, accurate reply — sourced from your knowledge base. Human handoff available when needed.',
  },
];

const features = [
  {
    icon: Zap,
    name: 'Instant replies, 24/7',
    description:
      'No more missed DMs. VocUI responds to every Messenger message the moment it arrives — day, night, weekends, and holidays.',
  },
  {
    icon: FileText,
    name: 'Answers from your knowledge base',
    description:
      'The bot pulls answers from the content you upload — PDFs, URLs, FAQs, product docs. It never guesses or makes things up.',
  },
  {
    icon: Users,
    name: 'Human handoff',
    description:
      'Configure keywords or fallback triggers. When a query needs a human, the bot pauses and alerts your team to take over in Messenger.',
  },
  {
    icon: RefreshCw,
    name: 'Always current',
    description:
      'Update your knowledge sources whenever your products, prices, or policies change. The bot answers from the latest version immediately.',
  },
  {
    icon: MessageSquare,
    name: 'Natural conversation',
    description:
      'Customers ask questions in their own words. VocUI understands intent — not just keywords — and responds in a natural, helpful tone.',
  },
  {
    icon: Star,
    name: 'Multi-channel from one knowledge base',
    description:
      'The same trained content powers your Messenger bot, website widget, and Slack integration. Update once, stay consistent everywhere.',
  },
];

const useCases = [
  {
    icon: ShoppingBag,
    title: 'Retail & ecommerce',
    description:
      'Answer product questions, check stock availability, explain shipping times, and handle return queries — all without touching your inbox.',
  },
  {
    icon: Headphones,
    title: 'Customer support',
    description:
      'Resolve the most common support issues automatically. Escalate to a human only when the query actually needs one.',
  },
  {
    icon: ThumbsUp,
    title: 'Service businesses',
    description:
      'Handle booking enquiries, pricing questions, and availability checks via Messenger — even while you\'re out on a job.',
  },
  {
    icon: Star,
    title: 'Lead qualification',
    description:
      'Engage visitors who DM after seeing your Facebook ad. Qualify them, answer their questions, and capture contact details automatically.',
  },
];

const testimonials = [
  {
    quote:
      'We were getting 40+ Messenger DMs a day after a promotion. VocUI handled 80% of them without us touching the inbox.',
    author: 'R.K.',
    role: 'Owner, Online Retail Store',
  },
  {
    quote:
      'Customers used to wait hours for a reply to basic questions. Now they get an answer in seconds, and my team only handles the ones that actually need us.',
    author: 'L.M.',
    role: 'Customer Experience Manager, Hospitality Group',
  },
];

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function FacebookMessengerChatbotPage() {
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
          <Badge className="mb-6">AI Chatbot for Facebook Messenger</Badge>

          <H1 className="max-w-4xl mb-6">
            Add AI to Your Facebook Messenger.{' '}
            <span className="text-primary-500">Respond to every DM instantly — even at 2am.</span>
          </H1>

          <p className="mx-auto max-w-2xl text-lg text-secondary-600 dark:text-secondary-400 mb-10">
            Connect VocUI to your Facebook Page and train it on your FAQs, products, and policies.
            Your Messenger inbox answers itself — 24/7, accurately, in your brand voice.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="xl" asChild>
              <Link href="/signup">
                Build Your Messenger Chatbot Free
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button size="xl" variant="outline" asChild>
              <Link href="/pricing">See Pricing</Link>
            </Button>
          </div>

          <p className="text-sm text-secondary-500 dark:text-secondary-400">
            No credit card required &middot; Free plan available &middot; Live in under an hour
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
            <Badge variant="outline" className="mb-4">The DM problem</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              Your Facebook Page gets messages you can&apos;t keep up with
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              Every unanswered DM is a lost sale, a frustrated customer, or a lead that moved on.
              Messenger response time directly affects your Page&apos;s responsiveness badge — and your conversion rate.
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
                Your Messenger chatbot live in three steps
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
                  Build Your Messenger Chatbot Free
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* ── Features ────────────────────────────────────────────────────────── */}
        <section className="container mx-auto px-4 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">Built for Messenger</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              Everything your Messenger bot needs to perform
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              Not a canned-response bot. VocUI understands questions and answers from your actual content —
              so every reply is accurate and on-brand.
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
                Who uses VocUI for Messenger
              </h2>
              <p className="text-secondary-600 dark:text-secondary-400">
                Any business with a Facebook Page that gets DMs can reduce response time and increase
                conversions with an AI-powered Messenger bot.
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
              Businesses that stopped drowning in Messenger DMs
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
              Common questions about VocUI for Messenger
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
                Your Facebook Page deserves a faster response time.
              </h2>
              <p className="text-lg text-white/80 mb-2 max-w-xl mx-auto">
                Build an AI chatbot trained on your content and deploy it to Messenger today.
                Every DM answered. No manual replies required.
              </p>
              <p className="text-sm text-white/60 mb-4">
                Free plan available &middot; No credit card required &middot; Live in under an hour
              </p>
              <p className="text-xs text-white/40 mb-6">
                <Link href="/integrations" className="text-white/60 hover:text-white/80 underline">All integrations</Link>
                {' '}&middot;{' '}
                <Link href="/chatbot-for-instagram" className="text-white/60 hover:text-white/80 underline">Instagram DM chatbot</Link>
                {' '}&middot;{' '}
                <Link href="/slack-chatbot" className="text-white/60 hover:text-white/80 underline">Slack chatbot</Link>
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="xl"
                  variant="secondary"
                  className="bg-white text-primary-600 hover:bg-primary-50 font-semibold"
                  asChild
                >
                  <Link href="/signup">
                    Build Your Messenger Chatbot Free
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
