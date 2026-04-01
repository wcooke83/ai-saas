---
name: Webhook event emission coverage
description: Which webhook events are emitted from which files, and known gaps fixed in April 2026
type: project
---

All 10 webhook event types now have emission sites as of 2026-04-01:

- `conversation.started` -- execute-chat.ts (on first user message)
- `conversation.ended` -- widget end beacon (/api/widget/:id/end), telegram handoff resolution
- `message.received` -- execute-chat.ts (user message)
- `message.sent` -- execute-chat.ts (two paths: standard and tool-call)
- `escalation.requested` -- widget report route (/api/widget/:id/report)
- `handoff.started` -- telegram/handoff.ts (initiateHandoff)
- `handoff.resolved` -- telegram/handoff.ts (resolveHandoff)
- `knowledge.updated` -- knowledge/processor.ts (after processing completes), knowledge/[sourceId] DELETE route
- `lead.captured` -- widget leads route (/api/widget/:id/leads)
- `ticket.created` -- widget tickets route (/api/widget/:id/tickets)

**Why:** The escalation report route was emitting the wrong event name (`escalation.created` instead of `escalation.requested`). `knowledge.updated` and `conversation.ended` had zero emission sites.

**How to apply:** When adding new webhook event types, ensure they have at least one emission site. Check emit coverage by grepping for `emitTypedWebhookEvent`.
