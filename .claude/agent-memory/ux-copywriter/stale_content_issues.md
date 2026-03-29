---
name: Stale Content From Removed Features
description: Resolved — pricing/FAQ/testimonial copy updated after Email Writer and other tools were removed
type: project
---

As of commit f95f376, the following AI tools were removed: Email Writer, Blog Writer, Social Post, Ad Copy, Meeting Notes, Email Sequence, Proposal Generator.

**Resolved in pricing/page.tsx and faq/faq-data.ts (March 2026):**
- Testimonials: replaced fabricated company names (Davidson Marketing Co., TechStart Inc., Nexus Digital) with initials + role + industry type (e.g., "J.D., Marketing Director, E-commerce brand")
- Credit FAQ: replaced vague "1-3 credits" with concrete examples (simple answer ~1 credit, detailed response 2–3, 10-message conversation 5–15 total)
- Credit context on plan cards: replaced static "~50/~500 conversations" with dynamic calculation (`credits / 2`)
- Hero description: removed "access to our core tools" (stale multi-tool language)
- CTA headline: changed "Ready to boost your productivity?" to "Build your first chatbot today"

**Remaining to verify:**
- Footer "Tools" link to /tools — may point to empty or removed page

**Why:** Users seeing features or companies that don't exist erodes trust. Concrete credit examples reduce plan confusion.

**How to apply:** When editing pricing, FAQ, or marketing copy, verify all feature references match the current product (custom chatbots only). Credit context should reference chatbot conversations.
