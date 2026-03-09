-- UP Official Check function (Cached & Secure)
CREATE OR REPLACE FUNCTION private.is_official()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM private.users
    WHERE id = auth.uid()
    AND role = 'up-official'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;