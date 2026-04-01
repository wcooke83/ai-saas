---
name: Server component isolation pattern
description: How to keep page.tsx as an RSC while extracting animated sections into 'use client' components co-located in the same directory
type: reference
---

## The pattern
`page.tsx` stays a server component (no `'use client'`, imports metadata, does data fetching).
Animated sections become separate `'use client'` files co-located in the same route directory.

## File naming convention for about page
```
src/app/(public)/about/
  page.tsx          ← server component, imports client sections
  about-intro.tsx   ← 'use client', Framer Motion, asymmetric intro section
  about-beliefs.tsx ← 'use client', Framer Motion, full-bleed beliefs section  
  about-cta.tsx     ← 'use client', Framer Motion, gradient CTA section
```

## Rules
- Never import `motion` from `framer-motion` in a server component file — it will break the build
- Never import `useReducedMotion` or any React hook in a server component
- The client wrapper component should only contain the section it animates — keep them granular
- page.tsx imports the client components like any other component; Next.js handles the RSC/client boundary automatically

## Why co-locate (not in src/components/)
These sections are page-specific and have no reuse across other pages. Keeping them in the route directory makes the relationship obvious and avoids polluting shared component directories with one-off sections.
