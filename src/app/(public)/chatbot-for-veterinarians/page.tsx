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
  Heart,
  PawPrint,
  Stethoscope,
} from 'lucide-react';

export function generateMetadata(): Metadata {
  return {
    title: 'AI Chatbot for Veterinarians | Appointment Booking & Pet Care FAQ | VocUI',
    description:
      'Let an AI chatbot handle appointment booking, pet care FAQs, and after-hours triage for your veterinary practice — 24/7. Reduce phone volume and focus on the animals in your care.',
    keywords: [
      'AI chatbot for veterinarians',
      'vet chatbot',
      'veterinary appointment booking chatbot',
      'pet care FAQ automation',
      'vet clinic chatbot',
    ],
    openGraph: {
      title: 'AI Chatbot for Veterinarians | Appointment Booking & Pet Care FAQ | VocUI',
      description:
        'Let an AI chatbot handle appointment booking, pet care FAQs, and after-hours triage for your veterinary practice — 24/7.',
      url: 'https://vocui.com/chatbot-for-veterinarians',
      siteName: 'VocUI',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'AI Chatbot for Veterinarians | Appointment Booking & Pet Care FAQ | VocUI',
      description:
        'Let an AI chatbot handle appointment booking, pet care FAQs, and after-hours triage for your veterinary practice — 24/7.',
    },
    alternates: { canonical: 'https://vocui.com/chatbot-for-veterinarians' },
    robots: { index: true, follow: true },
  };
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'VocUI — AI Chatbot for Veterinarians',
  applicationCategory: 'MedicalApplication',
  operatingSystem: 'Web',
  description:
    'AI chatbot that handles appointment booking, pet care FAQs, and after-hours triage for veterinary practices — 24/7, trained on your clinic content only.',
  url: 'https://vocui.com/chatbot-for-veterinarians',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', description: 'Free plan available' },
  featureList: [
    'Knowledge base trained on your clinic content',
    'Appointment booking via Easy!Appointments',
    'Pet care and vaccination FAQ automation',
    '24/7 after-hours availability',
    'Emergency triage guidance',
    'GDPR-compliant data handling',
  ],
};

const trustSignals = [
  'Answers pet owner questions 24/7',
  'Trained only on your clinic content',
  'GDPR-compliant data handling',
];

const painPoints: Array<{ icon: ElementType; title: string; body: ReactNode }> = [
  {
    icon: Phone,
    title: 'Repetitive calls about services, prices, and what vaccines are due',
    body: <span>Is my dog due for boosters? Do you treat rabbits? What does a dental clean cost? <a href="https://411locals.us/small-business-owners-dont-answer-62-of-phone-calls/" target="_blank" rel="noopener noreferrer" className="underline decoration-dotted hover:text-primary-500 transition-colors">Small businesses miss 62% of inbound calls</a> — your reception team answers these all day while animals in your waiting room need attention.</span>,
  },
  {
    icon: MoonStar,
    title: 'After-hours emergency questions with nowhere to turn',
    body: <span>A panicked owner searches for a vet at 11pm. <a href="https://www.zocdoc.com/resources/blog/article/2024-what-patients-want/" target="_blank" rel="noopener noreferrer" className="underline decoration-dotted hover:text-primary-500 transition-colors">Nearly half of all healthcare appointments are booked after hours</a> — without instant guidance on whether it&apos;s urgent or can wait, they call a competitor or head to an emergency clinic.</span>,
  },
  {
    icon: AlertCircle,
    title: 'New pet owners overwhelmed before their first visit',
    body: 'First-time pet owners have dozens of questions before they even book. Without a way to answer them instantly, prospects go elsewhere or call your clinic repeatedly before deciding to register.',
  },
];

const steps = [
  {
    step: '01',
    title: 'Train on your clinic',
    description:
      'Upload your service descriptions, vaccination schedules, pricing, and pet care guides. Your chatbot learns your practice inside-out and answers accordingly.',
  },
  {
    step: '02',
    title: 'Configure appointment and triage flows',
    description:
      'Set up booking flows for new and existing patients. Define triage rules so genuinely urgent cases are flagged immediately — the chatbot never diagnoses, it guides.',
  },
  {
    step: '03',
    title: 'Deploy and free your team',
    description:
      'Embed on your website or patient portal. Owners get instant answers; appointment-ready clients book directly into your calendar.',
  },
];

const features = [
  {
    icon: BookOpen,
    name: 'Knowledge base trained on your content',
    description:
      'Your chatbot answers from your approved clinic content only — never invented clinical information or unsupported advice.',
  },
  {
    icon: CalendarCheck,
    name: 'Appointment booking',
    description:
      'Connect to your calendar via Easy!Appointments. New and existing patients book directly from the chat, any time of day.',
  },
  {
    icon: ShieldCheck,
    name: 'Emergency triage guidance',
    description:
      'Help owners determine if their pet needs urgent care or can wait for a routine appointment — reducing unnecessary panic calls.',
  },
  {
    icon: Clock,
    name: 'After-hours availability',
    description:
      'Your chatbot answers at midnight as well as midday. Capture every owner enquiry, even when your clinic is closed.',
  },
  {
    icon: UserCheck,
    name: 'Seamless staff handoff',
    description:
      'Questions needing a clinical or personal touch escalate to your team immediately with the full conversation context ready.',
  },
  {
    icon: Star,
    name: 'Vaccination and wellness reminders',
    description:
      'Provide instant answers about vaccination schedules, preventative care, and annual health checks — reducing repeat enquiry calls.',
  },
];

const verticals = [
  {
    icon: PawPrint,
    title: 'General Practice',
    description:
      'Handle routine check-up bookings, vaccination FAQs, and pricing questions without tying up your reception team.',
  },
  {
    icon: Stethoscope,
    title: 'Emergency Vet',
    description:
      'Provide after-hours triage guidance and direct genuinely urgent cases to the right care pathway immediately.',
  },
  {
    icon: Heart,
    title: 'Exotic Animals',
    description:
      'Answer species-specific care questions and direct exotic pet owners to the right specialist on your team.',
  },
  {
    icon: Star,
    title: 'Specialist Referral',
    description:
      'Guide owners through the referral process, set expectations, and book specialist consultations without phone tag.',
  },
];

export default function ChatbotForVeterinariansPage() {
  return (
    <PageBackground>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header />
      <main id="main-content">
        <section className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center container mx-auto px-4 py-16 text-center">
          <Badge className="mb-6">AI Chatbot for Veterinary Practices</Badge>
          <H1 className="max-w-4xl mb-6">
            Pet owners have questions at every hour.{' '}
            <span className="text-primary-500">Your chatbot can be there when your team can&apos;t.</span>
          </H1>
          <p className="mx-auto max-w-2xl text-lg text-secondary-600 dark:text-secondary-400 mb-10">
            VocUI trains on your clinic FAQs, vaccination schedules, and service descriptions — so your
            reception team spends less time on the phone and more time with animals in the consulting room.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="xl" asChild>
              <Link href="/signup">
                Build Your Vet Chatbot Free
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button size="xl" variant="outline" asChild>
              <Link href="/pricing">See Pricing</Link>
            </Button>
          </div>
          <p className="text-sm text-secondary-500 dark:text-secondary-400">
            Answers owner questions 24/7 &middot; Trained only on your clinic content &middot; GDPR-compliant
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
            <Badge variant="outline" className="mb-4">The reception problem</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              Your team is fielding questions a chatbot could handle
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              Not because your staff is slow. Because there&apos;s no system to handle the same pet owner
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
              Everything a veterinary practice chatbot actually needs
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              Built for vet practices — not a generic widget bolted onto your site. Every feature is aimed
              at reducing phone volume and keeping your team focused on patient care.
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
              <Badge variant="outline" className="mb-8">From a vet practice using VocUI</Badge>
              <blockquote className="text-2xl font-semibold text-secondary-900 dark:text-secondary-100 leading-snug mb-6">
                &ldquo;We used to spend the first hour of every morning returning calls about vaccinations and
                pricing. VocUI handles all of that now — our team walks in and focuses on the animals, not
                the phone queue.&rdquo;
              </blockquote>
              <p className="text-secondary-500 dark:text-secondary-400 text-sm">
                S.B. &mdash; Owner, Westside Veterinary Clinic
              </p>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">Who it&apos;s for</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              For vet practices that want their team focused on patient care
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              If your reception team is fielding questions a chatbot could handle, VocUI pays for itself
              the moment your staff gets their first uninterrupted morning.
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
                { label: 'Chatbot for Pet Grooming', href: '/chatbot-for-pet-grooming', description: 'Appointment booking and breed pricing FAQ for grooming salons.' },
                { label: 'Chatbot for Dentists', href: '/chatbot-for-dentists', description: 'Appointment booking, insurance FAQ, and patient preparation guides.' },
                { label: 'Chatbot for Pharmacies', href: '/chatbot-for-pharmacies', description: 'Prescription FAQ and refill support for pharmacy customers.' },
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
              <h2 className="text-3xl font-bold mb-4">Your team&apos;s time is too valuable for phone tag</h2>
              <p className="text-lg text-white/80 mb-2 max-w-xl mx-auto">
                Give pet owners instant answers and let your team focus on the animals already in your care.
              </p>
              <p className="text-sm text-white/60 mb-10">
                Free plan available &middot; No credit card required &middot; Live in under an hour
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="xl" variant="secondary" className="bg-white text-primary-600 hover:bg-primary-50 font-semibold" asChild>
                  <Link href="/signup">Build Your Vet Chatbot Free <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link>
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
