import Link from 'next/link';
import { SocialPostGenerator } from '@/components/tools/SocialPostGenerator';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout';
import { ToolsHero } from '@/components/ui/tools-hero';
import { Footer } from '@/components/ui/footer';
import { Sparkles, Share2, Linkedin, Twitter, Instagram, Music, Hash, Zap, Target } from 'lucide-react';

export const metadata = {
  title: 'AI Social Post Generator - Create Viral Posts for Every Platform',
  description:
    'Generate optimized social media posts for LinkedIn, Twitter/X, Instagram, and TikTok. Create multiple variations with hashtags in seconds.',
};

export default function SocialPostPage() {
  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-950">
      <Header />

      <ToolsHero
        badge="New"
        title="AI Social Post Generator"
        description="Create scroll-stopping social media posts for LinkedIn, Twitter/X, Instagram, and TikTok. Generate multiple variations optimized for each platform in seconds."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Tools', href: '/tools' },
          { label: 'Social Post' },
        ]}
      />

      {/* Tool */}
      <main className="container mx-auto px-4 py-12">
        {/* Features */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto mb-16">
          <div className="flex items-center gap-4 rounded-xl bg-white dark:bg-secondary-800 p-6 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900">
              <Target className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <div className="font-semibold text-secondary-900 dark:text-secondary-100">4 Platforms</div>
              <div className="text-sm text-secondary-500 dark:text-secondary-400">One click, all networks</div>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-xl bg-white dark:bg-secondary-800 p-6 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900">
              <Sparkles className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <div className="font-semibold text-secondary-900 dark:text-secondary-100">5 Variations</div>
              <div className="text-sm text-secondary-500 dark:text-secondary-400">Per platform, configurable</div>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-xl bg-white dark:bg-secondary-800 p-6 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900">
              <Hash className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <div className="font-semibold text-secondary-900 dark:text-secondary-100">Smart Hashtags</div>
              <div className="text-sm text-secondary-500 dark:text-secondary-400">Platform-optimized</div>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-xl bg-white dark:bg-secondary-800 p-6 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900">
              <Zap className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <div className="font-semibold text-secondary-900 dark:text-secondary-100">Export Ready</div>
              <div className="text-sm text-secondary-500 dark:text-secondary-400">CSV for schedulers</div>
            </div>
          </div>
        </div>

        <SocialPostGenerator className="max-w-5xl mx-auto" />

        {/* Platform Cards */}
        <section className="mt-20 pt-12 border-t border-secondary-200 dark:border-secondary-800">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-xl font-bold mb-8 text-secondary-900 dark:text-secondary-100">Optimized for Each Platform</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
                color="bg-gradient-to-br from-[#00f2ea] via-black to-[#ff0050]"
              />
            </div>
          </div>
        </section>

        {/* Tips */}
        <section className="mt-20 pt-12 border-t border-secondary-200 dark:border-secondary-800">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl font-bold mb-8 text-secondary-900 dark:text-secondary-100">Tips for Viral Posts</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-xl border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 p-6">
                <h3 className="font-semibold mb-3 text-secondary-900 dark:text-secondary-100">Hook in First Line</h3>
                <p className="text-sm text-secondary-600 dark:text-secondary-400 leading-relaxed">
                  Your first line determines if people keep reading. Make it bold, surprising, or question-based.
                </p>
              </div>
              <div className="rounded-xl border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 p-6">
                <h3 className="font-semibold mb-3 text-secondary-900 dark:text-secondary-100">Platform-Native Content</h3>
                <p className="text-sm text-secondary-600 dark:text-secondary-400 leading-relaxed">
                  What works on LinkedIn doesn&apos;t work on TikTok. Each platform has its own culture and format.
                </p>
              </div>
              <div className="rounded-xl border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 p-6">
                <h3 className="font-semibold mb-3 text-secondary-900 dark:text-secondary-100">Repurpose Existing Content</h3>
                <p className="text-sm text-secondary-600 dark:text-secondary-400 leading-relaxed">
                  Paste your blog posts or articles to transform them into platform-optimized social content.
                </p>
              </div>
              <div className="rounded-xl border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 p-6">
                <h3 className="font-semibold mb-3 text-secondary-900 dark:text-secondary-100">Test Variations</h3>
                <p className="text-sm text-secondary-600 dark:text-secondary-400 leading-relaxed">
                  Generate multiple variations and post different ones to see which performs best with your audience.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mt-24 mb-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="rounded-3xl bg-gradient-to-br from-primary-700 to-primary-800 p-12 text-white shadow-xl">
              <h2 className="text-3xl font-bold mb-4">Ready to 10x your social media output?</h2>
              <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
                Create weeks of content in minutes. Start for free, no credit card required.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  variant="secondary"
                  className="bg-white text-primary-600 hover:bg-primary-50 px-8"
                  asChild
                >
                  <Link href="/signup">
                    Get Started Free
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-primary-600 px-8"
                  asChild
                >
                  <Link href="/pricing">View Pricing</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
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
    <div className="rounded-xl border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 p-6">
      <div className="flex items-center gap-4 mb-4">
        <div className={`flex h-12 w-12 items-center justify-center rounded-full text-white ${color}`}>
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="font-semibold text-secondary-900 dark:text-secondary-100">{name}</h3>
      </div>
      <p className="text-sm text-secondary-500 dark:text-secondary-400 mb-3">{style}</p>
      <div className="flex items-center gap-3 text-xs text-secondary-400">
        <span>{charLimit} char limit</span>
        <span>•</span>
        <span>~{optimal} optimal</span>
      </div>
    </div>
  );
}
