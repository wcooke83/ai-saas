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
  BookOpen, CalendarCheck, Clock, UserCheck, Flame, Wind,
  Heart, Briefcase, Star,
} from 'lucide-react';

export function generateMetadata(): Metadata {
  return {
    title: 'AI Chatbot for Yoga Studios | Style FAQ & Class Booking | VocUI',
    description: 'Help new students choose the right yoga style, answer retreat FAQs, and guide beginners through their first class — automatically, 24/7. Keep your instructors on the mat.',
    keywords: ['AI chatbot for yoga studios', 'yoga studio chatbot', 'yoga class FAQ chatbot', 'yoga style guide chatbot', 'yoga retreat FAQ automation'],
    openGraph: { title: 'AI Chatbot for Yoga Studios | Style FAQ & Class Booking | VocUI', description: 'Help new students choose the right yoga style, answer retreat FAQs, and guide beginners through their first class — automatically, 24/7.', url: 'https://vocui.com/chatbot-for-yoga-studios', siteName: 'VocUI', type: 'website' },
    twitter: { card: 'summary_large_image', title: 'AI Chatbot for Yoga Studios | Style FAQ & Class Booking | VocUI', description: 'Help new students choose the right yoga style, answer retreat FAQs, and guide beginners — 24/7.' },
    alternates: { canonical: 'https://vocui.com/chatbot-for-yoga-studios' },
    robots: { index: true, follow: true },
  };
}

const jsonLd = { '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: 'VocUI — AI Chatbot for Yoga Studios', applicationCategory: 'HealthApplication', operatingSystem: 'Web', description: 'AI chatbot that guides new students through yoga style selection, answers retreat and workshop FAQs, and handles class bookings — trained on your studio content, available 24/7.', url: 'https://vocui.com/chatbot-for-yoga-studios', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', description: 'Free plan available' }, featureList: ['Yoga style guide (Vinyasa vs Yin vs Restorative)', 'Class booking via Easy!Appointments', 'Retreat and workshop FAQ', 'New student preparation guide', '24/7 after-hours availability', 'Instructor handoff with full context'] };

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Can the chatbot explain the difference between yoga styles like Vinyasa, Yin, and Restorative?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Upload your style descriptions and the chatbot guides students to the right class based on their goals and experience — answering the 'which yoga is right for me?' question your team fields every day."
      }
    },
    {
      "@type": "Question",
      "name": "Will VocUI handle retreat and workshop enquiries?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Upload your retreat details — inclusions, dates, pricing, what to bring, who it's suitable for — and the chatbot captures enquiry interest and answers questions before they go cold."
      }
    },
    {
      "@type": "Question",
      "name": "Can the chatbot help new students prepare for their first yoga class?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Train it on your new student guide — what to wear, what to bring, arriving early, studio etiquette — and it shares this automatically with students who ask, reducing first-class anxiety and no-shows."
      }
    },
    {
      "@type": "Question",
      "name": "Does VocUI book yoga classes?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, via Easy!Appointments. Students can book regular classes, trial sessions, and workshops directly from the chat at any time."
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
      "name": "AI Chatbot for Yoga Studios",
      "item": "https://vocui.com/chatbot-for-yoga-studios"
    }
  ]
};


const trustSignals = ['Answers yoga style questions 24/7', 'Trained only on your studio content', 'GDPR-compliant data handling'];
const painPoints: Array<{ icon: ElementType; title: string; body: ReactNode }> = [
  { icon: Phone, title: 'Students asking "which class is right for me?" before every session', body: 'What\'s the difference between Vinyasa and Yin? Is Restorative yoga for beginners? Can I come if I\'ve never done yoga before? Your instructor has to stop what they\'re doing to explain your entire style offering — again — before every class.' },
  { icon: MoonStar, title: 'After-hours interest lost because your site doesn\'t explain the styles clearly enough', body: <span>Someone discovers your studio late at night, wants to understand which style to start with, but your website doesn&apos;t explain the difference clearly enough for them to book with confidence. Without instant guidance, they close the tab and never return. <a href="https://www.salesloft.com/resources/guides/conversational-ai-marketing-trends-report" target="_blank" rel="noopener noreferrer" className="underline decoration-dotted hover:text-primary-500 transition-colors">41% of all bookings happen outside standard business hours.</a></span> },
  { icon: AlertCircle, title: 'Retreat and workshop enquiries going cold before you can reply', body: 'Retreat and workshop interest arrives via contact form, sits unanswered for days, and the student books elsewhere — because they couldn\'t get a fast answer about what\'s included, who it\'s for, and how to prepare.' },
];
const steps = [
  { step: '01', title: 'Train on your practice', description: 'Upload class descriptions for each style (Vinyasa, Yin, Hot, Restorative), teacher bios, retreat details, and your new student guide. Your chatbot knows your studio inside out.' },
  { step: '02', title: 'Configure student pathways', description: 'Set up flows for beginners who don\'t know which style suits them, and escalation for retreat and workshop enquiries that need a personal conversation.' },
  { step: '03', title: 'Deploy and fill your classes', description: 'Embed on your website. Students get the clarity they need to book with confidence — at midnight or midday.' },
];
const features = [
  { icon: BookOpen, name: 'Yoga style guide', description: 'Answer "which yoga is right for me?" questions automatically — explain Vinyasa vs Yin vs Restorative vs Hot yoga in the context of your specific class offering.' },
  { icon: CalendarCheck, name: 'Class and retreat booking', description: 'Connect to your calendar via Easy!Appointments. Students book regular classes and retreat enquiries from the chat, at any hour.' },
  { icon: Heart, name: 'New student preparation guide', description: 'Share what to wear, what to bring, and what to expect automatically — reducing first-class anxiety and no-shows before they happen.' },
  { icon: Clock, name: 'After-hours availability', description: 'Your chatbot guides students through style selection and class booking at midnight as well as midday. Capture every student who discovers your studio outside hours.' },
  { icon: UserCheck, name: 'Instructor handoff', description: 'Retreat enquiries, therapeutic yoga questions, and teacher training FAQs route to the right instructor with full conversation context.' },
  { icon: Star, name: 'Retreat and workshop FAQ', description: 'Handle retreat inclusions, pricing, preparation requirements, and booking automatically — capturing interest before it cools.' },
];
const verticals = [
  { icon: Flame, title: 'Hot Yoga', description: 'Handle temperature and preparation questions and manage hot yoga class bookings without reception overhead.' },
  { icon: Wind, title: 'Vinyasa & Flow', description: 'Guide students to the right level class and book them in — reducing inappropriate bookings and improving student experience.' },
  { icon: Heart, title: 'Restorative & Yin', description: 'Answer therapeutic yoga questions and manage bookings for classes that attract students with specific wellness needs.' },
  { icon: Briefcase, title: 'Corporate Wellness', description: 'Handle corporate enquiries, group bookings, and workplace wellness programme FAQs automatically.' },
];

export default function ChatbotForYogaStudiosPage() {
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
            <li className="text-secondary-900 dark:text-secondary-100 font-medium">AI Chatbot for Yoga Studios</li>
          </ol>
        </nav>

        <section className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center container mx-auto px-4 py-16 text-center">
          <Badge className="mb-6">AI Chatbot for Yoga Studios</Badge>
          <H1 className="max-w-4xl mb-6">Your students want to practise yoga. <span className="text-primary-500">They just need help choosing the right style.</span></H1>
          <p className="mx-auto max-w-2xl text-lg text-secondary-600 dark:text-secondary-400 mb-10">VocUI guides new and returning students through your class styles, answers their preparation questions, and handles bookings — so your instructors stay on the mat, not on the phone.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="xl" asChild><Link href="/signup">Build Your Yoga Studio Chatbot Free<ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link></Button>
            <Button size="xl" variant="outline" asChild><Link href="/pricing">See Pricing</Link></Button>
          </div>
          <p className="text-sm text-secondary-500 dark:text-secondary-400">Answers yoga style questions 24/7 &middot; Trained only on your studio content &middot; GDPR-compliant</p>
        </section>
        <section className="border-y border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-800/50 py-6">
          <div className="container mx-auto px-4"><div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">{trustSignals.map((signal) => (<div key={signal} className="flex items-center gap-2 text-sm text-secondary-600 dark:text-secondary-400"><CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" aria-hidden="true" /><span>{signal}</span></div>))}</div></div>
        </section>
        <section className="container mx-auto px-4 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16"><Badge variant="outline" className="mb-4">The studio problem</Badge><h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">Your team is handling questions a chatbot could answer</h2><p className="text-secondary-600 dark:text-secondary-400">Not because your team isn&apos;t dedicated. Because without a system to handle the same student questions every day, they all land on whoever is available — which is usually your instructors.</p></div>
          <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">{painPoints.map((p) => { const Icon = p.icon; return (<div key={p.title} className="bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-xl p-6 hover:border-primary-200 dark:hover:border-primary-700 transition-colors"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 dark:bg-red-900/20 mb-4"><Icon className="h-5 w-5 text-red-500" aria-hidden="true" /></div><h3 className="font-semibold text-secondary-900 dark:text-secondary-100 mb-2">{p.title}</h3><p className="text-sm text-secondary-600 dark:text-secondary-400 leading-relaxed">{p.body}</p></div>); })}</div>
        </section>
        <section id="how-it-works" className="bg-secondary-50 dark:bg-secondary-800/30 py-24">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16"><Badge variant="outline" className="mb-4">How it works</Badge><h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100">Live before your next class. No developers needed.</h2></div>
            <div className="grid gap-10 md:grid-cols-3 max-w-5xl mx-auto relative">
              <div className="hidden md:block absolute top-8 left-[calc(16.67%+1.5rem)] right-[calc(16.67%+1.5rem)] h-px bg-secondary-200 dark:bg-secondary-700" aria-hidden="true" />
              {steps.map((s) => (<div key={s.step} className="relative text-center flex flex-col items-center"><div className="w-16 h-16 rounded-full bg-primary-500 text-white font-bold text-lg flex items-center justify-center mb-6 z-10 shadow-lg shadow-primary-500/25">{s.step}</div><h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-3">{s.title}</h3><p className="text-sm text-secondary-600 dark:text-secondary-400 leading-relaxed max-w-xs">{s.description}</p></div>))}
            </div>
            <div className="text-center mt-14"><Button size="xl" asChild><Link href="/signup">Start Building Free <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link></Button></div>
          </div>
        </section>
        <section className="container mx-auto px-4 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16"><Badge variant="outline" className="mb-4">Features</Badge><h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">Everything a yoga studio chatbot actually needs</h2><p className="text-secondary-600 dark:text-secondary-400">Built for the specific needs of yoga studios — not a generic booking widget. Every feature is aimed at guiding students to the right class and keeping your instructors fully present.</p></div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">{features.map((f) => { const Icon = f.icon; return (<div key={f.name} className="bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-xl p-6 hover:border-primary-200 dark:hover:border-primary-700 transition-colors"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-900/50 mb-4"><Icon className="h-4 w-4 text-primary-500" aria-hidden="true" /></div><h3 className="font-semibold text-secondary-900 dark:text-secondary-100 mb-1">{f.name}</h3><p className="text-sm text-secondary-600 dark:text-secondary-400 leading-relaxed">{f.description}</p></div>); })}</div>
        </section>
        {/* ── How Businesses Use VocUI ────────────────────────────────────────── */}
        <section className="bg-secondary-50 dark:bg-secondary-800/30 py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-10">
                <Badge variant="outline" className="mb-4">How yoga studios use VocUI</Badge>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
                  A typical week, before and after VocUI
                </h2>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  { step: 'Before', text: 'Front desk fielding class style questions, schedule confusion, and \u2018is this right for a beginner?\u2019 calls before every session' },
                  { step: 'Setup', text: 'Uploaded class descriptions, teacher profiles, style guide (Vinyasa vs Yin vs Restorative), and new student FAQ' },
                  { step: 'After', text: 'New students arrive knowing which class suits them. Drop-in bookings from after-hours enquiries improved.' },
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
          <div className="text-center max-w-2xl mx-auto mb-16"><Badge variant="outline" className="mb-4">Who it&apos;s for</Badge><h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">For yoga studios that want their instructors focused on teaching</h2><p className="text-secondary-600 dark:text-secondary-400">If your instructors are fielding admin questions a chatbot could handle, VocUI pays for itself the moment your team steps back onto the mat undistracted.</p></div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">{verticals.map((v) => { const Icon = v.icon; return (<Card key={v.title} className="border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 hover:shadow-lg hover:border-primary-200 dark:hover:border-primary-700 transition-all duration-200 text-center"><CardHeader className="pb-2"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-900/50 mx-auto mb-3"><Icon className="h-6 w-6 text-primary-500" aria-hidden="true" /></div><CardTitle className="text-base leading-snug">{v.title}</CardTitle></CardHeader><CardContent><p className="text-xs text-secondary-500 dark:text-secondary-400 leading-relaxed">{v.description}</p></CardContent></Card>); })}</div>
        </section>
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-6">Related industries</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: 'Chatbot for Gyms', href: '/chatbot-for-gyms', description: 'Membership FAQ and class booking for gym businesses.' },
                { label: 'Chatbot for Fitness Studios', href: '/chatbot-for-fitness-studios', description: 'Class booking and membership FAQ for boutique fitness studios.' },
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
              <h2 className="text-3xl font-bold mb-4">Your studio deserves focus. So does your team.</h2>
              <p className="text-lg text-white/80 mb-2 max-w-xl mx-auto">Give students instant answers and let your instructors focus on what they do best.</p>
              <p className="text-sm text-white/60 mb-10">Free plan available &middot; No credit card required &middot; Live in under an hour</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="xl" variant="secondary" className="bg-white text-primary-600 hover:bg-primary-50 font-semibold" asChild><Link href="/signup">Build Your Yoga Studio Chatbot Free <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link></Button>
                <Button size="xl" variant="outline-light" asChild><Link href="/pricing">See Pricing</Link></Button>
              </div>
            </div>
          </div>
        </section>
      
          {/* Related Blog Post */}
          <div className="mt-6 mb-2 rounded-xl border border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-800/50 p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary-600 dark:text-primary-400 mb-2">Related reading</p>
            <Link href="/blog/chatbot-for-fitness-studios" className="font-semibold text-secondary-900 dark:text-secondary-100 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              AI Chatbots for Gyms and Fitness Studios →
            </Link>
          </div>
      </main>
      <Footer />
    </PageBackground>
  );
}
