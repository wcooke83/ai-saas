---
name: Tooltip Usage Conventions
description: Rules for when to add, remove, or keep InfoTooltip/Tooltip in chatbot settings UI
type: feedback
---

Remove tooltips when:
- The label is self-explanatory (e.g. "Submit Button Text", "Form Title", "Files Per Message")
- A `<p>` description element nearby says the same thing
- The card `<CardDescription>` already covers it
- The tooltip just restates the label in a longer form

Keep tooltips when:
- The field has non-obvious consequences (e.g. "Session Duration" affects memory history behaviour)
- Numerical inputs need range guidance (e.g. Temperature, Max Response Length, Live Fetch Threshold)
- Technical setup fields need step-by-step context (e.g. Telegram Bot Token, Chat ID, Webhook Secret)
- A toggle has a side effect that isn't stated nearby (e.g. Handoff Inactivity Timeout — AI resumes)
- A field's behaviour depends on another setting being enabled

**Why:** Reviewed chatbots/[id]/settings/page.tsx — found ~10 tooltips duplicating nearby description text, creating noise without adding value.

**How to apply:** Before adding a tooltip, check if a `<p className="text-xs text-secondary-500">` or `<CardDescription>` already explains the field. If so, skip the tooltip.
