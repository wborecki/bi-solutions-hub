-- Ensure documents bucket exists with proper config (200MB limit)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('documents', 'documents', false, 209715200, NULL)
ON CONFLICT (id) DO UPDATE SET
  file_size_limit = 209715200,
  allowed_mime_types = NULL;
