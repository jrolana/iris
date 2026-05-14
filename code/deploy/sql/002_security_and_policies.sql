GRANT USAGE ON SCHEMA private TO authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA private TO authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA private TO authenticated, service_role;

REVOKE USAGE ON SCHEMA private FROM anon;
REVOKE ALL ON ALL TABLES IN SCHEMA private FROM anon;

DROP POLICY IF EXISTS "Admins full access users" ON private.users;
CREATE POLICY "Admins full access users"
ON private.users
FOR ALL
TO authenticated
USING (private.is_admin())
WITH CHECK (private.is_admin());

DROP POLICY IF EXISTS "Users can read self, admins read all" ON private.users;
CREATE POLICY "Users can read self, admins read all"
ON private.users
FOR SELECT
TO authenticated
USING (id = auth.uid() OR private.is_admin());

DROP POLICY IF EXISTS "Admin select access on user registration" ON private.user_registration_requests;
CREATE POLICY "Admin select access on user registration"
ON private.user_registration_requests
FOR SELECT
TO authenticated
USING (private.is_admin());

DROP POLICY IF EXISTS "Admin insert access on user registration" ON private.user_registration_requests;
CREATE POLICY "Admin insert access on user registration"
ON private.user_registration_requests
FOR INSERT
TO authenticated
WITH CHECK (private.is_admin());

DROP POLICY IF EXISTS "Admin update access on user registration" ON private.user_registration_requests;
CREATE POLICY "Admin update access on user registration"
ON private.user_registration_requests
FOR UPDATE
TO authenticated
USING (private.is_admin())
WITH CHECK (private.is_admin());

DROP POLICY IF EXISTS "Admin delete access on user registration" ON private.user_registration_requests;
CREATE POLICY "Admin delete access on user registration"
ON private.user_registration_requests
FOR DELETE
TO authenticated
USING (private.is_admin());

DROP POLICY IF EXISTS "Admins see all, Inventors see their own" ON private.ipr_applications;
CREATE POLICY "Admins see all, Inventors see their own"
ON private.ipr_applications
FOR SELECT
TO public
USING (
  private.is_admin()
  OR private.is_official()
  OR created_by = auth.uid()
  OR private.check_inventor_access(id)
  OR (
    auth.role() = 'anon'
    AND private.is_published_status(curr_status)
  )
);

DROP POLICY IF EXISTS "Users can insert their own applications" ON private.ipr_applications;
CREATE POLICY "Users can insert their own applications"
ON private.ipr_applications
FOR INSERT
TO authenticated
WITH CHECK (created_by = auth.uid());

DROP POLICY IF EXISTS "Admins and Owners can update" ON private.ipr_applications;
CREATE POLICY "Admins and Owners can update"
ON private.ipr_applications
FOR UPDATE
TO authenticated
USING (
  private.is_admin()
  OR created_by = auth.uid()
  OR private.check_inventor_access(id)
)
WITH CHECK (
  private.is_admin()
  OR created_by = auth.uid()
  OR private.check_inventor_access(id)
);

DROP POLICY IF EXISTS "Admins and Creators can delete" ON private.ipr_applications;
CREATE POLICY "Admins and Creators can delete"
ON private.ipr_applications
FOR DELETE
TO authenticated
USING (private.is_admin() OR created_by = auth.uid());

DROP POLICY IF EXISTS "Inventors, Admin view their own details" ON private.inventors;
CREATE POLICY "Inventors, Admin view their own details"
ON private.inventors
FOR SELECT
TO authenticated
USING (
  private.is_admin()
  OR private.check_inventor_access(application_id)
);

DROP POLICY IF EXISTS "Inventors update others in same app, Admin update everyone" ON private.inventors;
CREATE POLICY "Inventors update others in same app, Admin update everyone"
ON private.inventors
FOR UPDATE
TO authenticated
USING (
  private.is_admin()
  OR private.check_inventor_access(application_id)
)
WITH CHECK (
  private.is_admin()
  OR private.check_inventor_access(application_id)
);

DROP POLICY IF EXISTS "Inventors on the same app and admin can add collaborators" ON private.inventors;
CREATE POLICY "Inventors on the same app and admin can add collaborators"
ON private.inventors
FOR INSERT
TO authenticated
WITH CHECK (
  private.is_admin()
  OR private.check_inventor_access(application_id)
);

DROP POLICY IF EXISTS "Admin can remove inventors" ON private.inventors;
CREATE POLICY "Admin can remove inventors"
ON private.inventors
FOR DELETE
TO authenticated
USING (private.is_admin());

DROP POLICY IF EXISTS "Trigger-only or admin inserts on statuses" ON private.ipr_statuses;
CREATE POLICY "Trigger-only or admin inserts on statuses"
ON private.ipr_statuses
FOR INSERT
TO authenticated
WITH CHECK (
  pg_trigger_depth() > 0
  OR private.is_admin()
);

DROP POLICY IF EXISTS "Admins update statuses" ON private.ipr_statuses;
CREATE POLICY "Admins update statuses"
ON private.ipr_statuses
FOR UPDATE
TO authenticated
USING (private.is_admin())
WITH CHECK (private.is_admin());

DROP POLICY IF EXISTS "Admins see all, Inventors see their own statuses" ON private.ipr_statuses;
CREATE POLICY "Admins see all, Inventors see their own statuses"
ON private.ipr_statuses
FOR SELECT
TO authenticated
USING (
  private.is_admin()
  OR private.check_inventor_access(application_id)
);

DROP POLICY IF EXISTS "Users can delete their own files" ON private.ipr_files;
CREATE POLICY "Users can delete their own files"
ON private.ipr_files
FOR DELETE
TO authenticated
USING (owner_id = auth.uid());

DROP POLICY IF EXISTS "View files if admin or inventor" ON private.ipr_files;
CREATE POLICY "View files if admin or inventor"
ON private.ipr_files
FOR SELECT
TO authenticated
USING (
  private.is_admin()
  OR private.check_inventor_access(application_id)
);

DROP POLICY IF EXISTS "Users can upload files to their applications" ON private.ipr_files;
CREATE POLICY "Users can upload files to their applications"
ON private.ipr_files
FOR INSERT
TO authenticated
WITH CHECK (
  owner_id = auth.uid()
  AND private.check_inventor_access(application_id)
);

DROP POLICY IF EXISTS "Users can update their own file details" ON private.ipr_files;
CREATE POLICY "Users can update their own file details"
ON private.ipr_files
FOR UPDATE
TO authenticated
USING (owner_id = auth.uid())
WITH CHECK (owner_id = auth.uid());

DROP POLICY IF EXISTS "Admins can upload files" ON private.ipr_files;
CREATE POLICY "Admins can upload files"
ON private.ipr_files
FOR INSERT
TO authenticated
WITH CHECK (private.is_admin());

DROP POLICY IF EXISTS "Admins insert notifications" ON private.notifications;
CREATE POLICY "Admins insert notifications"
ON private.notifications
FOR INSERT
TO authenticated
WITH CHECK (private.is_admin());

DROP POLICY IF EXISTS "Receivers see notifications" ON private.notifications;
CREATE POLICY "Receivers see notifications"
ON private.notifications
FOR SELECT
TO authenticated
USING (receiver_id = auth.uid());

DROP POLICY IF EXISTS "Receivers update notifications" ON private.notifications;
CREATE POLICY "Receivers update notifications"
ON private.notifications
FOR UPDATE
TO authenticated
USING (receiver_id = auth.uid())
WITH CHECK (receiver_id = auth.uid());

DROP POLICY IF EXISTS "Admins can view tokens" ON private.api_tokens;
CREATE POLICY "Admins can view tokens"
ON private.api_tokens
FOR SELECT
TO authenticated
USING (private.is_admin());

DROP POLICY IF EXISTS "Enable insert for admin only" ON private.api_tokens;
CREATE POLICY "Enable insert for admin only"
ON private.api_tokens
FOR INSERT
TO authenticated
WITH CHECK (private.is_admin());

DROP POLICY IF EXISTS "Admins can view audit trail" ON private.audit_trail;
CREATE POLICY "Admins can view audit trail"
ON private.audit_trail
FOR SELECT
TO authenticated
USING (private.is_admin());

DROP POLICY IF EXISTS "View reports if admin or involved inventor" ON private.reports;
CREATE POLICY "View reports if admin or involved inventor"
ON private.reports
FOR SELECT
TO authenticated
USING (
  private.is_admin()
  OR private.check_inventor_access(application_id)
);

DROP POLICY IF EXISTS "Inventors can insert their own reports" ON private.reports;
CREATE POLICY "Inventors can insert their own reports"
ON private.reports
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = (
    SELECT inventors.techgen_id
    FROM private.inventors
    WHERE inventors.id = reports.reporter_id
  )
  AND private.check_inventor_access(application_id)
);

DROP POLICY IF EXISTS "Admin can update reports" ON private.reports;
CREATE POLICY "Admin can update reports"
ON private.reports
FOR UPDATE
TO authenticated
USING (private.is_admin())
WITH CHECK (private.is_admin());

DROP POLICY IF EXISTS "Admin update access" ON private.pings;
CREATE POLICY "Admin update access"
ON private.pings
FOR UPDATE
TO authenticated
USING (private.is_admin())
WITH CHECK (private.is_admin());

DROP POLICY IF EXISTS "Admin, Inventor select access" ON private.pings;
CREATE POLICY "Admin, Inventor select access"
ON private.pings
FOR SELECT
TO authenticated
USING (
  private.is_admin()
  OR private.check_inventor_access(application_id)
);

DROP POLICY IF EXISTS "Inventor insert access" ON private.pings;
CREATE POLICY "Inventor insert access"
ON private.pings
FOR INSERT
TO authenticated
WITH CHECK (private.check_inventor_access(application_id));

DROP POLICY IF EXISTS "Allow authorized users to view files" ON storage.objects;
CREATE POLICY "Allow authorized users to view files"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'ipr_files_bucket'
  AND private.can_access_app_files(split_part(name, '/', 1))
);

DROP POLICY IF EXISTS "All can see public resource files" ON storage.objects;
CREATE POLICY "All can see public resource files"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'ipr_public_resources_bucket');

DROP POLICY IF EXISTS "Allow upload to valid app folder" ON storage.objects;
CREATE POLICY "Allow upload to valid app folder"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'ipr_files_bucket'
  AND private.can_access_app_files(split_part(name, '/', 1))
);

DROP POLICY IF EXISTS "Allow update to valid app folder" ON storage.objects;
CREATE POLICY "Allow update to valid app folder"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'ipr_files_bucket'
  AND auth.uid() = owner
  AND private.can_access_app_files(split_part(name, '/', 1))
)
WITH CHECK (
  bucket_id = 'ipr_files_bucket'
  AND auth.uid() = owner
  AND private.can_access_app_files(split_part(name, '/', 1))
);

DROP POLICY IF EXISTS "Allow users to delete their own files" ON storage.objects;
CREATE POLICY "Allow users to delete their own files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'ipr_files_bucket'
  AND auth.uid() = owner
  AND private.can_access_app_files(split_part(name, '/', 1))
);

DROP POLICY IF EXISTS "Admins upload public resources" ON storage.objects;
CREATE POLICY "Admins upload public resources"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'ipr_public_resources_bucket'
  AND private.is_admin()
);

DROP POLICY IF EXISTS "Admins update public resources" ON storage.objects;
CREATE POLICY "Admins update public resources"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'ipr_public_resources_bucket'
  AND private.is_admin()
)
WITH CHECK (
  bucket_id = 'ipr_public_resources_bucket'
  AND private.is_admin()
);

DROP POLICY IF EXISTS "Admins delete public resources" ON storage.objects;
CREATE POLICY "Admins delete public resources"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'ipr_public_resources_bucket'
  AND private.is_admin()
);
