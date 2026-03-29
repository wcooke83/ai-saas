---
name: OnboardingChecklist server-backed state
description: widgetReviewed step migrated from localStorage to server-side widgetReviewedAt prop
type: project
---

`OnboardingChecklist` now accepts `widgetReviewedAt: string | null` prop from the server.

- `!!widgetReviewedAt` drives the `widgetReviewed` step completion
- On mount: if localStorage says reviewed but server prop is null, calls `POST /api/chatbots/[id]/widget-reviewed` to sync, then sets local state true
- localStorage write for widget-reviewed removed; read kept only for backwards compat sync
- `chatbot.widget_reviewed_at ?? null` passed from `src/app/(authenticated)/dashboard/chatbots/[id]/page.tsx`
- API route: `src/app/api/chatbots/[id]/widget-reviewed/route.ts` — sets field, requires auth

**Why:** localStorage breaks across browsers and devices. Server-backed state survives session changes.
