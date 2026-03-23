create policy "Allow authorized users to view files"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'ipr_files_bucket' 
  and 
  -- Extract the App ID from the folder path and check permissions
  private.can_access_app_files(split_part(name, '/', 1))
);

CREATE POLICY "All can see public resource fiiles"
ON storage.objects
FOR SELECT
TO public
USING (
  bucket_id = 'ipr_public_resources_bucket'
);