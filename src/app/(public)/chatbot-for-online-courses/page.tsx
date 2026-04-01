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
  BookOpen, CalendarCheck, Clock, UserCheck, Laptop,
  TrendingUp, Code2, Heart, Star,
} from 'lucide-react';

export function generateMetadata(): Metadata {
  return {
    title: 'AI Chatbot for Online Course Creators | Course FAQ & Enrollment Lead Capture | VocUI',
    description: 'Let an AI chatbot handle course FAQs, enrollment lead capture, and student support for your online courses — 24/7. Turn visitors into students while you sleep.',
    keywords: ['AI chatbot for online courses', 'course creator chatbot', 'enrollment automation', 'online learning FAQ chatbot'],
    openGraph: { title: 'AI Chatbot for Online Course Creators | Course FAQ & Enrollment | VocUI', description: 'Let an AI chatbot handle course FAQs, enrollment lead capture, and student support for your online courses — 24/7.', url: 'https://vocui.com/chatbot-for-online-courses', siteName: 'VocUI', type: 'website' },
    twitter: { card: 'summary_large_image', title: 'AI Chatbot for Online Course Creators | Course FAQ & Enrollment | VocUI', description: 'Let an AI chatbot handle course FAQs, enrollment lead capture, and student support — 24/7.' },
    alternates: { canonical: 'https://vocui.com/chatbot-for-online-courses' },
    robots: { index: true, follow: true },
  };
}

const jsonLd = { '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: 'VocUI — AI Chatbot for Online Course Creators', applicationCategory: 'EducationApplication', operatingSystem: 'Web', description: 'AI chatbot handling course FAQs, enrollment lead capture, and student support for online course creators — 24/7.', url: 'https://vocui.com/chatbot-for-online-courses', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', description: 'Free plan available' }, featureList: ['Course FAQ', 'Enrollment lead capture', 'Prerequisite guidance', '24/7 availability', 'Creator escalation', 'GDPR-compliant data handling'] };

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What can VocUI's AI chatbot do for Online Course Creators?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Let an AI chatbot handle course FAQs, enrollment lead capture, and student support for your online courses \u2014 24/7. Turn visitors into students while you sleep."
      }
    },
    {
      "@type": "Question",
      "name": "How long does it take to set up VocUI for Online Course Creators?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Most Online Course Creators get set up in under an hour. Upload your existing content -- service descriptions, FAQs, pricing pages, or PDFs -- and VocUI trains the chatbot automatically. Embed it on your website with a single snippet."
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
      "name": "How is VocUI different from a generic chatbot for Online Course Creators?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Unlike generic chatbots, VocUI is trained exclusively on your own content -- your service descriptions, policies, FAQs, and documents. It only answers questions relevant to your Online Course Creators business and escalates to your team when it cannot help, with full conversation context included."
      }
    }
  ]
};

const trustSignals = ['Converts visitors into students 24/7', 'Trained only on your course content', 'GDPR-compliant data handling'];
const painPoints: Array<{ icon: ElementType; title: string; body: ReactNode }> = [
  { icon: Phone, title: 'Prospective students asking course questions and not enrolling', body: 'Is this course right for my level? What software do I need? How long does it take? These questions arrive via email and social media all day and night. Without instant answers, motivated students lose their momentum and don\'t enroll.' },
  { icon: MoonStar, title: 'Purchase intent disappears after hours with no one to answer', body: <span>The best moment to enroll a student is when they're excited about the outcome your course promises. That excitement often peaks at night — and without a chatbot to capture it, it fades by morning. <a href="https://www.salesloft.com/resources/guides/conversational-ai-marketing-trends-report" target="_blank" rel="noopener noreferrer" className="underline decoration-dotted hover:text-primary-500 transition-colors">41% of all meetings are booked outside standard business hours.</a></span> },
  { icon: AlertCircle, title: 'Existing students asking support questions that interrupt your creating time', body: 'Module access questions, technical issues, and curriculum clarifications arrive when you\'re trying to create the next course. Without a support system, your creative output suffers every time an email lands.' },
];
const steps = [
  { step: '01', title: 'Train on your courses', description: 'Upload your course descriptions, curriculum overviews, prerequisite guides, and FAQ. Your chatbot becomes a 24/7 enrollment and support resource.' },
  { step: '02', title: 'Configure enrollment and support flows', description: 'Set up enrollment lead capture and student support flows. Define when complex questions escalate to you directly.' },
  { step: '03', title: 'Deploy and enroll while you create', description: 'Embed on your course sales pages. Visitors get instant answers; motivated students enroll — and you keep creating.' },
];
const features = [
  { icon: BookOpen, name: 'Course FAQ automation', description: 'Answer questions about your curriculum, format, prerequisites, and expected outcomes automatically — so nothing blocks a motivated student from enrolling.' },
  { icon: TrendingUp, name: 'Enrollment lead capture', description: 'Collect name, email, and course interest from prospective students who aren\'t ready to buy yet — so you can follow up at the right moment.' },
  { icon: Star, name: 'Prerequisite guidance', description: 'Help prospective students understand whether your course is the right fit for their level — reducing refunds and increasing satisfaction.' },
  { icon: Clock, name: 'After-hours availability', description: 'Your chatbot converts course visitors at midnight as well as midday. Enroll students in every time zone, 24 hours a day.' },
  { icon: UserCheck, name: 'Creator escalation', description: 'Complex questions that need your personal expertise are escalated to you with full context — so you always respond with full picture.' },
  { icon: Laptop, name: 'Student onboarding support', description: 'Answer module access, technical setup, and first-step questions for new students automatically — reducing support volume from day one.' },
];
const verticals = [
  { icon: TrendingUp, title: 'Business & Entrepreneurship', description: 'Convert motivated entrepreneurs into enrolled students before their excitement fades.' },
  { icon: Code2, title: 'Tech & Coding', description: 'Handle prerequisite FAQ, language recommendations, and technical setup questions for developer courses.' },
  { icon: Star, title: 'Creative Arts', description: 'Guide students to the right level course and capture enrollment intent from creatives at every stage of their journey.' },
  { icon: Heart, title: 'Health & Wellness', description: 'Answer programme FAQ, qualification questions, and enrollment enquiries for health and wellness educators.' },
];

export default function ChatbotForOnlineCoursesPage() {
  return (
    <PageBackground>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <Header />
      <main id="main-content">
        <section className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center container mx-auto px-4 py-16 text-center">
          <Badge className="mb-6">AI Chatbot for Online Course Creators</Badge>
          <H1 className="max-w-4xl mb-6">Your students get excited at all hours. <span className="text-primary-500">Your chatbot can enroll them while you sleep.</span></H1>
          <p className="mx-auto max-w-2xl text-lg text-secondary-600 dark:text-secondary-400 mb-10">VocUI trains on your course descriptions, prerequisites, and FAQ — so motivated visitors get instant answers and enroll without waiting for you to respond to an email.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="xl" asChild><Link href="/signup">Build Your Course Chatbot Free<ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link></Button>
            <Button size="xl" variant="outline" asChild><Link href="/pricing">See Pricing</Link></Button>
          </div>
          <p className="text-sm text-secondary-500 dark:text-secondary-400">Converts visitors into students 24/7 &middot; Trained only on your course content &middot; GDPR-compliant</p>
        </section>
        <section className="border-y border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-800/50 py-6">
          <div className="container mx-auto px-4"><div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">{trustSignals.map((signal) => (<div key={signal} className="flex items-center gap-2 text-sm text-secondary-600 dark:text-secondary-400"><CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" aria-hidden="true" /><span>{signal}</span></div>))}</div></div>
        </section>
        <section className="container mx-auto px-4 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16"><Badge variant="outline" className="mb-4">The course creator problem</Badge><h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">Unanswered questions are costing you enrollments</h2><p className="text-secondary-600 dark:text-secondary-400">Not because your course isn&apos;t good enough. Because without instant answers to common pre-purchase questions, motivated students lose momentum before they pull out their card.</p></div>
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
          <div className="text-center max-w-2xl mx-auto mb-16"><Badge variant="outline" className="mb-4">Features</Badge><h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">Everything an online course chatbot actually needs</h2><p className="text-secondary-600 dark:text-secondary-400">Built for course creators — not a generic contact form. Every feature is aimed at converting more visitors into enrolled students and reducing support load.</p></div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">{features.map((f) => { const Icon = f.icon; return (<div key={f.name} className="bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-xl p-6 hover:border-primary-200 dark:hover:border-primary-700 transition-colors"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-900/50 mb-4"><Icon className="h-4 w-4 text-primary-500" aria-hidden="true" /></div><h3 className="font-semibold text-secondary-900 dark:text-secondary-100 mb-1">{f.name}</h3><p className="text-sm text-secondary-600 dark:text-secondary-400 leading-relaxed">{f.description}</p></div>); })}</div>
        </section>
        <section className="bg-secondary-50 dark:bg-secondary-800/30 py-24">
          <div className="container mx-auto px-4"><div className="max-w-3xl mx-auto text-center"><Badge variant="outline" className="mb-8">From an online course creator using VocUI</Badge><blockquote className="text-2xl font-semibold text-secondary-900 dark:text-secondary-100 leading-snug mb-6">&ldquo;I was losing potential students because I couldn&apos;t respond to every pre-purchase question fast enough. VocUI handles all of that now — my course page converts significantly better and I spend my days creating content instead of answering emails.&rdquo;</blockquote><p className="text-secondary-500 dark:text-secondary-400 text-sm">P.N. &mdash; Online Course Creator, Digital Skills Academy</p></div></div>
        </section>
        <section className="container mx-auto px-4 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16"><Badge variant="outline" className="mb-4">Who it&apos;s for</Badge><h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">For course creators who want to spend more time creating and less time on support</h2><p className="text-secondary-600 dark:text-secondary-400">If you&apos;re fielding the same pre-purchase questions and student support queries a chatbot could handle, VocUI pays for itself the moment your first automated enrollment comes through overnight.</p></div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">{verticals.map((v) => { const Icon = v.icon; return (<Card key={v.title} className="border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 hover:shadow-lg hover:border-primary-200 dark:hover:border-primary-700 transition-all duration-200 text-center"><CardHeader className="pb-2"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-900/50 mx-auto mb-3"><Icon className="h-6 w-6 text-primary-500" aria-hidden="true" /></div><CardTitle className="text-base leading-snug">{v.title}</CardTitle></CardHeader><CardContent><p className="text-xs text-secondary-500 dark:text-secondary-400 leading-relaxed">{v.description}</p></CardContent></Card>); })}</div>
        </section>
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-6">Related industries</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: 'Chatbot for Tutoring Centers', href: '/chatbot-for-tutoring-centers', description: 'Subject FAQ and enrollment booking for tutoring businesses.' },
                { label: 'Chatbot for Universities', href: '/chatbot-for-universities', description: 'Admissions FAQ and course inquiry support for higher education.' },
                { label: 'Chatbot for Gyms', href: '/chatbot-for-gyms', description: 'Membership FAQ and class booking for gym businesses.' },
                { label: 'Chatbot for Yoga Studios', href: '/chatbot-for-yoga-studios', description: 'Class booking and membership FAQ for yoga studios.' },
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
              <h2 className="text-3xl font-bold mb-4">Your best enrollment moment is when a student is excited. Don&apos;t lose it.</h2>
              <p className="text-lg text-white/80 mb-2 max-w-xl mx-auto">Give prospective students instant answers and convert their excitement into enrollment — any time of day or night.</p>
              <p className="text-sm text-white/60 mb-10">Free plan available &middot; No credit card required &middot; Live in under an hour</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="xl" variant="secondary" className="bg-white text-primary-600 hover:bg-primary-50 font-semibold" asChild><Link href="/signup">Build Your Course Chatbot Free <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link></Button>
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
