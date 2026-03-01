-- SELECT POLICY: Admins see all, Inventors see reports for their shared applications
CREATE POLICY "View reports if admin or involved inventor"
ON private.reports FOR SELECT TO authenticated
USING (
  private.is_admin()
  OR private.check_inventor_access(application_id)
);

-- INSERT POLICY: An inventor can only submit a report if they are actually the reporter
CREATE POLICY "Inventors can insert their own reports"
ON private.reports FOR INSERT TO authenticated
WITH CHECK (
  -- make sure that the person logged in matches the techgen_id of the reporter
  auth.uid() = (SELECT techgen_id FROM private.inventors WHERE id = reporter_id)
  -- make sure that they actually have access to the application
  AND private.check_inventor_access(application_id)
);

-- no update (since it is always one to one) and delete policies