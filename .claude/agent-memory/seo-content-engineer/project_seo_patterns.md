---
name: Metadata & SEO patterns
description: Next.js metadata conventions, structured data patterns, page structure conventions used across VocUI public pages
type: project
---

## Metadata pattern

All public pages use `export const metadata: Metadata` or `export function generateMetadata()` from the page file — never `<head>` tags directly. Import `Metadata` from `next`.

```ts
export function generateMetadata(): Metadata {
  return {
    title: 'Primary Keyword | VocUI',
    description: '150-160 char description.',
    keywords: [...],
    openGraph: {
      title: '...',
      description: '...',
      url: 'https://vocui.com/path',
      siteName: 'VocUI',
      type: 'website',
    },
    twitter: { card: 'summary_large_image', title: '...', description: '...' },
    alternates: { canonical: 'https://vocui.com/path' },
  };
}
```

## Root layout defaults

Root layout (`src/app/layout.tsx`) sets `metadataBase: new URL('https://vocui.com')`, default OG `siteName: 'VocUI'`, and `twitter.card: 'summary_large_image'`. Child pages inherit these if not overridden.

## JSON-LD pattern

Script tag placed immediately after `<PageBackground>` open, before `<Header />`:

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
/>
```

Schema types used: `Organization` (site-wide via root layout), `SoftwareApplication` (slack-chatbot, chatbot-booking), `WebPage` + `BreadcrumbList` (changelog, vs-intercom, vs-tidio), `WebPage` + Organization publisher (solutions, security).

## Pages missing OG image

No page currently specifies `openGraph.images`. A default OG image needs to be created and referenced.

## Pages with incomplete metadata (as of 2026-03-31 audit)

- `/about`: missing OG, Twitter, canonical, JSON-LD, untyped metadata
- `/contact`: missing OG, Twitter, canonical, JSON-LD, untyped metadata, description only 75 chars
- `/security`: missing OG and Twitter (has canonical and JSON-LD)
- `/vs-intercom`: title 69 chars (over 60 limit)
- `/slack-chatbot`: title 69 chars (over 60 limit)
- `/vs-tidio`: description 168 chars (over 160 limit)

## Page shell pattern

All public landing pages use this exact shell:

```tsx
<PageBackground>
  <Header />
  <main id="main-content">
    {/* sections */}
  </main>
  <Footer />
</PageBackground>
```

Imports: `Header` from `@/components/layout`, `Footer` from `@/components/ui/footer`, `PageBackground` from `@/components/ui/page-background`.

## H1 component

`H1` from `@/components/ui/heading` — renders a semantic `<h1>`. Default variant is `public` with responsive sizing. `ToolsHero` component also renders an `H1`.

## Card styles (homepage pattern)

Differentiator cards: `border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 hover:shadow-lg hover:border-primary-200 dark:hover:border-primary-700 transition-all duration-200`

Supporting feature tiles: `bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-xl p-6 hover:border-primary-200 dark:hover:border-primary-700 transition-colors`

## Final CTA section pattern

Gradient card: `rounded-3xl bg-gradient-to-br from-primary-600 to-primary-800 p-12 text-center text-white shadow-xl shadow-primary-500/20`

## Trust bar pattern

`border-y border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-800/50 py-6` with `CheckCircle2` green icon + text items.
