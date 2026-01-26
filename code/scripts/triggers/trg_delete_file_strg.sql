CREATE TRIGGER on_file_delete
AFTER DELETE ON private.ipr_files
FOR EACH ROW
EXECUTE FUNCTION private.remove_file_from_storage();