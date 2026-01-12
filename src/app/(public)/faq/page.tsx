import { Metadata } from 'next';
import { Header } from '@/components/layout';
import { Footer } from '@/components/ui/footer';
import { PageBackground } from '@/components/ui/page-background';
import { FaqContent } from './faq-content';

export const metadata: Metadata = {
  title: 'FAQ | AI SaaS Tools',
  description: 'Frequently asked questions about AI SaaS Tools - credits, billing, API, and more.',
};

export default function FaqPage() {
  return (
    <PageBackground>
      <Header
        secondaryCta={{ label: 'Contact Support', href: '/help' }}
        cta={{ label: 'Sign In', href: '/login' }}
      />

      <main id="main-content">
        <FaqContent />
      </main>

      <Footer />
    </PageBackground>
  );
}
