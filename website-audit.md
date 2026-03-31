# VocUI Website Audit
**Date:** 2026-03-30
**Scope:** Public-facing website at vocui.com — UX copy, SEO, CRO, business positioning, and landing page expansion

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Critical Blockers](#critical-blockers)
3. [UX Copy Audit](#ux-copy-audit)
4. [SEO Audit](#seo-audit)
5. [CRO Audit](#cro-audit)
6. [Business & Positioning Audit](#business--positioning-audit)
7. [Landing Page Copy Recommendations](#landing-page-copy-recommendations)
8. [Additional Landing Pages Roadmap](#additional-landing-pages-roadmap)
9. [Implementation Roadmap](#implementation-roadmap)

---

## Executive Summary

VocUI has a well-structured marketing site with a clear value proposition and solid conversion scaffolding (free plan, trust signals, multi-CTA flow). However, five structural issues are actively destroying conversions today, and a large volume of organic search traffic is left uncaptured because key pages don't exist.

**The three biggest ROI levers, in order:**
1. Fix the four broken nav links (`/about`, `/contact`, `/careers`, `/cookies`) — these are 404s visible to every visitor and fatal to B2B due diligence
2. Add a persistent CTA button in the sticky header — there is no sign-up path for a visitor who has scrolled past the hero
3. Add a product visual (screenshot or demo video) to the hero — for a chat product, showing a conversation converts significantly better than copy alone

**Strategic gap:** VocUI has one use-case landing page (`/chatbot-booking`) but the homepage promises three primary outcomes: deflect support tickets, capture leads, book appointments. Pages for `/chatbot-for-customer-support` and `/chatbot-for-lead-capture` should exist and don't. Completing this set closes the most significant SEO and conversion gap in the current site.

---

## Critical Blockers

Issues that are actively costing conversions or creating legal/trust risk today.

### C1 — Four broken nav links (404s on every page)
**Impact: Conversion + Trust**

Links in both the header mobile menu and footer point to pages that don't exist:
- `/about` — Every B2B buyer clicks this during due diligence. A 404 signals the product may be abandoned or experimental.
- `/contact` — Required for enterprise qualification. Its absence signals no sales process exists.
- `/careers` — Lower urgency, but still a trust signal for company legitimacy.
- `/cookies` — GDPR/ePrivacy compliance requirement in EU/UK. A legal gap, not just a UX gap.

**Minimum fix:** Create stub pages for `/about` and `/contact` immediately. Redirect `/careers` to a "not currently hiring" message. Create `/cookies` with a real cookie policy.

---

### C2 — No CTA button in sticky header
**Impact: Conversion — affects every page at every scroll depth**

The desktop header contains: Sign In (text link) + theme toggle + hamburger icon. There is no conversion button visible at any scroll depth. Every competitor (Intercom, Tidio, Crisp, Drift) puts a high-contrast "Start Free" button permanently in the header.

**Fix:** Add `<Button>Start Free</Button>` to the header action row, next to Sign In.

---

### C3 — Homepage title targets the wrong keyword
**Impact: SEO — the primary entry point for all organic traffic**

Current title: `VocUI - Voice User Interface`

"Voice User Interface" is an accessibility/UX term for Alexa-style voice interaction. No one searching for an AI chatbot builder uses this phrase. It actively misleads Google about what the product is.

**Recommended title:** `AI Chatbot Builder | VocUI`
**Recommended description:** `Build AI-powered chatbots trained on your knowledge base. Deploy on your website, Slack, or Telegram in minutes. Free plan available.`

---

### C4 — No robots.txt or sitemap.xml
**Impact: SEO — crawlability of entire site**

Google has no authoritative URL list and no signal about which routes to ignore. Every authenticated dashboard, admin, widget, and embed route is crawlable by default. This wastes crawl budget and risks indexing pages that should never appear in search results.

**Fix:** Create `src/app/robots.ts` (disallow `/dashboard`, `/admin`, `/widget`, `/embed`, `/api`) and `src/app/sitemap.ts` (all current public pages).

---

### C5 — Five client-rendered pages have no metadata
**Impact: SEO — affects /pricing, /sdk, /wiki, /faq, /login**

These pages are `'use client'` components and cannot export metadata in Next.js. As a result, they inherit only the sparse root metadata (wrong title, no description). `/pricing` is the highest-intent page on the site and currently appears in Google with the title "VocUI - Voice User Interface."

**Fix:** Add a thin server component wrapper for each affected page that exports metadata, with the `'use client'` component as a child.

---

## UX Copy Audit

### HIGH Priority

**Issue 1 — FAQ "Tools" category has copy from a different product era**
Location: `/faq/faq-data.ts`

The Tools category reads as if VocUI were a general AI content-generation suite. Questions like "How accurate is the AI-generated content?" and "Can I customize the AI output?" describe a writing assistant, not a chatbot platform. Visitors reading this will be confused about what the product actually does.

*Rewrites:*
- "How accurate is the AI-generated content?" → "How accurate are my chatbot's answers?"
- "Can I customize the AI output?" → "Can I control how my chatbot responds?"
- "What tools are available?" → "What types of content can my chatbot be trained on?"

---

**Issue 2 — Footer "Company" column is a duplicate of "Resources"**
Location: `/components/ui/footer.tsx`

The Company column contains only "Help" and "FAQ" — both already appear in the Resources column. A visitor looking for "who is this company?" gets redirected to the FAQ. This actively erodes trust.

*Fix:* Remove the Company column until `/about` and `/contact` pages exist, then populate it properly.

---

**Issue 3 — Pricing page secondary CTA links to the wrong page**
Location: `/pricing/page.tsx`, bottom CTA section

"See How It Works" links to `/faq`. This is wrong — "See How It Works" should link to a product explainer, not a support page.

*Fix:* `<Link href="/#features">See Features</Link>` or `<Link href="/chatbot-booking">See It in Action</Link>`

---

### MEDIUM Priority

**Issue 4 — Homepage hero badge excludes core use cases**
Location: `/page.tsx`, hero section

Badge copy: "AI Customer Support, Done Right" frames VocUI as a support deflection tool only. The subheadline correctly names three outcomes (support, leads, bookings), but the badge signals only one.

*Options:*
- "AI Chatbot Platform"
- "Support, Leads, Bookings — Automated"
- Remove the badge entirely

---

**Issue 5 — Homepage testimonials section heading uses wrong product language**
Location: `/page.tsx`, testimonials section

"Teams shipping faster with VocUI" is developer/productivity tool language (Vercel, Linear, GitHub). VocUI helps teams respond faster to customers.

*Rewrites:*
- "What teams say about VocUI" (safe)
- "Support teams that reclaimed their time" (benefit-framed)

---

**Issue 6 — Homepage differentiator 3 is developer copy in a general-audience slot**
Location: `/page.tsx`, differentiators section (3rd card)

"See exactly where every millisecond goes" describes a RAG pipeline debugger. References to "retrieval, rerank, generation, fallback" will cause general audience visitors (SMB owners, support managers) to disengage. This feature belongs in `/sdk`, not the homepage hero differentiators.

*Suggested replacement:* Elevate the Sentiment & Loyalty Scoring feature:
- Headline: "Know when a conversation is going sideways — before it escalates"
- Body: "Per-visitor sentiment scoring flags high-risk conversations so your team can step in at the right moment."

---

**Issue 7 — CTA inconsistency between homepage and /chatbot-booking**
Homepage: "Build Your Chatbot Free"
Chatbot-booking: "Start Free Trial"
These describe different offers. The booking page also has conflicting copy — one button says "Start Free Trial" and the final CTA says "Build Your Booking Chatbot Free."

*Fix:* Decide on one offer and apply it consistently. If promoting the Pro trial on the booking page, use "Try Pro Free for 14 Days" throughout that page.

---

**Issue 8 — Help page overpromises with "comprehensive guides"**
Location: `/help/page.tsx`

"Browse our comprehensive guides and tutorials" — if the wiki is sparse, this creates a false expectation that damages trust more than saying nothing.

*Fix:* "Browse guides and tutorials for building and deploying your chatbot."
Button: Change "View" → "Browse Docs"

---

**Issue 9 — FAQ account answer mentions in-app chat that may not exist**
Location: `/faq/faq-data.ts`, account category

"You can reach our support team through the Help page, by emailing support@vocui.com, or using the in-app chat (Pro and Enterprise only)."

If no in-app chat widget is deployed, this creates a support ticket when Pro users can't find it.

*Fix:* Remove the in-app chat reference if the feature doesn't exist.

---

**Issue 10 — Pricing testimonials heading is unsubstantiated**
Location: `/pricing/page.tsx`

"Loved by professionals worldwide" — the actual testimonials show 3 people with initials. This claim is not backed up and reads as filler copy.

*Fix:* "What our users say" or "Real results from real teams"

---

### LOW Priority

**Issue 11 — Login page: "Sign Up" button doesn't match card title**
Card title says "Create an account" but the submit button says "Sign Up."
*Fix:* Change the signup button to "Create Account" to match.

**Issue 12 — Wiki empty state passes burden to the visitor**
"Check back soon" is passive. Route visitors elsewhere instead.
*Fix:* "Documentation is on its way. In the meantime, the FAQ covers the most common questions — or reach out and we'll help directly." Add buttons: "Browse FAQ" + "Contact Support"

**Issue 13 — Footer tech stack disclosure is off-brand**
"Built with Next.js, Tailwind CSS, and AI" at the bottom of every page is boilerplate that gives competitors information and reads as amateurish for a product positioned as "SOC 2-grade."
*Fix:* Remove, or replace with a value prop tagline.

---

## SEO Audit

### CRITICAL

**SEO-C1 — No robots.txt or sitemap** (see Critical Blockers C4)

**SEO-C2 — Homepage title targets wrong keyword** (see Critical Blockers C3)

**SEO-C3 — Five pages are client-rendered with no metadata** (see Critical Blockers C5)

---

### HIGH Priority

**SEO-H1 — No canonical URLs on most pages**

Only `/chatbot-booking` has `alternates: { canonical: '...' }`. Without canonicals, Google decides which URL variant is canonical — trailing slashes, query strings, and www. variations can all fragment link equity.

*Fix:* Add explicit canonical to all public pages: `/`, `/pricing`, `/faq`, `/help`, `/sdk`, `/wiki`, `/wiki/[slug]`, `/privacy`, `/terms`.

---

**SEO-H2 — /faq has FAQPage JSON-LD opportunity that is being missed**

The FAQ page has 24 questions with full text in `faq-data.ts` — exactly the data needed for `FAQPage` structured data. This makes VocUI eligible for FAQ rich results in SERP (expandable Q&A blocks under the listing). This is near-zero-effort schema.

*Fix:* Wire `faq-data.ts` into a JSON-LD `FAQPage` schema on `/faq`.

---

**SEO-H3 — Homepage missing Organization + SoftwareApplication JSON-LD**

No structured data on the homepage. Competitors with `Organization` schema (logo, social links, contact) and `SoftwareApplication` schema (name, category, pricing, rating) get richer SERP treatments and are better understood by Google's knowledge graph.

*Minimum for homepage:* `Organization` (name, url, logo, sameAs for Twitter/GitHub/LinkedIn) + `SoftwareApplication` (name, applicationCategory: "BusinessApplication", operatingSystem, offers with free tier).

---

**SEO-H4 — /pricing has no page-level metadata**

Highest commercial-intent page on the site. Currently inherits root title ("VocUI - Voice User Interface").

*Target keywords:* `AI chatbot pricing`, `chatbot builder pricing`, `AI chatbot free plan`
*Title:* `AI Chatbot Builder Pricing | VocUI`
*Description:* `Simple, transparent pricing for AI chatbot building. Free plan available. No credit card required. Compare plans and start building today.`

---

**SEO-H5 — /sdk page needs developer-targeted metadata**

Target keywords: `chatbot API`, `AI chatbot REST API`, `chatbot embed JavaScript`
*Title:* `Chatbot SDK & REST API Docs | VocUI`
*Description:* `Integrate VocUI chatbots into any website or app. JavaScript embed, REST API, and agent console SDK. Full documentation with code examples.`

---

**SEO-H6 — Three tier-1 landing pages are completely unbuilt**

These represent the highest search-demand keywords with direct product capability alignment:

| URL | Primary keywords | Why it matters |
|-----|-----------------|----------------|
| `/knowledge-base-chatbot` | "train chatbot on documents", "PDF chatbot", "knowledge base AI chatbot" | VocUI's core differentiator — no current page addresses this |
| `/chatbot-for-slack` | "Slack chatbot builder", "custom Slack bot", "AI Slack assistant" | Slack integration exists; dedicated page captures an entire search cluster |
| `/embeddable-chat-widget` | "embed chatbot on website", "website chat widget", "JavaScript chatbot widget" | Likely the primary deployment method — no dedicated page exists |

---

**SEO-H7 — /wiki and /wiki/[slug] have no metadata**

Wiki articles are potential long-tail SEO assets. Both are `'use client'` with no metadata. The `[slug]` page should use `generateMetadata()` pulling from article frontmatter.

---

### MEDIUM Priority

**SEO-M1 — /faq and /help metadata is too short**

| Page | Current title | Recommended title | Current desc chars | Target |
|------|--------------|-------------------|--------------------|--------|
| /faq | `FAQ \| VocUI` (11 chars) | `AI Chatbot FAQ — Billing, API & Credits \| VocUI` | 73 chars | 140-160 |
| /help | `Help & Support \| VocUI` (22 chars) | `Help Center & Support \| VocUI` | 80 chars | 140-160 |

**SEO-M2 — No BreadcrumbList schema on interior pages**
Breadcrumbs in SERP increase CTR. Pages with clear parent-child URL structure (`/wiki/[slug]`, `/faq`, `/chatbot-booking`) should have `BreadcrumbList` JSON-LD.

**SEO-M3 — Testimonials use initials-only attribution**
Google's quality guidelines (E-E-A-T) flag unverifiable social proof. Generic attribution like "E-commerce brand" reads as fabricated in quality reviews.

**SEO-M4 — /design-system and /coming-soon are publicly crawlable**
Internal/dev pages should have `robots: { index: false }` in their metadata.

**SEO-M5 — OG image asset exists for /tools but no /tools page exists**
`src/app/(public)/tools/opengraph-image.tsx` is an orphaned asset sending false signals to crawlers.

---

### LOW Priority

**SEO-L1 — Root OG tags are incomplete** — no `url`, `description`, or image at root level.
**SEO-L2 — Twitter card missing `site` handle** — add `site: '@vocui'` to root Twitter metadata.
**SEO-L3 — /signup has no metadata** — add `robots: { index: false }` explicitly.

---

### Keyword Target Map

**Bottom-of-funnel (build pages now):**

| Keyword | Monthly intent | Target page |
|---------|---------------|-------------|
| AI chatbot builder | High | Homepage |
| custom chatbot for website | High | Homepage / `/embeddable-chat-widget` (new) |
| knowledge base chatbot | High | `/knowledge-base-chatbot` (new) |
| train chatbot on documents | Medium | `/knowledge-base-chatbot` (new) |
| Slack chatbot builder | Medium | `/chatbot-for-slack` (new) |
| embed chatbot website | Medium | `/embeddable-chat-widget` (new) |
| AI appointment booking chatbot | Medium | `/chatbot-booking` (exists) |
| chatbot builder free | High | `/pricing` |

**Competitor comparison (high conversion, low competition):**
- "Tidio alternative" → `/alternatives/tidio`
- "Intercom alternative for small business" → `/vs-intercom`
- "no-code chatbot builder" → Homepage or new page

**Long-tail / high-intent:**
- "how to train a chatbot on my website" → `/wiki` or blog
- "chatbot that reads PDF" → `/knowledge-base-chatbot`
- "embed AI chat widget in React" → `/sdk`
- "AI chatbot for customer support small business" → Homepage or `/chatbot-for-small-business`

---

## CRO Audit

### HIGH Priority

**CRO-H1 — No persistent CTA button in the header** (see Critical Blockers C2)

Every scroll depth past the hero has no conversion entry point. Highest-impact single fix on the site.

---

**CRO-H2 — Hero is text-only; no product visual**

The hero is full-viewport-height but contains only text and two buttons. For a chat product, visitors need to see a conversation before they believe the copy. Showing the widget UI, a sample chat, or a 30-second demo video in the hero is the single biggest conversion lift available.

*Fix:* Convert hero to two-column layout (copy left, product mockup/video right).

---

**CRO-H3 — Testimonials appear before problem/solution framing**

Page order: Hero → Trust Bar → **Testimonials** → Differentiators → How It Works → Features → CTA

Social proof placed before desire has been created is wasted. The visitor has not yet been given a reason to care.

*Fix:* Move testimonials to after the Differentiators section. Add a brief problem-agitation section (3-4 lines naming the cost of the status quo) between the trust bar and differentiators.

---

**CRO-H4 — Social proof is not credible**

- Initials-only attribution (J.D., S.C., M.T.) pattern-matches to fabricated testimonials for skeptical B2B buyers
- Same 3 testimonials appear verbatim on both the homepage and pricing page — missed opportunity on pricing page to address ROI objections
- Zero aggregate social proof (no user count, conversation count, or review platform badge)
- No testimonials at all on `/chatbot-booking`

*Fixes:*
- Full first name + last initial + company name minimum on all testimonials
- Write pricing-specific testimonials addressing ROI ("it paid for itself in two weeks")
- Add a social proof counter to the hero: "X,XXX chatbots deployed" or "Join X teams"
- Add 1-2 vertical-specific testimonials to `/chatbot-booking`

---

**CRO-H5 — Pricing page: plans load from API with a spinner**

The pricing page is a client component that shows a spinner while fetching plans. This causes layout shift and risks abandonment before plans render. The highest commercial-intent page on the site has the worst perceived performance.

*Fix:* Server-render the pricing page with plans pre-fetched, or use `Suspense` with a correctly-sized skeleton.

---

**CRO-H6 — /about and /contact pages are 404s** (see Critical Blockers C1)

For any B2B buyer doing pre-purchase due diligence, a missing About page signals the product may be abandoned. A missing Contact page signals no support or sales process exists.

---

### MEDIUM Priority

**CRO-M1 — Hero secondary CTA "See Pricing" sends warm traffic away early**

A visitor who clicks "See Pricing" before engaging with differentiators or social proof is not ready to buy — they're looking for reasons to leave.

*Better secondary CTA:* "See How It Works" (anchor down-page) or "Watch a Demo" (reduces uncertainty without leaving the funnel).

---

**CRO-M2 — Features Grid (9 items) has no in-context CTA**

A visitor excited by a specific feature (Sentiment Scoring, Lead Capture) has no way to act on that in context — they must scroll past the entire grid.

*Fix:* Add a single CTA button at the bottom of the features grid.

---

**CRO-M3 — Free plan CTA button uses `variant="ghost"` on pricing page**

The ghost variant renders as a plain text link. Risk-averse visitors who want to try before paying can barely see their path. The free tier is the primary entry point.

*Fix:* Change to `variant="outline"` — visible border, lower weight than paid plan CTAs.

---

**CRO-M4 — Annual savings not surfaced prominently on pricing cards**

The only "Save 20%" callout is on the billing toggle — individual plan cards don't show a clear "2 months free" or "$XX saved/year" badge. The saving should be impossible to miss.

---

**CRO-M5 — Enterprise plan sends visitors to the generic help form**

Enterprise buyers who want to talk to sales should not land at a generic contact form. Sends the wrong signal about organizational readiness for enterprise deals.

*Fix:* Dedicated `/contact?type=enterprise` page or Calendly meeting link.

---

**CRO-M6 — Missing conversion elements across the site**

| Element | Priority | Notes |
|---------|----------|-------|
| Product demo video (30–60 sec) | High | Single biggest uncertainty reducer for a chat product |
| Interactive sandbox / "try it" widget | High | Let visitors type a question without signing up — removes the "does it actually work?" objection |
| VocUI's own chatbot deployed on vocui.com | High | Best product demo is the product itself. A chatbot trained on VocUI's FAQ, answering questions on the marketing site, is proof of concept for every visitor |
| Exit intent email capture | Medium | "Get the 5-minute chatbot setup checklist" — collects email before bounce |
| ROI calculator | Medium | "How many support hours could a chatbot save?" — strong for mid-market buyers justifying budget |
| Case studies / customer stories | Medium | /chatbot-booking is the right template — build 2-3 more |

---

**CRO-M7 — Mobile CTA is below 50% of viewport on small phones**

The hero uses `min-h-[calc(100vh-4rem)]` with centered content. On mobile (375px), CTAs may be below the halfway point. Also, stacked CTAs on mobile can result in accidental taps on the secondary button.

*Fix:* Consider a mobile-only sticky bottom bar CTA that appears after scrolling past the hero.

---

### Recommended A/B Tests (in priority order)

| # | Test | Primary Metric |
|---|------|---------------|
| 1 | Header CTA button vs. none (current) | Signup CVR from homepage |
| 2 | Hero: text-only vs. text + product screenshot | Hero CTA CTR |
| 3 | Hero H1 variant: "Deploy a support chatbot in under an hour — trained on your own knowledge base" | Hero CTA CTR |
| 4 | Hero secondary CTA: "See Pricing" vs. "See How It Works" | Overall signup CVR |
| 5 | Testimonials: initials vs. full name + company | Scroll depth past social proof |
| 6 | Pricing: server-rendered vs. client-fetched (current) | Pricing page engagement + CTA CTR |
| 7 | Pricing Pro CTA: "Start Free Trial" vs. "Start Free — Upgrade Anytime" | Pro plan CTA CTR |
| 8 | Interactive demo on homepage vs. no widget | Signup CVR + time on page |

---

## Business & Positioning Audit

### Positioning Gaps

**The three primary outcomes promised on the homepage lack landing pages for two of them.**

Homepage subheadline: "deflects support tickets, captures leads, and books appointments"

- Appointments: `/chatbot-booking` ✅
- Support tickets: No dedicated page ❌
- Lead capture: No dedicated page ❌

This is the single most important strategic gap. Completing the use-case set also gives VocUI defensible SEO positions in searches where it can win without competing against Intercom's domain authority.

---

**Competitive differentiation is underemphasized.**

VocUI has features that direct competitors don't: in-chat appointment booking, knowledge-base-trained RAG chatbot, performance telemetry/waterfall charts, live agent handoff via SDK. None of the homepage differentiator copy explicitly names what competitors don't do.

*Add language like:* "Most chatbot tools stop at Q&A. VocUI handles the booking, too."

---

**ICP (Ideal Customer Profile) is unclear on the homepage.**

The homepage is written for a broad audience. The `/chatbot-booking` page correctly targets Healthcare, Legal, Beauty, and Coaching — but the homepage makes no similar signal. A visitor can't self-identify as the target customer.

*Fix:* Add a "Who it's for" section on the homepage, or add industry-specific case study callouts that let visitors self-select their vertical.

---

**"SOC 2-grade infrastructure" is the weakest trust claim on the site.**

The word "grade" reads as aspirational, not certified. If SOC 2 Type II is complete, say "SOC 2 Type II certified." If it is in progress, say "SOC 2 in progress." A `/security` page anchoring this claim with specifics (encryption at rest, data residency, GDPR compliance) is required for healthcare and legal verticals.

---

**Credit math inconsistency on pricing page.**

Pricing cards show `~X chatbot conversations/month` but the FAQ answer for "What are credits?" shows different math. Any inconsistency in billing copy at the point of purchase decision creates abandonment.

*Fix:* Reconcile the credit-to-conversation ratio across cards and FAQ. Add a concrete example: "A 500-conversation/month support site typically uses 1,000–1,500 credits."

---

**Zero third-party social proof.**

The site has no G2, Capterra, Product Hunt, or review platform badge. Every direct competitor has them. Even a single badge with a rating adds significant credibility during B2B evaluation.

---

## Landing Page Copy Recommendations

### Homepage Hero — Alternative Variants to Test

**Current:** "Stop answering the same questions twice."

**Variant A (time-to-value focused):**
> Deploy a support chatbot in under an hour — trained on your own knowledge base.

**Variant B (outcome-specific, loss framing):**
> Your support team is answering 70% of questions a chatbot could handle.

**Variant C (credibility-first):**
> The AI chatbot that reads your docs, books appointments, and hands off to humans — without stitching together three tools.

---

### Trust Bar Copy Improvements

**Current 4 signals:** No credit card required | 14-day money-back guarantee | Deploy in under an hour | SOC 2-grade infrastructure

**Issue:** "Deploy in under an hour" is a UVP claim, not a trust signal. "SOC 2-grade" reads as aspirational.

**Recommended replacement set:**
- No credit card required
- 14-day money-back guarantee
- SOC 2 Type II certified (if true) / Your data is never used to train AI models
- Deployed by X,XXX teams (if data available)

---

### Differentiator Copy Rewrites (Benefits-First)

**Current Differentiator 3:** "See exactly where every millisecond goes"
*This belongs in `/sdk`, not the homepage.*

**Replacement: Sentiment & Loyalty Scoring**
> Headline: "Know when a conversation is going sideways — before it escalates"
> Body: "Per-visitor sentiment scoring flags high-risk conversations so your team can step in at the right moment. Loyalty scores help you identify your most engaged visitors."

---

**Current Differentiator 2:** "Live agent handoff that fits how your team already works"
*Good headline. Weak body.*
> Current: "When the chatbot can't answer, your team gets a dedicated console to take over—no third-party tools required."
> Rewrite: "When a visitor needs a human, your team gets a dedicated handoff console — without Intercom, Zendesk, or any third-party tool. Your agents pick up exactly where the chatbot left off."

---

### Features Grid — Sample Rewrites (Benefits-First)

| Current | Rewrite |
|---------|---------|
| "Proactive Messaging" | "Engage visitors before they leave — trigger messages based on scroll depth, time on page, or URL" |
| "Sentiment & Loyalty Scoring" | "Know which visitors are frustrated (and which are loyal) — score every conversation automatically" |
| "Train on Anything" | "Upload your PDFs, paste your URLs, add your FAQs — your chatbot learns from all of it" |
| "Authenticated Context" | "Give logged-in users answers their own account data can answer — not just generic FAQ responses" |
| "20+ Languages" | "Your chatbot understands and responds in the language your visitor is already using" |

---

### Missing Page Copy Recommendations

**Recommended /about page:**
> VocUI is a chatbot platform for businesses that are tired of answering the same questions manually. We built VocUI because the tools that exist either require an engineering team or cost enterprise prices — there was no straightforward option for a support team or small business to build a chatbot that actually knew their product.
>
> VocUI lets you upload your docs, paste your URLs, and have a working chatbot live on your website in under an hour. It books appointments, captures leads, and hands off to a human when needed — all from one platform.

**Recommended /contact page minimum:**
- Heading: "Get in touch"
- Support email: support@vocui.com (with "We respond within 24 hours")
- Sales inquiry form for Enterprise plan interest
- Links to /faq and /help for self-service

---

### Additional FAQ Topics Missing

1. "How is VocUI different from ChatGPT or Claude?" — This is the primary awareness objection. Without an answer, visitors with this question bounce.
2. "Can I try VocUI before entering payment information?" — Even though the free plan exists, this question should be explicitly answered.
3. "What happens to my data?" — GDPR-aware visitors (all EU visitors) will look for this. It should not require reading the full privacy policy.
4. "Can I white-label the chatbot for my clients?" — Relevant for the agency/consultant buyer segment.
5. "Does VocUI work with my existing knowledge base software?" — Addresses the "but I already have Notion/Confluence/Guru" objection.

---

## Additional Landing Pages Roadmap

### Phase 1 — Immediate (conversion-critical, feature exists)

| URL | Target keywords | Business value |
|-----|----------------|----------------|
| `/about` | (Brand) | Trust-critical; blocks B2B conversions today |
| `/contact` | (Brand) | Trust-critical; blocks enterprise qualification |
| `/security` | "GDPR chatbot", "secure AI chatbot" | Required for healthcare/legal verticals |
| `/chatbot-for-customer-support` | "AI customer support chatbot", "automated support chatbot" | Table-stakes category page; highest search volume |
| `/chatbot-for-lead-capture` | "AI lead capture chatbot", "chatbot to collect leads" | Closes the "three outcomes" gap on the homepage |
| `/ai-knowledge-base-chatbot` | "train chatbot on documents", "PDF chatbot" | Core VocUI differentiator; currently no dedicated page |
| `/train-chatbot-on-pdf` | "train AI on PDF", "chatbot that reads PDF" | High-intent specific search; maps to core feature |
| `/changelog` | (Product) | Signals active development; reduces "is this abandoned?" churn concern |

---

### Phase 2 — Short-term (vertical + comparison pages)

| URL | Target keywords | Notes |
|-----|----------------|-------|
| `/chatbot-for-lawyers` | "AI chatbot for law firms", "legal intake chatbot" | High LTV vertical; booking + FAQ angle |
| `/chatbot-for-healthcare` | "healthcare chatbot", "patient intake chatbot" | Booking is the core pitch; HIPAA awareness copy needed |
| `/chatbot-for-real-estate` | "real estate chatbot", "AI lead capture real estate" | High CPL industry; lead capture + booking |
| `/chatbot-for-ecommerce` | "ecommerce chatbot", "AI chatbot for online store" | Massive search volume; product FAQ + support deflection |
| `/slack-chatbot` | "AI chatbot for Slack", "Slack bot trained on documents" | Integration exists; captures distinct search cluster |
| `/vs-intercom` | "Intercom alternative for small business" | High-intent comparison; price/value win for VocUI |
| `/vs-tidio` | "Tidio alternative" | Direct competitor; same buyer profile |
| `/live-agent-handoff` | "chatbot with human handoff" | Differentiates from pure-AI tools |

---

### Phase 3 — Medium-term (breadth, comparison, content)

| URL | Target keywords | Notes |
|-----|----------------|-------|
| `/chatbot-for-coaches` | "chatbot for coaching business" | Booking + FAQ; solo operator audience |
| `/chatbot-for-saas` | "SaaS customer support chatbot" | Requires strong differentiation from Intercom |
| `/vs-drift`, `/vs-crisp`, `/vs-calendly` | Comparison queries | VocUI's booking + chat in one tool is unique vs. Calendly |
| `/sentiment-analysis` | "chatbot sentiment analysis" | Differentiator feature; appeals to CX managers |
| `/multilingual-chatbot` | "multilingual chatbot", "chatbot in Spanish" | Opens international traffic |
| `/chatbot-customization` | "white label chatbot", "custom branded chatbot" | Agency/reseller segment |
| `/customers` or `/case-studies` | (Brand) | Needs at least 2 real case studies |

---

### Blog Content Pillars

**Pillar 1: How to automate [business task]** (top of funnel)
- "How to automate appointment booking with an AI chatbot"
- "How to answer customer FAQs automatically without hiring support staff"
- "How to capture leads from your website while you sleep"
- "How to train an AI chatbot on your own documents"

**Pillar 2: Industry guides** (middle of funnel)
- "The complete guide to AI chatbots for law firms"
- "How healthcare providers use AI to reduce no-shows"
- "The SMB owner's guide to customer service automation"

**Pillar 3: Comparisons and buyer guides** (bottom of funnel)
- "Best AI chatbot builders for small businesses in 2026"
- "Intercom vs Tidio vs VocUI: which chatbot platform is right for you?"
- "Do I need a chatbot or a booking tool? (Or both?)"
- "How much does an AI chatbot cost? Full breakdown for SMBs"

**Pillar 4: Product education** (retention + SEO)
- "How to write a system prompt for your business chatbot"
- "How to measure chatbot ROI: metrics that actually matter"
- "When to use live agent handoff vs. automated responses"

**Cluster strategy:** Each vertical landing page becomes a hub with 3-5 supporting blog posts linking back to it. Example:
- Hub: `/chatbot-for-lawyers`
- Spokes: "AI chatbot for legal intake", "How to automate client FAQ responses at a law firm", "GDPR-compliant chatbots for legal practices"

---

## Implementation Roadmap

### Sprint 1 — Unblock conversions (1-2 days of dev work)

1. Add persistent "Start Free" CTA button to sticky header
2. Fix homepage title tag: `AI Chatbot Builder | VocUI`
3. Create `src/app/robots.ts` and `src/app/sitemap.ts`
4. Create stub `/about` page (2 paragraphs + team info)
5. Create stub `/contact` page (email + basic form)
6. Fix footer Company column (remove duplicate links)
7. Fix FAQ Tools category copy (3 question rewrites)
8. Fix pricing secondary CTA link (`/faq` → `/#features` or `/chatbot-booking`)
9. Remove dead nav links (`/about`, `/contact`, `/careers`, `/cookies`) until pages exist (or create stubs)

### Sprint 2 — SEO infrastructure (2-3 days)

10. Add server component metadata wrappers for `/pricing`, `/sdk`, `/wiki`, `/faq`
11. Add canonical URLs to all public pages
12. Add FAQPage JSON-LD to `/faq`
13. Add Organization + SoftwareApplication JSON-LD to homepage
14. Add `robots: { index: false }` to `/design-system` and `/coming-soon`
15. Fix or remove orphaned `/tools` OG image asset

### Sprint 3 — Conversion improvements (3-5 days)

16. Add product visual (screenshot or video) to homepage hero
17. Reorder homepage sections: move testimonials after differentiators
18. Rewrite homepage differentiator 3 (replace waterfall telemetry with sentiment scoring)
19. Add aggregate social proof to hero (user/chatbot count)
20. Create `/security` page
21. Fix pricing page spinner (server-render or Suspense skeleton)
22. Update testimonial attribution (full name + company)
23. Deploy VocUI's own chatbot on the marketing site

### Sprint 4 — Landing page expansion (1-2 weeks)

24. `/chatbot-for-customer-support` (use `/chatbot-booking` as template)
25. `/chatbot-for-lead-capture`
26. `/ai-knowledge-base-chatbot` / `/train-chatbot-on-pdf`
27. `/slack-chatbot`
28. `/changelog`
29. Begin vertical pages: `/chatbot-for-lawyers`, `/chatbot-for-healthcare`

### Sprint 5 — SEO content (ongoing)

30. Start comparison pages: `/vs-intercom`, `/vs-tidio`
31. Vertical landing pages: `/chatbot-for-real-estate`, `/chatbot-for-ecommerce`
32. Begin blog pillar content (1 post per pillar per week)
33. Set up G2/Capterra review collection

---

*Audit produced by: ux-copywriter, seo-content-engineer, cro-landing-page-architect, conversion-landing-page, chatbot-biz-analyst, business-analyst agents — 2026-03-30*
