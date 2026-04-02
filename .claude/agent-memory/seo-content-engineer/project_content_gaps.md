---
name: Content gaps & landing pages
description: Landing pages created, keywords targeted, content gaps remaining for VocUI SEO
type: project
---

## Pages created (with full metadata)

### /chatbot-booking
- File: `src/app/(public)/chatbot-booking/page.tsx`
- Primary keywords: "AI chatbot appointment booking", "chatbot scheduling"
- Schema: `SoftwareApplication`

### /slack-chatbot
- File: `src/app/(public)/slack-chatbot/page.tsx`
- Primary keywords: "AI chatbot for Slack", "Slack bot trained on documents"
- Schema: `SoftwareApplication` with `featureList` and `offers`
- Note: title too long (69 chars), needs shortening

### /vs-intercom
- File: `src/app/(public)/vs-intercom/page.tsx`
- Primary keywords: "VocUI vs Intercom", "Intercom alternative"
- Schema: `WebPage` + `BreadcrumbList`
- Note: title too long (69 chars), no FAQ section, no cross-link to /vs-tidio

### /vs-tidio
- File: `src/app/(public)/vs-tidio/page.tsx`
- Primary keywords: "VocUI vs Tidio", "Tidio alternative"
- Schema: `WebPage` + `BreadcrumbList`
- Note: description too long (168 chars), no FAQ section, no cross-link to /vs-intercom

### /solutions
- File: `src/app/(public)/solutions/page.tsx`
- Hub page linking to use-case and industry pages
- Note: card titles use `<p>` not `<h3>`; "Website Widget" card links to /chatbot-booking incorrectly

### /about, /contact, /security, /changelog, /sitemap
- All exist under `src/app/(public)/`
- `/about` and `/contact` have incomplete metadata (see audit in project_seo_patterns.md)

## Homepage keywords already targeted

The homepage targets: AI customer support, knowledge base chatbot, chatbot builder, embeddable widget, Slack chatbot, lead capture, support ticketing.

## Missing FAQ sections (high-value schema opportunity)

These pages should add FAQ sections with `FAQPage` JSON-LD:
- `/vs-intercom`: "Is VocUI better than Intercom?", "Does Intercom have a free plan?", etc.
- `/vs-tidio`: "Is VocUI better than Tidio?", "Can Tidio train on documents?", etc.
- `/slack-chatbot`: "Does VocUI work with free Slack plans?", "How is this different from Slack AI?", etc.

## Missing internal link opportunities

1. `/vs-intercom` <-> `/vs-tidio` cross-links
2. `/slack-chatbot` -> `/solutions`
3. `/changelog` entries -> respective feature landing pages
4. `/about` -> `/pricing`, `/solutions`
5. `/security` -> `/privacy`, `/terms`

## Keyword gaps / recommended pages still to create

High priority:
- `/knowledge-base-chatbot` — may already exist (in sitemap.xml), verify
- `/embeddable-chat-widget` — "website chat widget", "embed chatbot on website"

Medium priority:
- `/chatbot-for-saas` — B2B SaaS support deflection

## Blog posts (specced, created 2026-03-31)

1. `/blog/how-to-add-chatbot-to-website`
2. `/blog/how-to-train-chatbot-on-your-own-data`
3. `/blog/chatbase-alternatives`
4. `/blog/how-to-reduce-customer-support-tickets`
5. `/blog/what-is-a-knowledge-base-chatbot`

## Industry blog posts (created 2026-04-02)

New posts targeting high-traffic industry verticals. Each includes full metadata, JSON-LD (Article + FAQPage + BreadcrumbList), `ChatPreview`, `IndustryStatBar`, `StyledBulletList` components, a Related industry guides block, and a CTA. Each also linked from the corresponding industry landing page via a "Related reading" block.

1. `/blog/chatbot-for-restaurants` — already existed (old content: menus/hours/reservations)
2. `/blog/chatbot-for-real-estate` — NEW: qualifying buyers, viewing bookings, vendor leads
3. `/blog/chatbot-for-healthcare` — NEW: admin FAQ, clinical boundary, GDPR, appointment booking
4. `/blog/chatbot-for-hr` — NEW: policy FAQ, onboarding, Slack deployment, multi-site policies
5. `/blog/chatbot-for-plumbers` — NEW: emergency vs routine, after-hours lead capture, pricing FAQ
6. `/blog/chatbot-for-ecommerce` — NEW: ticket deflection, pre-purchase questions, returns FAQ
7. `/blog/chatbot-for-hotels` — NEW: pre-arrival FAQ, international guests, group bookings

Industry pages updated with "Related reading" blocks:
- `/chatbot-for-restaurants` — already had block (pointing to `/blog/chatbot-for-restaurants`)
- `/chatbot-for-real-estate` — added
- `/chatbot-for-healthcare` — added (inserted before author attribution block)
- `/chatbot-for-hr` — added
- `/chatbot-for-plumbers` — added
- `/chatbot-for-ecommerce` — added
- `/chatbot-for-hotels` — added

Blog index (`/blog/page.tsx`) updated: 6 new posts added in "Batch 3b" section.
