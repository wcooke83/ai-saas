import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { ToolsHero } from '@/components/ui/tools-hero';
import { Footer } from '@/components/ui/footer';
import { PageBackground } from '@/components/ui/page-background';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Clock, Lock, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About VocUI | AI Chatbot Builder',
  description:
    'VocUI is an AI chatbot platform that lets businesses build, train, and deploy custom chatbots from their own content.',
  openGraph: {
    title: 'About VocUI | AI Chatbot Builder',
    description:
      'VocUI is an AI chatbot platform that lets businesses build, train, and deploy custom chatbots from their own content.',
    url: 'https://vocui.com/about',
    siteName: 'VocUI',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About VocUI | AI Chatbot Builder',
    description:
      'VocUI is an AI chatbot platform that lets businesses build, train, and deploy custom chatbots from their own content.',
  },
  alternates: { canonical: 'https://vocui.com/about' },
  robots: { index: true, follow: true },
};

const beliefs = [
  {
    icon: Clock,
    text: 'Setup should take minutes, not months — one line of code to embed, no API integrations required',
  },
  {
    icon: Lock,
    text: 'Your data stays yours — we never use your knowledge base content to train our models',
  },
  {
    icon: Users,
    text: 'The best chatbot is one that knows when to hand off — human escalation is a feature, not a failure',
  },
];

export default function AboutPage() {
  return (
    <PageBackground>
      <Header />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'AboutPage',
            name: 'About VocUI | AI Chatbot Builder',
            description:
              'VocUI is an AI chatbot platform that lets businesses build, train, and deploy custom chatbots from their own content.',
            url: 'https://vocui.com/about',
            publisher: {
              '@type': 'Organization',
              name: 'VocUI',
              url: 'https://vocui.com',
            },
          }),
        }}
      />

      <main id="main-content">
        <ToolsHero
          badge="About"
          title="We built VocUI because building a chatbot shouldn't require an engineering team."
          description="VocUI is an AI chatbot platform for businesses that are tired of answering the same questions manually."
          breadcrumbs={[{ label: 'About' }]}
        />

        {/* Hero CTA — above the fold conversion point */}
        <section className="container mx-auto px-4 pb-10 max-w-3xl">
          <Button size="lg" asChild>
            <Link href="/signup">
              Build Your Chatbot Free
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </section>

        {/* Body */}
        <section className="container mx-auto px-4 pb-16 max-w-3xl">
          <p className="text-lg text-secondary-600 dark:text-secondary-400 leading-relaxed mb-6">
            Upload your docs, paste your URLs, and have a working chatbot live on your site in under
            an hour — no developers required.
          </p>
          <p className="text-lg text-secondary-600 dark:text-secondary-400 leading-relaxed">
            Your chatbot can <Link href="/chatbot-for-customer-support" className="text-primary-600 dark:text-primary-400 hover:underline">answer support questions</Link>, capture leads, <Link href="/chatbot-booking" className="text-primary-600 dark:text-primary-400 hover:underline">book appointments</Link>, and hand
            off to a human when needed. All from one platform, deployed wherever your customers
            already are.
          </p>
        </section>

        {/* What we believe */}
        <section className="container mx-auto px-4 pb-16 max-w-3xl">
          <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-6">
            What we believe
          </h2>
          <div className="space-y-4">
            {beliefs.map((belief) => {
              const Icon = belief.icon;
              return (
                <Card
                  key={belief.text}
                  className="border-secondary-200 dark:border-secondary-700"
                >
                  <CardContent className="pt-6 flex gap-4 items-start">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-900/50">
                      <Icon className="h-5 w-5 text-primary-500" aria-hidden="true" />
                    </div>
                    <p className="text-secondary-700 dark:text-secondary-300 leading-relaxed">
                      {belief.text}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Final CTA */}
        <section className="container mx-auto px-4 py-20 max-w-3xl">
          <div className="rounded-3xl bg-gradient-to-br from-primary-600 to-primary-800 p-12 text-center text-white shadow-xl shadow-primary-500/20">
            <h2 className="text-3xl font-bold mb-4">
              See what VocUI can do for your business
            </h2>
            <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
              Build a chatbot trained on your own content and deploy it today. Free plan, no credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="xl"
                variant="secondary"
                className="bg-white text-primary-600 hover:bg-primary-50 font-semibold"
                asChild
              >
                <Link href="/signup">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button size="xl" variant="outline-light" asChild>
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </PageBackground>
  );
}
