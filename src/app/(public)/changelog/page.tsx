import { Metadata } from 'next';
import { Header } from '@/components/layout';
import { Footer } from '@/components/ui/footer';
import { PageBackground } from '@/components/ui/page-background';
import { HeroWaveform } from '@/components/ui/hero-waveform';
import { ChangelogHero } from './changelog-hero';
import { ChangelogFeatured } from './changelog-featured';
import { ChangelogRecent } from './changelog-recent';
import { ChangelogArchive } from './changelog-archive';
import { ChangelogCta } from './changelog-cta';
import { changelog, entryLinks } from './changelog-data';

export const metadata: Metadata = {
  title: 'Changelog | VocUI',
  description: "What's new in VocUI — recent product updates, new features, and improvements to the AI chatbot platform.",
  openGraph: {
    title: 'Changelog | VocUI',
    description: "What's new in VocUI — recent product updates, new features, and improvements to the AI chatbot platform.",
    url: 'https://vocui.com/changelog',
    siteName: 'VocUI',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Changelog | VocUI',
    description: "What's new in VocUI — recent product updates, new features, and improvements to the AI chatbot platform.",
  },
  alternates: { canonical: 'https://vocui.com/changelog' },
  robots: { index: true, follow: true },
};

/*
  Page scroll sequence:
  1. Hero        — transparent bg, display type, breadcrumbs
  2. Featured    — secondary-50, latest month as featured cards (1 hero + 2 side-by-side)
  3. Recent      — primary-950, 2 months as horizontal strip rows (editorial, dark)
  4. Archive     — secondary-50, oldest months as compact 3-col card grid
  5. CTA         — primary-950, full-bleed asymmetric CTA with subscribe note
*/

// Split changelog by treatment tier
const [featuredMonth, ...remainingMonths] = changelog;
// Recent: months from same year as featured, excluding featured
const recentMonths = remainingMonths.filter((m) => m.month.includes('2026'));
// Archive: remaining (2025)
const archiveMonths = remainingMonths.filter((m) => m.month.includes('2025'));

export default function ChangelogPage() {
  return (
    <PageBackground>
      <HeroWaveform className="fixed inset-0 z-[1] pointer-events-none" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Changelog | VocUI',
            description:
              "What's new in VocUI — recent product updates, new features, and improvements to the AI chatbot platform.",
            url: 'https://vocui.com/changelog',
            isPartOf: {
              '@type': 'WebSite',
              name: 'VocUI',
              url: 'https://vocui.com',
            },
            breadcrumb: {
              '@type': 'BreadcrumbList',
              itemListElement: [
                {
                  '@type': 'ListItem',
                  position: 1,
                  name: 'Home',
                  item: 'https://vocui.com',
                },
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: 'Changelog',
                  item: 'https://vocui.com/changelog',
                },
              ],
            },
          }),
        }}
      />

      <Header />

      <main id="main-content" className="relative z-[2]">
        {/* ── Hero: full viewport, display type, animated entrance ────────── */}
        <ChangelogHero />

        {/* ── Featured month: secondary-50 bg, hero card + side-by-side ──── */}
        <ChangelogFeatured month={featuredMonth} entryLinks={entryLinks} />

        {/* ── Recent months: dark editorial strips ────────────────────────── */}
        {recentMonths.length > 0 && (
          <ChangelogRecent months={recentMonths} entryLinks={entryLinks} />
        )}

        {/* ── Archive: compact card grid, lighter bg ──────────────────────── */}
        {archiveMonths.length > 0 && (
          <ChangelogArchive months={archiveMonths} entryLinks={entryLinks} />
        )}

        {/* ── CTA: full-bleed dark, asymmetric layout ─────────────────────── */}
        <ChangelogCta />
      </main>

      <div className="relative z-[2]">
        <Footer />
      </div>
    </PageBackground>
  );
}
