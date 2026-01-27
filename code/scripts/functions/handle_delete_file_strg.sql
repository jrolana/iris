CREATE OR REPLACE FUNCTION private.remove_file_from_storage()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, storage -- Allows access to storage.objects
AS $$
BEGIN
  -- Attempt to delete the file from storage.objects.
  -- Supabase background workers will detect this deletion 
  -- and clean up the actual binary file from the disk/bucket.
  DELETE FROM storage.objects WHERE id = OLD.storage_id;
  
  RETURN OLD;
END;
$$;