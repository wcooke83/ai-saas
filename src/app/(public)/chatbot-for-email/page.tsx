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
  Mail,
  Zap,
  FileText,
  RefreshCw,
  Inbox,
  ShieldCheck,
  Headphones,
  TrendingUp,
  Users,
  BarChart2,
} from 'lucide-react';

// ─── Metadata ──────────────────────────────────────────────────────────────────

export function generateMetadata(): Metadata {
  return {
    title: 'AI Email Chatbot | VocUI',
    description:
      'AI that replies to your support emails. Forward your inbox to a VocUI address and let your knowledge base answer every inbound email — automatically.',
    keywords: [
      'AI email chatbot',
      'email support automation',
      'AI reply to emails',
      'automated email responses',
      'AI customer support email',
      'inbound email AI',
    ],
    openGraph: {
      title: 'AI Email Chatbot | VocUI',
      description:
        'AI that replies to your support emails. Forward your inbox to a VocUI address and let your knowledge base answer every inbound email — automatically.',
      url: 'https://vocui.com/chatbot-for-email',
      siteName: 'VocUI',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'AI Email Chatbot | VocUI',
      description:
        'AI that replies to your support emails. Forward your inbox to a VocUI address and let your knowledge base answer every inbound email — automatically.',
    },
    alternates: {
      canonical: 'https://vocui.com/chatbot-for-email',
    },
    robots: { index: true, follow: true },
  };
}

// ─── Structured Data ───────────────────────────────────────────────────────────

const faqItems = [
  {
    question: 'Do I need to give VocUI access to my email account?',
    answer:
      'No. VocUI gives you a dedicated inbound email address. You set up a forwarding rule from your existing support inbox (e.g. support@yourdomain.com) to your VocUI address. VocUI never needs credentials to your actual email account.',
  },
  {
    question: 'Does the AI reply to the original sender or to my inbox?',
    answer:
      'VocUI replies directly to the original sender on your behalf. The reply appears to come from your domain (configurable) and threads correctly in the sender\'s email client — so the conversation stays coherent.',
  },
  {
    question: 'What happens if the AI can\'t answer the email?',
    answer:
      'If a query falls outside your knowledge base, VocUI sends a polite holding response and routes the email to your team for manual handling. You can customise the fallback message and escalation behaviour.',
  },
  {
    question: 'Can I use this with Gmail, Outlook, or Zendesk?',
    answer:
      'Yes. Because setup requires only a forwarding rule, VocUI works with any email provider — Gmail, Outlook, Apple Mail, Zoho, Zendesk, Freshdesk, and any custom mail server.',
  },
  {
    question: 'Can the same knowledge base also power my website chatbot?',
    answer:
      'Yes. One VocUI knowledge base powers all your channels — email, website widget, SMS, Facebook Messenger, Instagram, and Slack. Update content once and every channel reflects the change.',
  },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      name: 'VocUI AI Email Chatbot',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      description:
        'AI that replies to your support emails. Forward your inbox to a VocUI address and let your knowledge base answer every inbound email — automatically.',
      url: 'https://vocui.com/chatbot-for-email',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
        description: 'Free plan available',
      },
      featureList: [
        'Dedicated inbound email address',
        'No email account credentials required',
        'Knowledge base powered replies',
        'Threads correctly in sender inbox',
        'Works with any email provider',
        'Human escalation for unanswerable emails',
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
  'No email credentials needed — just forward your inbox',
  'Threads correctly in every email client',
  'Answers sourced from your knowledge base',
  'Works with Gmail, Outlook, Zendesk, and any provider',
];

const painPoints = [
  {
    icon: Inbox,
    title: 'Your support inbox is a backlog, not a workflow',
    body: 'The same questions arrive every day — order status, pricing, how-to, returns. Each one takes your team 3-5 minutes to read, look up, and reply. Multiply that by 50 tickets a day and you\'ve spent four hours on work a knowledge base could handle.',
  },
  {
    icon: Clock,
    title: 'Customers wait 24 hours for a 30-second answer',
    body: 'When support response time is slow, customers assume you don\'t care. A question that your FAQ answers in seconds sits in a queue for hours — because nobody automated the obvious path between question and answer.',
  },
  {
    icon: Users,
    title: 'Your team handles volume, not complexity',
    body: 'The emails that actually need a human — edge cases, complaints, escalations — get the same time and attention as "What are your hours?" That\'s not a resource allocation problem. That\'s an automation gap.',
  },
];

const steps = [
  {
    step: '01',
    title: 'Enable email inbound',
    description:
      'Activate email inbound in your VocUI dashboard. You\'ll get a dedicated inbound address specific to your account and knowledge base.',
  },
  {
    step: '02',
    title: 'Forward your support inbox',
    description:
      'Set up a forwarding rule from your existing support address (support@yourdomain.com) to your VocUI address. Takes 60 seconds in Gmail, Outlook, or any mail provider.',
  },
  {
    step: '03',
    title: 'AI replies to every email',
    description:
      'Inbound emails are answered automatically from your knowledge base. Replies thread correctly, appear from your domain, and escalate to your team when needed.',
  },
];

const features = [
  {
    icon: Mail,
    name: 'Dedicated inbound address',
    description:
      'VocUI provides a unique inbound email address. Forward your support inbox to it — no credentials, no OAuth, no access to your email account.',
  },
  {
    icon: Zap,
    name: 'Instant replies, any hour',
    description:
      'Every inbound email gets an AI-generated reply within seconds. No queues, no SLA breaches, no "we\'ll get back to you within 2 business days".',
  },
  {
    icon: FileText,
    name: 'Answers from your knowledge base',
    description:
      'Replies are grounded in the content you upload — FAQs, product docs, policies, pricing. The AI never guesses or fabricates information.',
  },
  {
    icon: ShieldCheck,
    name: 'No credentials required',
    description:
      'VocUI never touches your actual email account. The forwarding architecture means your inbox credentials stay entirely in your control.',
  },
  {
    icon: RefreshCw,
    name: 'Threads correctly',
    description:
      'AI replies maintain proper email threading — the sender\'s email client shows the conversation as a coherent thread, not a disconnected reply.',
  },
  {
    icon: BarChart2,
    name: 'Escalation for edge cases',
    description:
      'When an email falls outside your knowledge base, VocUI sends a polite holding reply and flags the thread for human follow-up — so nothing slips through.',
  },
];

const useCases = [
  {
    icon: Headphones,
    title: 'Customer support teams',
    description:
      'Automate tier-1 support emails — the FAQs, order queries, and basic how-to questions — so your team handles only the issues that need human judgment.',
  },
  {
    icon: TrendingUp,
    title: 'SaaS & software',
    description:
      'Answer product how-to questions, billing queries, and onboarding emails automatically from your docs — reducing support volume without reducing quality.',
  },
  {
    icon: Users,
    title: 'Professional services',
    description:
      'Reply to intake emails, service questions, and pricing enquiries instantly — even outside business hours — so leads don\'t go cold before you open your inbox.',
  },
  {
    icon: Inbox,
    title: 'ecommerce & retail',
    description:
      'Handle order status questions, return requests, and shipping queries automatically. Reduce WISMO (where is my order) volume by 60%+ with AI.',
  },
];

const testimonials = [
  {
    quote:
      'We went from a 6-hour average email response time to under 2 minutes for common questions. Our CSAT improved within the first week.',
    author: 'P.N.',
    role: 'Head of Support, B2B SaaS',
  },
  {
    quote:
      'I was skeptical you could just forward an inbox and get AI replies. It took 5 minutes to set up and the bot handles 70% of our inbound emails without us touching them.',
    author: 'C.B.',
    role: 'Operations Director, ecommerce Brand',
  },
];

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function EmailChatbotPage() {
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
          <Badge className="mb-6">AI Email Chatbot</Badge>

          <H1 className="max-w-4xl mb-6">
            AI That Replies to Your Support Emails.{' '}
            <span className="text-primary-500">Forward your inbox. Your knowledge base handles the rest.</span>
          </H1>

          <p className="mx-auto max-w-2xl text-lg text-secondary-600 dark:text-secondary-400 mb-10">
            Give VocUI a forwarding rule — not your email credentials. Every inbound support email
            gets an instant, knowledge-base-powered reply that threads correctly and comes from your domain.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="xl" asChild>
              <Link href="/signup">
                Start Automating Email Support Free
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button size="xl" variant="outline" asChild>
              <Link href="/pricing">See Pricing</Link>
            </Button>
          </div>

          <p className="text-sm text-secondary-500 dark:text-secondary-400">
            No credit card required &middot; No email credentials needed &middot; Works with any mail provider
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
            <Badge variant="outline" className="mb-4">The support inbox problem</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              Most support emails don&apos;t need a human. They need a knowledge base.
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              70-80% of support email volume is repeat questions your docs already answer. The bottleneck
              is routing — between the question, your knowledge, and a reply.
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
                Your email AI live in three steps
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
                  Start Automating Email Support Free
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* ── Features ────────────────────────────────────────────────────────── */}
        <section className="container mx-auto px-4 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">Built for email support</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              Everything your email AI needs to handle your inbox
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              Accurate, instant, grounded in your content — and no more giving a vendor access to
              your email account.
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
                Who uses VocUI for email
              </h2>
              <p className="text-secondary-600 dark:text-secondary-400">
                Any team with an email-based support workflow can cut response times and reduce manual
                volume with VocUI&apos;s email inbound channel.
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
              Teams that cut their support inbox in half
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
              Common questions about VocUI for email
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
                Your support inbox shouldn&apos;t need this many people.
              </h2>
              <p className="text-lg text-white/80 mb-2 max-w-xl mx-auto">
                Automate tier-1 email support with AI trained on your actual content.
                Forward your inbox. Your knowledge base handles the rest.
              </p>
              <p className="text-sm text-white/60 mb-4">
                Free plan available &middot; No credit card required &middot; No email credentials needed
              </p>
              <p className="text-xs text-white/40 mb-6">
                <Link href="/chatbot-for-sms" className="text-white/60 hover:text-white/80 underline">SMS chatbot</Link>
                {' '}&middot;{' '}
                <Link href="/chatbot-for-customer-support" className="text-white/60 hover:text-white/80 underline">AI for customer support</Link>
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
                    Start Automating Email Support Free
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
