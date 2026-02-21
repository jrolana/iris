CREATE POLICY "Admin select access on user registration"
ON private.user_registration_requests
FOR SELECT
TO authenticated
USING (private.is_admin());

CREATE POLICY "Admin insert access on user registration"
ON private.user_registration_requests
FOR INSERT
TO authenticated
WITH CHECK (private.is_admin());

CREATE POLICY "Admin update access on user registration"
ON private.user_registration_requests
FOR UPDATE
TO authenticated
USING (private.is_admin())
WITH CHECK (private.is_admin());

CREATE POLICY "Admin delete access on user registration"
ON private.user_registration_requests
FOR DELETE
TO authenticated
USING (private.is_admin());
