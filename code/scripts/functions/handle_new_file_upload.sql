create or replace function private.handle_new_file_upload()
returns trigger
language plpgsql
security definer
SET search_path = public, private, storage
as $$
declare
  extracted_app_id text;
  extracted_file_name text;
  final_file_type text;
  fetched_owner_name text;
begin
  -- Exit if this is just a folder placeholder
  if NEW.name like '%/' or NEW.metadata->>'mimetype' = 'application/x-directory' then
    return NEW;
  end if;

  -- Extract Data
  extracted_app_id := split_part(NEW.name, '/', 1);
  extracted_file_name := split_part(NEW.name, '/', 2);
  
  -- Safe typing
  final_file_type := coalesce(
    split_part(NEW.metadata->>'mimetype', '/', 2),
    'unknown'
  );

  SELECT full_name 
  INTO fetched_owner_name
  FROM private.users 
  WHERE id = NEW.owner;

  -- fallback if name is null
  IF fetched_owner_name IS NULL THEN
      fetched_owner_name := 'Unknown User';
  END IF;


  
  
  IF (TG_OP = 'INSERT') THEN
    -- Insert into ipr_files ATOMICALLY
    insert into private.ipr_files (
      application_id, 
      owner_id, 
      owner_name,
      storage_path, 
      file_name,
      file_type, 
      uploaded_at,
      modified_at,
      storage_id
    )
    values (
      extracted_app_id::uuid, 
      NEW.owner,
      fetched_owner_name,
      NEW.name, 
      extracted_file_name::text,
      final_file_type,
      now(),
      now(),
      NEW.id
    );

  ELSIF (TG_OP = 'UPDATE') THEN
    -- Update existing record
    -- We find the row by 'storage_id' because that link is permanent
    UPDATE private.ipr_files
    SET
      file_name = extracted_file_name,
      file_type = final_file_type,
      owner_name = fetched_owner_name,
      -- We optionally update 'modified_at' to reflect the modification time
      modified_at = NOW()
    WHERE storage_id = NEW.id;
  END IF;

  return NEW;
end;
$$;