CREATE POLICY "Admins can view tokens"
ON "private"."api_tokens"
FOR SELECT
TO authenticated
USING (
  private.is_admin()
);

CREATE POLICY "Enable insert for admin only"
ON "private"."api_tokens"
FOR INSERT
TO authenticated
WITH CHECK (
  private.is_admin()
);