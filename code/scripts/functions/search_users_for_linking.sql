CREATE OR REPLACE FUNCTION public.search_users_for_linking(
  search_query text,
  excluded_ids uuid[] DEFAULT '{}'
)
RETURNS TABLE (
  id uuid,
  full_name text,
  email text,
  college_code varchar(20),  
  external_institution text,
  other_college_name text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated'
      USING ERRCODE = 'insufficient_privilege';
  END IF;

  search_query := trim(coalesce(search_query, ''));

  -- IF length(search_query) < 2 THEN
  --   RETURN;
  -- END IF;

  RETURN QUERY
  SELECT
    u.id,
    u.full_name,
    u.email,
    u.college_code,
    u.external_institution,
    u.other_college_name
  FROM private.users u
  WHERE (
    u.full_name ILIKE '%' || search_query || '%'
    OR
    u.email ILIKE '%' || search_query || '%'
  )
  AND (
    coalesce(cardinality(excluded_ids), 0) = 0
    OR
    u.id <> ALL(excluded_ids)
  )
  ORDER BY u.full_name
  LIMIT 10;
END;
$function$;

REVOKE EXECUTE ON FUNCTION public.search_users_for_linking(text, uuid[]) FROM anon;
REVOKE EXECUTE ON FUNCTION public.search_users_for_linking(text, uuid[]) FROM public;
GRANT EXECUTE ON FUNCTION public.search_users_for_linking(text, uuid[]) TO authenticated;