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
  MoonStar,
  AlertCircle,
  BookOpen,
  CalendarCheck,
  Clock,
  UserCheck,
  ShieldCheck,
  Smile,
  Star,
  Heart,
  Baby,
} from 'lucide-react';

// ─── Metadata ──────────────────────────────────────────────────────────────────

export function generateMetadata(): Metadata {
  return {
    title: 'AI Chatbot for Dentists | Appointment Booking & Patient FAQ | VocUI',
    description:
      'Let an AI chatbot handle appointment booking, insurance questions, and patient FAQs for your dental practice — 24/7. Reduce phone volume and fill your chair.',
    keywords: [
      'AI chatbot for dentists',
      'dental chatbot',
      'appointment booking chatbot',
      'dental practice FAQ chatbot',
      'patient intake automation',
    ],
    openGraph: {
      title: 'AI Chatbot for Dentists | Appointment Booking & Patient FAQ | VocUI',
      description:
        'Let an AI chatbot handle appointment booking, insurance questions, and patient FAQs for your dental practice — 24/7. Reduce phone volume and fill your chair.',
      url: 'https://vocui.com/chatbot-for-dentists',
      siteName: 'VocUI',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'AI Chatbot for Dentists | Appointment Booking & Patient FAQ | VocUI',
      description:
        'Let an AI chatbot handle appointment booking, insurance questions, and patient FAQs for your dental practice — 24/7. Reduce phone volume and fill your chair.',
    },
    alternates: {
      canonical: 'https://vocui.com/chatbot-for-dentists',
    },
    robots: { index: true, follow: true },
  };
}

// ─── Structured Data ───────────────────────────────────────────────────────────

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'VocUI — AI Chatbot for Dentists',
  applicationCategory: 'MedicalApplication',
  operatingSystem: 'Web',
  description:
    'AI chatbot that handles appointment booking, insurance FAQs, and patient preparation questions for dental practices — 24/7, trained on your practice content only.',
  url: 'https://vocui.com/chatbot-for-dentists',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    description: 'Free plan available',
  },
  featureList: [
    'Knowledge base trained on your practice content',
    'Appointment booking via Easy!Appointments',
    'Insurance and payment FAQ automation',
    '24/7 after-hours availability',
    'Patient handoff with full conversation context',
    'GDPR-compliant data handling',
  ],
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Can VocUI's chatbot answer questions about dental insurance and accepted plans?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, you train it on your accepted insurers list and payment FAQ. It answers insurance queries 24/7 so your front desk isn't on the phone before the first patient arrives."
      }
    },
    {
      "@type": "Question",
      "name": "Will the chatbot book dental appointments directly?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, via Easy!Appointments integration. New and returning patients can book check-ups, hygiene appointments, and consultations directly from the chat at any time."
      }
    },
    {
      "@type": "Question",
      "name": "Can the chatbot explain what to expect before a dental procedure?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Upload your pre-appointment guides — what to eat, what to bring, what the procedure involves — and the chatbot shares them automatically when patients ask."
      }
    },
    {
      "@type": "Question",
      "name": "Does VocUI give clinical advice or diagnose dental conditions?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. VocUI only answers from content you approve and upload. It never invents clinical information, diagnoses conditions, or recommends treatments — it directs clinical questions to your team."
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
      "name": "AI Chatbot for Dentists",
      "item": "https://vocui.com/chatbot-for-dentists"
    }
  ]
};



// ─── Data ──────────────────────────────────────────────────────────────────────

const trustSignals = [
  'Answers patient questions 24/7',
  'Trained only on your practice content',
  'GDPR-compliant data handling',
];

const painPoints: Array<{ icon: ElementType; title: string; body: ReactNode }> = [
  {
    icon: Phone,
    title: 'Repetitive calls about hours, insurance, and what to expect',
    body: <span>Do you accept my insurance? What should I eat before a filling? How long does a crown take? <a href="https://411locals.us/small-business-owners-dont-answer-62-of-phone-calls/" target="_blank" rel="noopener noreferrer" className="underline decoration-dotted hover:text-primary-500 transition-colors">Small businesses miss 62% of inbound calls</a> — your front desk fields the same questions all day, time that could be spent on patients already in the chair.</span>,
  },
  {
    icon: MoonStar,
    title: 'After-hours patients research and pick someone else',
    body: 'A patient with a toothache searches for a dentist at 9pm. Without instant answers on your site, they book with the practice that replies first — even if that\'s a competitor.',
  },
  {
    icon: AlertCircle,
    title: 'No-shows from unanswered preparation questions',
    body: 'Patients who don\'t know how to prepare for a procedure — whether to eat, what to bring, or what to expect — are more likely to cancel or no-show. Clear, instant answers before the visit reduces that.',
  },
];

const steps = [
  {
    step: '01',
    title: 'Train on your practice',
    description:
      'Upload your service descriptions, insurance FAQs, pre-appointment instructions, and pricing. Your chatbot learns your practice inside-out and answers accordingly.',
  },
  {
    step: '02',
    title: 'Configure patient flows',
    description:
      'Set up booking flows for new and returning patients. Define escalation rules so complex clinical questions route straight to your team — the chatbot never oversteps its scope.',
  },
  {
    step: '03',
    title: 'Deploy and fill your schedule',
    description:
      'Embed on your website or patient portal. Visitors get instant answers; ready-to-book patients get routed directly to your appointment calendar.',
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
      'Answer accepted insurance plans, payment options, and financing questions automatically — reducing call volume at the front desk.',
  },
  {
    icon: Clock,
    name: 'After-hours availability',
    description:
      'Your chatbot answers at midnight as well as at midday. Capture every patient inquiry, even when your practice is closed.',
  },
  {
    icon: UserCheck,
    name: 'Seamless staff handoff',
    description:
      'Questions that need a clinical or personal touch escalate immediately to your team with the full conversation context ready.',
  },
  {
    icon: Star,
    name: 'Pre-appointment preparation guides',
    description:
      'Share the right preparation instructions automatically — what to eat, what to bring, what to expect — reducing no-shows before they happen.',
  },
];

const verticals = [
  {
    icon: Smile,
    title: 'General Dentistry',
    description:
      'Handle check-up bookings, treatment FAQs, and insurance queries without tying up your reception team.',
  },
  {
    icon: Star,
    title: 'Orthodontics',
    description:
      'Answer braces vs. aligners questions, treatment duration, and initial consultation booking automatically.',
  },
  {
    icon: Heart,
    title: 'Cosmetic Dentistry',
    description:
      'Qualify veneer, whitening, and smile design inquiries, and route serious prospects to consultation booking.',
  },
  {
    icon: Baby,
    title: 'Pediatric Dentistry',
    description:
      'Ease parent anxiety with clear first-visit FAQs and child-friendly preparation guides available around the clock.',
  },
];

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ChatbotForDentistsPage() {
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
            <li className="text-secondary-900 dark:text-secondary-100 font-medium">AI Chatbot for Dentists</li>
          </ol>
        </nav>


        {/* ── Hero ────────────────────────────────────────────────────────────── */}
        <section className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center container mx-auto px-4 py-16 text-center">
          <Badge className="mb-6">AI Chatbot for Dental Practices</Badge>

          <H1 className="max-w-4xl mb-6">
            Your patients ask the same questions before every appointment.{' '}
            <span className="text-primary-500">Your chatbot can answer them.</span>
          </H1>

          <p className="mx-auto max-w-2xl text-lg text-secondary-600 dark:text-secondary-400 mb-10">
            VocUI trains on your practice FAQs, insurance details, and service descriptions — so
            your front desk spends less time on the phone and more time with patients in the chair.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="xl" asChild>
              <Link href="/signup">
                Build Your Dental Chatbot Free
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
              Your reception team is answering questions a chatbot could handle
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              Not because your staff is slow. Because there&apos;s no system to handle the same
              patient questions that arrive every single day — so it all falls on your front desk.
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
                Live before your next patient check-in. No developers needed.
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
              Everything a dental practice chatbot actually needs
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              Built for dental practices — not a generic widget bolted onto your site.
              Every feature is aimed at reducing phone volume and filling your appointment book.
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

        {/* ── How Businesses Use VocUI ────────────────────────────────────────── */}
        <section className="bg-secondary-50 dark:bg-secondary-800/30 py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-10">
                <Badge variant="outline" className="mb-4">How dental practices use VocUI</Badge>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
                  A typical week, before and after VocUI
                </h2>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  { step: 'Before', text: 'Receptionist fielding the same 20 insurance and pre-appointment questions every morning by phone — patients waiting at the desk while calls ran long.' },
                  { step: 'Setup', text: 'Uploaded their practice FAQ, accepted insurance list, and pre-appointment instructions PDF — configured in 45 minutes.' },
                  { step: 'After', text: 'New patients get insurance answers at 10pm. Phone enquiries noticeably down. Front desk focused on check-ins and in-person care.' },
                ].map((item) => (
                  <div key={item.step} className="bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-xl p-5">
                    <p className="text-xs font-semibold uppercase tracking-widest text-primary-600 dark:text-primary-400 mb-2">{item.step}</p>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400 leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Who It's For ────────────────────────────────────────────────────── */}
        <section className="container mx-auto px-4 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">Who it&apos;s for</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              For dental practices that want their team focused on patient care
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              If your reception team is fielding questions a chatbot could handle, VocUI pays for
              itself the moment your front desk gets their first uninterrupted morning.
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

        {/* ── Related Industries ──────────────────────────────────────────────── */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-6">Related industries</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: 'Chatbot for Chiropractors', href: '/chatbot-for-chiropractors', description: 'New patient intake, treatment FAQ, and appointment booking.' },
                { label: 'Chatbot for Optometrists', href: '/chatbot-for-optometrists', description: 'Eye exam booking and product FAQ automation.' },
                { label: 'Chatbot for Therapists', href: '/chatbot-for-therapists', description: 'Service FAQ and appointment scheduling for therapy practices.' },
                { label: 'Chatbot for Plastic Surgeons', href: '/chatbot-for-plastic-surgeons', description: 'Procedure FAQ and consultation booking for aesthetic practices.' },
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
                Your front desk&apos;s time is too valuable for phone tag
              </h2>
              <p className="text-lg text-white/80 mb-2 max-w-xl mx-auto">
                Give patients instant answers and let your team focus on the people already in your practice.
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
                    Build Your Dental Chatbot Free
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

        {/* ── Author Attribution ──────────────────────────────────────────── */}
        <div className="container mx-auto px-4 pb-8">
          <p className="text-xs text-secondary-400 dark:text-secondary-500 text-center">
            Written by the VocUI team &middot; Last reviewed April 2026 &middot;{' '}
            <Link href="/about" className="underline decoration-dotted hover:text-primary-500 transition-colors">
              About VocUI
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </PageBackground>
  );
}
