DROP POLICY IF EXISTS "Inventors view their own details" ON private.inventors;

CREATE POLICY "Inventors view their own details"
ON private.inventors
FOR SELECT
TO authenticated
USING (
    techgen_id = auth.uid()
)