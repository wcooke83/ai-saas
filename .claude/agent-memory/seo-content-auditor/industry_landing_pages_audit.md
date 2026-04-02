---
name: Industry Landing Pages Audit
description: Full SEO audit of all 56 chatbot-for-* industry landing pages; critical issues, cannibalization map, and priority fix order (2026-04-02)
type: project
---

56 industry landing pages live under `src/app/(public)/chatbot-for-*/page.tsx`. Full audit written to `/home/ubuntu/projects/vocui/seo-audit-industries.md` on 2026-04-02.

**Why:** Pages are generally well-differentiated in body content but have three structural issues creating HCU/E-E-A-T risk at scale.

**Critical issues to fix first:**

1. **Templated FAQPage JSON-LD across all 56 pages** — Questions 2–5 are byte-for-byte identical across the entire set (only industry noun swapped). Answers contain `--` double-hyphens instead of em dashes. This is structured data abuse per Google's own FAQPage guidelines and risks rich result suppression domain-wide. Fix: replace with industry-specific questions per page, or remove the schema entirely until rewritten.

2. **41 pages have unverifiable anonymous testimonials** — Attributed only as "J.M. — Owner, Downtown Dental Practice" format. No full name, no URL, no photo. Fix: source verified customer quotes with full attribution, or remove testimonials and replace with concrete case walkthroughs.

3. **Gyms/Fitness Studios/Yoga Studios cannibalization** — Three pages target near-identical intent with 4/6 identical feature names, same pain point structure, and overlapping keyword arrays. Fix: consolidate fitness-studios + yoga-studios into gyms (301 redirect), or radically differentiate each.

**High issues:**
- Accountants + Accountancy Firms: near-duplicate pair, same buyer, recommend consolidation
- Mortgage Brokers + Mortgage Lenders: overlapping keyword sets, differentiate or consolidate
- 2 pages missing `robots` meta tag: `/chatbot-for-customer-support` and `/chatbot-for-lead-capture`
- `--` grammar defect in all FAQ structured data (fix alongside critical issue 1)

**Medium issues:**
- No author attribution or dates on any page (YMYL-adjacent pages most at risk: lawyers, therapists, pharmacies, healthcare, financial-advisors)
- 39 of 56 pages have no related blog post link
- 15 pages have no testimonial at all (ecommerce, healthcare, real-estate are highest-value missing)

**How to apply:** When working on any industry page in this set, check: (1) Does it have unique FAQ structured data? (2) Does it have a verifiable testimonial? (3) Is it part of a cannibalization cluster? Reference the audit file for the full cannibalization map and priority fix order.
