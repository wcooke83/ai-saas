---
name: SEO Audit 2026-03-30
description: Full SEO audit findings, keyword opportunities, and content gap analysis for VocUI
type: project
---

## Key findings summary

- NO robots.txt or sitemap.xml — critical crawlability gap
- 5 public pages are `'use client'` components with no metadata export: /pricing, /sdk, /wiki, /wiki/[slug], /login
- Canonical URLs only on /chatbot-booking; all other pages missing
- Homepage title targets "Voice User Interface" — wrong keyword (low commercial intent, confusing brand signal)
- OG image defined for /tools but /tools page does not exist (orphaned asset)
- 4 nav-linked pages are 404: /about, /contact, /careers, /cookies
- /faq has no FAQPage JSON-LD despite full structured FAQ data available
- /pricing is 'use client' — cannot export metadata; needs server wrapper
- Schema markup only on 1 of 10+ pages

## Priority action order

1. robots.txt + sitemap.ts (Critical — without these, crawlers are flying blind)
2. Homepage metadata rewrite (Critical — "Voice User Interface" targets zero searches)
3. Wrap pricing/sdk/wiki pages to enable metadata (High)
4. Add canonical to all pages (High)
5. FAQPage JSON-LD on /faq (High — immediate rich result opportunity)
6. Organization JSON-LD on homepage (High)
7. Fix dead nav links or redirect them (High)
8. New landing pages: /knowledge-base-chatbot, /chatbot-for-slack, /embeddable-chat-widget (High)
9. WebPage JSON-LD on remaining pages (Medium)
10. Keyword expansion via vertical pages (Medium)

**Why:** sitemap/robots gap = search engines may not be indexing all pages reliably
**How to apply:** address Critical items before any new page creation
