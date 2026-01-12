-- Migration: Add RLS policies for usage table to allow users to manage their own usage
-- This allows the server client to update usage without requiring admin/service role

-- Drop existing policies if any (to recreate them)
DROP POLICY IF EXISTS "Users can view their own usage" ON usage;
DROP POLICY IF EXISTS "Users can insert their own usage" ON usage;
DROP POLICY IF EXISTS "Users can update their own usage" ON usage;

-- Enable RLS on usage table (if not already enabled)
ALTER TABLE usage ENABLE ROW LEVEL SECURITY;

-- Users can read their own usage
CREATE POLICY "Users can view their own usage"
ON usage FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own usage record
CREATE POLICY "Users can insert their own usage"
ON usage FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own usage (for incrementing credits_used)
CREATE POLICY "Users can update their own usage"
ON usage FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Add RLS policies for api_logs table
DROP POLICY IF EXISTS "Users can view their own api_logs" ON api_logs;
DROP POLICY IF EXISTS "Users can insert their own api_logs" ON api_logs;

-- Enable RLS on api_logs table
ALTER TABLE api_logs ENABLE ROW LEVEL SECURITY;

-- Users can read their own API logs
CREATE POLICY "Users can view their own api_logs"
ON api_logs FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert API logs (for their own API calls)
CREATE POLICY "Users can insert their own api_logs"
ON api_logs FOR INSERT
WITH CHECK (auth.uid() = user_id);
