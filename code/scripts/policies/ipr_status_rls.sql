DROP POLICY IF EXISTS "Trigger-only or admin inserts on statuses" ON private.ipr_statuses;
DROP POLICY IF EXISTS "Admins update statuses" ON private.ipr_statuses;
DROP POLICY IF EXISTS "Admins see all, Inventors see their own statuses" ON private.ipr_statuses;

CREATE POLICY "Trigger-only or admin inserts on statuses"
ON private.ipr_statuses
FOR INSERT
TO authenticated
WITH CHECK (
    pg_trigger_depth() > 0      -- only allow inserts coming from a trigger
    OR private.is_admin()       -- optionally allow admins to insert manually
);

CREATE POLICY "Admins update statuses"
ON private.ipr_statuses FOR UPDATE
TO authenticated
USING (
  private.is_admin()
);

CREATE POLICY "Admins see all, Inventors see their own statuses"
ON private.ipr_statuses
FOR SELECT
TO authenticated
USING (
  private.is_admin()
  OR (auth.uid() IN ( 
    SELECT inventor.techgen_id 
    FROM private.inventors inventor
    JOIN private.ipr_applications app ON inventor.application_id = app.id OR inventor.application_id = app.parent_application_id
    WHERE app.id = ipr_statuses.application_id
  ))
)