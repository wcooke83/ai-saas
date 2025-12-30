import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Mail, FileText, Zap, Sparkles, ClipboardList } from 'lucide-react';

const tools = [
  {
    name: 'AI Email Writer',
    description: 'Generate professional emails in seconds. Cold outreach, follow-ups, and more.',
    icon: Mail,
    href: '/tools/email-writer',
    badge: 'Popular',
    category: 'Communication',
  },
  {
    name: 'AI Proposal Generator',
    description: 'Create winning business proposals with AI. Sales, RFP responses, project proposals.',
    icon: ClipboardList,
    href: '/tools/proposal-generator',
    badge: 'New',
    category: 'Sales',
  },
  {
    name: 'Report Generator',
    description: 'Create detailed reports from your data with AI-powered insights.',
    icon: FileText,
    href: '#',
    badge: 'Coming Soon',
    category: 'Analytics',
    disabled: true,
  },
  {
    name: 'Workflow Automator',
    description: 'Automate repetitive tasks with intelligent AI workflows.',
    icon: Zap,
    href: '#',
    badge: 'Coming Soon',
    category: 'Automation',
    disabled: true,
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary-50 to-white">
      {/* Header */}
      <header className="border-b border-secondary-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary-500" />
            <span className="font-bold text-xl">AI SaaS Tools</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              href="/tools/email-writer"
              className="text-sm text-secondary-600 hover:text-secondary-900"
            >
              Tools
            </Link>
            <Link
              href="#pricing"
              className="text-sm text-secondary-600 hover:text-secondary-900"
            >
              Pricing
            </Link>
            <Button size="sm">Get Started</Button>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-20 text-center">
        <Badge className="mb-4">AI-Powered Tools</Badge>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-6">
          Work Smarter with{' '}
          <span className="text-primary-500">AI Tools</span>
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-secondary-600 mb-8">
          Supercharge your productivity with our suite of AI-powered tools.
          Generate emails, create reports, and automate workflows in seconds.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="xl" asChild>
            <Link href="/tools/email-writer">
              Try Email Writer Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="xl" variant="outline">
            View All Tools
          </Button>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center mb-8">Our Tools</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
          {tools.map((tool) => (
            <Card
              key={tool.name}
              className={tool.disabled ? 'opacity-60' : 'hover:shadow-lg transition-shadow'}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50">
                    <tool.icon className="h-5 w-5 text-primary-500" />
                  </div>
                  <Badge variant={tool.disabled ? 'outline' : 'default'}>
                    {tool.badge}
                  </Badge>
                </div>
                <CardTitle>{tool.name}</CardTitle>
                <CardDescription>{tool.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant={tool.disabled ? 'outline' : 'default'}
                  className="w-full"
                  disabled={tool.disabled}
                  asChild={!tool.disabled}
                >
                  {tool.disabled ? (
                    'Coming Soon'
                  ) : (
                    <Link href={tool.href}>
                      Try Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-16">
        <div className="rounded-2xl bg-primary-500 p-8 md:p-12 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to boost your productivity?
          </h2>
          <p className="text-primary-100 mb-6 max-w-xl mx-auto">
            Start using our AI tools for free. No credit card required.
          </p>
          <Button
            size="xl"
            variant="secondary"
            className="bg-white text-primary-600 hover:bg-primary-50"
            asChild
          >
            <Link href="/tools/email-writer">
              Get Started Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-secondary-200 bg-white py-8">
        <div className="container mx-auto px-4 text-center text-sm text-secondary-500">
          <p>&copy; 2024 AI SaaS Tools. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
