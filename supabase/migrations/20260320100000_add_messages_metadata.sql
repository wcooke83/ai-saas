-- Migration: Add metadata column to messages table
-- Required for human agent handoff: stores is_human_agent, agent_name, source etc.
ALTER TABLE messages ADD COLUMN IF NOT EXISTS metadata jsonb;
