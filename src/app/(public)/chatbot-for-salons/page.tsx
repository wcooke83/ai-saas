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
  BookOpen, CalendarCheck, Clock, UserCheck, Scissors,
  Sparkles, Star, Palette, Heart,
} from 'lucide-react';

export function generateMetadata(): Metadata {
  return {
    title: 'AI Chatbot for Salons | Appointment Booking & Services FAQ | VocUI',
    description: 'Let an AI chatbot handle appointment booking, services FAQ, and pricing enquiries for your salon — 24/7. Keep your stylists focused on clients, not the phone.',
    keywords: ['AI chatbot for salons', 'salon chatbot', 'appointment booking chatbot', 'hair salon FAQ automation'],
    openGraph: { title: 'AI Chatbot for Salons | Appointment Booking & Services FAQ | VocUI', description: 'Let an AI chatbot handle appointment booking, services FAQ, and pricing enquiries for your salon — 24/7.', url: 'https://vocui.com/chatbot-for-salons', siteName: 'VocUI', type: 'website' },
    twitter: { card: 'summary_large_image', title: 'AI Chatbot for Salons | Appointment Booking & Services FAQ | VocUI', description: 'Let an AI chatbot handle appointment booking, services FAQ, and pricing enquiries for your salon — 24/7.' },
    alternates: { canonical: 'https://vocui.com/chatbot-for-salons' },
    robots: { index: true, follow: true },
  };
}

const jsonLd = { '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: 'VocUI — AI Chatbot for Salons', applicationCategory: 'BusinessApplication', operatingSystem: 'Web', description: 'AI chatbot handling appointment booking, services FAQ, and pricing enquiries for salons — 24/7.', url: 'https://vocui.com/chatbot-for-salons', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', description: 'Free plan available' }, featureList: ['Appointment booking', 'Services & pricing FAQ', 'Stylist FAQ', '24/7 availability', 'Salon escalation', 'GDPR-compliant data handling'] };

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Can the chatbot explain hair colouring services and price ranges?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Upload your service menu with descriptions and starting prices — balayage, highlights, full colour, toners — and the chatbot answers client questions automatically before they call to book."
      }
    },
    {
      "@type": "Question",
      "name": "Will VocUI book salon appointments?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, via Easy!Appointments. Clients can book cuts, colour appointments, and treatments directly from the chat, any time — reducing the number of calls your reception team fields each day."
      }
    },
    {
      "@type": "Question",
      "name": "Can the chatbot answer questions about hair consultation requirements?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. If you require a colour consultation before certain services, the chatbot explains why and routes clients to book a consultation first."
      }
    },
    {
      "@type": "Question",
      "name": "Does the chatbot handle questions about patch tests for hair colour?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Train it on your patch test policy and timing requirements, and it proactively shares this information with clients enquiring about colour services — reducing no-shows from unprepared clients."
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
      "name": "AI Chatbot for Salons",
      "item": "https://vocui.com/chatbot-for-salons"
    }
  ]
};


const trustSignals = ['Books appointments 24/7', 'Trained only on your salon content', 'GDPR-compliant data handling'];
const painPoints: Array<{ icon: ElementType; title: string; body: ReactNode }> = [
  { icon: Phone, title: 'Stylists interrupted mid-appointment to answer the phone', body: 'How much does a balayage cost? Do you do extensions? Can I book with a specific stylist? These questions arrive constantly — and when your stylists are with a client, every call is an interruption that affects the service they\'re delivering.' },
  { icon: MoonStar, title: 'After-hours booking requests going to competitors', body: <span>Clients often think about their hair at the end of the day. Without a way to book or get pricing outside business hours, they search for a salon that responds — and that's often not you. <a href="https://www.salesloft.com/resources/guides/conversational-ai-marketing-trends-report" target="_blank" rel="noopener noreferrer" className="underline decoration-dotted hover:text-primary-500 transition-colors">41% of all appointments are booked outside standard business hours.</a></span> },
  { icon: AlertCircle, title: 'Clients uncertain about pricing going elsewhere before they call', body: 'Clients who aren\'t sure what something costs often don\'t call to ask — they go to whoever makes it easiest to find out. A chatbot that answers pricing questions transparently converts more browsers into bookings.' },
];
const steps = [
  { step: '01', title: 'Train on your salon', description: 'Upload your service menu, pricing, stylist profiles, and FAQ. Your chatbot knows your salon and answers every question confidently.' },
  { step: '02', title: 'Configure booking flows', description: 'Set up appointment booking for each service type and stylist. Define escalation for complex colour consultations your team needs to handle personally.' },
  { step: '03', title: 'Deploy and keep your chairs full', description: 'Embed on your website. Clients get instant answers; those ready to book go straight to your appointment calendar.' },
];
const features = [
  { icon: BookOpen, name: 'Services and pricing FAQ', description: 'Answer questions about every service you offer — cuts, colour, treatments, and pricing — so clients know what to expect before they book.' },
  { icon: CalendarCheck, name: 'Appointment booking', description: 'Connect to your calendar via Easy!Appointments. Clients book directly from the chat, 24 hours a day, 7 days a week.' },
  { icon: Star, name: 'Stylist FAQ', description: 'Help clients choose the right stylist based on specialisms — colour, cutting, extensions — so every booking is the right match.' },
  { icon: Clock, name: 'After-hours availability', description: 'Your chatbot books appointments at midnight as well as midday. Never lose a booking because your salon was closed when the client was ready.' },
  { icon: UserCheck, name: 'Seamless salon escalation', description: 'Complex colour consultations and specialist requests escalate to the right stylist with full context — no lost details, no double-handling.' },
  { icon: Palette, name: 'Colour consultation intake', description: 'Collect hair history, goals, and inspiration references before a colour consultation — so your stylist arrives prepared, not starting from scratch.' },
];
const verticals = [
  { icon: Scissors, title: 'Hair Salons', description: 'Handle cut, colour, and treatment bookings and answer every service FAQ without interrupting your stylists.' },
  { icon: Sparkles, title: 'Nail Salons', description: 'Manage nail appointment bookings, answer treatment FAQ, and capture after-hours enquiries automatically.' },
  { icon: Star, title: 'Barber Shops', description: 'Handle walk-in FAQ, appointment bookings, and service pricing questions — keeping the barber focused on the chair.' },
  { icon: Heart, title: 'Beauty & Spa', description: 'Answer treatment questions, book appointments, and handle multi-service enquiries for combined beauty and spa offerings.' },
];

export default function ChatbotForSalonsPage() {
  return (
    <PageBackground>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <Header />
      <main id="main-content">
        <nav aria-label="Breadcrumb" className="container mx-auto px-4 pt-6 pb-2">
          <ol className="flex items-center gap-2 text-sm text-secondary-500 dark:text-secondary-400">
            <li><Link href="/" className="hover:text-primary-500 transition-colors">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href="/industries" className="hover:text-primary-500 transition-colors">Industries</Link></li>
            <li aria-hidden="true">/</li>
            <li className="text-secondary-900 dark:text-secondary-100 font-medium">AI Chatbot for Salons</li>
          </ol>
        </nav>

        <section className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center container mx-auto px-4 py-16 text-center">
          <Badge className="mb-6">AI Chatbot for Salons</Badge>
          <H1 className="max-w-4xl mb-6">Your stylists should be focused on clients. <span className="text-primary-500">Not on the phone.</span></H1>
          <p className="mx-auto max-w-2xl text-lg text-secondary-600 dark:text-secondary-400 mb-10">VocUI trains on your services, pricing, and stylist profiles — so clients get instant answers and book appointments without your team being interrupted mid-service.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="xl" asChild><Link href="/signup">Build Your Salon Chatbot Free<ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link></Button>
            <Button size="xl" variant="outline" asChild><Link href="/pricing">See Pricing</Link></Button>
          </div>
          <p className="text-sm text-secondary-500 dark:text-secondary-400">Books appointments 24/7 &middot; Trained only on your salon content &middot; GDPR-compliant</p>
        </section>
        <section className="border-y border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-800/50 py-6">
          <div className="container mx-auto px-4"><div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">{trustSignals.map((signal) => (<div key={signal} className="flex items-center gap-2 text-sm text-secondary-600 dark:text-secondary-400"><CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" aria-hidden="true" /><span>{signal}</span></div>))}</div></div>
        </section>
        <section className="container mx-auto px-4 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16"><Badge variant="outline" className="mb-4">The salon problem</Badge><h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">Your team is handling questions a chatbot could answer</h2><p className="text-secondary-600 dark:text-secondary-400">Not because your stylists are slow. Because there&apos;s no system to handle client questions without interrupting the person in the chair — so the phone always wins.</p></div>
          <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">{painPoints.map((p) => { const Icon = p.icon; return (<div key={p.title} className="bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-xl p-6 hover:border-primary-200 dark:hover:border-primary-700 transition-colors"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 dark:bg-red-900/20 mb-4"><Icon className="h-5 w-5 text-red-500" aria-hidden="true" /></div><h3 className="font-semibold text-secondary-900 dark:text-secondary-100 mb-2">{p.title}</h3><p className="text-sm text-secondary-600 dark:text-secondary-400 leading-relaxed">{p.body}</p></div>); })}</div>
        </section>
        <section id="how-it-works" className="bg-secondary-50 dark:bg-secondary-800/30 py-24">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16"><Badge variant="outline" className="mb-4">How it works</Badge><h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100">Live before your next appointment booking. No developers needed.</h2></div>
            <div className="grid gap-10 md:grid-cols-3 max-w-5xl mx-auto relative">
              <div className="hidden md:block absolute top-8 left-[calc(16.67%+1.5rem)] right-[calc(16.67%+1.5rem)] h-px bg-secondary-200 dark:bg-secondary-700" aria-hidden="true" />
              {steps.map((s) => (<div key={s.step} className="relative text-center flex flex-col items-center"><div className="w-16 h-16 rounded-full bg-primary-500 text-white font-bold text-lg flex items-center justify-center mb-6 z-10 shadow-lg shadow-primary-500/25">{s.step}</div><h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-3">{s.title}</h3><p className="text-sm text-secondary-600 dark:text-secondary-400 leading-relaxed max-w-xs">{s.description}</p></div>))}
            </div>
            <div className="text-center mt-14"><Button size="xl" asChild><Link href="/signup">Start Building Free <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link></Button></div>
          </div>
        </section>
        <section className="container mx-auto px-4 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16"><Badge variant="outline" className="mb-4">Features</Badge><h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">Everything a salon chatbot actually needs</h2><p className="text-secondary-600 dark:text-secondary-400">Built for salons — not a generic booking tool. Every feature is aimed at keeping your chairs full and your stylists undistracted.</p></div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">{features.map((f) => { const Icon = f.icon; return (<div key={f.name} className="bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-xl p-6 hover:border-primary-200 dark:hover:border-primary-700 transition-colors"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-900/50 mb-4"><Icon className="h-4 w-4 text-primary-500" aria-hidden="true" /></div><h3 className="font-semibold text-secondary-900 dark:text-secondary-100 mb-1">{f.name}</h3><p className="text-sm text-secondary-600 dark:text-secondary-400 leading-relaxed">{f.description}</p></div>); })}</div>
        </section>
        {/* ── How Businesses Use VocUI ────────────────────────────────────────── */}
        <section className="bg-secondary-50 dark:bg-secondary-800/30 py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-10">
                <Badge variant="outline" className="mb-4">How salons use VocUI</Badge>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
                  A typical week, before and after VocUI
                </h2>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  { step: 'Before', text: 'Stylists stepping away from clients to answer calls about pricing, availability, and service times — disrupting appointments and frustrating guests already in the chair.' },
                  { step: 'Setup', text: 'Uploaded their services and pricing menu, stylist profiles, booking policy, and preparation guide — live on their website and booking page.' },
                  { step: 'After', text: 'Pricing and service questions answered automatically. Phone interruptions during appointments dropped. More bookings taken without adding admin staff.' },
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
        <section className="container mx-auto px-4 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16"><Badge variant="outline" className="mb-4">Who it&apos;s for</Badge><h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">For salons that want their team focused on the client in the chair</h2><p className="text-secondary-600 dark:text-secondary-400">If your stylists are fielding questions a chatbot could handle, VocUI pays for itself the moment your salon gets through a full day without a phone interruption.</p></div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">{verticals.map((v) => { const Icon = v.icon; return (<Card key={v.title} className="border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 hover:shadow-lg hover:border-primary-200 dark:hover:border-primary-700 transition-all duration-200 text-center"><CardHeader className="pb-2"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-900/50 mx-auto mb-3"><Icon className="h-6 w-6 text-primary-500" aria-hidden="true" /></div><CardTitle className="text-base leading-snug">{v.title}</CardTitle></CardHeader><CardContent><p className="text-xs text-secondary-500 dark:text-secondary-400 leading-relaxed">{v.description}</p></CardContent></Card>); })}</div>
        </section>
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-6">Related industries</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: 'Chatbot for Spas', href: '/chatbot-for-spas', description: 'Treatment booking and pricing FAQ for day spas and wellness centres.' },
                { label: 'Chatbot for Pet Grooming', href: '/chatbot-for-pet-grooming', description: 'Appointment booking and breed pricing FAQ for grooming salons.' },
                { label: 'Chatbot for Gyms', href: '/chatbot-for-gyms', description: 'Membership FAQ and class booking for gym businesses.' },
                { label: 'Chatbot for Fitness Studios', href: '/chatbot-for-fitness-studios', description: 'Class booking and membership FAQ for boutique fitness studios.' },
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
              <h2 className="text-3xl font-bold mb-4">Your stylists&apos; time is too valuable for phone interruptions</h2>
              <p className="text-lg text-white/80 mb-2 max-w-xl mx-auto">Give clients instant answers and keep your team focused on delivering great service.</p>
              <p className="text-sm text-white/60 mb-10">Free plan available &middot; No credit card required &middot; Live in under an hour</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="xl" variant="secondary" className="bg-white text-primary-600 hover:bg-primary-50 font-semibold" asChild><Link href="/signup">Build Your Salon Chatbot Free <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link></Button>
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
