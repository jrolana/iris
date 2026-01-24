create or replace function private.can_access_app_files(app_id_text text)
returns boolean
language plpgsql
security definer
as $$
begin
  -- Check if user is Admin 
  if (select private.is_admin()) then 
    return true; 
  end if;

  -- Check if user is the Creator OR an Inventor
  return exists (
    select 1 
    from private.ipr_applications a
    left join private.inventors i on i.application_id = a.id
    where a.id::text = app_id_text
    and (
      a.created_by = auth.uid()         -- The Creator check
      or 
      i.techgen_id = auth.uid()         -- The Inventor check
    )
  );
end;
$$;