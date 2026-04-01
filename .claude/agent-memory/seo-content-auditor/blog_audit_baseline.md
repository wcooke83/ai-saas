---
name: Blog SEO Audit Baseline (March 2026)
description: Blog audit status after remediation -- 52 active posts, all critical issues resolved, remaining gaps are images and author bio
type: project
---

Blog re-audit completed 2026-03-31: 52 active posts + 3 redirect stubs.

**Why:** All critical HCU risk patterns from the original audit have been remediated. Overall risk is LOW.

**How to apply:** When creating new blog posts or editing existing ones, follow the patterns established during remediation:

Current state (post-remediation):
- 52/52 posts have AuthorByline (Will Cooke, Founder at VocUI) + Person author in JSON-LD
- 52/52 posts have visible <time> dates + datePublished/dateModified in JSON-LD
- 7 CTA variants deployed by category (comparison, guide, explainer, use case, industry, strategy, best practice)
- 10 industry posts fully differentiated (unique sections, opening angles, FAQs, content types)
- 6 comparison posts differentiated (unique table columns, editorial disclosures, VocUI limitations)
- 4 embed guides deduplicated (platform-specific troubleshooting and FAQs)
- 3 redirects active (what-is-a-system-prompt, automate-repetitive-customer-questions, chatbot-for-lead-qualification)
- ~80 external citations across 30 posts (Gartner, McKinsey, Userpilot, Inside Higher Ed, etc.)
- 10 explainer posts have /pricing links removed
- 37 remaining posts link to /pricing in contextually appropriate locations

Remaining gaps:
- 0/52 posts have images or screenshots (MEDIUM priority)
- No author bio section beyond name/title (LOW priority)
- 3 redirect stubs use Next.js redirect() (307) instead of permanentRedirect() (301) (LOW priority)
- "Join 1,000+ businesses" tagline repeated in 23 posts (LOW risk)

Full re-audit report: /blog-seo-reaudit.md
