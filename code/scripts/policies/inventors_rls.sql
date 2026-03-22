DROP POLICY IF EXISTS "Inventors view their own details" ON private.inventors;

CREATE POLICY "Inventors, Admin view their own details"
ON private.inventors
FOR SELECT
TO authenticated
USING (
    private.is_admin()
    OR
    private.check_inventor_access(application_id)
)

DROP POLICY IF EXISTS "Inventors update others in same app, Admin update everyone" ON private.inventors;

CREATE POLICY "Inventors update others in same app, Admin update everyone"
ON private.inventors
FOR UPDATE
TO authenticated
USING (
    private.is_admin()
    OR
    private.check_inventor_access(application_id)
)

DROP POLICY IF EXISTS "Admin can remove inventors" ON private.inventors;

CREATE POLICY "Admin can remove inventors"
ON private.inventors
FOR DELETE
TO authenticated
USING (
  private.is_admin()
);