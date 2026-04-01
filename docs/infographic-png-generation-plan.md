# Infographic PNG Generation Plan

## Overview

Convert VocUI's 22 blog infographic instances (5 component types) from React-only rendering to dual-mode: React components remain in-page for accessibility, while Playwright generates static PNGs for social sharing, OG images, and a "Download infographic" button.

---

## Step 1: Infographic Registry

**File to create:** `src/lib/blog/infographic-registry.ts`

**Complexity:** Low

**Purpose:** A single source of truth that maps every infographic instance to a stable string ID, its component type, and its props. Both the preview route and the generation script consume this registry.

**Structure:**

```ts
export type InfographicType =
  | 'numbered-list'
  | 'comparison'
  | 'stat'
  | 'timeline'
  | 'checklist';

export interface InfographicEntry {
  /** Stable ID used for filenames and URLs. Convention: {slug}--{type} */
  id: string;
  /** Which blog post slug this belongs to */
  slug: string;
  /** Component type */
  type: InfographicType;
  /** Props passed to the component (typed per component) */
  props: Record<string, unknown>;
}

export const INFOGRAPHIC_REGISTRY: InfographicEntry[] = [
  // ... all 22 entries
];
```

**Complete inventory of 22 entries:**

| # | Blog Slug | Type | Infographic Title |
|---|-----------|------|-------------------|
| 1 | `ai-customer-service-statistics` | `stat` | "AI Customer Service by the Numbers" |
| 2 | `chatbot-analytics-what-to-track` | `stat` | "Key Chatbot Metrics to Track" |
| 3 | `ai-chatbot-for-after-hours-support` | `stat` | "The After-Hours Opportunity" |
| 4 | `chatbot-conversion-rate-optimization` | `stat` | "Chatbot Conversion Impact" |
| 5 | `cost-of-customer-support-without-ai` | `stat` | "The True Cost of Customer Support" |
| 6 | `reduce-employee-onboarding-time-with-ai` | `stat` | "The Onboarding Reality Check" |
| 7 | `what-is-conversational-ai` | `comparison` | "Rule-Based Bot vs Conversational AI" |
| 8 | `chatbot-vs-virtual-assistant` | `comparison` | "Chatbot vs Virtual Assistant" |
| 9 | `ai-chatbot-vs-live-chat` | `comparison` | "AI Chatbot vs Live Chat" |
| 10 | `chatbot-personality-and-tone-guide` | `comparison` | "Four Chatbot Personality Archetypes" |
| 11 | `chatbot-lead-generation-strategies` | `numbered-list` | "7 Chatbot Lead Generation Strategies" |
| 12 | `chatbot-best-practices-for-small-business` | `numbered-list` | "5 Chatbot Best Practices for Small Business" |
| 13 | `how-to-write-chatbot-system-prompt` | `numbered-list` | "System Prompt Best Practices" |
| 14 | `how-to-reduce-customer-support-tickets` | `numbered-list` | "7 Ways to Reduce Support Tickets with AI" |
| 15 | `small-business-ai-automation-guide` | `timeline` | "Your AI Automation Roadmap" |
| 16 | `how-to-add-chatbot-to-website` | `timeline` | "Add a Chatbot to Your Website in 15 Minutes" |
| 17 | `how-to-improve-chatbot-accuracy` | `checklist` | "Chatbot Accuracy Improvement Checklist" |
| 18 | `how-to-measure-chatbot-roi` | `checklist` | "Monthly Chatbot ROI Report Checklist" |
| 19 | `chatbot-security-and-privacy-guide` | `checklist` | "Chatbot Security Checklist" |
| 20 | `knowledge-base-content-best-practices` | `checklist` | "Knowledge Base Content Checklist" |
| 21 | `how-to-create-faq-chatbot` | `checklist` | "FAQ Chatbot Pre-Launch Checklist" |
| 22 | `ai-hallucination-what-it-is-how-to-prevent-it` | `checklist` | "Anti-Hallucination System Prompt Rules" |

**ID naming convention:** `{slug}--{type}` (e.g., `ai-customer-service-statistics--stat`). Double-dash separator avoids ambiguity since slugs use single dashes.

**Helper functions to export:**
- `getInfographicById(id: string)` for quick lookup
- `getInfographicsBySlug(slug: string)` for blog posts to look up their own infographic image paths

---

## Step 2: Preview Route

**File to create:** `src/app/(public)/blog/infographic-preview/[id]/page.tsx`

**Complexity:** Medium

**Purpose:** Renders a single infographic in isolation at correct dimensions for Playwright to screenshot. Excluded from sitemap and robots.

**Design:**
- Route: `/blog/infographic-preview/{id}`
- Example: `/blog/infographic-preview/ai-customer-service-statistics--stat`
- Import all 5 infographic components from `@/components/blog/infographics`
- Import registry and `getInfographicById`
- Switch/map on `entry.type` to render correct component with `entry.props`
- Fixed-width container (`w-[600px]`) with no padding around infographic
- `export const dynamic = 'force-dynamic'` to prevent static generation of all IDs
- Return `notFound()` for unknown IDs

**Metadata (prevents indexing):**
```ts
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};
```

**Also update `src/app/robots.ts`** to disallow `/blog/infographic-preview/`.

---

## Step 3: Image Storage

**Directory to create:** `public/images/blog/infographics/`

**Complexity:** Low

**Naming convention:** `{entry.id}.png`

Examples:
- `public/images/blog/infographics/ai-customer-service-statistics--stat.png`
- `public/images/blog/infographics/chatbot-vs-virtual-assistant--comparison.png`

**URL paths:** `/images/blog/infographics/ai-customer-service-statistics--stat.png`

**Git considerations:** Commit PNGs to git (static assets served from `/public`). Estimated ~1-3MB total (22 PNGs at ~50-150KB each at 2x resolution).

**Helper functions (add to registry):**
```ts
export function getInfographicImagePath(id: string): string {
  return `/images/blog/infographics/${id}.png`;
}

export function getInfographicImageUrl(id: string): string {
  const base = process.env.NEXT_PUBLIC_APP_URL || 'https://vocui.com';
  return `${base}/images/blog/infographics/${id}.png`;
}
```

---

## Step 4: Playwright Generation Script

**File to create:** `scripts/generate-infographic-pngs.ts`

**Complexity:** Medium-High

**Design:**
1. Import registry (use relative imports: `../src/lib/blog/infographic-registry`)
2. Launch Chromium with viewport width 600px
3. Set `deviceScaleFactor: 2` for retina-quality PNGs (~1200px wide output)
4. For each entry in `INFOGRAPHIC_REGISTRY`:
   - Navigate to `http://localhost:3030/blog/infographic-preview/{entry.id}`
   - Wait for network idle
   - Locate `<figure role="img">` element
   - Use `element.screenshot()` for tight cropping
   - Save to `public/images/blog/infographics/{entry.id}.png`
5. Report progress and errors

**Running:**
```bash
npx tsx scripts/generate-infographic-pngs.ts
```

**Requirements:** Dev server must be running on port 3030.

**Reference pattern:** Existing `capture-dark-screenshots.ts` at project root shows how this project uses Playwright for screenshots.

---

## Step 5: Download Button Component

**File to create:** `src/components/blog/infographic-download.tsx`

**Complexity:** Low

```tsx
import { Download } from 'lucide-react';

interface InfographicDownloadProps {
  imagePath: string;
  title: string;
}

export function InfographicDownload({ imagePath, title }: InfographicDownloadProps) {
  return (
    <div className="flex justify-end -mt-4 mb-10">
      <a
        href={imagePath}
        download
        className="inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-white/80 transition-colors"
        aria-label={`Download infographic: ${title}`}
      >
        <Download className="w-3.5 h-3.5" />
        Download infographic
      </a>
    </div>
  );
}
```

---

## Step 6: Blog Post Updates (22 files)

**Complexity:** Medium (repetitive, 22 files)

**Changes per file:**
1. Add import for `InfographicDownload`
2. Add import for `getInfographicImagePath`
3. Add download button after each `<XxxInfographic />` JSX
4. Update metadata to add OG image (Step 7)

---

## Step 7: OG Image Integration

**Complexity:** Low-Medium

**Add to each of the 22 blog post metadata objects:**

```ts
openGraph: {
  // ...existing fields...
  images: [
    {
      url: 'https://vocui.com/images/blog/infographics/{id}.png',
      alt: 'Infographic description',
    },
  ],
},
twitter: {
  card: 'summary_large_image',
  // ...existing fields...
  images: ['https://vocui.com/images/blog/infographics/{id}.png'],
},
```

**Note:** PNGs will be 1200px wide (2x) but variable height. Social platforms will crop/letterbox. This is acceptable and a significant improvement over no image.

---

## Step 8: Build Integration

**Complexity:** Low

**Add to `package.json` scripts:**
```json
{
  "scripts": {
    "generate:infographics": "npx tsx scripts/generate-infographic-pngs.ts"
  }
}
```

**Workflow:**
1. Edit infographic content and update registry
2. Run `npm run dev`
3. Run `npm run generate:infographics` in second terminal
4. Commit updated PNGs with code changes

---

## Step 9: Testing and Validation

**Manual validation:**
1. Visually inspect each generated PNG
2. Verify download button works in blog posts
3. Test OG tags using Facebook Sharing Debugger / Twitter Card Validator

**Automated validation (in generation script):**
1. Verify PNG exists and has reasonable file size (> 10KB, < 500KB)
2. Log width/height of each image
3. Exit non-zero if any infographic fails to render

**Optional Playwright test:**
```ts
// tests/infographic-pngs.spec.ts
test('all infographic PNGs exist', () => {
  for (const entry of INFOGRAPHIC_REGISTRY) {
    const pngPath = path.join(process.cwd(), 'public/images/blog/infographics', `${entry.id}.png`);
    expect(fs.existsSync(pngPath)).toBe(true);
  }
});
```

---

## Implementation Order

| Order | Step | Depends On | Est. Time |
|-------|------|------------|-----------|
| 1 | Infographic Registry | Nothing | 1-2 hours |
| 2 | Preview Route | Step 1 | 30 min |
| 3 | Image Storage directory | Nothing | 5 min |
| 4 | Playwright Generation Script | Steps 1, 2, 3 | 1-2 hours |
| 5 | Run generation and validate PNGs | Step 4 | 15 min |
| 6 | Download Button Component | Nothing | 20 min |
| 7 | Blog Post Updates (22 files) | Steps 1, 5, 6 | 1-2 hours |
| 8 | OG Image Integration (within step 7) | Step 5 | Included |
| 9 | Build Integration (`package.json`) | Step 4 | 5 min |
| 10 | Robots.txt update | Step 2 | 5 min |
| 11 | Testing and validation | All above | 30 min |

**Total estimated time:** 5-8 hours

---

## Potential Challenges and Mitigations

1. **CSS variable resolution:** Infographic components depend on `--primary-*` CSS variables from `globals.css`. Preview route inherits from root layout, so these load automatically. Verify in Step 5.

2. **Tailwind class purging:** `tailwind.config.ts` content paths include `src/components/**/*.tsx`, so all infographic classes are in generated CSS.

3. **Font loading:** Project uses Inter via `next/font/google`. Playwright's `waitUntil: 'networkidle'` typically handles this; add `page.waitForTimeout(500)` as safety margin (matches existing `capture-dark-screenshots.ts` pattern).

4. **Path alias resolution:** `@/*` path alias won't resolve in `tsx` runner. Use relative imports in script: `../src/lib/blog/infographic-registry`.

5. **Rounded corners:** `element.screenshot()` captures bounding box rectangle. Set `omitBackground: true` for transparent corners, or accept white corners for social card backgrounds.

6. **Emerald color classes:** `ComparisonInfographic` and `ChecklistInfographic` use standard Tailwind `emerald-*` colors (not custom CSS variables), so no extra configuration needed.

---

## Critical Files Reference

| File | Purpose |
|------|---------|
| `src/components/blog/infographics.tsx` | 5 infographic component definitions |
| `src/app/layout.tsx` | Root layout (Inter font, globals.css) |
| `src/app/globals.css` | CSS custom properties for gradients |
| `src/app/(public)/blog/ai-customer-service-statistics/page.tsx` | Representative blog post (template for updates) |
| `capture-dark-screenshots.ts` | Existing Playwright screenshot reference pattern |
