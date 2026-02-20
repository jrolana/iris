DROP POLICY IF EXISTS "Admins full access users"
ON private.users;
CREATE POLICY "Admins full access users"
ON private.users
FOR ALL
TO authenticated
USING (
  private.is_admin()
);