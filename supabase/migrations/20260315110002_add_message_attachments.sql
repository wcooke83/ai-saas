-- Add attachments column to messages table
ALTER TABLE messages
ADD COLUMN IF NOT EXISTS attachments jsonb DEFAULT NULL;

-- attachments schema: array of { url, file_name, file_type, file_size }
COMMENT ON COLUMN messages.attachments IS 'Array of attachment objects: [{url, file_name, file_type, file_size}]';
