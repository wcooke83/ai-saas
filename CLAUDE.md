# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server on port 3030
npm run build        # Production build
npm run lint         # ESLint

# Database (requires Supabase CLI)
npm run db:gen-types # Generate types from DB schema → src/types/database.ts
npm run db:migrate   # Push migrations to Supabase
npm run db:reset     # Reset database

# Stripe webhooks (local dev)
npm run stripe:listen
```

## Architecture

### Tech Stack
- **Next.js 15** (App Router) + TypeScript + Tailwind CSS
- **Supabase** for auth, database, and vector embeddings
- **AI**: Claude (Anthropic) and OpenAI with automatic fallback
- **Stripe** for payments/subscriptions
- **@react-pdf/renderer** and **docx** for document export

### Key Directories

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── dashboard/         # Protected user dashboard
│   ├── tools/             # AI tool pages (email-writer, proposal-generator, etc.)
│   └── embed/             # Embeddable widget versions of tools
├── components/
│   ├── tools/             # Tool-specific components
│   ├── ui/                # Shared UI components (button, card, input, etc.)
│   └── widget/            # Chat widget components
├── lib/
│   ├── ai/
│   │   ├── provider.ts    # Unified AI interface (Claude/OpenAI with fallback + mock mode)
│   │   ├── providers/     # Individual provider implementations
│   │   └── prompts/       # Prompt templates by tool
│   ├── supabase/          # Supabase clients (client.ts, server.ts, middleware.ts, admin.ts)
│   ├── chatbots/          # RAG system, knowledge processing, embeddings
│   └── pdf/docx/          # Document generation templates
└── types/
    └── database.ts        # Supabase-generated types
```

### AI Provider System (`src/lib/ai/provider.ts`)

The `generate()` and `generateStream()` functions provide a unified interface:
- Automatically detects available provider from env vars
- Falls back between Claude → OpenAI → Mock mode
- Mock mode activates when no valid API keys are present (useful for UI development)
- Supports `ModelTier`: `fast`, `balanced`, `powerful`

### Authentication Flow

1. Middleware (`src/middleware.ts`) handles:
   - CORS for API routes
   - Session refresh via Supabase
   - Protected route redirects (`/dashboard/*`)
   - Auth route redirects when logged in

2. Supabase clients:
   - `client.ts` - Browser client
   - `server.ts` - Server components/actions
   - `middleware.ts` - Middleware context
   - `admin.ts` - Service role operations

### Chatbot/RAG System (`src/lib/chatbots/`)

Custom chatbot builder with:
- Knowledge sources: URL scraping, PDF parsing, DOCX extraction
- Text chunking with overlap
- OpenAI embeddings → Supabase pgvector
- `match_knowledge_chunks` RPC for similarity search
- Slack integration support

### Database Schema

Core tables: `profiles`, `subscriptions`, `usage`, `generations`, `api_keys`, `tools`, `webhooks`, `audit_log`

Chatbot tables: `chatbots`, `knowledge_sources`, `knowledge_chunks`, `chat_sessions`, `chat_messages`

## Environment Variables

Required for full functionality:
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
ANTHROPIC_API_KEY          # Primary AI provider
OPENAI_API_KEY             # Fallback + embeddings
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
EASY_APPOINTMENTS_URL       # Easy!Appointments instance URL
EASY_APPOINTMENTS_KEY       # Base64-encoded Basic Auth credentials
```

Set `AI_MOCK_MODE=true` to force mock AI responses during development.
