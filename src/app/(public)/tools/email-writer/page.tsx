import Link from 'next/link';
import { EmailWriter } from '@/components/tools/EmailWriter';
import { Header } from '@/components/layout';
import { ToolsHero } from '@/components/ui/tools-hero';
import { Footer } from '@/components/ui/footer';
import { PageBackground } from '@/components/ui/page-background';

export const metadata = {
  title: 'AI Email Writer - Generate Professional Emails Instantly',
  description:
    'Write professional emails in seconds with AI. Perfect for cold outreach, follow-ups, introductions, and more.',
};

export default function EmailWriterPage() {
  return (
    <PageBackground>
      <Header />

      <ToolsHero
        badge="Free"
        title="AI Email Writer"
        description="Generate professional emails in seconds. Perfect for cold outreach, follow-ups, introductions, meeting requests, and more."
        breadcrumbs={[
          { label: 'Tools', href: '/tools' },
          { label: 'Email Writer' },
        ]}
      />

      {/* Tool */}
      <main className="container mx-auto px-4 py-8">
        <EmailWriter className="max-w-5xl mx-auto" />

        {/* Tips */}
        <div className="mt-12 max-w-3xl mx-auto">
          <h2 className="text-lg font-semibold mb-4 text-secondary-900 dark:text-secondary-100">Tips for Better Results</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 p-4">
              <h3 className="font-medium mb-2 text-secondary-900 dark:text-secondary-100">Be Specific</h3>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">
                The more context you provide about your purpose and the recipient,
                the more personalized your email will be.
              </p>
            </div>
            <div className="rounded-lg border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 p-4">
              <h3 className="font-medium mb-2 text-secondary-900 dark:text-secondary-100">Add Key Points</h3>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">
                Include specific details, numbers, or talking points you want
                mentioned in the email.
              </p>
            </div>
            <div className="rounded-lg border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 p-4">
              <h3 className="font-medium mb-2 text-secondary-900 dark:text-secondary-100">Choose the Right Tone</h3>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">
                Match the tone to your relationship with the recipient and your
                industry norms.
              </p>
            </div>
            <div className="rounded-lg border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 p-4">
              <h3 className="font-medium mb-2 text-secondary-900 dark:text-secondary-100">Iterate</h3>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">
                Not happy with the result? Click regenerate or adjust your inputs
                for a different variation.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </PageBackground>
  );
}
