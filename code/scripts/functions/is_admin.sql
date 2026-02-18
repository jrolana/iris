CREATE OR REPLACE FUNCTION private.is_admin()
RETURNS BOOLEAN AS $$
DECLARE
  claims json;
BEGIN
  -- Check JWT claims (for requests via Supabase client)
  claims := current_setting('request.jwt.claims', true)::json;
  IF claims IS NOT NULL AND claims->>'role' = 'admin' THEN
    RETURN TRUE;
  END IF;

  -- Fallback: check users table by auth.uid()
  IF auth.uid() IS NOT NULL THEN
    RETURN EXISTS (
      SELECT 1
      FROM private.users
      WHERE id = auth.uid()
      AND role = 'admin'
    );
  END IF;

  -- Default: not admin
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;
