-- Extraction prompts: targeted questions used to generate focused help articles
CREATE TABLE IF NOT EXISTS article_extraction_prompts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chatbot_id uuid NOT NULL REFERENCES chatbots(id) ON DELETE CASCADE,
  question text NOT NULL,
  enabled boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_article_extraction_prompts_chatbot ON article_extraction_prompts(chatbot_id);

-- RLS
ALTER TABLE article_extraction_prompts ENABLE ROW LEVEL SECURITY;

CREATE POLICY article_extraction_prompts_owner_all ON article_extraction_prompts FOR ALL
  USING (chatbot_id IN (SELECT id FROM chatbots WHERE user_id = auth.uid()));

-- Add article schedule + source tracking columns to help_articles
ALTER TABLE help_articles
  ADD COLUMN IF NOT EXISTS extraction_prompt_id uuid REFERENCES article_extraction_prompts(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS source_url text;

-- Article generation schedule on chatbots
ALTER TABLE chatbots
  ADD COLUMN IF NOT EXISTS article_schedule text CHECK (article_schedule IN ('manual', 'daily', 'weekly', 'monthly')) DEFAULT 'manual',
  ADD COLUMN IF NOT EXISTS article_last_generated_at timestamptz;

-- Seed default extraction prompts for existing chatbots
INSERT INTO article_extraction_prompts (chatbot_id, question, sort_order)
SELECT id, q.question, q.sort_order
FROM chatbots
CROSS JOIN (VALUES
  ('What are your business hours or opening times?', 0),
  ('Where are you located and how can customers find you?', 1),
  ('What contact information is available (phone, email, social)?', 2),
  ('What products or services do you offer?', 3),
  ('What is your pricing or rate structure?', 4),
  ('What is your return, refund, or cancellation policy?', 5),
  ('What shipping or delivery options are available?', 6),
  ('What payment methods do you accept?', 7),
  ('What are the most frequently asked questions?', 8),
  ('What promotions, discounts, or loyalty programs are available?', 9)
) AS q(question, sort_order);
