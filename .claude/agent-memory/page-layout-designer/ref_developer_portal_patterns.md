---
name: Developer portal / docs page patterns
description: Design conventions established for the /sdk developer docs page — code block styling, section structure, sidebar nav, method tabs
type: reference
---

## Code block style (CodeBlock component)
Dark terminal aesthetic: `bg-[#0d1117]` (GitHub dark) for code area, `bg-[#161b22]` for chrome bar.
Chrome bar has: colored language dot, language label (uppercase mono), always-visible copy button.
Copy button transitions between idle (white/5 bg) and copied (emerald-500/20 bg) states.
Border: `border border-white/10`, rounded-xl, shadow-lg.
Code text: `text-[#e6edf3]` (GitHub dark foreground), `text-[13px]` mono.

## Language dot colors
- html → bg-orange-400
- tsx → bg-sky-400
- javascript → bg-yellow-400
- bash → bg-emerald-400
- http → bg-violet-400

## Section structure (docs layout)
Grid: `lg:grid-cols-[200px_1fr] xl:grid-cols-[220px_1fr]` with `gap-10 lg:gap-16`
Sections divided by `<hr className="border-secondary-200 dark:border-secondary-800">` (SectionDivider)
Each section: `py-14 space-y-8` (not py-20+ — this is a reading flow, not a marketing page)
scroll-mt-28 on all section/sub-section anchors

## Section heading pattern (docs)
1. SectionLabel — colored small-caps above: `text-[11px] font-semibold uppercase tracking-[0.18em]`
2. h2 — `text-2xl font-bold` (smaller than marketing pages — 2xl not 4xl)
3. p — `text-[15px] text-secondary-500` body

## Method tabs (MethodTab component)
Pill-style with left icon, accent color per section:
- primary → sky/blue (Widget Embed, Quick Start)
- emerald → REST API
- orange → Agent Console
Inactive: `border-secondary-200` neutral. Active: `bg-{accent}/10 text-{accent} border-{accent}/40`

## Sidebar nav active indicator
Uses `border-l-2` colored left border instead of background pill.
Active border colors per group: primary-500 / emerald-500 / orange-500 / violet-500
Group labels: `text-[10px] font-bold uppercase tracking-[0.16em]` colored when group is active.
Indent child items: `lg:ml-2` (not pl-5)

## Hero for developer pages
Full-bleed dark: `bg-[#0a0f1a]` (slightly lighter than primary-950 for contrast)
Integration method pills below headline — clickable, scroll-jump shortcuts
Badge: rounded-full with icon, `border border-primary-500/20 bg-primary-500/10`

## Endpoint display pattern (REST API)
Single-row flex bar with: POST badge (emerald) | monospace URL | copy icon button
All in one `rounded-xl border overflow-hidden` with alternating bg sections
No full CodeBlock — just a display row for the URL

## Webhook event list pattern
Inline list inside `rounded-xl border overflow-hidden` (no table)
Event name: `px-2.5 py-1 rounded-md bg-violet-50 dark:bg-violet-900/20 border border-violet-100` pill
Divider: `border-b border-secondary-100 dark:border-secondary-800/60` on non-last rows

## Collapsible advanced section pattern
Trigger is full-width button with icon + title + badge + ChevronDown (rotates 180 on open)
Expanded content separated by `border-t border-secondary-200`
Used for "Authenticated Users" which is advanced/less-common content
