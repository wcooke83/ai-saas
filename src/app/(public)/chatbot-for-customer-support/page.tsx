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
  MessageSquare,
  Clock,
  TrendingDown,
  CheckCircle2,
  BookOpen,
  UserCheck,
  Frown,
  Languages,
  Ticket,
  ScrollText,
  ShoppingCart,
  Code2,
  Briefcase,
  Stethoscope,
} from 'lucide-react';

// ─── Metadata ──────────────────────────────────────────────────────────────────

export function generateMetadata(): Metadata {
  return {
    title: 'AI Customer Support Chatbot | Automate Support Tickets | VocUI',
    description:
      'Deflect repetitive support tickets with an AI chatbot trained on your own knowledge base. Cut response time from hours to seconds. Free plan available.',
    keywords: [
      'AI customer support chatbot',
      'automate support tickets',
      'AI helpdesk chatbot',
      'customer support automation',
      'knowledge base chatbot',
    ],
    openGraph: {
      title: 'AI Customer Support Chatbot | Automate Support Tickets | VocUI',
      description:
        'Deflect repetitive support tickets with an AI chatbot trained on your own knowledge base. Cut response time from hours to seconds. Free plan available.',
      url: 'https://vocui.com/chatbot-for-customer-support',
      siteName: 'VocUI',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'AI Customer Support Chatbot | Automate Support Tickets | VocUI',
      description:
        'Deflect repetitive support tickets with an AI chatbot trained on your own knowledge base. Cut response time from hours to seconds. Free plan available.',
    },
    alternates: {
      canonical: 'https://vocui.com/chatbot-for-customer-support',
    },
  };
}

// ─── Structured Data ───────────────────────────────────────────────────────────

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'VocUI — AI Customer Support Chatbot',
  applicationCategory: 'CustomerService',
  operatingSystem: 'Web',
  description:
    'AI chatbot that deflects repetitive support tickets using your own knowledge base.',
  url: 'https://vocui.com/chatbot-for-customer-support',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What can VocUI's AI chatbot do for Customer Support?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Deflect repetitive support tickets with an AI chatbot trained on your own knowledge base. Cut response time from hours to seconds. Free plan available."
      }
    },
    {
      "@type": "Question",
      "name": "How long does it take to set up VocUI for Customer Support?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Most Customer Support get set up in under an hour. Upload your existing content -- service descriptions, FAQs, pricing pages, or PDFs -- and VocUI trains the chatbot automatically. Embed it on your website with a single snippet."
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
      "name": "How is VocUI different from a generic chatbot for Customer Support?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Unlike generic chatbots, VocUI is trained exclusively on your own content -- your service descriptions, policies, FAQs, and documents. It only answers questions relevant to your Customer Support business and escalates to your team when it cannot help, with full conversation context included."
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
      "name": "AI Customer Support Chatbot",
      "item": "https://vocui.com/chatbot-for-customer-support"
    }
  ]
};



// ─── Data ──────────────────────────────────────────────────────────────────────

const trustSignals = [
  'Handles 70%+ of routine support volume',
  'Response time: seconds, not hours',
  'Live agent handoff built in',
];

const painPoints: Array<{ icon: ElementType; title: string; body: ReactNode }> = [
  {
    icon: MessageSquare,
    title: 'Repetitive tickets drain your team',
    body: 'Your support inbox fills up with the same 20 questions every week. Your team answers them manually, every time — while higher-priority issues wait.',
  },
  {
    icon: Clock,
    title: 'Customers wait hours for simple answers',
    body: <span>A customer asks about your return policy at 11pm. They wait until morning. Half of them give up and go to a competitor. <a href="https://livechatai.com/blog/customer-support-response-time-statistics" target="_blank" rel="noopener noreferrer" className="underline decoration-dotted hover:text-primary-500 transition-colors">Nearly 60% of customers expect a response within 10 minutes.</a></span>,
  },
  {
    icon: TrendingDown,
    title: 'Support costs scale with your growth',
    body: 'Every new customer adds to your support volume. Without automation, scaling your product means scaling your headcount.',
  },
];

const steps = [
  {
    step: '01',
    title: 'Train on your knowledge base',
    description:
      'Upload your docs, paste your help center URLs, or add FAQs directly. VocUI learns your product inside out.',
  },
  {
    step: '02',
    title: 'Customize the experience',
    description:
      "Set your chatbot's personality, define escalation rules, and configure when to hand off to a live agent.",
  },
  {
    step: '03',
    title: 'Deploy on your support channels',
    description:
      'Embed on your website with one line of JS, or deploy to Slack for internal team support. Go live in minutes.',
  },
];

const features = [
  {
    icon: BookOpen,
    name: 'Knowledge base training',
    description:
      'Train on URLs, PDFs, DOCX files, and Q&A pairs. Your chatbot answers from your actual content — not hallucinated answers.',
  },
  {
    icon: UserCheck,
    name: 'Live agent handoff',
    description:
      "When the chatbot can't resolve an issue, it escalates to your team seamlessly. Agents see the full conversation context.",
  },
  {
    icon: Frown,
    name: 'Sentiment detection',
    description:
      'Flag frustrated visitors automatically. Escalate high-risk conversations before they become complaints.',
  },
  {
    icon: Languages,
    name: '20+ language support',
    description:
      'Your chatbot understands and responds in the language your customer is writing in — automatically.',
  },
  {
    icon: Ticket,
    name: 'Support ticket creation',
    description:
      'For issues that need tracking, the chatbot can open a support ticket directly from the conversation.',
  },
  {
    icon: ScrollText,
    name: 'Full conversation history',
    description:
      'Every chat session is logged. Search, filter, and review conversations to improve your knowledge base over time.',
  },
];

const verticals = [
  {
    icon: ShoppingCart,
    title: 'E-commerce',
    description:
      'Handle order status, returns, shipping FAQs, and product questions without touching your inbox.',
  },
  {
    icon: Code2,
    title: 'SaaS & Software',
    description:
      'Resolve onboarding questions, troubleshoot common errors, and surface the right docs automatically.',
  },
  {
    icon: Briefcase,
    title: 'Professional Services',
    description:
      'Answer intake questions, explain your process, and qualify leads — before they even book a call.',
  },
  {
    icon: Stethoscope,
    title: 'Healthcare & Clinics',
    description:
      'Handle appointment questions, service inquiries, and insurance FAQs around the clock.',
  },
];

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ChatbotForCustomerSupportPage() {
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
            <li className="text-secondary-900 dark:text-secondary-100 font-medium">AI Customer Support Chatbot</li>
          </ol>
        </nav>


        {/* ── Hero ────────────────────────────────────────────────────────────── */}
        <section className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center container mx-auto px-4 py-16 text-center">
          <Badge className="mb-6">AI-Powered Customer Support</Badge>

          <H1 className="max-w-4xl mb-6">
            Stop answering the same support tickets —{' '}
            <span className="text-primary-500">let your knowledge base handle them</span>
          </H1>

          <p className="mx-auto max-w-2xl text-lg text-secondary-600 dark:text-secondary-400 mb-10">
            VocUI trains an AI chatbot on your docs, FAQs, and URLs. It resolves routine questions
            instantly, 24/7 — and hands off to your team when things get complex.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="xl" asChild>
              <Link href="/signup">
                Build Your Support Chatbot Free
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button size="xl" variant="outline" asChild>
              <Link href="/pricing">See Pricing</Link>
            </Button>
          </div>

          <p className="text-sm text-secondary-500 dark:text-secondary-400">
            Free plan available &middot; No credit card required &middot; Live in under an hour
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
            <Badge variant="outline" className="mb-4">The support problem</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              Your support team is spending hours on questions your docs already answer
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              Not because your team is slow. Because there&apos;s no system in place to handle the
              routine — so everything lands in the inbox.
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
                Set up your support chatbot in under an hour
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
                  Start for Free — No Credit Card
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
              Everything your support chatbot needs
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              Built to handle real support scenarios — not just answer FAQs. Every feature is aimed
              at reducing tickets without reducing quality.
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
              <Badge variant="outline" className="mb-8">Customer results</Badge>
              <blockquote className="text-2xl font-semibold text-secondary-900 dark:text-secondary-100 leading-snug mb-6">
                &ldquo;Response time dropped from 4 hours to 11 seconds. That alone moved our CSAT
                score by 9 points.&rdquo;
              </blockquote>
              <p className="text-secondary-500 dark:text-secondary-400 text-sm">
                Marcus T. &mdash; Head of Customer Success
              </p>
            </div>
          </div>
        </section>

        {/* ── Who It's For ────────────────────────────────────────────────────── */}
        <section className="container mx-auto px-4 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">Who it&apos;s for</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              Built for teams that value their time
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              If your team is manually answering questions that are already in your docs, VocUI
              pays for itself in the first week.
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
                { label: 'Chatbot for SaaS Companies', href: '/chatbot-for-saas', description: 'Product FAQ and trial lead capture for SaaS businesses.' },
                { label: 'Chatbot for E-commerce', href: '/chatbot-for-ecommerce', description: 'Product Q&A and support deflection for online retailers.' },
                { label: 'Chatbot for IT Support Teams', href: '/chatbot-for-it-support', description: 'Ticket deflection and troubleshooting FAQ for IT teams.' },
                { label: 'Chatbot for HR Departments', href: '/chatbot-for-hr', description: 'Employee policy FAQ and onboarding support for HR teams.' },
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
                Your support team has better things to do
              </h2>
              <p className="text-lg text-white/80 mb-2 max-w-xl mx-auto">
                Build a chatbot that handles the routine so your team can focus on what actually
                needs a human.
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
                    Build Your Support Chatbot Free
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
