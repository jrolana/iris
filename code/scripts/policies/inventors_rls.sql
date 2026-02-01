CREATE POLICY "Inventors view their own details"
ON private.inventors
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM private.inventors AS inv
        WHERE inv.techgen_id = auth.uid()
    )
)