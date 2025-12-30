# UI/UX Designer Skill

Generate, review, and improve UI/UX designs for AI SaaS products.

## Trigger
`/ui-ux-designer` or `/design`

## Arguments
- `action`: `review` | `palette` | `guidelines` | `improve`
- `target`: file path, component name, or niche description

## Actions

### `review` - Review existing UI
Analyzes a component or page for:
- Color contrast and accessibility (WCAG AA)
- Typography hierarchy and readability
- Spacing consistency
- Interactive element sizing (min 44px touch targets)
- Visual hierarchy and focus flow
- Mobile responsiveness patterns

### `palette` - Generate color palette for niche
Creates a custom color palette based on:
- Industry/niche psychology (e.g., finance = trust/blue, health = calm/green)
- Competitor analysis patterns
- Accessibility requirements
- Light/dark mode considerations

### `guidelines` - Update design system
Modifies `src/styles/design-system.ts` with:
- Custom color schemes
- Typography adjustments
- Component pattern updates

### `improve` - Suggest UI improvements
Provides actionable improvements for:
- Conversion optimization (CTAs, forms)
- User flow simplification
- Visual polish and modern aesthetics
- Animation/interaction enhancements

## Design System Reference
Always reference: `src/styles/design-system.ts`

## Instructions

When invoked, follow these steps:

1. **Read the design system**: Always start by reading `src/styles/design-system.ts` to understand current tokens

2. **For `review` action**:
   - Read the target file(s)
   - Check color usage against design system
   - Verify spacing uses design tokens
   - Check typography hierarchy
   - Assess accessibility (contrast, focus states, aria labels)
   - Output specific line-by-line improvements

3. **For `palette` action**:
   - Research color psychology for the niche
   - Generate primary, secondary, accent colors
   - Ensure WCAG AA contrast ratios
   - Provide both light and dark variants
   - Output as design system format ready to copy

4. **For `guidelines` action**:
   - Read current design system
   - Apply requested changes
   - Maintain TypeScript types
   - Update Tailwind config mapping

5. **For `improve` action**:
   - Analyze current implementation
   - Reference modern SaaS design patterns
   - Suggest shadcn/ui components to use
   - Provide Framer Motion animation suggestions
   - Output code snippets for improvements

## Output Format

Always output:
1. Brief assessment (2-3 sentences)
2. Specific recommendations with code
3. Priority ranking (P0 = critical, P1 = important, P2 = nice-to-have)

## Example Usage

```
/design review src/components/PricingCard.tsx
/design palette "AI email writer for real estate agents"
/design guidelines --primary "#6366f1" --accent "#f43f5e"
/design improve src/app/page.tsx
```

## Niche Color Psychology Reference

| Niche | Primary Vibe | Suggested Colors |
|-------|--------------|------------------|
| Finance/Legal | Trust, Security | Blues, Navy, Gold accents |
| Health/Wellness | Calm, Natural | Greens, Teals, Soft whites |
| Tech/SaaS | Modern, Clean | Blues, Purples, Gradients |
| Creative/Design | Bold, Expressive | Vibrant purples, pinks, oranges |
| E-commerce | Action, Energy | Oranges, Reds, High contrast |
| Education | Friendly, Approachable | Warm blues, Yellows, Greens |
| Real Estate | Professional, Premium | Navy, Gold, Warm neutrals |

## Accessibility Checklist

- [ ] Color contrast ratio >= 4.5:1 for normal text
- [ ] Color contrast ratio >= 3:1 for large text
- [ ] Interactive elements have visible focus states
- [ ] Touch targets minimum 44x44px
- [ ] Color is not the only indicator of state
- [ ] Animations respect prefers-reduced-motion
- [ ] Text is scalable without breaking layout
