import Link from 'next/link';
import { MeetingNotesSummarizer } from '@/components/tools/MeetingNotesSummarizer';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout';
import { ToolsHero } from '@/components/ui/tools-hero';
import { Footer } from '@/components/ui/footer';
import { PageBackground } from '@/components/ui/page-background';
import { Sparkles } from 'lucide-react';

export const metadata = {
  title: 'AI Meeting Notes Summarizer - Extract Action Items & Key Decisions',
  description:
    'Transform meeting transcripts into structured summaries with action items, key decisions, and follow-ups. Supports Zoom, Teams, and more.',
};

export default function MeetingNotesPage() {
  return (
    <PageBackground>
      <Header />

      <ToolsHero
        badge="New"
        title="AI Meeting Notes Summarizer"
        description="Transform meeting transcripts into structured summaries. Extract action items, key decisions, and follow-ups in seconds. Supports transcripts from Zoom, Teams, Google Meet, Otter.ai, and more."
        breadcrumbs={[
          { label: 'Tools', href: '/tools' },
          { label: 'Meeting Notes' },
        ]}
      />

      {/* Tool */}
      <main className="container mx-auto px-4 py-8">
        <MeetingNotesSummarizer className="max-w-5xl mx-auto" />

        {/* Tips */}
        <div className="mt-12 max-w-3xl mx-auto">
          <h2 className="text-lg font-semibold mb-4 text-secondary-900 dark:text-secondary-100">
            Tips for Better Results
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 p-4">
              <h3 className="font-medium mb-2 text-secondary-900 dark:text-secondary-100">
                Use Speaker Labels
              </h3>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">
                Transcripts with speaker labels (e.g., &quot;John:&quot; or &quot;[Sarah]&quot;) help
                identify action item owners and attendees automatically.
              </p>
            </div>
            <div className="rounded-lg border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 p-4">
              <h3 className="font-medium mb-2 text-secondary-900 dark:text-secondary-100">
                Choose the Right Meeting Type
              </h3>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">
                Selecting the correct meeting type helps the AI focus on what matters most
                for that context.
              </p>
            </div>
            <div className="rounded-lg border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 p-4">
              <h3 className="font-medium mb-2 text-secondary-900 dark:text-secondary-100">
                Upload Subtitle Files
              </h3>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">
                VTT and SRT files from Zoom or Teams are automatically cleaned up when
                uploaded - timestamps are removed.
              </p>
            </div>
            <div className="rounded-lg border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 p-4">
              <h3 className="font-medium mb-2 text-secondary-900 dark:text-secondary-100">
                Add Context When Helpful
              </h3>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">
                If your transcript uses abbreviations or project names, add them in the
                context field for better understanding.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 max-w-2xl mx-auto text-center">
          <div className="rounded-2xl bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 border border-primary-200 dark:border-primary-800 p-8">
            <Sparkles className="h-10 w-10 text-primary-500 mx-auto mb-4" aria-hidden="true" />
            <h3 className="text-xl font-semibold mb-2 text-secondary-900 dark:text-secondary-100">
              Need More Summaries?
            </h3>
            <p className="text-secondary-600 dark:text-secondary-400 mb-4">
              Sign up for unlimited meeting summaries and access to all our AI tools.
            </p>
            <Button asChild>
              <Link href="/pricing">View Pricing</Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </PageBackground>
  );
}
