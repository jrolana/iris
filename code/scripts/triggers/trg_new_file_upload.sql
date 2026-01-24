create trigger on_file_upload
after insert on storage.objects
for each row
execute function private.handle_new_file_upload();