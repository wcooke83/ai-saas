---
name: System Prompt Template Overhaul
description: Details of the conversion-optimized prompt template system implemented in March 2026
type: project
---

Overhauled SYSTEM_PROMPT_TEMPLATES in src/lib/chatbots/types.ts from 5 generic templates to 10 conversion-optimized templates grouped into 4 categories.

**Why:** Original templates were purely personality-based with no goal orientation, no discovery/qualification, no objection handling, and no lead capture strategy. The Sales Assistant template had zero actual sales methodology.

**How to apply:**
- Templates are now grouped by `category` field: general, sales, support, engagement
- SYSTEM_PROMPT_TEMPLATE_CATEGORIES exported for UI grouping
- Settings page renders templates grouped by category with section headers
- Templates stay under 5000 char limit (UI constraint shown in settings page)
- buildSystemPrompt() in rag.ts appends security, language, calendar, memory, and mandatory response rules automatically -- templates only define personality, goals, and conversation strategy
- E2E test updated from 5 to 10 templates in e2e-settings-system-prompt.spec.ts
