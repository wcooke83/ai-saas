---
name: Layout conventions
description: Section padding, container widths, full-bleed patterns, and grid splits established across VocUI public pages
type: reference
---

## Container
Standard: `container mx-auto px-4 sm:px-6 lg:px-8`
Narrow (editorial copy): add `max-w-3xl` — use sparingly, mostly for blog/prose
Full-bleed: `w-full` on the section, container inside for content

## Section padding
- Standard content section: `py-20 lg:py-28`
- Important/feature section: `py-24 lg:py-32`
- Compact/dense: `py-12 lg:py-16`

## Full-bleed sections
For color-break sections (dark, tinted), always use `w-full` on the section element with no container constraint at section level. Put container inside.

## Asymmetric grids (12-column)
- Editorial label + copy: `grid-cols-12` with `col-span-3` (label) + `col-span-9` (body)
- Feature side-by-side: `col-span-5` / `col-span-7`
- Equal thirds: `grid-cols-3` (desktop), stack to `grid-cols-1` on mobile

## Section rhythm established on /about
1. Hero (SplashHero) — full-bleed, animated waveform bg
2. Intro (AboutIntro) — `bg-secondary-50 dark:bg-secondary-900`, asymmetric 3/9 col grid, large editorial text
3. Beliefs (AboutBeliefs) — `bg-primary-950` full-bleed dark, 3-column grid with `gap-px bg-primary-800/40` divider pattern
4. CTA (AboutCta) — inline gradient style `135deg primary-600 → primary-950`, full-bleed, centered

## Visual rhythm rule
Never use same background two sections in a row. The about page sequence: transparent/hero → secondary-50 → primary-950 → gradient creates clear visual turns.
