---
name: Credit Alert Copy Conventions
description: Tone, structure, and patterns for credit usage alerts (banners, emails, sidebar) at 75% and 90% thresholds
type: project
---

Credit alert system copy was written for two thresholds. Key conventions established:

- 75% tone: informational, calm, proactive — "still running fine, just a heads-up"
- 90% tone: noticeably more urgent but not alarmist — name the exact consequence (chatbots go offline)
- Always name both fixes: enable auto-topup AND buy credits manually
- Never use exclamation marks in alert copy
- Dismiss link at 75%: "Remind me later" | at 90%: "I'll handle it later" (slightly more friction to reflect urgency)
- CTA at 75%: "Add Credits" | at 90%: "Add Credits Now" (urgency marker is "Now", not a new verb)
- Email billing link: https://vocui.com/dashboard/billing
- Sidebar label: "Credits" (short) | Sidebar tooltip: "Credits remaining this billing period"

**Why:** Chatbot downtime is the core consequence users care about — always make it explicit at 90%. At 75%, frame as a courtesy notice to preserve trust without crying wolf.

**How to apply:** Use this precedent for any future threshold-based alert copy (e.g., knowledge source limits, API rate limits). Escalating urgency via word choice ("now") rather than punctuation or caps.
