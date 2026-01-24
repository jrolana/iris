create or replace function public.check_app_exists(app_id_text text)
returns boolean
language plpgsql
security definer 
as $$
begin
  return exists (
    select 1 
    from private.ipr_applications 
    where id::text = app_id_text
  );
end;
$$;