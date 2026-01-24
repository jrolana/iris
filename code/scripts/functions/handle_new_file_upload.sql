create or replace function private.handle_new_file_upload()
returns trigger
language plpgsql
security definer
SET search_path = public, private, storage
as $$
declare
  extracted_app_id text;
  custom_desc text;
  custom_comments text;
  final_file_name text;
  final_file_type text;
begin
  -- Exit if this is just a folder placeholder
  if NEW.name like '%/' or NEW.metadata->>'mimetype' = 'application/x-directory' then
    return NEW;
  end if;

  -- Extract Data
  extracted_app_id := split_part(NEW.name, '/', 1);
  
  -- Extract custom metadata (sent from client)
  custom_desc := NEW.metadata->>'description'; 
  custom_comments := NEW.metadata->>'comments';
  final_file_name := COALESCE(NEW.metadata->>'original_name', NEW.name);
  final_file_type := COALESCE(
      NEW.metadata->>'file_type', 
      split_part(NEW.metadata->>'mimetype', '/', 2),
      'unknown'
  );

  IF (TG_OP = 'INSERT') THEN
    -- Insert into ipr_files ATOMICALLY
    insert into private.ipr_files (
      application_id, 
      owner_id, 
      storage_path, 
      file_name,
      file_type, 
      uploaded_at,
      file_description, -- <--- populated right away based from metadata
      comments,
      storage_id
    )
    values (
      extracted_app_id::uuid, 
      NEW.owner,
      NEW.name, 
      final_file_name,
      final_file_type, 
      now(),
      custom_desc,
      custom_comments,
      NEW.id
    );

  ELSIF (TG_OP = 'UPDATE') THEN
    -- Update existing record
    -- We find the row by 'storage_id' because that link is permanent
    UPDATE private.ipr_files
    SET
      file_name = final_file_name,
      file_type = final_file_type,
      file_description = custom_desc,
      comments = custom_comments,
      -- We optionally update 'uploaded_at' to reflect the modification time
      uploaded_at = NOW()
    WHERE storage_id = NEW.id;
  END IF;

  return NEW;
end;
$$;