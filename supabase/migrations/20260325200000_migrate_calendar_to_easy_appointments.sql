-- Migrate calendar provider from Cal.com/Calendly to Easy!Appointments
-- 1. Update existing rows to the new provider value
-- 2. Replace the CHECK constraint to only allow 'easy_appointments'

-- Update any existing integration rows
UPDATE calendar_integrations
SET provider = 'easy_appointments',
    config = '{}'::jsonb
WHERE provider IN ('hosted_calcom', 'customer_calcom', 'calendly');

-- Update any existing booking rows
UPDATE calendar_bookings
SET provider = 'easy_appointments'
WHERE provider IN ('hosted_calcom', 'customer_calcom', 'calendly');

-- Drop old CHECK constraint and add new one
ALTER TABLE calendar_integrations
  DROP CONSTRAINT IF EXISTS calendar_integrations_provider_check;

ALTER TABLE calendar_integrations
  ADD CONSTRAINT calendar_integrations_provider_check
  CHECK (provider IN ('easy_appointments'));
