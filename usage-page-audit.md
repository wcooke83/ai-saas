# `/dashboard/usage` Page Audit

> Audit date: 2026-03-30
> Reviewers: business-logic-reviewer, statistical-business-analyst, business-analyst

---

## Current State

The page contains five stat cards, a token usage chart, a billing period banner, and a tabbed log viewer (Generation History / API Logs).

### Current Cards

| # | Card | Data source | Current behaviour |
|---|------|------------|------------------|
| 1 | **Tokens Used** | `api_logs.tokens_total` for billing period | Shows tokens vs. plan limit with a progress bar |
| 2 | **vs Last Month** | Same `api_logs` query shifted -1 month | Month-over-month % change in token consumption |
| 3 | **Total Generations** | `generations` table, last 50 rows | Falls back to `apiLogs.length` when generations is empty |
| 4 | **API Calls** | `api_logs`, last 50 rows | Tooltip: "Does not include widget chat traffic" |
| 5 | **Avg Response** | `duration_ms` averaged across last 50 `api_logs` | Milliseconds formatted as seconds |

---

## Findings

### Card 1 — Tokens Used ✅ Keep (with caveat)

The most relevant billing metric on the page. The progress bar with colour thresholds at 50%/80% is well implemented.

**Caveat:** The numerator (`totalTokensUsed`) comes from `api_logs`, while the denominator (`creditsLimit`) falls back through `subscriptionPlan.credits_monthly → usage.credits_limit → 100`. If these tables diverge, the percentage is computed from inconsistent sources. The displayed % may not match what billing enforcement actually gates on.

**Improvement:** Add a projected burn rate — `(tokens_used / days_elapsed) * days_in_period` — so the progress bar is forward-looking, not just a snapshot. "You are on track to use 133% of your limit" is more actionable than "40% used."

---

### Card 2 — vs Last Month ❌ Remove or fix

**Problem:** The window comparison is wrong for most of the billing period. The card computes "tokens used so far this period" vs "all tokens used last full period." On day 3 of the month, a growing account shows −95% vs last month — a frightening negative number that has no signal value. Both periods can also be subject to the 50-row cap on api_logs, making the ratio potentially a comparison of two equally-truncated samples.

**If kept:** Correct the window to compare equivalent partial periods (e.g. first N days of current period vs first N days of last period). Or replace it with a conversations-vs-last-month comparison where growth is unambiguously positive.

---

### Card 3 — Total Generations ❌ Replace

**Problem 1 — Label is factually incorrect:** The query is `LIMIT 50`. For any account with more than 50 generations, the card displays 50 and labels it "Total." This is silent data truncation with a misleading label. It erodes trust when users notice.

**Problem 2 — Silent fallback conflates two different things:** `generations.length > 0 ? generations.length : apiLogs.length`. When generations is empty, the card counts API log rows instead — two distinct entities — with no indication of the substitution.

**Problem 3 — "Generation" is a technical term** that has no natural meaning to a business owner deploying a customer support chatbot.

**Replace with:** Total Conversations (aggregate `total_conversations` across all chatbots for the billing period). This is the actual unit of value delivered by the platform, not a proxy for AI infrastructure calls.

---

### Card 4 — API Calls ❌ Replace or demote

**Problem 1 — 50-row cap:** Same truncation issue as Total Generations.

**Problem 2 — Explicitly excludes primary usage:** The tooltip says "Does not include widget chat traffic." For most VocUI users, widget chat is the entire product. A business owner with an embedded chatbot on their website sees near-zero API calls while real conversations are happening. This is a broken signal for the majority user.

**Replace with:** Unique Visitors (aggregate `unique_visitors` across all chatbots for the billing period). This tells operators how many real customers their chatbots served — the growth metric they actually care about.

**If API Calls must remain:** Move it to a developer-specific section below the main stat grid, and fix the query cap.

---

### Card 5 — Avg Response ❌ Remove

**Problem 1 — Wrong statistic:** Mean latency on right-skewed distributions is misleading. A single 30-second timeout in a 50-row sample inflates the mean by ~580ms. Median or p95 is more representative.

**Problem 2 — No temporal anchor:** The 50 most recent calls could span hours, days, or weeks depending on account activity. There is no defined time window.

**Problem 3 — Engineering metric on a business page:** This drives no decision for a business owner and is better surfaced on the per-chatbot performance page (which already shows TTFT, p95, and pipeline waterfall).

**Replace with:** Satisfaction Rate (average `satisfaction_rate` across all chatbots where surveys are enabled). For accounts without surveys enabled, show a prompt to enable them. This is the only outcome/quality metric currently available in the data model.

---

### Other Issues

**Hardcoded badges on analytics pages:** The "Message Growth → Active" and "Engagement Trend → Growing" badges on per-chatbot analytics pages are hardcoded strings. They should be removed entirely or replaced with real computed values. Static labels that never change damage trust.

**The log viewer (50-row limit):** The Generation History and API Logs tabs both cap at 50 rows with no explanation or pagination. For an audit or billing dispute scenario, this is insufficient.

**Cross-chatbot gap:** A user with multiple deployed chatbots must navigate to each bot's analytics page individually to understand their overall footprint. There is no account-level summary of conversations, visitors, or satisfaction across all bots. The data exists in `chat_sessions` and `analytics`; this is a presentation gap, not a data gap.

---

## Recommended Card Set

| # | Card | Data source | Why |
|---|------|------------|-----|
| 1 | **Tokens Used** (keep) | `api_logs` + `usage` | Direct billing signal; keep with burn rate projection |
| 2 | **Total Conversations** (new) | `chat_sessions` aggregate, all bots, current period | Primary unit of value; replaces misleading "Total Generations" |
| 3 | **Unique Visitors** (new) | `chat_sessions` aggregate, all bots, current period | Measures reach; replaces misleading "API Calls" |
| 4 | **Active Chatbots** (new) | Count of bots with ≥1 conversation this period | Subscription value signal: zero means something is broken |
| 5 | **Satisfaction Rate** (new) | Average `satisfaction_rate` across bots with surveys | Only outcome/quality metric in the data; replaces "Avg Response" |

**Secondary strip (demote from cards):**
- Billing period start/end + days until reset (already exists as a banner — keep)
- vs Last Month (reframe as conversation delta, not token delta, once window is fixed)
- Success Rate (already computed as `stats.successRate`; worth surfacing for API developers)

---

## Derived Metrics Worth Adding

These require minimal backend work and deliver high decision value:

| Metric | Formula | Why useful |
|--------|---------|-----------|
| **Tokens per conversation** | `total_tokens / total_conversations` | Efficiency indicator; rising value with flat satisfaction = over-generation |
| **Projected token burn** | `(tokens_used / days_elapsed) × days_in_period` | Forward-looking; converts progress bar into an alert |
| **Conversation completion rate** | `sessions with ≥3 messages / total_sessions` | Proxy for resolution success; single-message sessions = failed response |

---

## User Persona Gap

The page currently serves **developer** jobs-to-be-done at an acceptable level. It fails **business owner** jobs-to-be-done almost completely.

| Question | Business owner | Developer | Current page |
|---------|---------------|-----------|-------------|
| Am I close to my limit? | ✅ | ✅ | ✅ Served |
| Are customers being helped? | ✅ | — | ❌ Not served |
| Is usage growing? | ✅ | — | ⚠️ Partially (chart) |
| Are there errors to fix? | — | ✅ | ✅ Served (API Logs tab) |
| What's my token efficiency? | — | ✅ | ❌ Not served |

The most impactful single change: **lead with conversation and visitor counts aggregated across all bots, and demote token/API metrics to a secondary plan-management strip.** The data to support this already exists in the database — this is a presentation problem, not a data pipeline problem.
