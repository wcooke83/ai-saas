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
    'Deploy your VocUI chatbot on any website, Slack, Telegram, Facebook Messenger, Instagram DMs, SMS, email, WordPress, Shopify, and more. One chatbot, every channel your customers use.',
  keywords: [
    'chatbot integrations',
    'AI chatbot website widget',
    'Slack chatbot integration',
    'Telegram chatbot',
    'Facebook Messenger chatbot',
    'Instagram DM chatbot',
    'SMS chatbot Twilio',
    'email chatbot',
    'WordPress chatbot plugin',
    'Shopify chatbot',
    'chatbot API SDK',
    'embed chatbot on website',
  ],
  openGraph: {
    title: 'Integrations | Connect Your AI Chatbot Everywhere | VocUI',
    description:
      'Deploy your VocUI chatbot on any website, Slack, Telegram, Facebook Messenger, Instagram DMs, SMS, email, WordPress, Shopify, and more. One chatbot, every channel your customers use.',
    url: 'https://vocui.com/integrations',
    siteName: 'VocUI',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Integrations | Connect Your AI Chatbot Everywhere | VocUI',
    description:
      'Deploy your VocUI chatbot on any website, Slack, Telegram, Facebook Messenger, Instagram DMs, SMS, email, WordPress, Shopify, and more. One chatbot, every channel your customers use.',
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
                  name: 'Facebook Messenger',
                  description:
                    'Connect your Facebook Page and let VocUI respond to every Messenger DM instantly.',
                  url: 'https://vocui.com/chatbot-for-facebook-messenger',
                },
                {
                  '@type': 'ListItem',
                  position: 5,
                  name: 'Instagram DMs',
                  description:
                    'Auto-reply to every Instagram DM with answers from your knowledge base.',
                  url: 'https://vocui.com/chatbot-for-instagram',
                },
                {
                  '@type': 'ListItem',
                  position: 6,
                  name: 'SMS via Twilio',
                  description:
                    'Bring your own Twilio number and let VocUI answer every inbound SMS.',
                  url: 'https://vocui.com/chatbot-for-sms',
                },
                {
                  '@type': 'ListItem',
                  position: 7,
                  name: 'Email Inbound',
                  description:
                    'Forward your support inbox to VocUI for instant, knowledge-base-powered replies.',
                  url: 'https://vocui.com/chatbot-for-email',
                },
                {
                  '@type': 'ListItem',
                  position: 8,
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
