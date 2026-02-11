DROP POLICY IF EXISTS "Inventors view their own details" ON private.inventors;

CREATE POLICY "Inventors, Admin view their own details"
ON private.inventors
FOR SELECT
TO authenticated
USING (
    private.is_admin()
    OR
    techgen_id = auth.uid()
)