create or replace function search_users_for_linking(
  search_query text, 
  excluded_ids uuid[]
)
returns setof private.users 
language sql
security definer -- bypass RLS
as $$
  select *
  from private.users
  where (
    full_name ilike '%' || search_query || '%' 
    or 
    email ilike '%' || search_query || '%'
  )
  and (
    -- If the array is empty, this condition is ignored
    cardinality(excluded_ids) = 0 
    or 
    id <> all(excluded_ids)
  )
  limit 10;
$$;