CREATE OR REPLACE FUNCTION private.is_admin()
RETURNS BOOLEAN AS $$
DECLARE
  claims json;
BEGIN
  -- check users table by auth.uid()
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
