---
name: Header nav structure
description: How VocUI's Header menu works and the correct way to add new nav links
type: project
---

The `Header` component (`src/components/layout/Header.tsx`) is a `'use client'` component. It has no inline nav links — navigation lives entirely in a hamburger menu overlay.

## Menu structure

Links are defined in the `menuLinks` const object with four sections: `product`, `resources`, `company`, `legal`.

To add a new public page to the nav, add an entry to `menuLinks.product` (or another section if more appropriate):

```ts
const menuLinks = {
  product: [
    { label: 'Appointment Booking', href: '/chatbot-booking' },
    { label: 'Pricing', href: '/pricing' },
    ...
  ],
  ...
};
```

## Current product links (as of 2026-03-29)

- Appointment Booking → /chatbot-booking
- Pricing → /pricing
- SDK → /sdk
- Dashboard → /dashboard

## Notes

- No top-level nav links are shown in the header bar itself — only Logo, Sign In/Dashboard, theme toggle, and hamburger button
- Do not add a Solutions or Use Cases dropdown — the header layout does not support it without a larger refactor
- The `navItems` prop on `<Header>` is accepted but only used to render a different set of links in the mobile view (it's overridden by the hamburger menu pattern in practice — the `menuLinks` const is what renders in the overlay)
