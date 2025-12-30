import Link from 'next/link';
import { EmailWriter } from '@/components/tools/EmailWriter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Sparkles, Code, ExternalLink } from 'lucide-react';

export const metadata = {
  title: 'AI Email Writer - Generate Professional Emails Instantly',
  description:
    'Write professional emails in seconds with AI. Perfect for cold outreach, follow-ups, introductions, and more.',
};

export default function EmailWriterPage() {
  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <header className="border-b border-secondary-200 bg-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-secondary-600 hover:text-secondary-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
            <div className="h-6 w-px bg-secondary-200" />
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary-500" />
              <span className="font-semibold">AI Email Writer</span>
              <Badge variant="success">Free</Badge>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/embed/email-writer">
                <Code className="mr-2 h-4 w-4" />
                Embed
              </Link>
            </Button>
            <Button size="sm">
              Sign Up for More
            </Button>
          </div>
        </div>
      </header>

      {/* Tool */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">AI Email Writer</h1>
          <p className="text-secondary-600 max-w-2xl mx-auto">
            Generate professional emails in seconds. Perfect for cold outreach,
            follow-ups, introductions, meeting requests, and more.
          </p>
        </div>

        <EmailWriter className="max-w-5xl mx-auto" />

        {/* Tips */}
        <div className="mt-12 max-w-3xl mx-auto">
          <h2 className="text-lg font-semibold mb-4">Tips for Better Results</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-secondary-200 bg-white p-4">
              <h3 className="font-medium mb-2">Be Specific</h3>
              <p className="text-sm text-secondary-600">
                The more context you provide about your purpose and the recipient,
                the more personalized your email will be.
              </p>
            </div>
            <div className="rounded-lg border border-secondary-200 bg-white p-4">
              <h3 className="font-medium mb-2">Add Key Points</h3>
              <p className="text-sm text-secondary-600">
                Include specific details, numbers, or talking points you want
                mentioned in the email.
              </p>
            </div>
            <div className="rounded-lg border border-secondary-200 bg-white p-4">
              <h3 className="font-medium mb-2">Choose the Right Tone</h3>
              <p className="text-sm text-secondary-600">
                Match the tone to your relationship with the recipient and your
                industry norms.
              </p>
            </div>
            <div className="rounded-lg border border-secondary-200 bg-white p-4">
              <h3 className="font-medium mb-2">Iterate</h3>
              <p className="text-sm text-secondary-600">
                Not happy with the result? Click regenerate or adjust your inputs
                for a different variation.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
