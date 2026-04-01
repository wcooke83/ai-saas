---
name: VocUI animation patterns
description: Canvas animation component location, design tokens, and conventions used in VocUI hero section
type: project
---

HeroWaveform canvas component lives at `src/components/ui/hero-waveform.tsx`. It is consumed by `src/components/ui/splash-hero.tsx`, inserted as the first child of the `<section>` before the content div.

**Why:** VocUI brand is voice/chatbot — the animation metaphor is sonar/voice ripple pulses (expanding circular rings), representing a signal sent when someone speaks or sends a message.

**Current animation:** Sonar ring pulses. 6–10 pulses active at all times, each expanding from a random (x, y) over 4–6s. Sky-blue stroke, opacity fades from 0.12 to 0 as radius grows, stroke thins from 1px to 0.5px. 1-in-3 pulses emit a smaller inner ring with a ~0.15 lifecycle delay. Pulses seed staggered on init so canvas isn't empty at load. `performance.now()`-based timing via `requestAnimationFrame` for frame-rate independence. `prefers-reduced-motion` renders a single frozen frame, no loop.

**How to apply:** Any future hero or landing section that needs ambient motion should reuse or extend `HeroWaveform`. The component is self-sizing via `ResizeObserver` and handles retina DPR scaling internally. Primary animation color is `rgb(14, 165, 233)` (Tailwind `sky-500`, mapped to `primary-500` in this project). Max ring radius is 35% of the larger canvas dimension.
