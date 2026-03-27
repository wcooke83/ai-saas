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
    'AI-powered tools to supercharge your workflow. Email writer, report generator, and more.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
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
