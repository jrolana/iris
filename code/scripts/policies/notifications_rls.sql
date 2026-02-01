DROP POLICY IF EXISTS "Admins insert notifications" ON private.notifications;

CREATE POLICY "Admins insert notifications"
ON private.notifications FOR INSERT
TO authenticated
WITH CHECK (
    private.is_admin()
);

DROP POLICY IF EXISTS "Receivers see notifications" ON private.notifications;

CREATE POLICY "Receivers see notifications"
ON private.notifications FOR SELECT
TO authenticated
USING (
    receiver_id = auth.uid()
)