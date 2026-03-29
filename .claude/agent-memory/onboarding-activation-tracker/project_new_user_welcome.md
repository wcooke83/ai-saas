---
name: New user zero-state dashboard
description: Dashboard shows NewUserWelcome when chatbotCount === 0
type: project
---

`src/app/(authenticated)/dashboard/page.tsx` now queries chatbot count alongside other dashboard data. When `chatbotCount === 0`, renders `<NewUserWelcome />` instead of the full stats dashboard.

Component: `src/components/dashboard/new-user-welcome.tsx` — server component, no 'use client'.

**Why:** New users with no chatbots see metrics that mean nothing (zero credits used, zero generations). The welcome state gives them a single clear action: create their first chatbot.
