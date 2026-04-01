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
  AlertCircle,
  BookOpen,
  CalendarCheck,
  Clock,
  UserCheck,
  Heart,
  Users,
  Building2,
  HandHeart,
  Landmark,
} from 'lucide-react';

// ─── Metadata ──────────────────────────────────────────────────────────────────

export function generateMetadata(): Metadata {
  return {
    title: 'AI Chatbot for Non-Profits | Donation FAQ & Volunteer Intake | VocUI',
    description:
      'Let an AI chatbot handle donation FAQs, volunteer onboarding, and programme enquiries for your non-profit — 24/7. Free up your coordinators for mission-critical work.',
    keywords: [
      'AI chatbot for non-profits',
      'non-profit chatbot',
      'volunteer intake chatbot',
      'donation FAQ automation',
      'charity chatbot',
    ],
    openGraph: {
      title: 'AI Chatbot for Non-Profits | Donation FAQ & Volunteer Intake | VocUI',
      description:
        'Let an AI chatbot handle donation FAQs, volunteer onboarding, and programme enquiries for your non-profit — 24/7. Free up your coordinators for mission-critical work.',
      url: 'https://vocui.com/chatbot-for-nonprofits',
      siteName: 'VocUI',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'AI Chatbot for Non-Profits | Donation FAQ & Volunteer Intake | VocUI',
      description:
        'Let an AI chatbot handle donation FAQs, volunteer onboarding, and programme enquiries for your non-profit — 24/7. Free up your coordinators for mission-critical work.',
    },
    alternates: {
      canonical: 'https://vocui.com/chatbot-for-nonprofits',
    },
    robots: { index: true, follow: true },
  };
}

// ─── Structured Data ───────────────────────────────────────────────────────────

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'VocUI — AI Chatbot for Non-Profits',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  description:
    'AI chatbot that handles donation FAQs, volunteer intake, and programme enquiries for non-profit organisations — 24/7, trained on your content only.',
  url: 'https://vocui.com/chatbot-for-nonprofits',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    description: 'Free plan available',
  },
  featureList: [
    'Knowledge base trained on your organisation content',
    'Donation FAQ automation',
    'Volunteer intake and onboarding',
    '24/7 after-hours availability',
    'Coordinator escalation with full conversation context',
    'GDPR-compliant data handling',
  ],
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What can VocUI's AI chatbot do for Non-Profits?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Let an AI chatbot handle donation FAQs, volunteer onboarding, and programme enquiries for your non-profit \u2014 24/7. Free up your coordinators for mission-critical work."
      }
    },
    {
      "@type": "Question",
      "name": "How long does it take to set up VocUI for Non-Profits?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Most Non-Profits get set up in under an hour. Upload your existing content -- service descriptions, FAQs, pricing pages, or PDFs -- and VocUI trains the chatbot automatically. Embed it on your website with a single snippet."
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
      "name": "How is VocUI different from a generic chatbot for Non-Profits?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Unlike generic chatbots, VocUI is trained exclusively on your own content -- your service descriptions, policies, FAQs, and documents. It only answers questions relevant to your Non-Profits business and escalates to your team when it cannot help, with full conversation context included."
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
      "name": "AI Chatbot for Non-Profits",
      "item": "https://vocui.com/chatbot-for-nonprofits"
    }
  ]
};



// ─── Data ──────────────────────────────────────────────────────────────────────

const trustSignals = [
  'Answers supporter questions 24/7',
  'Trained only on your organisation content',
  'GDPR-compliant data handling',
];

const painPoints: Array<{ icon: ElementType; title: string; body: ReactNode }> = [
  {
    icon: Phone,
    title: 'Volunteer coordinators fielding the same onboarding questions all week',
    body: 'What training do I need? Where do I show up? What should I bring? Your coordinators spend hours answering questions that are already in your volunteer handbook — time that should go toward your mission.',
  },
  {
    icon: MoonStar,
    title: 'Donation FAQs go unanswered on weekends and evenings',
    body: <span>A donor ready to give visits your site at 8pm and can&apos;t find out whether you accept Gift Aid, how restricted funds work, or what their donation actually funds. Without instant answers, that impulse to give often disappears by morning. <a href="https://www.salesloft.com/resources/guides/conversational-ai-marketing-trends-report" target="_blank" rel="noopener noreferrer" className="underline decoration-dotted hover:text-primary-500 transition-colors">41% of all charitable decisions happen outside standard business hours.</a></span>,
  },
  {
    icon: AlertCircle,
    title: 'Grant and partnership enquiries fall through the cracks',
    body: 'Foundations and corporate partners reach out through your contact form or website and hear nothing back for days. Every delayed response is a potential partnership you lose to an organisation that replied first.',
  },
];

const steps = [
  {
    step: '01',
    title: 'Train on your organisation',
    description:
      'Upload your volunteer handbook, donation FAQs, programme descriptions, and impact reports. Your chatbot learns everything about your work and answers accordingly.',
  },
  {
    step: '02',
    title: 'Configure supporter flows',
    description:
      'Set up intake flows for new volunteers and donor enquiries. Define escalation rules so sensitive questions reach your team — the chatbot never speaks outside its scope.',
  },
  {
    step: '03',
    title: 'Deploy and grow your impact',
    description:
      'Embed on your website or donation page. Supporters get instant answers; volunteers get onboarded faster; your coordinators stay focused on the work that matters.',
  },
];

const features = [
  {
    icon: BookOpen,
    name: 'Donation FAQ automation',
    description:
      'Answer Gift Aid, restricted vs unrestricted funds, payment methods, and tax receipt questions automatically — so no donation is lost to an unanswered question.',
  },
  {
    icon: CalendarCheck,
    name: 'Volunteer intake',
    description:
      'Capture volunteer interest, collect availability, and answer role-specific questions — turning interested visitors into registered volunteers without coordinator time.',
  },
  {
    icon: Heart,
    name: 'Programme FAQ',
    description:
      'Explain your programmes, eligibility criteria, and how to access your services clearly and consistently — at any hour of the day.',
  },
  {
    icon: Clock,
    name: '24/7 availability',
    description:
      'Supporters, volunteers, and partners visit your site at all hours. Your chatbot is always on, capturing interest even when your team is not.',
  },
  {
    icon: UserCheck,
    name: 'Coordinator escalation',
    description:
      'Complex or sensitive enquiries escalate immediately to your team with the full conversation history ready — no supporter has to repeat themselves.',
  },
  {
    icon: CalendarCheck,
    name: 'Event registration guidance',
    description:
      'Answer fundraising event questions, direct supporters to registration pages, and confirm participation details without involving your events team.',
  },
];

const verticals = [
  {
    icon: Heart,
    title: 'Charities',
    description:
      'Handle donation enquiries, Gift Aid questions, and supporter onboarding without tying up your fundraising team.',
  },
  {
    icon: Users,
    title: 'Community Organisations',
    description:
      'Answer programme eligibility questions, event details, and volunteer intake for local community groups at any hour.',
  },
  {
    icon: Building2,
    title: 'Faith-Based Organisations',
    description:
      'Provide service times, outreach programme information, and volunteer opportunities to your congregation and wider community.',
  },
  {
    icon: Landmark,
    title: 'Foundations',
    description:
      'Field grant enquiry pre-qualification questions and partnership interest so your programme officers focus on qualified applicants.',
  },
];

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ChatbotForNonprofitsPage() {
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
            <li className="text-secondary-900 dark:text-secondary-100 font-medium">AI Chatbot for Non-Profits</li>
          </ol>
        </nav>


        {/* ── Hero ────────────────────────────────────────────────────────────── */}
        <section className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center container mx-auto px-4 py-16 text-center">
          <Badge className="mb-6">AI Chatbot for Non-Profit Organisations</Badge>

          <H1 className="max-w-4xl mb-6">
            Your supporters ask the same questions every week.{' '}
            <span className="text-primary-500">Your chatbot can answer them.</span>
          </H1>

          <p className="mx-auto max-w-2xl text-lg text-secondary-600 dark:text-secondary-400 mb-10">
            VocUI trains on your volunteer handbook, donation FAQs, and programme descriptions — so
            your coordinators spend less time at their inbox and more time delivering your mission.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="xl" asChild>
              <Link href="/signup">
                Build Your Non-Profit Chatbot Free
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button size="xl" variant="outline" asChild>
              <Link href="/pricing">See Pricing</Link>
            </Button>
          </div>

          <p className="text-sm text-secondary-500 dark:text-secondary-400">
            Answers supporter questions 24/7 &middot; Trained only on your organisation content &middot; GDPR-compliant
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
            <Badge variant="outline" className="mb-4">The coordinator problem</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              Your team is answering questions a chatbot could handle
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              Not because your staff is slow. Because there&apos;s no system to handle the same
              supporter and volunteer questions that arrive every single week — so it all falls on your coordinators.
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
              Everything a non-profit chatbot actually needs
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              Built for mission-driven organisations — not a generic widget bolted onto your site.
              Every feature is aimed at freeing your team to focus on impact, not inbox management.
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
              <Badge variant="outline" className="mb-8">From a non-profit using VocUI</Badge>
              <blockquote className="text-2xl font-semibold text-secondary-900 dark:text-secondary-100 leading-snug mb-6">
                &ldquo;Our volunteer coordinator was spending two mornings a week answering the same
                onboarding emails. VocUI handles all of that now — volunteers get answers instantly,
                and our team actually spends their time coordinating, not copying and pasting.&rdquo;
              </blockquote>
              <p className="text-secondary-500 dark:text-secondary-400 text-sm">
                S.O. &mdash; Director, Regional Community Charity
              </p>
            </div>
          </div>
        </section>

        {/* ── Who It's For ────────────────────────────────────────────────────── */}
        <section className="container mx-auto px-4 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">Who it&apos;s for</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              For non-profits that want their team focused on mission, not admin
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              If your coordinators are fielding questions a chatbot could handle, VocUI pays for
              itself the moment your team gets their first uninterrupted work session.
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
                { label: 'Chatbot for Churches', href: '/chatbot-for-churches', description: 'Service times FAQ and event registration for faith communities.' },
                { label: 'Chatbot for Government Agencies', href: '/chatbot-for-government', description: 'Services FAQ and document request guidance for public bodies.' },
                { label: 'Chatbot for Tutoring Centers', href: '/chatbot-for-tutoring-centers', description: 'Subject FAQ and enrollment booking for tutoring businesses.' },
                { label: 'Chatbot for Universities', href: '/chatbot-for-universities', description: 'Admissions FAQ and course inquiry support for higher education.' },
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
                Your coordinators&apos; time is too valuable for inbox triage
              </h2>
              <p className="text-lg text-white/80 mb-2 max-w-xl mx-auto">
                Give supporters instant answers and let your team focus on the work that actually moves your mission forward.
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
                    Build Your Non-Profit Chatbot Free
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
