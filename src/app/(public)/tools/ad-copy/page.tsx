import Link from 'next/link';
import { AdCopyGenerator } from '@/components/tools/AdCopyGenerator';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout';
import { ToolsHero } from '@/components/ui/tools-hero';
import { Footer } from '@/components/ui/footer';
import { PageBackground } from '@/components/ui/page-background';
import { Sparkles } from 'lucide-react';

export const metadata = {
  title: 'AI Ad Copy Generator - Create High-Converting Ads for Google, Meta, LinkedIn & More',
  description:
    'Generate compelling ad copy for Google Ads, Meta, LinkedIn, Twitter/X, TikTok, and Pinterest. Get 3 A/B test variations with real-time character validation.',
};

export default function AdCopyPage() {
  return (
    <PageBackground>
      <Header />

      <ToolsHero
        badge="New"
        title="AI Ad Copy Generator"
        description="Create high-converting ad copy for Google, Meta, LinkedIn, Twitter/X, TikTok, and Pinterest. Generate 3 A/B test variations with real-time character validation."
        breadcrumbs={[
          { label: 'Tools', href: '/tools' },
          { label: 'Ad Copy' },
        ]}
      />

      {/* Tool */}
      <main className="container mx-auto px-4 py-8">
        <AdCopyGenerator className="max-w-6xl mx-auto" />

        {/* Platform Character Limits Reference */}
        <div className="mt-12 max-w-4xl mx-auto">
          <h2 className="text-lg font-semibold mb-4 text-secondary-900 dark:text-secondary-100">
            Platform Character Limits
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-secondary-200 dark:border-secondary-700 rounded-lg">
              <thead className="bg-secondary-100 dark:bg-secondary-800">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-secondary-700 dark:text-secondary-300">
                    Platform
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-secondary-700 dark:text-secondary-300">
                    Fields & Limits
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-200 dark:divide-secondary-700">
                <tr className="bg-white dark:bg-secondary-900">
                  <td className="px-4 py-3 font-medium text-secondary-900 dark:text-secondary-100">
                    Google Search
                  </td>
                  <td className="px-4 py-3 text-secondary-600 dark:text-secondary-400">
                    Headlines (30), Descriptions (90)
                  </td>
                </tr>
                <tr className="bg-white dark:bg-secondary-900">
                  <td className="px-4 py-3 font-medium text-secondary-900 dark:text-secondary-100">
                    Google Display
                  </td>
                  <td className="px-4 py-3 text-secondary-600 dark:text-secondary-400">
                    Short Headline (25), Long Headline (90), Description (90)
                  </td>
                </tr>
                <tr className="bg-white dark:bg-secondary-900">
                  <td className="px-4 py-3 font-medium text-secondary-900 dark:text-secondary-100">
                    Meta
                  </td>
                  <td className="px-4 py-3 text-secondary-600 dark:text-secondary-400">
                    Primary Text (125), Headline (40), Description (30)
                  </td>
                </tr>
                <tr className="bg-white dark:bg-secondary-900">
                  <td className="px-4 py-3 font-medium text-secondary-900 dark:text-secondary-100">
                    LinkedIn
                  </td>
                  <td className="px-4 py-3 text-secondary-600 dark:text-secondary-400">
                    Intro Text (150), Headline (70), Description (100)
                  </td>
                </tr>
                <tr className="bg-white dark:bg-secondary-900">
                  <td className="px-4 py-3 font-medium text-secondary-900 dark:text-secondary-100">
                    Twitter/X
                  </td>
                  <td className="px-4 py-3 text-secondary-600 dark:text-secondary-400">
                    Tweet Copy (280), Card Headline (70)
                  </td>
                </tr>
                <tr className="bg-white dark:bg-secondary-900">
                  <td className="px-4 py-3 font-medium text-secondary-900 dark:text-secondary-100">
                    TikTok
                  </td>
                  <td className="px-4 py-3 text-secondary-600 dark:text-secondary-400">
                    Ad Text (100), Video Hook (50), Video Body (200), CTA (50)
                  </td>
                </tr>
                <tr className="bg-white dark:bg-secondary-900">
                  <td className="px-4 py-3 font-medium text-secondary-900 dark:text-secondary-100">
                    Pinterest
                  </td>
                  <td className="px-4 py-3 text-secondary-600 dark:text-secondary-400">
                    Title (100), Description (500)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-12 max-w-3xl mx-auto">
          <h2 className="text-lg font-semibold mb-4 text-secondary-900 dark:text-secondary-100">
            Tips for Better Ad Copy
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 p-4">
              <h3 className="font-medium mb-2 text-secondary-900 dark:text-secondary-100">
                Be Specific with Benefits
              </h3>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">
                Instead of &quot;great software&quot;, say &quot;save 10 hours/week&quot;. Specific
                numbers and outcomes resonate better with audiences.
              </p>
            </div>
            <div className="rounded-lg border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 p-4">
              <h3 className="font-medium mb-2 text-secondary-900 dark:text-secondary-100">
                Match Platform Tone
              </h3>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">
                LinkedIn users expect professional tone, while TikTok works better with casual,
                trendy language. Adjust your tone accordingly.
              </p>
            </div>
            <div className="rounded-lg border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 p-4">
              <h3 className="font-medium mb-2 text-secondary-900 dark:text-secondary-100">
                Test Multiple Variations
              </h3>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">
                Always generate 3 variations and A/B test them. Small changes in headlines can lead
                to 2-3x better click-through rates.
              </p>
            </div>
            <div className="rounded-lg border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 p-4">
              <h3 className="font-medium mb-2 text-secondary-900 dark:text-secondary-100">
                Clear Call to Action
              </h3>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">
                Be specific about what you want users to do: &quot;Start free trial&quot; is better
                than &quot;Learn more&quot;. Action-oriented CTAs convert better.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 max-w-2xl mx-auto text-center">
          <div className="rounded-2xl bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 border border-primary-200 dark:border-primary-800 p-8">
            <Sparkles className="h-10 w-10 text-primary-500 mx-auto mb-4" aria-hidden="true" />
            <h3 className="text-xl font-semibold mb-2 text-secondary-900 dark:text-secondary-100">
              Need More Ad Copy?
            </h3>
            <p className="text-secondary-600 dark:text-secondary-400 mb-4">
              Sign up for unlimited generations and access to all our AI tools.
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
