import { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Footer } from '@/components/ui/footer';
import { PageBackground } from '@/components/ui/page-background';
import { ToolsHero } from '@/components/ui/tools-hero';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Changelog | VocUI',
  description: "What's new in VocUI — recent product updates, new features, and improvements to the AI chatbot platform.",
  openGraph: {
    title: 'Changelog | VocUI',
    description: "What's new in VocUI — recent product updates, new features, and improvements to the AI chatbot platform.",
    url: 'https://vocui.com/changelog',
    siteName: 'VocUI',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Changelog | VocUI',
    description: "What's new in VocUI — recent product updates, new features, and improvements to the AI chatbot platform.",
  },
  alternates: { canonical: 'https://vocui.com/changelog' },
  robots: { index: true, follow: true },
};

type BadgeType = 'New' | 'Improved' | 'Fix';

interface ChangelogEntry {
  badge: BadgeType;
  title: string;
  detail: string;
}

interface ChangelogMonth {
  month: string;
  entries: ChangelogEntry[];
}

const changelog: ChangelogMonth[] = [
  {
    month: 'March 2026',
    entries: [
      {
        badge: 'New',
        title: 'Proactive Messaging',
        detail:
          'Trigger chatbot messages automatically based on visitor behavior. Configure up to 8 trigger types including scroll depth, time on page, exit intent, and URL match.',
      },
      {
        badge: 'New',
        title: 'Sentiment & Loyalty Scoring',
        detail:
          'Every conversation is now scored for sentiment and loyalty in real time. Flag high-risk conversations and identify your most engaged visitors automatically.',
      },
      {
        badge: 'Improved',
        title: 'Knowledge Source Management',
        detail:
          'Re-scrape URLs on demand, replace uploaded files without deleting and re-adding sources, and see per-source status in the dashboard.',
      },
    ],
  },
  {
    month: 'February 2026',
    entries: [
      {
        badge: 'New',
        title: 'Live Agent Handoff Console',
        detail:
          'Agents now have a dedicated console to take over chatbot conversations. Full conversation context is visible from the moment of handoff.',
      },
      {
        badge: 'New',
        title: 'Telegram Deployment',
        detail:
          'Deploy your trained chatbot to a Telegram bot. Same knowledge base, new channel — configured from your deploy dashboard.',
      },
      {
        badge: 'Improved',
        title: 'Multi-language Support',
        detail:
          "Expanded automatic language detection to 20+ languages. Your chatbot now responds in the visitor's language without any configuration.",
      },
    ],
  },
  {
    month: 'January 2026',
    entries: [
      {
        badge: 'New',
        title: 'In-Chat Appointment Booking',
        detail:
          'Connect to Easy!Appointments to let visitors check availability and book appointments directly in the chat window — no redirect required.',
      },
      {
        badge: 'New',
        title: 'Lead Capture & Surveys',
        detail:
          'Collect visitor contact information and run NPS or custom surveys inside any conversation flow.',
      },
      {
        badge: 'Improved',
        title: 'Widget Customization',
        detail:
          'Full control over chatbot widget appearance: colors, position, avatar, launcher icon, and welcome message.',
      },
    ],
  },
  {
    month: 'December 2025',
    entries: [
      {
        badge: 'New',
        title: 'Slack Integration',
        detail:
          'Deploy your knowledge base chatbot to any Slack workspace. Answer team questions from the same content that powers your website chatbot.',
      },
      {
        badge: 'New',
        title: 'REST API & SDK',
        detail:
          'Full REST API for custom integrations. Embed the agent console in your own app using the JavaScript SDK.',
      },
      {
        badge: 'Improved',
        title: 'PDF & DOCX Support',
        detail:
          'Improved text extraction from complex PDFs and Word documents, including multi-column layouts and embedded tables.',
      },
    ],
  },
  {
    month: 'November 2025',
    entries: [
      {
        badge: 'New',
        title: 'Q&A Pairs',
        detail:
          "Add manual question-and-answer pairs directly to any knowledge base. Fill gaps your documents don't cover with precise, authored responses.",
      },
      {
        badge: 'Improved',
        title: 'Knowledge Processing',
        detail:
          'Faster knowledge source processing and more accurate answer matching for better chatbot response quality.',
      },
      {
        badge: 'Fix',
        title: 'Session Continuity',
        detail:
          'Fixed an issue where returning visitors occasionally started a new session instead of continuing their previous conversation.',
      },
    ],
  },
];

const entryLinks: Record<string, string> = {
  'Slack Integration': '/slack-chatbot',
  'Proactive Messaging': '/chatbot-for-customer-support',
  'In-Chat Appointment Booking': '/chatbot-booking',
};

const badgeClasses: Record<BadgeType, string> = {
  New: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  Improved: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  Fix: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
};

export default function ChangelogPage() {
  return (
    <PageBackground>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Changelog | VocUI',
            description:
              "What's new in VocUI — recent product updates, new features, and improvements to the AI chatbot platform.",
            url: 'https://vocui.com/changelog',
            isPartOf: {
              '@type': 'WebSite',
              name: 'VocUI',
              url: 'https://vocui.com',
            },
            breadcrumb: {
              '@type': 'BreadcrumbList',
              itemListElement: [
                {
                  '@type': 'ListItem',
                  position: 1,
                  name: 'Home',
                  item: 'https://vocui.com',
                },
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: 'Changelog',
                  item: 'https://vocui.com/changelog',
                },
              ],
            },
          }),
        }}
      />

      <Header cta={{ label: 'Get Started', href: '/signup' }} />

      <main id="main-content">
        <ToolsHero
          badge="Updates"
          title="What's new in VocUI"
          description="Product updates, new features, and improvements. We ship regularly."
          breadcrumbs={[{ label: 'Changelog' }]}
        />

        {/* Timeline */}
        <section className="container mx-auto px-4 pb-16 max-w-3xl">
          <div className="relative">
            {/* Vertical line */}
            <div
              className="absolute left-0 top-0 bottom-0 w-px bg-secondary-200 dark:bg-secondary-700"
              aria-hidden="true"
            />

            <div className="space-y-12 pl-8">
              {changelog.map((group) => (
                <div key={group.month}>
                  {/* Month heading with dot */}
                  <div className="relative mb-6">
                    <div
                      className="absolute -left-8 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary-500 ring-2 ring-white dark:ring-secondary-900"
                      aria-hidden="true"
                    />
                    <h2 className="text-sm font-semibold uppercase tracking-widest text-secondary-500 dark:text-secondary-400">
                      {group.month}
                    </h2>
                  </div>

                  {/* Entries */}
                  <div className="space-y-6">
                    {group.entries.map((entry) => (
                      <div
                        key={entry.title}
                        className="relative rounded-xl border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-900 p-5"
                      >
                        {/* Entry dot */}
                        <div
                          className="absolute -left-[2.125rem] top-6 w-2 h-2 rounded-full bg-secondary-300 dark:bg-secondary-600"
                          aria-hidden="true"
                        />

                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold ${badgeClasses[entry.badge]}`}
                          >
                            {entry.badge}
                          </span>
                          <h3 className="text-base font-semibold text-[rgb(var(--text-heading))]">
                            {entryLinks[entry.title] ? (
                              <Link href={entryLinks[entry.title]} className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                                {entry.title}
                              </Link>
                            ) : (
                              entry.title
                            )}
                          </h3>
                        </div>

                        <p className="text-sm text-secondary-600 dark:text-secondary-400 leading-relaxed">
                          {entry.detail}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer note */}
        <section className="container mx-auto px-4 pb-20 max-w-3xl">
          <div className="rounded-xl border border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-900/50 px-6 py-5 text-sm text-secondary-600 dark:text-secondary-400">
            VocUI ships updates regularly. Subscribe to release notes by emailing{' '}
            <a
              href="mailto:updates@vocui.com"
              className="text-primary-600 dark:text-primary-400 hover:underline font-medium"
            >
              updates@vocui.com
            </a>
            .
          </div>
        </section>
        {/* Closing CTA — gradient block matching other marketing pages */}
        <section className="container mx-auto px-4 py-20 max-w-3xl">
          <div className="rounded-3xl bg-gradient-to-br from-primary-600 to-primary-800 p-12 text-center text-white shadow-xl shadow-primary-500/20">
            <h2 className="text-3xl font-bold mb-4">
              See what VocUI can do
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
                  Build Your Chatbot Free
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button size="xl" variant="outline-light" asChild>
                <Link href="/pricing">View Pricing</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </PageBackground>
  );
}
