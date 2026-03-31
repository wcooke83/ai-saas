---
name: VocUI Project Context
description: Core product details, conversion goals, page inventory, CRO audit findings, and homepage section structure
type: project
---

VocUI is an AI-powered chatbot builder SaaS. Primary conversion goal: free signup (no CC required). Paid plans: Free, Base, Pro (featured), Enterprise.

**Why:** Free-to-paid funnel. The platform competes on: in-chat appointment booking (Easy!Appointments), live agent handoff via embeddable SDK, and RAG performance telemetry (waterfall chart).

**Public pages confirmed (2026-03-31):**
- `/` — Homepage (audited and rewritten 2026-03-31 — see section order below)
- `/pricing` — Loads plans dynamically from `/api/plans`. Has monthly/yearly toggle, plan cards, collapsible feature comparison, FAQ accordion, testimonials, final CTA.
- `/chatbot-booking` — Dedicated landing page for appointment booking vertical
- `/faq`, `/wiki`, `/sdk`, `/help`, `/signup`, `/login`, `/privacy`, `/terms`, `/security`

**Missing pages referenced in nav but not yet built:** `/about`, `/contact`, `/careers`, `/cookies`, `/changelog`, `/solutions`

**Homepage section order (post-audit, 2026-03-31):**
1. Hero — outcome-first headline ("Cut support tickets by 70%"), primary CTA, widget mockup
2. Trust bar — 4 signals (no CC, 14-day guarantee, deploy <1hr, SOC2)
3. Problem agitation — 3 pain cards (repetitive questions / after-hours leads / escalations)
4. Differentiators ("Built different") — 3 feature cards: in-chat booking, live agent handoff, sentiment scoring
5. How It Works — 3 numbered steps + CTA with risk reversal line
6. Testimonials (reframed as "early access / illustrative") — moved after How It Works
7. Supporting Features Grid — 9 tiles, headline changed to "Replace five tools with one"
8. Final CTA — complexity/speed objection addressed ("under an hour, no developers needed")

**CRO changes made 2026-03-31:**
- Hero headline rewritten from abstract ("Stop answering the same questions twice") to outcome-specific ("Cut support tickets by 70%")
- Problem agitation section added (was missing entirely — no pain validation before solution)
- Section order corrected: How It Works moved before testimonials (product comprehension before trust)
- Testimonials reframed with disclosure: "Illustrative feedback from early access users. Full case studies coming at launch." — prevents fake-testimonial perception pre-launch
- Differentiator section headline changed from vague ("earn its place on your stack") to competitive-contrast ("Most chatbots stop at Q&A. VocUI handles the full conversation.")
- Features grid headline changed from vague ("Everything the platform behind it needs") to specific ("Replace five tools with one.")
- Final CTA subtext replaced: was repeating hero outcomes; now addresses implementation complexity objection (#1 barrier at bottom-of-page stage)
- Mid-page CTA (How It Works) gained a risk reversal line: "No credit card required. Your first chatbot is live in under an hour."
- Hero trust line expanded: added "Upgrade when you're ready" to complete the no-risk framing

**Testimonials:** Only 3 (J.D., S.C., M.T.) — initials-only, no full names, no photos. Now disclosed as illustrative/early access. Same 3 testimonials exist on pricing page (not yet updated to match disclosure framing).

**Header nav (desktop):** Has "Start Free" button in the persistent header bar (not hamburger-gated). Memory note about hamburger-gating was stale — confirmed corrected 2026-03-31.

**Pre-existing TypeScript errors (not introduced by homepage changes):**
- `src/app/(authenticated)/dashboard/usage/page.tsx` — missing Shield import
- `src/app/(public)/security/page.tsx` — SecurityItem type mismatch on icon prop
- `src/app/api/calendar/setup/route.ts` — EAWorkingPlan type mismatch
- `src/lib/chatbots/integrations/slack.ts` — redeclare + missing properties
- `tests/integration/auto-credit-topup.test.ts` — variable used before assigned

**How to apply:** When auditing other pages (especially /pricing), align testimonial disclosure framing with homepage. When the product launches, replace testimonial section with real case studies — the structure is ready.
