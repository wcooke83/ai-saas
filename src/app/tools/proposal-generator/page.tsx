import { Metadata } from 'next';
import Link from 'next/link';
import { ProposalGenerator } from '@/components/tools/ProposalGenerator';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Zap, Layers, Download, Shield } from 'lucide-react';

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
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary-500" />
            <span className="text-lg font-semibold">AI SaaS Tools</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/tools" className="text-sm text-secondary-600 hover:text-secondary-900">
              All Tools
            </Link>
            <Button asChild size="sm">
              <Link href="/signup">Sign Up Free</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-secondary-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-secondary-900 sm:text-5xl">
            AI Proposal Generator
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-secondary-600">
            Create professional, winning proposals in minutes. Our AI understands your industry
            and crafts compelling proposals tailored to your clients.
          </p>

          {/* Feature Cards */}
          <div className="mx-auto mb-8 grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feature) => (
              <Card key={feature.title} className="text-left">
                <CardContent className="pt-4">
                  <feature.icon className="mb-2 h-8 w-8 text-primary-500" />
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="text-sm text-secondary-500">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Main Tool */}
      <main className="container mx-auto px-4 py-8">
        {/* TODO: Pass isPro based on user subscription status from auth context */}
        <ProposalGenerator />
      </main>

      {/* Tips Section */}
      <section className="border-t bg-white py-12">
        <div className="container mx-auto px-4">
          <h2 className="mb-6 text-center text-2xl font-bold">Tips for Better Proposals</h2>
          <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2">
            {TIPS.map((tip, index) => (
              <Card key={index}>
                <CardContent className="flex items-start gap-3 pt-4">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-medium text-primary-700">
                    {index + 1}
                  </span>
                  <p className="text-sm text-secondary-600">{tip}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary-500 to-primary-600 py-12 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-2xl font-bold">Ready to Win More Deals?</h2>
          <p className="mb-6 text-primary-100">
            Upgrade to Pro for unlimited proposals, section regeneration, and premium exports.
          </p>
          <Button asChild variant="secondary" size="lg">
            <Link href="/pricing">View Pricing</Link>
          </Button>
        </div>
      </section>

      {/* Embed Info */}
      <section className="border-t py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-xl font-bold">Embed This Tool</h2>
          <p className="mb-4 text-secondary-600">
            Add the AI Proposal Generator to your website with a simple embed code.
          </p>
          <Card className="mx-auto max-w-2xl">
            <CardContent className="pt-4">
              <code className="block overflow-x-auto whitespace-pre rounded bg-secondary-100 p-4 text-left text-sm">
{`<iframe
  src="${process.env.NEXT_PUBLIC_APP_URL || 'https://your-domain.com'}/embed/proposal-generator?key=YOUR_API_KEY"
  width="100%"
  height="800"
  frameborder="0"
></iframe>`}
              </code>
            </CardContent>
          </Card>
          <p className="mt-4 text-sm text-secondary-500">
            <Link href="/dashboard/api-keys" className="text-primary-500 hover:underline">
              Get your API key
            </Link>
            {' '}to enable the embedded version.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-8">
        <div className="container mx-auto px-4 text-center text-sm text-secondary-500">
          <p>
            Powered by{' '}
            <Link href="/" className="text-primary-500 hover:underline">
              AI SaaS Tools
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
