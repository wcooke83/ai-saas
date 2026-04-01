---
name: Onboarding wizard project
description: New-user onboarding wizard for VocUI -- 4-step guided flow that bypasses the dashboard sidebar layout. Plan written 2026-03-31.
type: project
---

Building a 4-step onboarding wizard (Create, Train, Style, Deploy) for first-time VocUI users.

**Why:** Audit found steep cognitive load cliff after chatbot creation -- users go from a clean 3-step wizard to a full dashboard with 16 nav items and 20+ customization controls. Drop-off is highest between creation and first knowledge source.

**How to apply:** The wizard lives at `/onboarding/{chatbotId}/step/{1-4}` under `(authenticated)/(onboarding)` route group to bypass the dashboard sidebar. Progress is tracked server-side via `chatbots.onboarding_step` column. Full plan at `/home/wcooke/projects/vocui/onboarding-wizard-plan.md`.
