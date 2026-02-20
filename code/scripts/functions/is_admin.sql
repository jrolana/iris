CREATE OR REPLACE FUNCTION private.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = private
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM private.users
    WHERE id = auth.uid()
      AND role = 'admin'::private.user_role
  );
$$;