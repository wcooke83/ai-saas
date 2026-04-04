---
name: Full Site SEO Audit April 2026
description: Comprehensive 142-page audit completed 2026-04-04; 6 critical, 9 high, 11 medium, 8 low issues; full report at /home/wcooke/projects/ai-saas/seo-full-audit.md
type: project
---

Full audit of 142 public pages completed 2026-04-04. Report written to `/home/wcooke/projects/ai-saas/seo-full-audit.md`.

**Scope:** 54 industry landing pages, 56 blog posts, 32 other public pages.

**Critical issues found (6):**

1. `/chatbot-for-fitness-studios` deleted but still in sitemap (both as industry page AND as blog entry in Batch 4) — `sitemap.ts` lines 29 and 243
2. `/pricing/page.tsx` has zero metadata — falls back to root title "VocUI - Voice User Interface"
3. `/guides/page.tsx` is only a redirect with no metadata/noindex
4. Homepage `/page.tsx` has no page-level metadata (uses root layout fallback)
5. Root Organization schema has `sameAs: []` — empty array is worse than omitting the field
6. 3 blog posts (nonprofits, restaurants, travel-agencies) in sitemap BUT their canonical points to landing page — contradictory signals; 2 others resolved by this finding

**High issues found (9):**

- 44 of 54 industry pages missing author attribution (was 45, now confirmed 44 after checking all pages)
- All homepage and page testimonials anonymous (J.D., S.C., M.T. initials only)
- ~12 B2B compressed pages (logistics, wholesale, manufacturers) share structural boilerplate — HCU pattern risk
- Blog hotels page deleted without redirect; landing page exists; check GSC for indexation
- 5 blog "How to" posts missing from sitemap (chatbot-for-ecommerce, -healthcare, -hr, -plumbers, -real-estate as blog slugs)
- Alternatives cluster cannibalization: guides/chatbot-alternatives keywords include Tidio/Intercom alternatives (same as blog spokes)
- Login/signup/forgot-password/reset-password pages have no metadata and are indexable
- chatbot-booking page missing robots directive and has OG vs meta description mismatch
- /features page not in sitemap

**Key structural decisions validated:**
- Blog posts that canonical → landing page but are NOT in sitemap (ecommerce, healthcare, hr, plumbers, real-estate) — this is the correct pattern
- vs-intercom and vs-tidio do NOT cannibalize blog alternatives posts (different intent: branded comparison vs. list)
- Knowledge base chatbot cluster (landing + guide + blog posts) is well-structured
- /guides sub-pages (knowledge-base-chatbot, embed-chatbot, chatbot-for-business, chatbot-alternatives) are correctly in sitemap

**Why:** Full-scope audit had not been done across non-industry sections of the site. Prior audits focused on blog and industry pages individually.

**How to apply:** Use seo-full-audit.md as the definitive issues list. Work through "Immediate" actions first (5 items). Do not re-audit what's already confirmed fixed.
