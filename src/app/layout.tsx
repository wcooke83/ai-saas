import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { ColorOverridesProvider } from '@/components/providers/color-overrides-provider';
import { UISettingsProvider } from '@/contexts/ui-settings-context';
import { Toaster } from '@/components/ui/toaster';
import { ChatbotWidget } from '@/components/chatbot-widget';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'VocUI - Voice User Interface',
  description:
    'AI-powered chatbots trained on your knowledge base. Deploy on your website, Slack, or Telegram in minutes.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://vocui.com'),
  openGraph: {
    siteName: 'VocUI',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'VocUI',
              url: 'https://vocui.com',
              description:
                'AI-powered chatbot platform that lets businesses build, train, and deploy custom chatbots from their own content',
              sameAs: [],
            }),
          }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ColorOverridesProvider>
            <UISettingsProvider>
              {children}
              <Toaster position="bottom-right" />
            </UISettingsProvider>
          </ColorOverridesProvider>
        </ThemeProvider>

        <ChatbotWidget />
      </body>
    </html>
  );
}
