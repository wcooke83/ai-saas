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
  BookOpen, CalendarCheck, Clock, UserCheck, Droplets,
  Sparkles, Star, Heart, Leaf,
} from 'lucide-react';

export function generateMetadata(): Metadata {
  return {
    title: 'AI Chatbot for Spas | Treatment Booking & Pricing FAQ | VocUI',
    description: 'Let an AI chatbot handle treatment bookings, pricing FAQs, and after-hours enquiries for your spa — 24/7. Keep your therapists focused on clients, not the phone.',
    keywords: ['AI chatbot for spas', 'spa chatbot', 'treatment booking automation', 'spa pricing FAQ chatbot'],
    openGraph: { title: 'AI Chatbot for Spas | Treatment Booking & Pricing FAQ | VocUI', description: 'Let an AI chatbot handle treatment bookings, pricing FAQs, and after-hours enquiries for your spa — 24/7.', url: 'https://vocui.com/chatbot-for-spas', siteName: 'VocUI', type: 'website' },
    twitter: { card: 'summary_large_image', title: 'AI Chatbot for Spas | Treatment Booking & Pricing FAQ | VocUI', description: 'Let an AI chatbot handle treatment bookings, pricing FAQs, and after-hours enquiries for your spa — 24/7.' },
    alternates: { canonical: 'https://vocui.com/chatbot-for-spas' },
    robots: { index: true, follow: true },
  };
}

const jsonLd = { '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: 'VocUI — AI Chatbot for Spas', applicationCategory: 'HealthApplication', operatingSystem: 'Web', description: 'AI chatbot handling treatment bookings, pricing FAQ, and after-hours enquiries for spas — 24/7.', url: 'https://vocui.com/chatbot-for-spas', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', description: 'Free plan available' }, featureList: ['Treatment booking', 'Pricing FAQ', 'Treatment comparison guidance', '24/7 availability', 'Therapist escalation', 'GDPR-compliant data handling'] };
const trustSignals = ['Books treatments 24/7', 'Trained only on your spa content', 'GDPR-compliant data handling'];
const painPoints: Array<{ icon: ElementType; title: string; body: ReactNode }> = [
  { icon: Phone, title: 'Treatment enquiries arriving after hours with no way to capture them', body: 'What\'s the difference between a hot stone massage and a deep tissue? Do you offer couples packages? How long is a full-body treatment? These questions arrive in the evening — when your spa is closed and the enquiry just disappears.' },
  { icon: MoonStar, title: 'Gift voucher and package interest lost outside business hours', body: <span>People buy spa gifts on impulse, often in the evening. Without a chatbot to answer questions and guide them toward a purchase, that impulse fades before your team opens the next morning. <a href="https://www.salesloft.com/resources/guides/conversational-ai-marketing-trends-report" target="_blank" rel="noopener noreferrer" className="underline decoration-dotted hover:text-primary-500 transition-colors">41% of all purchases are initiated outside standard business hours.</a></span> },
  { icon: AlertCircle, title: 'Upsell opportunities missed at the point of booking', body: 'A client booking a massage is often open to adding a facial or body treatment — but only if someone makes it easy to understand what\'s available. A chatbot that guides treatment selection captures upgrades your front desk would miss.' },
];
const steps = [
  { step: '01', title: 'Train on your spa', description: 'Upload your treatment menu, pricing, package descriptions, and contraindication guidelines. Your chatbot knows your offerings and guides clients confidently.' },
  { step: '02', title: 'Configure booking and enquiry flows', description: 'Set up treatment booking flows and package enquiry journeys. Define escalation for complex needs like medical contraindications that require therapist input.' },
  { step: '03', title: 'Deploy and fill your treatment rooms', description: 'Embed on your website. Clients get instant answers; those ready to book go straight to your appointment calendar.' },
];
const features = [
  { icon: BookOpen, name: 'Treatment and pricing FAQ', description: 'Answer questions about every treatment you offer — what it involves, how long it takes, and what it costs — so clients can choose confidently before booking.' },
  { icon: CalendarCheck, name: 'Treatment booking', description: 'Connect to your calendar via Easy!Appointments. Clients book treatments directly from the chat, any time of day or night.' },
  { icon: Droplets, name: 'Treatment comparison guidance', description: 'Help clients choose between similar treatments by explaining the differences clearly — leading to better bookings and happier clients.' },
  { icon: Clock, name: 'After-hours availability', description: 'Your chatbot captures treatment enquiries and gift voucher interest at midnight as well as midday. No after-hours opportunity is lost.' },
  { icon: UserCheck, name: 'Therapist escalation', description: 'Clients with specific health conditions or contraindications are routed to the right therapist with full context — so nothing is missed.' },
  { icon: Star, name: 'Package and gift voucher FAQ', description: 'Answer questions about spa packages and gift vouchers automatically — making it easy for clients to treat themselves or someone they love.' },
];
const verticals = [
  { icon: Leaf, title: 'Day Spas', description: 'Handle treatment bookings, package enquiries, and gift voucher questions without your front desk being overwhelmed.' },
  { icon: Sparkles, title: 'Medical Spas', description: 'Answer aesthetic treatment FAQs, manage consultation bookings, and handle aftercare enquiries with clinical precision.' },
  { icon: Heart, title: 'Hotel Spas', description: 'Capture in-house guest bookings, answer amenity FAQ, and handle external enquiries — all from a single chatbot.' },
  { icon: Droplets, title: 'Holistic Wellness', description: 'Guide clients through your wellness philosophy, treatment options, and booking process with a calming, informed approach.' },
];

export default function ChatbotForSpasPage() {
  return (
    <PageBackground>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header />
      <main id="main-content">
        <section className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center container mx-auto px-4 py-16 text-center">
          <Badge className="mb-6">AI Chatbot for Spas</Badge>
          <H1 className="max-w-4xl mb-6">Your spa is a place of calm. <span className="text-primary-500">Your chatbot handles the enquiries so it stays that way.</span></H1>
          <p className="mx-auto max-w-2xl text-lg text-secondary-600 dark:text-secondary-400 mb-10">VocUI trains on your treatment menu, pricing, and package details — so clients get instant answers and book treatments without your therapists being pulled away from the treatment room.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="xl" asChild><Link href="/signup">Build Your Spa Chatbot Free<ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link></Button>
            <Button size="xl" variant="outline" asChild><Link href="/pricing">See Pricing</Link></Button>
          </div>
          <p className="text-sm text-secondary-500 dark:text-secondary-400">Books treatments 24/7 &middot; Trained only on your spa content &middot; GDPR-compliant</p>
        </section>
        <section className="border-y border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-800/50 py-6">
          <div className="container mx-auto px-4"><div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">{trustSignals.map((signal) => (<div key={signal} className="flex items-center gap-2 text-sm text-secondary-600 dark:text-secondary-400"><CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" aria-hidden="true" /><span>{signal}</span></div>))}</div></div>
        </section>
        <section className="container mx-auto px-4 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16"><Badge variant="outline" className="mb-4">The spa problem</Badge><h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">Your team is fielding enquiries a chatbot could handle</h2><p className="text-secondary-600 dark:text-secondary-400">Not because your team isn&apos;t attentive. Because there&apos;s no system to handle treatment enquiries without pulling your therapists out of the treatment room.</p></div>
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
          <div className="text-center max-w-2xl mx-auto mb-16"><Badge variant="outline" className="mb-4">Features</Badge><h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">Everything a spa chatbot actually needs</h2><p className="text-secondary-600 dark:text-secondary-400">Built for spas — not a generic booking widget. Every feature is aimed at filling your treatment rooms and keeping your therapists focused on the client in front of them.</p></div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">{features.map((f) => { const Icon = f.icon; return (<div key={f.name} className="bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-xl p-6 hover:border-primary-200 dark:hover:border-primary-700 transition-colors"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-900/50 mb-4"><Icon className="h-4 w-4 text-primary-500" aria-hidden="true" /></div><h3 className="font-semibold text-secondary-900 dark:text-secondary-100 mb-1">{f.name}</h3><p className="text-sm text-secondary-600 dark:text-secondary-400 leading-relaxed">{f.description}</p></div>); })}</div>
        </section>
        <section className="bg-secondary-50 dark:bg-secondary-800/30 py-24">
          <div className="container mx-auto px-4"><div className="max-w-3xl mx-auto text-center"><Badge variant="outline" className="mb-8">From a spa using VocUI</Badge><blockquote className="text-2xl font-semibold text-secondary-900 dark:text-secondary-100 leading-snug mb-6">&ldquo;Clients were booking at competitors because our website didn&apos;t make it easy to understand our treatments after hours. VocUI changed that completely — we now convert evening enquiries into bookings we&apos;d have lost before.&rdquo;</blockquote><p className="text-secondary-500 dark:text-secondary-400 text-sm">C.W. &mdash; Director, The Sanctuary Day Spa</p></div></div>
        </section>
        <section className="container mx-auto px-4 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16"><Badge variant="outline" className="mb-4">Who it&apos;s for</Badge><h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">For spas that want their therapists focused on delivering exceptional treatments</h2><p className="text-secondary-600 dark:text-secondary-400">If your team is fielding enquiries a chatbot could handle, VocUI pays for itself the moment your therapists get through a full day without an interruption.</p></div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">{verticals.map((v) => { const Icon = v.icon; return (<Card key={v.title} className="border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 hover:shadow-lg hover:border-primary-200 dark:hover:border-primary-700 transition-all duration-200 text-center"><CardHeader className="pb-2"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-900/50 mx-auto mb-3"><Icon className="h-6 w-6 text-primary-500" aria-hidden="true" /></div><CardTitle className="text-base leading-snug">{v.title}</CardTitle></CardHeader><CardContent><p className="text-xs text-secondary-500 dark:text-secondary-400 leading-relaxed">{v.description}</p></CardContent></Card>); })}</div>
        </section>
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-6">Related industries</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: 'Chatbot for Salons', href: '/chatbot-for-salons', description: 'Appointment booking and services FAQ for hair and beauty salons.' },
                { label: 'Chatbot for Gyms', href: '/chatbot-for-gyms', description: 'Membership FAQ and class booking for gym businesses.' },
                { label: 'Chatbot for Fitness Studios', href: '/chatbot-for-fitness-studios', description: 'Class booking and membership FAQ for boutique fitness studios.' },
                { label: 'Chatbot for Personal Trainers', href: '/chatbot-for-personal-trainers', description: 'Session booking and program FAQ for personal trainers.' },
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
              <h2 className="text-3xl font-bold mb-4">Your spa&apos;s tranquillity extends to your team, too</h2>
              <p className="text-lg text-white/80 mb-2 max-w-xl mx-auto">Give clients instant answers and keep your therapists in the treatment room where they belong.</p>
              <p className="text-sm text-white/60 mb-10">Free plan available &middot; No credit card required &middot; Live in under an hour</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="xl" variant="secondary" className="bg-white text-primary-600 hover:bg-primary-50 font-semibold" asChild><Link href="/signup">Build Your Spa Chatbot Free <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link></Button>
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
