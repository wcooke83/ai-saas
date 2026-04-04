---
name: Channel Expansion Platform Evaluation
description: Prioritised build/skip/later verdicts for 12 messaging platforms evaluated against VocUI's SMB ICP
type: project
---

Evaluated April 2026 against VocUI's self-serve English-speaking SMB ICP. WhatsApp was just completed.

**Build next:**
- Facebook Messenger — highest SMB reach, reuses WhatsApp Meta Cloud API infrastructure (same app, same webhooks)
- Instagram DMs — bundle with Messenger, near-zero marginal cost (same API, different `messaging_product` value)
- SMS via Twilio — genuine market gap at SMB tier, strong fit for appointment-driven verticals (healthcare, real estate, legal, home services)

**Build later (revisit when ICP shifts upmarket or explicit demand signals appear):**
- Microsoft Teams — enterprise procurement friction, admin consent flows, wrong ICP tier now
- Google Chat — enterprise-only, Workspace admin approval required for bot install
- Email — distinct product pattern (inbound parsing, threading), build as support automation feature not a channel
- Discord — API is self-serve and good, but ICP mismatch (gaming/creator communities); revisit if targeting community segment
- Intercom/Zendesk handoff — workflow integration not a channel; needs product positioning decision before engineering

**Skip:**
- LINE — Japan/Thailand/Taiwan dominant, English-speaking SMB mismatch, local registration friction in some markets
- Viber — Eastern Europe/SEA, commercial agreement required (not self-serve API)
- LinkedIn Messaging — API not publicly available, restricted to approved partners, ToS risk for automation
- WeChat — confirmed skip (prior evaluation): Chinese business license required, native AI in WeChat 5.0

**Engineering sequencing:**
1. Messenger + Instagram DMs as one sprint (one Meta app, shared infrastructure)
2. SMS via Twilio as second sprint (independent integration)
3. Hold everything else pending demand signals

**Why:** Meta Messenger/Instagram share the same API foundation VocUI already built for WhatsApp. SMS addresses a genuine gap competitors fill only at enterprise price points. All other platforms either have ICP mismatch, non-self-serve API access, or serve non-English markets.
