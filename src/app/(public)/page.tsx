import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { H1 } from '@/components/ui/heading';
import { Header } from '@/components/layout';
import { Footer } from '@/components/ui/footer';
import { PageBackground } from '@/components/ui/page-background';
import { ArrowRight, Mail, FileText, Zap, Sparkles, ClipboardList, Share2, Layers, Megaphone, MessageSquare, PenTool } from 'lucide-react';

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
    badge: 'Popular',
    category: 'Sales',
  },
  {
    name: 'AI Social Post Generator',
    description: 'Create viral social media posts for LinkedIn, Twitter/X, Instagram, and TikTok.',
    icon: Share2,
    href: '/tools/social-post',
    badge: 'New',
    category: 'Marketing',
  },
  {
    name: 'AI Ad Copy Generator',
    description: 'Generate high-converting ad copy for Google, Meta, LinkedIn, TikTok, and more.',
    icon: Megaphone,
    href: '/tools/ad-copy',
    badge: 'New',
    category: 'Advertising',
  },
  {
    name: 'AI Blog Post Writer',
    description: 'Create SEO-optimized blog posts. Listicles, how-tos, tutorials, and case studies.',
    icon: PenTool,
    href: '/tools/blog-writer',
    badge: 'New',
    category: 'Content',
  },
  {
    name: 'Meeting Notes Summarizer',
    description: 'Transform meeting transcripts into structured summaries with action items.',
    icon: MessageSquare,
    href: '/tools/meeting-notes',
    badge: 'New',
    category: 'Productivity',
  },
  {
    name: 'Email Sequence Builder',
    description: 'Generate complete email sequences for cold outreach, onboarding, and sales nurture.',
    icon: Layers,
    href: '/tools/email-sequence',
    badge: 'Pro',
    category: 'Marketing',
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
    <PageBackground>
      <Header />

      <main id="main-content">
        {/* Hero */}
        <section className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center container mx-auto px-4 py-12 text-center">
          <Badge className="mb-4">AI-Powered Tools</Badge>
          <H1 className="text-4xl sm:text-5xl md:text-6xl mb-6">
            Work Smarter with{' '}
            <span className="text-primary-500">AI Tools</span>
          </H1>
          <p className="mx-auto max-w-2xl text-lg text-secondary-600 dark:text-secondary-400 mb-8">
            Supercharge your productivity with our suite of AI-powered tools.
            Generate emails, create reports, and automate workflows in seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="xl" asChild>
              <Link href="/tools/email-writer">
                Try Email Writer Free
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button size="xl" variant="outline" asChild>
              <Link href="#tools">View All Tools</Link>
            </Button>
          </div>
        </section>

        {/* Tools Grid */}
        <section id="tools" className="container mx-auto px-4 py-16">
          <h2 className="text-2xl font-bold text-center mb-8 text-secondary-900 dark:text-secondary-100">Our Tools</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
            {tools.map((tool) => (
              <Card
                key={tool.name}
                className={`transition-all duration-200 flex flex-col ${
                  tool.disabled
                    ? 'opacity-60'
                    : 'hover:shadow-lg hover:scale-[1.02] hover:border-primary-200 dark:hover:border-primary-700'
                }`}
              >
                <CardHeader className="flex-grow">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-900/50">
                      <tool.icon className="h-5 w-5 text-primary-500" aria-hidden="true" />
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
                        <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                      </Link>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="px-4 py-16">
          <div className="max-w-5xl mx-auto">
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
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </PageBackground>
  );
}
