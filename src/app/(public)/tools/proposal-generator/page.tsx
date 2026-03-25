import { Metadata } from 'next';
import Link from 'next/link';
import { ProposalGenerator } from '@/components/tools/ProposalGenerator';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout';
import { ToolsHero } from '@/components/ui/tools-hero';
import { Footer } from '@/components/ui/footer';
import { PageBackground } from '@/components/ui/page-background';
import { Zap, Layers, Download, Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'AI Proposal Generator | AI SaaS Tools',
  description: 'Generate professional business proposals in minutes with AI. Sales proposals, RFP responses, project proposals, and more.',
  keywords: ['proposal generator', 'AI proposal', 'business proposal', 'RFP response', 'sales proposal'],
};

const FEATURES = [
  {
    icon: Zap,
    title: 'AI-Powered',
    description: 'Generate complete proposals in under 30 seconds with Claude AI',
  },
  {
    icon: Layers,
    title: 'Modular Sections',
    description: 'Edit, reorder, and customize each section independently',
  },
  {
    icon: Download,
    title: 'Multiple Exports',
    description: 'Export to Markdown, PDF, or Word document formats',
  },
  {
    icon: Shield,
    title: 'Industry-Tailored',
    description: '8 industry presets with specialized terminology',
  },
];

const TIPS = [
  'Be specific about project requirements and objectives for better results',
  'Include your competitive advantage to differentiate your proposal',
  'Review and edit generated sections to add your unique voice',
  'Use the regenerate feature to refine individual sections',
];

export default function ProposalGeneratorPage() {
  return (
    <PageBackground>
      <Header />

      <ToolsHero
        badge="Popular"
        title="AI Proposal Generator"
        description="Create professional, winning proposals in minutes. Our AI understands your industry and crafts compelling proposals tailored to your clients."
        breadcrumbs={[
          { label: 'Tools', href: '/tools' },
          { label: 'Proposal Generator' },
        ]}
      >
        {/* Feature Cards */}
        <div className="mx-auto mt-8 grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature) => (
            <Card key={feature.title} className="text-left">
              <CardContent className="pt-4">
                <feature.icon className="mb-2 h-8 w-8 text-primary-500" />
                <h3 className="font-semibold text-secondary-900 dark:text-secondary-100">{feature.title}</h3>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </ToolsHero>

      {/* Main Tool */}
      <main className="container mx-auto px-4 py-8">
        <ProposalGenerator />
      </main>

      {/* Tips Section */}
      <section className="mt-12 py-24 md:py-32">
        <div className="container mx-auto px-4">
          <h2 className="mb-10 text-center text-3xl md:text-4xl font-bold text-secondary-900 dark:text-secondary-100">Tips for Better Proposals</h2>
          <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2">
            {TIPS.map((tip, index) => (
              <Card key={index}>
                <CardContent className="flex items-start gap-3 pt-4">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900 text-sm font-medium text-primary-700 dark:text-primary-300">
                    {index + 1}
                  </span>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">{tip}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mt-8 bg-gradient-to-r from-primary-500 to-primary-600 py-16 md:py-20 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-6 text-4xl md:text-5xl lg:text-6xl font-bold">Ready to Win More Deals?</h2>
          <p className="mb-10 text-primary-100">
            Upgrade to Pro for unlimited proposals, section regeneration, and premium exports.
          </p>
          <Button asChild variant="secondary" size="lg">
            <Link href="/pricing">View Pricing</Link>
          </Button>
        </div>
      </section>

      {/* Embed Info */}
      <section className="mt-8 py-24 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-8 text-3xl md:text-4xl font-bold text-secondary-900 dark:text-secondary-100">Embed This Tool</h2>
          <p className="mb-8 text-secondary-600 dark:text-secondary-400">
            Add the AI Proposal Generator to your website with a simple embed code.
          </p>
          <Card className="mx-auto max-w-2xl">
            <CardContent className="pt-4">
              <code className="block overflow-x-auto whitespace-pre rounded bg-secondary-100 dark:bg-secondary-800 p-4 text-left text-sm text-secondary-800 dark:text-secondary-200">
{`<iframe
  src="${process.env.NEXT_PUBLIC_APP_URL || 'https://your-domain.com'}/embed/proposal-generator?key=YOUR_API_KEY"
  width="100%"
  height="800"
  frameborder="0"
></iframe>`}
              </code>
            </CardContent>
          </Card>
          <p className="mt-8 text-sm text-secondary-500 dark:text-secondary-400">
            <Link href="/dashboard/api-keys" className="text-primary-500 hover:underline">
              Get your API key
            </Link>
            {' '}to enable the embedded version.
          </p>
        </div>
      </section>

      <div className="mt-12">
        <Footer />
      </div>
    </PageBackground>
  );
}
