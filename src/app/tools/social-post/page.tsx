import Link from 'next/link';
import { SocialPostGenerator } from '@/components/tools/SocialPostGenerator';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Sparkles, Code, Share2, Linkedin, Twitter, Instagram, Music, Hash, Zap, Target } from 'lucide-react';

export const metadata = {
  title: 'AI Social Post Generator - Create Viral Posts for Every Platform',
  description:
    'Generate optimized social media posts for LinkedIn, Twitter/X, Instagram, and TikTok. Create multiple variations with hashtags in seconds.',
};

export default function SocialPostPage() {
  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-950">
      {/* Header */}
      <header className="border-b border-secondary-200 dark:border-secondary-800 bg-white dark:bg-secondary-900">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link
              href="/tools"
              className="flex items-center gap-2 text-secondary-600 hover:text-secondary-900 dark:text-secondary-400 dark:hover:text-secondary-100"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
            <div className="h-6 w-px bg-secondary-200 dark:bg-secondary-700" />
            <div className="flex items-center gap-2">
              <Share2 className="h-5 w-5 text-primary-500" />
              <span className="font-semibold text-secondary-900 dark:text-secondary-100">Social Post Generator</span>
              <Badge variant="default">New</Badge>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/pricing">
                View Pricing
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/signup">
                Sign Up Free
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Tool */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2 text-secondary-900 dark:text-secondary-100">
            AI Social Post Generator
          </h1>
          <p className="text-secondary-600 dark:text-secondary-400 max-w-2xl mx-auto">
            Create scroll-stopping social media posts for LinkedIn, Twitter/X, Instagram, and TikTok.
            Generate multiple variations optimized for each platform in seconds.
          </p>
        </div>

        {/* Features */}
        <div className="grid gap-4 sm:grid-cols-4 max-w-4xl mx-auto mb-8">
          <div className="flex items-center gap-3 rounded-lg bg-white dark:bg-secondary-800 p-4 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
              <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <div className="font-medium text-secondary-900 dark:text-secondary-100">4 Platforms</div>
              <div className="text-sm text-secondary-500 dark:text-secondary-400">One click, all networks</div>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-white dark:bg-secondary-800 p-4 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
              <Sparkles className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <div className="font-medium text-secondary-900 dark:text-secondary-100">5 Variations</div>
              <div className="text-sm text-secondary-500 dark:text-secondary-400">Per platform, configurable</div>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-white dark:bg-secondary-800 p-4 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
              <Hash className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <div className="font-medium text-secondary-900 dark:text-secondary-100">Smart Hashtags</div>
              <div className="text-sm text-secondary-500 dark:text-secondary-400">Platform-optimized</div>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-white dark:bg-secondary-800 p-4 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900">
              <Zap className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <div className="font-medium text-secondary-900 dark:text-secondary-100">Export Ready</div>
              <div className="text-sm text-secondary-500 dark:text-secondary-400">CSV for schedulers</div>
            </div>
          </div>
        </div>

        <SocialPostGenerator className="max-w-5xl mx-auto" />

        {/* Platform Cards */}
        <div className="mt-12 max-w-4xl mx-auto">
          <h2 className="text-lg font-semibold mb-4 text-secondary-900 dark:text-secondary-100">Optimized for Each Platform</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <PlatformCard
              icon={Linkedin}
              name="LinkedIn"
              charLimit={3000}
              optimal={200}
              style="Professional, story-driven"
              color="bg-blue-600"
            />
            <PlatformCard
              icon={Twitter}
              name="Twitter/X"
              charLimit={280}
              optimal={200}
              style="Concise, punchy hooks"
              color="bg-black"
            />
            <PlatformCard
              icon={Instagram}
              name="Instagram"
              charLimit={2200}
              optimal={150}
              style="Visual-first captions"
              color="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500"
            />
            <PlatformCard
              icon={Music}
              name="TikTok"
              charLimit={2200}
              optimal={150}
              style="Casual, trendy hooks"
              color="bg-black"
            />
          </div>
        </div>

        {/* Tips */}
        <div className="mt-12 max-w-3xl mx-auto">
          <h2 className="text-lg font-semibold mb-4 text-secondary-900 dark:text-secondary-100">Tips for Viral Posts</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 p-4">
              <h3 className="font-medium mb-2 text-secondary-900 dark:text-secondary-100">Hook in First Line</h3>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">
                Your first line determines if people keep reading. Make it bold, surprising, or question-based.
              </p>
            </div>
            <div className="rounded-lg border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 p-4">
              <h3 className="font-medium mb-2 text-secondary-900 dark:text-secondary-100">Platform-Native Content</h3>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">
                What works on LinkedIn doesn&apos;t work on TikTok. Each platform has its own culture and format.
              </p>
            </div>
            <div className="rounded-lg border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 p-4">
              <h3 className="font-medium mb-2 text-secondary-900 dark:text-secondary-100">Repurpose Existing Content</h3>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">
                Paste your blog posts or articles to transform them into platform-optimized social content.
              </p>
            </div>
            <div className="rounded-lg border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 p-4">
              <h3 className="font-medium mb-2 text-secondary-900 dark:text-secondary-100">Test Variations</h3>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">
                Generate multiple variations and post different ones to see which performs best with your audience.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 max-w-2xl mx-auto text-center">
          <div className="rounded-2xl bg-primary-500 p-8 text-white">
            <h2 className="text-2xl font-bold mb-2">Ready to 10x your social media output?</h2>
            <p className="text-primary-100 mb-6">
              Create weeks of content in minutes. Start for free, no credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-primary-600 hover:bg-primary-50"
                asChild
              >
                <Link href="/signup">
                  Get Started Free
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-primary-600"
                asChild
              >
                <Link href="/pricing">View Pricing</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function PlatformCard({
  icon: Icon,
  name,
  charLimit,
  optimal,
  style,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  name: string;
  charLimit: number;
  optimal: number;
  style: string;
  color: string;
}) {
  return (
    <div className="rounded-lg border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-full text-white ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="font-medium text-secondary-900 dark:text-secondary-100">{name}</h3>
      </div>
      <p className="text-sm text-secondary-500 dark:text-secondary-400 mb-2">{style}</p>
      <div className="flex items-center gap-3 text-xs text-secondary-400">
        <span>{charLimit} char limit</span>
        <span>•</span>
        <span>~{optimal} optimal</span>
      </div>
    </div>
  );
}
