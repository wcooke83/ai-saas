import type React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout';
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
    title: 'No hallucinations by design',
    body: "VocUI chatbots are grounded in your knowledge base. When a question isn't covered by your content, the chatbot says so — it does not fabricate answers.",
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
      <Header cta={{ label: 'Sign In', href: '/login' }} />

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

        {/* Bottom CTA */}
        <section className="container mx-auto px-4 pb-20 max-w-3xl">
          <div className="border-t border-secondary-200 dark:border-secondary-800 pt-10">
            <Link
              href="/contact"
              className="inline-flex items-center gap-1 text-primary-600 dark:text-primary-400 hover:underline font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded"
            >
              Have a security question? Email security@vocui.com or contact us
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </PageBackground>
  );
}
