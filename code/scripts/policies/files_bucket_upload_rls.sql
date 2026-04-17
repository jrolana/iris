drop policy if exists "Allow upload to valid app folder" on storage.objects;
create policy "Allow upload to valid app folder"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'ipr_files_bucket' 
  and private.can_access_app_files(split_part(name, '/', 1))
);
