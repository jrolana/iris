DROP POLICY IF EXISTS "Allow update to valid app folder" ON storage.objects;
CREATE POLICY "Allow update to valid app folder"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'ipr_files_bucket'
  AND auth.uid() = owner
  AND private.can_access_app_files(split_part(name, '/', 1))
)
WITH CHECK (
  bucket_id = 'ipr_files_bucket'
  AND auth.uid() = owner
  AND private.can_access_app_files(split_part(name, '/', 1))
);
