---
name: Agent Assignment Feature Design (2026-04-05)
description: Security architecture plan for the chatbot agent assignment feature — schema, RLS, API patterns, and risk inventory
type: project
---

Researched for agent assignment feature design (no code written yet).

**Key findings from codebase research:**

Ownership check pattern (used in every chatbot API route): `getChatbot(id)` via admin client, then `chatbot.user_id !== user.id` application-side check. NOT a RLS-gated query — the admin client bypasses RLS. This means all chatbot child-resource routes (analytics, knowledge, conversations, etc.) currently gate only on ownership. Assigned agents will need explicit permission checks inserted at the same application layer.

The `authenticateAgent()` function in `agent-conversations/route.ts` and `agent-actions/route.ts` checks EITHER a chatbot API key (`cb_*` prefix) OR session-owner match. Once agent assignments exist, this function must also accept assigned agents.

`logAuditEvent()` in `src/lib/supabase/admin.ts` is the established audit trail helper — it writes to `audit_log` (columns: user_id, action, entity_type, entity_id, metadata, ip_address, user_agent, created_at). Assignment lifecycle events should use this.

RLS pattern for child tables (established by conversation_memory, visitor_loyalty, etc.):
- Owner policy: `chatbot_id IN (SELECT id FROM chatbots WHERE user_id = auth.uid())`
- Service role policy: separate permissive policy for admin client

**Why:** Understanding baseline patterns is essential before writing the migration and API layer for assignments.
**How to apply:** Use these patterns as the reference implementation when building the assignment feature.
