---
name: Testimonial Copy Conventions
description: When/how to use placeholder testimonials vs. the Before/Setup/After pattern on industry landing pages
type: feedback
---

## Placeholder testimonials (pricing/marketing pages)

Do not use full names + specific company names for testimonials unless they are real, verified customers.

**Why:** Generic company names like "Davidson Marketing Co." or "TechStart Inc." collapse trust if a prospect Googles them and finds nothing.

**Approved format:** Initials + role + industry type
- Author: "J.D." (initials only)
- Role: "Marketing Director" (job title)
- Company: "E-commerce brand" (industry descriptor, not a name)

**Quote style:** Specific, outcome-focused, first-person. Include a concrete detail (time saved, metric, specific feature used). Avoid superlatives like "transformed" or "revolutionary" — they read as fabricated.

## Before / Setup / After (industry landing pages — preferred replacement)

Anonymous testimonial sections on industry pages (`/chatbot-for-[industry]/`) should be replaced with a 3-card "Before / Setup / After" section. This is verifiable copy that shows a realistic use case without requiring a real customer quote.

**Section heading:** "A typical week, before and after VocUI"
**Badge:** "How [industry] businesses use VocUI"

**Card structure:**
- `Before` — industry-specific pain: what staff did manually before VocUI
- `Setup` — what they uploaded (service menu, FAQ PDF, pricing page, etc.) and how quickly
- `After` — concrete outcome (reduced calls, captured after-hours leads, pre-qualified enquiries)

**JSX pattern:** Uses a `.map()` over a `step/text` array into cards with `text-xs font-semibold uppercase tracking-widest text-primary-600` step label. No external quote marks, no attribution.

**How to apply:** When an industry page has a `"From a [X] using VocUI"` badge with an anonymous initial attribution (e.g. "J.M. — Owner, ..."), replace the whole testimonial section with the Before/Setup/After pattern. Applied to: veterinarians, web-design-agencies, wedding-venues, wholesale, yoga-studios (April 2026).
