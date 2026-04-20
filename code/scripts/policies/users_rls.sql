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
DROP POLICY IF EXISTS "Users can read self, admins read all"
ON private.users;
CREATE POLICY "Users can read self, admins read all"
ON private.users
FOR SELECT
TO authenticated
USING (
  id = auth.uid()
  OR private.is_admin()
);
