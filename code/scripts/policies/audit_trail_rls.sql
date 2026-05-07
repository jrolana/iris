ALTER TABLE private.audit_trail ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view audit trail"
ON private.audit_trail;

CREATE POLICY "Admins can view audit trail"
ON private.audit_trail
FOR SELECT
TO authenticated
USING (
  private.is_admin()
);
