-- Make credit_packages global (admin-managed) instead of per-chatbot
-- Packages are now platform-wide; chatbot owners toggle which ones to show via credit_exhaustion_config.

-- Allow chatbot_id to be NULL for global packages
ALTER TABLE credit_packages ALTER COLUMN chatbot_id DROP NOT NULL;

-- Add is_global flag (true = platform-wide package managed by admin)
ALTER TABLE credit_packages ADD COLUMN IF NOT EXISTS is_global boolean NOT NULL DEFAULT false;

-- Add description column for admin context
ALTER TABLE credit_packages ADD COLUMN IF NOT EXISTS description text;

-- Update RLS: drop old owner-only policy, add admin + public read
DROP POLICY IF EXISTS credit_packages_owner_all ON credit_packages;
DROP POLICY IF EXISTS credit_packages_public_select ON credit_packages;

-- Public can read active global packages (widget needs this)
CREATE POLICY credit_packages_public_read ON credit_packages FOR SELECT
  USING (is_global = true AND active = true);

-- Service role handles admin CRUD (API routes use createAdminClient)
-- No user-level insert/update/delete policy needed for global packages
