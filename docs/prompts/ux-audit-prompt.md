# UX/UI Full Code Audit Prompt

You are conducting a comprehensive UI/UX code audit of a Next.js 15 AI SaaS application. This is a full-stack app with public marketing pages, authenticated dashboard, embeddable tools, a chat widget, and an admin panel.

## Scope

Audit ALL of the following page groups and component directories. For each, read the actual source code, then evaluate against the criteria below.

### Page Groups to Audit

**Public Pages:**
- Landing page: src/app/(public)/page.tsx
- Pricing: src/app/(public)/pricing/page.tsx
- Login/Signup: src/app/(public)/login/page.tsx, src/app/(public)/signup/page.tsx
- Tools landing + individual tools: src/app/(public)/tools/page.tsx and all subdirectories
- Help, FAQ, Wiki, Privacy, Terms pages

**Authenticated Dashboard:**
- Main dashboard: src/app/(authenticated)/dashboard/page.tsx
- Chatbot management: src/app/(authenticated)/dashboard/chatbots/ (all pages including [id]/ subpages: knowledge, settings, deploy, customize, analytics, conversations, leads, tickets, contact, articles, calendar, sentiment, surveys, issues, performance)
- Billing/Upgrade: src/app/(authenticated)/dashboard/billing/page.tsx, upgrade/page.tsx
- Settings/Profile: src/app/(authenticated)/dashboard/settings/page.tsx, profile/page.tsx
- API Keys, Usage, Integrations, Wiki pages

**Admin Panel:**
- src/app/(admin)/admin/ — all pages (logs, plans, credits, ai-config, trials)

**Embeddable Tools:**
- src/app/embed/ — all tool pages

**Widget:**
- src/app/widget/[chatbotId]/page.tsx
- src/components/widget/ChatWidget.tsx and all widget components

**Agent Console:**
- src/app/agent-console/[chatbotId]/page.tsx
- src/components/agent-console/ components

### Component Library to Audit
- src/components/ui/ — all shared UI primitives
- src/components/tools/ — tool-specific components
- src/components/dashboard/ — dashboard components
- src/components/layout/ — header, navigation
- src/components/leads/, surveys/, calendar/, performance/, chatbots/, wiki/

## Evaluation Criteria

For each page/component, evaluate:

### 1. Visual Hierarchy & Layout
- Is the information hierarchy clear? Do headings, spacing, and grouping guide the eye?
- Is whitespace used effectively or is it cramped/wasteful?
- Are page layouts consistent across similar page types?
- Do card layouts, tables, and lists align to a grid?

### 2. Navigation & Information Architecture
- Is the dashboard sidebar/subnav logical and scalable?
- Can users find features without guessing? Are there dead ends?
- Is the chatbot sub-navigation (knowledge, settings, deploy, customize, analytics, etc.) overwhelming or well-organized?
- Are breadcrumbs and page titles consistent?

### 3. Interaction Design & Feedback
- Do forms provide clear validation states (error, success, loading)?
- Are loading states present for async operations (AI generation, data fetches)?
- Do destructive actions (delete chatbot, remove knowledge source) have confirmation dialogs?
- Is there clear feedback after actions (toasts, inline messages)?
- Are empty states handled (no chatbots yet, no conversations, no knowledge sources)?

### 4. Responsive Design
- Do pages work on mobile viewports (375px)?
- Do tables/data-heavy pages have mobile alternatives (cards, stacked layouts)?
- Is the chat widget responsive in iframe embeds?
- Does the dashboard collapse gracefully on tablet?

### 5. Accessibility (WCAG 2.1 AA)
- Color contrast ratios on text, buttons, badges
- Keyboard navigation: can all interactive elements be reached via Tab?
- Focus indicators visible on all interactive elements?
- Form labels properly associated with inputs?
- ARIA attributes on custom components (dialogs, tooltips, dropdowns, tabs)?
- Screen reader support: are decorative icons hidden? Do images have alt text?

### 6. Design Consistency
- Are colors, spacing, typography, and border-radius consistent with a design system?
- Do similar components (cards, tables, forms) look the same across pages?
- Are button styles (primary, secondary, destructive, ghost) used consistently?
- Is dark mode fully supported or are there visual glitches?

### 7. User Flow Friction Points
- Onboarding: Is the path from signup → first chatbot → first deployment clear?
- Is the upgrade/billing flow intuitive?
- Can users easily test their chatbot before deploying?
- Are error recovery paths clear (failed knowledge ingestion, API key issues)?

### 8. Component Quality
- Are components properly typed with TypeScript?
- Do components handle edge cases (long text, missing data, error states)?
- Are there hardcoded strings that should be configurable?
- Is there prop drilling that should be refactored?

## Output Format

Produce a structured report organized by severity:

### CRITICAL (Blocks users or causes data loss)
- [Page/Component] — Issue — Recommended fix

### HIGH (Major UX friction, accessibility violations)
- [Page/Component] — Issue — Recommended fix

### MEDIUM (Inconsistencies, polish issues)
- [Page/Component] — Issue — Recommended fix

### LOW (Nice-to-have improvements)
- [Page/Component] — Issue — Recommended fix

### POSITIVE PATTERNS (What's working well — preserve these)
- [Pattern] — Where used — Why it works

End with a prioritized action plan: the top 10 highest-impact changes ranked by effort vs. impact.

IMPORTANT: Actually read the source code of every file. Do not speculate. Base every finding on specific code you've seen. Include file paths and line numbers for every finding.
