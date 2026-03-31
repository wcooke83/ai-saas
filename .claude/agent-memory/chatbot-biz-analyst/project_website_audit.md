---
name: VocUI Website Audit Findings
description: Public-facing website structural and positioning audit from March 2026
type: project
---

**Audit scope:** Homepage, /pricing, /chatbot-booking, /faq, /help, /sdk, header nav, footer — March 2026.

## Critical structural issues
- /about, /contact, /careers, /cookies are linked in the header nav but do not exist (404)
- Footer Company section shows only Help + FAQ — no About or Contact
- Enterprise CTA routes to /help?subject=enterprise (support form), not a dedicated sales path

## Trust signal gaps
- No third-party review platform (G2, Capterra, Product Hunt) badges or links anywhere
- "SOC 2-grade infrastructure" claim has no supporting /security page — "grade" is not "certified"
- No status page or uptime signal in footer or trust bar
- Testimonials are anonymized (J.D., S.C., M.T.) — an improvement but still weak vs. named customers

## Pricing page issues
- Credit math is inconsistent: pricing cards use credits/2 to calculate conversations; FAQ says 1-3 credits per conversation; these contradict
- No use-case context under plan names (buyers don't know which plan covers calendar booking, API access, etc.)
- Features shown in plan cards are dynamically loaded from DB — plan feature keys not in toolConfig or featureDisplayNames appear raw (e.g., "Priority Support" vs "priority_support")

## Homepage positioning
- Three-card differentiator section (booking, agent handoff, telemetry) is well-chosen and correctly primary
- Telemetry card leads with implementation detail ("Firefox-style waterfall") not buyer outcome — needs rewrite for non-technical audience
- Supporting features section headline ("Everything the platform behind it needs") is defensive, not positioning
- No ICP segmentation — three buyer profiles (support, service biz, marketing) addressed equally with no self-selection mechanism
- 20+ languages buried in position 8 of 9 in supporting features grid — should be elevated for international segment

## Navigation structure
- Primary nav: Docs, Pricing, SDK, FAQ (minimal, correct)
- Hamburger menu: Product, Resources, Company, Legal — Company links to 404s
- No "Features" or "Use Cases" nav item — chatbot-booking only discoverable via hamburger Product section
- Header CTA logic: "Get Started" for logged-out, "Dashboard" for logged-in — correct

## Footer issues
- "Built with Next.js, Tailwind CSS, and AI" in footer bottom bar — remove or replace with something that signals quality, not stack
- Footer tagline "Build custom AI chatbots trained on your content. Deploy on your website, Slack, or Telegram." is weaker than homepage hero — missed reinforcement opportunity
- Social links (Twitter, GitHub, LinkedIn) present — unverified if these accounts are active

## /chatbot-booking page
- Well-executed: problem framing, how it works, 6 features, 4 vertical callouts, JSON-LD structured data
- Best competitive contrast line on the entire site: "Not just a chat window on top of a Calendly link"
- Should be the exact template for /chatbot-support and /chatbot-lead-capture
- Easy!Appointments named without explanation — buyers unfamiliar with it may perceive as a limitation

## Missing vertical landing pages (SEO + conversion priority)
1. /chatbot-support — support deflection for SaaS/SMB (highest priority, matches homepage primary use case)
2. /chatbot-lead-capture — lead gen + qualification for marketing buyers
3. /chatbot-for-slack — internal tooling use case; distinct market from customer-facing bots
4. /alternatives — comparison pages targeting "chatbase alternative" etc. search intent

**Why:** Comprehensive website audit conducted March 2026 to assess conversion, trust, and positioning gaps.

**How to apply:** Reference when advising on copy changes, new pages, or trust signal improvements. Dead links and credit math are always the first two action items to raise.
