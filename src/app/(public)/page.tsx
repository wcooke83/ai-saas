import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { H1 } from '@/components/ui/heading';
import { Header } from '@/components/layout';
import { Footer } from '@/components/ui/footer';
import { PageBackground } from '@/components/ui/page-background';
import { ArrowRight, Bot, MessageSquare, Globe, Zap, Shield, BarChart3 } from 'lucide-react';

const features = [
  {
    name: 'Custom Knowledge Base',
    description: 'Train your chatbot on your own content — URLs, PDFs, documents. RAG-powered answers grounded in your data.',
    icon: Globe,
  },
  {
    name: 'Embeddable Widget',
    description: 'Deploy on any website with a simple embed code. Fully customizable appearance and behavior.',
    icon: MessageSquare,
  },
  {
    name: 'Multi-Channel',
    description: 'Reach customers on your website, Slack, and Telegram. One chatbot, every channel.',
    icon: Zap,
  },
  {
    name: 'Agent Console',
    description: 'Live agent handoff when conversations need a human touch. Real-time escalation workflows.',
    icon: Shield,
  },
  {
    name: 'Analytics & Insights',
    description: 'Sentiment analysis, conversation memory, loyalty scoring, and performance dashboards.',
    icon: BarChart3,
  },
  {
    name: 'Calendar Booking',
    description: 'Let your chatbot book appointments directly. Integrated scheduling with availability management.',
    icon: Bot,
  },
];

export default function HomePage() {
  return (
    <PageBackground>
      <Header />

      <main id="main-content">
        {/* Hero */}
        <section className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center container mx-auto px-4 py-12 text-center">
          <Badge className="mb-4">AI-Powered Chatbots</Badge>
          <H1 className="text-4xl sm:text-5xl md:text-6xl mb-6">
            Build Intelligent Chatbots with{' '}
            <span className="text-primary-500">VocUI</span>
            <span className="block text-lg sm:text-xl font-normal tracking-normal text-secondary-500 dark:text-secondary-400 mt-2">Giving Voice to the User Interface</span>
          </H1>
          <p className="mx-auto max-w-2xl text-lg text-secondary-600 dark:text-secondary-400 mb-8">
            Create AI chatbots trained on your own knowledge base. Deploy on your website,
            Slack, or Telegram in minutes. No coding required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="xl" asChild>
              <Link href="/signup">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button size="xl" variant="outline" asChild>
              <Link href="/pricing">View Pricing</Link>
            </Button>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="container mx-auto px-4 py-16">
          <h2 className="text-2xl font-bold text-center mb-8 text-secondary-900 dark:text-secondary-100">
            Everything you need to deploy AI chatbots
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
            {features.map((feature) => (
              <Card
                key={feature.name}
                className="transition-all duration-200 hover:shadow-lg hover:scale-[1.02] hover:border-primary-200 dark:hover:border-primary-700"
              >
                <CardHeader>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-900/50 mb-2">
                    <feature.icon className="h-5 w-5 text-primary-500" aria-hidden="true" />
                  </div>
                  <CardTitle>{feature.name}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="px-4 py-16">
          <div className="max-w-5xl mx-auto">
            <div className="rounded-2xl bg-primary-500 p-8 md:p-12 text-center text-white">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Ready to deploy your AI chatbot?
              </h2>
              <p className="text-primary-100 mb-6 max-w-xl mx-auto">
                Start building for free. No credit card required.
              </p>
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
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </PageBackground>
  );
}
