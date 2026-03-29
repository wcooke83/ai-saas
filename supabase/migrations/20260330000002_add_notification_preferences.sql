ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS notify_new_ticket boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS notify_new_escalation boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS notify_product_updates boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS notify_usage_alerts boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS notify_marketing boolean NOT NULL DEFAULT false;
