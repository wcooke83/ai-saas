---
name: VocUI color tokens
description: Primary/secondary color scale values, semantic usage, and CSS variable names used across the VocUI design system
type: reference
---

CSS variables are defined in `src/app/globals.css` as RGB triplets (no `rgb()` wrapper), used like `rgb(var(--primary-500))`.

## Primary scale (sky blue → deep ocean)
- `primary-50`: 240 249 255 — light tint backgrounds
- `primary-100`: 224 242 254
- `primary-200`: 186 230 253
- `primary-300`: 125 211 252
- `primary-400`: 56 189 248
- `primary-500`: 14 165 233 — brand accent, icon color, link color
- `primary-600`: 2 132 199 — button default bg, darker accent
- `primary-700`: 3 105 161
- `primary-800`: 7 89 133
- `primary-900`: 12 74 110
- `primary-950`: 8 47 73 — deep ocean, used for full-bleed dark sections

## Secondary scale (slate/neutral)
- `secondary-50`: 248 250 252 — near-white page bg
- `secondary-100`: 241 245 249
- `secondary-200`: 226 232 240 — borders
- `secondary-300`: 203 213 225
- `secondary-400`: 148 163 184
- `secondary-500`: 100 116 139 — muted text
- `secondary-600`: 71 85 105 — body text (light mode)
- `secondary-700`: 51 65 85
- `secondary-800`: 30 41 59
- `secondary-900`: 15 23 42 — near-black, primary text
- `secondary-950`: 2 6 23 — deepest dark

## Semantic usage
- Full-bleed dark section: `bg-primary-950` (deep ocean)
- Light section bg: `bg-secondary-50 dark:bg-secondary-900`
- Gradient CTA: `from-primary-600 to-primary-800` or inline style `135deg, rgb(2,132,199) → rgb(8,47,73)`
- Section label text: `text-primary-400` (on dark) / `text-primary-500` (on light)
- Body text light mode: `text-secondary-600 dark:text-secondary-400`
- Display text on dark: `text-white` or `text-primary-200/70` for muted
