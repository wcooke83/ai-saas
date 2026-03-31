import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout';
import { ToolsHero } from '@/components/ui/tools-hero';
import { Footer } from '@/components/ui/footer';
import { PageBackground } from '@/components/ui/page-background';
import { Card, CardContent } from '@/components/ui/card';
import {
  ArrowRight,
  Headphones,
  UserPlus,
  CalendarCheck,
  BookOpen,
  MessageSquare,
  Globe,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Solutions | AI Chatbot for Every Use Case | VocUI',
  description:
    'See how VocUI solves different business problems — from customer support automation to lead capture, appointment booking, and knowledge base chatbots.',
  openGraph: {
    title: 'Solutions | AI Chatbot for Every Use Case | VocUI',
    description:
      'See how VocUI solves different business problems — from customer support automation to lead capture, appointment booking, and knowledge base chatbots.',
    url: 'https://vocui.com/solutions',
    siteName: 'VocUI',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Solutions | AI Chatbot for Every Use Case | VocUI',
    description:
      'See how VocUI solves different business problems — from customer support automation to lead capture, appointment booking, and knowledge base chatbots.',
  },
  alternates: { canonical: 'https://vocui.com/solutions' },
  robots: { index: true, follow: true },
};

const useCases = [
  {
    icon: Headphones,
    title: 'Customer Support',
    description:
      'Deflect repetitive tickets with a chatbot trained on your own knowledge base. Handle 70%+ of support volume automatically.',
    href: '/chatbot-for-customer-support',
  },
  {
    icon: UserPlus,
    title: 'Lead Capture',
    description:
      'Engage visitors proactively, qualify their intent, and collect contact details — 24/7, without a salesperson on standby.',
    href: '/chatbot-for-lead-capture',
  },
  {
    icon: CalendarCheck,
    title: 'Appointment Booking',
    description:
      'Let visitors check availability and book appointments directly in the chat window, at any hour.',
    href: '/chatbot-booking',
  },
  {
    icon: BookOpen,
    title: 'Knowledge Base',
    description:
      'Turn your docs, PDFs, and URLs into a chatbot that answers questions from your actual content — no hallucinations.',
    href: '/knowledge-base-chatbot',
  },
  {
    icon: MessageSquare,
    title: 'Slack Chatbot',
    description:
      'Deploy your trained chatbot to Slack. Give your team instant answers from your internal docs and SOPs.',
    href: '/slack-chatbot',
  },
  {
    icon: Globe,
    title: 'Website Widget',
    description:
      'Embed a fully customisable chat widget on any website with one line of JavaScript. No developer required.',
    href: '/chatbot-booking',
  },
] as const;

const industries = [
  { label: 'Legal & Law Firms', href: '/chatbot-for-lawyers' },
  { label: 'Healthcare & Clinics', href: '/chatbot-for-healthcare' },
  { label: 'Real Estate', href: '/chatbot-for-real-estate' },
  { label: 'E-commerce', href: '/chatbot-for-ecommerce' },
] as const;

export default function SolutionsPage() {
  return (
    <PageBackground>
      <Header cta={{ label: 'Sign In', href: '/login' }} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Solutions | AI Chatbot for Every Use Case | VocUI',
            description:
              'See how VocUI solves different business problems — from customer support automation to lead capture, appointment booking, and knowledge base chatbots.',
            url: 'https://vocui.com/solutions',
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
          badge="Solutions"
          title="One platform. Every conversation your business needs."
          description="Whether you're deflecting support tickets, capturing leads, booking appointments, or putting your knowledge base to work — VocUI handles it."
          breadcrumbs={[{ label: 'Solutions' }]}
        />

        {/* Use-case cards */}
        <section className="container mx-auto px-4 pb-16 max-w-5xl">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {useCases.map((useCase) => {
              const Icon = useCase.icon;
              return (
                <Card
                  key={useCase.title}
                  className="border-secondary-200 dark:border-secondary-700 hover:border-primary-300 dark:hover:border-primary-600 transition-colors"
                >
                  <CardContent className="pt-6 flex flex-col h-full gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-900/50">
                      <Icon className="h-5 w-5 text-primary-500" aria-hidden="true" />
                    </div>
                    <p className="font-semibold text-secondary-900 dark:text-secondary-100">
                      {useCase.title}
                    </p>
                    <p className="text-secondary-600 dark:text-secondary-400 leading-relaxed text-sm flex-1">
                      {useCase.description}
                    </p>
                    <Link
                      href={useCase.href}
                      className="inline-flex items-center gap-1 text-primary-600 dark:text-primary-400 hover:underline font-medium text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded"
                    >
                      Learn more
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Industry section */}
        <section className="container mx-auto px-4 pb-16 max-w-5xl">
          <div className="border-t border-secondary-200 dark:border-secondary-800 pt-12">
            <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
              Built for your industry
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400 mb-6">
              VocUI works across every sector where conversations drive business.
            </p>
            <div className="flex flex-wrap gap-3">
              {industries.map((industry) => (
                <Link
                  key={industry.label}
                  href={industry.href}
                  className="inline-flex items-center rounded-full border border-secondary-300 dark:border-secondary-600 px-4 py-1.5 text-sm font-medium text-secondary-700 dark:text-secondary-300 hover:border-primary-400 dark:hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  {industry.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="container mx-auto px-4 pb-20 max-w-5xl">
          <div className="border-t border-secondary-200 dark:border-secondary-800 pt-12 text-center">
            <h2 className="text-2xl font-semibold text-secondary-900 dark:text-secondary-100 mb-3">
              Not sure where to start?
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400 mb-8 max-w-md mx-auto">
              The free plan includes everything you need to build and deploy your first chatbot. No
              credit card required.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-6 py-3 text-sm font-semibold text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
              >
                Build Your Chatbot Free
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-1 text-primary-600 dark:text-primary-400 hover:underline font-medium text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded"
              >
                See pricing
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </PageBackground>
  );
}
