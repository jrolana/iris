CREATE POLICY "Admins full access users"
ON private.users
FOR ALL -- all CRUD operations 
TO authenticated -- for logged in users
USING (
    -- if ff is not true, then the policy is not applied
    EXISTS (
        SELECT 1
        FROM private.users
        WHERE id = auth.uid()
        AND role = 'admin'::private.user_role
    )
)