CREATE POLICY "Allow update to valid app folder"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'ipr_files_bucket'
  AND (
    -- Allow if user owns the object OR if it's in a valid app folder
    auth.uid() = owner 
    OR 
    check_app_exists(split_part(name, '/', 1))
  )
);