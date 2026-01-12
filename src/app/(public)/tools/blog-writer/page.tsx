import Link from 'next/link';
import { BlogWriter } from '@/components/tools/BlogWriter';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout';
import { Card, CardContent } from '@/components/ui/card';
import { ToolsHero } from '@/components/ui/tools-hero';
import { Footer } from '@/components/ui/footer';
import { PageBackground } from '@/components/ui/page-background';
import {
  Sparkles,
  Search,
  List,
  Target,
  Zap,
  PenTool,
} from 'lucide-react';

export const metadata = {
  title: 'AI Blog Post Writer - Generate SEO-Optimized Articles Instantly',
  description:
    'Create high-quality blog posts with AI. Generate listicles, how-tos, tutorials, reviews, and more with built-in SEO optimization.',
};

export default function BlogWriterPage() {
  return (
    <PageBackground>
      <Header />

      <ToolsHero
        badge="New"
        title="AI Blog Post Writer"
        description="Create high-quality, SEO-optimized blog posts in minutes. Generate outlines, review and edit, then produce your complete article with AI assistance."
        breadcrumbs={[
          { label: 'Tools', href: '/tools' },
          { label: 'Blog Writer' },
        ]}
      />

      <main className="container mx-auto px-4 py-8">
        {/* Features */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 max-w-4xl mx-auto mb-8">
          <FeatureCard
            icon={List}
            title="6 Formats"
            description="Listicles, how-tos, tutorials, reviews, and more"
          />
          <FeatureCard
            icon={Search}
            title="SEO Built-in"
            description="Keywords, meta descriptions, title tags"
          />
          <FeatureCard
            icon={PenTool}
            title="Two-Step Flow"
            description="Review outline before full generation"
          />
          <FeatureCard
            icon={Target}
            title="Customizable"
            description="Tone, word count, and audience targeting"
          />
        </div>

        {/* Main Tool */}
        <BlogWriter className="max-w-4xl mx-auto" />

        {/* Tips */}
        <div className="mt-12 max-w-3xl mx-auto">
          <h2 className="text-lg font-semibold mb-4 text-secondary-900 dark:text-secondary-100">
            Tips for Better Results
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <TipCard
              title="Choose the Right Format"
              description="Listicles work great for scannable content. How-tos are perfect for step-by-step guides. Match the format to your content goal."
            />
            <TipCard
              title="Add Target Keywords"
              description="Include 2-3 keywords you want to rank for. The AI will naturally incorporate them throughout the post."
            />
            <TipCard
              title="Review the Outline"
              description="Take time to edit the outline before generating. Add, remove, or reorder sections to match your vision."
            />
            <TipCard
              title="Define Your Audience"
              description="Specifying your target audience helps the AI tailor the tone, examples, and complexity level."
            />
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 max-w-2xl mx-auto text-center">
          <Card className="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 border-primary-200 dark:border-primary-800">
            <CardContent className="py-8">
              <Zap className="h-10 w-10 text-primary-500 mx-auto mb-4" aria-hidden="true" />
              <h3 className="text-xl font-semibold mb-2 text-secondary-900 dark:text-secondary-100">
                Need More Power?
              </h3>
              <p className="text-secondary-600 dark:text-secondary-400 mb-4">
                Sign up for unlimited generations, priority processing, and access to all our AI tools.
              </p>
              <Button asChild>
                <Link href="/pricing">
                  <Sparkles className="mr-2 h-4 w-4" aria-hidden="true" />
                  View Pricing
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </PageBackground>
  );
}

// Feature Card Component
function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 p-4">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-900/50 flex-shrink-0">
        <Icon className="h-4 w-4 text-primary-500" aria-hidden="true" />
      </div>
      <div>
        <h3 className="font-medium text-secondary-900 dark:text-secondary-100">{title}</h3>
        <p className="text-xs text-secondary-500 dark:text-secondary-400">{description}</p>
      </div>
    </div>
  );
}

// Tip Card Component
function TipCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-lg border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 p-4">
      <h3 className="font-medium mb-2 text-secondary-900 dark:text-secondary-100">{title}</h3>
      <p className="text-sm text-secondary-600 dark:text-secondary-400">{description}</p>
    </div>
  );
}
