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
  ShieldCheck,
  Star,
  Activity,
  Zap,
  Baby,
} from 'lucide-react';

export function generateMetadata(): Metadata {
  return {
    title: 'AI Chatbot for Chiropractors | New Patient Intake & Booking | VocUI',
    description:
      'Let an AI chatbot handle new patient intake, appointment booking, and treatment FAQs for your chiropractic practice — 24/7. Reduce phone volume and fill your schedule.',
    keywords: [
      'AI chatbot for chiropractors',
      'chiropractic chatbot',
      'new patient intake automation',
      'chiropractic appointment booking',
      'chiropractic FAQ chatbot',
    ],
    openGraph: {
      title: 'AI Chatbot for Chiropractors | New Patient Intake & Booking | VocUI',
      description:
        'Let an AI chatbot handle new patient intake, appointment booking, and treatment FAQs for your chiropractic practice — 24/7.',
      url: 'https://vocui.com/chatbot-for-chiropractors',
      siteName: 'VocUI',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'AI Chatbot for Chiropractors | New Patient Intake & Booking | VocUI',
      description:
        'Let an AI chatbot handle new patient intake, appointment booking, and treatment FAQs for your chiropractic practice — 24/7.',
    },
    alternates: { canonical: 'https://vocui.com/chatbot-for-chiropractors' },
    robots: { index: true, follow: true },
  };
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'VocUI — AI Chatbot for Chiropractors',
  applicationCategory: 'MedicalApplication',
  operatingSystem: 'Web',
  description:
    'AI chatbot that handles new patient intake, appointment booking, and treatment FAQs for chiropractic practices — 24/7, trained on your clinic content only.',
  url: 'https://vocui.com/chatbot-for-chiropractors',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', description: 'Free plan available' },
  featureList: [
    'New patient intake automation',
    'Appointment booking via Easy!Appointments',
    'Treatment and insurance FAQ automation',
    '24/7 after-hours availability',
    'Staff handoff with full conversation context',
    'GDPR-compliant data handling',
  ],
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What can VocUI's AI chatbot do for Chiropractors?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Let an AI chatbot handle new patient intake, appointment booking, and treatment FAQs for your chiropractic practice \u2014 24/7. Reduce phone volume and fill your schedule."
      }
    },
    {
      "@type": "Question",
      "name": "How long does it take to set up VocUI for Chiropractors?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Most Chiropractors get set up in under an hour. Upload your existing content -- service descriptions, FAQs, pricing pages, or PDFs -- and VocUI trains the chatbot automatically. Embed it on your website with a single snippet."
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
      "name": "How is VocUI different from a generic chatbot for Chiropractors?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Unlike generic chatbots, VocUI is trained exclusively on your own content -- your service descriptions, policies, FAQs, and documents. It only answers questions relevant to your Chiropractors business and escalates to your team when it cannot help, with full conversation context included."
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
      "name": "AI Chatbot for Chiropractors",
      "item": "https://vocui.com/chatbot-for-chiropractors"
    }
  ]
};



const trustSignals = [
  'Answers patient questions 24/7',
  'Trained only on your practice content',
  'GDPR-compliant data handling',
];

const painPoints: Array<{ icon: ElementType; title: string; body: ReactNode }> = [
  {
    icon: Phone,
    title: 'New patients call to ask what to expect before they even book',
    body: <span>What does an adjustment feel like? Do I need a referral? Will my insurance cover it? <a href="https://411locals.us/small-business-owners-dont-answer-62-of-phone-calls/" target="_blank" rel="noopener noreferrer" className="underline decoration-dotted hover:text-primary-500 transition-colors">Small businesses miss 62% of inbound calls</a> — your front desk answers the same questions all week while your schedule stays half-empty.</span>,
  },
  {
    icon: MoonStar,
    title: 'Injury enquiries after hours go cold',
    body: <span>Someone tweaks their back on a weekend and searches for a chiropractor. <a href="https://www.dentaleconomics.com/practice/systems/article/14204628/why-online-scheduling-should-be-the-new-normal" target="_blank" rel="noopener noreferrer" className="underline decoration-dotted hover:text-primary-500 transition-colors">43% of patients look for healthcare providers outside business hours</a> — without instant answers, they book with whoever responds first.</span>,
  },
  {
    icon: AlertCircle,
    title: 'Insurance questions block bookings before they happen',
    body: 'Patients who are unsure whether their insurance covers chiropractic care often don\'t book at all. Clear, instant answers about accepted plans and payment options remove that barrier.',
  },
];

const steps = [
  {
    step: '01',
    title: 'Train on your practice',
    description:
      'Upload your treatment descriptions, insurance FAQs, pricing, and what-to-expect guides. Your chatbot learns your practice inside-out and answers accordingly.',
  },
  {
    step: '02',
    title: 'Configure patient intake flows',
    description:
      'Set up new patient intake forms and booking flows. Define escalation rules so complex clinical questions route straight to your team — the chatbot never oversteps.',
  },
  {
    step: '03',
    title: 'Deploy and fill your schedule',
    description:
      'Embed on your website. Visitors get instant answers; ready-to-book patients get routed directly to your appointment calendar.',
  },
];

const features = [
  {
    icon: BookOpen,
    name: 'Knowledge base trained on your content',
    description:
      'Your chatbot answers from your approved practice content only — never invented clinical information or unsupported claims.',
  },
  {
    icon: CalendarCheck,
    name: 'Appointment booking',
    description:
      'Connect to your calendar via Easy!Appointments. New and returning patients book directly from the chat, any time of day.',
  },
  {
    icon: ShieldCheck,
    name: 'Insurance and payment FAQ',
    description:
      'Answer accepted insurance plans, payment options, and financing questions automatically — removing barriers to booking.',
  },
  {
    icon: Clock,
    name: 'After-hours availability',
    description:
      'Your chatbot answers injury enquiries at midnight as well as midday. Capture every potential patient, even when your practice is closed.',
  },
  {
    icon: UserCheck,
    name: 'New patient intake',
    description:
      'Collect basic patient information and reason for visit before the first appointment — so your team arrives prepared.',
  },
  {
    icon: Star,
    name: 'What-to-expect preparation guides',
    description:
      'Share first-visit guidance automatically — what to wear, what to bring, what an adjustment involves — reducing no-shows and anxiety.',
  },
];

const verticals = [
  {
    icon: Activity,
    title: 'Sports Injury',
    description:
      'Handle sports injury enquiries and book initial assessments without tying up your reception team.',
  },
  {
    icon: Star,
    title: 'General Wellness',
    description:
      'Answer questions about ongoing maintenance care, posture correction, and preventative treatment plans.',
  },
  {
    icon: Baby,
    title: 'Prenatal',
    description:
      'Guide expectant mothers through pregnancy-specific chiropractic care FAQs and book specialist appointments.',
  },
  {
    icon: Zap,
    title: 'Pediatric',
    description:
      'Ease parent concerns with clear first-visit FAQs for children and book family appointments efficiently.',
  },
];

export default function ChatbotForChiropractorsPage() {
  return (
    <PageBackground>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
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
            <li className="text-secondary-900 dark:text-secondary-100 font-medium">AI Chatbot for Chiropractors</li>
          </ol>
        </nav>

        <section className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center container mx-auto px-4 py-16 text-center">
          <Badge className="mb-6">AI Chatbot for Chiropractic Practices</Badge>
          <H1 className="max-w-4xl mb-6">
            New patients have questions before they book.{' '}
            <span className="text-primary-500">Your chatbot can answer them instantly.</span>
          </H1>
          <p className="mx-auto max-w-2xl text-lg text-secondary-600 dark:text-secondary-400 mb-10">
            VocUI trains on your practice FAQs, treatment descriptions, and insurance details — so your
            front desk spends less time on the phone and more time with patients already in your care.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="xl" asChild>
              <Link href="/signup">
                Build Your Chiropractic Chatbot Free
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button size="xl" variant="outline" asChild>
              <Link href="/pricing">See Pricing</Link>
            </Button>
          </div>
          <p className="text-sm text-secondary-500 dark:text-secondary-400">
            Answers patient questions 24/7 &middot; Trained only on your practice content &middot; GDPR-compliant
          </p>
        </section>

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

        <section className="container mx-auto px-4 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">The front desk problem</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              Your reception team is answering questions a chatbot could handle
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              Not because your staff is slow. Because there&apos;s no system to handle the same patient
              questions that arrive every single day — so it all falls on your front desk.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
            {painPoints.map((p) => {
              const Icon = p.icon;
              return (
                <div key={p.title} className="bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-xl p-6 hover:border-primary-200 dark:hover:border-primary-700 transition-colors">
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

        <section id="how-it-works" className="bg-secondary-50 dark:bg-secondary-800/30 py-24">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <Badge variant="outline" className="mb-4">How it works</Badge>
              <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100">
                Set up in under an hour. No developers needed.
              </h2>
            </div>
            <div className="grid gap-10 md:grid-cols-3 max-w-5xl mx-auto relative">
              <div className="hidden md:block absolute top-8 left-[calc(16.67%+1.5rem)] right-[calc(16.67%+1.5rem)] h-px bg-secondary-200 dark:bg-secondary-700" aria-hidden="true" />
              {steps.map((s) => (
                <div key={s.step} className="relative text-center flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-primary-500 text-white font-bold text-lg flex items-center justify-center mb-6 z-10 shadow-lg shadow-primary-500/25">
                    {s.step}
                  </div>
                  <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-3">{s.title}</h3>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400 leading-relaxed max-w-xs">{s.description}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-14">
              <Button size="xl" asChild>
                <Link href="/signup">Start Building Free <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">Features</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              Everything a chiropractic chatbot actually needs
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              Built for chiropractic practices — not a generic widget bolted onto your site. Every feature
              is aimed at reducing phone volume and filling your appointment book.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.name} className="bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-xl p-6 hover:border-primary-200 dark:hover:border-primary-700 transition-colors">
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

        <section className="bg-secondary-50 dark:bg-secondary-800/30 py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <Badge variant="outline" className="mb-8">From a chiropractic practice using VocUI</Badge>
              <blockquote className="text-2xl font-semibold text-secondary-900 dark:text-secondary-100 leading-snug mb-6">
                &ldquo;About 60% of our new patient calls were people asking what an adjustment involves or
                whether we take their insurance. VocUI handles all of that now — my receptionist actually
                has time to focus on patients at the desk.&rdquo;
              </blockquote>
              <p className="text-secondary-500 dark:text-secondary-400 text-sm">
                T.M. &mdash; Principal Chiropractor, City Spine Clinic
              </p>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">Who it&apos;s for</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              For chiropractic practices that want their team focused on patient care
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              If your reception team is fielding questions a chatbot could handle, VocUI pays for itself
              the moment your front desk gets their first uninterrupted morning.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
            {verticals.map((v) => {
              const Icon = v.icon;
              return (
                <Card key={v.title} className="border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 hover:shadow-lg hover:border-primary-200 dark:hover:border-primary-700 transition-all duration-200 text-center">
                  <CardHeader className="pb-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-900/50 mx-auto mb-3">
                      <Icon className="h-6 w-6 text-primary-500" aria-hidden="true" />
                    </div>
                    <CardTitle className="text-base leading-snug">{v.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-secondary-500 dark:text-secondary-400 leading-relaxed">{v.description}</p>
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
                { label: 'Chatbot for Optometrists', href: '/chatbot-for-optometrists', description: 'Eye exam booking and product FAQ automation.' },
                { label: 'Chatbot for Therapists', href: '/chatbot-for-therapists', description: 'Service FAQ and appointment scheduling for therapy practices.' },
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
        <section className="container mx-auto px-4 py-20">
          <div className="max-w-3xl mx-auto">
            <div className="rounded-3xl bg-gradient-to-br from-primary-600 to-primary-800 p-12 text-center text-white shadow-xl shadow-primary-500/20">
              <h2 className="text-3xl font-bold mb-4">Your front desk&apos;s time is too valuable for phone tag</h2>
              <p className="text-lg text-white/80 mb-2 max-w-xl mx-auto">
                Give patients instant answers and let your team focus on the people already in your practice.
              </p>
              <p className="text-sm text-white/60 mb-10">
                Free plan available &middot; No credit card required &middot; Live in under an hour
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="xl" variant="secondary" className="bg-white text-primary-600 hover:bg-primary-50 font-semibold" asChild>
                  <Link href="/signup">Build Your Chiropractic Chatbot Free <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link>
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
