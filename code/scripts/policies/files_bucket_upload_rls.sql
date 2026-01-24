create policy "Allow upload to valid app folder"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'ipr_files_bucket' 
  and (public.check_app_exists(split_part(name, '/', 1)))
);