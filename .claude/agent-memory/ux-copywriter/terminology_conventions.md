---
name: VocUI Terminology Conventions
description: Preferred user-facing terms vs jargon to avoid across VocUI codebase
type: feedback
---

Terms to NEVER use in user-facing copy:
- "RAG" -- say "knowledge-based answers" or just describe the behavior
- "chunks" -- say "sections" or "passages"
- "embeddings" / "re-embed" -- say "process" / "re-process"
- "tokens" (as billing unit) -- say "credits"
- "vector" / "vector database" -- say "your chatbot's knowledge"
- "system prompt" -- say "chatbot instructions" or "behavior instructions"
- "generations" (as noun for AI outputs) -- say "responses" or "activity"

**Why:** These terms leak implementation details that confuse non-technical chatbot owners. Validated through comprehensive copy audit (2026-03-28).

**How to apply:** Before writing any user-facing copy, check this list. If a term appears, rewrite to use the preferred alternative.
