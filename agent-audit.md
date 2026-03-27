# Agent System Audit Report

**Date:** 2026-03-27
**Scope:** 9 custom agents in `.claude/agents/`, 5 active agent memory stores in `.claude/agent-memory/`

---

## Executive Summary

| Metric | Value |
|--------|-------|
| Total agents | 9 |
| Agents with active memory | 5 of 9 (56%) |
| Total memory files | 8 |
| Agents with memory configured (`memory: project`) | 7 of 9 |
| Agents with NO memory directory | 4 |
| Critical issues found | 5 |
| High issues found | 6 |
| Medium issues found | 7 |
| Low/Info issues found | 4 |

**Overall health: 5/10** -- Good agent coverage for the project's domains, but significant structural waste from duplicated boilerplate, scope overlap between 3 agent pairs, security concern in committed memory, and 4 agents with zero memory accumulation.

---

## Agent Inventory

| Agent | Lines | Memory Dir | Memory Files | `memory:` field | `color:` | Model |
|-------|-------|-----------|-------------|-----------------|---------|-------|
| ai-chatbot-expert | 336 | No | 0 | Missing | -- | inherit |
| business-logic-reviewer | 196 | No | 0 | `project` | -- | inherit |
| disk-io-profiler | 72 | No | 0 | Missing | -- | inherit |
| rag-performance-tuner | 211 | Yes | 1 | `project` | -- | inherit |
| infra-optimizer | 206 | Yes | 1 | `project` | -- | inherit |
| ai-latency-optimizer | 200 | No | 0 | `project` | -- | inherit |
| security-architecture-auditor | 235 | Yes | 1 | `project` | yellow | inherit |
| playwright-test-auditor | 247 | Yes | 3 | `project` | -- | inherit |
| sales-conversation-engine | 281 | Yes | 1 | `project` | -- | inherit |

---

## Critical Issues

### C1: `ai-chatbot-expert` has duplicated memory section (entire 130-line block appears twice)

**File:** `.claude/agents/ai-chatbot-expert.md`
**Impact:** ~130 lines of wasted context window on every invocation. Lines 67-196 and 202-336 are identical.

The agent body ends at line 66. Lines 67-196 contain the full "Persistent Agent Memory" boilerplate. Then a second copy starts at line 202 with a blank MEMORY.md heading and repeats it all again.

**Fix:** Remove the duplicated block (lines 202-336). The first instance is sufficient.

---

### C2: Hardcoded E2E test secret committed in agent memory

**File:** `.claude/agent-memory/playwright-test-auditor/auth_setup_pattern.md`
**Content:** Contains `'e2e-playwright-secret-2026'` and hardcoded `PROJECT_REF 'oxiekhzthqmpuyoibunn'` in plain text.

This file is tracked in the working tree (visible in git status under `?? .claude/agent-memory/playwright-test-auditor/`). If committed, the secret will be in git history permanently.

**Fix:** Remove the secret from the memory file. Reference it as "the E2E_SECRET env var" instead. The PROJECT_REF may be acceptable since it's a Supabase project identifier (not itself a secret), but the auth secret should not be in memory files.

---

### C3: Memory boilerplate consumes ~60-70% of every agent's prompt

Each of the 9 agents includes 130-150 lines of identical memory system instructions. For the 7 agents that set `memory: project` in frontmatter, this boilerplate is **already injected by the Claude Code framework** -- making the in-body copy redundant.

| Agent | Total lines | Memory boilerplate lines | Actual content lines | Content % |
|-------|------------|------------------------|---------------------|-----------|
| ai-chatbot-expert | 336 | 270 (2x copy) | 66 | 20% |
| business-logic-reviewer | 196 | 130 | 66 | 34% |
| disk-io-profiler | 72 | 0 | 72 | 100% |
| rag-performance-tuner | 211 | 130 | 81 | 38% |
| infra-optimizer | 206 | 130 | 76 | 37% |
| ai-latency-optimizer | 200 | 130 | 70 | 35% |
| security-architecture-auditor | 235 | 130 | 105 | 45% |
| playwright-test-auditor | 247 | 130 | 117 | 47% |
| sales-conversation-engine | 281 | 130 | 151 | 54% |

**Impact:** Every agent invocation wastes 130+ tokens on boilerplate that's either auto-injected or duplicated. For `ai-chatbot-expert`, it's 270 lines of waste.

**Fix:** For agents with `memory: project` in frontmatter, remove the entire "# Persistent Agent Memory" section from the body. The framework handles it. For `ai-chatbot-expert` and `disk-io-profiler` which lack the `memory:` field, add `memory: project` to frontmatter and remove the body section.

---

### C4: 4 agents have never accumulated any memory

| Agent | Has `memory:` field | Has memory directory | Invocations (estimated) |
|-------|-------------------|---------------------|------------------------|
| ai-chatbot-expert | No | No | Unknown |
| business-logic-reviewer | Yes | No | Unknown |
| disk-io-profiler | No | No | Unknown |
| ai-latency-optimizer | Yes | No | Unknown |

These agents are configured to build persistent memory but have never done so. Either they've never been invoked, or they failed to create their memory directories. Since `business-logic-reviewer` and `ai-latency-optimizer` have `memory: project` set, they should have been prompted to write memory on first use.

**Fix:** Not necessarily a bug -- these agents may simply not have been used yet. However, `ai-chatbot-expert` is highly relevant to this project's chatbot system and likely should have been invoked. Verify whether these agents are being triggered appropriately.

---

### C5: `ai-chatbot-expert` missing `memory: project` frontmatter field

**File:** `.claude/agents/ai-chatbot-expert.md`

The agent has memory instructions in its body (duplicated, see C1) but lacks the `memory: project` field in frontmatter. This means the framework may not inject the memory context or create the memory directory automatically.

**Fix:** Add `memory: project` to frontmatter.

---

## High Issues

### H1: Significant scope overlap between 3 agent pairs

**Pair 1: `ai-chatbot-expert` vs `rag-performance-tuner`**

Both agents claim ownership of:
- Chunking strategies and parameters
- Embedding generation and caching
- Similarity search tuning
- `match_knowledge_chunks` RPC
- `src/lib/chatbots/` directory

The chatbot expert's responsibility #1 says "Design and implement retrieval-augmented generation flows -- chunking strategies, embedding generation, vector storage, similarity search tuning." This is nearly identical to what the RAG performance tuner covers.

**Boundary suggestion:** `ai-chatbot-expert` should own feature development (new knowledge source types, chat flows, widget features). `rag-performance-tuner` should own performance optimization only (index tuning, caching, query optimization). Neither prompt currently draws this line.

**Pair 2: `infra-optimizer` vs `ai-latency-optimizer`**

Both cover:
- Edge deployment recommendations
- Streaming optimization
- Connection management patterns
- Vercel Edge Runtime configuration

The infra-optimizer's "Edge Computing Optimization" section and the ai-latency-optimizer's "Streaming Optimization" section give overlapping guidance on the same files.

**Boundary suggestion:** `infra-optimizer` for infrastructure-level concerns (deployment, regions, pooling, CDN). `ai-latency-optimizer` for AI-call-specific concerns (prompt compression, model routing, TTFT). Currently the streaming overlap is ambiguous.

**Pair 3: `ai-chatbot-expert` vs `sales-conversation-engine`**

Both reference:
- `src/components/widget/` components
- Chat session management
- Conversation flow design
- `src/lib/ai/prompts/` templates

**Boundary suggestion:** `ai-chatbot-expert` for technical RAG/chat implementation. `sales-conversation-engine` for prompt content and conversation strategy only. The sales agent should not be modifying widget components or chat session schemas.

---

### H2: `sales-conversation-engine` prompt is excessively long (151 lines of content)

The 12-phase conversation architecture (Phases 1-12, lines 28-108) reads more like a sales training manual than an agent system prompt. Each phase has 4-7 bullet points with detailed sales methodology (Cialdini, Sandler, Challenger Sale references in the persona).

**Impact:** On every invocation, 150+ lines of sales methodology theory consume context window. Much of this is static reference material, not dynamic instructions.

**Fix:** Consider:
1. Move the 12-phase detail into a knowledge source file (e.g., `docs/sales-conversation-playbook.md`) and have the agent prompt reference it
2. Keep only the phase names and 1-line summaries in the prompt
3. Estimated savings: ~80 lines of prompt

---

### H3: `disk-io-profiler` is too narrow for a dedicated agent

This agent covers a single concern (disk I/O bottlenecks in development). Its 72-line prompt is well-written but the trigger scenarios are very specific:
- Dev server disk writes
- .next folder growth
- PDF export system freezes

**Impact:** Low ROI -- this agent likely fires very rarely. Most of its knowledge (Webpack cache behavior, Next.js dev patterns) is commonly known.

**Recommendation:** Consider merging into a broader "dev environment troubleshooter" agent, or removing it entirely and handling ad-hoc.

---

### H4: Memory content violates "What NOT to save" guidelines

Several agent memory files store exactly what the guidelines say to avoid:

**`rag-performance-tuner/project_rag_state.md`:**
- Contains specific line numbers, file paths, code patterns, database table details, migration file names
- Lists 16 specific code fixes with line references -- these are code changes derivable from `git log`
- Contains "117 chunks, 1 chatbot" -- ephemeral database state

**`infra-optimizer/project_infra_audit_state.md`:**
- Contains architecture details derivable from reading the codebase ("Supabase clients use REST API", "No vercel.json exists")
- Lists specific file patterns and code locations

**Guidelines explicitly state:** "Code patterns, conventions, architecture, file paths, or project structure -- these can be derived by reading the current project state."

**Fix:** Prune these memories to contain only:
- Non-obvious decisions and their rationale
- Performance measurements and baselines (the numbers, not the code paths)
- Known issues that aren't reflected in the code or git history

---

### H5: No agent handles database migrations

The project has 6 pending migration files in `supabase/migrations/` and the `rag-performance-tuner` memory notes that the `match_knowledge_chunks` RPC "is not in any migration file -- manually created, not version-controlled."

No agent owns migration authoring, schema changes, or RLS policy management. The `supabase-schema` skill exists but is separate from the agent system.

**Recommendation:** Either extend `business-logic-reviewer` to cover schema/migration review, or ensure the `supabase-schema` skill is invoked alongside relevant agents.

---

### H6: Inconsistent frontmatter across agents

| Field | Present | Missing |
|-------|---------|---------|
| `memory: project` | 7 agents | `ai-chatbot-expert`, `disk-io-profiler` |
| `color:` | 1 agent (`security-architecture-auditor: yellow`) | 8 agents |
| `model:` | 9 (all `inherit`) | 0 |

The `color` field provides visual differentiation in the UI. Only the security auditor uses it. Consider assigning colors to help visually distinguish agent types during multi-agent workflows.

---

## Medium Issues

### M1: Memory files risk staleness without review dates

5 of 8 memory files contain timestamped data but have no expiry or review mechanism:
- `project_rag_state.md` -- "as of 2026-03-21"
- `project_infra_audit_state.md` -- "2026-03-22"
- `audit_2026-03-24.md` -- "2026-03-24"
- `test_suite_overview.md` -- "as of 2026-03-26"
- `project_template_overhaul.md` -- "March 2026"

These will drift from reality as the codebase evolves. The memory system guidelines say to "verify that the memory is still correct" but agents don't proactively do this.

**Recommendation:** Periodically (monthly) have agents re-audit and update/prune their memories.

---

### M2: `playwright-test-auditor` memory contains stale route rename data

`route_rename_escalations_issues.md` documents that `/escalations` was renamed to `/issues` and 3 test files still reference the old name. This may or may not have been fixed since the memory was written.

If it's been fixed, this memory provides wrong guidance. If not, it's useful. Neither the agent nor the memory system verifies.

---

### M3: No agent handles prompt template authoring in `src/lib/ai/prompts/`

The project has prompt templates in `src/lib/ai/prompts/` but no agent specifically owns prompt engineering for the AI tools (email-writer, proposal-generator, etc.). The `ai-latency-optimizer` covers prompt compression for speed, and `sales-conversation-engine` covers sales prompts, but general prompt quality/effectiveness for the tool suite has no owner.

---

### M4: Agent descriptions use escaped newlines in YAML

All 9 agents use `\\n` in their description fields. While valid YAML, this makes the raw files harder to read and edit. YAML block scalars (`|` or `>`) would be cleaner:

```yaml
description: |
  Use this agent when...
```

---

### M5: `disk-io-profiler` lacks `memory: project` and has no memory section

Unlike all other agents, `disk-io-profiler` has neither the `memory:` frontmatter field nor the memory instructions in its body. This is the only agent that is genuinely memory-less. This is fine given its narrow scope (see H3) but is inconsistent with the pattern.

---

### M6: No agent covers the `src/app/tools/` pages

The project has tool pages (email-writer, proposal-generator, etc.) in `src/app/tools/`. No agent specifically covers these feature implementations. The `ai-chatbot-expert` covers the chatbot/RAG system, but the individual tool pages have no specialized agent.

---

### M7: Code style instructions are duplicated across 6 agents

The following block (or close variant) appears in `ai-chatbot-expert`, `rag-performance-tuner`, `infra-optimizer`, `ai-latency-optimizer`, `security-architecture-auditor`, and `sales-conversation-engine`:

```
- Be extremely brief in explanations -- state what changed and why only if critical
- Show changes through code, not prose
- Do not write guides or documentation unless explicitly asked
```

This is already in `CLAUDE.md` which is loaded into every conversation. Repeating it in each agent is unnecessary.

---

## Low/Info Issues

### L1: All agents use `model: inherit`

This is generally correct -- it lets the user's chosen model propagate. However, for cost optimization, consider:
- `disk-io-profiler` could use `haiku` (simple diagnostic tasks)
- `business-logic-reviewer` might benefit from `opus` (nuanced business logic review)

---

### L2: MEMORY.md index files are minimal

All 5 MEMORY.md files contain 1-3 entries. This is appropriate for the current memory count but means the index provides little navigational value. As memories grow, enforce the "one line, under ~150 characters" format consistently.

---

### L3: `security-architecture-auditor` is the only agent with a `color` field

The yellow color provides visual context for security-related operations. Consider a color scheme:
- `security-architecture-auditor`: yellow (warning/caution)
- `business-logic-reviewer`: blue (business)
- `playwright-test-auditor`: green (testing)
- `sales-conversation-engine`: purple (creative)
- Performance agents (rag, infra, latency): orange

---

### L4: Agent description examples all follow assistant-perspective format

Every agent's description examples show the assistant's response ("I'll use the X agent to..."). This is correct for the trigger system but provides no examples of what the agent itself outputs, which would help the parent agent understand what to expect back.

---

## Recommendations Summary

| Priority | Action | Effort |
|----------|--------|--------|
| P0 | Remove duplicated memory section from `ai-chatbot-expert` | 5 min |
| P0 | Remove hardcoded secret from `playwright-test-auditor/auth_setup_pattern.md` | 5 min |
| P1 | Remove memory boilerplate from all 7 agents with `memory: project` | 30 min |
| P1 | Add `memory: project` to `ai-chatbot-expert` and `disk-io-profiler` frontmatter | 5 min |
| P1 | Clarify scope boundaries between overlapping agent pairs (H1) | 30 min |
| P2 | Prune memory files to remove code-derivable content (H4) | 20 min |
| P2 | Slim down `sales-conversation-engine` prompt, externalize playbook (H2) | 30 min |
| P3 | Evaluate whether `disk-io-profiler` warrants standalone agent (H3) | 10 min |
| P3 | Add colors to remaining agents (L3) | 10 min |
| P3 | Convert description fields to YAML block scalars (M4) | 20 min |
| P3 | Remove duplicated code style instructions (M7) | 15 min |

---

## Agent-by-Agent Grades

| Agent | Grade | Strengths | Weaknesses |
|-------|-------|-----------|------------|
| **security-architecture-auditor** | A- | Comprehensive 9-domain audit checklist, clear output format, only agent with color, good memory content | Memory has stale-risk line numbers |
| **playwright-test-auditor** | B+ | Best memory usage (3 files), domain-specific checks, clear reporting format | Secret in memory, stale route data |
| **business-logic-reviewer** | B+ | Well-structured checklist, clear severity levels, concise | No memory directory, never invoked? |
| **rag-performance-tuner** | B | Deep pgvector/embedding expertise, good technical depth | Heavy overlap with chatbot-expert, memory stores code details |
| **infra-optimizer** | B | Good decision framework table, clear scope | Overlaps with latency optimizer, memory stores architecture details |
| **ai-latency-optimizer** | B- | Clear prioritization framework, good benchmarking section | Overlaps with infra-optimizer, no memory directory |
| **sales-conversation-engine** | B- | Thorough 12-phase methodology, good domain expertise | Excessively long prompt, overlaps with chatbot-expert |
| **ai-chatbot-expert** | C | Covers important domain | Duplicated memory section (270 lines waste), missing `memory:` field, overlaps with 2 other agents |
| **disk-io-profiler** | C+ | Concise and focused | Too narrow for dedicated agent, no memory support |
