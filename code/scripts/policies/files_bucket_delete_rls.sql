
CREATE POLICY "Allow users to delete their own files"
ON storage.objects
FOR DELETE
TO authenticated
using (
  bucket_id = 'ipr_files_bucket'
  AND (
    -- Allow if user owns the object AND if it's in a valid app folder
    auth.uid() = owner 
    AND 
    check_app_exists(split_part(name, '/', 1))
  )
);