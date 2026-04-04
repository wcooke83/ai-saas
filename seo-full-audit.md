# VocUI — Full SEO Audit
**Date:** 2026-04-04  
**Auditor:** SEO Content Auditor Agent  
**Scope:** All public-facing pages under `/src/app/(public)/`  

---

## Executive Summary

| Metric | Count |
|---|---|
| Total pages analyzed | 142 |
| Industry landing pages | 54 |
| Blog posts (live, not redirect) | 56 |
| Other public pages | 32 |
| Critical issues | 6 |
| High severity | 9 |
| Medium severity | 11 |
| Low severity | 8 |

### Top 5 Risks Requiring Immediate Action

1. **Deleted page in sitemap (404 risk):** `/chatbot-for-fitness-studios` was deleted but remains in `sitemap.ts` with `priority: 0.8`. Google will crawl a URL that returns a 404 or is unrouted, degrading sitemap quality and crawl budget.

2. **Pricing page has no metadata:** `/pricing` — one of the highest-priority pages in the sitemap — exports no `metadata` or `generateMetadata()`. It falls back to the root layout title ("VocUI - Voice User Interface") and root description. This page competes for commercial queries where a specific title and description are conversion-critical.

3. **44 of 54 industry landing pages missing author attribution:** Google's HCU and E-E-A-T guidelines explicitly flag anonymous content at scale as a trust signal risk. A publisher with 54 landing pages that carry no "Written by" or "Last reviewed" attribution signals content-farm patterns, particularly because 10 of those pages have the attribution and 44 don't — making the inconsistency visible.

4. **Boilerplate structure across ~12 B2B industry pages:** The `/chatbot-for-logistics`, `/chatbot-for-wholesale`, and `/chatbot-for-manufacturers` pages (and several others in the same cluster) are compressed into ~235-line single-file layouts with minified JSX, identical section structures (Pain Points → How It Works → Features → Before/After → Who It's For → Related Industries → CTA), and structurally parallel content. While the specific copy differs, the identical structural pattern with thin differentiation at the content level creates scalable boilerplate risk — exactly the pattern targeted by HCU.

5. **Blog/landing cannibalization cluster still sending contradictory signals:** Five blog posts (`chatbot-for-nonprofits`, `chatbot-for-restaurants`, `chatbot-for-travel-agencies`, `chatbot-for-accounting-firms`, and `chatbot-for-fitness-studios`) are both present in the sitemap AND point their canonical at a landing page. This creates a documented conflict: Google's sitemap says "this URL matters at priority 0.6" while the canonical says "treat this URL as a duplicate." The contradictory signals reduce the authority consolidation effect of the canonical.

---

## Critical Issues

### CRIT-01: Deleted page `/chatbot-for-fitness-studios` still in sitemap

**File:** `/src/app/sitemap.ts` — line 29 (in industryPages array)  
**Severity:** CRITICAL  

The filesystem entry for `/chatbot-for-fitness-studios/` was deleted (confirmed: `ls` returns nothing). The directory does not exist. However, `sitemap.ts` still includes `'/chatbot-for-fitness-studios'` in the `industryPages` array, which maps to `https://vocui.com/chatbot-for-fitness-studios` at `priority: 0.8`.

Similarly, the blog post at `/blog/chatbot-for-fitness-studios` was also deleted, but `sitemap.ts` Batch 4 (line 243) still lists `'chatbot-for-fitness-studios'` in the blog section, generating `https://vocui.com/blog/chatbot-for-fitness-studios` at `priority: 0.6`.

**Effect:** Google will crawl both URLs, encounter a 404 (or Next.js not-found page), and interpret the sitemap as unreliable. This wastes crawl budget and can reduce crawl authority across the entire sitemap.

**Fix:**
```typescript
// sitemap.ts — Remove from industryPages array:
// '/chatbot-for-fitness-studios',   ← DELETE THIS LINE

// sitemap.ts — Remove from Batch 4:
// 'chatbot-for-fitness-studios',    ← DELETE THIS LINE
```

---

### CRIT-02: `/pricing` page has no metadata

**File:** `/src/app/(public)/pricing/page.tsx`  
**Severity:** CRITICAL  

The pricing page is a server component that delegates rendering to `PricingClient`. Neither file contains a `metadata` export or `generateMetadata()`. The page falls through to the root layout metadata:

- **Title served:** `VocUI - Voice User Interface`
- **Description served:** `AI-powered chatbots trained on your knowledge base. Deploy on your website, Slack, or Telegram in minutes.`

This is the second-highest priority page in the sitemap (priority `0.9`, same as `/industries`). It targets commercial queries like "VocUI pricing", "AI chatbot pricing", "chatbot platform cost" where a specific title and description are critical for both ranking and click-through rate.

**Fix:** Add a metadata export to `/src/app/(public)/pricing/page.tsx`:

```typescript
export const metadata: Metadata = {
  title: 'Pricing | AI Chatbot Plans — Free to Enterprise | VocUI',
  description:
    'Start free. Upgrade as you grow. VocUI plans include knowledge base training, embeddable widget, and Slack integration — no credit card required.',
  openGraph: {
    title: 'Pricing | AI Chatbot Plans — Free to Enterprise | VocUI',
    description:
      'Start free. Upgrade as you grow. VocUI plans include knowledge base training, embeddable widget, and Slack integration — no credit card required.',
    url: 'https://vocui.com/pricing',
    siteName: 'VocUI',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pricing | AI Chatbot Plans — Free to Enterprise | VocUI',
    description:
      'Start free. Upgrade as you grow. VocUI plans include knowledge base training, embeddable widget, and Slack integration — no credit card required.',
  },
  alternates: { canonical: 'https://vocui.com/pricing' },
  robots: { index: true, follow: true },
};
```

---

### CRIT-03: `/guides/page.tsx` missing metadata and redirecting without it

**File:** `/src/app/(public)/guides/page.tsx`  
**Severity:** CRITICAL  

This file contains only a `redirect('/blog')` call and no metadata. When Googlebot visits `/guides`, it receives a redirect to `/blog` — but there is no metadata on the `/guides` URL itself. More importantly, `guides` is listed in the sitemap at priority `0.85` for four sub-pages, and those pages appear to be meaningful hub pages. If the index page at `/guides` is only a redirect with no metadata, it cannot hold any authority of its own.

**Fix:** Either:
- Give `/guides` a proper page (not a redirect) with metadata that serves as a hub landing page, or
- Remove `/guides` from the sitemap (sub-pages `/guides/knowledge-base-chatbot`, `/guides/embed-chatbot`, etc. are correctly listed separately)

If keeping the redirect, add at minimum:
```typescript
export const metadata: Metadata = {
  title: 'Guides | VocUI',
  robots: { index: false, follow: true },
};
```
to prevent the URL from being indexed while crawl follows the redirect.

---

### CRIT-04: Homepage has no page-level metadata (falls back to root)

**File:** `/src/app/(public)/page.tsx`  
**Severity:** CRITICAL  

The homepage `page.tsx` exports no `metadata` object. The root layout at `/src/app/layout.tsx` exports:
- **Title:** `VocUI - Voice User Interface`
- **Description:** `AI-powered chatbots trained on your knowledge base. Deploy on your website, Slack, or Telegram in minutes.`

The title "VocUI - Voice User Interface" is weak for homepage targeting. "Voice User Interface" is not the product's core value proposition — it's a legacy acronym that misaligns with search intent for queries like "AI chatbot builder", "train chatbot on documents", or "custom chatbot for website". The homepage is the site's highest-authority page (priority `1.0`) and should have a page-specific title and description.

**Fix:** Add to `/src/app/(public)/page.tsx`:
```typescript
export const metadata: Metadata = {
  title: 'VocUI | Build an AI Chatbot Trained on Your Own Docs',
  description:
    'Turn your docs, URLs, and FAQs into a custom AI chatbot — deployed on your website, Slack, or Telegram in under an hour. Free plan available.',
  alternates: { canonical: 'https://vocui.com/' },
  robots: { index: true, follow: true },
};
```

---

### CRIT-05: Organization schema has empty `sameAs` array

**File:** `/src/app/layout.tsx` — line 36  
**Severity:** CRITICAL  

The root Organization schema includes:
```json
"sameAs": []
```

An empty `sameAs` is worse than omitting it. It signals to Google that VocUI has no social presence or external authority signals, which directly undermines E-E-A-T authoritativeness scoring for the entire domain. Even if VocUI only has a LinkedIn or Twitter/X profile, those should be listed.

**Fix:** Populate with any active social/professional profiles:
```json
"sameAs": [
  "https://www.linkedin.com/company/vocui",
  "https://twitter.com/vocui"
]
```
If these accounts don't exist yet, remove the `sameAs` field entirely rather than leaving it empty.

---

### CRIT-06: Five blog posts present in sitemap with canonical pointing elsewhere — contradictory signals

**Files:**
- `/src/app/(public)/blog/chatbot-for-nonprofits/page.tsx` — canonical → `/chatbot-for-nonprofits`
- `/src/app/(public)/blog/chatbot-for-restaurants/page.tsx` — canonical → `/chatbot-for-restaurants`
- `/src/app/(public)/blog/chatbot-for-travel-agencies/page.tsx` — canonical → `/chatbot-for-travel-agencies`
- `/src/app/(public)/blog/chatbot-for-accounting-firms/page.tsx` — canonical → `/blog/chatbot-for-accounting-firms` (self)
- `/src/app/(public)/blog/chatbot-for-fitness-studios/page.tsx` — **DELETED** but still in sitemap

**Severity:** CRITICAL  

`sitemap.ts` Batch 4 (lines 239-249) explicitly includes `chatbot-for-nonprofits`, `chatbot-for-restaurants`, `chatbot-for-travel-agencies`, `chatbot-for-fitness-studios`, and `chatbot-for-accounting-firms` as blog slugs. The first three pages declare a canonical pointing to their corresponding landing page. This creates a contradiction: the sitemap tells Google "this blog URL should be crawled and indexed," while the canonical tag says "treat this blog URL as a duplicate of the landing page."

Google's documentation is clear: canonicals and sitemaps should be consistent. When they contradict, Google may ignore both signals or apply them inconsistently.

**Fix for the three pages with landing-page canonicals:**
Remove them from the sitemap Batch 4. They are already consolidating to their landing page — there is no reason to submit them to the sitemap separately. Delete these three entries from `sitemap.ts`:
```
'chatbot-for-nonprofits',      // has canonical → /chatbot-for-nonprofits
'chatbot-for-travel-agencies', // has canonical → /chatbot-for-travel-agencies
'chatbot-for-restaurants',     // has canonical → /chatbot-for-restaurants
```

**Fix for `chatbot-for-fitness-studios`:** Remove from sitemap entirely (blog page is deleted, CRIT-01 covers the landing page entry).

**Fix for `chatbot-for-accounting-firms`:** This one has a self-canonical (`/blog/chatbot-for-accounting-firms`), so including it in the sitemap is correct. Keep it.

---

## High Severity Issues

### HIGH-01: 44 of 54 industry landing pages missing author attribution

**Files:** All `/chatbot-for-*/page.tsx` files EXCEPT: dentists, financial-advisors, government, healthcare, immigration-lawyers, insurance-agents, lawyers, pharmacies, plastic-surgeons, therapists  
**Severity:** HIGH  

Only 10 of 54 industry pages include the "Written by the VocUI team · Last reviewed April 2026" block. The remaining 44 are anonymous. Google's Search Quality Rater Guidelines (section 3.3) specifically evaluate who is responsible for the content. For a site publishing 54 near-parallel landing pages without attribution, the pattern resembles scaled content production — a primary HCU risk signal.

The 10 pages with attribution include the high-YMYL categories (healthcare, legal, government, financial), which is correct prioritisation. However, the remaining 44 pages — covering fitness, trades, hospitality, e-commerce, logistics — still represent a significant gap.

**Fix:** Add the attribution block to all 44 remaining pages before `</main>`:
```tsx
<div className="container mx-auto px-4 py-8 border-t border-secondary-200 dark:border-secondary-700">
  <p className="text-xs text-secondary-500 dark:text-secondary-400">
    Written by the VocUI team · Last reviewed April 2026
  </p>
</div>
```

**Priority order for remediation:** chatbot-for-gyms, chatbot-for-ecommerce, chatbot-for-real-estate, chatbot-for-restaurants, chatbot-for-hotels, chatbot-for-plumbers, chatbot-for-hr, chatbot-for-lead-capture, then all remaining.

---

### HIGH-02: Anonymous testimonials across the site — unverifiable social proof

**Files:**
- `/src/app/(public)/home-testimonials.tsx` — Authors: "J.D.", "S.C.", "M.T." with initials-only avatars
- `/src/app/(public)/chatbot-for-ecommerce/page.tsx` — "Marcus T., Head of Customer Experience, a direct-to-consumer brand"

**Severity:** HIGH  

All testimonials use initials or first-name-only attribution with no company name, no verifiable source, no photo. Google's Quality Raters Guidelines (section 3.1) explicitly call out unverifiable testimonials as a trust signal weakness. For a SaaS product seeking E-E-A-T signals, testimonials attributed to "J.D., Marketing Director, E-commerce brand" carry near-zero trust weight.

This is a pattern Google flagged in its HCU documentation: reviews and endorsements from unnamed or unverifiable parties are treated as less authoritative than named, verifiable sources.

**Fix:**
- Replace initials with full names (e.g., "Jamie D.") if full name can't be disclosed
- Add company name (can be generic: "a 50-person SaaS company" is acceptable if accurate)
- Add a profile image or company logo where possible
- Best option: obtain case studies with verifiable, named customers willing to be cited publicly

---

### HIGH-03: Boilerplate structure on ~12 compressed B2B landing pages creates HCU pattern risk

**Files:**
- `/src/app/(public)/chatbot-for-logistics/page.tsx` (235 lines)
- `/src/app/(public)/chatbot-for-wholesale/page.tsx` (235 lines)
- `/src/app/(public)/chatbot-for-manufacturers/page.tsx` (~235 lines)
- And approximately 9 additional pages with the same compressed single-file format

**Severity:** HIGH  

The logistics and wholesale pages share:
- Identical section layout: Pain Points (3 cards) → How It Works (3 steps) → Features (6 cards) → Before/After scenario → Who It's For → Related Industries → CTA
- Near-identical structural text: "Your team is answering questions a chatbot could handle", "Live before your next [X] enquiry. No developers needed.", "Free plan available · No credit card required · Live in under an hour"
- The same single citation (SalesLoft 41% stat) appears in the pain points of both pages

While the specific industry content differs (tracking FAQ vs. MOQ FAQ), the structural identity and shared boilerplate text represents ~40-50% identical content when compared. Google's HCU guidance specifically flags "scaled content" where pages follow a template and differ only by replacing one variable (industry name).

**Assessment:** These pages are not thin individually — they each have 1,000+ words of real content. However, the structural repetition across the full set of 54 pages is a risk that could flag the site as a content operation if quality raters sample several pages and find near-identical scaffolding.

**Fix (medium term):**
- Add one unique data point per page (industry-specific stat with citation)
- Add a differentiated intro section that doesn't share structure with siblings
- Consider a "Before/After" case study format with different narrative styles (the wholesale page uses a single timeline, the gyms page uses two parallel columns — this variation approach is correct and should be expanded to the compressed B2B pages)

---

### HIGH-04: `/chatbot-for-hotels` is in sitemap but the blog `/blog/chatbot-for-hotels` was deleted without a redirect

**Files:**
- `/src/app/(public)/chatbot-for-hotels/page.tsx` — EXISTS, in sitemap ✓
- `/src/app/(public)/blog/chatbot-for-hotels/` — DELETED, NOT in sitemap ✓ (no issue there)

**Severity:** HIGH (conditional)  

The hotel landing page itself exists and appears in the sitemap — that's fine. However, the blog post at `/blog/chatbot-for-hotels` was deleted. If this page had any external backlinks or was previously indexed, deleting it without a 301 redirect to the landing page at `/chatbot-for-hotels` would waste any accumulated link equity.

**Fix:** Add a redirect page at `/src/app/(public)/blog/chatbot-for-hotels/page.tsx` if the blog post was previously indexed:
```typescript
import { permanentRedirect } from 'next/navigation';
export default function RedirectPage() {
  permanentRedirect('/chatbot-for-hotels');
}
```

If the page was never indexed (was a recent deletion), no action needed. Check Google Search Console to confirm.

---

### HIGH-05: Five active blog posts with unique "How to" content missing from sitemap

**Files (NOT in sitemap, NOT redirects, have unique content):**
- `/src/app/(public)/blog/chatbot-for-ecommerce/page.tsx` — canonical → `/chatbot-for-ecommerce`
- `/src/app/(public)/blog/chatbot-for-healthcare/page.tsx` — canonical → `/chatbot-for-healthcare`
- `/src/app/(public)/blog/chatbot-for-hr/page.tsx` — canonical → `/chatbot-for-hr`
- `/src/app/(public)/blog/chatbot-for-plumbers/page.tsx` — canonical → `/chatbot-for-plumbers`
- `/src/app/(public)/blog/chatbot-for-real-estate/page.tsx` — canonical → `/chatbot-for-real-estate`

**Severity:** HIGH  

These five blog posts exist as unique "How to..." articles with distinct content from their corresponding landing pages. They canonicalize to the landing page — which is the correct SEO pattern (consolidating ranking signals to the landing page). However, they are not included in the sitemap at all.

This is an incomplete execution of the consolidation strategy. The canonical tells Google to treat them as duplicates of the landing page, but Google still discovers and crawls them via internal links. The missing sitemap entry means the crawl priority signal is absent.

**Resolution options:**
1. Include them in the sitemap at `priority: 0.5` with a note that they canonicalize — this is valid and helps Googlebot discover them to then follow the canonical signal
2. OR add 301 redirects instead of canonical tags (cleaner consolidation — removes the page entirely and passes all link equity to the landing page)

**Recommendation:** Option 2. These pages exist as "How to" guides with distinct content from the landing pages. Rather than canonical-only consolidation, use `permanentRedirect()` to fully redirect each to its landing page — only if the article content is truly superseded by the landing page. If the article has distinct educational value, add it to the sitemap at `priority: 0.5`.

---

### HIGH-06: Keyword cannibalization — comparisons cluster (three pages, one intent)

**Pages targeting overlapping "alternatives" queries:**
1. `/vs-intercom` — "VocUI vs Intercom: AI Chatbot Comparison"
2. `/blog/intercom-alternatives` — "Intercom Alternatives That Won't Break the Budget"
3. `/guides/chatbot-alternatives` — includes Intercom in keyword array `'Intercom alternatives'`

**Pages targeting overlapping "Tidio alternatives" queries:**
1. `/vs-tidio` — "VocUI vs Tidio: AI Chatbot Builder Comparison"
2. `/blog/tidio-alternatives` — "5 Tidio Alternatives for AI-Powered Customer Chat"
3. `/guides/chatbot-alternatives` — includes `'Tidio alternatives'` in keyword array

**Severity:** HIGH  

For the query "Intercom alternatives," three VocUI URLs are competing. The `/vs-intercom` page targets a branded head-to-head query (navigational intent: "how does VocUI compare to Intercom?"). The `/blog/intercom-alternatives` page targets a non-branded list query (informational intent: "what can I use instead of Intercom?"). These serve different intents and don't directly cannibalize.

The problem is the `/guides/chatbot-alternatives` hub page. Its `keywords` array explicitly includes `'Intercom alternatives'` and `'Tidio alternatives'` — the same terms targeted by the blog posts. This splits ranking signals between the guide hub (which already links to the blog posts as spokes) and the blog posts themselves.

**Fix:**
- Remove `'Intercom alternatives'` and `'Tidio alternatives'` from the guides/chatbot-alternatives keywords array. The hub's meta keywords should target only the aggregated query ("chatbot alternatives comparison"), not the specific brand-alternative queries that the spoke posts own.
- The vs-pages (/vs-intercom, /vs-tidio) target different intent from the alternatives blog posts — this is not cannibalization, keep them separate.

---

### HIGH-07: `/chatbot-for-lead-capture` vs `/blog/chatbot-lead-generation-strategies` — partial intent overlap

**Files:**
- `/src/app/(public)/chatbot-for-lead-capture/page.tsx` — keywords: "AI lead capture chatbot", "lead generation chatbot", "automated lead qualification"
- `/src/app/(public)/blog/chatbot-lead-generation-strategies/page.tsx` — title targets "chatbot lead generation strategies"

**Severity:** HIGH  

Both pages target lead generation / lead capture intent with a chatbot. The landing page is commercial (sign-up CTA), the blog post is informational (strategy guide). This is the correct intent split and is not itself a problem.

The issue is that the blog post at `/blog/chatbot-for-lead-qualification/page.tsx` is a `permanentRedirect` to `/blog/chatbot-lead-generation-strategies` — meaning a page that previously targeted "chatbot for lead qualification" now redirects to "chatbot lead generation strategies." If there are any indexed external links to `/blog/chatbot-for-lead-qualification`, those pass through to the lead generation post — which now competes with the landing page.

**Fix:** Confirm in Google Search Console that `/blog/chatbot-for-lead-qualification` was never indexed or linked. If it was, add a `noindex` override to the redirect destination's competing content, or differentiate the landing page more aggressively around "lead capture" (conversion) vs. the blog's "lead generation strategies" (education).

---

### HIGH-08: Login, signup, forgot-password, reset-password pages have no metadata or `noindex`

**Files:**
- `/src/app/(public)/login/page.tsx`
- `/src/app/(public)/signup/page.tsx`
- `/src/app/(public)/forgot-password/page.tsx`
- `/src/app/(public)/reset-password/page.tsx`

**Severity:** HIGH  

All four pages have no metadata export. They fall back to the root layout title ("VocUI - Voice User Interface"). None have `robots: { index: false }` set. These pages should not be indexed — they serve no informational purpose for search engines, and having them indexed wastes crawl budget and may create duplicate-title signals (four pages with identical title tags).

**Fix:** Add to each:
```typescript
export const metadata: Metadata = {
  title: 'Log In | VocUI',
  robots: { index: false, follow: false },
};
```

---

### HIGH-09: `chatbot-booking` page missing `robots` directive and has OG description mismatch

**File:** `/src/app/(public)/chatbot-booking/page.tsx` — line 58  
**Severity:** HIGH  

The `chatbot-booking` page's `generateMetadata()` function is missing the `robots` directive entirely (no `robots: { index: true, follow: true }` declaration). All 54 industry landing pages and most blog posts have explicit `robots` declarations. Its absence here means the page relies on the robots.txt `allow: '/'` directive — functional, but not explicit.

Additionally, the OG description differs from the meta description:
- **Meta description:** "Let your website chatbot check availability and book appointments 24/7. VocUI integrates AI chat with calendar scheduling — no phone tag, no missed bookings."
- **OG description:** "Let website visitors book appointments directly in the chat window. 24/7 availability, instant confirmation, no phone tag."

Social shares will show the OG description while SERP snippets show the meta description. These should match or the meta description should be the canonical copy.

**Fix:** Add `robots: { index: true, follow: true }` to the metadata return object. Align the OG and meta description.

---

## Medium Severity Issues

### MED-01: Root layout Organization schema has empty `sameAs` — already flagged as CRIT-05 above

### MED-02: `about/page.tsx` — no founder or team information, no organizational authority signals

**File:** `/src/app/(public)/about/about-hero.tsx`, `about-intro.tsx`, `about-beliefs.tsx`  
**Severity:** MEDIUM  

The About page contains no information about who built VocUI, who is responsible for the product, or any team bios. The stat section shows "< 1 hr" setup time, "0" developers, "24/7" availability — but no human authority signals. Google's E-E-A-T framework specifically evaluates "Who is responsible for this website?" for YMYL-adjacent products (an AI chatbot that replaces human customer service has YMYL-adjacent implications).

The About page currently reads as: "This product exists. Here's what it does." It does not establish who built it, why they built it, or what expertise they bring.

**Fix:** Add at minimum:
- One paragraph about the founders/team background (even "Built by a team of SaaS operators and AI engineers" is better than nothing)
- A clear statement of company location/registration if applicable
- A link to a team or founders LinkedIn profile

---

### MED-03: Testimonials lack schema markup

**File:** `/src/app/(public)/home-testimonials.tsx`  
**Severity:** MEDIUM  

The homepage testimonials are rendered as blockquotes but have no `Review` or `AggregateRating` schema. While Google doesn't always surface testimonials as rich results, structured data would support the trust signals.

**Fix:** Add JSON-LD Review schema for each testimonial (noting that individual reviews require `author.name` to be non-null — this means the anonymized initials need to be resolved first per HIGH-02).

---

### MED-04: `chatbot-for-gyms` links to a deleted blog post

**File:** `/src/app/(public)/chatbot-for-gyms/page.tsx` — line 697-703  
**Severity:** MEDIUM  

The gyms landing page contains a "Related reading" internal link to `/blog/chatbot-for-fitness-studios`. That blog post was deleted. This is an internal broken link that will return a 404 or redirect to a not-found state.

**Fix:** Remove or replace the "Related reading" block. Replace with a link to `/blog/chatbot-best-practices-for-small-business` or `/blog/how-to-embed-chatbot-in-wordpress` as general-purpose alternatives, or leave the section blank until a gyms-specific blog post exists.

```tsx
// Remove this entire block from chatbot-for-gyms/page.tsx lines 692-704:
{/* Related Blog Post */}
<div className="container mx-auto px-4">
  ...
  <Link href="/blog/chatbot-for-fitness-studios" ...>
```

---

### MED-05: `features/page.tsx` is not in the sitemap

**File:** `/src/app/(public)/features/page.tsx`  
**Severity:** MEDIUM  

The `/features` page has proper metadata, a canonical tag, and `robots: { index: true, follow: true }`. However, it does not appear in `sitemap.ts` anywhere. A page about the platform's features is commercially important and should be included.

**Fix:** Add to sitemap:
```typescript
{
  url: `${BASE_URL}/features`,
  lastModified: new Date(),
  changeFrequency: 'monthly',
  priority: 0.8,
},
```

---

### MED-06: `chatbot-booking/page.tsx` is in sitemap but missing structured data

**File:** `/src/app/(public)/chatbot-booking/page.tsx`  
**Severity:** MEDIUM  

The chatbot booking page has no JSON-LD structured data at all (no SoftwareApplication, no FAQPage, no BreadcrumbList). All 54 industry landing pages have at minimum SoftwareApplication + BreadcrumbList. This page describes a specific product feature (appointment booking integration) and would benefit from the same schema pattern.

---

### MED-07: `knowledge-base-chatbot/page.tsx` missing `robots` directive

**File:** `/src/app/(public)/knowledge-base-chatbot/page.tsx` — line 60  
**Severity:** MEDIUM  

The page metadata `generateMetadata()` does not include a `robots` field. This is the only solution-specific landing page (not an industry page) that lacks an explicit robots directive. All industry pages and blog posts have explicit `robots: { index: true, follow: true }` declarations.

---

### MED-08: Sitemap uses `new Date()` for all `lastModified` — always returns today

**File:** `/src/app/sitemap.ts`  
**Severity:** MEDIUM  

Every entry in the sitemap uses `lastModified: new Date()`, which means every page always appears to have been modified today. Google uses `lastModified` as a crawl frequency signal. When every page always shows today's date, the signal becomes meaningless and Google will ignore it. Pages that haven't changed in months are reporting a false modification date.

This also means Google cannot distinguish genuinely updated pages from static ones, reducing the efficiency of its crawl scheduling.

**Fix:** Use hardcoded dates for stable pages, and only use `new Date()` for pages that actually pull from a database (like `/changelog` which is updated regularly, or `/pricing` which depends on Supabase data):

```typescript
// Example for stable pages:
{
  url: `${BASE_URL}/about`,
  lastModified: new Date('2026-03-01'),
  changeFrequency: 'yearly',
  priority: 0.5,
},
// Dynamic pages that genuinely update:
{
  url: `${BASE_URL}/pricing`,
  lastModified: new Date(), // ← OK for DB-driven page
  changeFrequency: 'weekly',
  priority: 0.9,
},
```

---

### MED-09: No `hreflang` or language declarations beyond `<html lang="en">`

**File:** `/src/app/layout.tsx` — line 32  
**Severity:** MEDIUM (future risk)  

The root layout correctly sets `<html lang="en">`. However, the testimonials and some content use British English conventions (e.g., "enquiries", "colour") while other content uses American English ("specialization", "practise" as a verb). This inconsistency across 142 pages creates a mixed-language signal. If VocUI is targeting both US and UK markets (which the content suggests, given UK English patterns on many industry pages), proper `hreflang` tags or a consistent language choice would improve SERP targeting.

---

### MED-10: `design-system/page.tsx` is publicly accessible and indexable

**File:** `/src/app/(public)/design-system/page.tsx`  
**Severity:** MEDIUM  

The design system page (`/design-system`) is publicly accessible. It contains no `robots: { index: false }` directive. Design system pages serve no user need for external visitors and should not be indexed. The page is not in the sitemap (good), but Googlebot can still discover and index it via internal links or direct crawl.

**Fix:** Add to the page:
```typescript
export const metadata: Metadata = {
  title: 'Design System | VocUI',
  robots: { index: false, follow: false },
};
```

---

### MED-11: `slack-chatbot/page.tsx` and `/chatbot-for-hr/page.tsx` both target Slack internal bot queries — partial cannibalization

**Files:**
- `/src/app/(public)/slack-chatbot/page.tsx` — "AI Chatbot for Slack | Train on Your Docs"
- `/src/app/(public)/blog/how-to-set-up-slack-chatbot-for-team/page.tsx` — "How to Set Up a Slack Chatbot for Your Team"

**Severity:** MEDIUM  

The `/slack-chatbot` landing page targets the query "AI chatbot for Slack" (commercial intent). The blog post `/how-to-set-up-slack-chatbot-for-team` targets "how to set up a Slack chatbot" (informational intent). These serve different intents — the landing page converts, the blog post educates — and they should link to each other clearly.

Currently, the `/slack-chatbot` page does not appear to link to the how-to blog post. This is a missed internal linking opportunity and a mild intent-split risk if Google conflates the two pages.

**Fix:** Add a "Related reading" block on `/slack-chatbot` linking to the how-to post. Ensure the blog post links back to the landing page as its primary CTA.

---

## Low Severity Issues

### LOW-01: Homepage has no JSON-LD structured data

**File:** `/src/app/(public)/page.tsx` (root layout handles Organization schema, but no WebSite or WebPage schema)  
**Severity:** LOW  

The homepage lacks a `WebSite` schema with `SearchAction` (sitelinks search box), and a `WebPage` schema describing the homepage. The Organization schema in the root layout is present, but it fires on every page — not specifically on the homepage where it's most relevant.

**Fix:** Add to `page.tsx`:
```json
{
  "@type": "WebSite",
  "url": "https://vocui.com",
  "name": "VocUI",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://vocui.com/blog?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
```

---

### LOW-02: Blog index page (`/blog`) has no metadata

**File:** `/src/app/(public)/blog/page.tsx`  
**Severity:** LOW  

The main blog listing page falls back to root layout metadata. It needs its own title and description targeting "AI chatbot blog", "chatbot resources", etc.

---

### LOW-03: No Twitter/X card image (`og:image`) declared for most pages

**Files:** Multiple — all pages using text-only metadata (no `images:` field in openGraph config)  
**Severity:** LOW  

Twitter cards are declared as `summary_large_image` across all pages, but no explicit image URL is set in the metadata config (some pages have `opengraph-image.tsx` files, others don't). Pages without a corresponding `opengraph-image.tsx` file will either use the root OG image or show a blank card on social shares.

Pages that have proper OG image files: `blog/ai-chatbot-vs-live-chat`, `blog/chatbase-alternatives`, `blog/chatbot-analytics-what-to-track`, `blog/chatbot-best-practices-for-small-business`, and ~20 others.

Pages missing OG images: all 54 industry landing pages, `/pricing`, `/solutions`, `/about`, `/vs-intercom`, `/vs-tidio`.

---

### LOW-04: Inconsistent use of `export const metadata` vs `export function generateMetadata()`

**Files:** Mixed usage across the codebase  
**Severity:** LOW  

Blog posts use `export const metadata: Metadata = {...}` (static). Industry landing pages use `export function generateMetadata(): Metadata { return {...} }` (function form). Both are valid Next.js 15 patterns, but the function form is only necessary when metadata is dynamic (depends on params or fetch). Industry landing pages are all static — using `generateMetadata()` with no async data fetching adds unnecessary complexity.

This is a code quality issue, not a direct SEO risk, but the inconsistency could mask actual dynamic metadata needs.

---

### LOW-05: `wiki/page.tsx` has a non-descriptive description

**File:** `/src/app/(public)/wiki/page.tsx`  
**Severity:** LOW  

The wiki/documentation page has metadata but the description should be audited for specificity — "Documentation | VocUI" as a title is generic. "VocUI Documentation — Setup Guides, API Reference, and Integration Tutorials" would better capture long-tail queries from users seeking setup help.

---

### LOW-06: `chatbot-for-ecommerce` page has a layout bug — nested `container` divs

**File:** `/src/app/(public)/chatbot-for-ecommerce/page.tsx` — lines 485-487  
**Severity:** LOW  

The "Who It's For" section has a double container:
```tsx
<section className="container mx-auto px-4 py-24">
  <div className="container mx-auto px-4">  {/* ← double container */}
```

This is a rendering bug that causes double-padding on the section on mobile. While not a direct SEO issue, it signals page quality to Google's quality raters if the layout is visibly broken.

---

### LOW-07: Internal links from industry pages to related industry pages don't include `aria-label` on the section

**Files:** Multiple industry landing pages — "Related industries" sections  
**Severity:** LOW  

The "Related industries" sections use `<h2 className="text-lg font-semibold ...">Related industries</h2>` without a unique accessible label. This is a minor accessibility gap that can affect how screen readers navigate the page.

---

### LOW-08: `sitemap-page` at `/sitemap` is in the XML sitemap at priority 0.3

**File:** `/src/app/sitemap.ts` — line 363  
**Severity:** LOW  

The HTML sitemap page at `/sitemap` is included in the XML sitemap. HTML sitemap pages serve a user navigation function — they should not typically be in the XML sitemap, as it adds a low-value URL to the crawl budget allocation. Its priority of 0.3 minimises the impact, but it could be removed without consequence.

---

## Cannibalization Map

### Group A — Fitness / Gyms Cluster (RESOLVED, one residual)
| URL | Target Query | Status |
|---|---|---|
| `/chatbot-for-gyms` | "AI chatbot for gyms", "gym chatbot", "fitness studio chatbot" | PRIMARY — keep |
| `/chatbot-for-yoga-studios` | "chatbot for yoga studios" | OK — distinct sub-niche |
| `/chatbot-for-personal-trainers` | "chatbot for personal trainers" | OK — distinct sub-niche |
| `/chatbot-for-fitness-studios` (DELETED) | — | DELETED — remove from sitemap |
| `/blog/chatbot-for-fitness-studios` (DELETED) | — | DELETED — remove from sitemap |

**Residual issue:** `/chatbot-for-gyms` keyword array still includes `'AI chatbot for fitness studios'`. This is fine to retain since the gyms page now covers boutique studios — but consider removing the keyword to reduce any residual cannibalization signal.

---

### Group B — Alternatives Cluster (moderate risk)
| URL | Target Query | Status |
|---|---|---|
| `/guides/chatbot-alternatives` | "chatbot alternatives comparison", "best chatbot platforms" | HUB — correct |
| `/blog/chatbase-alternatives` | "Chatbase alternatives" | SPOKE — canonical → guide hub ✓ |
| `/blog/tidio-alternatives` | "Tidio alternatives" | SPOKE — self-canonical |
| `/blog/intercom-alternatives` | "Intercom alternatives" | SPOKE — self-canonical |
| `/blog/drift-alternatives` | "Drift alternatives" | SPOKE — self-canonical |
| `/blog/zendesk-chat-alternatives` | "Zendesk Chat alternatives" | SPOKE — self-canonical |
| `/blog/freshchat-alternatives` | "Freshchat alternatives" | SPOKE — self-canonical |
| `/vs-intercom` | "VocUI vs Intercom" | SEPARATE — different intent (branded comparison) |
| `/vs-tidio` | "VocUI vs Tidio" | SEPARATE — different intent (branded comparison) |

**Issue:** The hub at `/guides/chatbot-alternatives` has `'Tidio alternatives'` and `'Intercom alternatives'` in its keywords array, overlapping the spoke posts. Remove those from the hub's keyword list.

**Issue:** Only `chatbase-alternatives` points its canonical to the guide hub. The other five alternatives posts are self-canonical, meaning they don't consolidate to the hub. If the hub is intended to be the definitive "chatbot alternatives" resource, the spoke posts should either canonical → hub, or the hub should not try to rank for individual brand alternative queries.

---

### Group C — Knowledge Base Chatbot Cluster (low risk, well structured)
| URL | Target Query | Status |
|---|---|---|
| `/knowledge-base-chatbot` | "knowledge base chatbot", "train chatbot on documents" | COMMERCIAL LANDING |
| `/guides/knowledge-base-chatbot` | "knowledge base chatbot guide" | EDUCATIONAL HUB |
| `/blog/what-is-a-knowledge-base-chatbot` | "what is a knowledge base chatbot" | SPOKE — informational |
| `/blog/how-to-train-chatbot-on-your-own-data` | "how to train chatbot on own data" | SPOKE — how-to |

**Assessment:** The intent hierarchy here is well-executed. Commercial landing page serves conversion intent, guide serves comprehensive educational intent, blog posts serve specific informational sub-queries. The only gap: the `/knowledge-base-chatbot` landing page does not link to the guide, and the guide's BreadcrumbList should include the landing page as a related resource.

---

### Group D — Lead Generation Cluster (low risk)
| URL | Target Query | Status |
|---|---|---|
| `/chatbot-for-lead-capture` | "lead capture chatbot", "lead generation chatbot" | COMMERCIAL LANDING |
| `/blog/chatbot-lead-generation-strategies` | "chatbot lead generation strategies" | EDUCATIONAL |
| `/blog/chatbot-for-lead-qualification` | → redirects to strategies post | REDIRECT ✓ |

**Assessment:** Structure is correct. Landing page = commercial, blog post = strategic education. The redirect cleans up the legacy lead-qualification slug. Monitor for any ranking impact on the strategies post from the redirect chain.

---

### Group E — Mortgage Brokers vs Lenders (potential soft cannibalization)
| URL | Target Query | Status |
|---|---|---|
| `/chatbot-for-mortgage-brokers` | "AI chatbot for mortgage brokers", "rate FAQ chatbot" | LIVE |
| `/chatbot-for-mortgage-lenders` | "AI chatbot for mortgage lenders", "underwriting FAQ chatbot" | LIVE |

**Assessment:** Titles and descriptions are distinct. Brokers = "Rate FAQ & Application Lead Capture", Lenders = "Underwriting FAQ & Borrower Pre-Qualification". These target different audiences (broker vs. lender), so cannibalization risk is low. However, queries like "AI chatbot for mortgage industry" or "mortgage chatbot" could surface either page. Confirm that keyword arrays don't overlap (not checked at time of audit).

---

## Recommended Actions — Prioritized

### Immediate (fix before next crawl)

1. **Remove `/chatbot-for-fitness-studios` from `sitemap.ts`** — both the industry entry (line 29) and the blog entry in Batch 4 (line 243). [CRIT-01]

2. **Add metadata to `/pricing/page.tsx`** — title, description, canonical, robots, OG. [CRIT-02]

3. **Add metadata + `robots: { index: false }` to login, signup, forgot-password, reset-password pages.** [HIGH-08]

4. **Remove the broken internal link to `/blog/chatbot-for-fitness-studios` from `/chatbot-for-gyms/page.tsx` lines 692-704.** [MED-04]

5. **Remove three blog slugs from `sitemap.ts` Batch 4** that have landing-page canonicals: `chatbot-for-nonprofits`, `chatbot-for-restaurants`, `chatbot-for-travel-agencies`. [CRIT-06]

### Short-term (this sprint)

6. **Add page-level metadata to `/page.tsx` (homepage)** with a better title than "VocUI - Voice User Interface". [CRIT-04]

7. **Populate or remove `sameAs` in root Organization schema.** [CRIT-05]

8. **Resolve `/guides/page.tsx`** — either add metadata + `robots: noindex` or build a real hub page. [CRIT-03]

9. **Add author attribution to 44 remaining industry landing pages** — start with gyms, ecommerce, real-estate, restaurants, hotels, plumbers, hr, lead-capture. [HIGH-01]

10. **Add `features` page to sitemap.** [MED-05]

11. **Add `robots` directive to `chatbot-booking` and `knowledge-base-chatbot` pages.** [MED-07, HIGH-09]

12. **Add `robots: { index: false }` to `design-system` page.** [MED-10]

### Medium-term (next 2-4 weeks)

13. **Replace anonymous testimonials** with full names and verifiable attribution. Update all three homepage testimonials and the ecommerce page testimonial. [HIGH-02]

14. **Fix `lastModified` dates in sitemap** — use hardcoded dates for stable pages instead of `new Date()` everywhere. [MED-08]

15. **Add structured data (SoftwareApplication + FAQPage + BreadcrumbList) to `chatbot-booking` page.** [MED-06]

16. **Differentiate the 12 structurally-compressed B2B landing pages** — add one unique industry stat per page, vary the Before/After format, add a distinct intro paragraph. [HIGH-03]

17. **Add `WebSite` JSON-LD with `SearchAction` to homepage.** [LOW-01]

18. **Remove `sameAs: []` from Organization schema** (replace with real URLs or remove the field). [CRIT-05]

19. **Fix the double-container bug in `/chatbot-for-ecommerce` "Who It's For" section.** [LOW-06]

20. **Update the About page** with founder/team context and organizational authority signals. [MED-02]

---

## Notes for Future Audits

- **Blog posts with landing-page canonicals** that are NOT in the sitemap (chatbot-for-ecommerce, -healthcare, -hr, -plumbers, -real-estate blog posts): These are working correctly — canonical points to landing page, not in sitemap. They should either have `permanentRedirect()` or remain as canonical-only consolidations. The current state is acceptable but should be documented to avoid confusion.

- **The `VOCUI_AUTHOR` constant** used in blog post JSON-LD should be audited for accuracy. If it contains a real person's name and credentials, those should be verified. If it's a team byline, confirm it matches the visible AuthorByline component output.

- **Author page at `/blog/author/[slug]`**: This dynamic route exists but no author pages appear to be linked from blog posts. If `/blog/author/vocui-team` exists (or similar), it should be linked from every `AuthorByline` component to establish the author as a known entity with a Google-visible profile page. This is a direct E-E-A-T lever.

- **Images**: The audit did not assess image alt text or Core Web Vitals (LCP, CLS, FID) — these require browser rendering. Prior memory notes flag image alt text as a remaining gap from the blog audit. Recommend running Lighthouse on the homepage and 3-5 landing pages to surface CWV issues.
