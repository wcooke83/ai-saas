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
  Target, Users, Laptop, Star,
} from 'lucide-react';

export function generateMetadata(): Metadata {
  return {
    title: 'AI Chatbot for Personal Trainers | Session Booking & Program FAQ | VocUI',
    description:
      'Let an AI chatbot handle session booking, program FAQs, and new client intake for your personal training business — 24/7. Focus on training, not admin.',
    keywords: ['AI chatbot for personal trainers', 'personal trainer chatbot', 'session booking automation', 'fitness FAQ chatbot'],
    openGraph: {
      title: 'AI Chatbot for Personal Trainers | Session Booking & Program FAQ | VocUI',
      description: 'Let an AI chatbot handle session booking, program FAQs, and new client intake for your personal training business — 24/7.',
      url: 'https://vocui.com/chatbot-for-personal-trainers', siteName: 'VocUI', type: 'website',
    },
    twitter: { card: 'summary_large_image', title: 'AI Chatbot for Personal Trainers | Session Booking & Program FAQ | VocUI', description: 'Let an AI chatbot handle session booking, program FAQs, and new client intake for your personal training business — 24/7.' },
    alternates: { canonical: 'https://vocui.com/chatbot-for-personal-trainers' },
    robots: { index: true, follow: true },
  };
}

const jsonLd = { '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: 'VocUI — AI Chatbot for Personal Trainers', applicationCategory: 'HealthApplication', operatingSystem: 'Web', description: 'AI chatbot that handles session booking, program FAQs, and client intake for personal trainers — 24/7.', url: 'https://vocui.com/chatbot-for-personal-trainers', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', description: 'Free plan available' }, featureList: ['Session booking', 'Program FAQ', 'Goal assessment intake', '24/7 availability', 'Trainer escalation', 'GDPR-compliant data handling'] };

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What can VocUI's AI chatbot do for Personal Trainers?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Let an AI chatbot handle session booking, program FAQs, and new client intake for your personal training business \u2014 24/7. Focus on training, not admin."
      }
    },
    {
      "@type": "Question",
      "name": "How long does it take to set up VocUI for Personal Trainers?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Most Personal Trainers get set up in under an hour. Upload your existing content -- service descriptions, FAQs, pricing pages, or PDFs -- and VocUI trains the chatbot automatically. Embed it on your website with a single snippet."
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
      "name": "How is VocUI different from a generic chatbot for Personal Trainers?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Unlike generic chatbots, VocUI is trained exclusively on your own content -- your service descriptions, policies, FAQs, and documents. It only answers questions relevant to your Personal Trainers business and escalates to your team when it cannot help, with full conversation context included."
      }
    }
  ]
};

const trustSignals = ['Answers client questions 24/7', 'Trained only on your content', 'GDPR-compliant data handling'];
const painPoints: Array<{ icon: ElementType; title: string; body: ReactNode }> = [
  { icon: Phone, title: 'Prospective clients message at all hours asking about programs and pricing', body: 'What programs do you offer? How much per session? Do you offer nutrition coaching? These questions arrive via Instagram DM, email, and contact forms at every hour — pulling you away from your actual clients.' },
  { icon: MoonStar, title: 'Lead-to-booking drop-off because no one responds fast enough', body: <span>A prospective client gets motivated at 10pm and visits your website. Without instant answers and a way to book, they lose momentum overnight and never follow through. <a href="https://www.salesloft.com/resources/guides/conversational-ai-marketing-trends-report" target="_blank" rel="noopener noreferrer" className="underline decoration-dotted hover:text-primary-500 transition-colors">41% of all meetings are booked outside standard business hours</a> — and fitness motivation doesn't wait.</span> },
  { icon: AlertCircle, title: 'Admin consuming time that should be spent training', body: 'Answering the same intake questions, explaining your methodology, and coordinating first session details takes hours every week. That\'s time you should be spending with clients who are already committed.' },
];
const steps = [
  { step: '01', title: 'Train on your programs', description: 'Upload your program descriptions, pricing, methodology, and FAQs. Your chatbot knows your offer inside-out and answers accordingly.' },
  { step: '02', title: 'Configure intake and booking flows', description: 'Set up goal assessment questions and session booking flows. New clients arrive pre-qualified with their goals documented.' },
  { step: '03', title: 'Deploy and fill your schedule', description: 'Embed on your website or link from social media. Prospects get instant answers; motivated clients book their first session directly.' },
];
const features = [
  { icon: BookOpen, name: 'Program and pricing FAQ', description: 'Answer questions about your programs, methodology, and pricing structures automatically — so prospects self-qualify before you speak.' },
  { icon: CalendarCheck, name: 'Session booking', description: 'Connect to your calendar via Easy!Appointments. New and existing clients book sessions directly from the chat, any time of day.' },
  { icon: Target, name: 'Goal assessment intake', description: 'Collect fitness goals, current level, and any limitations before the first session — so you arrive prepared and ready to deliver results.' },
  { icon: Clock, name: 'After-hours availability', description: 'Your chatbot captures leads at midnight as well as midday. Never lose a motivated prospect because they messaged outside office hours.' },
  { icon: UserCheck, name: 'Seamless trainer handoff', description: 'Complex questions escalate to you with the full conversation context — so you always know exactly where the client is in their decision.' },
  { icon: Star, name: 'Nutrition and lifestyle FAQ', description: 'Answer common questions about nutrition, recovery, and lifestyle changes automatically — freeing you for deeper conversations that need your expertise.' },
];
const verticals = [
  { icon: Dumbbell, title: 'One-on-One Training', description: 'Handle new client enquiries, book sessions, and collect intake information before the first session.' },
  { icon: Laptop, title: 'Online Coaching', description: 'Answer programme questions and onboard new coaching clients without manual back-and-forth.' },
  { icon: Users, title: 'Group Training', description: 'Handle group programme FAQs, manage class bookings, and capture new group enquiries automatically.' },
  { icon: Target, title: 'Nutrition & Fitness', description: 'Qualify combined coaching enquiries and explain your integrated approach before the first consultation.' },
];

export default function ChatbotForPersonalTrainersPage() {
  return (
    <PageBackground>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <Header />
      <main id="main-content">
        <section className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center container mx-auto px-4 py-16 text-center">
          <Badge className="mb-6">AI Chatbot for Personal Trainers</Badge>
          <H1 className="max-w-4xl mb-6">Your clients train hard. <span className="text-primary-500">You shouldn&apos;t have to work twice as hard on admin.</span></H1>
          <p className="mx-auto max-w-2xl text-lg text-secondary-600 dark:text-secondary-400 mb-10">VocUI trains on your programs, pricing, and FAQs — so prospective clients get instant answers and motivated leads book sessions without you lifting a finger.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="xl" asChild><Link href="/signup">Build Your Training Chatbot Free<ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link></Button>
            <Button size="xl" variant="outline" asChild><Link href="/pricing">See Pricing</Link></Button>
          </div>
          <p className="text-sm text-secondary-500 dark:text-secondary-400">Answers client questions 24/7 &middot; Trained only on your content &middot; GDPR-compliant</p>
        </section>
        <section className="border-y border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-800/50 py-6">
          <div className="container mx-auto px-4"><div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">{trustSignals.map((signal) => (<div key={signal} className="flex items-center gap-2 text-sm text-secondary-600 dark:text-secondary-400"><CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" aria-hidden="true" /><span>{signal}</span></div>))}</div></div>
        </section>
        <section className="container mx-auto px-4 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">The trainer problem</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">Admin is stealing hours you should be spending with clients</h2>
            <p className="text-secondary-600 dark:text-secondary-400">Not because you&apos;re disorganised. Because without a system to handle initial enquiries automatically, every question — big or small — goes straight to you.</p>
          </div>
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
          <div className="text-center max-w-2xl mx-auto mb-16"><Badge variant="outline" className="mb-4">Features</Badge><h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">Everything a personal trainer chatbot actually needs</h2><p className="text-secondary-600 dark:text-secondary-400">Built for trainers — not a generic contact form. Every feature is aimed at reducing admin and filling your schedule with motivated clients.</p></div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">{features.map((f) => { const Icon = f.icon; return (<div key={f.name} className="bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-xl p-6 hover:border-primary-200 dark:hover:border-primary-700 transition-colors"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-900/50 mb-4"><Icon className="h-4 w-4 text-primary-500" aria-hidden="true" /></div><h3 className="font-semibold text-secondary-900 dark:text-secondary-100 mb-1">{f.name}</h3><p className="text-sm text-secondary-600 dark:text-secondary-400 leading-relaxed">{f.description}</p></div>); })}</div>
        </section>
        <section className="bg-secondary-50 dark:bg-secondary-800/30 py-24">
          <div className="container mx-auto px-4"><div className="max-w-3xl mx-auto text-center"><Badge variant="outline" className="mb-8">From a personal trainer using VocUI</Badge><blockquote className="text-2xl font-semibold text-secondary-900 dark:text-secondary-100 leading-snug mb-6">&ldquo;I used to spend Sunday evenings answering DMs and emails about my programs. VocUI handles all of that now — I walk into Monday with my week already scheduled and every new client already pre-qualified.&rdquo;</blockquote><p className="text-secondary-500 dark:text-secondary-400 text-sm">J.O. &mdash; Independent Personal Trainer</p></div></div>
        </section>
        <section className="container mx-auto px-4 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16"><Badge variant="outline" className="mb-4">Who it&apos;s for</Badge><h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">For trainers who want to spend more time coaching and less time on admin</h2><p className="text-secondary-600 dark:text-secondary-400">If you&apos;re fielding enquiries a chatbot could handle, VocUI pays for itself the moment you reclaim your first evening.</p></div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">{verticals.map((v) => { const Icon = v.icon; return (<Card key={v.title} className="border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 hover:shadow-lg hover:border-primary-200 dark:hover:border-primary-700 transition-all duration-200 text-center"><CardHeader className="pb-2"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-900/50 mx-auto mb-3"><Icon className="h-6 w-6 text-primary-500" aria-hidden="true" /></div><CardTitle className="text-base leading-snug">{v.title}</CardTitle></CardHeader><CardContent><p className="text-xs text-secondary-500 dark:text-secondary-400 leading-relaxed">{v.description}</p></CardContent></Card>); })}</div>
        </section>
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-6">Related industries</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: 'Chatbot for Gyms', href: '/chatbot-for-gyms', description: 'Membership FAQ and class booking for gym businesses.' },
                { label: 'Chatbot for Fitness Studios', href: '/chatbot-for-fitness-studios', description: 'Class booking and membership FAQ for boutique fitness studios.' },
                { label: 'Chatbot for Yoga Studios', href: '/chatbot-for-yoga-studios', description: 'Class booking and membership FAQ for yoga studios.' },
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
              <h2 className="text-3xl font-bold mb-4">Your time is too valuable for admin that a chatbot can handle</h2>
              <p className="text-lg text-white/80 mb-2 max-w-xl mx-auto">Give prospects instant answers and let motivated clients book themselves in — without any effort from you.</p>
              <p className="text-sm text-white/60 mb-10">Free plan available &middot; No credit card required &middot; Live in under an hour</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="xl" variant="secondary" className="bg-white text-primary-600 hover:bg-primary-50 font-semibold" asChild><Link href="/signup">Build Your Training Chatbot Free <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link></Button>
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
