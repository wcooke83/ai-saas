---
name: supabase-schema
description: Generate Supabase database migrations, RLS policies, and TypeScript types. Use when designing database schemas, creating tables, or setting up row-level security.
---

# Supabase Schema Skill

Generate Supabase database migrations, RLS policies, and TypeScript types.

## Arguments
- `action`: `init` | `table` | `rls` | `types` | `migration`
- `name`: Table name or migration name
- `--product`: Product name for multi-tenant setup

## Actions

### `init` - Initialize base schema
Creates foundational tables for any SaaS:
- `profiles` - User profile data
- `subscriptions` - Stripe subscription data
- `usage` - Usage tracking/limits
- `audit_log` - Action logging

### `table` - Create new table
Generates migration for a custom table with:
- Standard fields (id, created_at, updated_at)
- User foreign key
- RLS policies

### `rls` - Generate RLS policies
Creates row-level security policies for:
- Users can only access their own data
- Admin override patterns
- Public read patterns (if needed)

### `types` - Generate TypeScript types
Runs Supabase CLI to generate types from schema

### `migration` - Custom migration
Creates a new migration file

## Instructions

When invoked:

1. **Generate migration file**:
   ```
   supabase/migrations/[timestamp]_[name].sql
   ```

2. **Include RLS by default**: All tables have RLS enabled

3. **Standard columns**: id (uuid), created_at, updated_at

4. **Generate types**: After migration, remind to run `supabase gen types`

## Schema Templates

### Init Migration (`init` action)
```sql
-- Migration: Initialize SaaS base schema
-- Created by: /schema init

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===================
-- PROFILES TABLE
-- ===================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ===================
-- SUBSCRIPTIONS TABLE
-- ===================
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'free', -- free, active, canceled, past_due
  plan TEXT NOT NULL DEFAULT 'free', -- free, pro, enterprise
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_customer ON public.subscriptions(stripe_customer_id);

-- ===================
-- USAGE TABLE
-- ===================
CREATE TABLE public.usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  credits_used INTEGER DEFAULT 0 NOT NULL,
  credits_limit INTEGER DEFAULT 10 NOT NULL, -- Free tier default
  period_start TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  period_end TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '1 month') NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_usage_user_id ON public.usage(user_id);

-- Auto-create usage record on profile creation
CREATE OR REPLACE FUNCTION public.handle_new_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.usage (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_profile_created
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_profile();

-- ===================
-- AUDIT LOG TABLE
-- ===================
CREATE TABLE public.audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  metadata JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_audit_log_user ON public.audit_log(user_id);
CREATE INDEX idx_audit_log_entity ON public.audit_log(entity_type, entity_id);
CREATE INDEX idx_audit_log_created ON public.audit_log(created_at DESC);

-- ===================
-- RLS POLICIES
-- ===================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/update own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Subscriptions: users can view own subscription
CREATE POLICY "Users can view own subscription"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Usage: users can view own usage
CREATE POLICY "Users can view own usage"
  ON public.usage FOR SELECT
  USING (auth.uid() = user_id);

-- Audit log: users can view own audit entries
CREATE POLICY "Users can view own audit log"
  ON public.audit_log FOR SELECT
  USING (auth.uid() = user_id);

-- ===================
-- UPDATED_AT TRIGGER
-- ===================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_usage_updated_at
  BEFORE UPDATE ON public.usage
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
```

### Product-Specific Table Template
```sql
-- Migration: Create [TABLE_NAME] table for [PRODUCT]
-- Created by: /schema table [name]

CREATE TABLE public.[table_name] (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,

  -- Product-specific fields
  title TEXT NOT NULL,
  content TEXT,
  status TEXT DEFAULT 'draft' NOT NULL, -- draft, published, archived
  metadata JSONB DEFAULT '{}',

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes
CREATE INDEX idx_[table_name]_user ON public.[table_name](user_id);
CREATE INDEX idx_[table_name]_status ON public.[table_name](status);
CREATE INDEX idx_[table_name]_created ON public.[table_name](created_at DESC);

-- Enable RLS
ALTER TABLE public.[table_name] ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own [table_name]"
  ON public.[table_name] FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own [table_name]"
  ON public.[table_name] FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own [table_name]"
  ON public.[table_name] FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own [table_name]"
  ON public.[table_name] FOR DELETE
  USING (auth.uid() = user_id);

-- Updated_at trigger
CREATE TRIGGER update_[table_name]_updated_at
  BEFORE UPDATE ON public.[table_name]
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
```

### Generations Table (AI Products)
```sql
-- Migration: Create generations table
-- For AI SaaS products that generate content

CREATE TABLE public.generations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,

  -- Generation details
  type TEXT NOT NULL, -- email, report, proposal, etc.
  prompt TEXT NOT NULL,
  output TEXT,

  -- AI metadata
  model TEXT NOT NULL DEFAULT 'claude-3-5-sonnet',
  tokens_input INTEGER DEFAULT 0,
  tokens_output INTEGER DEFAULT 0,
  duration_ms INTEGER,

  -- Status
  status TEXT DEFAULT 'pending' NOT NULL, -- pending, completed, failed
  error_message TEXT,

  -- User interaction
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  is_favorite BOOLEAN DEFAULT FALSE,

  -- Metadata
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_generations_user ON public.generations(user_id);
CREATE INDEX idx_generations_type ON public.generations(type);
CREATE INDEX idx_generations_status ON public.generations(status);
CREATE INDEX idx_generations_created ON public.generations(created_at DESC);
CREATE INDEX idx_generations_favorite ON public.generations(user_id, is_favorite) WHERE is_favorite = TRUE;

ALTER TABLE public.generations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own generations"
  ON public.generations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create generations"
  ON public.generations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own generations"
  ON public.generations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own generations"
  ON public.generations FOR DELETE
  USING (auth.uid() = user_id);
```

## TypeScript Types Template

After running migrations, generate types:

```bash
supabase gen types typescript --local > src/types/database.ts
```

Manual type definitions (`src/types/database.ts`):
```typescript
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
        };
        Update: {
          full_name?: string | null;
          avatar_url?: string | null;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          status: 'free' | 'active' | 'canceled' | 'past_due';
          plan: 'free' | 'pro' | 'enterprise';
          current_period_start: string | null;
          current_period_end: string | null;
          cancel_at_period_end: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          status?: string;
          plan?: string;
        };
        Update: {
          status?: string;
          plan?: string;
          current_period_start?: string | null;
          current_period_end?: string | null;
          cancel_at_period_end?: boolean;
        };
      };
      usage: {
        Row: {
          id: string;
          user_id: string;
          credits_used: number;
          credits_limit: number;
          period_start: string;
          period_end: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          credits_used?: number;
          credits_limit?: number;
        };
        Update: {
          credits_used?: number;
          credits_limit?: number;
          period_start?: string;
          period_end?: string;
        };
      };
      generations: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          prompt: string;
          output: string | null;
          model: string;
          tokens_input: number;
          tokens_output: number;
          duration_ms: number | null;
          status: 'pending' | 'completed' | 'failed';
          error_message: string | null;
          rating: number | null;
          is_favorite: boolean;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          user_id: string;
          type: string;
          prompt: string;
          output?: string | null;
          model?: string;
          tokens_input?: number;
          tokens_output?: number;
          status?: string;
        };
        Update: {
          output?: string | null;
          status?: string;
          error_message?: string | null;
          rating?: number | null;
          is_favorite?: boolean;
        };
      };
    };
  };
}
```

## Example Usage

```
/schema init
/schema table templates --product EmailGenius
/schema table reports --product ReportBot
/schema rls generations --policy "Users can share generations"
/schema types
/schema migration add_team_support
```

## Output Checklist

- [ ] Migration file with timestamp
- [ ] RLS enabled on all tables
- [ ] Proper indexes for queries
- [ ] Foreign key constraints
- [ ] updated_at triggers
- [ ] TypeScript types generated/updated
