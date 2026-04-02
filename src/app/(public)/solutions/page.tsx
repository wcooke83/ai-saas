import type { Metadata } from 'next';
import { Header } from '@/components/layout';
import { Footer } from '@/components/ui/footer';
import { PageBackground } from '@/components/ui/page-background';
import { SolutionsHero } from './solutions-hero';
import { SolutionsSpotlights } from './solutions-spotlights';
import { SolutionsCapabilities } from './solutions-capabilities';
import { SolutionsIndustries } from './solutions-industries';
import { SolutionsCta } from './solutions-cta';

export const metadata: Metadata = {
  title: 'Solutions | AI Chatbot for Every Use Case | VocUI',
  description:
    'See how VocUI solves different business problems — from customer support automation to lead capture, appointment booking, and knowledge base chatbots.',
  openGraph: {
    title: 'Solutions | AI Chatbot for Every Use Case | VocUI',
    description:
      'See how VocUI solves different business problems — from customer support automation to lead capture, appointment booking, and knowledge base chatbots.',
    url: 'https://vocui.com/solutions',
    siteName: 'VocUI',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Solutions | AI Chatbot for Every Use Case | VocUI',
    description:
      'See how VocUI solves different business problems — from customer support automation to lead capture, appointment booking, and knowledge base chatbots.',
  },
  alternates: { canonical: 'https://vocui.com/solutions' },
  robots: { index: true, follow: true },
};

export default function SolutionsPage() {
  return (
    <PageBackground>
      <Header />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Solutions | AI Chatbot for Every Use Case | VocUI',
            description:
              'See how VocUI solves different business problems — from customer support automation to lead capture, appointment booking, and knowledge base chatbots.',
            url: 'https://vocui.com/solutions',
            publisher: {
              '@type': 'Organization',
              name: 'VocUI',
              url: 'https://vocui.com',
            },
          }),
        }}
      />

      <main id="main-content">
        {/* --- Hero: asymmetric layout, left-aligned headline + right stats column --- */}
        <SolutionsHero />

        {/* --- Core use cases: alternating asymmetric spotlight rows (light bg) ------- */}
        <SolutionsSpotlights />

        {/* --- Secondary capabilities: dark full-bleed, 3-col strip with dividers ---- */}
        <SolutionsCapabilities />

        {/* --- Industry browser: white bg, categorized pill clouds, expandable ------- */}
        <SolutionsIndustries />

        {/* --- CTA: gradient full-bleed, asymmetric with decorative monogram --------- */}
        <SolutionsCta />
      </main>

      <Footer />
    </PageBackground>
  );
}
