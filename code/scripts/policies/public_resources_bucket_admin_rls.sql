DROP POLICY IF EXISTS "Admins upload public resources"
ON storage.objects;
CREATE POLICY "Admins upload public resources"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'ipr_public_resources_bucket'
  AND private.is_admin()
);

DROP POLICY IF EXISTS "Admins update public resources"
ON storage.objects;
CREATE POLICY "Admins update public resources"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'ipr_public_resources_bucket'
  AND private.is_admin()
)
WITH CHECK (
  bucket_id = 'ipr_public_resources_bucket'
  AND private.is_admin()
);

DROP POLICY IF EXISTS "Admins delete public resources"
ON storage.objects;
CREATE POLICY "Admins delete public resources"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'ipr_public_resources_bucket'
  AND private.is_admin()
);
