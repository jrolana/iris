DROP POLICY IF EXISTS "Admins insert notifications" ON private.notifications;

CREATE POLICY "Admins insert notifications"
ON private.notifications FOR INSERT
TO authenticated
WITH CHECK (
    private.is_admin()
);