DROP TRIGGER IF EXISTS on_file_upload ON storage.objects;
create trigger on_file_upload
after insert OR update on storage.objects
for each row
execute function private.handle_new_file_upload();