import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/layout';
import { ToolsHero } from '@/components/ui/tools-hero';
import { Footer } from '@/components/ui/footer';
import { Code } from 'lucide-react';
import { SDKTabs } from './sdk-tabs';

export const metadata = {
  title: 'SDK & Design System | AI SaaS Tools',
  description: 'Design system documentation, UI components, and development standards.',
};

export default function SDKPage() {
  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-950">
      <Header
        navItems={[
          { label: 'Tools', href: '/tools' },
          { label: 'Pricing', href: '/pricing' },
          { label: 'SDK', href: '/sdk' },
          { label: 'FAQ', href: '/faq' },
        ]}
        cta={{ label: 'Get Started', href: '/login' }}
      />

      <ToolsHero
        badge="Developer"
        title="Design System & Standards"
        description="Our design system ensures consistency, accessibility, and quality across all components. Use this reference when building new features or components."
        breadcrumbs={[
          { label: 'Design System' },
        ]}
      />

      <main className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <SDKTabs />
      </main>

      <Footer />
    </div>
  );
}
