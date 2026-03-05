CREATE OR REPLACE FUNCTION private.is_published_status(p_status_id UUID) 
RETURNS BOOLEAN
LANGUAGE sql SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM private.ipr_statuses 
    WHERE id = p_status_id AND status_type = 'published' 
  );
$$;