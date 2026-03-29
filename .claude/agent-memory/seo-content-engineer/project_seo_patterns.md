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

## JSON-LD pattern

Script tag placed immediately after `<PageBackground>` open, before `<Header />`:

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
/>
```

Schema types used so far: `SoftwareApplication` (chatbot-booking page).

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

`H1` from `@/components/ui/heading` — default variant is `public` which renders `text-5xl font-bold tracking-tight sm:text-6xl lg:text-8xl`. Use `variant="dashboard"` inside authenticated pages.

## Card styles (homepage pattern)

Differentiator cards: `border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 hover:shadow-lg hover:border-primary-200 dark:hover:border-primary-700 transition-all duration-200`

Supporting feature tiles (no Card component): `bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-xl p-6 hover:border-primary-200 dark:hover:border-primary-700 transition-colors`

Icon container (large): `flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-900/50`
Icon container (small): `flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-900/50`

## Final CTA section pattern

Gradient card: `rounded-3xl bg-gradient-to-br from-primary-600 to-primary-800 p-12 text-center text-white shadow-xl shadow-primary-500/20`

Primary CTA button inside: `variant="secondary" className="bg-white text-primary-600 hover:bg-primary-50 font-semibold"`
Secondary CTA button inside: `variant="outline-light"`

## Trust bar pattern

`border-y border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-800/50 py-6` with `CheckCircle2` green icon + text items.

## How It Works section pattern

3-step layout with connector line:
```tsx
<div className="hidden md:block absolute top-8 left-[calc(16.67%+1.5rem)] right-[calc(16.67%+1.5rem)] h-px bg-secondary-200 dark:bg-secondary-700" aria-hidden="true" />
```
Step circles: `w-16 h-16 rounded-full bg-primary-500 text-white font-bold text-lg flex items-center justify-center mb-6 z-10 shadow-lg shadow-primary-500/25`
