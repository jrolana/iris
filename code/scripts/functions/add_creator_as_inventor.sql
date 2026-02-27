create or replace function private.add_creator_as_inventor()
returns trigger as $$
declare
  current_user_id uuid;
  user_info record;
begin
  -- Get the current user's ID from Supabase Auth context
  current_user_id := auth.uid();

  -- Safety check: ensure a user is actually logged in
  if current_user_id is null then
    return new;
  end if;

  -- Check if admin, skip if so
  if private.is_admin() then
    return new; -- Exit without doing anything
  end if;

  -- Copy fields from the users table to the inventors table
  select full_name, email, college_code, other_college_name, external_institution
  into user_info
  from private.users
  where id = current_user_id;

  -- Insert the new inventor record
  insert into private.inventors (
    application_id,
    techgen_id,
    full_name,
    email,
    college_code,
    other_college_name,
    external_institution
  ) values (
    new.id, -- Application ID from the newly created application
    current_user_id,
    user_info.full_name,
    user_info.email,
    user_info.college_code,
    user_info.other_college_name,
    user_info.external_institution
  );

  return new;
end;
$$ language plpgsql security definer;