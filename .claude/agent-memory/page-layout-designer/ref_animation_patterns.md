---
name: Animation patterns
description: Framer Motion conventions used in VocUI: variants, viewport settings, useReducedMotion, stagger timing
type: reference
---

## Standard variants
```ts
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};
```

For more dramatic entrances (large headings, full-bleed sections): `y: 32`, `duration: 0.55`
For tighter stagger grids (3-column belief cards): `staggerChildren: 0.13`

## Viewport settings
Always: `viewport={{ once: true, margin: '-80px' }}`
The `-80px` margin fires the animation slightly before the element reaches the viewport edge.

## Reduced motion
Always import and check `useReducedMotion` from framer-motion:
```ts
const prefersReducedMotion = useReducedMotion();
// Then on initial prop:
initial={prefersReducedMotion ? false : 'hidden'}
```
Setting `initial={false}` skips the animation entirely when reduced motion is preferred.

## Section label pattern
Small caps label above a section heading:
```tsx
<p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-500 mb-6">
  Section label
</p>
```
On dark backgrounds: `text-primary-400`
On light backgrounds: `text-primary-500`
Always animate with `fadeUp` as first child in a stagger container.

## What to animate
- Section labels and display headings: fadeUp
- Editorial paragraphs: fadeUp (as part of stagger group)
- Grid items (cards, belief panels): stagger container + fadeUp per child
- CTA buttons group: fadeUp as final child in stagger

## What NOT to animate
- Navigation (Header)
- Above-the-fold hero content
- Inline body text within prose
- Anything that causes layout shift
