-- Add proactive messages configuration to chatbots table
ALTER TABLE chatbots
ADD COLUMN IF NOT EXISTS proactive_messages_config jsonb DEFAULT '{"enabled":false,"rules":[]}'::jsonb;

COMMENT ON COLUMN chatbots.proactive_messages_config IS 'Proactive messaging rules: {enabled, rules: [{id, enabled, name, message, triggerType, triggerConfig, displayMode, delay, maxShowCount, priority}]}';
