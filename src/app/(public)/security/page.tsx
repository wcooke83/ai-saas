import type React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { ToolsHero } from '@/components/ui/tools-hero';
import { Footer } from '@/components/ui/footer';
import { PageBackground } from '@/components/ui/page-background';
import { Card, CardContent } from '@/components/ui/card';
import {
  ArrowRight,
  Database,
  Lock,
  Trash2,
  Shield,
  Server,
  Bot,
  FileText,
  MapPin,
  Brain,
  UserCheck,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Security & Data Privacy | VocUI',
  description:
    'How VocUI protects your data: encryption, access controls, GDPR compliance, and data handling practices for AI chatbot deployments.',
  alternates: { canonical: 'https://vocui.com/security' },
};

const dataHandling = [
  {
    icon: Database,
    title: 'Never used for training',
    body: 'Your knowledge base content, chat conversations, and customer data are never used to train our AI models or shared with third parties for model training.',
  },
  {
    icon: Lock,
    title: 'Isolated per account',
    body: "Each account's knowledge base and chat data is isolated. Your chatbot cannot access another customer's data.",
  },
  {
    icon: Trash2,
    title: 'Delete on request',
    body: 'You can delete your chatbot, knowledge sources, and all associated data at any time from your dashboard. Data is purged within 30 days.',
  },
];

const infrastructure = [
  {
    icon: Shield,
    title: 'Encryption in transit and at rest',
    body: 'All data transmitted between your visitors and VocUI is encrypted via TLS 1.2+. Data stored in our database is encrypted at rest.',
  },
  {
    icon: Server,
    title: 'Hosted on Supabase & Vercel',
    body: 'VocUI is built on Supabase (database, auth) and Vercel (hosting) — both SOC 2 Type II certified infrastructure providers.',
  },
  {
    icon: Bot,
    title: 'AI provider data handling',
    body: 'Chat messages are processed by Anthropic (Claude) and/or OpenAI. Both providers have enterprise data handling agreements and do not use API data for model training by default.',
  },
];

const compliance = [
  {
    icon: FileText,
    title: 'GDPR',
    body: 'VocUI processes data in compliance with GDPR. As a data processor, we only handle personal data as instructed by you (the data controller). A Data Processing Agreement (DPA) is available on request for Enterprise customers.',
  },
  {
    icon: MapPin,
    title: 'CCPA',
    body: 'For California residents, VocUI complies with the California Consumer Privacy Act. We do not sell personal data.',
  },
];

const responsibleAI = [
  {
    icon: Brain,
    title: 'Grounded in your content',
    body: "VocUI chatbots answer from your knowledge base, not from general training data. When a question isn't covered by your content, the chatbot says so rather than guessing.",
  },
  {
    icon: UserCheck,
    title: 'Human escalation built in',
    body: "Live agent handoff is a first-class feature, not an afterthought. You can configure escalation triggers so high-risk conversations always reach a human.",
  },
];

type SecurityItem = {
  icon: React.ElementType;
  title: string;
  body: string;
};

function SecurityGrid({ items }: { items: SecurityItem[] }) {
  return (
    <div className="space-y-4">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.title} className="border-secondary-200 dark:border-secondary-700">
            <CardContent className="pt-6 flex gap-4 items-start">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-900/50">
                <Icon className="h-5 w-5 text-primary-500" aria-hidden="true" />
              </div>
              <div>
                <p className="font-semibold text-secondary-900 dark:text-secondary-100 mb-1">
                  {item.title}
                </p>
                <p className="text-secondary-600 dark:text-secondary-400 leading-relaxed">
                  {item.body}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export default function SecurityPage() {
  return (
    <PageBackground>
      <Header />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Security & Data Privacy | VocUI',
            description:
              'How VocUI protects your data: encryption, access controls, GDPR compliance, and data handling practices for AI chatbot deployments.',
            url: 'https://vocui.com/security',
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
          badge="Security"
          title="Security & Data Privacy"
          description="We take the security of your data and your customers' conversations seriously. Here's exactly how we handle it."
          breadcrumbs={[{ label: 'Security' }]}
        />

        {/* Data Handling */}
        <section className="container mx-auto px-4 pb-12 max-w-3xl">
          <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-6">
            Your data is yours
          </h2>
          <SecurityGrid items={dataHandling} />
        </section>

        {/* Infrastructure */}
        <section className="container mx-auto px-4 pb-12 max-w-3xl">
          <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-6">
            Infrastructure & access controls
          </h2>
          <SecurityGrid items={infrastructure} />
        </section>

        {/* Compliance */}
        <section className="container mx-auto px-4 pb-12 max-w-3xl">
          <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-6">
            Compliance
          </h2>
          <SecurityGrid items={compliance} />
          <p className="mt-6 text-sm text-secondary-500 dark:text-secondary-400">
            For compliance documentation, DPAs, or security questionnaires, email{' '}
            <a
              href="mailto:security@vocui.com"
              className="text-primary-600 dark:text-primary-400 hover:underline"
            >
              security@vocui.com
            </a>
            .
          </p>
        </section>

        {/* Responsible AI */}
        <section className="container mx-auto px-4 pb-16 max-w-3xl">
          <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-6">
            Responsible AI
          </h2>
          <SecurityGrid items={responsibleAI} />
        </section>

        {/* Final CTA */}
        <section className="container mx-auto px-4 py-20 max-w-3xl">
          <div className="rounded-3xl bg-gradient-to-br from-primary-600 to-primary-800 p-12 text-center text-white shadow-xl shadow-primary-500/20">
            <h2 className="text-3xl font-bold mb-4">
              Enterprise-grade security on every plan
            </h2>
            <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
              Your data stays yours. Build and deploy a secure chatbot today — free plan, no credit card required.
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
                <Link href="/contact">Security Questions?</Link>
              </Button>
            </div>
            <p className="text-xs text-white/50 mt-6">
              For DPAs, compliance docs, or security questionnaires — email security@vocui.com
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </PageBackground>
  );
}
