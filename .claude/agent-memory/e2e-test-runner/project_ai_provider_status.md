---
name: AI Provider Status
description: Status of all AI providers for E2E test runs — which ones have available quota/credits
type: project
---

As of 2026-04-04, all AI providers have quota/balance issues:

- **DeepSeek V3** (`deepseek-chat`): `402 Insufficient Balance` — paid credits exhausted
- **Anthropic Claude** (all models): `credit balance is too low` — paid credits exhausted  
- **OpenAI** (GPT-4o etc.): `insufficient_quota` — paid credits exhausted
- **Gemini 2.5 Flash**: `429 Too Many Requests` — free tier is 20 req/DAY, exhausted for 2026-04-04
- **Gemini 2.0 Flash / 1.5 Flash**: also rate-limited / exhausted

**Current default model in DB**: Gemini 2.5 Flash (`api_model_id: gemini-2.5-flash`, `is_default: true`)
- Changed from DeepSeek V3 on 2026-04-04 when DeepSeek hit 402
- Gemini 2.5 Flash works when quota is available (quota resets daily)

**Why:** Previous test runs consumed all provider credits/quota. All providers are on free/trial tiers.

**How to apply:** Before running any AI-dependent E2E tests (widget chat tests), verify the active model has available quota. Run a quick curl test:
```bash
curl -s -N -X POST "http://localhost:3030/api/chat/e2e00000-0000-0000-0000-000000000001" \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello","sessionId":"quota-check","source":"embed","stream":true}' --max-time 10
```
If it returns `{"type":"error","message":"Failed to generate response"}`, check `server.log` for the provider error.

**To fix:** Top up any one of: Anthropic, OpenAI, or DeepSeek billing. Or wait for Gemini daily quota to reset.
