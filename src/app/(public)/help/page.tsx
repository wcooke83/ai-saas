import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/layout';
import { ToolsHero } from '@/components/ui/tools-hero';
import { Footer } from '@/components/ui/footer';
import { PageBackground } from '@/components/ui/page-background';
import {
  Mail,
  Book,
  FileQuestion,
  Clock,
  Zap,
  ExternalLink,
} from 'lucide-react';
import { HelpForm } from './help-form';

export const metadata = {
  title: 'Help & Support | VocUI',
  description: 'Get help with VocUI. Contact support, browse documentation, or submit a request.',
};

const supportOptions = [
  {
    title: 'Documentation',
    description: 'Browse our comprehensive guides and tutorials',
    icon: Book,
    href: '/sdk',
    badge: null,
  },
  {
    title: 'FAQ',
    description: 'Find answers to commonly asked questions',
    icon: FileQuestion,
    href: '/faq',
    badge: null,
  },
  {
    title: 'Email Support',
    description: 'Get help from our support team',
    icon: Mail,
    href: 'mailto:support@vocui.com',
    badge: 'Response within 24h',
  },
];

const quickLinks = [
  { title: 'How do credits work?', href: '/faq#credits' },
  { title: 'How to use the API?', href: '/sdk#api' },
  { title: 'Billing & subscriptions', href: '/faq#billing' },
  { title: 'Account settings', href: '/dashboard/settings' },
];

export default async function HelpPage({
  searchParams,
}: {
  searchParams: Promise<{ subject?: string }>;
}) {
  const params = await searchParams;
  const prefilledSubject = params.subject || '';

  return (
    <PageBackground>
      <Header cta={{ label: 'Sign In', href: '/login' }} />

      <main id="main-content">
        {/* Hero */}
        <ToolsHero
          badge="Support"
          title="How can we help?"
          description="Get the support you need. Browse our documentation, check the FAQ, or reach out to our team directly."
          breadcrumbs={[
            { label: 'Help' },
          ]}
        />

        {/* Support Options */}
        <section className="container mx-auto px-4 pb-12">
          <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
            {supportOptions.map((option) => {
              const Icon = option.icon;
              const isExternal = option.href.startsWith('mailto:');
              return (
                <Card
                  key={option.title}
                  className="hover:shadow-lg hover:border-primary-200 dark:hover:border-primary-700 transition-all duration-200"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-900/50">
                        <Icon className="h-6 w-6 text-primary-500" aria-hidden="true" />
                      </div>
                      {option.badge && (
                        <Badge variant="outline" className="text-xs">
                          <Clock className="w-3 h-3 mr-1" aria-hidden="true" />
                          {option.badge}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg">{option.title}</CardTitle>
                    <CardDescription>{option.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href={option.href} {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                        {isExternal ? 'Send Email' : 'View'}
                        {isExternal && <ExternalLink className="ml-2 h-4 w-4" aria-hidden="true" />}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Quick Links */}
        <section className="container mx-auto px-4 pb-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary-500" aria-hidden="true" />
              Quick Links
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {quickLinks.map((link) => (
                <Link
                  key={link.title}
                  href={link.href}
                  className="flex items-center gap-2 p-3 bg-white dark:bg-secondary-900 border border-secondary-200 dark:border-secondary-800 rounded-lg text-secondary-600 dark:text-secondary-400 hover:text-primary-600 hover:border-primary-200 dark:hover:border-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  <span>{link.title}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="container mx-auto px-4 py-12 border-t border-secondary-200 dark:border-secondary-800">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-2">
                Send us a message
              </h2>
              <p className="text-secondary-600 dark:text-secondary-400">
                Can&apos;t find what you&apos;re looking for? Fill out the form below and we&apos;ll get back to you.
              </p>
            </div>

            <Card>
              <CardContent className="pt-6">
                <HelpForm prefilledSubject={prefilledSubject} />
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </PageBackground>
  );
}
