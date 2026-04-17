
CREATE POLICY "Allow users to delete their own files"
ON storage.objects
FOR DELETE
TO authenticated
using (
  bucket_id = 'ipr_files_bucket'
  AND auth.uid() = owner
  AND private.can_access_app_files(split_part(name, '/', 1))
);
