import Link from 'next/link';
import { Header } from '@/components/layout';
import { ToolsHero } from '@/components/ui/tools-hero';
import { Footer } from '@/components/ui/footer';
import { PageBackground } from '@/components/ui/page-background';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, Clock, FileQuestion, Book } from 'lucide-react';
import { HelpForm } from '../help/help-form';

export const metadata = {
  title: 'Contact VocUI | Get in Touch',
  description: 'Contact the VocUI team for support, sales inquiries, or general questions.',
};

export default function ContactPage() {
  return (
    <PageBackground>
      <Header cta={{ label: 'Sign In', href: '/login' }} />

      <main id="main-content">
        <ToolsHero
          badge="Contact"
          title="Get in touch"
          description="We're a small team and we read every message."
          breadcrumbs={[{ label: 'Contact' }]}
        />

        <div className="container mx-auto px-4 pb-20 max-w-4xl">
          <div className="grid gap-8 md:grid-cols-3">

            {/* Sidebar */}
            <aside className="space-y-6">
              {/* Email */}
              <Card className="border-secondary-200 dark:border-secondary-700">
                <CardContent className="pt-6 space-y-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-900/50">
                    <Mail className="h-5 w-5 text-primary-500" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-medium text-secondary-900 dark:text-secondary-100 text-sm mb-1">
                      Email us
                    </p>
                    <a
                      href="mailto:support@vocui.com"
                      className="text-primary-600 dark:text-primary-400 hover:underline text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded"
                    >
                      support@vocui.com
                    </a>
                  </div>
                  <Badge variant="outline" className="text-xs w-fit">
                    <Clock className="w-3 h-3 mr-1" aria-hidden="true" />
                    Within 24h on business days
                  </Badge>
                  <p className="text-xs text-secondary-500 dark:text-secondary-400">
                    For enterprise inquiries, mention it in your message.
                  </p>
                </CardContent>
              </Card>

              {/* Self-service */}
              <div>
                <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-3">
                  Looking for quick answers?
                </p>
                <div className="space-y-2">
                  <Link
                    href="/faq"
                    className="flex items-center gap-2 p-3 bg-white dark:bg-secondary-900 border border-secondary-200 dark:border-secondary-800 rounded-lg text-sm text-secondary-600 dark:text-secondary-400 hover:text-primary-600 hover:border-primary-200 dark:hover:border-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  >
                    <FileQuestion className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span>Browse the FAQ</span>
                  </Link>
                  <Link
                    href="/help"
                    className="flex items-center gap-2 p-3 bg-white dark:bg-secondary-900 border border-secondary-200 dark:border-secondary-800 rounded-lg text-sm text-secondary-600 dark:text-secondary-400 hover:text-primary-600 hover:border-primary-200 dark:hover:border-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  >
                    <Book className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span>Help &amp; support docs</span>
                  </Link>
                </div>
                <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-3">
                  The FAQ covers most common questions about billing, credits, and the API.
                </p>
              </div>
            </aside>

            {/* Form */}
            <div className="md:col-span-2">
              <Card>
                <CardContent className="pt-6">
                  <HelpForm />
                </CardContent>
              </Card>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </PageBackground>
  );
}
