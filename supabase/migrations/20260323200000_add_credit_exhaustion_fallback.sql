-- Credit Exhaustion Fallback System
-- Adds tables for tickets, contact submissions, credit packages, purchases, and help articles

-- Add credit exhaustion columns to chatbots
ALTER TABLE chatbots ADD COLUMN IF NOT EXISTS credit_exhaustion_mode text NOT NULL DEFAULT 'tickets'
  CHECK (credit_exhaustion_mode IN ('tickets', 'contact_form', 'purchase_credits', 'help_articles'));
ALTER TABLE chatbots ADD COLUMN IF NOT EXISTS credit_exhaustion_config jsonb NOT NULL DEFAULT '{}';

-- Tickets table
CREATE TABLE IF NOT EXISTS tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chatbot_id uuid NOT NULL REFERENCES chatbots(id) ON DELETE CASCADE,
  visitor_name text NOT NULL,
  visitor_email text NOT NULL,
  visitor_phone text,
  subject text,
  message text NOT NULL,
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  reference text NOT NULL,
  custom_fields jsonb DEFAULT '{}',
  admin_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz
);

ALTER TABLE tickets ADD CONSTRAINT tickets_chatbot_reference_unique UNIQUE (chatbot_id, reference);
CREATE INDEX idx_tickets_chatbot_id ON tickets(chatbot_id);
CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_tickets_created_at ON tickets(created_at DESC);

-- Contact form submissions
CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chatbot_id uuid NOT NULL REFERENCES chatbots(id) ON DELETE CASCADE,
  visitor_name text NOT NULL,
  visitor_email text NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_contact_submissions_chatbot_id ON contact_submissions(chatbot_id);
CREATE INDEX idx_contact_submissions_created_at ON contact_submissions(created_at DESC);

-- Ad-hoc credit packages (configured per chatbot)
CREATE TABLE IF NOT EXISTS credit_packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chatbot_id uuid NOT NULL REFERENCES chatbots(id) ON DELETE CASCADE,
  name text NOT NULL,
  credit_amount integer NOT NULL,
  price_cents integer NOT NULL,
  stripe_price_id text NOT NULL,
  active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_credit_packages_chatbot_id ON credit_packages(chatbot_id);

-- Ad-hoc credit purchases
CREATE TABLE IF NOT EXISTS credit_purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chatbot_id uuid NOT NULL REFERENCES chatbots(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  package_id uuid NOT NULL REFERENCES credit_packages(id) ON DELETE CASCADE,
  stripe_session_id text,
  stripe_payment_intent_id text,
  credit_amount integer NOT NULL,
  amount_paid_cents integer NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_credit_purchases_chatbot_id ON credit_purchases(chatbot_id);
CREATE INDEX idx_credit_purchases_stripe_session ON credit_purchases(stripe_session_id);

-- Help articles (pre-generated from knowledge sources)
CREATE TABLE IF NOT EXISTS help_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chatbot_id uuid NOT NULL REFERENCES chatbots(id) ON DELETE CASCADE,
  title text NOT NULL,
  summary text NOT NULL,
  body text NOT NULL,
  source_chunk_ids uuid[] DEFAULT '{}',
  search_vector tsvector,
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_help_articles_chatbot_id ON help_articles(chatbot_id);
CREATE INDEX idx_help_articles_search ON help_articles USING gin(search_vector);

-- Trigger to auto-update search_vector
CREATE OR REPLACE FUNCTION update_help_article_search_vector()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.search_vector := setweight(to_tsvector('english', coalesce(NEW.title, '')), 'A') ||
                        setweight(to_tsvector('english', coalesce(NEW.summary, '')), 'B') ||
                        setweight(to_tsvector('english', coalesce(NEW.body, '')), 'C');
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_help_articles_search_vector
  BEFORE INSERT OR UPDATE OF title, summary, body ON help_articles
  FOR EACH ROW EXECUTE FUNCTION update_help_article_search_vector();

-- Ticket reference sequence per chatbot
CREATE SEQUENCE IF NOT EXISTS ticket_ref_seq START 1;

-- RLS Policies

-- Tickets: chatbot owner can read/write
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY tickets_owner_select ON tickets FOR SELECT
  USING (chatbot_id IN (SELECT id FROM chatbots WHERE user_id = auth.uid()));

CREATE POLICY tickets_owner_insert ON tickets FOR INSERT
  WITH CHECK (true); -- Public insert (from widget), restricted by API rate limiting

CREATE POLICY tickets_owner_update ON tickets FOR UPDATE
  USING (chatbot_id IN (SELECT id FROM chatbots WHERE user_id = auth.uid()));

-- Contact submissions: chatbot owner can read
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY contact_submissions_owner_select ON contact_submissions FOR SELECT
  USING (chatbot_id IN (SELECT id FROM chatbots WHERE user_id = auth.uid()));

CREATE POLICY contact_submissions_insert ON contact_submissions FOR INSERT
  WITH CHECK (true);

CREATE POLICY contact_submissions_owner_update ON contact_submissions FOR UPDATE
  USING (chatbot_id IN (SELECT id FROM chatbots WHERE user_id = auth.uid()));

-- Credit packages: chatbot owner can manage
ALTER TABLE credit_packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY credit_packages_owner_all ON credit_packages FOR ALL
  USING (chatbot_id IN (SELECT id FROM chatbots WHERE user_id = auth.uid()));

CREATE POLICY credit_packages_public_select ON credit_packages FOR SELECT
  USING (active = true);

-- Credit purchases: tied to user_id
ALTER TABLE credit_purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY credit_purchases_user_select ON credit_purchases FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY credit_purchases_insert ON credit_purchases FOR INSERT
  WITH CHECK (true);

-- Help articles: public read, owner manage
ALTER TABLE help_articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY help_articles_public_select ON help_articles FOR SELECT
  USING (published = true);

CREATE POLICY help_articles_owner_all ON help_articles FOR ALL
  USING (chatbot_id IN (SELECT id FROM chatbots WHERE user_id = auth.uid()));

-- Next ticket reference helper (race-safe, unique per chatbot)
CREATE OR REPLACE FUNCTION next_ticket_reference(p_chatbot_id uuid, p_prefix text DEFAULT 'TKT-')
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  v_count integer;
  v_ref text;
BEGIN
  SELECT count(*) + 1 INTO v_count FROM tickets WHERE chatbot_id = p_chatbot_id;
  v_ref := p_prefix || lpad(v_count::text, 4, '0');
  WHILE EXISTS (SELECT 1 FROM tickets WHERE chatbot_id = p_chatbot_id AND reference = v_ref) LOOP
    v_count := v_count + 1;
    v_ref := p_prefix || lpad(v_count::text, 4, '0');
  END LOOP;
  RETURN v_ref;
END;
$$;
