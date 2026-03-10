-- Increase documents bucket file size limit to 200MB
UPDATE storage.buckets SET file_size_limit = 209715200 WHERE id = 'documents';
