---
name: VocUI Mobile API Routes Research
description: Which existing Next.js API routes the mobile app can reuse, their auth models, and gaps that need new routes
type: project
---

## Reusable routes (mobile can call these directly with Supabase session cookie — NOT applicable; mobile sends Bearer token)

Problem: The existing `/api/chatbots/[id]/analytics`, `/api/chatbots/[id]/conversations`, `/api/chatbots/[id]/knowledge` routes use `authenticate()` which checks for `sk_` prefixed platform API keys OR Supabase session cookies. Mobile apps cannot send session cookies cross-origin — they send the Supabase JWT as a Bearer token.

The widget routes (`/api/widget/[chatbotId]/agent-*`) accept `Bearer cb_...` (chatbot API key), NOT user JWT.

**Auth gap confirmed:** No existing route accepts `Authorization: Bearer <supabase-jwt>` for the chatbot dashboard routes.

## Agent Console routes — can be reused with chatbot API key approach (workaround)
- `GET /api/widget/[chatbotId]/agent-conversations` — accepts `Bearer cb_...`
- `POST /api/widget/[chatbotId]/agent-reply` — accepts `Bearer cb_...`
- `POST /api/widget/[chatbotId]/agent-actions` — accepts `Bearer cb_...`

These three work today without any backend changes IF the mobile app stores a chatbot API key per bot. BUT the requirement is Supabase account login, not API key. This is a conflict.

## Routes that need backend changes to support mobile JWT auth
- `GET /api/chatbots/[id]` — chatbot settings
- `GET /api/chatbots/[id]/analytics` — analytics
- `GET /api/chatbots/[id]/knowledge` — knowledge sources
- `GET /api/chatbots/[id]/conversations` — conversation + messages detail

## New backend routes needed (does not exist yet)
1. `GET /api/mobile/chatbots` — list all chatbots the authenticated user owns (can use Supabase directly from mobile, no new route needed if mobile uses Supabase client directly)
2. Agent Assignment CRUD — blocked on DB schema
3. `GET /api/mobile/unified-inbox` — cross-chatbot pending handoffs aggregated (nice to have; can be client-side merged initially)

## Pragmatic approach decided in planning
Mobile will use the Supabase JS client directly for reads that RLS permits (chatbots list, knowledge_sources, analytics via RPC). For writes and agent actions, the `authenticate()` function needs a new auth path that accepts Supabase JWT Bearer token OR the mobile app stores the chatbot's `api_keys` table key per bot. 

Recommend: Extend `authenticate()` to accept `Authorization: Bearer <supabase-access-token>` by verifying with `supabase.auth.getUser(token)`. This is the cleanest path. Flag to `typescript-nextjs-expert` to implement this auth path extension.
