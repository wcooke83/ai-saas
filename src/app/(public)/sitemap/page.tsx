import type { Metadata } from 'next';
import { Header } from '@/components/layout';
import { Footer } from '@/components/ui/footer';
import { PageBackground } from '@/components/ui/page-background';
import { HeroWaveform } from '@/components/ui/hero-waveform';
import { SitemapContent } from './sitemap-content';

export const metadata: Metadata = {
  title: 'Sitemap | VocUI',
  description:
    'All pages on vocui.com — browse every product page, industry solution, comparison, blog article, and company resource.',
  alternates: { canonical: 'https://vocui.com/sitemap' },
  robots: { index: true, follow: true },
};

export default function SitemapPage() {
  return (
    <PageBackground>
      <HeroWaveform className="fixed inset-0 z-[1] pointer-events-none" />
      <Header />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Sitemap | VocUI',
            description:
              'All pages on vocui.com — browse every product page, industry solution, comparison, blog article, and company resource.',
            url: 'https://vocui.com/sitemap',
            publisher: {
              '@type': 'Organization',
              name: 'VocUI',
              url: 'https://vocui.com',
            },
          }),
        }}
      />

      <SitemapContent />

      <div className="relative z-[2]">
        <Footer />
      </div>
    </PageBackground>
  );
}
