---
name: VocUI Activation Funnel Audit
description: Signup-to-first-deployment funnel analysis: drop-off points, barriers, and prioritised recommendations (audited 2026-03-31)
type: project
---

Funnel: CTA click → /login?mode=signup → /dashboard/chatbots (empty) → /new wizard → /knowledge → /deploy

**Why:** Pre-launch SaaS. Activation = first chatbot deployed (published). Non-technical target users (small business owners, support leads). VP is "deployed in under an hour."

**Confirmed funnel facts from code:**
- /signup is a redirect to /login?mode=signup — no dedicated page, same Card component handles both modes
- Welcome email fires on signup (custom /api/auth/signup → Resend) — but no in-app onboarding
- Empty dashboard: one CTA button, no checklist, no welcome state, no progress indicator
- Wizard Step 2 (system prompt) pre-selects SYSTEM_PROMPT_TEMPLATES[0] by default — NOT a blank field; has smart recommended-template logic based on chatbot name
- After chatbot creation, router pushes to /knowledge — correct handoff
- Knowledge page has NO next-step prompt after adding sources — dead end before deploy
- Deploy page: publish toggle is a banner CTA, not a separate page step — less friction than expected
- Dashboard sidebar: no contextual progress tracking, no "complete setup" nudge
- No onboarding checklist exists anywhere in the codebase

**Highest-risk drop-offs (prioritised):**
1. Knowledge page — no "You're done, deploy it" CTA after adding sources
2. Empty dashboard — no momentum builder, just one button
3. /signup redirect — context loss, but low impact because the UI handles mode=signup correctly
4. System prompt step — lower risk than assumed; template is pre-selected and recommended

**How to apply:** When building onboarding improvements, focus on (1) knowledge → deploy handoff, (2) empty state momentum, (3) post-signup welcome flow. System prompt step is medium risk only, not the killer.
