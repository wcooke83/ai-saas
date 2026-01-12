import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/layout';
import { ToolsHero } from '@/components/ui/tools-hero';
import { Footer } from '@/components/ui/footer';
import { PageBackground } from '@/components/ui/page-background';
import {
  ArrowRight,
  Mail,
  FileText,
  Zap,
  ClipboardList,
  BarChart3,
  MessageSquare,
  PenTool,
  Layers,
  Share2,
  Megaphone,
} from 'lucide-react';

export const metadata = {
  title: 'AI Tools | AI SaaS Tools',
  description: 'Explore our suite of AI-powered productivity tools for professionals.',
};

const tools = [
  {
    name: 'AI Email Writer',
    description: 'Generate professional emails in seconds. Perfect for cold outreach, follow-ups, introductions, and more.',
    icon: Mail,
    href: '/tools/email-writer',
    badge: 'Popular',
    category: 'Communication',
    features: ['Multiple email types', 'Tone customization', 'Key points inclusion'],
    available: true,
  },
  {
    name: 'AI Email Sequence Builder',
    description: 'Create complete multi-email sequences for cold outreach, onboarding, sales nurture, and more.',
    icon: Layers,
    href: '/tools/email-sequence',
    badge: 'New',
    category: 'Communication',
    features: ['8 sequence types', 'Smart day timing', 'CSV & text export'],
    available: true,
  },
  {
    name: 'AI Proposal Generator',
    description: 'Create winning business proposals with AI. Generate sales proposals, RFP responses, and project proposals.',
    icon: ClipboardList,
    href: '/tools/proposal-generator',
    badge: 'New',
    category: 'Sales',
    features: ['Multiple templates', 'Export to PDF/DOCX', 'Section customization'],
    available: true,
  },
  {
    name: 'AI Social Post Generator',
    description: 'Create viral social media posts for LinkedIn, Twitter/X, Instagram, and TikTok in seconds.',
    icon: Share2,
    href: '/tools/social-post',
    badge: 'New',
    category: 'Social Media',
    features: ['Multi-platform', 'Hashtag suggestions', 'Export to CSV'],
    available: true,
  },
  {
    name: 'AI Ad Copy Generator',
    description: 'Generate high-converting ad copy for Google, Meta, LinkedIn, Twitter/X, TikTok, and Pinterest.',
    icon: Megaphone,
    href: '/tools/ad-copy',
    badge: 'New',
    category: 'Advertising',
    features: ['7 platforms', '3 A/B variations', 'Character validation'],
    available: true,
  },
  {
    name: 'AI Blog Post Writer',
    description: 'Create high-quality, SEO-optimized blog posts. Generate listicles, how-tos, tutorials, reviews, and case studies.',
    icon: FileText,
    href: '/tools/blog-writer',
    badge: 'New',
    category: 'Content',
    features: ['6 post formats', 'SEO optimization', 'Outline editor'],
    available: true,
  },
  {
    name: 'Report Generator',
    description: 'Create detailed reports from your data with AI-powered insights and visualizations.',
    icon: BarChart3,
    href: '#',
    badge: 'Coming Soon',
    category: 'Analytics',
    features: ['Data analysis', 'Charts & graphs', 'Executive summaries'],
    available: false,
  },
  {
    name: 'Workflow Automator',
    description: 'Automate repetitive tasks with intelligent AI workflows that learn from your patterns.',
    icon: Zap,
    href: '#',
    badge: 'Coming Soon',
    category: 'Automation',
    features: ['Custom triggers', 'Multi-step workflows', 'Integration support'],
    available: false,
  },
  {
    name: 'Content Rewriter',
    description: 'Transform and improve existing content with AI-powered rewriting and optimization.',
    icon: PenTool,
    href: '#',
    badge: 'Coming Soon',
    category: 'Content',
    features: ['Tone adjustment', 'Length control', 'SEO optimization'],
    available: false,
  },
  {
    name: 'Meeting Notes Summarizer',
    description: 'Transform meeting transcripts into structured summaries with action items, decisions, and follow-ups.',
    icon: MessageSquare,
    href: '/tools/meeting-notes',
    badge: 'New',
    category: 'Productivity',
    features: ['7 meeting types', 'Action item extraction', 'VTT/SRT upload'],
    available: true,
  },
];

const categories = ['All', 'Communication', 'Sales', 'Social Media', 'Advertising', 'Analytics', 'Automation', 'Content', 'Productivity'];

export default function ToolsPage() {
  return (
    <PageBackground>
      <Header />

      <main id="main-content">
        {/* Hero */}
        <ToolsHero
          badge="AI Tools"
          title={<>AI-Powered<br />Productivity Tools</>}
          description="Explore our growing suite of AI tools designed to help you work smarter. From emails to proposals, we've got you covered."
          breadcrumbs={[{ label: 'Tools' }]}
        />

        {/* Tools Grid */}
        <section className="container mx-auto px-4 pb-16">
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                  category === 'All'
                    ? 'bg-primary-500 text-white'
                    : 'bg-white dark:bg-secondary-800 text-secondary-600 dark:text-secondary-300 border border-secondary-200 dark:border-secondary-700 hover:bg-secondary-50 dark:hover:bg-secondary-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Card
                  key={tool.name}
                  className={`transition-all duration-200 ${
                    tool.available
                      ? 'hover:shadow-lg hover:scale-[1.02] hover:border-primary-200 dark:hover:border-primary-700'
                      : 'opacity-75'
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-900/50">
                        <Icon className="h-6 w-6 text-primary-500" aria-hidden="true" />
                      </div>
                      <Badge variant={tool.available ? 'default' : 'outline'}>
                        {tool.badge}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle>{tool.name}</CardTitle>
                    </div>
                    <p className="text-xs text-secondary-500 dark:text-secondary-400 uppercase tracking-wide">{tool.category}</p>
                    <CardDescription className="mt-2">{tool.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-2">
                      {tool.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm text-secondary-600 dark:text-secondary-400">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary-500" aria-hidden="true" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button
                      variant={tool.available ? 'default' : 'outline'}
                      className="w-full"
                      disabled={!tool.available}
                      asChild={tool.available}
                    >
                      {tool.available ? (
                        <Link href={tool.href}>
                          Try Now
                          <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                        </Link>
                      ) : (
                        'Coming Soon'
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <section className="px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="rounded-2xl bg-primary-500 p-8 md:p-12 text-center text-white">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Ready to supercharge your workflow?
              </h2>
              <p className="text-primary-100 mb-6 max-w-xl mx-auto">
                Start using our AI tools for free. No credit card required.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="xl"
                  variant="secondary"
                  className="bg-white text-primary-600 hover:bg-primary-50"
                  asChild
                >
                  <Link href="/signup">
                    Get Started Free
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button
                  size="xl"
                  variant="outline"
                  className="border-white text-white hover:bg-primary-600"
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
    </PageBackground>
  );
}
