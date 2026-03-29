---
name: First conversation activation detection
description: Where and how first-conversation activation fires in the chat route
type: project
---

Activation check fires in `src/app/api/chat/[chatbotId]/route.ts` after assistant message is saved, conditioned on `messages.length === 0` (prior history was empty = first message in this conversation).

Fires in both streaming and non-streaming paths. Pattern:
```ts
if (messages.length === 0) {
  fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/activation/first-conversation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chatbotId, userId: chatbot.user_id }),
  }).catch(() => {});
}
```

Activation route: `src/app/api/activation/first-conversation/route.ts`
- Uses admin client (no auth required from caller)
- Idempotent: checks `first_conversation_at` before acting
- Sends `sendFirstConversationEmail` from `src/lib/email/resend.ts` to chatbot owner

**Why:** `messages` is the history fetched before saving the current user message. If it's empty, this is the first ever message in this conversation. The activation route uses admin client because the chat endpoint has no user session.
