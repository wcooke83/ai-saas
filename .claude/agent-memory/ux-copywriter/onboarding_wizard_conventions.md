---
name: Onboarding Wizard Copy Conventions
description: Copy patterns, structure, and approved strings from the 5-step VocUI onboarding wizard
type: project
---

The 5-step onboarding wizard uses the following confirmed conventions:

**Step structure:**
- Progress label format: "Step N of 5" (text, not dots) — sits above the headline
- Top-right escape hatch: "Skip setup" (not "Skip onboarding")
- Back button: "Back"

**Step headlines:**
1. "What will your chatbot do?"
2. "Name your chatbot"
3. "Teach your chatbot what to know"
4. "Try it out"
5. "Put your chatbot to work"

**Use case labels (4 options):**
- Customer Support / Lead Generation / Internal Knowledge Base / Something else
- Note: the fourth option is "Something else" (not "Other" or "Other / Something else")

**Pre-filled chatbot names by use case:**
- Customer Support → "Support Bot"
- Lead Generation → "Sales Assistant"
- Internal Knowledge Base → "Team Assistant"
- Something else → "My Assistant"

**Knowledge source types:** "Website or URL" / "PDF or Document" / "Paste text"
- Never say "training data" — say "content"
- Processing message: "Reading your content... Your chatbot will be ready to test in about 30 seconds."
- Skip link: "Skip for now — I'll add content later"

**Step 4 test UI:**
- "Looks good — continue" (primary), "My answers aren't right" (link)
- Good-answer feedback: "Your chatbot found that answer from your content. It's working."
- Empty state when no knowledge added: "You haven't added any content yet. Your chatbot won't have much to say until you do — add a knowledge source from your dashboard."
- Starter questions surfaced as clickable chips

**Deploy tabs:** "Widget" / "Slack" / "Telegram"
- Widget copy button: "Copy embed code" / confirmation: "Copied to clipboard"
- Slack connect: "Connect Slack" / Telegram connect: "Connect Telegram"
- Final CTA: "Go to dashboard"
- Completion flash message: "You're all set. Your chatbot is live."

**Error message structure:** [What happened] + [Why/what it means] + [What to do]
- File size limit: 25MB (referenced in both Step 3 description and error message)

**Why:** Written April 2026 for initial wizard implementation.

**How to apply:** Use these exact labels and patterns when implementing or iterating on any onboarding wizard step. Cross-check use case names and deploy tab labels against this record for consistency.
