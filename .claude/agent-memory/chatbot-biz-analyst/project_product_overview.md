---
name: VocUI Product Overview
description: Full feature surface, positioning, and tech stack as audited March 2026
type: project
---

VocUI is a multi-tenant chatbot-as-a-service (CaaS) platform. Businesses build chatbots trained on their own knowledge bases and deploy them across multiple channels.

**Tech stack:** Next.js 15 App Router, Supabase (auth/DB/pgvector/realtime), Claude (primary) + OpenAI (fallback/embeddings), Stripe, Resend, Upstash Redis.

**Core capabilities (from March 2026 codebase audit):**
- Knowledge ingestion: URL crawl (sitemap + link follow, up to 100 pages), raw text, Q&A pairs, file upload (PDF/DOCX/images)
- RAG with pgvector, live fetch fallback when similarity scores are low, embedding mismatch detection
- Widget customization: extensive (40+ color/typography/layout controls, custom CSS)
- Channels: embeddable widget (4 embed methods), Slack, Telegram, REST API
- Chat: pre-chat form, post-chat survey, file upload, proactive messaging (8 trigger types), transcript email, authenticated user context injection
- Live agent handoff: in-dashboard Agent Console + embeddable Agent Console SDK
- Support layer: tickets, contact form, escalation/issues
- Analytics: conversation/message/visitor stats, sentiment + loyalty scoring, per-request performance telemetry (waterfall)
- Calendar: Easy!Appointments integration with in-chat booking
- Articles: AI article generation from knowledge sources
- Billing: Stripe subscriptions, credit top-up, auto-topup, AppSumo lifetime deals (3 tiers), trial links
- Admin: runtime plan management, credit grants, token multipliers, API logs, platform analytics

**Navigation structure per chatbot:** Overview, Settings, Knowledge, Customize, Calendar, Deploy (primary) + Agent Console, Analytics, Performance, Leads, Surveys, Sentiment, Issues, Tickets, Contact, Articles (in "More" dropdown).

**Why:** Understanding the full product surface is essential for pricing, positioning, and customer journey recommendations. Product is more mature than marketing reflects.

**How to apply:** Always reference the full feature set when giving positioning or competitive advice. The product is ahead of its marketing — that's the central business tension.
