DROP POLICY IF EXISTS "Admin update access" ON private.pings;

CREATE POLICY "Admin update access"
ON private.pings
FOR UPDATE
TO authenticated
USING (
    private.is_admin()
);

DROP POLICY IF EXISTS "Admin, Inventor select access" ON private.pings;

CREATE POLICY "Admin, Inventor select access"
ON private.pings
FOR SELECT
TO authenticated
USING (
    private.is_admin()
    OR private.check_inventor_access(private.pings.application_id)
);

DROP POLICY IF EXISTS "Inventor insert access" ON private.pings;

CREATE POLICY "Inventor insert access"
ON private.pings
FOR INSERT
TO authenticated
WITH CHECK (
    private.check_inventor_access(private.pings.application_id)
);