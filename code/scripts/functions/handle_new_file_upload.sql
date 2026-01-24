create or replace function private.handle_new_file_upload()
returns trigger
language plpgsql
security definer
as $$
declare
  extracted_app_id text;
begin
  extracted_app_id := split_part(NEW.name, '/', 1);

  insert into private.ipr_files (
    application_id, 
    owner_id, 
    storage_path, 
    file_name,
    storage_id 
  )
  values (
    extracted_app_id, 
    NEW.owner, 
    NEW.name, 
    NEW.metadata->>'mimetype',
    NEW.id 
  );

  return NEW;
end;
$$;