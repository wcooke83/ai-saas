ALTER TABLE usage
  ADD COLUMN IF NOT EXISTS credit_alert_75_sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS credit_alert_90_sent_at timestamptz;
