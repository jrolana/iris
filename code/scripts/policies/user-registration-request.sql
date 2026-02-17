DROP POLICY IF EXISTS "Admin full access on user registration" ON private.user_registration_requests;

CREATE POLICY "Admin full access on user registration"
ON private.user_registration_requests
FOR ALL
TO authenticated
USING (
    private.is_admin()
);