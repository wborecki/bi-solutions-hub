-- Remove file size limit from documents bucket (use global Supabase limit)
UPDATE storage.buckets SET file_size_limit = NULL WHERE id = 'documents';

-- If bucket doesn't exist for some reason, create it
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('documents', 'documents', false, NULL)
ON CONFLICT (id) DO NOTHING;
