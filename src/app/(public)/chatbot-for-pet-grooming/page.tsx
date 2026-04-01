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
  ArrowRight, CheckCircle2, Phone, MoonStar, AlertCircle,
  BookOpen, CalendarCheck, Clock, UserCheck, PawPrint,
  Scissors, Star, Car, Heart,
} from 'lucide-react';

export function generateMetadata(): Metadata {
  return {
    title: 'AI Chatbot for Pet Grooming | Appointment Booking & Services FAQ | VocUI',
    description: 'Let an AI chatbot handle appointment bookings, services FAQ, and breed-specific pricing for your pet grooming salon — 24/7. Keep groomers focused on pets, not the phone.',
    keywords: ['AI chatbot for pet grooming', 'pet grooming chatbot', 'grooming appointment booking', 'pet salon FAQ automation'],
    openGraph: { title: 'AI Chatbot for Pet Grooming | Appointment Booking & Services FAQ | VocUI', description: 'Let an AI chatbot handle appointment bookings, services FAQ, and breed-specific pricing — 24/7.', url: 'https://vocui.com/chatbot-for-pet-grooming', siteName: 'VocUI', type: 'website' },
    twitter: { card: 'summary_large_image', title: 'AI Chatbot for Pet Grooming | Appointment Booking & Services FAQ | VocUI', description: 'Let an AI chatbot handle appointment bookings, services FAQ, and breed-specific pricing — 24/7.' },
    alternates: { canonical: 'https://vocui.com/chatbot-for-pet-grooming' },
    robots: { index: true, follow: true },
  };
}

const jsonLd = { '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: 'VocUI — AI Chatbot for Pet Grooming', applicationCategory: 'BusinessApplication', operatingSystem: 'Web', description: 'AI chatbot handling appointment bookings, services FAQ, and breed pricing for pet grooming salons — 24/7.', url: 'https://vocui.com/chatbot-for-pet-grooming', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', description: 'Free plan available' }, featureList: ['Appointment booking', 'Services FAQ', 'Breed pricing FAQ', '24/7 availability', 'Groomer escalation', 'GDPR-compliant data handling'] };

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What can VocUI's AI chatbot do for Pet Grooming?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Let an AI chatbot handle appointment bookings, services FAQ, and breed-specific pricing for your pet grooming salon \u2014 24/7. Keep groomers focused on pets, not the phone."
      }
    },
    {
      "@type": "Question",
      "name": "How long does it take to set up VocUI for Pet Grooming?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Most Pet Grooming get set up in under an hour. Upload your existing content -- service descriptions, FAQs, pricing pages, or PDFs -- and VocUI trains the chatbot automatically. Embed it on your website with a single snippet."
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
      "name": "How is VocUI different from a generic chatbot for Pet Grooming?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Unlike generic chatbots, VocUI is trained exclusively on your own content -- your service descriptions, policies, FAQs, and documents. It only answers questions relevant to your Pet Grooming business and escalates to your team when it cannot help, with full conversation context included."
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
      "name": "AI Chatbot for Pet Grooming",
      "item": "https://vocui.com/chatbot-for-pet-grooming"
    }
  ]
};


const trustSignals = ['Books appointments 24/7', 'Trained only on your salon content', 'GDPR-compliant data handling'];
const painPoints: Array<{ icon: ElementType; title: string; body: ReactNode }> = [
  { icon: Phone, title: 'Groomers interrupted mid-session to answer the phone', body: 'How much to groom a Labrador? Do you do cats? Can I book for next Saturday? These questions arrive when your groomers are mid-clip — every phone call means a distracted groomer and a slightly less happy pet.' },
  { icon: MoonStar, title: 'After-hours booking requests lost to competitors', body: <span>Pet owners often think about grooming in the evenings, after they notice their dog needs a trim. Without a way to book at 9pm, they search for whoever takes bookings online — and that's often a competitor with a chatbot. <a href="https://www.salesloft.com/resources/guides/conversational-ai-marketing-trends-report" target="_blank" rel="noopener noreferrer" className="underline decoration-dotted hover:text-primary-500 transition-colors">41% of all bookings happen outside standard business hours.</a></span> },
  { icon: AlertCircle, title: 'Breed-specific pricing questions blocking bookings before they happen', body: 'Owners of larger or double-coated breeds often don\'t book without knowing the price first. A chatbot that answers breed-specific pricing instantly removes that barrier and converts more enquiries into appointments.' },
];
const steps = [
  { step: '01', title: 'Train on your salon', description: 'Upload your service menu, breed pricing, preparation guides, and FAQ. Your chatbot knows your salon and answers every question confidently.' },
  { step: '02', title: 'Configure booking flows', description: 'Set up appointment booking by service type and breed. Define which questions — like aggression or special needs — require your team\'s personal input.' },
  { step: '03', title: 'Deploy and keep your diary full', description: 'Embed on your website. Pet owners get instant answers; those ready to book go straight into your appointment calendar.' },
];
const features = [
  { icon: BookOpen, name: 'Services and pricing FAQ', description: 'Answer questions about every grooming service you offer — bath, trim, full groom — and your breed-specific pricing automatically.' },
  { icon: CalendarCheck, name: 'Appointment booking', description: 'Connect to your calendar via Easy!Appointments. Pet owners book appointments directly from the chat, 24 hours a day.' },
  { icon: PawPrint, name: 'Breed pricing FAQ', description: 'Answer pricing questions for specific breeds automatically — removing the most common barrier between enquiry and booking.' },
  { icon: Clock, name: 'After-hours availability', description: 'Your chatbot books appointments at midnight as well as midday. Never lose a booking because a pet owner thought of it after hours.' },
  { icon: UserCheck, name: 'Groomer escalation', description: 'Pets with special needs, health conditions, or anxiety flags escalate to your team with full context — so no animal arrives without proper preparation.' },
  { icon: Star, name: 'Preparation guide delivery', description: 'Automatically share what owners should do before a grooming appointment — fasting guidelines, matted coat advice, what to bring — reducing no-shows and appointment time.' },
];
const verticals = [
  { icon: Scissors, title: 'Dog Grooming', description: 'Handle all breeds, all services, and all booking types with instant breed-specific FAQ and pricing.' },
  { icon: PawPrint, title: 'Cat Grooming', description: 'Answer cat-specific grooming FAQ and booking enquiries for owners who often struggle to find specialist cat groomers.' },
  { icon: Car, title: 'Mobile Grooming', description: 'Handle location FAQ, service area enquiries, and booking requests for mobile grooming services.' },
  { icon: Heart, title: 'Breed Specialist', description: 'Answer specialist breed FAQ — Poodles, Doodles, Show Spaniels — and manage bookings for specialist grooming services.' },
];

export default function ChatbotForPetGroomingPage() {
  return (
    <PageBackground>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <Header />
      <main id="main-content">
        <section className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center container mx-auto px-4 py-16 text-center">
          <Badge className="mb-6">AI Chatbot for Pet Grooming Salons</Badge>
          <H1 className="max-w-4xl mb-6">Your groomers should be focused on pets. <span className="text-primary-500">Not on answering the phone.</span></H1>
          <p className="mx-auto max-w-2xl text-lg text-secondary-600 dark:text-secondary-400 mb-10">VocUI trains on your services, breed pricing, and booking process — so pet owners get instant answers and book appointments without interrupting your groomers mid-clip.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="xl" asChild><Link href="/signup">Build Your Grooming Chatbot Free<ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link></Button>
            <Button size="xl" variant="outline" asChild><Link href="/pricing">See Pricing</Link></Button>
          </div>
          <p className="text-sm text-secondary-500 dark:text-secondary-400">Books appointments 24/7 &middot; Trained only on your salon content &middot; GDPR-compliant</p>
        </section>
        <section className="border-y border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-800/50 py-6">
          <div className="container mx-auto px-4"><div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">{trustSignals.map((signal) => (<div key={signal} className="flex items-center gap-2 text-sm text-secondary-600 dark:text-secondary-400"><CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" aria-hidden="true" /><span>{signal}</span></div>))}</div></div>
        </section>
        <section className="container mx-auto px-4 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16"><Badge variant="outline" className="mb-4">The grooming salon problem</Badge><h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">Your groomers are answering questions a chatbot could handle</h2><p className="text-secondary-600 dark:text-secondary-400">Not because your team isn&apos;t efficient. Because without a way to handle routine booking and pricing questions automatically, every call interrupts the work your groomers are actually there to do.</p></div>
          <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">{painPoints.map((p) => { const Icon = p.icon; return (<div key={p.title} className="bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-xl p-6 hover:border-primary-200 dark:hover:border-primary-700 transition-colors"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 dark:bg-red-900/20 mb-4"><Icon className="h-5 w-5 text-red-500" aria-hidden="true" /></div><h3 className="font-semibold text-secondary-900 dark:text-secondary-100 mb-2">{p.title}</h3><p className="text-sm text-secondary-600 dark:text-secondary-400 leading-relaxed">{p.body}</p></div>); })}</div>
        </section>
        <section id="how-it-works" className="bg-secondary-50 dark:bg-secondary-800/30 py-24">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16"><Badge variant="outline" className="mb-4">How it works</Badge><h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100">Set up in under an hour. No developers needed.</h2></div>
            <div className="grid gap-10 md:grid-cols-3 max-w-5xl mx-auto relative">
              <div className="hidden md:block absolute top-8 left-[calc(16.67%+1.5rem)] right-[calc(16.67%+1.5rem)] h-px bg-secondary-200 dark:bg-secondary-700" aria-hidden="true" />
              {steps.map((s) => (<div key={s.step} className="relative text-center flex flex-col items-center"><div className="w-16 h-16 rounded-full bg-primary-500 text-white font-bold text-lg flex items-center justify-center mb-6 z-10 shadow-lg shadow-primary-500/25">{s.step}</div><h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-3">{s.title}</h3><p className="text-sm text-secondary-600 dark:text-secondary-400 leading-relaxed max-w-xs">{s.description}</p></div>))}
            </div>
            <div className="text-center mt-14"><Button size="xl" asChild><Link href="/signup">Start Building Free <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link></Button></div>
          </div>
        </section>
        <section className="container mx-auto px-4 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16"><Badge variant="outline" className="mb-4">Features</Badge><h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">Everything a pet grooming chatbot actually needs</h2><p className="text-secondary-600 dark:text-secondary-400">Built for grooming salons — not a generic booking form. Every feature keeps your diary full and your groomers focused on the pets in front of them.</p></div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">{features.map((f) => { const Icon = f.icon; return (<div key={f.name} className="bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-xl p-6 hover:border-primary-200 dark:hover:border-primary-700 transition-colors"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-900/50 mb-4"><Icon className="h-4 w-4 text-primary-500" aria-hidden="true" /></div><h3 className="font-semibold text-secondary-900 dark:text-secondary-100 mb-1">{f.name}</h3><p className="text-sm text-secondary-600 dark:text-secondary-400 leading-relaxed">{f.description}</p></div>); })}</div>
        </section>
        <section className="bg-secondary-50 dark:bg-secondary-800/30 py-24">
          <div className="container mx-auto px-4"><div className="max-w-3xl mx-auto text-center"><Badge variant="outline" className="mb-8">From a pet grooming salon using VocUI</Badge><blockquote className="text-2xl font-semibold text-secondary-900 dark:text-secondary-100 leading-snug mb-6">&ldquo;I was putting down my scissors ten times a day to answer pricing questions. VocUI handles all of that now — my phone barely rings during working hours and my diary is fuller than it&apos;s ever been.&rdquo;</blockquote><p className="text-secondary-500 dark:text-secondary-400 text-sm">T.F. &mdash; Owner, Pawfect Grooming Studio</p></div></div>
        </section>
        <section className="container mx-auto px-4 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16"><Badge variant="outline" className="mb-4">Who it&apos;s for</Badge><h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">For grooming salons that want their groomers focused on pets, not phones</h2><p className="text-secondary-600 dark:text-secondary-400">If your groomers are fielding booking and pricing questions a chatbot could handle, VocUI pays for itself the moment your salon gets through a full day without a single phone interruption.</p></div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">{verticals.map((v) => { const Icon = v.icon; return (<Card key={v.title} className="border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 hover:shadow-lg hover:border-primary-200 dark:hover:border-primary-700 transition-all duration-200 text-center"><CardHeader className="pb-2"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-900/50 mx-auto mb-3"><Icon className="h-6 w-6 text-primary-500" aria-hidden="true" /></div><CardTitle className="text-base leading-snug">{v.title}</CardTitle></CardHeader><CardContent><p className="text-xs text-secondary-500 dark:text-secondary-400 leading-relaxed">{v.description}</p></CardContent></Card>); })}</div>
        </section>
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-6">Related industries</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: 'Chatbot for Veterinarians', href: '/chatbot-for-veterinarians', description: 'Appointment booking, pet care FAQ, and after-hours triage.' },
                { label: 'Chatbot for Salons', href: '/chatbot-for-salons', description: 'Appointment booking and services FAQ for hair and beauty salons.' },
                { label: 'Chatbot for Spas', href: '/chatbot-for-spas', description: 'Treatment booking and pricing FAQ for day spas and wellness centres.' },
                { label: 'Chatbot for Cleaning Services', href: '/chatbot-for-cleaning-services', description: 'Booking and pricing FAQ for cleaning and property services.' },
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
              <h2 className="text-3xl font-bold mb-4">Your groomers&apos; hands belong on pets, not phones</h2>
              <p className="text-lg text-white/80 mb-2 max-w-xl mx-auto">Give pet owners instant answers and let your team focus on delivering the grooms your clients trust you for.</p>
              <p className="text-sm text-white/60 mb-10">Free plan available &middot; No credit card required &middot; Live in under an hour</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="xl" variant="secondary" className="bg-white text-primary-600 hover:bg-primary-50 font-semibold" asChild><Link href="/signup">Build Your Grooming Chatbot Free <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link></Button>
                <Button size="xl" variant="outline-light" asChild><Link href="/pricing">See Pricing</Link></Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </PageBackground>
  );
}
