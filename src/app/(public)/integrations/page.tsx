import type { Metadata } from 'next';
import { Header } from '@/components/layout';
import { Footer } from '@/components/ui/footer';
import { PageBackground } from '@/components/ui/page-background';
import { IntegrationsHero } from './integrations-hero';
import { IntegrationsFeatured } from './integrations-featured';
import { IntegrationsPlatforms } from './integrations-platforms';
import { IntegrationsDeveloper } from './integrations-developer';
import { IntegrationsRequest } from './integrations-request';
import { IntegrationsCta } from './integrations-cta';

// ─── Metadata ──────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'Integrations | Connect Your AI Chatbot Everywhere | VocUI',
  description:
    'Deploy your VocUI chatbot on any website, Slack, Telegram, WordPress, Shopify, and more. One chatbot, every channel your customers use.',
  keywords: [
    'chatbot integrations',
    'AI chatbot website widget',
    'Slack chatbot integration',
    'Telegram chatbot',
    'WordPress chatbot plugin',
    'Shopify chatbot',
    'chatbot API SDK',
    'embed chatbot on website',
  ],
  openGraph: {
    title: 'Integrations | Connect Your AI Chatbot Everywhere | VocUI',
    description:
      'Deploy your VocUI chatbot on any website, Slack, Telegram, WordPress, Shopify, and more. One chatbot, every channel your customers use.',
    url: 'https://vocui.com/integrations',
    siteName: 'VocUI',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Integrations | Connect Your AI Chatbot Everywhere | VocUI',
    description:
      'Deploy your VocUI chatbot on any website, Slack, Telegram, WordPress, Shopify, and more. One chatbot, every channel your customers use.',
  },
  alternates: { canonical: 'https://vocui.com/integrations' },
  robots: { index: true, follow: true },
};

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function IntegrationsPage() {
  return (
    <PageBackground>
      <Header />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Integrations | Connect Your AI Chatbot Everywhere | VocUI',
            description:
              'Deploy your VocUI chatbot on any website, Slack, Telegram, WordPress, Shopify, and more. One chatbot, every channel your customers use.',
            url: 'https://vocui.com/integrations',
            publisher: {
              '@type': 'Organization',
              name: 'VocUI',
              url: 'https://vocui.com',
            },
            mainEntity: {
              '@type': 'ItemList',
              name: 'VocUI Integrations',
              itemListElement: [
                {
                  '@type': 'ListItem',
                  position: 1,
                  name: 'Website Widget',
                  description:
                    'Embed a fully customizable AI chat widget on any website with one line of JavaScript.',
                  url: 'https://vocui.com/sdk',
                },
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: 'Slack',
                  description:
                    'Deploy your trained chatbot to Slack workspaces for instant internal knowledge access.',
                  url: 'https://vocui.com/slack-chatbot',
                },
                {
                  '@type': 'ListItem',
                  position: 3,
                  name: 'Telegram',
                  description:
                    'Connect your AI chatbot to Telegram for customer conversations on the go.',
                },
                {
                  '@type': 'ListItem',
                  position: 4,
                  name: 'API & SDK',
                  description:
                    'Programmatic access to build custom integrations with the VocUI REST API and JavaScript SDK.',
                  url: 'https://vocui.com/sdk',
                },
              ],
            },
          }),
        }}
      />

      <main id="main-content">
        {/* --- Hero: asymmetric, headline left + integration count right --- */}
        <IntegrationsHero />

        {/* --- Featured deploy channels: Widget, Slack, Telegram (light tinted bg) --- */}
        <IntegrationsFeatured />

        {/* --- CMS & Website Platforms: dark full-bleed horizontal strip --- */}
        <IntegrationsPlatforms />

        {/* --- Developer Tools + Booking: asymmetric side-by-side --- */}
        <IntegrationsDeveloper />

        {/* --- Request an Integration: compact callout banner --- */}
        <IntegrationsRequest />

        {/* --- Bottom CTA: gradient full-bleed --- */}
        <IntegrationsCta />
      </main>

      <Footer />
    </PageBackground>
  );
}
