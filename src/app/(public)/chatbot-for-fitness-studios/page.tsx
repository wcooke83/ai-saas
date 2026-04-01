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
  BookOpen, CalendarCheck, Clock, UserCheck, Dumbbell,
  Zap, Users, Waves, Star,
} from 'lucide-react';

export function generateMetadata(): Metadata {
  return {
    title: 'AI Chatbot for Fitness Studios | Class Booking & Membership FAQ | VocUI',
    description: 'Let an AI chatbot handle class bookings, membership FAQs, and new member enquiries for your fitness studio — 24/7. Keep your instructors focused on training, not admin.',
    keywords: ['AI chatbot for fitness studios', 'fitness studio chatbot', 'class booking automation', 'gym membership FAQ chatbot'],
    openGraph: { title: 'AI Chatbot for Fitness Studios | Class Booking & Membership FAQ | VocUI', description: 'Let an AI chatbot handle class bookings, membership FAQs, and new member enquiries — 24/7.', url: 'https://vocui.com/chatbot-for-fitness-studios', siteName: 'VocUI', type: 'website' },
    twitter: { card: 'summary_large_image', title: 'AI Chatbot for Fitness Studios | Class Booking & Membership FAQ | VocUI', description: 'Let an AI chatbot handle class bookings, membership FAQs, and new member enquiries — 24/7.' },
    alternates: { canonical: 'https://vocui.com/chatbot-for-fitness-studios' },
    robots: { index: true, follow: true },
  };
}

const jsonLd = { '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: 'VocUI — AI Chatbot for Fitness Studios', applicationCategory: 'HealthApplication', operatingSystem: 'Web', description: 'AI chatbot handling class bookings, membership FAQs, and new member enquiries for fitness studios — 24/7.', url: 'https://vocui.com/chatbot-for-fitness-studios', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', description: 'Free plan available' }, featureList: ['Class booking', 'Membership FAQ', 'Pricing FAQ', '24/7 availability', 'Staff escalation', 'GDPR-compliant data handling'] };
const trustSignals = ['Books classes and trials 24/7', 'Trained only on your studio content', 'GDPR-compliant data handling'];
const painPoints: Array<{ icon: ElementType; title: string; body: ReactNode }> = [
  { icon: Phone, title: 'Front desk overwhelmed with class schedule and pricing questions', body: 'What classes do you offer? When is the next HIIT class? How much is a monthly membership? These questions arrive all day — and every time the phone rings, someone is pulled away from the member already in the studio.' },
  { icon: MoonStar, title: 'Trial class interest lost after hours', body: <span>A prospective member gets motivated in the evening and visits your website. Without instant information about trial classes and what to expect, that motivation fades before they book — and they sign up at a competitor who had better late-night info. <a href="https://www.salesloft.com/resources/guides/conversational-ai-marketing-trends-report" target="_blank" rel="noopener noreferrer" className="underline decoration-dotted hover:text-primary-500 transition-colors">41% of all meetings are booked outside standard business hours.</a></span> },
  { icon: AlertCircle, title: 'Membership enquiries during classes when no one can answer', body: 'The moments after a great class are prime membership conversion moments. Without a way to answer membership questions instantly when your team is teaching, that motivation goes unanswered.' },
];
const steps = [
  { step: '01', title: 'Train on your studio', description: 'Upload your class timetable, membership options, pricing tiers, and studio FAQ. Your chatbot knows your offering and answers every question accordingly.' },
  { step: '02', title: 'Configure class booking and trial flows', description: 'Set up class booking and free trial sign-up flows. Define escalation for specialised coaching questions that need instructor input.' },
  { step: '03', title: 'Deploy and fill your classes', description: 'Embed on your website. Members and prospects get instant answers; those ready to commit book directly into your timetable.' },
];
const features = [
  { icon: BookOpen, name: 'Class and timetable FAQ', description: 'Answer questions about class formats, levels, timing, and what to bring automatically — so nothing blocks a booking.' },
  { icon: CalendarCheck, name: 'Class and trial booking', description: 'Connect to your calendar via Easy!Appointments. Members book classes and trial sessions directly from the chat, any time.' },
  { icon: Star, name: 'Membership FAQ', description: 'Explain your membership tiers, pricing, and benefits clearly — removing the friction between interest and sign-up.' },
  { icon: Clock, name: 'After-hours availability', description: 'Your chatbot captures member interest at midnight as well as midday. Never lose a motivated prospect because your studio was closed when they decided to join.' },
  { icon: UserCheck, name: 'Staff escalation', description: 'Complex coaching questions and specific programme enquiries escalate to the right instructor with full context.' },
  { icon: Dumbbell, name: 'Beginner guidance', description: 'Guide first-time studio visitors through class selection, what to expect, and how to prepare — reducing new member drop-off before they even start.' },
];
const verticals = [
  { icon: Zap, title: 'Boutique Fitness', description: 'Handle class bookings, membership FAQ, and new member enquiries for high-energy boutique formats.' },
  { icon: Dumbbell, title: 'CrossFit & Functional', description: 'Answer WOD questions, foundations course FAQ, and membership enquiries for functional fitness communities.' },
  { icon: Users, title: 'Dance & Martial Arts', description: 'Handle class level FAQ, trial class bookings, and grading enquiries for dance and martial arts formats.' },
  { icon: Waves, title: 'Swimming & Aquatics', description: 'Answer lane swimming FAQ, lesson bookings, and membership queries for aquatic fitness facilities.' },
];

export default function ChatbotForFitnessStudiosPage() {
  return (
    <PageBackground>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header />
      <main id="main-content">
        <section className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center container mx-auto px-4 py-16 text-center">
          <Badge className="mb-6">AI Chatbot for Fitness Studios</Badge>
          <H1 className="max-w-4xl mb-6">Your members train hard. <span className="text-primary-500">Your chatbot should work just as hard to fill your classes.</span></H1>
          <p className="mx-auto max-w-2xl text-lg text-secondary-600 dark:text-secondary-400 mb-10">VocUI trains on your class schedule, memberships, and pricing — so your team stays focused on coaching and your studio stays full.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="xl" asChild><Link href="/signup">Build Your Fitness Studio Chatbot Free<ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link></Button>
            <Button size="xl" variant="outline" asChild><Link href="/pricing">See Pricing</Link></Button>
          </div>
          <p className="text-sm text-secondary-500 dark:text-secondary-400">Books classes and trials 24/7 &middot; Trained only on your studio content &middot; GDPR-compliant</p>
        </section>
        <section className="border-y border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-800/50 py-6">
          <div className="container mx-auto px-4"><div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">{trustSignals.map((signal) => (<div key={signal} className="flex items-center gap-2 text-sm text-secondary-600 dark:text-secondary-400"><CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" aria-hidden="true" /><span>{signal}</span></div>))}</div></div>
        </section>
        <section className="container mx-auto px-4 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16"><Badge variant="outline" className="mb-4">The fitness studio problem</Badge><h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">Your team is handling questions a chatbot could answer</h2><p className="text-secondary-600 dark:text-secondary-400">Not because your staff aren&apos;t dedicated. Because without a system to handle routine member questions, they interrupt your instructors and distract from the coaching experience your members pay for.</p></div>
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
          <div className="text-center max-w-2xl mx-auto mb-16"><Badge variant="outline" className="mb-4">Features</Badge><h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">Everything a fitness studio chatbot actually needs</h2><p className="text-secondary-600 dark:text-secondary-400">Built for fitness studios — not a generic booking widget. Every feature keeps your classes full and your instructors focused on coaching.</p></div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">{features.map((f) => { const Icon = f.icon; return (<div key={f.name} className="bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-xl p-6 hover:border-primary-200 dark:hover:border-primary-700 transition-colors"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-900/50 mb-4"><Icon className="h-4 w-4 text-primary-500" aria-hidden="true" /></div><h3 className="font-semibold text-secondary-900 dark:text-secondary-100 mb-1">{f.name}</h3><p className="text-sm text-secondary-600 dark:text-secondary-400 leading-relaxed">{f.description}</p></div>); })}</div>
        </section>
        <section className="bg-secondary-50 dark:bg-secondary-800/30 py-24">
          <div className="container mx-auto px-4"><div className="max-w-3xl mx-auto text-center"><Badge variant="outline" className="mb-8">From a fitness studio using VocUI</Badge><blockquote className="text-2xl font-semibold text-secondary-900 dark:text-secondary-100 leading-snug mb-6">&ldquo;New members were contacting us late at night with membership questions and not hearing back until the morning — by which point they&apos;d often signed up elsewhere. VocUI answers everything instantly now, and our trial class bookings have gone up significantly.&rdquo;</blockquote><p className="text-secondary-500 dark:text-secondary-400 text-sm">K.A. &mdash; Owner, Ignite Fitness Studio</p></div></div>
        </section>
        <section className="container mx-auto px-4 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16"><Badge variant="outline" className="mb-4">Who it&apos;s for</Badge><h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">For fitness studios that want their instructors focused on coaching</h2><p className="text-secondary-600 dark:text-secondary-400">If your team is fielding enquiries a chatbot could handle, VocUI pays for itself the moment your studio gets through a full day with every instructor fully focused on their class.</p></div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">{verticals.map((v) => { const Icon = v.icon; return (<Card key={v.title} className="border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 hover:shadow-lg hover:border-primary-200 dark:hover:border-primary-700 transition-all duration-200 text-center"><CardHeader className="pb-2"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-900/50 mx-auto mb-3"><Icon className="h-6 w-6 text-primary-500" aria-hidden="true" /></div><CardTitle className="text-base leading-snug">{v.title}</CardTitle></CardHeader><CardContent><p className="text-xs text-secondary-500 dark:text-secondary-400 leading-relaxed">{v.description}</p></CardContent></Card>); })}</div>
        </section>
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-6">Related industries</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: 'Chatbot for Gyms', href: '/chatbot-for-gyms', description: 'Membership FAQ and class booking for gym businesses.' },
                { label: 'Chatbot for Yoga Studios', href: '/chatbot-for-yoga-studios', description: 'Class booking and membership FAQ for yoga studios.' },
                { label: 'Chatbot for Personal Trainers', href: '/chatbot-for-personal-trainers', description: 'Session booking and program FAQ for personal trainers.' },
                { label: 'Chatbot for Spas', href: '/chatbot-for-spas', description: 'Treatment booking and pricing FAQ for day spas and wellness centres.' },
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
              <h2 className="text-3xl font-bold mb-4">Your studio deserves full classes and focused coaches</h2>
              <p className="text-lg text-white/80 mb-2 max-w-xl mx-auto">Give members and prospects instant answers and let your instructors stay focused on what they do best.</p>
              <p className="text-sm text-white/60 mb-10">Free plan available &middot; No credit card required &middot; Live in under an hour</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="xl" variant="secondary" className="bg-white text-primary-600 hover:bg-primary-50 font-semibold" asChild><Link href="/signup">Build Your Fitness Studio Chatbot Free <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link></Button>
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
