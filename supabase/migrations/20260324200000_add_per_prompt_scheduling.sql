-- Per-prompt scheduling: allow each extraction prompt to have its own regeneration schedule
ALTER TABLE article_extraction_prompts
  ADD COLUMN IF NOT EXISTS schedule text NOT NULL DEFAULT 'inherit'
    CHECK (schedule IN ('inherit', 'manual', 'daily', 'weekly', 'monthly')),
  ADD COLUMN IF NOT EXISTS last_generated_at timestamptz;

-- Store source URLs for scheduled re-scraping
ALTER TABLE chatbots
  ADD COLUMN IF NOT EXISTS article_source_urls text[] DEFAULT '{}';
