DROP POLICY IF EXISTS "Admins full access users"
ON private.users;
CREATE POLICY "Admins full access users"
ON private.users
FOR ALL
TO authenticated
USING (
  private.is_admin()
);




DROP POLICY IF EXISTS "Enable read access for all users"
ON private.users;
CREATE POLICY "Enable read access for all users"
ON private.users
FOR SELECT
TO authenticated
USING (
  true
);