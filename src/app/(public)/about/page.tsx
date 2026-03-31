import Link from 'next/link';
import { Header } from '@/components/layout';
import { ToolsHero } from '@/components/ui/tools-hero';
import { Footer } from '@/components/ui/footer';
import { PageBackground } from '@/components/ui/page-background';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Clock, Lock, Users } from 'lucide-react';

export const metadata = {
  title: 'About VocUI | AI Chatbot Builder',
  description:
    'VocUI is an AI chatbot platform that lets businesses build, train, and deploy custom chatbots from their own content.',
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
      <Header cta={{ label: 'Sign In', href: '/login' }} />

      <main id="main-content">
        <ToolsHero
          badge="About"
          title="We built VocUI because building a chatbot shouldn't require an engineering team."
          description="VocUI is an AI chatbot platform for businesses that are tired of answering the same questions manually."
          breadcrumbs={[{ label: 'About' }]}
        />

        {/* Body */}
        <section className="container mx-auto px-4 pb-16 max-w-3xl">
          <p className="text-lg text-secondary-600 dark:text-secondary-400 leading-relaxed mb-6">
            Upload your docs, paste your URLs, and have a working chatbot live on your site in under
            an hour — no developers required.
          </p>
          <p className="text-lg text-secondary-600 dark:text-secondary-400 leading-relaxed">
            Your chatbot can answer support questions, capture leads, book appointments, and hand
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

        {/* Contact nudge */}
        <section className="container mx-auto px-4 pb-20 max-w-3xl">
          <div className="border-t border-secondary-200 dark:border-secondary-800 pt-10">
            <Link
              href="/contact"
              className="inline-flex items-center gap-1 text-primary-600 dark:text-primary-400 hover:underline font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded"
            >
              Have questions? Get in touch
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </PageBackground>
  );
}
