import Link from 'next/link';
import { EmailSequenceBuilder } from '@/components/tools/EmailSequenceBuilder';
import { Header } from '@/components/layout';
import { ToolsHero } from '@/components/ui/tools-hero';
import { Footer } from '@/components/ui/footer';
import { PageBackground } from '@/components/ui/page-background';
import { Mail, Calendar, Zap } from 'lucide-react';

export const metadata = {
  title: 'AI Email Sequence Builder - Generate Multi-Email Campaigns',
  description:
    'Create complete email sequences for cold outreach, onboarding, sales nurture, and more. Generate 3-7 strategically crafted emails in seconds.',
};

export default function EmailSequencePage() {
  return (
    <PageBackground>
      <Header />

      <ToolsHero
        badge="Pro"
        title="AI Email Sequence Builder"
        description="Generate complete email sequences for cold outreach, onboarding, sales nurture, and more. Create 3-7 strategically crafted emails in seconds."
        breadcrumbs={[
          { label: 'Tools', href: '/tools' },
          { label: 'Email Sequence' },
        ]}
      />

      {/* Tool */}
      <main className="container mx-auto px-4 py-8">
        {/* Features */}
        <div className="grid gap-4 sm:grid-cols-3 max-w-3xl mx-auto mb-8">
          <div className="flex items-center gap-3 rounded-lg bg-white dark:bg-secondary-800 p-4 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900">
              <Mail className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <div className="font-medium text-secondary-900 dark:text-secondary-100">8 Sequence Types</div>
              <div className="text-sm text-secondary-500 dark:text-secondary-400">Cold outreach to onboarding</div>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-white dark:bg-secondary-800 p-4 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
              <Calendar className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <div className="font-medium text-secondary-900 dark:text-secondary-100">Smart Timing</div>
              <div className="text-sm text-secondary-500 dark:text-secondary-400">Optimal send schedules</div>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-white dark:bg-secondary-800 p-4 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
              <Zap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <div className="font-medium text-secondary-900 dark:text-secondary-100">Export Ready</div>
              <div className="text-sm text-secondary-500 dark:text-secondary-400">CSV & text export</div>
            </div>
          </div>
        </div>

        <EmailSequenceBuilder className="max-w-4xl mx-auto" />

        {/* Sequence Types Guide */}
        <div className="mt-12 max-w-4xl mx-auto">
          <h2 className="text-lg font-semibold mb-4 text-secondary-900 dark:text-secondary-100">Sequence Types</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <SequenceTypeCard
              title="Cold Outreach"
              description="Reach prospects who don't know you yet"
              emails={5}
              days={21}
            />
            <SequenceTypeCard
              title="Follow-Up"
              description="Follow up after initial contact"
              emails={3}
              days={5}
            />
            <SequenceTypeCard
              title="Onboarding"
              description="Welcome and guide new customers"
              emails={5}
              days={14}
            />
            <SequenceTypeCard
              title="Re-engagement"
              description="Win back inactive users"
              emails={3}
              days={14}
            />
            <SequenceTypeCard
              title="Sales Nurture"
              description="Nurture leads through the funnel"
              emails={7}
              days={28}
            />
            <SequenceTypeCard
              title="Event Promotion"
              description="Promote webinars and launches"
              emails={5}
              days={7}
            />
            <SequenceTypeCard
              title="Product Launch"
              description="Build anticipation for new products"
              emails={5}
              days={8}
            />
            <SequenceTypeCard
              title="Feedback Request"
              description="Collect reviews and testimonials"
              emails={3}
              days={10}
            />
          </div>
        </div>

        {/* Tips */}
        <div className="mt-12 max-w-3xl mx-auto">
          <h2 className="text-lg font-semibold mb-4 text-secondary-900 dark:text-secondary-100">Tips for Better Sequences</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 p-4">
              <h3 className="font-medium mb-2 text-secondary-900 dark:text-secondary-100">Define Clear Goals</h3>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">
                Be specific about what action you want recipients to take. Vague goals lead to vague emails.
              </p>
            </div>
            <div className="rounded-lg border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 p-4">
              <h3 className="font-medium mb-2 text-secondary-900 dark:text-secondary-100">Know Your Audience</h3>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">
                The more specific your target audience, the more personalized and effective your sequence will be.
              </p>
            </div>
            <div className="rounded-lg border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 p-4">
              <h3 className="font-medium mb-2 text-secondary-900 dark:text-secondary-100">Highlight Pain Points</h3>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">
                Include the problems your audience faces so emails can address them directly.
              </p>
            </div>
            <div className="rounded-lg border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 p-4">
              <h3 className="font-medium mb-2 text-secondary-900 dark:text-secondary-100">Review & Personalize</h3>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">
                Use {`{{first_name}}`} placeholders and customize each email before sending.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </PageBackground>
  );
}

function SequenceTypeCard({
  title,
  description,
  emails,
  days,
}: {
  title: string;
  description: string;
  emails: number;
  days: number;
}) {
  return (
    <div className="rounded-lg border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 p-4">
      <h3 className="font-medium text-secondary-900 dark:text-secondary-100">{title}</h3>
      <p className="text-sm text-secondary-500 dark:text-secondary-400 mb-3">{description}</p>
      <div className="flex items-center gap-3 text-xs text-secondary-400">
        <span className="flex items-center gap-1">
          <Mail className="h-3 w-3" />
          {emails} emails
        </span>
        <span className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {days} days
        </span>
      </div>
    </div>
  );
}
