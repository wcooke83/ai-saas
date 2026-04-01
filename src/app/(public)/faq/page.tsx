import type { Metadata } from 'next';
import { Header } from '@/components/layout';
import { Footer } from '@/components/ui/footer';
import { PageBackground } from '@/components/ui/page-background';
import { HeroWaveform } from '@/components/ui/hero-waveform';
import { FaqContent } from './faq-content';

export const metadata: Metadata = {
  title: 'FAQ | VocUI',
  description:
    'Frequently asked questions about VocUI — credits, billing, API, security, and more.',
  alternates: { canonical: 'https://vocui.com/faq' },
  robots: { index: true, follow: true },
};

export default function FaqPage() {
  return (
    <PageBackground>
      <HeroWaveform className="fixed inset-0 z-[1] pointer-events-none" />
      <Header />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            name: 'VocUI FAQ',
            description:
              'Frequently asked questions about VocUI — credits, billing, API, security, and more.',
            url: 'https://vocui.com/faq',
            publisher: {
              '@type': 'Organization',
              name: 'VocUI',
              url: 'https://vocui.com',
            },
          }),
        }}
      />

      <main id="main-content" className="relative z-[2]">
        <FaqContent />
      </main>

      <div className="relative z-[2]">
        <Footer />
      </div>
    </PageBackground>
  );
}
