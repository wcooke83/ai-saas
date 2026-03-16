-- Add file_upload_config column to chatbots table
ALTER TABLE chatbots
ADD COLUMN IF NOT EXISTS file_upload_config jsonb NOT NULL DEFAULT '{
  "enabled": false,
  "allowed_types": {
    "images": true,
    "documents": true,
    "spreadsheets": false,
    "archives": false
  },
  "max_file_size_mb": 10
}'::jsonb;
