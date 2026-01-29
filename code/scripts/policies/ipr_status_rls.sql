DROP POLICY IF EXISTS "Trigger-only or admin inserts on statuses" ON private.ipr_statuses;
DROP POLICY IF EXISTS "Admins can update statuses" ON private.ipr_statuses;

CREATE POLICY "Trigger-only or admin inserts on statuses"
ON private.ipr_statuses
FOR INSERT
WITH CHECK (
    pg_trigger_depth() > 0      -- only allow inserts coming from a trigger
    OR private.is_admin()       -- optionally allow admins to insert manually
);

CREATE POLICY "Admins can update statuses"
ON private.ipr_statuses FOR UPDATE
USING (
  private.is_admin()
);