DROP TRIGGER IF EXISTS on_file_upload ON storage.objects;

CREATE TRIGGER on_file_upload
AFTER INSERT OR UPDATE ON storage.objects
FOR EACH ROW
WHEN (NEW.bucket_id = 'ipr_files_bucket')
EXECUTE FUNCTION private.handle_new_file_upload();