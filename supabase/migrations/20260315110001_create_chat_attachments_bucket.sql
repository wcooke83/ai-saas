-- Create chat-attachments storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'chat-attachments',
  'chat-attachments',
  true,
  26214400, -- 25MB max (highest configurable limit)
  ARRAY[
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'application/pdf',
    'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain', 'text/csv',
    'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/zip'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to chat attachments
DROP POLICY IF EXISTS "Public read access for chat attachments" ON storage.objects;
CREATE POLICY "Public read access for chat attachments"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'chat-attachments');

-- Allow anyone to upload (widget visitors are unauthenticated)
DROP POLICY IF EXISTS "Allow uploads to chat attachments" ON storage.objects;
CREATE POLICY "Allow uploads to chat attachments"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'chat-attachments');
